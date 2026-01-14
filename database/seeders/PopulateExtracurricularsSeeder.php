<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Extracurricular;
use Illuminate\Support\Facades\File;

class PopulateExtracurricularsSeeder extends Seeder
{
    public function run()
    {
        Extracurricular::truncate();

        $data = [
            // OLAHRAGA
            [
                'name' => 'Futsal',
                'category' => 'Olahraga',
                'description' => 'Mengembangkan bakat sepak bola mini dengan teknik dan strategi permainan yang solid. Melatih kerjasama tim dan sportivitas tinggi.',
                'schedule' => 'Senin & Kamis, 15.30 - 17.30',
                'coach_name' => 'Coach Budi',
                'achievements' => ['Juara 1 Liga Pelajar 2024', 'Juara 2 Turnamen Kota 2023'],
                'image_name' => 'hero-bg-sman1baleendah.jpeg' 
            ],
            [
                'name' => 'Basket',
                'category' => 'Olahraga',
                'description' => 'Klub basket unggulan sekolah yang fokus pada fundamental dribble, shooting, dan defense. Rutin mengikuti DBL dan kompetisi antar sekolah.',
                'schedule' => 'Rabu & Jumat, 15.00 - 17.00',
                'coach_name' => 'Coach Andi',
                'achievements' => ['Semifinalis DBL West Java 2024'],
                'image_name' => 'hero-bg-sman1baleendah.jpeg'
            ],
            [
                'name' => 'Voli',
                'category' => 'Olahraga',
                'description' => 'Melatih ketangkasan dan kekompakan tim dalam olahraga bola voli. Mencetak atlet-atlet muda berbakat.',
                'schedule' => 'Selasa, 16.00 - 18.00',
                'coach_name' => 'Pak Asep',
                'achievements' => ['Juara 3 O2SN Tingkat Kota'],
                'image_name' => 'hero-bg-sman1baleendah.jpeg'
            ],

            // SENI & BUDAYA
            [
                'name' => 'Paduan Suara (Choir)',
                'category' => 'Seni & Budaya',
                'description' => 'Mengasah vokal dan harmoni dalam paduan suara. Rutin tampil dalam upacara bendera dan event-event besar sekolah maupun luar sekolah.',
                'schedule' => 'Senin, 15.00 - 17.00',
                'coach_name' => 'Ibu Rina',
                'achievements' => ['Gold Medal Festival Paduan Suara ITB 2023'],
                'image_name' => 'panen-karya-sman1-baleendah.jpg'
            ],
            [
                'name' => 'Teater & Drama',
                'category' => 'Seni & Budaya',
                'description' => 'Wadah ekspresi seni peran, penulisan naskah, dan artistik panggung. Membangun kepercayaan diri dan kemampuan public speaking.',
                'schedule' => 'Kamis, 16.00 - 18.00',
                'coach_name' => 'Kang Deden',
                'achievements' => ['Penyaji Terbaik FLS2N Tingkat Provinsi'],
                'image_name' => 'panen-karya-sman1-baleendah.jpg'
            ],
            [
                'name' => 'Seni Tari Tradisional',
                'category' => 'Seni & Budaya',
                'description' => 'Melestarikan budaya bangsa melalui seni tari daerah. Mempelajari berbagai tarian Nusantara khususnya Jawa Barat.',
                'schedule' => 'Rabu, 15.30 - 17.00',
                'coach_name' => 'Teh Nining',
                'achievements' => [],
                'image_name' => 'panen-karya-sman1-baleendah.jpg'
            ],

            // AKADEMIK & SAINS
            [
                'name' => 'KIR (Karya Ilmiah Remaja)',
                'category' => 'Akademik & Sains',
                'description' => 'Komunitas peneliti muda yang kritis dan inovatif. Melakukan penelitian ilmiah sederhana dan eksperimen sains.',
                'schedule' => 'Jumat, 13.00 - 15.00',
                'coach_name' => 'Pak Heri',
                'achievements' => ['Finalis LIPI LKIR 2024'],
                'image_name' => 'anak-sma-programstudi.png'
            ],
            [
                'name' => 'English Club',
                'category' => 'Akademik & Sains',
                'description' => 'Meningkatkan kemampuan bahasa Inggris melalui debate, storytelling, dan speech. Environment positif untuk berlatih speaking.',
                'schedule' => 'Selasa, 15.00 - 16.30',
                'coach_name' => 'Mr. John',
                'achievements' => ['Best Speaker English Debate Open 2024'],
                'image_name' => 'anak-sma-programstudi.png'
            ],
            [
                'name' => 'Robotik & IT',
                'category' => 'Akademik & Sains',
                'description' => 'Belajar coding, mikrokontroler, dan perakitan robot. Mempersiapkan siswa menghadapi era industri 4.0.',
                'schedule' => 'Sabtu, 09.00 - 12.00',
                'coach_name' => 'Kak Indra',
                'achievements' => ['Juara 1 Line Follower Robot Contest'],
                'image_name' => 'anak-sma-programstudi.png'
            ],

            // KEAGAMAAN & SOSIAL
            [
                'name' => 'Pramuka',
                'category' => 'Keagamaan & Sosial',
                'description' => 'Membentuk karakter disiplin, mandiri, dan cinta alam. Kegiatan perkemahan, survival, dan kepemimpinan.',
                'schedule' => 'Jumat, 14.00 - 16.00',
                'coach_name' => 'Kak Pembina',
                'achievements' => ['Juara Umum Lomba Tingkat III'],
                'image_name' => 'hero-bg-sman1baleendah.jpeg'
            ],
            [
                'name' => 'PMR (Palang Merah Remaja)',
                'category' => 'Keagamaan & Sosial',
                'description' => 'Melatih keterampilan pertolongan pertama dan kepedulian sosial kemanusiaan. Siap siaga membantu sesama.',
                'schedule' => 'Rabu, 15.00 - 17.00',
                'coach_name' => 'Ibu Yanti',
                'achievements' => [],
                'image_name' => 'hero-bg-sman1baleendah.jpeg'
            ],
            [
                'name' => 'Rohis (Kerohanian Islam)',
                'category' => 'Keagamaan & Sosial',
                'description' => 'Memperdalam ilmu agama Islam, tahsin Al-Quran, dan kegiatan sosial keagamaan untuk memperkuat iman dan taqwa.',
                'schedule' => 'Jumat, 11.30 - 13.00',
                'coach_name' => 'Ust. Ahmad',
                'achievements' => [],
                'image_name' => 'keluarga-besar-sman1-baleendah.png'
            ],
        ];

        foreach ($data as $item) {
            $imageName = $item['image_name'];
            unset($item['image_name']);

            $ekskul = Extracurricular::create($item);

            // Attach Image (Use same placeholders)
            $sourcePath = public_path("images/{$imageName}");
            if (File::exists($sourcePath)) {
                $ekskul->addMedia($sourcePath)
                    ->preservingOriginal()
                    ->toMediaCollection('images');
            }
        }

        $this->command->info('Extracurriculars populated successfully.');
    }
}
