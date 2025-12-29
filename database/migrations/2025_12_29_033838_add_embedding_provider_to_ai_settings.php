<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add embedding provider setting
        DB::table('ai_settings')->insert([
            'key' => 'embedding_provider',
            'value' => 'openai',
            'type' => 'string',
            'description' => 'Embedding provider to use (openai or ollama) - MUST be consistent for all documents',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('ai_settings')->where('key', 'embedding_provider')->delete();
    }
};
