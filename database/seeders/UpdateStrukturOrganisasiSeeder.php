<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolProfileSetting;
use Illuminate\Support\Facades\File;

class UpdateStrukturOrganisasiSeeder extends Seeder
{
    public function run()
    {
        // 1. HERO STRUKTUR ORGANISASI
        $hero = SchoolProfileSetting::updateOrCreate(
            ['section_key' => 'hero_organization'],
            ['content' => json_encode([
                'title' => 'Struktur Organisasi SMAN 1 Baleendah',
                'image_url' => '/images/hero-bg-sman1baleendah.jpeg'
            ])]
        );
        
        // Migrate Hero Image
        $heroPath = public_path('images/hero-bg-sman1baleendah.jpeg');
        if (File::exists($heroPath)) {
            $hero->clearMediaCollection('hero_organization_bg');
            $hero->addMedia($heroPath)
                ->preservingOriginal()
                ->toMediaCollection('hero_organization_bg');
        }

        // 2. ORGANIZATION CHART CONTENT
        $org = SchoolProfileSetting::updateOrCreate(
            ['section_key' => 'organization'],
            ['content' => json_encode([
                'title' => 'Bagan Struktur Organisasi',
                'description' => 'Struktur organisasi SMA Negeri 1 Baleendah Tahun Pelajaran 2025/2026',
                'image_url' => '/images/struktur-organisasi-sman1-baleendah.jpg'
            ])]
        );

        // Migrate Chart Image
        $chartPath = public_path('images/struktur-organisasi-sman1-baleendah.jpg');
        if (File::exists($chartPath)) {
            $org->clearMediaCollection('organization_chart');
            $org->addMedia($chartPath)
                ->preservingOriginal()
                ->toMediaCollection('organization_chart');
        }
    }
}
