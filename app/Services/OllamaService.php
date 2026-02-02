<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\AiSetting;

/**
 * Optimized Ollama Service with performance enhancements
 * 
 * Performance optimizations:
 * - Model keep_alive to prevent cold starts
 * - Reduced max tokens for faster responses
 * - Response caching for common queries
 * - Connection pooling via persistent HTTP client
 * - Optimized inference parameters
 */
class OllamaService
{
    protected string $baseUrl;
    protected string $model;
    protected string $embeddingModel;
    
    // Performance tuning constants
    protected const DEFAULT_MAX_TOKENS = 250;      // Reduced for faster responses
    protected const DEFAULT_TEMPERATURE = 0.3;     // Lower for faster, deterministic responses
    protected const CHAT_TIMEOUT = 120;            // 2 minutes timeout
    protected const EMBEDDING_TIMEOUT = 30;
    protected const CACHE_TTL = 3600;              // 1 hour cache for similar queries
    protected const MODEL_KEEP_ALIVE = '30m';      // Keep model loaded for 30 minutes
    
    // Context window limits (in tokens)
    // llama3.2:1b supports up to 8k, but we limit to 4k for better performance
    protected const MAX_CONTEXT_TOKENS = 4096;     // Total context window limit
    protected const MAX_SYSTEM_TOKENS = 2500;      // Max tokens for system prompt (incl. RAG context)
    protected const MAX_HISTORY_TOKENS = 1000;     // Max tokens for conversation history
    protected const RESERVED_OUTPUT_TOKENS = 500;  // Reserve for model output

    public function __construct()
    {
        $this->baseUrl = AiSetting::get('ollama_base_url', '');
        $this->model = AiSetting::get('ollama_model', 'llama3.2:1b');
        $this->embeddingModel = AiSetting::get('ollama_embedding_model', 'nomic-embed-text:v1.5');
    }

    /**
     * Check if Ollama service is available and healthy
     * Quick health check with 2-second timeout for fast failure detection
     */
    public function isAvailable(): bool
    {
        if (empty($this->baseUrl)) {
            return false;
        }
        
        try {
            $response = Http::timeout(2)->get("{$this->baseUrl}/api/tags");
            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('[OllamaService] Health check failed', [
                'error' => $e->getMessage(),
                'baseUrl' => $this->baseUrl
            ]);
            return false;
        }
    }

    /**
     * Create chat completion with Ollama (optimized with graceful degradation)
     * 
     * Performance optimizations applied:
     * - keep_alive parameter to prevent model unloading
     * - Reduced num_predict for faster responses
     * - num_ctx reduced for memory efficiency
     * - Response caching for identical queries
     */
    public function chatCompletion(array $messages, array $options = []): array
    {
        // Circuit breaker: Check if service is healthy before making expensive call
        if (!$this->isAvailable()) {
            Log::warning('[OllamaService] Service unavailable, returning fallback response');
            return $this->getFallbackResponse();
        }

        try {
            // Convert OpenAI format to Ollama format
            $prompt = $this->convertMessagesToPrompt($messages);
            
            // Check cache for identical prompts (within 5 minute window)
            $cacheKey = 'ollama_chat_' . md5($prompt . $this->model);
            if (!($options['skip_cache'] ?? false)) {
                $cached = Cache::get($cacheKey);
                if ($cached) {
                    Log::info('[OllamaService] Cache hit', ['key' => $cacheKey]);
                    return $cached;
                }
            }

            // Optimized inference parameters
            $maxTokens = min($options['max_tokens'] ?? self::DEFAULT_MAX_TOKENS, 500);
            $temperature = $options['temperature'] ?? self::DEFAULT_TEMPERATURE;
            
            Log::info('[OllamaService] Sending request', [
                'model' => $this->model,
                'prompt_length' => strlen($prompt),
                'max_tokens' => $maxTokens,
            ]);

            $startTime = microtime(true);
            
            $response = Http::timeout(self::CHAT_TIMEOUT)->post("{$this->baseUrl}/api/generate", [
                'model' => $this->model,
                'prompt' => $prompt,
                'stream' => false,
                'keep_alive' => self::MODEL_KEEP_ALIVE, // Keep model loaded
                'options' => [
                    'temperature' => $temperature,
                    'num_predict' => $maxTokens,
                    'num_ctx' => self::MAX_CONTEXT_TOKENS,  // 4K context window
                    'num_thread' => 4,           // Match Docker CPU limit
                    'num_gpu' => 0,              // CPU-only mode
                    'top_k' => 20,               // Reduce sampling space
                    'top_p' => 0.8,              // Nucleus sampling
                    'repeat_penalty' => 1.1,     // Avoid repetition
                    'repeat_last_n' => 40,       // Only penalize last 40 tokens
                    'num_batch' => 512,          // Batch size for faster processing
                ],
            ]);

            $elapsed = round((microtime(true) - $startTime) * 1000);

            if ($response->successful()) {
                $data = $response->json();
                $result = [
                    'success' => true,
                    'data' => $data,
                    'message' => $data['response'] ?? '',
                    'elapsed_ms' => $elapsed,
                ];
                
                // Cache successful responses for 5 minutes
                if (!empty($result['message'])) {
                    Cache::put($cacheKey, $result, 300);
                }
                
                Log::info('[OllamaService] Response received', [
                    'elapsed_ms' => $elapsed,
                    'response_length' => strlen($result['message']),
                    'eval_count' => $data['eval_count'] ?? 0,
                ]);

                return $result;
            }

            Log::error('[OllamaService] API Error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'elapsed_ms' => $elapsed,
            ]);

            return [
                'success' => false,
                'error' => 'Ollama request failed: ' . $response->body(),
                'message' => '',
            ];
        } catch (\Exception $e) {
            Log::error('[OllamaService] Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return graceful fallback instead of error
            return $this->getFallbackResponse();
        }
    }

