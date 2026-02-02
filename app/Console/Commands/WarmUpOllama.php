<?php

namespace App\Console\Commands;

use App\Services\OllamaService;
use Illuminate\Console\Command;

/**
 * Warm up Ollama models to prevent cold start delays
 * 
 * This command preloads the LLM model into memory so that
 * subsequent chat requests are faster. Should be run:
 * - After deployment
 * - Periodically via scheduler to keep model loaded
 * - After container restart
 */
class WarmUpOllama extends Command
{
    protected $signature = 'ollama:warmup 
                            {--check : Only check if model is loaded}
                            {--embedding : Also warm up embedding model}';
    
    protected $description = 'Warm up Ollama LLM model to prevent cold start delays';

    public function handle(OllamaService $ollama): int
    {
        if ($this->option('check')) {
            return $this->checkStatus($ollama);
        }

        $this->info('🔥 Warming up Ollama models...');
        $this->newLine();

        // Check if Ollama is available
        if (!$ollama->isAvailable()) {
            $this->error('❌ Ollama service is not available.');
            $this->error('   Please check that the Ollama container is running.');
            return Command::FAILURE;
        }

        $this->info('✓ Ollama service is available');

        // Check current model status
        if ($ollama->isModelLoaded()) {
            $this->info('✓ Model is already loaded in memory');
        } else {
            $this->warn('⚠ Model is not loaded, warming up...');
        }

        // Warm up the chat model
        $this->info('');
        $this->info('Warming up chat model (this may take 1-2 minutes on first run)...');
        
        $startTime = microtime(true);
        
        if ($ollama->warmUp()) {
            $elapsed = round(microtime(true) - $startTime, 1);
            $this->info("✓ Chat model warmed up successfully ({$elapsed}s)");
        } else {
            $this->error('❌ Failed to warm up chat model');
            return Command::FAILURE;
        }

        // Optionally warm up embedding model
        if ($this->option('embedding')) {
            $this->info('');
            $this->info('Warming up embedding model...');
            
            $embeddingResult = $ollama->createEmbedding('test');
            if ($embeddingResult['success']) {
                $this->info('✓ Embedding model warmed up successfully');
            } else {
                $this->warn('⚠ Embedding model warm-up failed (non-critical)');
            }
        }

        $this->newLine();
        $this->info('✨ Ollama warm-up complete!');
        $this->info('   The model should now respond faster to chat requests.');

        return Command::SUCCESS;
    }

    protected function checkStatus(OllamaService $ollama): int
    {
        $this->info('📊 Ollama Status Check');
        $this->newLine();

        // Check service availability
        if ($ollama->isAvailable()) {
            $this->info('✓ Service: Available');
        } else {
            $this->error('✗ Service: Not Available');
            return Command::FAILURE;
        }

        // Check if model is loaded
        if ($ollama->isModelLoaded()) {
            $this->info('✓ Model: Loaded in memory');
        } else {
            $this->warn('⚠ Model: Not loaded (will have cold start delay)');
        }

        // List available models
        $models = $ollama->getAvailableModels();
        if (!empty($models)) {
            $this->newLine();
            $this->info('Available models:');
            foreach ($models as $model) {
                $size = round(($model['size'] ?? 0) / 1024 / 1024 / 1024, 2);
                $this->line("  - {$model['name']} ({$size} GB)");
            }
        }

        return Command::SUCCESS;
    }
}
