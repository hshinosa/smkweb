<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingPageSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_key',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    // Definisikan field yang valid untuk setiap section di sini juga
    public static function getSectionFields(): array
    {
        return [
            'hero' => ['title_line1', 'title_line2', 'background_image_url'],
            'about_lp' => ['title', 'description_html', 'image_url'],
            'kepsek_welcome_lp' => ['title', 'kepsek_name', 'kepsek_title', 'kepsek_image_url', 'welcome_text_html'],
            'fakta_lp' => ['items'], // 'items' akan menjadi array of objects
            'kalender_akademik' => ['title', 'description', 'calendar_image_url'],
            // Tambahkan section lain jika ada
        ];
    }

    public static function getDefaults(string $sectionKey): array
    {
        $defaults = [
            'hero' => [
                'title_line1' => 'Selamat Datang di',
                'title_line2' => 'SMA Negeri 1 Baleendah',
                'background_image_url' => '/images/hero-bg-sman1baleendah.jpeg',
            ],
            'about_lp' => [
                'title' => 'Tentang SMAN 1 Baleendah',
                'description_html' => '<p>SMA Negeri 1 Baleendah adalah salah satu sekolah menengah atas negeri unggulan di Kabupaten Bandung yang memiliki reputasi baik dalam pendidikan akademik.</p><p>Kami menawarkan tiga program studi unggulan: MIPA (Matematika dan Ilmu Pengetahuan Alam), IPS (Ilmu Pengetahuan Sosial), dan Bahasa (Ilmu Bahasa dan Budaya) yang didukung oleh pengajar kompeten dan fasilitas memadai untuk mencetak lulusan berprestasi dan berkarakter.</p>',
                'image_url' => '/images/keluarga-besar-sman1baleendah.png',
            ],
            'kepsek_welcome_lp' => [
                'title' => 'Sambutan Kepala Sekolah',
                'kepsek_name' => 'Drs. Ahmad Suryadi, M.Pd.',
                'kepsek_title' => 'Kepala SMA Negeri 1 Baleendah',
                'kepsek_image_url' => '/images/kepala-sekolah.jpg', // Pastikan path benar
                'welcome_text_html' => '<p><strong>Sampurasun!</strong></p><p>Puji syukur senantiasa kita panjatkan kehadirat Allah SWT, Tuhan Yang Maha Esa, atas limpahan rahmat dan karunia-Nya. Saya menyambut Anda di situs resmi SMA Negeri 1 Baleendah, jendela informasi utama sekolah kami.</p><p>Kami berkomitmen untuk mengembangkan potensi peserta didik secara optimal melalui program MIPA, IPS, dan Bahasa serta membentuk karakter mulia. Mari bersama membangun masa depan yang gemilang.</p><p>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p>',
            ],
            'fakta_lp' => [
                'items' => [
                    ['label' => 'Guru', 'value' => 45],
                    ['label' => 'Staff', 'value' => 12],
                    ['label' => 'Siswa', 'value' => 900],
                    ['label' => 'Alumni', 'value' => 15000],
                    ['label' => 'Fasilitas', 'value' => 15],
                ],
            ],
            'kalender_akademik' => [
                'title' => 'Kalender Akademik SMA Negeri 1 Baleendah',
                'description' => 'Kalender akademik resmi yang ditetapkan oleh pemerintah untuk tahun ajaran ini.',
            ],
            // Tambahkan default untuk section lain
        ];

        return $defaults[$sectionKey] ?? [];
    }

    /**
     * Helper untuk mengambil konten section, menggabungkan dengan default
     * jika data dari DB tidak lengkap atau tidak ada.
     */
    public static function getContent(string $sectionKey, ?array $dbContent): array
    {
        $defaults = self::getDefaults($sectionKey);
        if ($dbContent === null) {
            return $defaults;
        }

        // Gabungkan default dengan data dari DB, data DB akan menimpa default jika ada
        // Ini memastikan semua field default ada di hasil akhir.
        return array_merge($defaults, $dbContent);
    }
}
