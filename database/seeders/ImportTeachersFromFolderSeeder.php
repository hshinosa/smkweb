<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Teacher;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ImportTeachersFromFolderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $basePath = base_path('foto-guru');

        if (!File::exists($basePath)) {
            $this->command->error("Folder 'foto-guru' tidak ditemukan di root project!");
            return;
        }

        $this->command->info("Memulai impor foto guru dari: " . $basePath);

        // Bersihkan data lama
        Teacher::query()->delete(); 

        $directories = File::directories($basePath);
        $totalImported = 0;
        $sortOrder = 0;

        foreach ($directories as $dirPath) {
            $folderName = basename($dirPath);
            $mapping = $this->getFolderMapping($folderName);
            
            $this->command->line("Memproses folder: <info>{$folderName}</info>");

            $files = File::files($dirPath);
            foreach ($files as $file) {
                // Skip non-images
                if (!in_array(strtolower($file->getExtension()), ['jpg', 'jpeg', 'png', 'webp'])) {
                    continue;
                }

                $filename = $file->getFilenameWithoutExtension();
                
                // Bersihkan nama dari whitespace berlebih atau noise
                $name = trim($filename);
                
                // Tentukan position (jika ada info di nama file)
                $position = $mapping['default_position'];
                
                // Khusus untuk folder Manajemen, coba tebak jabatan
                if ($mapping['department'] === 'Manajemen') {
                    if (Str::contains(strtoupper($name), 'KEPALA SEKOLAH')) {
                        $position = 'Kepala Sekolah';
                    } elseif (Str::contains(strtoupper($name), 'WAKASEK') || Str::contains(strtoupper($name), 'WAKIL KEPALA')) {
                        $position = 'Wakil Kepala Sekolah';
                    }
                }

                if (Str::contains($name, '(') && Str::contains($name, ')')) {
                    // Contoh: "Nama (Guru PKn)"
                    preg_match('/\((.*?)\)/', $name, $matches);
                    if (isset($matches[1])) {
                        $position = $matches[1];
                        $name = trim(preg_replace('/\s*\(.*?\)\s*/', '', $name));
                    }
                }

                // Create or Update Teacher
                $teacher = Teacher::updateOrCreate(
                    ['name' => $name],
                    [
                        'type' => $mapping['type'],
                        'department' => $mapping['department'],
                        'position' => $position,
                        'is_active' => true,
                        'sort_order' => $sortOrder++,
                        // NIP dummy
                        'nip' => '19' . rand(70, 99) . rand(10, 12) . rand(10, 28) . '200' . rand(1, 9) . rand(100, 999),
                    ]
                );

                // Attach Image via Spatie Media Library
                try {
                    // Kosongkan koleksi sebelumnya agar tidak menumpuk jika re-seed
                    $teacher->clearMediaCollection('photos');
                    
                    $teacher->addMedia($file->getPathname())
                        ->preservingOriginal()
                        ->toMediaCollection('photos');
                    
                    $totalImported++;
                } catch (\Exception $e) {
                    $this->command->error("Gagal mengimpor foto untuk {$name}: " . $e->getMessage());
                }
            }
        }

        $this->command->info("Selesai! Berhasil mengimpor {$totalImported} guru/staff.");
    }

    /**
     * Map folder names to database categories
     */
    private function getFolderMapping(string $folderName): array
    {
        $name = strtoupper(trim($folderName));

        // 1. Pimpinan & Manajemen
        if (Str::contains($name, 'WAKASEK')) {
            return [
                'type' => 'guru',
                'department' => 'Wakasek',
                'default_position' => 'Wakil Kepala Sekolah'
            ];
        }
        if (Str::contains($name, 'MANAJEMEN')) {
            return [
                'type' => 'guru',
                'department' => 'Manajemen',
                'default_position' => 'Manajemen Sekolah'
            ];
        }

        // 2. Staff & Support
        if (Str::contains($name, 'STAFF TU')) {
            return [
                'type' => 'staff',
                'department' => 'Staff TU',
                'default_position' => 'Staff Tata Usaha'
            ];
        }
        if (Str::contains($name, 'PERPUSTAKAAN')) {
            return [
                'type' => 'staff',
                'department' => 'Perpustakaan',
                'default_position' => 'Pustakawan'
            ];
        }

        // 3. Counseling
        if (Str::contains($name, 'BK') || Str::contains($name, 'KONSELING')) {
            return [
                'type' => 'guru',
                'department' => 'Bimbingan Konseling',
                'default_position' => 'Guru Bimbingan Konseling'
            ];
        }

        // 4. MGMP Subjects (Handling Abbreviations)
        $cleanDept = trim(str_ireplace('MGMP ', '', $folderName));
        
        $prettyNames = [
            'B. JEPANG' => 'Bahasa Jepang',
            'B.SUNDA' => 'Bahasa Sunda',
            'BHS INDONESIA' => 'Bahasa Indonesia',
            'BHS INGGRIS' => 'Bahasa Inggris',
            'PAI' => 'Pendidikan Agama Islam',
            'PEND PANCASILA' => 'Pendidikan Pancasila',
            'SENBUD' => 'Seni Budaya',
            // Add more if needed
        ];

        $deptKey = strtoupper($cleanDept);
        if (isset($prettyNames[$deptKey])) {
            $displayName = $prettyNames[$deptKey];
        } else {
            $displayName = ucwords(strtolower($cleanDept));
        }
        
        return [
            'type' => 'guru',
            'department' => $displayName, 
            'default_position' => 'Guru ' . $displayName
        ];
    }
}
