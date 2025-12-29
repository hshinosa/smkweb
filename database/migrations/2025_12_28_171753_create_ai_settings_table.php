<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, json, boolean, integer
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('ai_settings')->insert([
            [
                'key' => 'ai_model_base_url',
                'value' => 'https://api-ai.hshinoshowcase.site/v1',
                'type' => 'string',
                'description' => 'OpenAI Compatible API Base URL',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ai_model_api_key',
                'value' => 'sk-hshinosa',
                'type' => 'string',
                'description' => 'API Key for AI model',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ai_model_name',
                'value' => 'gemini-claude-sonnet-4-5-thinking',
                'type' => 'string',
                'description' => 'Model name for chat completion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ai_embedding_model',
                'value' => 'text-embedding-3-small',
                'type' => 'string',
                'description' => 'Model name for embeddings',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ai_max_tokens',
                'value' => '2000',
                'type' => 'integer',
                'description' => 'Maximum tokens for completion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ai_temperature',
                'value' => '0.7',
                'type' => 'string',
                'description' => 'Temperature for AI responses (0-1)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'rag_enabled',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Enable RAG (Retrieval Augmented Generation)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'rag_top_k',
                'value' => '5',
                'type' => 'integer',
                'description' => 'Number of top documents to retrieve for RAG',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Ollama settings
            [
                'key' => 'use_ollama_fallback',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Use Ollama as fallback when primary AI fails',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ollama_base_url',
                'value' => 'http://localhost:11434',
                'type' => 'string',
                'description' => 'Ollama API Base URL',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ollama_model',
                'value' => 'llama3.2',
                'type' => 'string',
                'description' => 'Ollama model for chat completion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ollama_embedding_model',
                'value' => 'nomic-embed-text',
                'type' => 'string',
                'description' => 'Ollama model for embeddings',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_settings');
    }
};
