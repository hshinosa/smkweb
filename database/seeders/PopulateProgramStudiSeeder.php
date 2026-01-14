<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProgramStudiSetting;
use Illuminate\Support\Facades\File;

class PopulateProgramStudiSeeder extends Seeder
{
    public function run()
    {
        $programs = ['mipa', 'ips', 'bahasa'];

        foreach ($programs as $programName) {
            $this->seedProgram($programName);
        }
    }

    private function seedProgram($programName)
    {
        $data = $this->getDataForProgram($programName);

        foreach ($data as $sectionKey => $content) {
            // Create or Update Setting
            $setting = ProgramStudiSetting::updateOrCreate(
                [
                    'program_name' => $programName,
                    'section_key' => $sectionKey
                ],
                ['content' => $content]
            );

            // Handle Media Attachments
            $this->attachMedia($setting, $sectionKey);
        }
        
        $this->command->info("Program Studi {$programName} populated.");
    }

    private function attachMedia($setting, $sectionKey)
    {
        $imageName = null;
        $collection = null;

        // Use different images for variety if possible, or fallback
        if ($sectionKey === 'hero') {
            $imageName = 'hero-bg-sman1baleendah.jpeg';
            $collection = 'hero_bg';
        } elseif ($sectionKey === 'facilities') {
            $imageName = 'panen-karya-sman1-baleendah.jpg'; // Lab/Facility image
            $collection = 'facilities_main_image';
        } elseif ($sectionKey === 'alumni_spotlight') {
            $imageName = 'keluarga-besar-sman1-baleendah.png'; // Alumni photo
            $collection = 'alumni_image';
        }

        if ($imageName) {
            $sourcePath = public_path("images/{$imageName}");
            if (File::exists($sourcePath)) {
                // Clear old media to avoid duplicates
                $setting->clearMediaCollection($collection);
                $setting->addMedia($sourcePath)
                    ->preservingOriginal()
                    ->toMediaCollection($collection);
            }
        }
    }

