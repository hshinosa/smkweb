<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\AiSetting;

class OllamaService
{
    protected string $baseUrl;
    protected string $model;
    protected string $embeddingModel;

    public function __construct()
    {
        $this->baseUrl = AiSetting::get('ollama_base_url', '');
        $this->model = AiSetting::get('ollama_model', 'llama3.2');
        $this->embeddingModel = AiSetting::get('ollama_embedding_model', 'nomic-embed-text:v1.5');
    }

    /**
     * Check if Ollama service is available
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
            return false;
        }
    }

    /**
     * Create chat completion with Ollama
     */
    public function chatCompletion(array $messages, array $options = []): array
    {
        try {
            // Convert OpenAI format to Ollama format
            $prompt = $this->convertMessagesToPrompt($messages);

            $response = Http::timeout(60)->post("{$this->baseUrl}/api/generate", [
                'model' => $this->model,
                'prompt' => $prompt,
                'stream' => false,
                'options' => [
                    'temperature' => $options['temperature'] ?? 0.7,
                    'num_predict' => $options['max_tokens'] ?? 2000,
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'data' => $data,
                    'message' => $data['response'] ?? '',
                ];
            }

            Log::error('Ollama API Error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => 'Ollama request failed: ' . $response->body(),
                'message' => '',
            ];
        } catch (\Exception $e) {
            Log::error('Ollama Service Exception', [
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'message' => '',
            ];
        }
    }

    /**
     * Generate embeddings using Ollama
     */
    public function createEmbedding(string $text): array
    {
        try {
            $response = Http::timeout(30)->post("{$this->baseUrl}/api/embeddings", [
                'model' => $this->embeddingModel,
                'prompt' => $text,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'embedding' => $data['embedding'] ?? [],
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
     * Convert OpenAI message format to Ollama prompt
     */
    protected function convertMessagesToPrompt(array $messages): string
    {
        $prompt = '';

        foreach ($messages as $message) {
            $role = $message['role'];
            $content = $message['content'];

            if ($role === 'system') {
                $prompt .= "System: {$content}\n\n";
            } elseif ($role === 'user') {
                $prompt .= "User: {$content}\n\n";
            } elseif ($role === 'assistant') {
                $prompt .= "Assistant: {$content}\n\n";
            }
        }

        $prompt .= "Assistant: ";

        return $prompt;
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
            Log::error('Failed to get Ollama models', [
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }
}
