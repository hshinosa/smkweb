<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\File;

class PopulateProgramsTableSeeder extends Seeder
{
    public function run()
    {
        // 1. Update Hero Section Title
        SiteSetting::updateOrCreate(
            ['section_key' => 'hero_program'],
            ['content' => [
                'title' => 'Program Sekolah',
                'subtitle' => 'Membangun karakter dan kompetensi siswa melalui berbagai inisiatif positif.',
                'image' => '/images/hero-bg-sman1baleendah.jpeg'
            ]]
        );

        // 2. Program Studi (Existing)
        $programs = [
            [
                'title' => 'MIPA',
                'description' => 'Program Matematika dan Ilmu Pengetahuan Alam dengan fokus pada sains, teknologi, dan riset ilmiah.',
                'image_name' => 'anak-sma-programstudi.png',
                'icon_name' => 'Microscope',
                'link' => '/akademik/program-studi/mipa',
                'category' => 'Program Studi',
                'sort_order' => 1
            ],
            [
                'title' => 'IPS',
                'description' => 'Program Ilmu Pengetahuan Sosial yang mempelajari dinamika masyarakat, ekonomi, dan sejarah.',
                'image_name' => 'hero-bg-sman1baleendah.jpeg', 
                'icon_name' => 'Globe',
                'link' => '/akademik/program-studi/ips',
                'category' => 'Program Studi',
                'sort_order' => 2
            ],
            [
                'title' => 'Bahasa',
                'description' => 'Program Bahasa dan Budaya untuk penguasaan komunikasi global dan literasi.',
                'image_name' => 'anak-sma.png',
                'icon_name' => 'BookOpen',
                'link' => '/akademik/program-studi/bahasa',
                'category' => 'Program Studi',
                'sort_order' => 3
            ],
            // 3. Program Sekolah (Non-Prodi) - NEW
            [
                'title' => 'Sekolah Adiwiyata',
                'description' => 'Program sekolah berbudaya lingkungan untuk menciptakan kesadaran pelestarian alam.',
                'image_name' => 'panen-karya-sman1-baleendah.jpg',
                'icon_name' => 'Leaf',
                'link' => '#',
                'category' => 'Program Unggulan',
                'sort_order' => 4
            ],
            [
                'title' => 'Sekolah Ramah Anak',
                'description' => 'Menciptakan lingkungan belajar yang aman, nyaman, dan menyenangkan bagi seluruh siswa.',
                'image_name' => 'keluarga-besar-sman1-baleendah.png',
                'icon_name' => 'Heart',
                'link' => '#',
                'category' => 'Program Unggulan',
                'sort_order' => 5
            ],
            [
                'title' => 'Literasi Digital',
                'description' => 'Penguatan kemampuan siswa dalam memanfaatkan teknologi digital secara bijak dan produktif.',
                'image_name' => 'anak-sma.png',
                'icon_name' => 'Cpu',
                'link' => '#',
                'category' => 'Program Unggulan',
                'sort_order' => 6
            ]
        ];

        foreach ($programs as $data) {
            $program = Program::updateOrCreate(
                ['title' => $data['title']],
                [
                    'description' => $data['description'],
                    'icon_name' => $data['icon_name'],
                    'link' => $data['link'],
                    'category' => $data['category'],
                    'is_featured' => true,
                    'sort_order' => $data['sort_order']
                ]
            );

            // Media
            $imageName = $data['image_name'];
            $sourcePath = public_path("images/{$imageName}");
            if (!File::exists($sourcePath)) {
                $sourcePath = public_path("images/hero-bg-sman1baleendah.jpeg");
            }

            if (File::exists($sourcePath)) {
                $program->clearMediaCollection('program_image');
                $program->addMedia($sourcePath)
                    ->preservingOriginal()
                    ->toMediaCollection('program_image');
            }
        }
        
        $this->command->info('Programs table populated.');
    }
}
