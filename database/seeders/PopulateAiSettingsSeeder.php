<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AiSetting;

class PopulateAiSettingsSeeder extends Seeder
{
    public function run()
    {
        $settings = [
            // Primary Provider: Ollama (default for chat)
            [
                'key' => 'ai_primary_provider',
                'value' => 'ollama',
                'type' => 'string',
            ],
            
            // OpenAI Configuration (for content creation & fallback)
            // Using CLIProxyAPI as the proxy for Claude/Gemini models
            [
                'key' => 'ai_model_base_url',
                'value' => env('CLIPROXY_BASE_URL', 'http://cliproxyapi:8317/v1'),
                'type' => 'string', 
            ],
            [
                'key' => 'ai_model_api_key',
                'value' => env('CLIPROXY_API_KEY', 'smkweb-internal-api-key-2026'),
                'type' => 'string', 
            ],
            [
                'key' => 'ai_model_name',
                'value' => env('CLIPROXY_MODEL', 'gemini-claude-sonnet-4-5-thinking'),
                'type' => 'string',
            ],
            [
                'key' => 'ai_embedding_model',
                'value' => 'text-embedding-3-small',
                'type' => 'string',
            ],
            [
                'key' => 'ai_max_tokens',
                'value' => '2000',
                'type' => 'integer',
            ],
            [
                'key' => 'ai_temperature',
                'value' => '0.7',
                'type' => 'string',
            ],
            
            // RAG Configuration
            [
                'key' => 'rag_enabled',
                'value' => '1',
                'type' => 'boolean',
            ],
            [
                'key' => 'rag_top_k',
                'value' => '5',
                'type' => 'integer',
            ],
            
            // Ollama Configuration (Primary for chat, fallback for content)
            [
                'key' => 'use_ollama_fallback',
                'value' => '1',
                'type' => 'boolean',
            ],
            [
                'key' => 'ollama_base_url',
                // Use 'ollama' hostname for Docker, 'localhost' for local dev
                'value' => env('OLLAMA_BASE_URL', 'http://ollama:11434'),
                'type' => 'string',
            ],
            [
                'key' => 'ollama_model',
                'value' => 'llama3.2:1b',
                'type' => 'string',
            ],
            [
                'key' => 'ollama_embedding_model',
                'value' => 'nomic-embed-text:v1.5',
                'type' => 'string',
            ],
            
            // System Prompt
            [
                'key' => 'system_prompt',
                'value' => "Anda adalah AI SMANSA. Jawab singkat dan jelas, maksimal 3-4 kalimat.",
                'type' => 'string',
            ]
        ];

        foreach ($settings as $setting) {
            AiSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
        
        $this->command->info('AI Settings populated.');
    }
}
