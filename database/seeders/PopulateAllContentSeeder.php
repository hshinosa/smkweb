<?php

namespace Database\Seeders;

use App\Models\CurriculumSetting;
use App\Models\SpmbSetting;
use App\Models\Alumni;
use App\Models\LandingPageSetting;
use App\Models\Extracurricular;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PopulateAllContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedLandingPageSettings();
        $this->seedCurriculumSettings();
        $this->seedSpmbSettings();
        $this->seedAlumni();
        $this->seedExtracurriculars();

        $this->command->info('Berhasil populate semua content!');
    }

    private function seedLandingPageSettings()
    {
        $data = [
            'hero' => json_encode([
                'title_line1' => 'Generasi Unggul',
                'title_line2' => '& Berkarakter',
                'hero_text' => 'SMAN 1 Baleendah berkomitmen mencetak generasi yang unggul berprestasi, berkarakter mulia, dan siap menghadapi tantangan global.',
                'cta_text' => 'Daftar Sekarang',
                'cta_link' => '/informasi-spmb',
                'background_image_url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920',
                'student_image_url' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
            ]),
            'about_lp' => json_encode([
                'title' => 'Tentang Kami',
                'description' => 'SMAN 1 Baleendah adalah sekolah menengah atas unggulan di Kabupaten Bandung yang telah berdiri sejak 1975, mencetak ribuan alumni berkualitas.',
            ]),
            'kepsek_welcome_lp' => json_encode([
                'title' => 'Sambutan Kepala Sekolah',
                'description' => 'Selamat datang di website resmi SMAN 1 Baleendah. Kami berkomitmen memberikan pendidikan terbaik untuk mencetak generasi berkarakter dan berprestasi.',
            ]),
            'programs_lp' => json_encode([
                'title' => 'Program Akademik',
                'description' => 'Pilihan program studi yang sesuai dengan minat dan bakat siswa untuk masa depan yang cerah.',
            ]),
            'gallery_lp' => json_encode([
                'title' => 'Galeri Sekolah',
                'description' => 'Dokumentasi kegiatan dan prestasi siswa SMAN 1 Baleendah.',
            ]),
            'cta_lp' => json_encode([
                'title' => 'Siap Menjadi Bagian dari Kami?',
                'description' => 'Bergabunglah dengan keluarga besar SMAN 1 Baleendah dan raih impianmu bersama kami.',
                'cta_text' => 'Daftar PPDB',
                'cta_link' => '/informasi-spmb',
            ]),
            'fakta_lp' => json_encode([
                'title' => 'Statistik',
                'description' => 'Pencapaian kami dalam bentuk angka.',
                'stats' => [
                    ['count' => '1500', 'label' => 'Siswa Aktif'],
                    ['count' => '45', 'label' => 'Guru Profesional'],
                    ['count' => '100', 'label' => 'Prestasi Nasional'],
                    ['count' => '50', 'label' => 'Tahun Berdiri'],
                ],
            ]),
            'kalender_akademik' => json_encode([
                'title' => 'Kalender',
                'title_highlight' => 'Akademik',
                'description' => 'Informasi lengkap kegiatan akademik sepanjang tahun.',
            ]),
        ];

        foreach ($data as $key => $content) {
            LandingPageSetting::updateOrCreate(
                ['section_key' => $key],
                ['section_key' => $key, 'content' => $content]
            );
        }

        $this->command->info('✓ LandingPageSettings populated');
    }

    private function seedCurriculumSettings()
    {
        $data = [
            'hero_curriculum' => json_encode([
                'title' => 'Kurikulum',
                'title_highlight' => 'Akademik',
                'description' => 'Kurikulum yang relevan dan adaptif dengan kebutuhan era modern.',
                'background_image' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920',
            ]),
            'curriculum_overview' => json_encode([
                'title' => 'Tentang Kurikulum',
                'description_html' => '<p>Kurikulum kami dirancang sesuai dengan standar pendidikan nasional dan disesuaikan dengan kebutuhan perkembangan zaman. Kombinasi antara pembelajaran akademik dan pengembangan karakter menjadi fokus utama.</p>',
            ]),
            'curriculum_structure' => json_encode([
                'title' => 'Struktur Kurikulum',
                'description_html' => '<p>Kurikulum terdiri dari kelompok mata pelajaran wajib dan peminatan memberikan fleksibilitas bagi siswa untuk mengembangkan potensinya.</p>',
            ]),
            'evaluation_system' => json_encode([
                'title' => 'Sistem Evaluasi',
                'description_html' => '<p>Evaluasi dilakukan secara berkala dan komprehensif untuk memantau kemajuan belajar siswa.</p>',
            ]),
            'curriculum_innovation' => json_encode([
                'title' => 'Inovasi Pembelajaran',
                'description_html' => '<p>Penerapan metode pembelajaran modern berbasis teknologi dan pendekatan student-centered learning.</p>',
            ]),
        ];

        foreach ($data as $key => $content) {
            CurriculumSetting::updateOrCreate(
                ['section_key' => $key],
                ['section_key' => $key, 'content' => $content]
            );
        }

        $this->command->info('✓ CurriculumSettings populated');
    }

    private function seedSpmbSettings()
    {
        $data = [
            'hero_spmb' => json_encode([
                'title' => 'Informasi',
                'title_highlight' => 'PPDB',
                'description' => 'Panduan lengkap penerimaan peserta didik baru tahun ajaran 2025/2026.',
                'background_image' => 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1920',
            ]),
            'persyaratan_ppdb' => json_encode([
                'title' => 'Persyaratan',
                'title_highlight' => 'Pendaftaran',
                'description_html' => '<p>Berikut adalah berkas yang perlu disiapkan:</p>',
                'items' => [
                    'Fotokopi Ijazah SKL SMP sederhana.',
                    'Fotokopi Kartu Keluarga.',
                    'Fotokopi Akta Lahir.',
                    'Pas Foto 3x4 berwarna (lembar 3).',
                    'Surat Keterangan Wali/Dosen untuk anak yatim / yatim piatu.',
                ],
            ]),
            'jadwal_ppdb' => json_encode([
                'title' => 'Jadwal',
                'title_highlight' => 'Pendaftaran',
                'description_html' => '<p>Simpan tanggal-tanggal penting berikut:</p>',
                'items' => [
                    'Pengumuman PPDB: 1 Januari 2025',
                    'Pendaftaran Online: 15 Januari - 15 Februari 2025',
                    'Verifikasi Berkas: 1 - 10 Maret 2025',
                    'Pengumuman Hasil: 20 Maret 2025',
                    'Daftar Ulang: 25 - 30 Maret 2025',
                ],
            ]),
            'biaya_ppdb' => json_encode([
                'title' => 'Biaya',
                'title_highlight' => 'Pendidikan',
                'description_html' => '<p>Rincian biaya pendidikan dapat dikonsultasikan dengan bagian administrasi.</p>',
            ]),
            'kontak_ppdb' => json_encode([
                'title' => 'Kontak',
                'title_highlight' => 'Panitia PPDB',
                'description_html' => '<p>Untuk informasi lebih lanjut, hubungi:</p>',
                'items' => [
                    'Telepon: (022) 87881234',
                    'Email: ppdb@sman1baleendah.sch.id',
                    'Jam Operasional: Senin - Jumat, 08:00 - 15:00 WIB',
                ],
            ]),
            'faq_ppdb' => json_encode([
                'title' => 'Pertanyaan',
                'title_highlight' => 'Umum',
                'description_html' => '<p>Jawaban untuk pertanyaan yang sering diajukan.</p>',
            ]),
        ];

        foreach ($data as $key => $content) {
            SpmbSetting::updateOrCreate(
                ['section_key' => $key],
                ['section_key' => $key, 'content' => $content]
            );
        }

        $this->command->info('✓ SpmbSettings populated');
    }

    private function seedAlumni()
    {
        $data = [
            [
                'name' => 'Dr. Ahmad Hidayat',
                'graduation_year' => 2005,
                'current_position' => 'Dosen Universitas Indonesia',
                'education' => 'S1 Pendidikan Matematika',
                'testimonial' => 'SMAN 1 Baleendah memberikan fondasi akademik yang kuat dan mengajarkan nilai-nilai karakter yang saya bawa hingga masa dewasa.',
                'image_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                'is_published' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Sarah Wijaya',
                'graduation_year' => 2010,
                'current_position' => 'Entrepreneur - Founder Tech Startup',
                'education' => 'S1 Ekonomi',
                'testimonial' => 'Lingkungan sekolah yang mendukung dan guru-guru yang berdedikasi membantu saya mengejar mimpi menjadi pengusaha.',
                'image_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                'is_published' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Budi Santoso',
                'graduation_year' => 2015,
                'current_position' => 'Engineer di Perusahaan Teknologi Global',
                'education' => 'S1 Teknik Informatika',
                'testimonial' => 'Fasilitas dan kurikulum yang berkualitas mempersiapkan saya untuk bersaing di kancah internasional.',
                'image_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                'is_published' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Putri Ayu',
                'graduation_year' => 2018,
                'current_position' => 'Dokter Spesialis Anak',
                'education' => 'S1 Kedokteran',
                'testimonial' => 'Disiplin dan kerja keras yang diajarkan di sekolah menjadi pondasi sukses saya dalam pendidikan kedokteran.',
                'image_url' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                'is_published' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($data as $alumni) {
            Alumni::updateOrCreate(
                ['name' => $alumni['name'], 'graduation_year' => $alumni['graduation_year']],
                $alumni
            );
        }

        $this->command->info('✓ Alumni populated');
    }

    private function seedExtracurriculars()
    {
        $data = [
            [
                'name' => 'Pramuka',
                'category' => 'Organisasi',
                'description' => 'Mengembangkan kedisiplinan, kepemimpinan, dan kemandirian siswa melalui kegiatan kepramukaan.',
                'icon_name' => 'Leaf',
                'image_url' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Basket',
                'category' => 'Olahraga',
                'description' => 'Melatih kerjasama tim, fisik, dan sportivitas dalam olahraga basket.',
                'icon_name' => 'Trophy',
                'image_url' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Paduan Suara',
                'category' => 'Seni',
                'description' => 'Mengembangkan bakat musik dan kerjasama dalam paduan suara.',
                'icon_name' => 'Music',
                'image_url' => 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'ROHIS',
                'category' => 'Keagamaan',
                'description' => 'Rohani Islam untuk pembinaan keagamaan dan karakter siswa Muslim.',
                'icon_name' => 'BookOpen',
                'image_url' => 'https://images.unsplash.com/photo-1584286595398-a59f21d313ee?w=600',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Paskibra',
                'category' => 'Organisasi',
                'description' => 'Pasukan Pengibar Bendera untuk melatih kedisiplinan dan patriotisme.',
                'icon_name' => 'Users',
                'image_url' => 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'English Club',
                'category' => 'Akademik',
                'description' => 'Klub bahasa Inggris untuk meningkatkan kemampuan komunikasi dalam bahasa Inggris.',
                'icon_name' => 'Globe',
                'image_url' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($data as $extra) {
            Extracurricular::updateOrCreate(
                ['name' => $extra['name']],
                $extra
            );
        }

        $this->command->info('✓ Extracurriculars populated');
    }
}
