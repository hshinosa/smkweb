<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NavbarRestructureTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_loads_successfully(): void
    {
        $response = $this->get('/');
        
        $response->assertStatus(200);
    }

    public function test_kurikulum_page_loads_successfully(): void
    {
        $response = $this->get('/akademik/kurikulum');
        
        $response->assertStatus(200);
    }

    public function test_ekstrakurikuler_page_loads_successfully(): void
    {
        $response = $this->get('/akademik/ekstrakurikuler');
        
        $response->assertStatus(200);
    }

    public function test_program_mipa_page_loads_successfully(): void
    {
        $response = $this->get('/akademik/program-studi/mipa');
        
        $response->assertStatus(200);
    }

    public function test_program_ips_page_loads_successfully(): void
    {
        $response = $this->get('/akademik/program-studi/ips');
        
        $response->assertStatus(200);
    }

    public function test_program_bahasa_page_loads_successfully(): void
    {
        $response = $this->get('/akademik/program-studi/bahasa');
        
        $response->assertStatus(200);
    }

    public function test_all_existing_pages_still_work(): void
    {
        $existingPages = [
            '/profil-sekolah',
            '/visi-misi',
            '/struktur-organisasi',
            '/program',
            '/kalender-akademik',
            '/informasi-spmb',
        ];

        foreach ($existingPages as $page) {
            $response = $this->get($page);
            $response->assertStatus(200, "Page {$page} should load successfully");
        }
    }

    public function test_all_new_academic_pages_work(): void
    {
        $newPages = [
            '/akademik/kurikulum',
            '/akademik/ekstrakurikuler',
            '/akademik/program-studi/mipa',
            '/akademik/program-studi/ips',
            '/akademik/program-studi/bahasa',
        ];

        foreach ($newPages as $page) {
            $response = $this->get($page);
            $response->assertStatus(200, "New page {$page} should load successfully");
        }
    }

    public function test_berita_pengumuman_page_loads_successfully(): void
    {
        $response = $this->get('/berita-pengumuman');
        
        $response->assertStatus(200);
    }

    public function test_kontak_page_loads_successfully(): void
    {
        $response = $this->get('/kontak');
        
        $response->assertStatus(200);
    }

    public function test_routes_are_properly_defined(): void
    {
        // Test that all new routes exist and return 200
        $routes = [
            'akademik.kurikulum' => '/akademik/kurikulum',
            'akademik.ekstrakurikuler' => '/akademik/ekstrakurikuler',
            'akademik.program.mipa' => '/akademik/program-studi/mipa',
            'akademik.program.ips' => '/akademik/program-studi/ips',
            'akademik.program.bahasa' => '/akademik/program-studi/bahasa',
        ];

        foreach ($routes as $routeName => $url) {
            $response = $this->get($url);
            $response->assertStatus(200, "Route {$routeName} should be accessible");
        }
    }

    public function test_inertia_components_are_loaded(): void
    {
        $pages = [
            '/' => 'LandingPage',
            '/akademik/kurikulum' => 'KurikulumPage',
            '/akademik/ekstrakurikuler' => 'EkstrakurikulerPage',
            '/akademik/program-studi/mipa' => 'ProgramMipaPage',
            '/akademik/program-studi/ips' => 'ProgramIpsPage',
            '/akademik/program-studi/bahasa' => 'ProgramBahasaPage',
            '/berita-pengumuman' => 'BeritaPengumumanPage',
            '/kontak' => 'KontakPage',
        ];

        foreach ($pages as $url => $component) {
            $response = $this->get($url);
            $response->assertStatus(200);
            
            // Check that the correct Inertia component is loaded
            $content = $response->getContent();
            $this->assertStringContainsString($component, $content, "Page {$url} should load {$component} component");
        }
    }

    public function test_navbar_restructure_integration(): void
    {
        // Test that pages load without errors after navbar restructure
        $allPages = [
            '/',
            '/profil-sekolah',
            '/visi-misi',
            '/struktur-organisasi',
            '/program',
            '/kalender-akademik',
            '/informasi-spmb',
            '/akademik/kurikulum',
            '/akademik/ekstrakurikuler',
            '/akademik/program-studi/mipa',
            '/akademik/program-studi/ips',
            '/akademik/program-studi/bahasa',
            '/berita-pengumuman',
            '/kontak',
        ];

        foreach ($allPages as $page) {
            $response = $this->get($page);
            $response->assertStatus(200, "Page {$page} should load successfully after navbar restructure");
        }
    }
}