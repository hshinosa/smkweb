<?php

namespace Database\Seeders;

use App\Models\AcademicCalendarContent;
use App\Models\LandingPageSetting;
use App\Models\SpmbSetting;
use Illuminate\Database\Seeder;

class SchoolRebrandingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This seeder ensures that default SMAN 1 Baleendah content is properly
     * seeded into the database, replacing any old school references.
     */
    public function run(): void
    {
        // Seed Landing Page Settings with SMAN 1 Baleendah defaults
        $this->seedLandingPageSettings();

        // Seed SPMB Settings with SMAN 1 Baleendah defaults
        $this->seedSpmbSettings();

        // Seed Academic Calendar with SMAN 1 Baleendah defaults
        $this->seedAcademicCalendarContent();

        $this->command->info('School rebranding seeder completed successfully.');
    }

    /**
     * Seed landing page settings with SMAN 1 Baleendah content
     */
    private function seedLandingPageSettings(): void
    {
        $sections = ['hero', 'about_lp', 'kepsek_welcome_lp', 'fakta_lp', 'kalender_akademik'];

        foreach ($sections as $sectionKey) {
            $defaults = LandingPageSetting::getDefaults($sectionKey);

            LandingPageSetting::updateOrCreate(
                ['section_key' => $sectionKey],
                ['content' => $defaults]
            );
        }

        $this->command->info('Landing page settings seeded with SMAN 1 Baleendah content.');
    }

    /**
     * Seed SPMB settings with SMAN 1 Baleendah content
     */
    private function seedSpmbSettings(): void
    {
        $sections = [
            'pengaturan_umum',
            'jalur_pendaftaran',
            'jadwal_penting',
            'persyaratan',
            'prosedur',
            'faq',
        ];

        foreach ($sections as $sectionKey) {
            $defaults = SpmbSetting::getDefaults($sectionKey);

            SpmbSetting::updateOrCreate(
                ['section_key' => $sectionKey],
                ['content' => $defaults]
            );
        }

        $this->command->info('SPMB settings seeded with SMAN 1 Baleendah content.');
    }

    /**
     * Seed academic calendar content with SMAN 1 Baleendah defaults
     */
    private function seedAcademicCalendarContent(): void
    {
        // Create default academic calendar entries for current and next academic year
        $currentYear = date('Y');
        $academicYears = [$currentYear - 1, $currentYear]; // Previous and current academic year

        foreach ($academicYears as $year) {
            // Semester 1 (Ganjil)
            AcademicCalendarContent::updateOrCreate(
                [
                    'semester' => 1,
                    'academic_year_start' => $year,
                ],
                [
                    'title' => "Kalender Akademik SMA Negeri 1 Baleendah Semester Ganjil {$year}/".($year + 1),
                    'calendar_image_url' => '/images/kalender-akademik-default.jpg',
                    'sort_order' => 0,
                ]
            );

            // Semester 2 (Genap)
            AcademicCalendarContent::updateOrCreate(
                [
                    'semester' => 2,
                    'academic_year_start' => $year,
                ],
                [
                    'title' => "Kalender Akademik SMA Negeri 1 Baleendah Semester Genap {$year}/".($year + 1),
                    'calendar_image_url' => '/images/kalender-akademik-default.jpg',
                    'sort_order' => 1,
                ]
            );
        }

        $this->command->info('Academic calendar content seeded with SMAN 1 Baleendah content.');
    }
}
