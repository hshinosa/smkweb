<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for full-text search support on PostgreSQL
     * 
     * This creates a GIN index on posts table for efficient text search
     * using PostgreSQL's built-in full-text search with Indonesian language
     */
    public function up(): void
    {
        // Check if we're using PostgreSQL
        if (DB::connection()->getDriverName() === 'pgsql') {
            // Create a generated column for tsvector (PostgreSQL 12+)
            DB::statement("
                ALTER TABLE posts 
                ADD COLUMN IF NOT EXISTS search_vector tsvector 
                GENERATED ALWAYS AS (
                    setweight(to_tsvector('indonesian', COALESCE(title, '')), 'A') ||
                    setweight(to_tsvector('indonesian', COALESCE(excerpt, '')), 'B') ||
                    setweight(to_tsvector('indonesian', COALESCE(content, '')), 'C')
                ) STORED
            ");

            // Create GIN index on the search vector
            DB::statement("
                CREATE INDEX IF NOT EXISTS posts_search_vector_idx 
                ON posts USING GIN (search_vector)
            ");

            // Create a regular index on published_at for sorting
            // Note: index(['status', 'published_at']) is already created in 2026_01_11_000001
            // So we only add specific ones if needed, but performance_indexes covers most.
        }

        // For other databases, we'll use regular indexes as fallback
        // Covered by 2026_01_11_000001_add_performance_indexes
    }

    /**
     * Reverse the migrations
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'pgsql') {
            // Drop the GIN index
            DB::statement("DROP INDEX IF EXISTS posts_search_vector_idx");
            
            // Drop the generated column
            DB::statement("ALTER TABLE posts DROP COLUMN IF EXISTS search_vector");
        }

        // Indexes are managed by their respective creation migrations
    }
};