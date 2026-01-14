<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LandingPageSetting;

class UpdateLandingPageContentSeeder extends Seeder
{
    public function run()
    {
        // 1. HERO SECTION
        LandingPageSetting::updateOrCreate(
            ['section_key' => 'hero'],
            ['content' => json_encode([
                'title_line1' => 'Selamat Datang di',
                'title_line2' => 'SMA Negeri 1 Baleendah',
                'hero_text' => 'Sekolah penggerak prestasi dan inovasi masa depan. Kami berkomitmen mencetak lulusan yang cerdas, berakhlak mulia, dan siap bersaing di era global.',
                'background_image_url' => '/images/hero-bg-sman1baleendah.jpeg', // Fixed filename
                'student_image_url' => '/images/anak-sma.png',
                'stats' => [
                    ['label' => 'Akreditasi', 'value' => 'A', 'icon_name' => 'Trophy'],
                    ['label' => 'Lulusan', 'value' => '15k+', 'icon_name' => 'GraduationCap'],
                    ['label' => 'Siswa Aktif', 'value' => '1.2k+', 'icon_name' => 'Users']
                ]
            ])]
        );

        // 2. ABOUT SECTION
        LandingPageSetting::updateOrCreate(
            ['section_key' => 'about_lp'],
            ['content' => json_encode([
                'title' => 'Tentang SMAN 1 Baleendah',
                'description_html' => '<p class="mb-4">SMAN 1 Baleendah berdiri sejak tahun 1975 dan telah menjadi salah satu sekolah rujukan di Kabupaten Bandung. Dengan visi menjadi sekolah unggul dalam prestasi dan berwawasan lingkungan.</p><p>Kami terus berinovasi dalam pembelajaran berbasis teknologi dan penguatan karakter, mencetak generasi emas yang siap menghadapi tantangan masa depan.</p>',
                'image_url' => '/images/hero-bg-sman1baleendah.jpeg'
            ])]
        );

        // 3. KEPSEK WELCOME SECTION
        LandingPageSetting::updateOrCreate(
            ['section_key' => 'kepsek_welcome_lp'],
            ['content' => json_encode([
                'title' => 'Sambutan Kepala Sekolah',
                'kepsek_name' => 'Drs. H. Ahmad Suryadi, M.Pd.',
                'kepsek_title' => 'Kepala SMA Negeri 1 Baleendah',
                'kepsek_image_url' => '/images/kepala-sekolah.jpg',
                'welcome_text_html' => '<p class="mb-4">Assalamu\'alaikum Warahmatullahi Wabarakatuh,</p><p class="mb-4">Selamat datang di website resmi SMA Negeri 1 Baleendah. Website ini kami hadirkan sebagai media informasi dan komunikasi antara sekolah dengan masyarakat luas.</p><p>Kami berkomitmen untuk terus meningkatkan kualitas pelayanan pendidikan demi terwujudnya visi sekolah yang unggul dalam prestasi, berkarakter, dan berwawasan lingkungan.</p>',
            ])]
        );

        // 4. PROGRAMS SECTION (Intro Text Only)
        LandingPageSetting::updateOrCreate(
            ['section_key' => 'programs_lp'],
            ['content' => json_encode([
                'title' => 'Program Unggulan',
                'description' => 'Kami menawarkan berbagai program akademik dan non-akademik yang dirancang untuk mengembangkan potensi siswa secara maksimal, baik dalam bidang sains, sosial, maupun bahasa.'
            ])]
        );

        // 5. GALLERY SECTION (Intro Text Only)
        LandingPageSetting::updateOrCreate(
            ['section_key' => 'gallery_lp'],
            ['content' => json_encode([
                'title' => 'Galeri Kegiatan',
                'description' => 'Dokumentasi kegiatan siswa dan guru SMAN 1 Baleendah dalam berbagai aktivitas akademik maupun non-akademik.'
            ])]
        );

        // 6. CTA SECTION
        LandingPageSetting::updateOrCreate(
            ['section_key' => 'cta_lp'],
            ['content' => json_encode([
                'title' => 'Siap Bergabung Bersama Kami?',
                'description' => 'Jadilah bagian dari keluarga besar SMAN 1 Baleendah dan raih masa depan gemilang bersama kami. Pendaftaran Peserta Didik Baru dibuka setiap tahun ajaran baru.',
                'button_text' => 'Informasi PPDB',
                'button_url' => '/informasi-spmb',
                'image_url' => '/images/hero-bg-sman1baleendah.jpeg'
            ])]
        );
    }
}
