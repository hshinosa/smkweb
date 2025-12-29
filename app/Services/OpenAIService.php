<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\AiSetting;

class OpenAIService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected string $model;
    protected string $embeddingModel;
    protected ?OllamaService $ollamaService = null;
    protected bool $useOllamaFallback;

    public function __construct(?OllamaService $ollamaService = null)
    {
        $this->baseUrl = AiSetting::get('ai_model_base_url', 'https://api-ai.hshinoshowcase.site/v1');
        $this->apiKey = AiSetting::get('ai_model_api_key', 'sk-hshinosa');
        $this->model = AiSetting::get('ai_model_name', 'gemini-claude-sonnet-4-5-thinking');
        $this->embeddingModel = AiSetting::get('ai_embedding_model', 'text-embedding-3-small');
        $this->useOllamaFallback = AiSetting::get('use_ollama_fallback', true);
        $this->ollamaService = $ollamaService;
    }

    /**
     * Create chat completion with OpenAI-compatible API (with Ollama fallback)
     */
    public function chatCompletion(array $messages, array $options = []): array
    {
        $maxTokens = $options['max_tokens'] ?? AiSetting::get('ai_max_tokens', 2000);
        $temperature = $options['temperature'] ?? (float) AiSetting::get('ai_temperature', 0.7);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post("{$this->baseUrl}/chat/completions", [
                'model' => $this->model,
                'messages' => $messages,
                'max_tokens' => (int) $maxTokens,
                'temperature' => $temperature,
                'stream' => false,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Validate response structure
                if (!isset($data['choices']) || empty($data['choices'])) {
                    Log::warning('[OpenAIService] API returned empty choices', [
                        'response_keys' => array_keys($data),
                    ]);
                    
                    // Try fallback to Ollama
                    return $this->fallbackToOllama('chat', $messages, $options);
                }
                
                $message = $data['choices'][0]['message']['content'] ?? '';
                
                // Validate message is not empty
                if (empty($message)) {
                    Log::warning('[OpenAIService] API returned empty message');
                    
                    // Try fallback to Ollama
                    return $this->fallbackToOllama('chat', $messages, $options);
                }

                return [
                    'success' => true,
                    'data' => $data,
                    'message' => $message,
                    'provider' => 'openai',
                ];
            }

            Log::warning('[OpenAIService] API Error, attempting Ollama fallback', [
                'status' => $response->status(),
            ]);

            // Fallback to Ollama
            return $this->fallbackToOllama('chat', $messages, $options);

        } catch (\Exception $e) {
            Log::error('[OpenAIService] Exception', [
                'message' => $e->getMessage(),
            ]);

            // Fallback to Ollama on exception
            return $this->fallbackToOllama('chat', $messages, $options);
        }
    }

    /**
     * Generate embeddings for text (with Ollama fallback)
     */
    public function createEmbedding(string $text): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post("{$this->baseUrl}/embeddings", [
                'model' => $this->embeddingModel,
                'input' => $text,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'embedding' => $data['data'][0]['embedding'] ?? [],
                    'provider' => 'openai',
                ];
            }

            Log::warning('Embedding API Error, attempting Ollama fallback', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            // Fallback to Ollama
            return $this->fallbackToOllama('embedding', $text);

        } catch (\Exception $e) {
            Log::error('Embedding Service Exception', [
                'message' => $e->getMessage(),
            ]);

            // Fallback to Ollama
            return $this->fallbackToOllama('embedding', $text);
        }
    }

    /**
     * Fallback to Ollama local AI
     */
    protected function fallbackToOllama(string $type, $data, array $options = []): array
    {
        if (!$this->useOllamaFallback) {
            Log::warning('[OpenAIService] Ollama fallback disabled, using hardcoded response');
            return $this->getHardcodedFallback($type, $data);
        }

        if (!$this->ollamaService) {
            $this->ollamaService = app(OllamaService::class);
        }

        if (!$this->ollamaService->isAvailable()) {
            Log::warning('[OpenAIService] Ollama unavailable, using hardcoded response');
            return $this->getHardcodedFallback($type, $data);
        }

        Log::info('Using Ollama as fallback AI provider');

        if ($type === 'chat') {
            $result = $this->ollamaService->chatCompletion($data, $options);
            
            // If Ollama also fails, use hardcoded fallback
            if (!$result['success'] || empty($result['message'])) {
                Log::warning('[OpenAIService] Ollama fallback failed, using hardcoded response');
                return $this->getHardcodedFallback($type, $data);
            }
            
            $result['provider'] = 'ollama';
            return $result;
        } elseif ($type === 'embedding') {
            $result = $this->ollamaService->createEmbedding($data);
            $result['provider'] = 'ollama';
            return $result;
        }

        return $this->getHardcodedFallback($type, $data);
    }

    /**
     * Get hardcoded fallback response when all AI services fail
     */
    protected function getHardcodedFallback(string $type, $data): array
    {
        if ($type === 'chat') {
            // Extract user query from messages
            $userQuery = '';
            if (is_array($data)) {
                foreach (array_reverse($data) as $msg) {
                    if (isset($msg['role']) && $msg['role'] === 'user') {
                        $userQuery = strtolower($msg['content'] ?? '');
                        break;
                    }
                }
            }
            
            // Provide relevant hardcoded responses based on query
            $response = 'Maaf, sistem AI sedang mengalami gangguan teknis. Silakan coba lagi dalam beberapa saat atau hubungi sekolah langsung.';
            
            // Basic keyword matching for common queries - provide helpful info even when offline
            if (strpos($userQuery, 'ppdb') !== false || strpos($userQuery, 'pendaftaran') !== false || strpos($userQuery, 'daftar') !== false) {
                $response = "📌 **Informasi PPDB SMAN 1 Baleendah**\n\nMaaf, sistem AI sedang offline. Untuk informasi PPDB:\n\n✅ **Biaya:** GRATIS 100% (kebijakan Pemprov Jabar)\n✅ **Pendaftaran:** Melalui website PPDB Jawa Barat\n✅ **Jalur:** Zonasi, Afirmasi, Perpindahan Tugas Orang Tua, Prestasi\n\n📞 Hubungi sekolah untuk info lebih detail atau coba chat lagi nanti.";
            } elseif (strpos($userQuery, 'biaya') !== false || strpos($userQuery, 'spp') !== false || strpos($userQuery, 'gratis') !== false) {
                $response = "💰 **Info Biaya Sekolah**\n\nMaaf, sistem AI sedang offline.\n\n✅ **PENTING:** SMA Negeri se-Jawa Barat 100% GRATIS!\n\n- Tidak ada SPP/uang sekolah bulanan\n- Tidak ada biaya pendaftaran PPDB\n- Tidak ada pungutan wajib\n- Hanya iuran sukarela untuk ekstrakurikuler (opsional)\n\n📞 Hubungi sekolah atau coba chat lagi nanti.";
            } elseif (strpos($userQuery, 'alamat') !== false || strpos($userQuery, 'lokasi') !== false || strpos($userQuery, 'dimana') !== false || strpos($userQuery, 'jalan') !== false) {
                $response = "📍 **Lokasi SMAN 1 Baleendah**\n\nMaaf, sistem AI sedang offline.\n\nUntuk informasi alamat dan kontak sekolah:\n\n🌐 Cek halaman **Kontak** di website\n📞 Atau hubungi langsung ke sekolah\n\nSilakan coba chat lagi nanti ya!";
            } elseif (strpos($userQuery, 'ekstra') !== false || strpos($userQuery, 'ekstrakurikuler') !== false || strpos($userQuery, 'kegiatan') !== false) {
                $response = "🎯 **Info Ekstrakurikuler**\n\nMaaf, sistem AI sedang offline.\n\nSMAN 1 Baleendah memiliki berbagai ekstrakurikuler:\n- Olahraga (basket, voli, futsal, dll)\n- Seni (musik, tari, teater)\n- Sains (robotika, KIR)\n- Dan banyak lagi!\n\n📞 Hubungi sekolah untuk info lengkap atau coba chat lagi nanti.";
            }
            
            return [
                'success' => true,
                'message' => $response,
                'provider' => 'hardcoded_fallback',
                'data' => [],
            ];
        }
        
        return [
            'success' => false,
            'error' => 'All AI services unavailable',
            'message' => '',
            'embedding' => [],
            'provider' => 'none',
        ];
    }

    /**
     * Stream chat completion (for future enhancement)
     */
    public function streamChatCompletion(array $messages, callable $callback): void
    {
        // To be implemented for streaming responses
        // This would use SSE (Server-Sent Events)
    }
}
