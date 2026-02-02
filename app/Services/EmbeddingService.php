<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\AiSetting;

/**
 * Dedicated Embedding Service
 * Uses Ollama for embeddings (OpenAI embedding endpoint not configured)
 */
class EmbeddingService
{
    protected string $provider; // 'ollama'
    protected string $baseUrl;
    protected string $model;
    protected int $dimensions;

    public function __construct()
    {
        // Use OLLAMA ONLY for embeddings
        // Note: OpenAI embedding endpoint is not configured, so we skip it entirely
        $this->provider = 'ollama';

        // Get Ollama settings
        $this->baseUrl = AiSetting::get('ollama_base_url', 'http://localhost:32771');
        $this->model = AiSetting::get('ollama_embedding_model', 'nomic-embed-text:v1.5');
        $this->dimensions = 768; // nomic-embed-text:v1.5 standard

        Log::info('EmbeddingService initialized', [
            'provider' => $this->provider,
            'base_url' => $this->baseUrl,
            'model' => $this->model,
            'dimensions' => $this->dimensions,
        ]);
    }

    /**
     * Create embedding using Ollama (primary and only provider)
     */
    public function createEmbedding(string $text): array
    {
        $startTime = microtime(true);

        Log::info('[EmbeddingService] Embedding requested', [
            'provider' => $this->provider,
            'text_length' => strlen($text),
        ]);

        // Use Ollama directly (no OpenAI fallback)
        Log::info('[EmbeddingService] Using Ollama for embedding');
        $result = $this->createOllamaEmbedding($text);
        $elapsed = round((microtime(true) - $startTime) * 1000);
        $result['elapsed_ms'] = $elapsed;

        if ($result['success']) {
            Log::info('[EmbeddingService] Ollama embedding successful', [
                'elapsed_ms' => $elapsed,
                'dimensions' => $result['dimensions'] ?? 0,
            ]);
        } else {
            Log::error('[EmbeddingService] Ollama embedding failed', [
                'elapsed_ms' => $elapsed,
                'error' => $result['error'] ?? 'Unknown',
            ]);
        }

        return $result;
    }

    /**
     * Get embedding dimensions for current provider
     */
    public function getDimensions(): int
    {
        return $this->dimensions;
    }

    /**
     * Get current provider name (primary provider)
     */
    public function getProvider(): string
    {
        return $this->provider;
    }

    /**
     * Check if embedding service is available (Ollama only)
     */
    public function isAvailable(): bool
    {
        // Only check Ollama
        if (empty($this->baseUrl)) {
            Log::warning('[EmbeddingService] Ollama base URL not configured');
            return false;
        }

        try {
            $response = Http::timeout(2)->get("{$this->baseUrl}/api/tags");
            if ($response->successful()) {
                Log::info('[EmbeddingService] Ollama is available', ['base_url' => $this->baseUrl]);
                return true;
            }
        } catch (\Exception $e) {
            Log::warning('[EmbeddingService] Ollama not available', [
                'base_url' => $this->baseUrl,
                'error' => $e->getMessage(),
            ]);
        }

        return false;
    }

    /**
     * Create embedding using Ollama API
     */
    protected function createOllamaEmbedding(string $text): array
    {
        $startTime = microtime(true);

        try {
            Log::info('[EmbeddingService] Sending request to Ollama', [
                'model' => $this->model,
                'base_url' => $this->baseUrl,
            ]);

            $response = Http::timeout(30)->post("{$this->baseUrl}/api/embeddings", [
                'model' => $this->model,
                'prompt' => $text,
            ]);

            $elapsed = round((microtime(true) - $startTime) * 1000);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('[EmbeddingService] Ollama response successful', [
                    'elapsed_ms' => $elapsed,
                    'dimensions' => count($data['embedding'] ?? []),
                ]);
                return [
                    'success' => true,
                    'embedding' => $data['embedding'] ?? [],
                    'provider' => 'ollama',
                    'dimensions' => count($data['embedding'] ?? []),
                ];
            }

            Log::error('[EmbeddingService] Ollama Embedding Error', [
                'status' => $response->status(),
                'body' => substr($response->body(), 0, 200),
                'elapsed_ms' => $elapsed,
            ]);

            return [
                'success' => false,
                'error' => 'Ollama embedding failed: ' . substr($response->body(), 0, 200),
                'embedding' => [],
            ];
        } catch (\Exception $e) {
            $elapsed = round((microtime(true) - $startTime) * 1000);
            Log::error('[EmbeddingService] Ollama Embedding Exception', [
                'message' => $e->getMessage(),
                'type' => get_class($e),
                'elapsed_ms' => $elapsed,
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'embedding' => [],
            ];
        }
    }
}
