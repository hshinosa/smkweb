<?php

namespace Database\Seeders;

use App\Models\Gallery;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $galleries = [
            [
                'title' => "Upacara Bendera Senin",
                'description' => "Kegiatan rutin upacara bendera setiap hari Senin di halaman sekolah",
                'type' => "photo",
                'url' => "https://picsum.photos/800/600?random=1",
                'thumbnail_url' => "https://picsum.photos/300/200?random=1",
                'category' => "Kegiatan Akademik",
                'date' => "2024-01-15",
                'tags' => ["upacara", "bendera", "rutin", "senin"],
                'is_featured' => true,
            ],
            [
                'title' => "Lomba Basket Antar Kelas",
                'description' => "Pertandingan basket seru antar kelas dalam rangka pekan olahraga sekolah",
                'type' => "photo",
                'url' => "https://picsum.photos/800/600?random=2",
                'thumbnail_url' => "https://picsum.photos/300/200?random=2",
                'category' => "Olahraga",
                'date' => "2024-01-20",
                'tags' => ["basket", "lomba", "olahraga", "kelas"],
                'is_featured' => true,
            ],
            [
                'title' => "Pentas Seni Budaya",
                'description' => "Pertunjukan seni dan budaya siswa dalam acara tahunan sekolah",
                'type' => "video",
                'url' => "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                'thumbnail_url' => "https://picsum.photos/300/200?random=3",
                'category' => "Seni & Budaya",
                'date' => "2024-02-10",
                'tags' => ["seni", "budaya", "pentas", "tahunan"],
                'is_featured' => true,
            ],
            [
                'title' => "Wisuda Kelas XII",
                'description' => "Upacara wisuda dan pelepasan siswa kelas XII tahun ajaran 2023/2024",
                'type' => "photo",
                'url' => "https://picsum.photos/800/600?random=4",
                'thumbnail_url' => "https://picsum.photos/300/200?random=4",
                'category' => "Wisuda",
                'date' => "2024-06-15",
                'tags' => ["wisuda", "kelas12", "pelepasan", "lulus"],
                'is_featured' => true,
            ],
            [
                'title' => "Juara Olimpiade Matematika",
                'description' => "Siswa SMAN 1 Baleendah meraih juara 1 Olimpiade Matematika tingkat Kabupaten",
                'type' => "photo",
                'url' => "https://picsum.photos/800/600?random=5",
                'thumbnail_url' => "https://picsum.photos/300/200?random=5",
                'category' => "Prestasi",
                'date' => "2024-03-25",
                'tags' => ["olimpiade", "matematika", "juara", "prestasi"],
                'is_featured' => false,
            ],
            [
                'title' => "Laboratorium Kimia Baru",
                'description' => "Fasilitas laboratorium kimia yang baru direnovasi dengan peralatan modern",
                'type' => "photo",
                'url' => "https://picsum.photos/800/600?random=6",
                'thumbnail_url' => "https://picsum.photos/300/200?random=6",
                'category' => "Fasilitas",
                'date' => "2024-01-10",
                'tags' => ["laboratorium", "kimia", "fasilitas", "renovasi"],
                'is_featured' => false,
            ],
        ];

        foreach ($galleries as $gallery) {
            Gallery::updateOrCreate(['title' => $gallery['title']], $gallery);
        }
    }
}
