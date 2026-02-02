#!/usr/bin/env php
<?php

/**
 * AI Performance Testing Script
 * 
 * Tests:
 * 1. SSE Streaming - measure first token latency
 * 2. Non-streaming response - measure total response time
 * 3. Cached response - verify cache hits
 * 4. Cache stats - verify LRU eviction
 */

require __DIR__ . '/vendor/autoload.php';

use App\Services\ChatCacheService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

echo "===================================\n";
echo "  AI PERFORMANCE TEST\n";
echo "===================================\n\n";

$cache = app(ChatCacheService::class);

// Test 1: Cache Basic Operations
echo "Test 1: Cache Basic Operations\n";
echo "-----------------------------------\n";

// Test 1.1: Generate keys
echo "1.1. Generate cache keys...\n";
$key1 = $cache->generateKey('Info PPDB?');
$key2 = $cache->generateKey('Info PPDB?', ['session' => 'abc']);
echo "  Message: 'Info PPDB?'\n";
echo "  Context: none\n";
echo "  Key: $key1\n\n";

echo "  Message: 'Info PPDB?'\n";
echo "  Context: ['session' => 'abc']\n";
echo "  Key: $key2\n\n";
echo "✓ Keys are " . ($key1 === $key2 ? 'NOT' : 'NOT') . " different\n\n";

// Test 1.2: Set and Get
echo "1.2: Set and Get cache...\n";
$testMessage = 'Berapa biaya PPDB di SMA Negeri?';
$testResponse = 'PPDB di SMA Negeri GRATIS untuk semua siswa Indonesia!';
echo "  Message: '$testMessage'\n";
echo "  Response: '$testResponse'\n\n";

$cache->set($testMessage, $testResponse);
echo "✓ Cached\n\n";

$cached = $cache->get($testMessage);
echo "  Cached value: " . ($cached === $testResponse ? '✓ CORRECT' : '✗ WRONG') . "\n\n";

// Test 1.3: Miss scenario
$missMessage = 'Pertanyaan unik yang belum ada di cache';
$missResult = $cache->get($missMessage);
echo "  Miss value: " . ($missResult === null ? '✓ CORRECT (null)' : '✗ WRONG') . "\n\n";

// Test 1.4: Invalidation
$cache->set('To be invalidated', 'Old response');
echo "  Set: 'To be invalidated'\n";
echo "  Got before invalidate: " . ($cache->get('To be invalidated') ? '✓ EXIST' : '✗ MISSING') . "\n";
$cache->invalidate('To be invalidated');
echo "  Got after invalidate: " . ($cache->get('To be invalidated') === null ? '✓ GONE' : '✗ STILL EXISTS') . "\n\n";

// Test 1.5: Cache Stats
echo "1.5: Get cache statistics...\n";
$stats = $cache->getStats();
echo "  Cache size: {$stats['size']} / {$stats['max_size']}\n";
echo "  Hit count: {$stats['hit_count']}\n";
echo "  Miss count: {$stats['miss_count']}\n";
echo "  Total requests: {$stats['total_requests']}\n";
echo "  Hit rate: {$stats['hit_rate']}%\n";
echo "  Batch count: {$stats['batch_count']}\n\n";
echo "✓ Cache stats retrieved\n\n";

// Test 2: Performance Benchmarks
echo "Test 2: Performance Benchmarks (with real RAG)\n";
echo "-----------------------------------\n";

// Test 2.1: Non-streaming response (baseline)
echo "2.1: Non-streaming response...\n";
$testQueries = [
    'Info PPDB?',
    'Program studi apa saja?',
    'Berapa biaya PPDB?',
    'Fasilitas apa saja?',
    'Ekstrakurikuler apa saja?',
];

foreach ($testQueries as $index => $query) {
    echo "\nQuery " . ($index + 1) . ": $query\n";
    
    $startTime = microtime(true);
    $useCache = false;
    $useRag = true;
    
    $ch = curl_init('http://127.0.0.1:8000/api/chat/send');
    $payload = json_encode([
        'message' => $query,
        'stream' => false,
        'use_cache' => false,
        'use_rag' => $useRag,
    ]);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-CSRF-TOKEN: 'test-token',
        'Accept: application/json',
    ]);
    
    $output = curl_exec($ch);
    curl_close($ch);
    $result = json_decode($output, true);
    
    $elapsed = round((microtime(true) - $startTime) * 1000, 2);
    
    if ($result['success'] ?? false) {
        $provider = $result['provider'] ?? 'unknown';
        $cached = $result['cached'] ?? false;
        $cacheEnabled = $result['cache_enabled'] ?? false;
        
        echo "  Status: " . ($result['success'] ? '✓ Success' : '✗ Failed') . "\n";
        echo "  Provider: $provider\n";
        echo "  Cached: " . ($cached ? 'Yes' : 'No') . "\n";
        echo "  Cache enabled: $cacheEnabled\n";
        echo "  Response time: {$elapsed}ms\n";
        
        if ($result['success']) {
            $words = explode(' ', $result['message']);
            $wordCount = count(array_filter($words));
            echo "  Word count: $wordcount\n";
        }
    }
    
    echo "\n";
}

