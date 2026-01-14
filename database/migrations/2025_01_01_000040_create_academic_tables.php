<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Academic Calendar
        Schema::create('academic_calendar_contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('calendar_image_url')->nullable();
            $table->integer('academic_year_start')->nullable(); // e.g. 2024
            $table->string('semester')->nullable(); // 'Ganjil', 'Genap'
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Curriculum Settings (Intro, Fase E, Fase F, methods)
        Schema::create('curriculum_settings', function (Blueprint $table) {
            $table->id();
            $table->string('section_key')->unique();
            $table->json('content')->nullable();
            $table->timestamps();
        });

        // Program Studi Settings (MIPA, IPS, Bahasa detail pages)
        Schema::create('program_studi_settings', function (Blueprint $table) {
            $table->id();
            $table->string('program_name'); // 'mipa', 'ips', 'bahasa'
            $table->string('section_key'); // 'hero', 'core_subjects', 'facilities', 'career_paths', 'alumni_spotlight'
            $table->json('content')->nullable();
            $table->timestamps();
            
            $table->unique(['program_name', 'section_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_studi_settings');
        Schema::dropIfExists('curriculum_settings');
        Schema::dropIfExists('academic_calendar_contents');
    }
};
