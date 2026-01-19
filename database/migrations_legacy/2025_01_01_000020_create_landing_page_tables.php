<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Landing Page Settings (Hero, About, Kepsek Welcome, CTA)
        Schema::create('landing_page_settings', function (Blueprint $table) {
            $table->id();
            $table->string('section_key')->unique();
            $table->json('content')->nullable();
            $table->timestamps();
        });

        // Programs (Academic, Vocational, Extracurricular Highlights on Landing Page)
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('image_url')->nullable();
            $table->string('icon_name')->nullable(); // For frontend icon mapping
            $table->string('color_class')->nullable(); // Tailwind color class
            $table->integer('sort_order')->default(0);
            $table->boolean('is_featured')->default(true);
            $table->string('category')->default('Akademik'); // 'Akademik', 'Vokasi', 'Unggulan'
            $table->string('link')->nullable(); // Added from separate migration
            $table->timestamps();
        });

        // Galleries
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('url')->nullable(); // Image URL or Video URL
            $table->string('thumbnail_url')->nullable();
            $table->string('type')->default('photo'); // 'photo' or 'video'
            $table->boolean('is_external')->default(false);
            $table->string('category')->nullable(); // 'Kegiatan', 'Fasilitas', 'Prestasi'
            $table->json('tags')->nullable();
            $table->date('date')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('galleries');
        Schema::dropIfExists('programs');
        Schema::dropIfExists('landing_page_settings');
    }
};
