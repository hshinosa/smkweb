<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CurriculumSetting extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = ['section_key', 'content'];

    protected $casts = [
        'content' => 'array',
    ];

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('mobile')
            ->width(375)
            ->format('webp')
            ->quality(80)
            ->nonQueued();

        $this->addMediaConversion('desktop')
            ->width(1280)
            ->format('webp')
            ->quality(90)
            ->nonQueued();

        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(90)
            ->nonQueued();
    }

    public static function getSectionFields()
    {
        return [
            'hero' => [
                'title' => 'Judul Hero',
                'subtitle' => 'Sub-judul Hero',
                'image' => 'Background Hero',
            ],
            'intro' => [
                'title' => 'Kurikulum Merdeka',
                'description' => 'SMA Negeri 1 Baleendah menerapkan Kurikulum Merdeka yang memberikan fleksibilitas kepada siswa untuk memilih mata pelajaran sesuai dengan minat, bakat, dan aspirasi karier.',
            ],
            'fase_e' => [
                'title' => 'Eksplorasi Minat & Bakat',
                'description' => 'Pada fase ini, siswa difokuskan untuk mengenali potensi diri melalui pembelajaran mata pelajaran umum. Siswa didorong untuk mengeksplorasi berbagai bidang ilmu sebelum menentukan pilihan spesifik di fase berikutnya.',
                'points' => [
                    'Penguatan fondasi literasi & numerasi',
                    'Proyek Penguatan Profil Pelajar Pancasila'
                ],
                'image' => '/images/hero-bg-sman1-baleendah.jpeg'
            ],
            'fase_f' => [
                'title' => 'Pendalaman Materi & Penjurusan',
                'description' => 'Siswa memilih mata pelajaran pilihan yang relevan dengan rencana studi lanjut atau karir. Pembelajaran lebih mendalam dan terfokus untuk mempersiapkan kompetensi spesifik.',
                'points' => [
                    'Pemilihan mata pelajaran peminatan',
                    'Persiapan intensif menuju Perguruan Tinggi'
                ],
                'image' => '/images/panen-karya-sman1-baleendah.jpg'
            ],
            'grading_system' => [
                'title' => 'Sistem Penilaian',
                'description' => 'Penilaian dilakukan secara komprehensif mencakup aspek pengetahuan, keterampilan, dan sikap. Setiap predikat mencerminkan tingkat penguasaan kompetensi siswa.',
                'scales' => [
                    ['label' => 'Predikat A (Sangat Baik)', 'sub' => 'Penguasaan materi sangat mendalam', 'range' => '90 - 100'],
                    ['label' => 'Predikat B (Baik)', 'sub' => 'Penguasaan materi baik', 'range' => '80 - 89'],
                    ['label' => 'Predikat C (Cukup)', 'sub' => 'Penguasaan materi cukup', 'range' => '75 - 79'],
                    ['label' => 'Predikat D (Kurang)', 'sub' => 'Perlu bimbingan intensif', 'range' => '< 75'],
                ]
            ],
            'learning_goals' => [
                'title' => 'Tujuan Pembelajaran',
                'goals' => [
                    'Mengembangkan kemampuan berpikir kritis dan kreatif',
                    'Membangun karakter berintegritas dan kepemimpinan',
                    'Mempersiapkan siswa untuk pendidikan tinggi dan dunia kerja',
                    'Meningkatkan literasi digital dan penguasaan teknologi'
                ]
            ],
            'metode' => [
                'title' => 'Metode Pembelajaran',
                'items' => [
                    ['title' => 'Collaborative', 'desc' => 'Belajar kelompok & diskusi', 'icon' => 'Users'],
                    ['title' => 'Digital Based', 'desc' => 'Integrasi LMS & IT', 'icon' => 'Monitor'],
                    ['title' => 'Project Based', 'desc' => 'Penyelesaian masalah nyata', 'icon' => 'Target'],
                    ['title' => 'Adaptive', 'desc' => 'Sesuai kecepatan siswa', 'icon' => 'TrendingUp']
                ]
            ]
        ];
    }

    public static function getContent($key, $dbContent = null)
    {
        $defaults = self::getSectionFields();
        $default = $defaults[$key] ?? [];

        // Special case for hero defaults
        if ($key === 'hero' && empty($default)) {
             $default = [
                'title' => 'Kurikulum & Pembelajaran',
                'subtitle' => 'Menerapkan Kurikulum Merdeka untuk menggali potensi unik setiap siswa.',
                'image' => '/images/hero-bg-sman1-baleendah.jpeg'
             ];
        }

        if (!$dbContent) return $default;

        return array_merge($default, $dbContent);
    }
}
