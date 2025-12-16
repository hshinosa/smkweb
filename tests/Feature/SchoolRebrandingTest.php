<?php

namespace Tests\Feature;

use App\Models\LandingPageSetting;
use App\Models\SpmbSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class SchoolRebrandingTest extends TestCase
{
    use RefreshDatabase;

    public function test_default_hero_content_shows_new_school_name(): void
    {
        $defaults = LandingPageSetting::getDefaults('hero');

        $this->assertEquals('SMA Negeri 1 Baleendah', $defaults['title_line2']);
        $this->assertStringContainsString('sman1baleendah', $defaults['background_image_url']);
    }

    public function test_default_about_content_shows_new_school_name(): void
    {
        $defaults = LandingPageSetting::getDefaults('about_lp');

        $this->assertEquals('Tentang SMAN 1 Baleendah', $defaults['title']);
        $this->assertStringContainsString('SMA Negeri 1 Baleendah', $defaults['description_html']);
        $this->assertStringContainsString('sman1baleendah', $defaults['image_url']);
    }

    public function test_default_kepsek_content_shows_new_school_name(): void
    {
        $defaults = LandingPageSetting::getDefaults('kepsek_welcome_lp');

        $this->assertEquals('Kepala SMA Negeri 1 Baleendah', $defaults['kepsek_title']);
        $this->assertStringContainsString('SMA Negeri 1 Baleendah', $defaults['welcome_text_html']);
    }

    public function test_home_page_loads_successfully(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_blade_template_shows_new_school_name(): void
    {
        $response = $this->get('/');

        $response->assertSee('SMAN 1 Baleendah', false);
    }

    // === COMPREHENSIVE VERIFICATION TESTS ===

    public function test_all_model_defaults_contain_correct_school_references(): void
    {
        // Test LandingPageSetting defaults
        $heroDefaults = LandingPageSetting::getDefaults('hero');
        $aboutDefaults = LandingPageSetting::getDefaults('about_lp');
        $kepsekDefaults = LandingPageSetting::getDefaults('kepsek_welcome_lp');

        // Verify no old school references exist
        $this->assertStringNotContainsString('SMKN 15', json_encode($heroDefaults));
        $this->assertStringNotContainsString('SMK Negeri 15', json_encode($aboutDefaults));
        $this->assertStringNotContainsString('SMKN 15', json_encode($kepsekDefaults));

        // Verify new school references exist (use correct format)
        $this->assertStringContainsString('SMA Negeri 1 Baleendah', json_encode($heroDefaults));
        $this->assertStringContainsString('SMA Negeri 1 Baleendah', json_encode($aboutDefaults));
        $this->assertStringContainsString('SMA Negeri 1 Baleendah', json_encode($kepsekDefaults));
    }

    public function test_spmb_settings_contain_correct_school_references(): void
    {
        $spmbDefaults = SpmbSetting::getDefaults('pengaturan_umum');
        $faqDefaults = SpmbSetting::getDefaults('faq');

        // Verify no old school references
        $this->assertStringNotContainsString('SMKN 15', json_encode($spmbDefaults));
        $this->assertStringNotContainsString('SMK Negeri 15', json_encode($faqDefaults));

        // Verify new school references
        $this->assertStringContainsString('SMA Negeri 1 Baleendah', json_encode($spmbDefaults));
        $this->assertStringContainsString('SMA Negeri 1 Baleendah', json_encode($faqDefaults));
    }

    public function test_sma_programs_are_correctly_referenced(): void
    {
        $faqDefaults = SpmbSetting::getDefaults('faq');
        $faqContent = json_encode($faqDefaults);

        // Verify SMA programs are mentioned
        $this->assertStringContainsString('MIPA', $faqContent);
        $this->assertStringContainsString('IPS', $faqContent);
        $this->assertStringContainsString('Bahasa', $faqContent);

        // Verify no SMK program references
        $this->assertStringNotContainsString('DKV', $faqContent);
        $this->assertStringNotContainsString('Kuliner', $faqContent);
        $this->assertStringNotContainsString('Perhotelan', $faqContent);
    }

    public function test_contact_information_is_updated(): void
    {
        $prosedurDefaults = SpmbSetting::getDefaults('prosedur');
        $contactInfo = $prosedurDefaults['contact_info'];

        // Verify Baleendah contact information
        $this->assertStringContainsString('sman1baleendah.sch.id', $contactInfo);
        $this->assertStringContainsString('Baleendah', $contactInfo);
        $this->assertStringContainsString('Kabupaten Bandung', $contactInfo);

        // Verify no old contact information
        $this->assertStringNotContainsString('smkn15bandung', $contactInfo);
    }

    public function test_required_asset_files_exist(): void
    {
        $requiredAssets = [
            'images/logo-sman1-baleendah.png',
            'images/logo-sman1baleendah.png',
            'images/logo-sman1baleendah-32x32.png',
            'images/hero-bg-sman1-baleendah.jpg',
            'images/hero-bg-sman1baleendah.jpg',
            'images/keluarga-besar-sman1-baleendah.png',
            'images/keluarga-besar-sman1baleendah.png',
            'images/struktur-organisasi-sman1-baleendah.jpg',
        ];

        foreach ($requiredAssets as $asset) {
            $this->assertTrue(
                File::exists(public_path($asset)),
                "Required asset file does not exist: {$asset}"
            );
        }
    }

    public function test_all_pages_load_successfully(): void
    {
        $pages = [
            '/',
            '/profil-sekolah',
            '/visi-misi',
            '/struktur-organisasi',
            '/kalender-akademik',
            '/informasi-spmb',
        ];

        foreach ($pages as $page) {
            $response = $this->get($page);
            $response->assertStatus(200, "Page {$page} failed to load");
        }
    }

    public function test_no_old_school_references_in_frontend_content(): void
    {
        // Test main pages for old school references
        $response = $this->get('/');
        $content = $response->getContent();

        // Should not contain old school references
        $this->assertStringNotContainsString('SMKN 15', $content);
        $this->assertStringNotContainsString('SMK Negeri 15', $content);
        $this->assertStringNotContainsString('smkn15bandung', $content);

        // Should contain new school references
        $this->assertStringContainsString('SMAN 1 Baleendah', $content);
    }

    public function test_social_media_links_are_updated(): void
    {
        $response = $this->get('/');
        $content = $response->getContent();

        // Check for updated social media handles (these are in the React component data)
        $this->assertStringContainsString('sman1baleendah', $content);

        // Should not contain old social media references
        $this->assertStringNotContainsString('smkn15bandung', $content);
    }

    public function test_geographic_information_is_updated(): void
    {
        $response = $this->get('/');
        $content = $response->getContent();

        // Should reference Baleendah location (in the page title and content)
        $this->assertStringContainsString('Baleendah', $content);

        // Test that geographic info is in the models
        $prosedurDefaults = SpmbSetting::getDefaults('prosedur');
        $this->assertStringContainsString('Kabupaten Bandung', $prosedurDefaults['contact_info']);
    }

    public function test_admin_interface_branding(): void
    {
        // Test admin login page
        $response = $this->get('/admin/login');
        $response->assertStatus(200);

        // The admin interface should load without errors
        // Additional admin-specific tests would require authentication
    }

    public function test_comprehensive_rebranding_verification(): void
    {
        // This test serves as a comprehensive verification summary

        // 1. Verify all key pages load successfully
        $pages = ['/', '/profil-sekolah', '/visi-misi', '/struktur-organisasi', '/kalender-akademik', '/informasi-spmb'];
        foreach ($pages as $page) {
            $response = $this->get($page);
            $this->assertEquals(200, $response->status(), "Page {$page} should load successfully");
        }

        // 2. Verify model defaults contain correct school information
        $heroDefaults = LandingPageSetting::getDefaults('hero');
        $this->assertEquals('SMA Negeri 1 Baleendah', $heroDefaults['title_line2']);

        // 3. Verify SPMB content has correct school references
        $spmbDefaults = SpmbSetting::getDefaults('pengaturan_umum');
        $this->assertStringContainsString('SMA Negeri 1 Baleendah', $spmbDefaults['title']);

        // 4. Verify SMA programs are referenced correctly
        $faqDefaults = SpmbSetting::getDefaults('faq');
        $faqContent = json_encode($faqDefaults);
        $this->assertStringContainsString('MIPA', $faqContent);
        $this->assertStringContainsString('IPS', $faqContent);
        $this->assertStringContainsString('Bahasa', $faqContent);

        // 5. Verify contact information is updated
        $prosedurDefaults = SpmbSetting::getDefaults('prosedur');
        $this->assertStringContainsString('sman1baleendah.sch.id', $prosedurDefaults['contact_info']);
        $this->assertStringContainsString('Baleendah', $prosedurDefaults['contact_info']);

        // 6. Verify required assets exist
        $requiredAssets = [
            'images/logo-sman1-baleendah.png',
            'images/hero-bg-sman1-baleendah.jpg',
            'images/keluarga-besar-sman1-baleendah.png',
        ];
        foreach ($requiredAssets as $asset) {
            $this->assertTrue(File::exists(public_path($asset)), "Asset {$asset} should exist");
        }

        // 7. Verify no old school references remain
        $allDefaults = [
            LandingPageSetting::getDefaults('hero'),
            LandingPageSetting::getDefaults('about_lp'),
            LandingPageSetting::getDefaults('kepsek_welcome_lp'),
            SpmbSetting::getDefaults('pengaturan_umum'),
            SpmbSetting::getDefaults('faq'),
        ];

        foreach ($allDefaults as $defaults) {
            $content = json_encode($defaults);
            $this->assertStringNotContainsString('SMKN 15', $content, 'No old school references should remain');
            $this->assertStringNotContainsString('SMK Negeri 15', $content, 'No old school references should remain');
        }

        $this->assertTrue(true, 'Comprehensive rebranding verification completed successfully');
    }
}
