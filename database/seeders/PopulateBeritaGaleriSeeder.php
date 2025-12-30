<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Gallery;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PopulateBeritaGaleriSeeder extends Seeder
{
    public function run(): void
    {
        // Get first user as author
        $author = User::first();
        $authorId = $author ? $author->id : 1;

        // Populate Berita/Posts
        $posts = [
            [
                'title' => 'Siswa SMAN 1 Baleendah Raih Juara 1 Olimpiade Sains Nasional',
                'slug' => 'siswa-sman-1-baleendah-raih-juara-1-olimpiade-sains-nasional',
                'excerpt' => 'Prestasi membanggakan diraih oleh siswa SMAN 1 Baleendah dalam ajang Olimpiade Sains Nasional tingkat provinsi.',
                'content' => '<p>Prestasi membanggakan kembali diraih oleh siswa SMAN 1 Baleendah. Dalam ajang Olimpiade Sains Nasional (OSN) tingkat Provinsi Jawa Barat yang diselenggarakan pada tanggal 15-17 November 2024, perwakilan sekolah kita berhasil meraih Juara 1 untuk bidang Matematika.</p><p>Muhammad Rizky Pratama, siswa kelas XII MIPA 1, berhasil mengalahkan 150 peserta dari berbagai sekolah di Jawa Barat. Keberhasilan ini tidak lepas dari bimbingan intensif para guru dan kerja keras siswa dalam mempersiapkan kompetisi.</p><p>Kepala Sekolah SMAN 1 Baleendah menyampaikan apresiasi dan rasa bangga atas pencapaian ini. "Ini adalah bukti bahwa siswa-siswi kita memiliki potensi luar biasa yang perlu terus dikembangkan," ujarnya.</p>',
                'category' => 'Prestasi',
                'featured_image' => 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
                'status' => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Pembukaan Penerimaan Peserta Didik Baru Tahun Ajaran 2025/2026',
                'slug' => 'pembukaan-ppdb-tahun-ajaran-2025-2026',
                'excerpt' => 'SMAN 1 Baleendah membuka pendaftaran PPDB untuk tahun ajaran 2025/2026 dengan berbagai jalur seleksi.',
                'content' => '<p>SMAN 1 Baleendah dengan bangga mengumumkan pembukaan Penerimaan Peserta Didik Baru (PPDB) untuk Tahun Ajaran 2025/2026. Pendaftaran akan dibuka mulai tanggal 1 Januari 2025.</p><p>Tersedia beberapa jalur pendaftaran yang dapat dipilih oleh calon peserta didik:</p><ul><li>Jalur Zonasi (50%)</li><li>Jalur Afirmasi (15%)</li><li>Jalur Perpindahan Orang Tua (5%)</li><li>Jalur Prestasi (30%)</li></ul><p>Untuk informasi lebih lanjut mengenai persyaratan dan prosedur pendaftaran, silakan kunjungi halaman Informasi SPMB atau hubungi panitia PPDB di nomor yang tertera.</p>',
                'category' => 'Pengumuman',
                'featured_image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
                'status' => 'published',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Peringatan Hari Guru Nasional 2024',
                'slug' => 'peringatan-hari-guru-nasional-2024',
                'excerpt' => 'SMAN 1 Baleendah mengadakan upacara dan rangkaian kegiatan dalam rangka memperingati Hari Guru Nasional.',
                'content' => '<p>Dalam rangka memperingati Hari Guru Nasional yang jatuh pada tanggal 25 November 2024, SMAN 1 Baleendah mengadakan berbagai kegiatan untuk mengapresiasi dedikasi para guru.</p><p>Kegiatan dimulai dengan upacara bendera khusus yang diikuti seluruh civitas akademika. Dilanjutkan dengan pemberian penghargaan kepada guru-guru berprestasi dan guru dengan masa pengabdian terlama.</p><p>Para siswa juga menyiapkan persembahan berupa penampilan seni dan video ucapan terima kasih untuk para guru tercinta. Acara ditutup dengan doa bersama untuk kesejahteraan dan kesuksesan seluruh guru di Indonesia.</p>',
                'category' => 'Kegiatan',
                'featured_image' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800',
                'status' => 'published',
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Ekstrakurikuler Basket Juara Turnamen Antar SMA',
                'slug' => 'ekstrakurikuler-basket-juara-turnamen-antar-sma',
                'excerpt' => 'Tim basket SMAN 1 Baleendah berhasil menjadi juara dalam turnamen basket antar SMA se-Kabupaten Bandung.',
                'content' => '<p>Tim basket SMAN 1 Baleendah kembali mengukir prestasi gemilang. Dalam Turnamen Basket Antar SMA se-Kabupaten Bandung yang berlangsung pada 20-22 November 2024, tim putra berhasil meraih gelar juara setelah mengalahkan SMAN 2 Dayeuhkolot di babak final dengan skor 78-65.</p><p>Pertandingan berlangsung sengit sejak quarter pertama. Namun, dengan strategi permainan yang solid dan semangat pantang menyerah, tim kita berhasil mempertahankan keunggulan hingga peluit akhir.</p><p>Pelatih tim basket mengungkapkan rasa bangganya atas pencapaian ini dan berharap prestasi ini dapat memotivasi siswa lain untuk terus berprestasi dalam berbagai bidang.</p>',
                'category' => 'Prestasi',
                'featured_image' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
                'status' => 'published',
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Workshop Kewirausahaan untuk Siswa Kelas XII',
                'slug' => 'workshop-kewirausahaan-siswa-kelas-xii',
                'excerpt' => 'SMAN 1 Baleendah bekerja sama dengan alumni sukses mengadakan workshop kewirausahaan.',
                'content' => '<p>Sebagai bagian dari program persiapan karir siswa, SMAN 1 Baleendah mengadakan Workshop Kewirausahaan yang ditujukan khusus untuk siswa kelas XII. Workshop ini berlangsung pada hari Sabtu, 16 November 2024 di Aula Sekolah.</p><p>Acara ini menghadirkan narasumber dari kalangan alumni yang telah sukses dalam dunia bisnis. Mereka berbagi pengalaman dan tips memulai usaha sejak dini, termasuk pemanfaatan teknologi digital untuk pemasaran.</p><p>Para siswa sangat antusias mengikuti sesi workshop ini. Banyak pertanyaan diajukan terkait modal usaha, cara mengatasi kegagalan, dan strategi membangun brand. Diharapkan kegiatan ini dapat menumbuhkan jiwa entrepreneurship di kalangan siswa.</p>',
                'category' => 'Kegiatan',
                'featured_image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
                'status' => 'published',
                'published_at' => now()->subDays(14),
            ],
            [
                'title' => 'Jadwal Ujian Akhir Semester Ganjil 2024/2025',
                'slug' => 'jadwal-ujian-akhir-semester-ganjil-2024-2025',
                'excerpt' => 'Pengumuman jadwal pelaksanaan Ujian Akhir Semester (UAS) Ganjil Tahun Ajaran 2024/2025.',
                'content' => '<p>Diberitahukan kepada seluruh siswa dan orang tua/wali murid bahwa Ujian Akhir Semester (UAS) Ganjil Tahun Ajaran 2024/2025 akan dilaksanakan pada:</p><p><strong>Tanggal:</strong> 9-20 Desember 2024<br><strong>Waktu:</strong> 07.30 - 12.00 WIB</p><p>Hal-hal yang perlu diperhatikan:</p><ul><li>Siswa wajib hadir 15 menit sebelum ujian dimulai</li><li>Membawa alat tulis lengkap</li><li>Menggunakan seragam sesuai ketentuan</li><li>Tidak diperkenankan membawa HP ke ruang ujian</li></ul><p>Jadwal lengkap per mata pelajaran dapat diunduh melalui website sekolah atau ditanyakan kepada wali kelas masing-masing. Selamat belajar dan sukses untuk semua!</p>',
                'category' => 'Pengumuman',
                'featured_image' => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
                'status' => 'published',
                'published_at' => now()->subDays(3),
            ],
        ];

        foreach ($posts as $post) {
            $post['author_id'] = $authorId;
            Post::updateOrCreate(
                ['slug' => $post['slug']],
                $post
            );
        }

        $this->command->info('Berhasil populate ' . count($posts) . ' berita!');

        // Populate Gallery (Photos only)
        $galleries = [
            [
                'title' => 'Upacara Bendera Hari Senin',
                'description' => 'Kegiatan upacara bendera rutin setiap hari Senin di lapangan sekolah.',
                'url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Kegiatan Belajar di Kelas',
                'description' => 'Suasana kegiatan belajar mengajar di kelas.',
                'url' => 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Laboratorium Komputer',
                'description' => 'Siswa sedang praktikum di laboratorium komputer.',
                'url' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Perpustakaan Sekolah',
                'description' => 'Fasilitas perpustakaan yang nyaman untuk belajar.',
                'url' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Kegiatan Ekstrakurikuler Basket',
                'description' => 'Latihan rutin tim basket sekolah.',
                'url' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Pentas Seni Siswa',
                'description' => 'Penampilan siswa dalam acara pentas seni tahunan.',
                'url' => 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Laboratorium IPA',
                'description' => 'Praktikum siswa di laboratorium IPA.',
                'url' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Kegiatan OSIS',
                'description' => 'Rapat koordinasi pengurus OSIS.',
                'url' => 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Lapangan Olahraga',
                'description' => 'Fasilitas lapangan olahraga serbaguna.',
                'url' => 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
                'type' => 'photo',
                'is_featured' => false,
            ],
            [
                'title' => 'Kegiatan Pramuka',
                'description' => 'Latihan rutin kegiatan pramuka.',
                'url' => 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
                'type' => 'photo',
                'is_featured' => false,
            ],
            [
                'title' => 'Wisuda Kelas XII',
                'description' => 'Momen wisuda siswa kelas XII.',
                'url' => 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800',
                'type' => 'photo',
                'is_featured' => false,
            ],
            [
                'title' => 'Kelas Bahasa',
                'description' => 'Kegiatan belajar di program studi Bahasa.',
                'url' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
                'type' => 'photo',
                'is_featured' => false,
            ],
        ];

        foreach ($galleries as $gallery) {
            Gallery::updateOrCreate(
                ['title' => $gallery['title']],
                $gallery
            );
        }

        $this->command->info('Berhasil populate ' . count($galleries) . ' galeri foto!');
    }
}