    /**
     * Get fallback response when AI service is unavailable
     * Provides helpful contact information instead of error message
     */
    protected function getFallbackResponse(): array
    {
        $siteSetting = \App\Models\SiteSetting::first();
        $phone = $siteSetting?->contact_phone ?? '(022) XXXX-XXXX';
        $email = $siteSetting?->contact_email ?? 'info@sman1baleendah.sch.id';

        return [
            'success' => true, // Important: return success to prevent error UI
            'message' => "Mohon maaf, layanan chatbot sedang dalam pemeliharaan. 🔧\n\n" .
                        "Untuk informasi lebih lanjut, silakan hubungi kami:\n\n" .
                        "📞 **Telepon:** {$phone}\n" .
                        "📧 **Email:** {$email}\n" .
                        "🕐 **Jam Operasional:** Senin-Jumat, 07:00-15:00 WIB\n\n" .
                        "Anda juga bisa menjelajahi website kami untuk informasi umum tentang sekolah.",
            'fallback' => true, // Flag to indicate this is a fallback response
            'elapsed_ms' => 0
        ];
    }

    /**
     * Generate embeddings using Ollama (optimized)
     */
    public function createEmbedding(string $text): array
    {
        try {
            // Cache embeddings for identical text
            $cacheKey = 'ollama_embed_' . md5($text . $this->embeddingModel);
            $cached = Cache::get($cacheKey);
            if ($cached) {
                return $cached;
            }

            $response = Http::timeout(self::EMBEDDING_TIMEOUT)->post("{$this->baseUrl}/api/embeddings", [
                'model' => $this->embeddingModel,
                'prompt' => $text,
                'keep_alive' => '10m', // Keep embedding model loaded
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $result = [
                    'success' => true,
                    'embedding' => $data['embedding'] ?? [],
                ];
                
                // Cache embeddings for 1 hour (they don't change)
                Cache::put($cacheKey, $result, self::CACHE_TTL);
                
                return $result;
            }

            Log::error('[OllamaService] Embedding Error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => 'Ollama embedding failed: ' . $response->body(),
                'embedding' => [],
            ];
        } catch (\Exception $e) {
            Log::error('[OllamaService] Embedding Exception', [
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'embedding' => [],
            ];
        }
    }

    /**
     * Convert OpenAI message format to Ollama prompt (optimized)
     * Uses a more compact format to reduce token count
     *
     * Implements 4K context window limit:
     * - System prompt (incl. RAG context): max ~2500 tokens (~10000 chars)
     * - Conversation history: max ~1000 tokens (~4000 chars)
     * - Reserve ~500 tokens for output
     */
    protected function convertMessagesToPrompt(array $messages): string
    {
        $parts = [];
        $totalTokensUsed = 0;
        $availableTokens = self::MAX_CONTEXT_TOKENS - self::RESERVED_OUTPUT_TOKENS;
        
        // Character to token ratio (rough estimate: 1 token ≈ 4 chars for Indonesian/English)
        $charPerToken = 4;
        $maxSystemChars = self::MAX_SYSTEM_TOKENS * $charPerToken;  // ~10000 chars
        $maxHistoryChars = self::MAX_HISTORY_TOKENS * $charPerToken; // ~4000 chars
        
        $historyTokensUsed = 0;

        foreach ($messages as $message) {
            $role = $message['role'];
            $content = trim($message['content']);
            
            // Smart truncation based on role
            switch ($role) {
                case 'system':
                    // System prompt gets the most space (includes RAG context)
                    if (strlen($content) > $maxSystemChars) {
                        // Truncate but try to keep complete sentences
                        $content = $this->smartTruncate($content, $maxSystemChars);
                        Log::info('[OllamaService] System prompt truncated', [
                            'original_length' => strlen($message['content']),
                            'truncated_length' => strlen($content),
                            'max_chars' => $maxSystemChars
                        ]);
                    }
                    $parts[] = "[SISTEM]\n{$content}";
                    $totalTokensUsed += $this->estimateTokens($content);
                    break;
                    
                case 'user':
                case 'assistant':
                    // Conversation history shares a limited budget
                    $contentTokens = $this->estimateTokens($content);
                    
                    // If this message would exceed history budget, truncate
                    if ($historyTokensUsed + $contentTokens > self::MAX_HISTORY_TOKENS) {
                        $remainingTokens = self::MAX_HISTORY_TOKENS - $historyTokensUsed;
                        if ($remainingTokens > 50) { // Only include if we have meaningful space
                            $maxChars = $remainingTokens * $charPerToken;
                            $content = $this->smartTruncate($content, $maxChars);
                            $contentTokens = $this->estimateTokens($content);
                        } else {
                            // Skip this message if no space left
                            continue 2; // Continue outer foreach loop, not switch
                        }
                    }
                    
                    $tag = $role === 'user' ? 'USER' : 'ASISTEN';
                    $parts[] = "[{$tag}]\n{$content}";
                    $historyTokensUsed += $contentTokens;
                    $totalTokensUsed += $contentTokens;
                    break;
            }
        }

        $prompt = implode("\n\n", $parts) . "\n\n[ASISTEN]\n";
        
        // Log context usage for monitoring
        Log::info('[OllamaService] Context window usage', [
            'total_tokens_estimated' => $totalTokensUsed,
            'history_tokens' => $historyTokensUsed,
            'prompt_length_chars' => strlen($prompt),
            'max_context' => self::MAX_CONTEXT_TOKENS,
        ]);
        
        return $prompt;
    }
    
    /**
     * Smart truncation that tries to preserve complete sentences
     */
    protected function smartTruncate(string $text, int $maxChars): string
    {
        if (strlen($text) <= $maxChars) {
            return $text;
        }
        
        // First, hard truncate to max length
        $truncated = substr($text, 0, $maxChars);
        
        // Try to find the last complete sentence (ending with . ! ?)
        $lastSentenceEnd = max(
            strrpos($truncated, '. ') ?: 0,
            strrpos($truncated, '! ') ?: 0,
            strrpos($truncated, '? ') ?: 0,
            strrpos($truncated, ".\n") ?: 0
        );
        
        // If we found a sentence end in the last 30% of the text, use it
        if ($lastSentenceEnd > $maxChars * 0.7) {
            return substr($truncated, 0, $lastSentenceEnd + 1) . '...';
        }
        
        // Otherwise, try to end at a newline or paragraph break
        $lastNewline = strrpos($truncated, "\n\n") ?: strrpos($truncated, "\n") ?: 0;
        if ($lastNewline > $maxChars * 0.7) {
            return substr($truncated, 0, $lastNewline) . '...';
        }
        
        // Fallback: just truncate with ellipsis
        return $truncated . '...';
    }
    
    /**
     * Estimate token count for text (rough approximation)
     * Uses ~4 characters per token for Indonesian/English text
     */
    protected function estimateTokens(string $text): int
    {
        return (int) ceil(strlen($text) / 4);
    }

    /**
     * Get available models from Ollama
     */
    public function getAvailableModels(): array
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/api/tags");

            if ($response->successful()) {
                $data = $response->json();
                return $data['models'] ?? [];
            }

            return [];
        } catch (\Exception $e) {
            Log::error('[OllamaService] Failed to get models', [
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Warm up the model by sending a minimal request
     * This keeps the model loaded in memory for subsequent requests
     */
    public function warmUp(): bool
    {
        try {
            Log::info('[OllamaService] Warming up model', ['model' => $this->model]);
            
            $response = Http::timeout(180)->post("{$this->baseUrl}/api/generate", [
                'model' => $this->model,
                'prompt' => 'Hi',
                'stream' => false,
                'keep_alive' => self::MODEL_KEEP_ALIVE,
                'options' => [
                    'num_predict' => 1, // Generate just 1 token
                ],
            ]);

            if ($response->successful()) {
                Log::info('[OllamaService] Model warmed up successfully');
                return true;
            }

            Log::warning('[OllamaService] Warm-up failed', [
                'status' => $response->status(),
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('[OllamaService] Warm-up exception', [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Check if model is currently loaded in memory
     */
    public function isModelLoaded(): bool
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/api/ps");
            
            if ($response->successful()) {
                $data = $response->json();
                $models = $data['models'] ?? [];
                
                foreach ($models as $model) {
                    if (str_starts_with($model['name'] ?? '', $this->model)) {
                        return true;
                    }
                }
            }
            
            return false;
        } catch (\Exception $e) {
            return false;
        }
    }
}
