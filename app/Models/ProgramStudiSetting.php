<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramStudiSetting extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'program_name',
        'section_key',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public static function getSectionFields()
    {
        return [
            'hero' => [
                'title' => 'text',
                'description' => 'textarea',
                'background_image' => 'image',
            ],
            'core_subjects' => [
                'title' => 'text',
                'description' => 'textarea',
                'items' => 'list', // List of subjects
            ],
            'facilities' => [
                'title' => 'text',
                'description' => 'textarea',
                'main_image' => 'image',
                'main_title' => 'text',
                'main_description' => 'textarea',
                'items' => 'list', // List of other facilities
            ],
            'career_paths' => [
                'title' => 'text',
                'description' => 'textarea',
                'items' => 'list',
            ],
            'alumni_spotlight' => [
                'image' => 'image',
                'quote' => 'textarea',
                'name' => 'text',
                'description' => 'text',
            ],
        ];
    }

    public static function getDefaults($sectionKey)
    {
        $defaults = [
            'hero' => [
                'title' => 'Program Studi',
                'description' => 'Deskripsi singkat program studi.',
                'background_image' => null,
            ],
            'core_subjects' => [
                'title' => 'Mata Pelajaran Unggulan',
                'description' => 'Kurikulum yang dirancang untuk masa depan.',
                'items' => [],
            ],
            'facilities' => [
                'title' => 'Fasilitas Riset & Praktikum',
                'description' => 'Fasilitas modern untuk mendukung pembelajaran.',
                'main_image' => null,
                'main_title' => 'Laboratorium Utama',
                'main_description' => 'Deskripsi laboratorium utama.',
                'items' => [],
            ],
            'career_paths' => [
                'title' => 'Prospek Karir',
                'description' => 'Peluang karir setelah lulus.',
                'items' => [],
            ],
            'alumni_spotlight' => [
                'image' => null,
                'quote' => 'Testimoni alumni.',
                'name' => 'Nama Alumni',
                'description' => 'Pekerjaan / Universitas',
            ],
        ];

        return $defaults[$sectionKey] ?? [];
    }

    public static function getContent($sectionKey, $dbContent = null)
    {
        $defaults = self::getDefaults($sectionKey);
        if (!$dbContent) {
            return $defaults;
        }
        return array_merge($defaults, $dbContent);
    }
}
