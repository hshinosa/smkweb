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
        Schema::create('program_studi_settings', function (Blueprint $table) {
            $table->id();
            $table->string('program_name'); // mipa, ips, bahasa
            $table->string('section_key');
            $table->json('content');
            $table->timestamps();

            $table->unique(['program_name', 'section_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_studi_settings');
    }
};
