<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->text('testimonial')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->text('testimonial')->nullable(false)->change();
        });
    }
};