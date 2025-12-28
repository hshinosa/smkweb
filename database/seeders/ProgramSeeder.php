<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            // Program Studi (Untuk Landing Page)
            [
                'title' => "MIPA",
                'category' => "Program Studi",
                'icon_name' => 'Microscope',
                'color_class' => "bg-blue-50 text-primary",
                'description' => "Program unggulan bagi siswa yang berminat dalam sains, teknologi, dan matematika. Fasilitas laboratorium lengkap.",
                'link' => '/akademik/program-studi/mipa',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => "IPS",
                'category' => "Program Studi",
                'icon_name' => 'Globe',
                'color_class' => "bg-blue-50 text-primary",
                'description' => "Mendalami fenomena sosial, ekonomi, dan sejarah. Membentuk karakter kritis dan berwawasan luas.",
                'link' => '/akademik/program-studi/ips',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => "Bahasa",
                'category' => "Program Studi",
                'icon_name' => 'BookOpen',
                'color_class' => "bg-blue-50 text-primary",
                'description' => "Eksplorasi bahasa asing dan seni budaya. Mempersiapkan siswa kompeten dalam komunikasi global.",
                'link' => '/akademik/program-studi/bahasa',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            // Program Sekolah (Untuk Halaman Program Sekolah)
            [
                'title' => "Program Hafidz & Kajian Muslim",
                'category' => "Program Sekolah",
                'icon_name' => 'BookOpen',
                'color_class' => "bg-blue-100 text-blue-600",
                'description' => "Program pembinaan keagamaan intensif untuk mencetak generasi penghafal Al-Qur'an dan memperdalam pemahaman nilai-nilai Islam yang rahmatan lil alamin.",
                'link' => '/program/hafidz',
                'is_featured' => false,
                'sort_order' => 4,
            ],
            [
                'title' => "Gerakan Memungut Sampah (GMS)",
                'category' => "Program Sekolah",
                'icon_name' => 'Leaf',
                'color_class' => "bg-green-100 text-green-600",
                'description' => "Inisiatif sekolah untuk menumbuhkan kesadaran lingkungan melalui pembiasaan memungut sampah sebelum dan sesudah kegiatan belajar mengajar.",
                'link' => '/program/gms',
                'is_featured' => false,
                'sort_order' => 5,
            ],
            [
                'title' => "Pengembangan Lab Sains & Bahasa",
                'category' => "Program Sekolah",
                'icon_name' => 'Microscope',
                'color_class' => "bg-purple-100 text-purple-600",
                'description' => "Modernisasi fasilitas laboratorium sains dan bahasa dengan peralatan terkini untuk mendukung pembelajaran praktikum yang efektif dan menyenangkan.",
                'link' => '/program/lab',
                'is_featured' => false,
                'sort_order' => 6,
            ],
            [
                'title' => "Implementasi Jabar Masagi & P5",
                'category' => "Program Sekolah",
                'icon_name' => 'Users',
                'color_class' => "bg-orange-100 text-orange-600",
                'description' => "Penguatan karakter siswa melalui nilai-nilai kearifan lokal Jawa Barat dan Proyek Penguatan Profil Pelajar Pancasila.",
                'link' => '/program/jabar-masagi',
                'is_featured' => false,
                'sort_order' => 7,
            ],
        ];

        foreach ($programs as $program) {
            Program::updateOrCreate(
                ['title' => $program['title']],
                $program
            );
        }
    }
}
