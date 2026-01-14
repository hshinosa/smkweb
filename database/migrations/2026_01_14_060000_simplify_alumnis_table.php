<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->dropColumn(['current_position', 'education', 'category']);
        });
    }

    public function down(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->string('current_position')->nullable();
            $table->string('education')->nullable();
            $table->string('category')->nullable();
        });
    }
};