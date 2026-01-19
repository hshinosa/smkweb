<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // School Profile Settings (History, Vision Mission, Organization Structure, Facilities)
        Schema::create('school_profile_settings', function (Blueprint $table) {
            $table->id();
            $table->string('section_key')->unique();
            $table->json('content')->nullable();
            $table->timestamps();
        });

        // Teachers & Staff
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nip')->nullable();
            $table->string('position'); // Kepala Sekolah, Wakil Kepala, Guru Mapel, Staff TU
            $table->string('type')->default('guru'); // 'guru', 'staff'
            $table->string('department')->nullable(); // Matematika, Bahasa, Tata Usaha
            $table->string('image_url')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Alumni (Testimonials)
        Schema::create('alumnis', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->year('graduation_year');
            $table->string('current_position')->nullable(); // e.g. CEO at Tech Corp
            $table->string('education')->nullable(); // e.g. S1 ITB
            $table->text('testimonial');
            $table->string('image_url')->nullable();
            $table->string('category')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // FAQs
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->string('category')->nullable(); // General, PPDB, Akademik
            $table->integer('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('alumnis');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('school_profile_settings');
    }
};
