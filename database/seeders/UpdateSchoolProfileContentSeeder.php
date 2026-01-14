<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolProfileSetting;
use Illuminate\Support\Facades\File;

class UpdateSchoolProfileContentSeeder extends Seeder
{
    public function run()
    {
        // 1. HERO HISTORY
        $hero = SchoolProfileSetting::updateOrCreate(
            ['section_key' => 'hero_history'],
            ['content' => json_encode([
                'title' => 'Profil & Sejarah SMAN 1 Baleendah',
                'image_url' => '/images/hero-bg-sman1baleendah.jpeg'
            ])]
        );
        
        // Migrate Hero Image
        $heroPath = public_path('images/hero-bg-sman1baleendah.jpeg');
        if (File::exists($heroPath)) {
            $hero->clearMediaCollection('hero_history_bg');
            $hero->addMedia($heroPath)
                ->preservingOriginal()
                ->toMediaCollection('hero_history_bg');
        }

        // 2. HISTORY TIMELINE
        SchoolProfileSetting::updateOrCreate(
            ['section_key' => 'history'],
            ['content' => json_encode([
                'title' => 'Jejak Langkah Kami',
                'description_html' => '<p>Perjalanan panjang SMAN 1 Baleendah dalam mencerdaskan kehidupan bangsa dimulai sejak tahun 1975.</p>',
                'timeline' => [
                    [
                        'year' => "1975",
                        'title' => "Awal Pendirian",
                        'description' => "Berdiri sebagai sekolah filial (kelas jauh) untuk memenuhi kebutuhan pendidikan di wilayah Baleendah.",
                        'side' => "left"
                    ],
                    [
                        'year' => "1980",
                        'title' => "Penegerian",
                        'description' => "Resmi berdiri sendiri sebagai SMAN 1 Baleendah dengan SK Menteri Pendidikan, menandai era baru kemandirian.",
                        'side' => "right"
                    ],
                    [
                        'year' => "2010",
                        'title' => "Pengembangan Fasilitas",
                        'description' => "Revitalisasi gedung utama dan pembangunan Masjid sekolah sebagai pusat pembentukan karakter siswa.",
                        'side' => "left"
                    ],
                    [
                        'year' => "Sekarang",
                        'title' => "Era Prestasi",
                        'description' => "Menjadi Sekolah Penggerak dan meraih predikat Sekolah Adiwiyata Tingkat Provinsi/Nasional.",
                        'side' => "right"
                    ]
                ]
            ])]
        );

        // 3. FACILITIES (Tetap pakai URL statis dulu untuk simplicity, atau migrate manual logic later)
        SchoolProfileSetting::updateOrCreate(
            ['section_key' => 'facilities'],
            ['content' => json_encode([
                'title' => 'Lingkungan Belajar Modern',
                'description' => 'Fasilitas lengkap yang mendukung pengembangan akademik dan karakter siswa.',
                'items' => [
                    ['name' => "Lab Komputer", 'image' => "/images/panen-karya-sman1-baleendah.jpg"],
                    ['name' => "Perpustakaan", 'image' => "/images/hero-bg-sman1baleendah.jpeg"],
                    ['name' => "Masjid Sekolah", 'image' => "/images/keluarga-besar-sman1baleendah.png"],
                    ['name' => "Lapangan Olahraga", 'image' => "/images/hero-bg-sman1baleendah.jpeg"],
                    ['name' => "Ruang Kelas Modern", 'image' => "/images/panen-karya-sman1-baleendah.jpg"]
                ]
            ])]
        );
    }
}
