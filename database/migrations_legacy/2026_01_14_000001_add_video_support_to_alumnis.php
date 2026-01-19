<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->string('video_url')->nullable()->after('image_url');
            $table->string('video_thumbnail_url')->nullable()->after('video_url');
            $table->enum('video_source', ['youtube', 'upload'])->nullable()->after('video_thumbnail_url');
            $table->enum('content_type', ['text', 'video'])->default('text')->after('video_source');
        });
    }

    public function down(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->dropColumn(['video_url', 'video_thumbnail_url', 'video_source', 'content_type']);
        });
    }
};