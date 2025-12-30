<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use App\Models\SchoolProfileSetting;
use Illuminate\Database\Seeder;

class PopulateMissingSettingsSeeder extends Seeder
{
    public function run(): void
    {
        // Populate SiteSetting
        $siteSettings = [
            'general' => json_encode([
                'site_name' => 'SMAN 1 Baleendah',
                'site_description' => 'Website Resmi SMAN 1 Baleendah - Generasi Unggul & Berkarakter',
                'contact_email' => 'info@sman1baleendah.sch.id',
                'contact_phone' => '(022) 87881234',
                'contact_address' => 'Jl. Terusan Baleendah No. 123, Kabupaten Bandung, Jawa Barat 40375',
                'facebook_url' => 'https://facebook.com/sman1baleendah',
                'instagram_url' => 'https://instagram.com/sman1baleendah',
                'youtube_url' => 'https://youtube.com/@sman1baleendah',
                'twitter_url' => 'https://twitter.com/sman1baleendah',
            ]),
            'hero_program' => json_encode([
                'title' => 'Program',
                'subtitle' => 'Unggulan & Berkarakter',
                'description' => 'Membentuk generasi yang cerdas, berkarakter, dan siap menghadapi tantangan masa depan.',
                'background_image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920',
            ]),
            'hero_alumni' => json_encode([
                'title' => 'Alumni',
                'subtitle' => 'Berkarya & Berprestasi',
                'description' => 'Jejak langkah alumni kami yang berhasil berkarya di berbagai bidang.',
                'background_image' => 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1920',
            ]),
            'hero_teachers' => json_encode([
                'title' => 'Guru & Staff',
                'subtitle' => 'Profesional & Berdedikasi',
                'description' => 'Tenaga pendidik profesional yang berdedikasi mencetak generasi unggul.',
                'background_image' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920',
            ]),
            'hero_contact' => json_encode([
                'title' => 'Hubungi',
                'subtitle' => 'Kami',
                'description' => 'Jangan ragu untuk menghubungi kami untuk informasi lebih lanjut.',
                'background_image' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920',
            ]),
        ];

        foreach ($siteSettings as $key => $content) {
            SiteSetting::updateOrCreate(
                ['section_key' => $key],
                ['section_key' => $key, 'content' => $content]
            );
        }

        $this->command->info('Berhasil populate SiteSetting!');

        // Populate SchoolProfileSetting
        $schoolProfileSettings = [
            'hero_history' => json_encode([
                'title' => 'Sejarah &',
                'title_highlight' => 'Perjalanan Kami',
                'subtitle' => 'Mengenal lebih dekat perjalanan SMAN 1 Baleendah sejak tahun 1975.',
                'background_image' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920',
            ]),
            'history' => json_encode([
                'title' => 'Jejak Langkah Kami',
                'description_html' => '<p>SMAN 1 Baleendah berdiri pada tahun 1975 sebagai sekolah filial (kelas jauh) untuk memenuhi kebutuhan pendidikan di wilayah Baleendah. Dengan perjuangan dan dedikasi dari berbagai pihak, sekolah ini terus berkembang dan pada tahun 1980 resmi berdiri sendiri sebagai SMAN 1 Baleendah dengan SK Menteri Pendidikan.</p>',
                'timeline' => [
                    [
                        'year' => '1975',
                        'title' => 'Awal Pendirian',
                        'description' => 'Berdiri sebagai sekolah filial (kelas jauh) untuk memenuhi kebutuhan pendidikan di wilayah Baleendah.',
                        'side' => 'left'
                    ],
                    [
                        'year' => '1980',
                        'title' => 'Penegerian',
                        'description' => 'Resmi berdiri sendiri sebagai SMAN 1 Baleendah dengan SK Menteri Pendidikan, menandai era baru kemandirian.',
                        'side' => 'right'
                    ],
                    [
                        'year' => '2010',
                        'title' => 'Pengembangan Fasilitas',
                        'description' => 'Revitalisasi gedung utama dan pembangunan Masjid sekolah sebagai pusat pembentukan karakter siswa.',
                        'side' => 'left'
                    ],
                    [
                        'year' => 'Sekarang',
                        'title' => 'Era Prestasi',
                        'description' => 'Menjadi Sekolah Penggerak dan meraih predikat Sekolah Adiwiyata Tingkat Provinsi/Nasional.',
                        'side' => 'right'
                    ]
                ]
            ]),
            'facilities' => json_encode([
                'title' => 'Lingkungan',
                'title_highlight' => 'Belajar Modern',
                'description' => 'Fasilitas lengkap yang mendukung pengembangan akademik dan karakter siswa.',
                'items' => [
                    ['name' => 'Lab Komputer', 'image' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'],
                    ['name' => 'Perpustakaan', 'image' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600'],
                    ['name' => 'Masjid Sekolah', 'image' => 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=600'],
                    ['name' => 'Lapangan Olahraga', 'image' => 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600'],
                    ['name' => 'Ruang Kelas Modern', 'image' => 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600'],
                    ['name' => 'Lab IPA', 'image' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600'],
                ]
            ]),
            'hero_vision_mission' => json_encode([
                'title' => 'Visi &',
                'title_highlight' => 'Misi',
                'subtitle' => 'Arah dan tujuan SMAN 1 Baleendah dalam mencetak generasi unggul.',
                'background_image' => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920',
            ]),
            'vision_mission' => json_encode([
                'vision' => 'Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, inovatif, dan berwawasan lingkungan.',
                'missions' => [
                    'Melaksanakan pembelajaran berbasis teknologi dan inovasi.',
                    'Menanamkan nilai karakter dan budi pekerti luhur.',
                    'Mengembangkan potensi akademik dan non-akademik siswa.',
                    'Menciptakan lingkungan sekolah yang ramah dan berwawasan lingkungan.',
                    'Menjalin kerjasama dengan berbagai institusi pendidikan tinggi.'
                ]
            ]),
            'hero_organization' => json_encode([
                'title' => 'Struktur',
                'title_highlight' => 'Organisasi',
                'subtitle' => 'Sistem organisasi sekolah yang terstruktur dan efektif.',
                'background_image' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920',
            ]),
            'organization' => json_encode([
                'title' => 'Bagan Struktur',
                'description_html' => '<p>Organisasi SMAN 1 Baleendah terdiri dari kepala sekolah, wakil kepala sekolah, dan bagian-bagian yang saling berkoordinasi untuk kelancaran operasional sekolah.</p>',
                'chart' => [
                    ['title' => 'Kepala Sekolah', 'parent' => null],
                    ['title' => 'Waka Kurikulum', 'parent' => 'Kepala Sekolah'],
                    ['title' => 'Waka Kesiswaan', 'parent' => 'Kepala Sekolah'],
                    ['title' => 'Waka Humas', 'parent' => 'Kepala Sekolah'],
                    ['title' => 'Waka Sarpras', 'parent' => 'Kepala Sekolah'],
                ]
            ]),
        ];

        foreach ($schoolProfileSettings as $key => $content) {
            SchoolProfileSetting::updateOrCreate(
                ['section_key' => $key],
                ['section_key' => $key, 'content' => $content]
            );
        }

        $this->command->info('Berhasil populate SchoolProfileSetting!');
        $this->command->info('Semua setting telah di-populate!');
    }
}
