<?php

namespace App\Services;

use App\Models\AiSetting;
use Illuminate\Support\Facades\Log;

/**
 * Service for AI-powered content creation (news articles, social media posts, etc.)
 * This service uses OpenAI as primary provider for better content quality
 */
class ContentCreationService
{
    protected OpenAIService $openAI;

    public function __construct(OpenAIService $openAI)
    {
        $this->openAI = $openAI;
    }

    /**
     * Generate news article from Instagram post or other source
     * Uses OpenAI with force_provider flag for better quality
     * 
     * @param string $caption Instagram caption or source content
     * @param array $metadata Additional metadata (hashtags, images, etc.)
     * @param array $options Generation options
     * @return array Result with success status and generated content
     */
    public function generateNewsArticle(string $caption, array $metadata = [], array $options = []): array
    {
        $systemPrompt = "Anda adalah penulis berita profesional untuk website SMA Negeri 1 Baleendah. "
            . "Tugas Anda adalah membuat artikel berita formal, informatif, dan menarik dari konten yang diberikan. "
            . "Artikel harus:\n"
            . "- Panjang 500-800 kata\n"
            . "- Menggunakan Bahasa Indonesia formal dan baku\n"
            . "- Memiliki struktur: judul, lead paragraph, isi, dan penutup\n"
            . "- Objektif dan faktual\n"
            . "- SEO-friendly dengan keyword natural\n"
            . "- Menyertakan call-to-action di akhir jika relevan";

        $userPrompt = "Buatkan artikel berita untuk website sekolah dari konten berikut:\n\n";
        $userPrompt .= "Caption/Konten:\n{$caption}\n\n";

        if (!empty($metadata['hashtags'])) {
            $userPrompt .= "Hashtags: " . implode(', ', $metadata['hashtags']) . "\n\n";
        }

        if (!empty($metadata['date'])) {
            $userPrompt .= "Tanggal: {$metadata['date']}\n\n";
        }

        $userPrompt .= "Format output dalam JSON dengan struktur:\n";
        $userPrompt .= "{\n";
        $userPrompt .= '  "title": "Judul berita (ambil INTI peristiwa/subjek utama, max 100 karakter. HINDARI judul sapaan umum/pembuka)",' . "\n";
        $userPrompt .= '  "excerpt": "Ringkasan singkat 2-3 kalimat (max 200 karakter)",' . "\n";
        // $userPrompt .= '  "content": "Isi artikel lengkap dalam format HTML dengan paragraf <p>, heading <h3> jika perlu, dan list <ul><li> jika ada",' . "\n";
        // $userPrompt .= '  "meta_description": "Meta description untuk SEO (max 160 karakter)",' . "\n";
        $userPrompt .= '  "keywords": ["keyword1", "keyword2", "keyword3"],' . "\n";
        $userPrompt .= '  "category": "Kategori berita (Berita Sekolah/Prestasi/Kegiatan/Pengumuman)"' . "\n";
        $userPrompt .= "}";

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt . " PENTING: Judul harus to-the-point pada inti berita (misal: 'Siswa X Juara Lomba Y' atau 'Kegiatan Z Berlangsung Meriah'). JANGAN gunakan kalimat pembuka/sapaan sebagai judul (contoh HINDARI: 'Seluruh civitas akademik mengucapkan..')."], 
            ['role' => 'user', 'content' => $userPrompt],
        ];

        // Force OpenAI for content creation (better quality)
        $completionOptions = array_merge($options, [
            'force_provider' => 'openai',
            // 'max_tokens' => 3000, // Reduced max tokens since we don't generate full content
            'max_tokens' => 1000, 
            'temperature' => 0.7,
        ]);

        Log::info('[ContentCreationService] Generating news article (metadata only)', [
            'source' => 'instagram',
            'caption_length' => strlen($caption),
            'forced_provider' => 'openai',
        ]);

        $result = $this->openAI->chatCompletion($messages, $completionOptions);

        if (!$result['success']) {
            Log::error('[ContentCreationService] Failed to generate article');
            return [
                'success' => false,
                'error' => 'Gagal membuat artikel. Silakan coba lagi.',
            ];
        }

        // Try to parse JSON response
        $content = $result['message'];
        
        // Extract JSON from markdown code blocks if present
        if (preg_match('/```json\s*(.*?)\s*```/s', $content, $matches)) {
            $content = $matches[1];
        } elseif (preg_match('/```\s*(.*?)\s*```/s', $content, $matches)) {
            $content = $matches[1];
        }

        $articleData = json_decode($content, true);

        if (!$articleData) {
            // Fallback: return raw content but with better title
            Log::warning('[ContentCreationService] Could not parse JSON, returning raw content');
            
            // Generate title from original caption if possible, or from content
            $sourceText = !empty($caption) ? $caption : strip_tags($content);
            $lines = explode("\n", $sourceText);
            
            $fallbackTitle = 'Berita Sekolah Terbaru';
            
            // Phrases to skip as title
            $skipPhrases = [
                'seluruh civitas', 'kami mengucapkan', 'assalamualaikum', 'selamat pagi', 
                'selamat siang', 'selamat malam', 'sampurasun', 'halo wargi', 'informasi sekolah'
            ];

            foreach ($lines as $line) {
                // Remove emojis and extra formatting markers if needed
                $cleanLine = trim($line);
                // Remove all hashtags at start of line
                $cleanLine = preg_replace('/^#\w+\s*/', '', $cleanLine);
                // Clean punctuation at start
                $cleanLine = ltrim($cleanLine, ".- \t\n\r\0\x0B");
                
                // Check if line contains skip phrases
                $lowerLine = strtolower($cleanLine);
                $shouldSkip = false;
                foreach ($skipPhrases as $phrase) {
                    if (str_contains($lowerLine, $phrase)) {
                        $shouldSkip = true;
                        break;
                    }
                }

                if ($shouldSkip) continue;
                
                // If line is not empty and NOT a hashtag-only line (in case Regex didn't catch all)
                // and has reasonable length
                if (!empty($cleanLine) && !str_starts_with($cleanLine, '#') && strlen($cleanLine) > 10) {
                    $fallbackTitle = \Illuminate\Support\Str::limit($cleanLine, 100);
                    break;
                }
            }

            return [
                'success' => true,
                'provider' => $result['provider'],
                'article' => [
                    'title' => $fallbackTitle, // Use the better fallback title
                    'excerpt' => substr(strip_tags($content), 0, 200),
                    'content' => $this->formatCaptionAsHtml($caption), 
                    'meta_description' => '',
                    'keywords' => ['Berita', 'Sekolah', 'Update'],
                    'category' => 'Berita Sekolah',
                ],
                'raw_content' => $content,
            ];
        }

        // Use formatted caption content
        $articleData['content'] = $this->formatCaptionAsHtml($caption);
        
        // Validation for title from AI
        if (str_starts_with($articleData['title'], '#') || strlen($articleData['title']) < 5) {
             $sourceText = !empty($caption) ? $caption : '';
             $lines = explode("\n", $sourceText);
             foreach ($lines as $line) {
                $cleanLine = trim($line);
                $cleanLine = preg_replace('/^#\w+\s*/', '', $cleanLine);
                $cleanLine = ltrim($cleanLine, ".- \t\n\r\0\x0B");
                if (!empty($cleanLine) && !str_starts_with($cleanLine, '#') && strlen($cleanLine) > 5) {
                    $articleData['title'] = \Illuminate\Support\Str::limit($cleanLine, 100);
                    break;
                }
            }
        }

        if (!isset($articleData['meta_description'])) {
             $articleData['meta_description'] = $articleData['excerpt'] ?? '';
        }

        return [
            'success' => true,
            'provider' => $result['provider'],
            'article' => $articleData,
        ];
    }

    /**
     * Format Caption as HTML Content
     * 
     * @param string $caption
     * @return string
     */
    protected function formatCaptionAsHtml(string $caption): string 
    {
        // 1. Escape HTML entities to prevent XSS (if caption has raw html) - but we want to allow newlines
        $text = htmlspecialchars($caption, ENT_QUOTES, 'UTF-8');

        // 2. Convert newlines to paragraphs or line breaks
        // Split by double newlines for paragraphs
        $paragraphs = preg_split('/\n\s*\n/', $text);
        $html = '';
        
        foreach ($paragraphs as $p) {
            $p = trim($p);
            if (empty($p)) continue;
            
            // Convert single newlines inside paragraph to <br>
            $p = nl2br($p);
            
            // Linkify URLs
            $p = preg_replace(
                '/(https?:\/\/[^\s]+)/', 
                '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>', 
                $p
            );
            
            // Linkify Mentions (@username)
            $p = preg_replace(
                '/@(\w+)/', 
                '<a href="https://instagram.com/$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">@$1</a>', 
                $p
            );

             // Linkify Hashtags (#tag)
             // $p = preg_replace(
             //    '/#(\w+)/', 
             //    '<span class="text-blue-500">#$1</span>', 
             //    $p
             // );

            $html .= "<p class=\"mb-4 text-gray-700 leading-relaxed\">{$p}</p>";
        }

        return $html;
    }

    /**
     * Improve or rewrite existing content
     */
    public function improveContent(string $content, string $type = 'general', array $options = []): array
    {
        $systemPrompt = "Anda adalah editor konten profesional. Tugas Anda memperbaiki dan meningkatkan kualitas konten.";
        
        $improvements = [
            'grammar' => 'Perbaiki tata bahasa dan ejaan',
            'seo' => 'Optimalkan untuk SEO dengan keyword natural',
            'readability' => 'Tingkatkan keterbacaan dengan struktur yang lebih baik',
            'formal' => 'Buat lebih formal dan profesional',
            'engaging' => 'Buat lebih menarik dan engaging',
        ];

        $requestedImprovements = $options['improvements'] ?? ['grammar', 'readability'];
        $improvementList = array_intersect_key($improvements, array_flip($requestedImprovements));

        $userPrompt = "Perbaiki konten berikut dengan fokus pada:\n";
        foreach ($improvementList as $improvement) {
            $userPrompt .= "- {$improvement}\n";
        }
        $userPrompt .= "\nKonten:\n{$content}";

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userPrompt],
        ];

        $completionOptions = array_merge($options, [
            'force_provider' => 'openai', // Force OpenAI for content quality
            'max_tokens' => 2500,
        ]);

        return $this->openAI->chatCompletion($messages, $completionOptions);
    }

    /**
     * Generate social media caption from article
     */
    public function generateSocialMediaCaption(string $articleTitle, string $articleExcerpt, string $platform = 'instagram'): array
    {
        $platformSpecs = [
            'instagram' => ['max_length' => 2200, 'style' => 'casual, emoji-friendly'],
            'facebook' => ['max_length' => 5000, 'style' => 'informative, semi-formal'],
            'twitter' => ['max_length' => 280, 'style' => 'concise, hashtag-heavy'],
        ];

        $spec = $platformSpecs[$platform] ?? $platformSpecs['instagram'];

        $systemPrompt = "Anda adalah social media specialist untuk SMAN 1 Baleendah.";
        $userPrompt = "Buatkan caption {$platform} menarik dari artikel berikut:\n\n"
            . "Judul: {$articleTitle}\n"
            . "Ringkasan: {$articleExcerpt}\n\n"
            . "Style: {$spec['style']}\n"
            . "Max length: {$spec['max_length']} karakter\n"
            . "Sertakan hashtags relevan dan call-to-action.";

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userPrompt],
        ];

        // Can use Ollama for simple caption generation (faster, cheaper)
        return $this->openAI->chatCompletion($messages, [
            'max_tokens' => 500,
            'temperature' => 0.8,
            // Don't force provider - let it use Ollama if available
        ]);
    }
}
