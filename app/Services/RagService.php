<?php

namespace App\Services;

use App\Models\RagDocument;
use App\Models\RagDocumentChunk;
use App\Models\AiSetting;
use App\Models\Post;
use App\Models\Teacher;
use App\Models\Extracurricular;
use App\Models\Faq;
use App\Models\Program;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class RagService
{
    protected OpenAIService $openAI;
    protected EmbeddingService $embeddingService;
    protected int $chunkSize = 512; // tokens per chunk
    protected int $chunkOverlap = 50; // overlap tokens
    protected bool $pgvectorAvailable;

    public function __construct(
        OpenAIService $openAI,
        EmbeddingService $embeddingService
    ) {
        $this->openAI = $openAI;
        $this->embeddingService = $embeddingService;
        $this->pgvectorAvailable = $this->checkPgvectorAvailability();
    }

    /**
     * Check if pgvector extension is available
     */
    protected function checkPgvectorAvailability(): bool
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return false;
        }

        try {
            $result = DB::select("SELECT COUNT(*) as count FROM pg_extension WHERE extname = 'vector'");
            return ($result[0]->count ?? 0) > 0;
        } catch (\Exception $e) {
            Log::warning('Could not check pgvector availability', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Retrieve relevant documents for a query (from RAG documents using pgvector)
     */
    public function retrieveRelevantChunks(string $query, int $topK = null): array
    {
        $topK = $topK ?? AiSetting::get('rag_top_k', 5);

        try {
            // Check if embedding service is available
            if (!$this->embeddingService->isAvailable()) {
                Log::info('Embedding service unavailable, skipping vector search');
                return [];
            }

            // 1. Generate embedding for query
            $queryEmbeddingResult = $this->embeddingService->createEmbedding($query);

            if (!$queryEmbeddingResult['success']) {
                Log::error('Query embedding failed', ['query' => $query]);
                return [];
            }

            $queryEmbedding = $queryEmbeddingResult['embedding'];

            // 2. Search based on pgvector availability
            if ($this->pgvectorAvailable) {
                return $this->searchWithPgvector($queryEmbedding, $topK);
            } else {
                return $this->searchWithFallback($queryEmbedding, $topK);
            }
        } catch (\Exception $e) {
            Log::error('Failed to retrieve relevant chunks', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Search using pgvector extension
     */
    protected function searchWithPgvector(array $queryEmbedding, int $topK): array
    {
        $embeddingStr = '[' . implode(',', $queryEmbedding) . ']';

        $results = DB::select(
            "SELECT 
                rdc.id,
                rdc.content,
                rdc.document_id,
                rdc.token_count,
                rd.title as document_title,
                rd.category,
                1 - (rdc.embedding <=> ?::vector) as similarity
             FROM rag_document_chunks rdc
             JOIN rag_documents rd ON rd.id = rdc.document_id
             WHERE rd.is_active = true
               AND (rdc.embedding <=> ?::vector) < 0.5
             ORDER BY rdc.embedding <=> ?::vector
             LIMIT ?",
            [$embeddingStr, $embeddingStr, $embeddingStr, $topK]
        );

        $chunksWithSimilarity = [];
        foreach ($results as $result) {
            if ($result->similarity < 0.5) continue;

            $chunksWithSimilarity[] = [
                'id' => $result->id,
                'content' => $result->content,
                'document_id' => $result->document_id,
                'document_title' => $result->document_title ?? 'Unknown',
                'category' => $result->category ?? 'Umum',
                'source' => 'rag_document',
                'similarity' => $result->similarity,
                'token_count' => $result->token_count ?? 0,
            ];
        }

        return $chunksWithSimilarity;
    }

    /**
     * Search using fallback method (manual cosine similarity calculation)
     */
    protected function searchWithFallback(array $queryEmbedding, int $topK): array
    {
        // Get all active chunks
        $chunks = DB::table('rag_document_chunks')
            ->join('rag_documents', 'rag_documents.id', '=', 'rag_document_chunks.document_id')
            ->where('rag_documents.is_active', true)
            ->select(
                'rag_document_chunks.id',
                'rag_document_chunks.content',
                'rag_document_chunks.document_id',
                'rag_document_chunks.token_count',
                'rag_document_chunks.embedding',
                'rag_documents.title as document_title',
                'rag_documents.category'
            )
            ->get();

        $results = [];
        foreach ($chunks as $chunk) {
            if (empty($chunk->embedding)) continue;

            $chunkEmbedding = json_decode($chunk->embedding, true);
            if (!$chunkEmbedding) continue;

            $similarity = $this->cosineSimilarity($queryEmbedding, $chunkEmbedding);

            if ($similarity >= 0.5) {
                $results[] = [
                    'id' => $chunk->id,
                    'content' => $chunk->content,
                    'document_id' => $chunk->document_id,
                    'document_title' => $chunk->document_title ?? 'Unknown',
                    'category' => $chunk->category ?? 'Umum',
                    'source' => 'rag_document',
                    'similarity' => $similarity,
                    'token_count' => $chunk->token_count ?? 0,
                ];
            }
        }

        // Sort by similarity descending and limit
        usort($results, fn($a, $b) => $b['similarity'] <=> $a['similarity']);
        return array_slice($results, 0, $topK);
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    protected function cosineSimilarity(array $vec1, array $vec2): float
    {
        if (count($vec1) !== count($vec2)) {
            return 0.0;
        }

        $dotProduct = 0;
        $magnitude1 = 0;
        $magnitude2 = 0;

        for ($i = 0; $i < count($vec1); $i++) {
            $dotProduct += $vec1[$i] * $vec2[$i];
            $magnitude1 += $vec1[$i] * $vec1[$i];
            $magnitude2 += $vec2[$i] * $vec2[$i];
        }

        $magnitude1 = sqrt($magnitude1);
        $magnitude2 = sqrt($magnitude2);

        if ($magnitude1 == 0 || $magnitude2 == 0) {
            return 0.0;
        }

        return $dotProduct / ($magnitude1 * $magnitude2);
    }

    /**
     * Search database for relevant content
     * Sources: Site Settings, Posts, Programs (including Program Studi), FAQs, Extracurriculars, Teachers
     */
    protected function searchDatabaseContent(string $query, int $limit = 5): array
    {
        $queryLower = strtolower($query);
        $results = [];

        try {
            // 1. Search Site Settings (Profil, Kontak, Sejarah Sekolah)
            $siteSettings = SiteSetting::getCachedAll();
            
            // Check if query is about school profile/contact/general info
            $schoolKeywords = [
                'sejarah', 'profil', 'alamat', 'kontak', 'telepon', 'email', 'lokasi', 'maps', 
                'dimana', 'hubungi', 'social', 'instagram', 'facebook', 'youtube', 'twitter',
                'nomor', 'phone', 'telp', 'contact', 'tentang sekolah', 'info sekolah',
                'visi', 'misi', 'deskripsi', 'gambaran'
            ];
            $isSchoolInfoQuery = false;
            foreach ($schoolKeywords as $keyword) {
                if (strpos($queryLower, $keyword) !== false) {
                    $isSchoolInfoQuery = true;
                    break;
                }
            }

            if ($isSchoolInfoQuery && isset($siteSettings['general'])) {
                $general = $siteSettings['general'];
                $content = "Nama Sekolah: {$general['site_name']}\n";
                $content .= "Alamat: {$general['address']}\n";
                $content .= "Telepon: {$general['phone']}\n";
                $content .= "Email: {$general['email']}\n";
                
                if (isset($siteSettings['social_media'])) {
                    $social = $siteSettings['social_media'];
                    $content .= "\nMedia Sosial:\n";
                    $content .= "- Instagram: {$social['instagram']}\n";
                    $content .= "- Facebook: {$social['facebook']}\n";
                    $content .= "- YouTube: {$social['youtube']}\n";
                }

                if (isset($siteSettings['footer']['footer_description'])) {
                    $content .= "\nProfil Sekolah:\n{$siteSettings['footer']['footer_description']}";
                }

                $results[] = [
                    'id' => 'site_general',
                    'content' => $content,
                    'title' => 'Informasi Sekolah',
                    'category' => 'Profil Sekolah',
                    'source' => 'database',
                    'table' => 'site_settings',
                    'type' => 'Informasi Umum',
                    'similarity' => 0.9, // High relevance for school info queries
                ];
            }

            // 2. Search Posts (Berita & Pengumuman)
            $posts = Post::where('status', 'published')
                ->where(function ($q) use ($queryLower) {
                    $q->where('title', 'like', "%{$queryLower}%")
                      ->orWhere('content', 'like', "%{$queryLower}%")
                      ->orWhere('excerpt', 'like', "%{$queryLower}%");
                })
                ->limit(2)
                ->get();

            foreach ($posts as $post) {
                $results[] = [
                    'id' => $post->id,
                    'content' => trim($post->excerpt . "\n\n" . substr(strip_tags($post->content), 0, 1000)),
                    'title' => $post->title,
                    'category' => $post->category,
                    'source' => 'database',
                    'table' => 'posts',
                    'type' => 'Berita',
                    'similarity' => $this->calculateKeywordMatch($queryLower, $post->title . ' ' . $post->excerpt),
                ];
            }

            // 3. Search FAQs
            $faqs = Faq::where('is_published', true)
                ->where(function ($q) use ($queryLower) {
                    $q->where('question', 'like', "%{$queryLower}%")
                      ->orWhere('answer', 'like', "%{$queryLower}%");
                })
                ->limit(2)
                ->get();

            foreach ($faqs as $faq) {
                $results[] = [
                    'id' => $faq->id,
                    'content' => $faq->answer,
                    'title' => $faq->question,
                    'category' => 'FAQ',
                    'source' => 'database',
                    'table' => 'faqs',
                    'type' => 'FAQ',
                    'similarity' => $this->calculateKeywordMatch($queryLower, $faq->question . ' ' . $faq->answer),
                ];
            }

            // 3. Search Programs (INCLUDING Program Studi/Peminatan: MIPA, IPS, Bahasa)
            $programs = Program::where(function ($q) use ($queryLower) {
                    $q->where('title', 'like', "%{$queryLower}%")
                      ->orWhere('description', 'like', "%{$queryLower}%")
                      ->orWhere('category', 'like', "%{$queryLower}%");
                })
                ->limit(3)
                ->get();

            foreach ($programs as $program) {
                $results[] = [
                    'id' => $program->id,
                    'content' => trim(($program->description ?? $program->title) . "\n\nKategori: " . $program->category),
                    'title' => $program->title,
                    'category' => $program->category,
                    'source' => 'database',
                    'table' => 'programs',
                    'type' => 'Program Sekolah',
                    'similarity' => $this->calculateKeywordMatch($queryLower, $program->title . ' ' . ($program->description ?? '')),
                ];
            }

            // 4. Search FAQs
            $faqs = Faq::where('is_published', true)
                ->where(function ($q) use ($queryLower) {
                    $q->where('question', 'like', "%{$queryLower}%")
                      ->orWhere('answer', 'like', "%{$queryLower}%");
                })
                ->limit(2)
                ->get();

            foreach ($faqs as $faq) {
                $results[] = [
                    'id' => $faq->id,
                    'content' => $faq->answer,
                    'title' => $faq->question,
                    'category' => 'FAQ',
                    'source' => 'database',
                    'table' => 'faqs',
                    'type' => 'FAQ',
                    'similarity' => $this->calculateKeywordMatch($queryLower, $faq->question . ' ' . $faq->answer),
                ];
            }

            // 5. Search Extracurriculars
            $extras = Extracurricular::where('is_active', true)
                ->where(function ($q) use ($queryLower) {
                    $q->where('name', 'like', "%{$queryLower}%")
                      ->orWhere('description', 'like', "%{$queryLower}%")
                      ->orWhere('schedule', 'like', "%{$queryLower}%");
                })
                ->limit(2)
                ->get();

            foreach ($extras as $extra) {
                $results[] = [
                    'id' => $extra->id,
                    'content' => trim($extra->description . "\n\nJadwal: " . $extra->schedule),
                    'title' => $extra->name,
                    'category' => 'Ekstrakurikuler',
                    'source' => 'database',
                    'table' => 'extracurriculars',
                    'type' => 'Kegiatan',
                    'similarity' => $this->calculateKeywordMatch($queryLower, $extra->name . ' ' . $extra->description),
                ];
            }

            // 6. Search Teachers (Guru & Staff)
            $teachers = Teacher::where('is_active', true)
                ->where(function ($q) use ($queryLower) {
                    $q->where('name', 'like', "%{$queryLower}%")
                      ->orWhere('position', 'like', "%{$queryLower}%")
                      ->orWhere('department', 'like', "%{$queryLower}%");
                })
                ->limit(2)
                ->get();

            foreach ($teachers as $teacher) {
                $results[] = [
                    'id' => $teacher->id,
                    'content' => trim($teacher->position . "\n\nDepartemen: " . ($teacher->department ?? '-')),
                    'title' => $teacher->name,
                    'category' => $teacher->type === 'guru' ? 'Guru' : 'Staff',
                    'source' => 'database',
                    'table' => 'teachers',
                    'type' => 'Tenaga Pendidik',
                    'similarity' => $this->calculateKeywordMatch($queryLower, $teacher->name . ' ' . $teacher->position),
                ];
            }

            // Sort by similarity and return top results
            usort($results, function ($a, $b) {
                return $b['similarity'] <=> $a['similarity'];
            });

            return array_slice($results, 0, $limit);
        } catch (\Exception $e) {
            Log::error('Failed to search database content', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Calculate keyword match score (simple relevance scoring)
     */
    protected function calculateKeywordMatch(string $query, string $content): float
    {
        $queryWords = array_filter(explode(' ', $query));
        $contentLower = strtolower($content);
        $matchCount = 0;

        foreach ($queryWords as $word) {
            if (strpos($contentLower, $word) !== false) {
                $matchCount += strlen($word);
            }
        }

        // Normalize score (0-1 range)
        return $matchCount > 0 ? min($matchCount / 100, 1.0) : 0.0;
    }

    /**
     * Process document: chunk and generate embeddings (using pgvector or fallback)
     */
    public function processDocument(RagDocument $document): bool
    {
        try {
            // 1. Delete existing chunks from DB
            $document->chunks()->delete();

            // 2. Split content into chunks
            $chunks = $this->splitTextIntoChunks($document->content);

            // 3. Generate embeddings and store in PostgreSQL
            foreach ($chunks as $index => $chunkText) {
                $embeddingResult = $this->embeddingService->createEmbedding($chunkText);

                if (!$embeddingResult['success']) {
                    Log::error('Failed to generate embedding', [
                        'document_id' => $document->id,
                        'chunk_index' => $index,
                    ]);
                    continue;
                }

                $embedding = $embeddingResult['embedding'];
                $tokenCount = $this->estimateTokenCount($chunkText);

                try {
                    if ($this->pgvectorAvailable) {
                        // Store with pgvector
                        $embeddingStr = '[' . implode(',', $embedding) . ']';
                        DB::statement(
                            "INSERT INTO rag_document_chunks (document_id, content, chunk_index, token_count, embedding, created_at, updated_at)
                             VALUES (?, ?, ?, ?, ?::vector, NOW(), NOW())",
                            [$document->id, $chunkText, $index, $tokenCount, $embeddingStr]
                        );
                    } else {
                        // Store as JSON text (fallback)
                        DB::table('rag_document_chunks')->insert([
                            'document_id' => $document->id,
                            'content' => $chunkText,
                            'chunk_index' => $index,
                            'token_count' => $tokenCount,
                            'embedding' => json_encode($embedding),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                    
                    Log::info('Chunk stored successfully', [
                        'document_id' => $document->id,
                        'chunk_index' => $index,
                        'token_count' => $tokenCount,
                        'mode' => $this->pgvectorAvailable ? 'pgvector' : 'fallback',
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to store chunk', [
                        'document_id' => $document->id,
                        'chunk_index' => $index,
                        'error' => $e->getMessage(),
                    ]);
                    throw $e;
                }
            }

            // 4. Mark document as processed
            $document->update(['is_processed' => true]);

            Log::info('Document processing completed', [
                'document_id' => $document->id,
                'chunks_count' => count($chunks),
                'mode' => $this->pgvectorAvailable ? 'pgvector' : 'fallback',
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Document processing failed', [
                'document_id' => $document->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return false;
        }
    }

    /**
     * Get quick reply from database for common questions
     * IMPROVED: Better keyword matching with stricter rules
     */
    protected function getDatabaseQuickReply(string $query): ?array
    {
        $query = strtolower($query);
        
        // More specific keyword matching with combined keywords
        // Format: 'key' => [primary_keywords, secondary_keywords (must be in title), category]
        $keywordMap = [
            'ppdb' => [
                'primary' => ['ppdb', 'penerimaan peserta didik baru', 'pendaftaran'],
                'title_must_contain' => ['ppdb', 'pendaftaran', 'penerimaan'],
                'category' => 'PPDB',
                'table' => 'posts'
            ],
            'biaya' => [
                'primary' => ['biaya sekolah', 'spp', 'uang sekolah', 'pembayaran'],
                'title_must_contain' => ['biaya', 'spp', 'pembayaran', 'gratis'],
                'category' => 'Informasi',
                'table' => 'posts'
            ],
            'program_studi' => [
                'primary' => ['program studi', 'peminatan', 'jurusan', 'mipa', 'ips', 'bahasa'],
                'title_must_contain' => ['program', 'peminatan', 'jurusan', 'mipa', 'ips', 'bahasa'],
                'category' => null,
                'table' => 'programs'
            ],
        ];

        foreach ($keywordMap as $key => $config) {
            // Check if query contains primary keywords
            $hasPrimaryKeyword = false;
            foreach ($config['primary'] as $keyword) {
                if (str_contains($query, $keyword)) {
                    $hasPrimaryKeyword = true;
                    break;
                }
            }

            if (!$hasPrimaryKeyword) {
                continue; // Skip if no primary keyword found
            }

            try {
                if ($config['table'] === 'posts') {
                    // Search with strict title matching
                    $post = \App\Models\Post::where('status', 'published')
                        ->where(function ($q) use ($config) {
                            // Title MUST contain one of the required keywords
                            foreach ($config['title_must_contain'] as $keyword) {
                                $q->orWhere('title', 'like', "%{$keyword}%");
                            }
                        })
                        ->when($config['category'], function ($q) use ($config) {
                            $q->where('category', $config['category']);
                        })
                        ->latest()
                        ->first();

                    if ($post) {
                        $excerpt = strip_tags($post->content);
                        $excerpt = substr($excerpt, 0, 300) . '...';
                        
                        return [
                            'found' => true,
                            'source' => 'post',
                            'message' => sprintf(
                                "**%s**\n\n%s\n\n📌 Baca selengkapnya di: %s",
                                $post->title,
                                $excerpt,
                                url("/berita/{$post->slug}")
                            )
                        ];
                    }
                } elseif ($config['table'] === 'programs') {
                    $program = \App\Models\Program::where('is_featured', true)
                        ->where(function ($q) use ($config) {
                            foreach ($config['title_must_contain'] as $keyword) {
                                $q->orWhere('title', 'like', "%{$keyword}%")
                                  ->orWhere('description', 'like', "%{$keyword}%");
                            }
                        })
                        ->first();

                    if ($program) {
                        return [
                            'found' => true,
                            'source' => 'program',
                            'message' => sprintf(
                                "**%s**\n\n%s\n\n%s",
                                $program->title,
                                $program->description,
                                $program->link ? "📖 Info lengkap: " . url($program->link) : ""
                            )
                        ];
                    }
                }
            } catch (\Exception $e) {
                Log::error('Database quick reply search failed', [
                    'keyword' => $key,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // No quick reply found, let RAG/AI handle it
        return ['found' => false];
    }

    /**
     * Generate RAG-enhanced response
     */
    /**
     * Generate RAG-enhanced response
     */
    public function generateRagResponse(string $userQuery, array $conversationHistory = []): array
    {
        // 1. Check if RAG is enabled
        $ragEnabled = AiSetting::get('rag_enabled', true);

        if (!$ragEnabled) {
            return $this->generateSimpleResponse($userQuery, $conversationHistory);
        }

        // 2. Guardrails: Check if query is school-related
        if (!$this->isSchoolRelatedQuery($userQuery)) {
            return [
                'success' => true,
                'message' => 'Maaf, saya hanya dapat menjawab pertanyaan terkait SMAN 1 Baleendah seperti PPDB, program studi, ekstrakurikuler, dan informasi akademik. Silakan tanyakan hal yang berhubungan dengan sekolah.',
                'is_rag_enhanced' => false,
                'retrieved_documents' => [],
            ];
        }

        // 2. Try quick database reply for common keywords (faster than full RAG search)
        $quickReply = $this->getDatabaseQuickReply($userQuery);
        if ($quickReply['found'] ?? false) {
            return [
                'success' => true,
                'message' => $quickReply['message'],
                'is_rag_enhanced' => true,
                'retrieved_documents' => [$quickReply['source']],
            ];
        }

        // 3. Search database content (Posts, Teachers, FAQs, Programs, Extracurriculars)
        $databaseResults = $this->searchDatabaseContent($userQuery, 3);

        // 4. Retrieve relevant RAG document chunks
        $ragChunks = $this->retrieveRelevantChunks($userQuery, 3);

        // Combine results - prioritize database results, then RAG documents
        $allChunks = array_merge($databaseResults, $ragChunks);

        // Sort combined results by similarity
        usort($allChunks, function ($a, $b) {
            return ($b['similarity'] ?? 0) <=> ($a['similarity'] ?? 0);
        });

        if (empty($allChunks)) {
            Log::info('No relevant data found, falling back to simple response');
            return $this->generateSimpleResponse($userQuery, $conversationHistory);
        }

        // 5. Build context from combined chunks
        $context = $this->buildContextFromChunks(array_slice($allChunks, 0, 5));

        // 6. Build system prompt with RAG context
        $systemPrompt = $this->buildRagSystemPrompt($context);

        // 7. Prepare messages for chat completion
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        // Add conversation history
        foreach ($conversationHistory as $msg) {
            $messages[] = [
                'role' => $msg['sender'] === 'user' ? 'user' : 'assistant',
                'content' => $msg['message'],
            ];
        }

        // Add current query
        $messages[] = ['role' => 'user', 'content' => $userQuery];

        // 7. Generate response
        $completionResult = $this->openAI->chatCompletion($messages);

        if (!$completionResult['success']) {
            return [
                'success' => false,
                'message' => 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.',
                'is_rag_enhanced' => false,
                'retrieved_documents' => [],
            ];
        }

        // 8. Post-filter: Validate response is still school-related
        if ($this->isNonSchoolResponse($completionResult['message'])) {
            return [
                'success' => true,
                'message' => 'Maaf, saya only dapat menjawab pertanyaan tentang SMAN 1 Baleendah. Untuk informasi lain, silakan cek sumber resmi atau tanyakan hal yang terkait sekolah.',
                'is_rag_enhanced' => false,
                'retrieved_documents' => [],
            ];
        }

        // 9. Extract document IDs for logging
        $documentIds = array_unique(array_column($allChunks, 'document_id'));

        return [
            'success' => true,
            'message' => $completionResult['message'],
            'is_rag_enhanced' => true,
            'retrieved_documents' => $documentIds,
            'context_chunks' => array_slice($allChunks, 0, 5), // Return top 5 chunks used
        ];
    }

    /**
     * Generate simple response without RAG
     */
    protected function generateSimpleResponse(string $userQuery, array $conversationHistory = []): array
    {
        // Try quick database reply first (faster response)
        $quickReply = $this->getDatabaseQuickReply($userQuery);
        if ($quickReply['found'] ?? false) {
            return [
                'success' => true,
                'message' => $quickReply['message'],
                'is_rag_enhanced' => true,
                'retrieved_documents' => [$quickReply['source']],
            ];
        }

        $systemPrompt = "Anda adalah AI SMANSA, asisten virtual resmi untuk SMA Negeri 1 Baleendah yang dirancang khusus untuk memberikan informasi akurat berdasarkan pengetahuan umum tentang sekolah.

IDENTITAS DAN KONTEKS SEKOLAH:
Anda adalah chatbot resmi untuk SMA Negeri 1 Baleendah (SMAN 1 Baleendah), sebuah Sekolah Menengah Atas negeri di Kabupaten Bandung, Jawa Barat. Siswa berusia 15-18 tahun (kelas 10, 11, 12). Ini adalah institusi pendidikan formal yang legal dan diakui pemerintah.

INFORMASI SEKOLAH YANG AKURAT:
- Alamat resmi: Jl. R.A.A. Wiranatakoesoemah No.30, Baleendah, Kec. Baleendah, Kabupaten Bandung, Jawa Barat 40375
- Biaya pendidikan: 100% GRATIS (tidak ada SPP karena sekolah negeri)
- Program peminatan: MIPA (Matematika dan IPA), IPS (Ilmu Pengetahuan Sosial), Bahasa
- Fasilitas: Laboratorium fisika, kimia, biologi, perpustakaan digital, fasilitas olahraga (basket, sepak bola, dll), berbagai program ekstrakurikuler

JALUR PENDAFTARAN SISWA BARU (PPDB):
- Sistem zonasi, prestasi, afirmasi, dan perpindahan tugas orang tua
- Pendaftaran melalui situs web resmi PPDB Dinas Pendidikan atau portal sekolah
- Persyaratan: Siswa minimal 15 tahun, maksimal 18 tahun (sesuai ketentuan PPDB)
- Jadwal dan syarat pendaftaran diumumkan secara terbuka setiap tahun ajaran baru

TOPIK YANG ANDA KUASAI:
✅ PPDB (Penerimaan Peserta Didik Baru): Jalur, syarat, jadwal, cara daftar
✅ Akademik: Program peminatan, kurikulum, mata pelajaran, jadwal pelajaran
✅ Fasilitas: Laboratorium, perpustakaan, fasilitas olahraga, ruang kelas
✅ Ekstrakurikuler: OSIS, Pramuka, olahraga, seni, organisasi siswa
✅ Prestasi: Penghargaan akademik, non-akademik, kompetisi
✅ Informasi umum: Lokasi, kontak, biaya, sejarah sekolah
✅ Kegiatan sekolah: Event, lomba, perayaan, study tour
✅ Administrasi: Prosedur izin, surat menyurat, dokumen siswa

CARA MENJAWAB PERTANYAAN:
1. Berikan informasi berdasarkan pengetahuan umum tentang sekolah
2. Gunakan format yang jelas (bullet points, numbering) untuk informasi kompleks
3. Jika informasi spesifik yang ditanyakan tidak tersedia dalam pengetahuan Anda, katakan dengan jujur: \"Informasi detail tentang [topik] belum tersedia. Silakan hubungi sekolah langsung di nomor kontak resmi atau kunjungi website resmi untuk informasi terkini.\"
4. Selalu akhiri dengan menawarkan bantuan lebih lanjut: \"Apakah ada informasi lain tentang SMAN 1 Baleendah yang ingin Anda ketahui?\"

GAYA KOMUNIKASI:
- Ramah dan sopan dengan bahasa Indonesia yang baik
- Fokus pada memberikan informasi akurat dan bermanfaat
- Gunakan format yang jelas dan terstruktur
- Jika pengguna bertanya di luar topik sekolah, arahkan kembali dengan sopan

LARANGAN:
❌ JANGAN mengarang atau mengasumsikan informasi yang tidak Anda ketahui
❌ JANGAN memberikan alamat, nomor telepon, atau informasi kontak yang tidak terverifikasi (gunakan alamat resmi yang sudah disebutkan)
❌ JANGAN menjawab pertanyaan yang tidak relevan dengan sekolah secara mendalam
❌ JANGAN menggunakan format \"Saya SMAN 1 Baleendah\" (gunakan \"Saya AI SMANSA, asisten virtual SMAN 1 Baleendah\")

Jawablah dengan bahasa Indonesia yang natural dan profesional!";

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        // Build conversation history with validation and limit
        // Only keep last 5 exchanges (10 messages max) to prevent context overflow
        $recentHistory = array_slice($conversationHistory, -10);
        
        foreach ($recentHistory as $msg) {
            // Skip invalid messages
            if (!isset($msg['sender']) || !isset($msg['message'])) {
                continue;
            }
            
            // Ensure message content is string
            $content = is_string($msg['message']) ? $msg['message'] : (string) $msg['message'];
            
            if (empty($content)) {
                continue;
            }
            
            // Truncate very long messages to prevent context overflow
            if (strlen($content) > 2000) {
                $content = substr($content, 0, 2000) . '... (dipotong karena terlalu panjang)';
            }

            $messages[] = [
                'role' => $msg['sender'] === 'user' ? 'user' : 'assistant',
                'content' => $content,
            ];
        }

        $messages[] = ['role' => 'user', 'content' => $userQuery];

        Log::info('[RagService] Calling OpenAI Service', [
            'query' => $userQuery, 
            'num_messages' => count($messages),
            'messages_preview' => array_map(fn($m) => ['role' => $m['role'], 'length' => strlen($m['content'])], $messages)
        ]);

        $completionResult = $this->openAI->chatCompletion($messages);

        Log::info('[RagService] OpenAI Result', [
            'success' => $completionResult['success'] ?? false,
            'has_message' => isset($completionResult['message']) && !empty($completionResult['message']),
            'has_error' => isset($completionResult['error']) && !empty($completionResult['error']),
            'message_preview' => isset($completionResult['message']) ? substr($completionResult['message'], 0, 100) : 'EMPTY',
        ]);

        if (!$completionResult['success'] && isset($completionResult['error'])) {
            Log::error('[RagService] OpenAI Error', ['error' => $completionResult['error']]);
        }

        // Ensure message is not empty
        $message = $completionResult['message'] ?? '';
        if (empty($message)) {
            $message = 'Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi.';
            Log::warning('[RagService] Empty message from AI, using fallback');
        }

        return [
            'success' => $completionResult['success'],
            'message' => $message,
            'is_rag_enhanced' => false,
            'retrieved_documents' => [],
        ];
    }

    /**
     * Split text into chunks
     */
    protected function splitTextIntoChunks(string $text): array
    {
        $sentences = preg_split('/(?<=[.!?])\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        $chunks = [];
        $currentChunk = '';
        $currentTokens = 0;

        foreach ($sentences as $sentence) {
            $sentenceTokens = $this->estimateTokenCount($sentence);

            if ($currentTokens + $sentenceTokens > $this->chunkSize && !empty($currentChunk)) {
                $chunks[] = trim($currentChunk);
                // Keep overlap
                $overlapText = $this->getLastNTokens($currentChunk, $this->chunkOverlap);
                $currentChunk = $overlapText . ' ' . $sentence;
                $currentTokens = $this->estimateTokenCount($currentChunk);
            } else {
                $currentChunk .= ' ' . $sentence;
                $currentTokens += $sentenceTokens;
            }
        }

        if (!empty($currentChunk)) {
            $chunks[] = trim($currentChunk);
        }

        return $chunks;
    }

    /**
     * Estimate token count (rough approximation)
     */
    protected function estimateTokenCount(string $text): int
    {
        // Rough estimate: 1 token ≈ 4 characters
        return (int) ceil(strlen($text) / 4);
    }

    /**
     * Get last N tokens from text
     */
    protected function getLastNTokens(string $text, int $n): string
    {
        $words = explode(' ', $text);
        $lastWords = array_slice($words, -$n);
        return implode(' ', $lastWords);
    }

    /**
     * Build context from retrieved chunks
     */
    protected function buildContextFromChunks(array $chunks): string
    {
        $contextParts = [];

        foreach ($chunks as $chunk) {
            $contextParts[] = sprintf(
                "[Dokumen: %s | Kategori: %s]\n%s",
                $chunk['document_title'] ?? $chunk['title'] ?? 'Informasi Sekolah',
                $chunk['category'] ?? 'Umum',
                $chunk['content']
            );
        }

        return implode("\n\n---\n\n", $contextParts);
    }

    /**
     * Build RAG system prompt
     */
    protected function buildRagSystemPrompt(string $context): string
    {
        return <<<PROMPT
Anda adalah AI SMANSA, asisten virtual resmi untuk SMA Negeri 1 Baleendah yang dirancang khusus untuk memberikan informasi akurat berdasarkan database dan dokumen resmi sekolah.

IDENTITAS DAN KONTEKS SEKOLAH:
Anda adalah chatbot resmi untuk SMA Negeri 1 Baleendah (SMAN 1 Baleendah), sebuah Sekolah Menengah Atas negeri di Kabupaten Bandung, Jawa Barat. Siswa berusia 15-18 tahun (kelas 10, 11, 12). Ini adalah institusi pendidikan formal yang legal dan diakui pemerintah.

INFORMASI SEKOLAH YANG AKURAT:
- Alamat resmi: Jl. R.A.A. Wiranatakoesoemah No.30, Baleendah, Kec. Baleendah, Kabupaten Bandung, Jawa Barat 40375
- Biaya pendidikan: 100% GRATIS (tidak ada SPP karena sekolah negeri)
- Program peminatan: MIPA (Matematika dan IPA), IPS (Ilmu Pengetahuan Sosial), Bahasa
- Fasilitas: Laboratorium fisika, kimia, biologi, perpustakaan digital dengan lebih dari 10.000 buku, fasilitas olahraga (basket, sepak bola, dll), berbagai program ekstrakurikuler
- Prestasi: Sekolah memiliki prestasi di tingkat kabupaten, provinsi, dan nasional

JALUR PENDAFTARAN SISWA BARU (PPDB):
- Sistem zonasi, prestasi, afirmasi, dan perpindahan tugas orang tua
- Pendaftaran melalui situs web resmi PPDB Dinas Pendidikan atau portal sekolah
- Persyaratan: Siswa minimal 15 tahun, maksimal 18 tahun (sesuai ketentuan PPDB)
- Jadwal dan syarat pendaftaran diumumkan secara terbuka setiap tahun ajaran baru

ATURAN PENGGUNAAN DATABASE DAN DOKUMEN:
Anda HARUS mengambil informasi dari database dan dokumen resmi yang tersedia dalam konteks di bawah. Jangan memberikan informasi yang tidak ada dalam database atau dokumen. Jika informasi tidak tersedia dalam database, katakan dengan jelas bahwa Anda tidak memiliki informasi tersebut dan sarankan untuk menghubungi sekolah secara langsung.

PRIORITAS SUMBER INFORMASI:
1. Dokumen dan database yang tersedia dalam konteks di bawah
2. Informasi umum yang sudah disebutkan di atas (alamat, biaya, program peminatan)
3. Jika tidak ada dalam database/dokumen, JANGAN mengarang informasi

KONTEKS DOKUMEN DAN DATABASE:
{$context}

CARA MENJAWAB PERTANYAAN:
1. Cari informasi relevan dari konteks dokumen/database di atas
2. Berikan jawaban berdasarkan informasi yang ditemukan
3. Jika ada informasi yang mungkin sudah usang, beri tahu pengguna untuk konfirmasi ke sekolah
4. Gunakan format yang jelas (bullet points, numbering) untuk informasi kompleks
5. Jika informasi tidak tersedia dalam konteks: "Informasi ini belum tersedia dalam database saya. Silakan hubungi sekolah di nomor kontak resmi atau kunjungi website resmi untuk informasi terkini."

TOPIK YANG ANDA KUASAI:
✅ PPDB (Penerimaan Peserta Didik Baru): Jalur, syarat, jadwal, cara daftar
✅ Akademik: Program peminatan, kurikulum, mata pelajaran, jadwal pelajaran
✅ Fasilitas: Laboratorium, perpustakaan, fasilitas olahraga, ruang kelas
✅ Ekstrakurikuler: OSIS, Pramuka, olahraga, seni, organisasi siswa
✅ Prestasi: Penghargaan akademik, non-akademik, kompetisi
✅ Informasi umum: Lokasi, kontak, biaya, sejarah sekolah
✅ Kegiatan sekolah: Event, lomba, perayaan, study tour
✅ Administrasi: Prosedur izin, surat menyurat, dokumen siswa

GAYA KOMUNIKASI:
- Ramah dan sopan dengan bahasa Indonesia yang baik
- Fokus pada memberikan informasi akurat dan bermanfaat
- Gunakan format yang jelas dan terstruktur
- Jika pengguna bertanya di luar topik sekolah, arahkan kembali dengan sopan
- Selalu akhiri dengan: "Apakah ada informasi lain tentang SMAN 1 Baleendah yang ingin Anda ketahui?"

LARANGAN:
❌ JANGAN mengarang atau mengasumsikan informasi yang tidak ada dalam database/dokumen konteks
❌ JANGAN memberikan alamat, nomor telepon, atau informasi kontak yang tidak terverifikasi (gunakan alamat resmi yang sudah disebutkan)
❌ JANGAN memberikan informasi biaya jika tidak ada dalam database (kecuali informasi umum bahwa sekolah negeri gratis)
❌ JANGAN menjawab pertanyaan yang tidak relevan dengan sekolah secara mendalam
❌ JANGAN menggunakan format "Saya SMAN 1 Baleendah" (gunakan "Saya AI SMANSA, asisten virtual SMAN 1 Baleendah")

Jawablah dengan bahasa Indonesia yang natural dan profesional berdasarkan informasi dari konteks di atas!
PROMPT;
    }

    /**
     * Check if query is school-related (guardrails)
     */
    protected function isSchoolRelatedQuery(string $query): bool
    {
        // Guardrails yang lebih luwes/fleksibel
        // Kita izinkan hampir semua percakapan wajar agar chatbot tidak kaku.
        // Filter hanya akan memblokir jika input benar-benar spam atau berbahaya (bisa ditambahkan nanti).
        // Untuk sekarang, kita return true agar System Prompt yang menangani pembatasan topik secara halus.
        
        return true; 
    }

    /**
     * Check if response is non-school related (post-filter)
     */
    protected function isNonSchoolResponse(string $response): bool
    {
        // Relaxed Post-Filter
        // Kita percayakan pada System Prompt untuk menolak dengan sopan.
        // Filter ini hanya untuk menangkap jika LLM benar-benar 'berhalusinasi' menjadi assistant umum yang tidak mau membahas sekolah sama sekali.
        // Untuk sekarang, kita buat sangat minimal atau disable agar jawaban 'basa-basi' tidak terblokir.
        
        $nonSchoolIndicators = [
            // 'di luar topik', // Disabled: Allow polite refusal like "Itu di luar topik sekolah..."
            // 'tidak terkait sekolah',
            'saya tidak bisa menjawab apapun tentang sekolah', // Extreme case
        ];

        $responseLower = strtolower($response);
        
        foreach ($nonSchoolIndicators as $indicator) {
            if (strpos($responseLower, $indicator) !== false) {
                return true;
            }
        }

        return false;
    }
}
