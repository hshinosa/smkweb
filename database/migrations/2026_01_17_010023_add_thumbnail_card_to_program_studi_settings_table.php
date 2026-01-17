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
        Schema::table('program_studi_settings', function (Blueprint $table) {
            // Thumbnail card untuk ditampilkan di landing page dan section program akademik
            $table->string('thumbnail_card_url')->nullable()->after('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_studi_settings', function (Blueprint $table) {
            $table->dropColumn('thumbnail_card_url');
        });
    }
};
