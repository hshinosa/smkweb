<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\SchoolProfileSetting;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove 'goals' field from vision_mission content JSON
        $setting = SchoolProfileSetting::where('section_key', 'vision_mission')->first();
        
        if ($setting && $setting->content) {
            $content = $setting->content;
            
            // Remove goals if it exists
            if (isset($content['goals'])) {
                unset($content['goals']);
                $setting->content = $content;
                $setting->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optionally restore goals with empty array
        $setting = SchoolProfileSetting::where('section_key', 'vision_mission')->first();
        
        if ($setting && $setting->content) {
            $content = $setting->content;
            $content['goals'] = [];
            $setting->content = $content;
            $setting->save();
        }
    }
};
