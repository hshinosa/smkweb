<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QdrantService
{
    protected string $host;
    protected int $port;
    protected ?string $apiKey;
    protected string $collectionName = 'sman1_baleendah_rag';
    protected int $vectorSize = 1536; // OpenAI text-embedding-3-small dimension

    public function __construct()
    {
        // Default to localhost for local development
        // In Docker, set QDRANT_HOST=qdrant in .env
        $this->host = env('QDRANT_HOST', '127.0.0.1');
        $this->port = (int) env('QDRANT_PORT', 6333);
        $this->apiKey = env('QDRANT_API_KEY');
        
        Log::info('QdrantService initialized', [
            'host' => $this->host,
            'port' => $this->port,
            'collection' => $this->collectionName,
        ]);
    }

    protected function getBaseUrl(): string
    {
        return "http://{$this->host}:{$this->port}";
    }

    protected function getHeaders(): array
    {
        $headers = [
            'Content-Type' => 'application/json',
        ];

        if ($this->apiKey) {
            $headers['api-key'] = $this->apiKey;
        }

        return $headers;
    }

    /**
     * Check if collection exists, if not create it
     */
    public function ensureCollectionExists(): bool
    {
        $url = "{$this->getBaseUrl()}/collections/{$this->collectionName}";
        
        $response = Http::withHeaders($this->getHeaders())->get($url);

        if ($response->successful()) {
            return true;
        }

        if ($response->status() === 404) {
            return $this->createCollection();
        }

        Log::error('Failed to check Qdrant collection', ['status' => $response->status(), 'body' => $response->body()]);
        return false;
    }

    /**
     * Create collection
     */
    protected function createCollection(): bool
    {
        $url = "{$this->getBaseUrl()}/collections/{$this->collectionName}";
        
        $payload = [
            'vectors' => [
                'size' => $this->vectorSize,
                'distance' => 'Cosine',
            ],
        ];

        $response = Http::withHeaders($this->getHeaders())->put($url, $payload);

        if ($response->successful()) {
            Log::info("Qdrant collection '{$this->collectionName}' created successfully.");
            return true;
        }

        Log::error('Failed to create Qdrant collection', ['status' => $response->status(), 'body' => $response->body()]);
        return false;
    }

    /**
     * Upsert points (chunks)
     */
    public function upsertPoints(array $points): bool
    {
        $this->ensureCollectionExists();

        $url = "{$this->getBaseUrl()}/collections/{$this->collectionName}/points?wait=true";
        
        $response = Http::withHeaders($this->getHeaders())->put($url, [
            'points' => $points
        ]);

        if ($response->successful()) {
            return true;
        }

        Log::error('Failed to upsert points to Qdrant', ['status' => $response->status(), 'body' => $response->body()]);
        return false;
    }

    /**
     * Search points
     */
    public function search(array $vector, int $limit = 5): array
    {
        $this->ensureCollectionExists();

        $url = "{$this->getBaseUrl()}/collections/{$this->collectionName}/points/search";
        
        $payload = [
            'vector' => $vector,
            'limit' => $limit,
            'with_payload' => true,
        ];

        $response = Http::withHeaders($this->getHeaders())->post($url, $payload);

        if ($response->successful()) {
            return $response->json('result') ?? [];
        }

        Log::error('Failed to search Qdrant', ['status' => $response->status(), 'body' => $response->body()]);
        return [];
    }

    /**
     * Delete points by filter (e.g. document_id)
     */
    public function deletePointsByDocumentId(int $documentId): bool
    {
        $this->ensureCollectionExists();

        $url = "{$this->getBaseUrl()}/collections/{$this->collectionName}/points/delete";
        
        $payload = [
            'filter' => [
                'must' => [
                    [
                        'key' => 'document_id',
                        'match' => [
                            'value' => $documentId
                        ]
                    ]
                ]
            ]
        ];

        $response = Http::withHeaders($this->getHeaders())->post($url, $payload);

        if ($response->successful()) {
            return true;
        }

        Log::error('Failed to delete points from Qdrant', ['status' => $response->status(), 'body' => $response->body()]);
        return false;
    }
}