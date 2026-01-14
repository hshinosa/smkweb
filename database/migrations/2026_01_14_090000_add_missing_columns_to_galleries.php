<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            if (!Schema::hasColumn('galleries', 'is_external')) {
                $table->boolean('is_external')->default(false)->after('type');
            }
            if (!Schema::hasColumn('galleries', 'thumbnail_url')) {
                $table->string('thumbnail_url')->nullable()->after('url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            if (Schema::hasColumn('galleries', 'is_external')) {
                $table->dropColumn('is_external');
            }
            if (Schema::hasColumn('galleries', 'thumbnail_url')) {
                $table->dropColumn('thumbnail_url');
            }
        });
    }
};