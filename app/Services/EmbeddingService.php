<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\AiSetting;

/**
 * Dedicated Embedding Service
 * Ensures consistent embeddings for RAG regardless of primary AI status
 */
class EmbeddingService
{
    protected string $provider; // 'openai' or 'ollama'
    protected string $baseUrl;
    protected string $apiKey;
    protected string $model;
    protected int $dimensions;

    public function __construct()
    {
        // FORCE Ollama for embeddings since primary API doesn't support it
        // Primary API is only for chat completion, not embeddings
        $this->provider = 'ollama'; // Always use Ollama for embeddings
        
        // Get Ollama base URL from AI settings (configured via Admin Panel)
        $this->baseUrl = AiSetting::get('ollama_base_url', 'http://localhost:32771');
        $this->model = AiSetting::get('ollama_embedding_model', 'nomic-embed-text');
        $this->dimensions = 768; // nomic-embed-text standard
        
        Log::info('EmbeddingService initialized', [
            'provider' => $this->provider,
            'base_url' => $this->baseUrl,
            'model' => $this->model,
            'dimensions' => $this->dimensions,
        ]);
    }

    /**
     * Create embedding with Ollama (forced - primary API doesn't support embeddings)
     */
    public function createEmbedding(string $text): array
    {
        return $this->createOllamaEmbedding($text);
    }

    /**
     * Get embedding dimensions for current provider
     */
    public function getDimensions(): int
    {
        return $this->dimensions;
    }

    /**
     * Get current provider name
     */
    public function getProvider(): string
    {
        return $this->provider;
    }

    /**
     * Create embedding using OpenAI-compatible API
     */
    protected function createOpenAIEmbedding(string $text): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post("{$this->baseUrl}/embeddings", [
                'model' => $this->model,
                'input' => $text,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'embedding' => $data['data'][0]['embedding'] ?? [],
                    'provider' => 'openai',
                    'dimensions' => count($data['data'][0]['embedding'] ?? []),
                ];
            }

            Log::error('OpenAI Embedding Error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => 'OpenAI embedding failed: ' . $response->body(),
                'embedding' => [],
            ];
        } catch (\Exception $e) {
            Log::error('OpenAI Embedding Exception', [
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
     * Create embedding using Ollama
     */
    protected function createOllamaEmbedding(string $text): array
    {
        try {
            $response = Http::timeout(30)->post("{$this->baseUrl}/api/embeddings", [
                'model' => $this->model,
                'prompt' => $text,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'embedding' => $data['embedding'] ?? [],
                    'provider' => 'ollama',
                    'dimensions' => count($data['embedding'] ?? []),
                ];
            }

            Log::error('Ollama Embedding Error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => 'Ollama embedding failed: ' . $response->body(),
                'embedding' => [],
            ];
        } catch (\Exception $e) {
            Log::error('Ollama Embedding Exception', [
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
     * Check if embedding service is available
     */
    public function isAvailable(): bool
    {
        try {
            // Only check Ollama since it's forced
            $response = Http::timeout(2)->get("{$this->baseUrl}/api/tags");
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }
}
