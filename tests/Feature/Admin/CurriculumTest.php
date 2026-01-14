<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\CurriculumSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CurriculumTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->admin = Admin::factory()->create();
        $this->actingAs($this->admin, 'admin');
    }

    public function test_can_view_curriculum_page()
    {
        $response = $this->get(route('admin.curriculum.index'));
        $response->assertStatus(200);
    }

    public function test_can_update_intro_and_fases()
    {
        $faseEImage = \Illuminate\Http\UploadedFile::fake()->image('fase_e.jpg');
        $faseFImage = \Illuminate\Http\UploadedFile::fake()->image('fase_f.jpg');

        $data = [
            'section' => 'intro_fases',
            'intro_title' => 'Intro Title',
            'intro_description' => 'Intro Desc',
            'fase_e_title' => 'Fase E Title',
            'fase_e_description' => 'Desc E',
            'fase_e_points' => ['Point 1'],
            'fase_e_image' => $faseEImage,
            'fase_f_title' => 'Fase F Title',
            'fase_f_description' => 'Desc F',
            'fase_f_points' => ['Point 2'],
            'fase_f_image' => $faseFImage,
        ];

        $response = $this->post(route('admin.curriculum.update'), $data);

        $response->assertRedirect();
        
        $faseESetting = CurriculumSetting::where('section_key', 'fase_e')->first();
        $this->assertTrue($faseESetting->hasMedia('fase_e_image'));
        
        $faseFSetting = CurriculumSetting::where('section_key', 'fase_f')->first();
        $this->assertTrue($faseFSetting->hasMedia('fase_f_image'));
    }

    public function test_can_update_hero()
    {
        $heroImage = \Illuminate\Http\UploadedFile::fake()->image('hero.jpg');

        $data = [
            'section' => 'hero',
            'content' => [
                'title' => 'Hero Title',
                'subtitle' => 'Hero Sub',
                'image' => $heroImage,
            ]
        ];

        $response = $this->post(route('admin.curriculum.update'), $data);

        $response->assertRedirect();
        
        $setting = CurriculumSetting::where('section_key', 'hero')->first();
        $this->assertTrue($setting->hasMedia('hero_bg'));
    }
}
