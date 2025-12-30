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

    public function __construct(OpenAIService $openAI, EmbeddingService $embeddingService)
    {
        $this->openAI = $openAI;
        $this->embeddingService = $embeddingService;
    }

    /**
     * Retrieve relevant documents for a query (from RAG documents)
     */
    public function retrieveRelevantChunks(string $query, int $topK = null): array
    {
        $topK = $topK ?? AiSetting::get('rag_top_k', 5);

        try {
            // 1. Generate embedding for query
            $queryEmbeddingResult = $this->embeddingService->createEmbedding($query);

            if (!$queryEmbeddingResult['success']) {
                Log::error('Query embedding failed', ['query' => $query]);
                return [];
            }

            $queryEmbedding = $queryEmbeddingResult['embedding'];

            // 2. Get all active chunks
            $chunks = RagDocumentChunk::whereHas('document', function ($q) {
                $q->where('is_active', true);
            })->get();

            if (empty($chunks)) {
                return [];
            }

            // 3. Calculate similarity for each chunk
            $chunksWithSimilarity = [];
            foreach ($chunks as $chunk) {
                $chunkEmbedding = json_decode($chunk->embedding, true);
                if (empty($chunkEmbedding)) continue;

                $similarity = $this->cosineSimilarity($queryEmbedding, $chunkEmbedding);

                $chunksWithSimilarity[] = [
                    'id' => $chunk->id,
                    'content' => $chunk->content,
                    'document_id' => $chunk->document_id,
                    'document_title' => $chunk->document->title ?? 'Unknown',
                    'category' => $chunk->document->category ?? 'Umum',
                    'source' => 'rag_document',
                    'similarity' => $similarity,
                    'token_count' => $chunk->token_count,
                ];
            }

            // 4. Sort by similarity descending and return top K
            usort($chunksWithSimilarity, function ($a, $b) {
                return $b['similarity'] <=> $a['similarity'];
            });

            return array_slice($chunksWithSimilarity, 0, $topK);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve relevant chunks', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Search database for relevant content
     * Sources: Site Settings, Posts, Program Sekolah, FAQs, Extracurriculars, Teachers
     * NOTE: Program Studi (MIPA, IPS, Bahasa) are EXCLUDED as they are incorrect data
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

            // 3. Search Program Sekolah (EXCLUDE "Program Studi" yang salah)
            $programs = Program::where('category', '!=', 'Program Studi')
                ->where(function ($q) use ($queryLower) {
                    $q->where('title', 'like', "%{$queryLower}%")
                      ->orWhere('description', 'like', "%{$queryLower}%")
                      ->orWhere('category', 'like', "%{$queryLower}%");
                })
                ->limit(2)
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
     * Process document: chunk and generate embeddings
     */
    public function processDocument(RagDocument $document): bool
    {
        try {
            // 1. Delete existing chunks
            $document->chunks()->delete();

            // 2. Split content into chunks
            $chunks = $this->splitTextIntoChunks($document->content);

            // 3. Generate embeddings for each chunk
            foreach ($chunks as $index => $chunkText) {
                $embeddingResult = $this->embeddingService->createEmbedding($chunkText);

                if (!$embeddingResult['success']) {
                    Log::error('Failed to generate embedding', [
                        'document_id' => $document->id,
                        'chunk_index' => $index,
                    ]);
                    continue;
                }

                RagDocumentChunk::create([
                    'document_id' => $document->id,
                    'content' => $chunkText,
                    'chunk_index' => $index,
                    'token_count' => $this->estimateTokenCount($chunkText),
                    'embedding' => json_encode($embeddingResult['embedding']), // Store as JSON string
                ]);
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Document processing failed', [
                'document_id' => $document->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Get quick reply from database for common questions
     */
    protected function getDatabaseQuickReply(string $query): ?array
    {
        $query = strtolower($query);
        
        // Check for specific keywords and search database
        $keywordMap = [
            'ppdb' => ['title' => ['ppdb', 'penerimaan peserta didik baru', 'pendaftaran'],
                      'table' => 'posts',
                      'category' => 'PPDB'],
            'biaya' => ['title' => ['biaya', 'spp', 'uang sekolah', 'pembayaran'],
                        'table' => 'posts',
                        'category' => 'Informasi'],
            'jadwal' => ['title' => ['jadwal', 'kalender', 'tanggal'],
                         'table' => 'posts',
                         'category' => 'Jadwal'],
            'fasilitas' => ['title' => ['fasilitas', 'laboratorium', 'perpustakaan', 'ruang'],
                           'table' => 'posts',
                           'category' => 'Fasilitas'],
            'ekstra' => ['title' => ['ekstra', 'ekskul', 'kegiatan', 'organisasi'],
                        'table' => 'posts',
                        'category' => 'Ekstrakurikuler'],
            'program' => ['title' => ['peminatan', 'jurusan', 'ipa', 'ips', 'bahasa'],
                          'table' => 'programs',
                          'category' => null],
            'prestasi' => ['title' => ['prestasi', 'juara', 'lomba', 'penghargaan'],
                          'table' => 'posts',
                          'category' => 'Prestasi'],
        ];

        foreach ($keywordMap as $key => $config) {
            // Check if query contains any of the keywords
            $hasKeyword = false;
            foreach ($config['title'] as $keyword) {
                if (str_contains($query, $keyword)) {
                    $hasKeyword = true;
                    break;
                }
            }

            if ($hasKeyword) {
                try {
                    if ($config['table'] === 'posts') {
                        $post = \App\Models\Post::where('status', 'published')
                            ->where(function ($q) use ($config) {
                                foreach ($config['title'] as $keyword) {
                                    $q->orWhere('title', 'like', "%{$keyword}%")
                                      ->orWhere('content', 'like', "%{$keyword}%");
                                }
                                if ($config['category']) {
                                    $q->where('category', $config['category']);
                                }
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
                                    "**%s**\n\n%s\n\n\n📌 Baca selengkapnya di: %s",
                                    $post->title,
                                    $excerpt,
                                    url("/info-{$post->slug}") // Gunakan route yang sesuai
                                )
                            ];
                        }
                    } elseif ($config['table'] === 'programs') {
                        $program = \App\Models\Program::where('is_featured', true)
                            ->where(function ($q) use ($config) {
                                foreach ($config['title'] as $keyword) {
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
        }

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

        $systemPrompt = "Anda adalah AI SMANSA, asisten virtual ramah untuk SMAN 1 Baleendah.

PANDUAN INTERAKSI:
1. **Ramah & Luwes**: Jawablah pertanyaan dengan sopan dan natural. Boleh berbasa-basi sebentar jika disapa.
2. **Topik Sekolah**: Prioritaskan menjawab hal seputar sekolah.
3. **Di Luar Topik**: Jika ditanya hal aneh/jauh dari konteks sekolah, jawab sopan lalu arahkan kembali ke topik sekolah (misal: 'Maaf saya kurang tahu soal itu, tapi kalau soal PPDB saya siap bantu!').

INFORMASI DASAR SEKOLAH:
- **Peminatan**: MIPA, IPS, Bahasa.
- **Biaya**: SMA Negeri GRATIS (Jabar). Tidak ada SPP wajib.

Jawablah dengan bahasa Indonesia yang baik dan membantu.";

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
Anda adalah AI SMANSA, asisten virtual ramah dan cerdas untuk SMAN 1 Baleendah.

PERAN DAN KEPRIBADIAN:
- Anda ramah, sopan, dan sangat membantu.
- Anda boleh berinteraksi santai (small talk) jika pengguna menyapa atau bertanya kabar.
- Tujuan utama Anda adalah memberikan informasi akurat tentang sekolah.

KONTEKS DOKUMEN:
{$context}

PANDUAN MENJAWAB:
1. **Prioritas Konteks**: Gunakan informasi dari dokumen di atas untuk menjawab pertanyaan teknis sekolah.
2. **Fleksibilitas**: Jika ditanya hal umum (sapaan, kabar, ucapan terima kasih), jawablah dengan natural dan hangat. Tidak perlu kaku.
3. **Di Luar Topik**: Jika pertanyaan sangat melenceng dari sekolah (misal: politik, resep masakan, game):
   - Jawab dengan sopan dan humoris jika perlu.
   - Arahkan kembali pembicaraan ke topik sekolah dengan halus.
   - Contoh: "Wah, menarik sekali pertanyaannya! Tapi saya lebih jago ngobrolin soal PPDB atau kegiatan di SMAN 1 Baleendah nih. Ada yang bisa saya bantu soal sekolah?"
4. **Ketidaktahuan**: Jika info sekolah tidak ada di dokumen, katakan jujur bahwa info tersebut belum tersedia, tapi tawarkan untuk menghubungi kontak sekolah.

INFORMASI PENTING SEKOLAH:
- **Akademik**: Ada peminatan MIPA, IPS, Bahasa. Gunakan istilah "jurusan" atau "prodi" jika pengguna menggunakannya.
- **Biaya**: SMA Negeri di Jawa Barat GRATIS (Kebijakan Pemprov). Tidak ada SPP/uang gedung wajib. Hanya sumbangan sukarela (jika ada).

Jawablah pertanyaan berikut dengan gaya bahasa Indonesia yang natural dan profesional:
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
