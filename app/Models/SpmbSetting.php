<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpmbSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_key',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];    // Define valid fields for each SPMB section
    public static function getSectionFields(): array
    {
        return [
            'pengaturan_umum' => ['title', 'description_html', 'is_registration_open', 'registration_year', 'announcement_text'],
            'jalur_pendaftaran' => ['regular', 'prestasi'], // Each path has description, quota, requirements
            'jadwal_penting' => ['events'], // events will be array of objects with title, date, description
            'persyaratan' => ['documents', 'additional_notes'], // documents array and additional notes
            'prosedur' => ['steps', 'contact_info'], // steps array and contact info
            'faq' => ['items'], // items will be array of objects with question and answer
        ];
    }    public static function getDefaults(string $sectionKey): array
    {
        $defaults = [
            'pengaturan_umum' => [
                'title' => 'Informasi SPMB SMK Negeri 15 Bandung',
                'description_html' => '<p>Selamat datang di halaman informasi Seleksi Penerimaan Murid Baru (SPMB) SMK Negeri 15 Bandung. Temukan semua informasi penting mengenai pendaftaran siswa baru di sini.</p>',
                'is_registration_open' => false,
                'registration_year' => '2025/2026',
                'announcement_text' => 'Pendaftaran SPMB akan segera dibuka. Pantau terus website ini untuk informasi terbaru.',
            ],
            'jalur_pendaftaran' => [
                'regular' => [
                    'description' => 'Jalur pendaftaran umum berdasarkan zonasi dan nilai rapor',
                    'quota' => 150,
                    'requirements' => [
                        'Lulusan SMP/MTs/sederajat',
                        'Berdomisili sesuai zonasi yang ditetapkan',
                        'Memiliki nilai rapor yang memadai'
                    ]
                ],
                'prestasi' => [
                    'description' => 'Jalur pendaftaran berdasarkan prestasi akademik dan non-akademik',
                    'quota' => 50,
                    'requirements' => [
                        'Lulusan SMP/MTs/sederajat',
                        'Memiliki prestasi akademik atau non-akademik',
                        'Sertifikat prestasi yang masih berlaku'
                    ]
                ]
            ],
            'jadwal_penting' => [
                'events' => [
                    [
                        'title' => 'Sosialisasi SPMB',
                        'date' => '2025-02-15',
                        'description' => 'Sosialisasi informasi SPMB ke sekolah-sekolah SMP'
                    ],
                    [
                        'title' => 'Pendaftaran Tahap 1',
                        'date' => '2025-03-01',
                        'description' => 'Jalur Afirmasi, Perpindahan Tugas, dan Prestasi'
                    ],
                    [
                        'title' => 'Pengumuman Tahap 1',
                        'date' => '2025-04-01',
                        'description' => 'Pengumuman hasil seleksi tahap pertama'
                    ]
                ]
            ],
            'persyaratan' => [
                'documents' => [
                    [
                        'name' => 'Ijazah SMP/sederajat',
                        'description' => 'Fotokopi ijazah yang telah dilegalisir',
                        'required' => true
                    ],
                    [
                        'name' => 'Kartu Keluarga',
                        'description' => 'Fotokopi Kartu Keluarga yang masih berlaku',
                        'required' => true
                    ],
                    [
                        'name' => 'Akta Kelahiran',
                        'description' => 'Fotokopi akta kelahiran',
                        'required' => true
                    ]
                ],
                'additional_notes' => '<p>Semua dokumen harus dalam keadaan jelas dan dapat dibaca. Dokumen palsu akan berakibat pada pembatalan pendaftaran.</p>'
            ],
            'prosedur' => [
                'steps' => [
                    [
                        'title' => 'Daftar Online',
                        'description' => '<p>Akses portal SPMB dan buat akun menggunakan NISN</p>'
                    ],
                    [
                        'title' => 'Isi Biodata',
                        'description' => '<p>Lengkapi semua data pribadi dan orang tua dengan benar</p>'
                    ],
                    [
                        'title' => 'Upload Dokumen',
                        'description' => '<p>Unggah semua dokumen persyaratan sesuai format yang ditentukan</p>'
                    ]
                ],
                'contact_info' => '<p>Untuk informasi lebih lanjut, hubungi: <br>Telp: (022) 1234567<br>Email: info@smkn15bandung.sch.id</p>'
            ],
            'faq' => [
                'items' => [
                    [
                        'question' => 'Kapan pendaftaran SPMB dibuka?',
                        'answer' => '<p>Pendaftaran SPMB biasanya dibuka pada bulan Maret-Juni. Tanggal pasti akan diumumkan melalui website resmi.</p>'
                    ],
                    [
                        'question' => 'Apa saja program keahlian yang tersedia?',
                        'answer' => '<p>SMKN 15 Bandung memiliki 4 program keahlian: Desain Komunikasi Visual (DKV), Kuliner, Perhotelan, dan Pekerjaan Sosial.</p>'
                    ],
                    [
                        'question' => 'Bisakah memilih lebih dari satu program keahlian?',
                        'answer' => '<p>Ya, pada saat pendaftaran calon siswa dapat memilih maksimal 2 program keahlian sesuai minat dan bakat.</p>'
                    ]
                ]
            ]
        ];

        return $defaults[$sectionKey] ?? [];
    }

    public static function getContent(string $sectionKey, ?array $dbContent = null): array
    {
        $defaults = self::getDefaults($sectionKey);
        return $dbContent ? array_merge($defaults, $dbContent) : $defaults;
    }
}
