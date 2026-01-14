<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // AI Settings
        Schema::create('ai_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, boolean, integer, json
            $table->string('embedding_provider')->default('openai'); // Added from separate migration
            $table->timestamps();
        });

        // RAG Documents (Knowledge Base)
        Schema::create('rag_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_type')->default('text'); // pdf, text, url
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('source')->nullable();
            $table->string('category')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_processed')->default(false);
            $table->string('vector_id')->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // RAG Document Chunks
        Schema::create('rag_document_chunks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('document_id'); // Foreign key manually handled or added later
            $table->text('content');
            $table->integer('chunk_index');
            $table->json('embedding')->nullable(); // Vector data (array of floats)
            $table->timestamps();
            
            $table->foreign('document_id')->references('id')->on('rag_documents')->onDelete('cascade');
        });

        // Chat Histories
        Schema::create('chat_histories', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('sender'); // 'user', 'bot'
            $table->text('message');
            $table->json('metadata')->nullable();
            $table->boolean('is_rag_enhanced')->default(false);
            $table->json('retrieved_documents')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_histories');
        Schema::dropIfExists('rag_document_chunks');
        Schema::dropIfExists('rag_documents');
        Schema::dropIfExists('ai_settings');
    }
};
