<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            if (!Schema::hasColumn('galleries', 'date')) {
                $table->date('date')->nullable()->after('tags'); // tags might be missing too, maybe after 'category' or 'is_external'
            }
            if (!Schema::hasColumn('galleries', 'tags')) {
                $table->json('tags')->nullable()->after('category');
            }
            if (!Schema::hasColumn('galleries', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            if (Schema::hasColumn('galleries', 'date')) {
                $table->dropColumn('date');
            }
            if (Schema::hasColumn('galleries', 'tags')) {
                $table->dropColumn('tags');
            }
            if (Schema::hasColumn('galleries', 'is_featured')) {
                $table->dropColumn('is_featured');
            }
        });
    }
};