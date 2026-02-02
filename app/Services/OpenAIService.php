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
    protected ?OllamaService $ollamaService = null;
    protected bool $useOllamaFallback;

    public function __construct(?OllamaService $ollamaService = null)
    {
        // Lazy load settings to avoid database access during boot
        // Use environment variables as defaults for CLIProxyAPI
        $this->baseUrl = env('CLIPROXY_BASE_URL', '');
        $this->apiKey = env('CLIPROXY_API_KEY', '');
        $this->model = env('CLIPROXY_MODEL', 'gemini-claude-sonnet-4-5-thinking');
        $this->useOllamaFallback = true;
        $this->ollamaService = $ollamaService;
    }

    /**
     * Get AI settings with fallback to environment variables and defaults
     */
    protected function loadSettings(): void
    {
        try {
            // Try to load from database first
            $dbBaseUrl = AiSetting::get('ai_model_base_url');
            $dbApiKey = AiSetting::get('ai_model_api_key');
            $dbModel = AiSetting::get('ai_model_name');
            
            // Use database values if set, otherwise fall back to environment variables
            $this->baseUrl = !empty($dbBaseUrl) ? (string) $dbBaseUrl : env('CLIPROXY_BASE_URL', '');
            $this->apiKey = !empty($dbApiKey) ? (string) $dbApiKey : env('CLIPROXY_API_KEY', '');
            $this->model = !empty($dbModel) ? $dbModel : env('CLIPROXY_MODEL', 'gemini-claude-sonnet-4-5-thinking');
            $this->useOllamaFallback = AiSetting::get('use_ollama_fallback', true);
        } catch (\Exception $e) {
            // Use environment variables if database is not ready
            $this->baseUrl = env('CLIPROXY_BASE_URL', '');
            $this->apiKey = env('CLIPROXY_API_KEY', '');
            $this->model = env('CLIPROXY_MODEL', 'gemini-claude-sonnet-4-5-thinking');
            $this->useOllamaFallback = true;
            
            Log::warning('[OpenAIService] Could not load AI settings, using environment variables', [
                'error' => $e->getMessage(),
            ]);
        }
    }
    
    /**
     * Create chat completion with priority to OpenAI, fallback to Ollama
     *
     * @param array $messages Chat messages in OpenAI format
     * @param array $options Additional options (max_tokens, temperature, force_provider)
     * @return array Response with success, message, and provider
     */
    public function chatCompletion(array $messages, array $options = []): array
    {
        $startTime = microtime(true);

        // Load settings first before checking provider availability
        $this->loadSettings();

        // Log AI service configuration
        Log::info('[OpenAIService] Chat completion requested', [
            'has_openai_credentials' => !empty($this->baseUrl) && !empty($this->apiKey),
            'openai_base_url' => $this->baseUrl ? $this->maskSensitiveData($this->baseUrl) : 'NOT_SET',
            'openai_model' => $this->model,
            'use_ollama_fallback' => $this->useOllamaFallback,
            'num_messages' => count($messages),
        ]);

        // Check if specific provider is forced
        $forceProvider = $options['force_provider'] ?? null;

        if ($forceProvider) {
            Log::info('[OpenAIService] Provider forced', ['provider' => $forceProvider]);
        }

        // Priority 1: Try OpenAI first (primary provider for better quality)
        if ($forceProvider !== 'ollama' && !empty($this->baseUrl) && !empty($this->apiKey)) {
            Log::info('[OpenAIService] Attempting OpenAI as primary provider');
            $openAiResult = $this->tryOpenAI($messages, $options);

            if ($openAiResult['success']) {
                $elapsed = round((microtime(true) - $startTime) * 1000);
                Log::info('[OpenAIService] OpenAI request successful', [
                    'provider' => 'openai',
                    'elapsed_ms' => $elapsed,
                    'message_length' => strlen($openAiResult['message'] ?? ''),
                ]);
                return $openAiResult;
            }

            // OpenAI failed, log and prepare for fallback
            Log::warning('[OpenAIService] OpenAI failed, will try Ollama fallback', [
                'error' => $openAiResult['error'] ?? 'Unknown error',
                'elapsed_ms' => round((microtime(true) - $startTime) * 1000),
            ]);
        }
        
        // Priority 2: Fallback to Ollama (or forced for testing)
        // Always try Ollama as fallback when OpenAI fails
        if ($forceProvider !== 'openai') {
            Log::info('[OpenAIService] Attempting Ollama as fallback provider');
            $ollamaResult = $this->tryOllama('chat', $messages, $options);
            
            if ($ollamaResult['success']) {
                Log::info('[OpenAIService] Ollama fallback successful');
                return $ollamaResult;
            }
            
            Log::warning('[OpenAIService] Ollama fallback also failed', [
                'error' => $ollamaResult['error'] ?? 'Unknown error',
            ]);
        }
        
        // Priority 3: Try OpenAI again if Ollama was forced but failed
        if ($forceProvider === 'ollama' && !empty($this->baseUrl) && !empty($this->apiKey)) {
            Log::info('[OpenAIService] Ollama was forced but failed, trying OpenAI as last resort');
            $openAiResult = $this->tryOpenAI($messages, $options);

            if ($openAiResult['success']) {
                $elapsed = round((microtime(true) - $startTime) * 1000);
                Log::info('[OpenAIService] OpenAI last resort successful', [
                    'elapsed_ms' => $elapsed,
                    'message_length' => strlen($openAiResult['message'] ?? ''),
                ]);
                return $openAiResult;
            }
        }

        // Priority 4: Hardcoded fallback
        $elapsed = round((microtime(true) - $startTime) * 1000);
        Log::error('[OpenAIService] All providers failed, using hardcoded fallback', [
            'elapsed_ms' => $elapsed,
        ]);
        return $this->getHardcodedFallback('chat', $messages);
    }
    
    /**
     * Try OpenAI API (single attempt, no retry - fast fallback to Ollama)
     */
    protected function tryOpenAI(array $messages, array $options = []): array
    {
        $startTime = microtime(true);
        // OPTIMIZATION: Reduce max_tokens for faster responses (200-300 is enough for chatbot)
        $maxTokens = $options['max_tokens'] ?? AiSetting::get('ai_max_tokens', 300);
        // OPTIMIZATION: Lower temperature for faster, more deterministic responses
        $temperature = $options['temperature'] ?? (float) AiSetting::get('ai_temperature', 0.3);
        // OPTIMIZATION: Add top_p for faster sampling
        $topP = $options['top_p'] ?? 0.8;

        try {
            Log::info('[OpenAIService] Attempting OpenAI request', [
                'timeout' => 120,
                'base_url' => $this->maskSensitiveData($this->baseUrl),
                'model' => $this->model,
                'max_tokens' => $maxTokens,
                'temperature' => $temperature,
                'top_p' => $topP,
                'num_messages' => count($messages),
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(120) // 2 minute timeout
              ->connectTimeout(30) // 30 second connection timeout
              ->retry(1, 100) // Retry once with 100ms delay on connection failure
              ->post("{$this->baseUrl}/chat/completions", [
                'model' => $this->model,
                'messages' => $messages,
                'max_tokens' => (int) $maxTokens,
                'temperature' => $temperature,
                'top_p' => $topP, // Nucleus sampling for faster generation
                'frequency_penalty' => 0.1, // Reduce repetition
                'presence_penalty' => 0.1,  // Encourage novelty (kept low for speed)
                'stream' => false,
            ]);

            $elapsed = round((microtime(true) - $startTime) * 1000);

            if ($response->successful()) {
                $data = $response->json();

                // Validate response structure
                if (!isset($data['choices']) || empty($data['choices'])) {
                    Log::warning('[OpenAIService] API returned empty choices', [
                        'elapsed_ms' => $elapsed,
                    ]);
                    return ['success' => false, 'error' => 'Empty response from API'];
                }

                $message = $data['choices'][0]['message']['content'] ?? '';

                if (empty($message)) {
                    Log::warning('[OpenAIService] API returned empty message', [
                        'elapsed_ms' => $elapsed,
                    ]);
                    return ['success' => false, 'error' => 'Empty message from API'];
                }

                Log::info('[OpenAIService] Request successful', [
                    'elapsed_ms' => $elapsed,
                    'message_length' => strlen($message),
                    'tokens_used' => $data['usage']['total_tokens'] ?? 0,
                ]);

                return [
                    'success' => true,
                    'data' => $data,
                    'message' => $message,
                    'provider' => 'openai',
                    'elapsed_ms' => $elapsed,
                ];
            }

            Log::warning('[OpenAIService] API request failed', [
                'status' => $response->status(),
                'body_preview' => substr($response->body(), 0, 200),
                'elapsed_ms' => $elapsed,
            ]);

            // Don't retry on any HTTP errors - fallback to Ollama immediately
            if ($response->status() >= 400 && $response->status() < 500) {
                return ['success' => false, 'error' => 'Client error: ' . $response->status()];
            }

            // Server errors (5xx including 522) - don't retry, fallback to Ollama
            return ['success' => false, 'error' => 'Server error: ' . $response->status()];

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            $elapsed = round((microtime(true) - $startTime) * 1000);
            Log::error('[OpenAIService] Connection Exception', [
                'message' => $e->getMessage(),
                'is_timeout' => str_contains($e->getMessage(), 'timed out'),
                'elapsed_ms' => $elapsed,
            ]);
            return ['success' => false, 'error' => 'Connection timeout: ' . $e->getMessage()];
        } catch (\Exception $e) {
            $elapsed = round((microtime(true) - $startTime) * 1000);
            Log::error('[OpenAIService] Exception', [
                'message' => $e->getMessage(),
                'type' => get_class($e),
                'elapsed_ms' => $elapsed,
            ]);
            return ['success' => false, 'error' => 'Exception: ' . $e->getMessage()];
        }
    }
    
    /**
     * Try Ollama local AI (fallback provider)
     */
    protected function tryOllama(string $type, $data, array $options = []): array
    {
        $startTime = microtime(true);

        try {
            if (!$this->ollamaService) {
                $this->ollamaService = app(OllamaService::class);
            }

            if (!$this->ollamaService->isAvailable()) {
                Log::info('[OpenAIService] Ollama service not available');
                return ['success' => false, 'error' => 'Ollama service not available'];
            }

            Log::info('[OpenAIService] Using Ollama as fallback AI provider', [
                'type' => $type,
            ]);

            if ($type === 'chat') {
                $result = $this->ollamaService->chatCompletion($data, $options);

                if (!$result['success'] || empty($result['message'])) {
                    $elapsed = round((microtime(true) - $startTime) * 1000);
                    Log::warning('[OpenAIService] Ollama chat completion failed or returned empty message', [
                        'elapsed_ms' => $elapsed,
                        'error' => $result['error'] ?? 'Unknown',
                    ]);
                    return ['success' => false, 'error' => 'Ollama returned empty response'];
                }

                $elapsed = round((microtime(true) - $startTime) * 1000);
                $result['provider'] = 'ollama';
                $result['elapsed_ms'] = $elapsed;
                Log::info('[OpenAIService] Ollama fallback successful', [
                    'elapsed_ms' => $elapsed,
                    'message_length' => strlen($result['message']),
                ]);
                return $result;
            } elseif ($type === 'embedding') {
                $result = $this->ollamaService->createEmbedding($data);
                if (!$result['success']) {
                    $elapsed = round((microtime(true) - $startTime) * 1000);
                    Log::warning('[OpenAIService] Ollama embedding failed', [
                        'elapsed_ms' => $elapsed,
                    ]);
                    return ['success' => false, 'error' => 'Ollama embedding failed'];
                }
                $result['provider'] = 'ollama';
                $result['elapsed_ms'] = round((microtime(true) - $startTime) * 1000);
                return $result;
            }
        } catch (\Exception $e) {
            $elapsed = round((microtime(true) - $startTime) * 1000);
            Log::error('[OpenAIService] Ollama exception', [
                'message' => $e->getMessage(),
                'type' => get_class($e),
                'elapsed_ms' => $elapsed,
            ]);
            return ['success' => false, 'error' => 'Ollama exception: ' . $e->getMessage()];
        }

        return ['success' => false, 'error' => 'Invalid Ollama type'];
    }

    /**
     * Generate embeddings for text (Ollama only - OpenAI embedding endpoint not configured)
     */
    public function createEmbedding(string $text): array
    {
        $startTime = microtime(true);

        // Load settings on first use
        $this->loadSettings();

        Log::info('[OpenAIService] Embedding requested', [
            'provider' => 'ollama',
            'text_length' => strlen($text),
        ]);

        // Use Ollama directly for embeddings (OpenAI embedding endpoint not configured)
        Log::info('[OpenAIService] Using Ollama for embedding');
        $ollamaResult = $this->tryOllama('embedding', $text);
        $elapsed = round((microtime(true) - $startTime) * 1000);

        if ($ollamaResult['success']) {
            Log::info('[OpenAIService] Ollama embedding successful', [
                'elapsed_ms' => $elapsed,
                'dimensions' => count($ollamaResult['embedding'] ?? []),
            ]);
            return $ollamaResult;
        }

        Log::error('[OpenAIService] Ollama embedding failed', [
            'elapsed_ms' => $elapsed,
            'error' => $ollamaResult['error'] ?? 'Unknown',
        ]);
        return [
            'success' => false,
            'error' => 'No embedding service available',
            'embedding' => [],
        ];
    }
    
    /**
     * Fallback to Ollama local AI (deprecated - use tryOllama instead)
     * @deprecated Use tryOllama() instead
     */
    protected function fallbackToOllama(string $type, $data, array $options = []): array
    {
        return $this->tryOllama($type, $data, $options);
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
            } elseif (strpos($userQuery, 'program') !== false || strpos($userQuery, 'studi') !== false || strpos($userQuery, 'jurusan') !== false || strpos($userQuery, 'peminatan') !== false || strpos($userQuery, 'mipa') !== false || strpos($userQuery, 'ips') !== false) {
                $response = "📚 **Program Studi SMAN 1 Baleendah**\n\nMaaf, sistem AI sedang offline.\n\nSMAN 1 Baleendah menawarkan 3 program peminatan:\n\n✅ **MIPA** - Matematika dan Ilmu Pengetahuan Alam\n✅ **IPS** - Ilmu Pengetahuan Sosial\n✅ **Bahasa** - Bahasa dan Sastra\n\nPemilihan peminatan dilakukan di kelas X berdasarkan minat, bakat, dan nilai rapor.\n\n📞 Hubungi sekolah untuk info lebih detail atau coba chat lagi nanti.";
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

    /**
     * Mask sensitive data for logging (API keys, URLs)
     */
    protected function maskSensitiveData(string $data): string
    {
        if (empty($data)) {
            return 'EMPTY';
        }

        // Mask API keys (show first 4 and last 4 chars)
        if (strlen($data) > 10 && !filter_var($data, FILTER_VALIDATE_URL)) {
            return substr($data, 0, 4) . '...' . substr($data, -4);
        }

        // Mask URLs (show domain only)
        if (filter_var($data, FILTER_VALIDATE_URL)) {
            $parsed = parse_url($data);
            return $parsed['host'] ?? 'URL';
        }

        return $data;
    }
}
