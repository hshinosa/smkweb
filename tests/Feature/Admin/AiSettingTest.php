<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\AiSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiSettingTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Admin::factory()->create();
    }

    public function test_can_view_ai_settings_page()
    {
        // Seed some settings
        AiSetting::set('ai_model_provider', 'openai');
        AiSetting::set('openai_api_key', 'sk-test-123');

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.ai-settings.index'));

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Admin/AiSettings/Index')
                ->has('settings', 2)
            );
    }

    public function test_can_update_ai_settings()
    {
        AiSetting::set('ai_model_provider', 'openai');

        $data = [
            'settings' => [
                [
                    'key' => 'ai_model_provider',
                    'value' => 'anthropic',
                ],
                [
                    'key' => 'anthropic_api_key',
                    'value' => 'sk-ant-123',
                ]
            ]
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.ai-settings.update'), $data);

        $response->assertRedirect();
        $this->assertEquals('anthropic', AiSetting::get('ai_model_provider'));
        $this->assertEquals('sk-ant-123', AiSetting::get('anthropic_api_key'));
    }

    public function test_validates_ai_settings_update()
    {
        $data = [
            'settings' => 'not-an-array'
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->post(route('admin.ai-settings.update'), $data);

        $response->assertSessionHasErrors('settings');
    }
}