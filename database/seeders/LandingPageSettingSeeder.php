<?php

namespace Database\Seeders;

use App\Models\LandingPageSetting;
use Illuminate\Database\Seeder;

class LandingPageSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            'hero',
            'about_lp',
            'kepsek_welcome_lp',
            'fakta_lp',
            'programs_lp',
            'gallery_lp',
            'cta_lp',
            'kalender_akademik',
        ];

        foreach ($sections as $section) {
            LandingPageSetting::updateOrCreate(
                ['section_key' => $section],
                ['content' => LandingPageSetting::getDefaults($section)]
            );
        }
    }
}
