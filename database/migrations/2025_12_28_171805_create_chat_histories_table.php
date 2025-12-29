<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_histories', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->enum('sender', ['user', 'bot']);
            $table->text('message');
            $table->json('metadata')->nullable(); // For storing RAG context, retrieved docs, etc.
            $table->boolean('is_rag_enhanced')->default(false);
            $table->json('retrieved_documents')->nullable(); // IDs of documents used for RAG
            $table->timestamps();

            // Indexes
            $table->index(['session_id', 'created_at']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_histories');
    }
};
