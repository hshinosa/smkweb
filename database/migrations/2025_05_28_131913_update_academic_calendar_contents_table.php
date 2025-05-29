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
            // Remove existing academic_year field
            // $table->dropColumn('academic_year'); // Already removed or never existed
            
            // $table->unsignedTinyInteger('semester')->after('calendar_image_url'); // Already exists in base migration
            // $table->year('academic_year_start')->after('semester'); // Already exists in base migration
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academic_calendar_contents', function (Blueprint $table) {
            // Add back original field
            $table->string('academic_year', 20)->after('calendar_image_url');
            
            // Remove new fields
            $table->dropColumn(['semester', 'academic_year_start']);
        });
    }
};
