<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolProfileSetting extends Model
{
    protected $fillable = ['section_key', 'content'];

    protected $casts = [
        'content' => 'array',
    ];

    public static function getSectionFields()
    {
        return [
            'hero_history' => [
                'title' => 'Judul Hero (Sejarah)',
                'image_url' => 'Background Hero (Sejarah)',
            ],
            'hero_vision_mission' => [
                'title' => 'Judul Hero (Visi Misi)',
                'image_url' => 'Background Hero (Visi Misi)',
            ],
            'hero_organization' => [
                'title' => 'Judul Hero (Organisasi)',
                'image_url' => 'Background Hero (Organisasi)',
            ],
            'history' => [
                'title' => 'Sejarah Sekolah',
                'description_html' => 'Deskripsi sejarah sekolah (HTML)',
                'image_url' => 'URL Gambar Sejarah',
                'timeline' => 'Timeline (JSON array of {year, title, description})',
            ],
            'vision_mission' => [
                'vision' => 'Visi Sekolah',
                'mission' => 'Misi Sekolah (JSON array of strings)',
                'goals' => 'Tujuan Sekolah (JSON array of strings)',
            ],
            'facilities' => [
                'title' => 'Fasilitas Sekolah',
                'description' => 'Deskripsi singkat fasilitas',
                'items' => 'Daftar Fasilitas (JSON array of {title, description, icon})',
            ],
            'organization' => [
                'title' => 'Struktur Organisasi',
                'image_url' => 'URL Gambar Bagan Struktur',
            ],
        ];
    }

    public static function getContent($key, $dbContent = null)
    {
        $defaults = [
            'hero_history' => [
                'title' => 'Profil & Sejarah',
                'image_url' => '/images/hero-bg-sman1-baleendah.jpeg',
            ],
            'hero_vision_mission' => [
                'title' => 'Visi & Misi',
                'image_url' => '/images/hero-bg-sman1-baleendah.jpeg',
            ],
            'hero_organization' => [
                'title' => 'Struktur Organisasi',
                'image_url' => '/images/hero-bg-sman1-baleendah.jpeg',
            ],
            'history' => [
                'title' => 'Sejarah Singkat',
                'description_html' => '<p>SMAN 1 Baleendah didirikan pada tahun 1975...</p>',
                'image_url' => '/images/hero-bg-sman1-baleendah.jpeg',
                'timeline' => [
                    ['year' => '1975', 'title' => 'Pendirian', 'description' => 'Sekolah resmi didirikan.'],
                ],
            ],
            'vision_mission' => [
                'vision' => 'Terwujudnya Peserta Didik yang Beriman, Cerdas, Terampil, Mandiri, dan Berwawasan Global.',
                'mission' => [
                    'Melaksanakan pembelajaran berbasis teknologi dan inovasi.',
                    'Menanamkan nilai karakter dan budi pekerti luhur.',
                ],
                'goals' => [
                    'Meningkatkan kualitas lulusan.',
                ],
            ],
            'facilities' => [
                'title' => 'Fasilitas Unggulan',
                'description' => 'Kami menyediakan fasilitas terbaik untuk mendukung proses belajar mengajar.',
                'items' => [
                    ['title' => 'Laboratorium Komputer', 'description' => 'Dilengkapi dengan perangkat modern.', 'icon' => 'Monitor'],
                ],
            ],
            'organization' => [
                'title' => 'Struktur Organisasi',
                'image_url' => '/images/struktur-organisasi-sman1-baleendah.jpg',
            ],
        ];

        return $dbContent ?? ($defaults[$key] ?? []);
    }
}
