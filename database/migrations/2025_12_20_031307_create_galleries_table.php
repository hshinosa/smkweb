<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('photo'); // photo or video
            $table->string('url'); // Can be full URL or storage path
            $table->string('thumbnail_url')->nullable();
            $table->boolean('is_external')->default(true); // true if URL, false if uploaded file
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->date('date')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galleries');
    }
};
