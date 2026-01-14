<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;

class HealthController extends Controller
{
    /**
     * Health check endpoint for monitoring
     * Returns system status in JSON format
     */
    public function index(): JsonResponse
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'redis' => $this->checkRedis(),
            'storage' => $this->checkStorage(),
        ];
        
        $overallStatus = collect($checks)->every(fn($check) => $check['status'] === 'healthy');
        
        $response = [
            'status' => $overallStatus ? 'healthy' : 'unhealthy',
            'timestamp' => now()->toIso8601String(),
            'version' => app()->version(),
            'environment' => app()->environment(),
            'checks' => $checks,
        ];
        
        $statusCode = $overallStatus ? 200 : 503;
        
        return response()->json($response, $statusCode);
    }
    
    /**
     * Check database connectivity
     */
    protected function checkDatabase(): array
    {
        try {
            $start = microtime(true);
            DB::connection()->getPdo();
            $latency = round((microtime(true) - $start) * 1000, 2);
            
            return [
                'status' => 'healthy',
                'message' => 'Database connection successful',
                'latency_ms' => $latency,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'unhealthy',
                'message' => $e->getMessage(),
            ];
        }
    }
    
    /**
     * Check cache connectivity
     */
    protected function checkCache(): array
    {
        try {
            $start = microtime(true);
            Cache::put('health_check', 'ok', 60);
            $value = Cache::get('health_check');
            Cache::forget('health_check');
            $latency = round((microtime(true) - $start) * 1000, 2);
            
            return [
                'status' => $value === 'ok' ? 'healthy' : 'unhealthy',
                'message' => 'Cache working correctly',
                'latency_ms' => $latency,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'unhealthy',
                'message' => $e->getMessage(),
            ];
        }
    }
    
    /**
     * Check Redis connectivity (if available)
     */
    protected function checkRedis(): array
    {
        try {
            if (!class_exists('Illuminate\Support\Facades\Redis') || !config('database.redis.default.host')) {
                return [
                    'status' => 'skipped',
                    'message' => 'Redis not configured',
                ];
            }
            
            $start = microtime(true);
            Redis::ping();
            $latency = round((microtime(true) - $start) * 1000, 2);
            
            return [
                'status' => 'healthy',
                'message' => 'Redis connection successful',
                'latency_ms' => $latency,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'unhealthy',
                'message' => $e->getMessage(),
            ];
        }
    }
    
    /**
     * Check storage writability
     */
    protected function checkStorage(): array
    {
        try {
            $testFile = storage_path('health_check_' . time() . '.txt');
            file_put_contents($testFile, 'health check');
            $exists = file_exists($testFile);
            unlink($testFile);
            
            return [
                'status' => $exists ? 'healthy' : 'unhealthy',
                'message' => $exists ? 'Storage writable' : 'Storage not writable',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'unhealthy',
                'message' => $e->getMessage(),
            ];
        }
    }
}