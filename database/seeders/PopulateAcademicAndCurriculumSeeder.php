<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicCalendarContent;
use App\Models\CurriculumSetting;
use Illuminate\Support\Facades\File;

class PopulateAcademicAndCurriculumSeeder extends Seeder
{
    public function run()
    {
        $this->seedAcademicCalendar();
        $this->seedCurriculum();
    }

    private function seedAcademicCalendar()
    {
        AcademicCalendarContent::truncate();

        // Semester Ganjil 2024/2025
        $cal1 = AcademicCalendarContent::create([
            'title' => 'Kalender Akademik Semester Ganjil',
            'semester' => 1,
            'academic_year_start' => 2024,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        // Semester Genap 2024/2025
        $cal2 = AcademicCalendarContent::create([
            'title' => 'Kalender Akademik Semester Genap',
            'semester' => 2,
            'academic_year_start' => 2024,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Attach Dummy Images
        $localImage = public_path('images/hero-bg-sman1baleendah.jpeg'); // Fallback
        if (File::exists($localImage)) {
            $cal1->clearMediaCollection('calendar_images');
            $cal1->addMedia($localImage)->preservingOriginal()->toMediaCollection('calendar_images');
            
            $cal2->clearMediaCollection('calendar_images');
            $cal2->addMedia($localImage)->preservingOriginal()->toMediaCollection('calendar_images');
        }

        $this->command->info('Academic Calendar populated.');
    }

    private function seedCurriculum()
    {
        // Jangan truncate jika ingin mempertahankan data lama, tapi untuk populate awal, truncate lebih bersih.
        // Tapi CurriculumSetting pakai key, jadi updateOrCreate lebih aman.
        
        $sections = CurriculumSetting::getSectionFields();
        
        // Customize Hero Content
        $sections['hero'] = [
            'title' => 'Kurikulum Merdeka',
            'subtitle' => 'Mewujudkan Profil Pelajar Pancasila melalui pembelajaran yang fleksibel, mendalam, dan berpusat pada peserta didik.',
        ];

        // Customize Intro
        $sections['intro'] = [
            'title' => 'Filosofi Pembelajaran',
            'description' => 'SMA Negeri 1 Baleendah berkomitmen menerapkan Kurikulum Merdeka secara menyeluruh. Kami percaya bahwa setiap siswa memiliki potensi unik yang harus digali dan dikembangkan melalui proses pembelajaran yang bermakna dan menyenangkan.',
        ];

        foreach ($sections as $key => $defaultContent) {
            $setting = CurriculumSetting::updateOrCreate(
                ['section_key' => $key],
                ['content' => $defaultContent]
            );

            // Attach media for specific sections
            $imageName = null;
            $collection = null;

            if ($key === 'hero') {
                $imageName = 'hero-bg-sman1baleendah.jpeg';
                $collection = 'hero_bg';
            } elseif ($key === 'fase_e') {
                $imageName = 'anak-sma-programstudi.png';
                $collection = 'fase_e_image';
            } elseif ($key === 'fase_f') {
                $imageName = 'panen-karya-sman1-baleendah.jpg';
                $collection = 'fase_f_image';
            }

            if ($imageName && $collection) {
                $path = public_path("images/{$imageName}");
                if (File::exists($path)) {
                    $setting->clearMediaCollection($collection);
                    $setting->addMedia($path)->preservingOriginal()->toMediaCollection($collection);
                }
            }
        }
        
        $this->command->info('Curriculum Settings populated.');
    }
}
