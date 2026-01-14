<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alumni;
use Illuminate\Support\Facades\File;

class PopulateAlumniSeeder extends Seeder
{
    public function run()
    {
        Alumni::truncate();

        $alumniData = [
            [
                'name' => 'Dr. Ahmad Hidayat',
                'graduation_year' => 2005,
                'current_position' => 'Dosen Universitas Indonesia',
                'education' => 'S3 Pendidikan Matematika',
                'testimonial' => 'SMAN 1 Baleendah memberikan fondasi akademik yang kuat dan mengajarkan nilai-nilai karakter yang saya bawa hingga masa dewasa.',
                'image_name' => 'kepala-sekolah.jpg', 
                'category' => 'Pendidikan',
                'is_featured' => true
            ],
            [
                'name' => 'Sarah Wijaya',
                'graduation_year' => 2010,
                'current_position' => 'Entrepreneur - Founder Tech Startup',
                'education' => 'S1 Ekonomi',
                'testimonial' => 'Lingkungan sekolah yang mendukung dan guru-guru yang berdedikasi membantu saya mengejar mimpi menjadi pengusaha.',
                'image_name' => 'anak-sma.png', 
                'category' => 'Wirausaha',
                'is_featured' => true
            ],
            [
                'name' => 'Budi Santoso',
                'graduation_year' => 2015,
                'current_position' => 'Engineer di Perusahaan Teknologi Global',
                'education' => 'S1 Teknik Informatika',
                'testimonial' => 'Fasilitas dan kurikulum yang berkualitas mempersiapkan saya untuk bersaing di kancah internasional.',
                'image_name' => 'kepala-sekolah.jpg',
                'category' => 'Teknologi',
                'is_featured' => false
            ],
            [
                'name' => 'Putri Ayu',
                'graduation_year' => 2018,
                'current_position' => 'Dokter Spesialis Anak',
                'education' => 'S1 Kedokteran',
                'testimonial' => 'Disiplin dan kerja keras yang diajarkan di sekolah menjadi pondasi sukses saya dalam pendidikan kedokteran.',
                'image_name' => 'anak-sma.png',
                'category' => 'Kesehatan',
                'is_featured' => false
            ],
            [
                'name' => 'Rizky Pratama',
                'graduation_year' => 2012,
                'current_position' => 'Manajer BUMN',
                'education' => 'S2 Manajemen Bisnis',
                'testimonial' => 'Organisasi kesiswaan di SMAN 1 Baleendah melatih kepemimpinan saya sejak dini.',
                'image_name' => 'kepala-sekolah.jpg',
                'category' => 'Bisnis',
                'is_featured' => false
            ],
            [
                'name' => 'Ani Lestari',
                'graduation_year' => 2019,
                'current_position' => 'Jurnalis TV Nasional',
                'education' => 'S1 Komunikasi',
                'testimonial' => 'Ekstrakurikuler jurnalistik sekolah membuka jalan karir saya di dunia media.',
                'image_name' => 'anak-sma.png',
                'category' => 'Media',
                'is_featured' => false
            ]
        ];

        foreach ($alumniData as $data) {
            $imageName = $data['image_name'];
            unset($data['image_name']);
            
            $data['is_published'] = true;
            $data['sort_order'] = 0;

            $alumni = Alumni::create($data);

            // Attach Image
            $sourcePath = public_path("images/{$imageName}");
            // Fallback
            if (!File::exists($sourcePath)) {
                $sourcePath = public_path("images/hero-bg-sman1baleendah.jpeg");
            }

            if (File::exists($sourcePath)) {
                $alumni->addMedia($sourcePath)
                    ->preservingOriginal()
                    ->toMediaCollection('avatars');
            }
        }

        $this->command->info('Alumni populated successfully.');
    }
}
