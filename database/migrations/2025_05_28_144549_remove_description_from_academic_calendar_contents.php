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
        Schema::table('academic_calendar_contents', function (Blueprint $table) {
            // $table->dropColumn('description'); // Already removed or never existed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academic_calendar_contents', function (Blueprint $table) {
            $table->text('description')->nullable()->after('title');
        });
    }
};
