<?php

namespace App\Console\Commands;

use App\Services\OpenAIService;
use App\Services\OllamaService;
use Illuminate\Console\Command;

class TestAiConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ai:test-connection';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Validate AI configuration and test connectivity to providers';

    /**
     * Execute the console command.
     */
    public function handle(OpenAIService $openAI, OllamaService $ollama): int
    {
        $this->info('🤖 Testing AI Configuration & Connectivity');
        $this->info('═══════════════════════════════════════════');
        $this->newLine();

        // 1. Check Ollama
        $this->info('[1/2] Checking Ollama (Local AI)...');
        if ($ollama->isAvailable()) {
            $this->line('  <fg=green>✓</> Ollama Service: Available');
            $loaded = $ollama->isModelLoaded() ? 'Yes' : 'No (Cold start expected)';
            $this->line("  <fg=green>✓</> Model Loaded: {$loaded}");
        } else {
            $this->line('  <fg=yellow>⚠</> Ollama Service: Not Available');
        }
        $this->newLine();

        // Debug: Show current settings
        $this->info('Current Settings:');
        $this->line('  Base URL: ' . \App\Models\AiSetting::get('ai_model_base_url', 'NOT SET'));
        $this->line('  Model: ' . \App\Models\AiSetting::get('ai_model_name', 'NOT SET'));
        $this->newLine();

        // 2. Check OpenAI / CLIProxy
        $this->info('[2/2] Testing OpenAI/CLIProxy Completion...');
        
        $startTime = microtime(true);
        $result = $openAI->chatCompletion([
            ['role' => 'user', 'content' => 'Say \"Hello, system check passed!\"']
        ]);
        $elapsed = round(microtime(true) - $startTime, 2);

        if ($result['success']) {
            $provider = $result['provider'] ?? 'unknown';
            $this->line("  <fg=green>✓</> Connection successful via <fg=cyan>{$provider}</>");
            $this->line("  <fg=green>✓</> Response time: {$elapsed}s");
            $this->line("  <fg=green>✓</> AI Response: \"{$result['message']}\"");
        } else {
            $this->line("  <fg=red>✗</> Connection failed");
            $this->line("  <fg=red>✗</> Error: " . ($result['error'] ?? 'Unknown error'));
        }

        $this->newLine();
        $this->info('═══════════════════════════════════════════');
        
        return $result['success'] ? Command::SUCCESS : Command::FAILURE;
    }
}