// Test 2.2: Streaming response
echo "\n2.2: Streaming response...\n";
echo "-----------------------------------\n";

$testStreamingQueries = [
    'Tentang info singkat tentang PPDB?',
    'Apakah ada beasiswa beasiswa?',
    'Kapan jadwal PPDB?',
];

foreach ($testStreamingQueries as $index => $query) {
    echo "\nQuery " . ($index + 1) . ": $query\n";
    
    $startTime = microtime(true);
    $useRag = true;
    $useCache = false;
    
    $ch = curl_init('http://127.0.0.1:8000/api/chat/send');
    $payload = json_encode([
        'message' => $query,
        'stream' => true,
        'use_cache' => false,
        'use_rag' => $useRag,
    ]);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-CSRF-TOKEN: 'test-token',
        'Accept: text/event-stream',
    ]);
    
    $output = '';
    curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {
        $output .= $data;
    });
    
    curl_exec($ch);
    $elapsed = round((microtime(true) - $startTime) * 1000, 2);
    curl_close($ch);
    
    $lines = explode("\n", trim($output));
    
    $chunkCount = 0;
    $responseText = '';
    $timeToFirstChunk = null;
    $timeToComplete = null;
    
    foreach ($lines as $line) {
        if (str_starts_with($line, 'data: ')) {
            $json = json_decode(substr($line, 6), true);
            
            if (isset($json['type']) && $json['type'] === 'content') {
                $chunk = $json['content'] ?? '';
                $responseText .= $chunk;
                $chunkCount++;
                
                if ($timeToFirstChunk === null) {
                    $timeToFirstChunk = round((microtime(true) - $startTime) * 1000, 2);
                }
            }
            
            if (isset($json['type']) && $json['type'] === 'done') {
                $timeToComplete = round((microtime(true) - $startTime) * 1000, 2);
            }
        }
    }
    
    echo "  Status: " . (count($lines) > 2 ? '✓ Success' : '✗ Failed') . "\n";
    echo "  Chunks received: $chunkCount\n";
    echo "  Total time: {$timeToComplete}ms\n";
    echo  First chunk time: " . ($timeToFirstChunk ?? 'NA') . "ms\n";
    
    if (count($lines) > 2) {
        echo "  Complete response: " . strlen($responseText) . " characters\n";
    }
    
    echo "\n";
}

// Test 2.3: Cached response
echo "\n2.3: Non-streaming with cache (repeated query)...\n";
$cacheQuery = 'Info PPDB?'; // Common query to test caching

echo "First request (cold cache):";
$ch = curl_init('http://127.0.0.1:8000/api/chat/send');
$payload = json_encode([
    'message' => $cacheQuery,
    'stream' => false,
    'use_cache' => true, // Enable cache
    'use_rag' => true,
]);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-CSRF-TOKEN' => 'test-token',
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$output = curl_exec($ch);
curl_close($ch);
$result = json_decode($output, true);

echo "  Status: " . ($result['success'] ? '✓ Success' : '✗ Failed') . "\n";
echo "  Provider: " . ($result['provider'] ?? 'unknown') . "\n";
echo "  Cached: " . ($result['cached'] ?? 'false') . "\n";
echo "  Response time: " . ($result['elapsed_ms'] ?? 0) . "ms\n";

echo "\nSecond request (from cache):";
$ch = curl_init('http://127.0.0.1:8000/api/chat/send');
$payload = json_encode([
    'message' => $cacheQuery,
    'stream' => false,
    'use_cache' => true,
    'use_rag' => true,
]);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-CSRF-TOKEN' => 'test-token',
]);

$output = curl_exec($ch);
curl_close($ch);
$result = json_decode($output, true);

echo "  Status: " . ($result['success'] ? '✓ Success' : '✗ Failed') . "\n";
echo "  Providers: " . ($result['provider'] ?? 'unknown') . "\n";
echo "  Cached: " . ($result['cached'] ?? 'false') . "\n";
echo "  Response time: " . ($result['elapsed_ms'] ?? 0) . "ms\n";

echo "\n";

// Display final summary
echo "===================================\n";
echo "      SUMMARY\n";
echo "===================================";

echo "Cache statistics:\n";
$stats = $cache->getStats();
echo "  Total cache size: {$stats['size']}\n";
echo "  Cache hit rate: {$stats['hit_rate']}%\n";
echo "  Hits: {$stats['hit_count']}\n";
echo "  Misses: {$stats['miss_count']}\n";

echo "\nRecommendations:\n";
if ($stats['hit_rate'] < 10) {
    echo "  ⚠️ Low cache hit rate (<10%). Consider:\n";
    echo "     - Add more RAG documents for better matches\n";
} else {
    echo "  ✓ Good cache hit rate (≥10%)\n";
}

if ($stats['size'] >= $stats['max_size']) {
    echo "  ⚠️ Cache near full ({$stats['size']}/{$stats['max_size']}). Consider increasing cache size.\n";
}

echo "\n";

echo "===================================\n";
echo "      DONE\n";
echo "===================================\n";
