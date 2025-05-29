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
        Schema::create('academic_calendar_contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('calendar_image_url')->nullable();
            $table->unsignedTinyInteger('semester');
            $table->unsignedSmallInteger('academic_year_start');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_calendar_contents');
    }
};