    private function getDataForProgram($programName)
    {
        switch ($programName) {
            case 'mipa':
                return [
                    'hero' => [
                        'title' => 'Matematika & Ilmu Pengetahuan Alam',
                        'description' => 'Membangun logika berpikir analitis dan pemahaman mendalam tentang alam semesta. Mempersiapkan saintis masa depan yang inovatif.',
                    ],
                    'core_subjects' => [
                        'title' => 'Mata Pelajaran Peminatan',
                        'description' => 'Kurikulum mendalam dengan fokus pada penguatan sains dan teknologi.',
                        'items' => [
                            ['title' => 'Matematika Peminatan', 'desc' => 'Kalkulus, Trigonometri, dan Aljabar Lanjut'],
                            ['title' => 'Fisika', 'desc' => 'Mekanika, Termodinamika, dan Fisika Modern'],
                            ['title' => 'Kimia', 'desc' => 'Kimia Organik, Stoikiometri, dan Larutan'],
                            ['title' => 'Biologi', 'desc' => 'Genetika, Ekologi, dan Anatomi Fisiologi'],
                        ]
                    ],
                    'facilities' => [
                        'title' => 'Fasilitas Riset',
                        'description' => 'Laboratorium lengkap berstandar nasional untuk mendukung praktikum siswa.',
                        'main_title' => 'Laboratorium Terpadu',
                        'main_description' => 'Pusat praktikum Fisika, Kimia, dan Biologi dengan peralatan modern untuk eksperimen ilmiah.',
                        'items' => [
                            'Laboratorium Komputer & CBT',
                            'Green House & Apotek Hidup',
                            'Teleskop Astronomi',
                            'Perpustakaan Digital Sains'
                        ]
                    ],
                    'career_paths' => [
                        'title' => 'Prospek Masa Depan',
                        'description' => 'Lulusan MIPA memiliki peluang luas di bidang sains, teknik, dan kesehatan.',
                        'items' => [
                            ['title' => 'Kedokteran & Kesehatan', 'desc' => 'Dokter, Apoteker, Ahli Gizi'],
                            ['title' => 'Teknik & Rekayasa', 'desc' => 'Teknik Sipil, Industri, Elektro, Informatika'],
                            ['title' => 'Sains Murni', 'desc' => 'Peneliti, Ahli Biologi, Kimiawan'],
                            ['title' => 'Teknologi Informasi', 'desc' => 'Data Scientist, Software Engineer']
                        ]
                    ],
                    'alumni_spotlight' => [
                        'quote' => 'Dasar logika dan analisis yang saya pelajari di program MIPA SMAN 1 Baleendah sangat membantu saya bertahan dan berprestasi di perkuliahan Teknik Informatika ITB.',
                        'name' => 'Aditya Pratama',
                        'description' => 'Software Engineer di Unicorn Tech, Alumni 2018'
                    ]
                ];

            case 'ips':
                return [
                    'hero' => [
                        'title' => 'Ilmu Pengetahuan Sosial',
                        'description' => 'Mempelajari dinamika masyarakat, ekonomi, dan sejarah. Membentuk pemimpin masa depan yang peka terhadap isu sosial.',
                    ],
                    'core_subjects' => [
                        'title' => 'Mata Pelajaran Peminatan',
                        'description' => 'Fokus pada pemahaman fenomena sosial dan interaksi antar manusia.',
                        'items' => [
                            ['title' => 'Ekonomi', 'desc' => 'Akuntansi, Manajemen, dan Teori Ekonomi'],
                            ['title' => 'Sosiologi', 'desc' => 'Interaksi Sosial, Konflik, dan Perubahan Masyarakat'],
                            ['title' => 'Geografi', 'desc' => 'Pemetaan, Lingkungan Hidup, dan Kependudukan'],
                            ['title' => 'Sejarah Peminatan', 'desc' => 'Sejarah Dunia dan Pergerakan Nasional'],
                        ]
                    ],
                    'facilities' => [
                        'title' => 'Fasilitas Penunjang',
                        'description' => 'Ruang belajar interaktif untuk diskusi dan simulasi sosial.',
                        'main_title' => 'Ruang Multimedia Sosial',
                        'main_description' => 'Dilengkapi proyektor dan sound system untuk pemutaran dokumenter sejarah dan simulasi sidang PBB.',
                        'items' => [
                            'Laboratorium IPS & Peta',
                            'Corner Bursa Efek Mini',
                            'Studio Podcast Sosial',
                            'Ruang Diskusi & Debat'
                        ]
                    ],
                    'career_paths' => [
                        'title' => 'Prospek Karir',
                        'description' => 'Membuka jalan menuju karir di bidang bisnis, hukum, dan pemerintahan.',
                        'items' => [
                            ['title' => 'Ekonomi & Bisnis', 'desc' => 'Akuntan, Manajer, Entrepreneur'],
                            ['title' => 'Hukum & Politik', 'desc' => 'Pengacara, Diplomat, Politisi'],
                            ['title' => 'Media & Komunikasi', 'desc' => 'Jurnalis, Public Relations'],
                            ['title' => 'Psikologi & Sosial', 'desc' => 'Psikolog, Peneliti Sosial']
                        ]
                    ],
                    'alumni_spotlight' => [
                        'quote' => 'Belajar IPS mengajarkan saya memahami perspektif manusia yang beragam. Skill komunikasi dan analisis sosial ini kunci sukses saya di dunia hukum.',
                        'name' => 'Sarah Amalia, S.H.',
                        'description' => 'Associate Lawyer di Jakarta, Alumni 2017'
                    ]
                ];

            case 'bahasa':
                return [
                    'hero' => [
                        'title' => 'Bahasa & Budaya',
                        'description' => 'Mengeksplorasi kekayaan bahasa dan budaya dunia. Jembatan komunikasi global dan pelestarian kearifan lokal.',
                    ],
                    'core_subjects' => [
                        'title' => 'Mata Pelajaran Peminatan',
                        'description' => 'Penguasaan bahasa asing dan pemahaman lintas budaya.',
                        'items' => [
                            ['title' => 'Bahasa & Sastra Inggris', 'desc' => 'Literature, Writing, dan TOEFL Prep'],
                            ['title' => 'Bahasa & Sastra Indonesia', 'desc' => 'Kajian Prosa, Puisi, dan Jurnalistik'],
                            ['title' => 'Bahasa Asing Pilihan', 'desc' => 'Bahasa Jepang / Jerman / Perancis'],
                            ['title' => 'Antropologi', 'desc' => 'Kajian Budaya dan Etnografi'],
                        ]
                    ],
                    'facilities' => [
                        'title' => 'Laboratorium Bahasa',
                        'description' => 'Sarana modern untuk melatih kemampuan menyimak dan berbicara.',
                        'main_title' => 'Language Center',
                        'main_description' => 'Laboratorium bahasa multimedia dengan headset dan software interaktif untuk latihan listening dan speaking.',
                        'items' => [
                            'Pojok Literasi & Budaya',
                            'Panggung Teater Mini',
                            'Studio Rekaman Bahasa',
                            'Koleksi Sastra Perpustakaan'
                        ]
                    ],
                    'career_paths' => [
                        'title' => 'Peluang Global',
                        'description' => 'Keahlian bahasa membuka pintu karir internasional.',
                        'items' => [
                            ['title' => 'Komunikasi & Media', 'desc' => 'Penerjemah, Content Writer, Editor'],
                            ['title' => 'Pariwisata & Hospitaliti', 'desc' => 'Tour Guide, Staff Hotel Internasional'],
                            ['title' => 'Hubungan Internasional', 'desc' => 'Diplomat, Staff NGO'],
                            ['title' => 'Seni & Kreatif', 'desc' => 'Penulis Skenario, Kurator Seni']
                        ]
                    ],
                    'alumni_spotlight' => [
                        'quote' => 'Kemampuan bahasa asing yang saya asah di SMA membuka kesempatan saya mendapatkan beasiswa kuliah di Jepang. Budaya disiplin yang diajarkan sangat membekas.',
                        'name' => 'Rizky Ramadhan',
                        'description' => 'Mahasiswa S2 Tokyo University, Alumni 2019'
                    ]
                ];

            default:
                return [];
        }
    }
}
