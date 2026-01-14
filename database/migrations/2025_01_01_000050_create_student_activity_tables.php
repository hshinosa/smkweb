<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Extracurriculars
        Schema::create('extracurriculars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // Olahraga, Seni, Akademik
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->string('icon_name')->nullable();
            $table->string('schedule')->nullable(); // e.g. Senin & Rabu, 15:00
            $table->string('coach_name')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('achievements')->nullable(); // Added from separate migration
            $table->timestamps();
        });

        // Posts (News, Announcements, Achievements)
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->string('category')->default('Berita'); // Berita, Pengumuman, Prestasi
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedBigInteger('author_id')->nullable();
            $table->integer('views_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
        Schema::dropIfExists('extracurriculars');
    }
};
