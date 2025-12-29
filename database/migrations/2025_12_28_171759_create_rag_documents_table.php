<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Check if pgvector extension is available (without throwing exception in transaction)
        $hasVectorSupport = false;
        
        try {
            // Separate transaction for extension check
            $result = DB::select("SELECT COUNT(*) as count FROM pg_available_extensions WHERE name = 'vector'");
            if ($result[0]->count > 0) {
                DB::statement('CREATE EXTENSION IF NOT EXISTS vector');
                $hasVectorSupport = true;
            }
        } catch (\Exception $e) {
            \Log::warning('pgvector extension not available, using JSON for embeddings storage');
        }

        Schema::create('rag_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->text('excerpt')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_type')->nullable(); // pdf, txt, docx, etc.
            $table->bigInteger('file_size')->nullable();
            $table->string('source')->nullable(); // upload, manual, scrape
            $table->string('category')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('uploaded_by')->nullable()->constrained('admins')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('title');
            $table->index('category');
            $table->index('is_active');
            $table->index('created_at');
        });

        // Create document chunks table for better RAG performance
        Schema::create('rag_document_chunks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('rag_documents')->onDelete('cascade');
            $table->text('content');
            $table->integer('chunk_index')->default(0);
            $table->integer('token_count')->nullable();
            
            // Always use JSON for embeddings storage (compatible with or without pgvector)
            $table->json('embedding')->nullable();
            
            $table->timestamps();

            // Indexes
            $table->index(['document_id', 'chunk_index']);
        });

        // Create HNSW index for fast vector similarity search (only if pgvector available)
        if ($hasVectorSupport) {
            try {
                // Convert JSON column to vector type if pgvector is available
                DB::statement('ALTER TABLE rag_document_chunks ALTER COLUMN embedding TYPE vector(1536) USING embedding::text::vector');
                DB::statement('CREATE INDEX rag_document_chunks_embedding_idx ON rag_document_chunks USING hnsw (embedding vector_cosine_ops)');
            } catch (\Exception $e) {
                \Log::warning('Could not create HNSW index: ' . $e->getMessage());
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('rag_document_chunks');
        Schema::dropIfExists('rag_documents');
        
        try {
            DB::statement('DROP EXTENSION IF EXISTS vector');
        } catch (\Exception $e) {
            // Ignore if extension doesn't exist
        }
    }
};
