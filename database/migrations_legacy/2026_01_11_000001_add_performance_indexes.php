<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Contact Messages indexes
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->index('is_read');
            $table->index('created_at');
        });

        // Activity Logs indexes
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->index('causer_type');
            $table->index('causer_id');
            $table->index('created_at');
        });

        // Posts indexes for better query performance
        Schema::table('posts', function (Blueprint $table) {
            $table->index('status');
            $table->index(['status', 'published_at']);
            $table->index('category');
            $table->index('views_count');
            $table->index('is_featured');
        });

        // Extracurriculars indexes
        Schema::table('extracurriculars', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('category');
            $table->index(['is_active', 'sort_order']);
        });

        // Teachers indexes
        Schema::table('teachers', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('type');
            $table->index(['is_active', 'sort_order']);
        });

        // Alumni indexes
        Schema::table('alumnis', function (Blueprint $table) {
            $table->index('is_published');
            $table->index('graduation_year');
            $table->index(['is_published', 'sort_order']);
        });

        // FAQs indexes
        Schema::table('faqs', function (Blueprint $table) {
            $table->index('is_published');
            $table->index(['is_published', 'sort_order']);
        });

        // Programs indexes
        Schema::table('programs', function (Blueprint $table) {
            $table->index('is_featured');
            $table->index('category');
            $table->index(['is_featured', 'category']);
        });

        // Galleries indexes
        Schema::table('galleries', function (Blueprint $table) {
            $table->index('type');
            $table->index('is_featured');
        });

        // Academic Calendar indexes
        Schema::table('academic_calendar_contents', function (Blueprint $table) {
            $table->index('is_active');
            $table->index(['academic_year_start', 'semester']);
        });

        // Chat Histories indexes
        Schema::table('chat_histories', function (Blueprint $table) {
            // session_id index already exists in 2025_01_01_000070_create_ai_tables
            $table->index('created_at');
        });

        // RAG Documents indexes
        Schema::table('rag_documents', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('is_processed');
            $table->index('category');
        });

        // RAG Document Chunks indexes
        if (Schema::hasTable('rag_document_chunks')) {
            Schema::table('rag_document_chunks', function (Blueprint $table) {
                $table->index('document_id');
            });
        }
    }

    public function down(): void
    {
        // Contact Messages indexes
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropIndex(['is_read']);
            $table->dropIndex(['created_at']);
        });

        // Activity Logs indexes
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex(['causer_type']);
            $table->dropIndex(['causer_id']);
            $table->dropIndex(['created_at']);
        });

        // Posts indexes
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['status', 'published_at']);
            $table->dropIndex(['category']);
            $table->dropIndex(['views_count']);
            $table->dropIndex(['is_featured']);
        });

        // Extracurriculars indexes
        Schema::table('extracurriculars', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['category']);
            $table->dropIndex(['is_active', 'sort_order']);
        });

        // Teachers indexes
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['type']);
            $table->dropIndex(['is_active', 'sort_order']);
        });

        // Alumni indexes
        Schema::table('alumnis', function (Blueprint $table) {
            $table->dropIndex(['is_published']);
            $table->dropIndex(['graduation_year']);
            $table->dropIndex(['is_published', 'sort_order']);
        });

        // FAQs indexes
        Schema::table('faqs', function (Blueprint $table) {
            $table->dropIndex(['is_published']);
            $table->dropIndex(['is_published', 'sort_order']);
        });

        // Programs indexes
        Schema::table('programs', function (Blueprint $table) {
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['category']);
            $table->dropIndex(['is_featured', 'category']);
        });

        // Galleries indexes
        Schema::table('galleries', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['is_featured']);
        });

        // Academic Calendar indexes
        Schema::table('academic_calendar_contents', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['academic_year_start', 'semester']);
        });

        // Chat Histories indexes
        Schema::table('chat_histories', function (Blueprint $table) {
            // Do not drop session_id index as it belongs to the create_table migration
            $table->dropIndex(['created_at']);
        });

        // RAG Documents indexes
        Schema::table('rag_documents', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['is_processed']);
            $table->dropIndex(['category']);
        });

        // RAG Document Chunks indexes
        Schema::table('rag_document_chunks', function (Blueprint $table) {
            $table->dropIndex(['document_id']);
        });
    }
};