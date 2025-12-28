<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Alumni;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AlumniCrudTest extends TestCase
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

    public function test_can_view_alumni_index_page(): void
    {
        Alumni::factory()->count(3)->create();

        $response = $this->get(route('admin.alumni.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('Admin/Alumni/Index')
            ->has('alumnis', 3)
        );
    }

    public function test_can_view_alumni_create_page(): void
    {
        $response = $this->get(route('admin.alumni.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('Admin/Alumni/Create')
        );
    }

    public function test_can_create_alumni_without_image(): void
    {
        $data = [
            'name' => 'Ahmad Fauzi',
            'graduation_year' => 2020,
            'current_position' => 'Software Engineer',
            'education' => 'S1 Teknik Informatika',
            'testimonial' => 'Sekolah ini memberikan bekal yang baik untuk karir saya.',
            'category' => 'Teknologi',
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 1,
        ];

        $response = $this->post(route('admin.alumni.store'), $data);

        $response->assertRedirect(route('admin.alumni.index'));
        $response->assertSessionHas('success', 'Alumni berhasil ditambahkan.');
        $this->assertDatabaseHas('alumni', [
            'name' => 'Ahmad Fauzi',
            'graduation_year' => 2020,
        ]);
    }

    public function test_can_create_alumni_with_image(): void
    {
        Storage::fake('public');

        $file = \Illuminate\Http\UploadedFile::fake()->image('alumni.jpg');
        $data = [
            'name' => 'Dewi Sartika',
            'graduation_year' => 2019,
            'testimonial' => 'Prestasi terbaik dari sekolah ini.',
            'image' => $file,
            'is_published' => true,
        ];

        $response = $this->post(route('admin.alumni.store'), $data);

        $response->assertRedirect();
        $this->assertDatabaseHas('alumni', ['name' => 'Dewi Sartika']);
        Storage::disk('public')->assertExists('alumni/' . $file->hashName());
    }

    public function test_validation_requires_name_year_and_testimonial(): void
    {
        $data = [
            'name' => '',
            'graduation_year' => '',
            'testimonial' => '',
            'is_published' => true,
        ];

        $response = $this->post(route('admin.alumni.store'), $data);

        $response->assertSessionHasErrors(['name', 'graduation_year', 'testimonial']);
    }

    public function test_graduation_year_minimum_validation(): void
    {
        $data = [
            'name' => 'Test Alumni',
            'graduation_year' => 1899, // below min of 1900
            'testimonial' => 'Testimonial',
            'is_published' => true,
        ];

        $response = $this->post(route('admin.alumni.store'), $data);

        $response->assertSessionHasErrors(['graduation_year']);
    }

    public function test_graduation_year_maximum_validation(): void
    {
        $data = [
            'name' => 'Test Alumni',
            'graduation_year' => date('Y') + 10, // exceeds max of current year + 1
            'testimonial' => 'Testimonial',
            'is_published' => true,
        ];

        $response = $this->post(route('admin.alumni.store'), $data);

        $response->assertSessionHasErrors(['graduation_year']);
    }

    public function test_can_view_alumni_edit_page(): void
    {
        $alumni = Alumni::factory()->create();

        $response = $this->get(route('admin.alumni.edit', $alumni));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('Admin/Alumni/Edit')
            ->has('alumni')
        );
    }

    public function test_can_update_alumni(): void
    {
        $alumni = Alumni::factory()->create([
            'name' => 'Old Name',
            'graduation_year' => 2020,
        ]);

        $data = [
            'name' => 'Updated Name',
            'graduation_year' => 2021,
            'current_position' => 'Senior Manager',
            'education' => 'S2 Manajemen',
            'testimonial' => 'Updated testimonial text',
            'category' => 'Bisnis',
            'is_featured' => true,
            'is_published' => false,
            'sort_order' => 5,
        ];

        $response = $this->put(route('admin.alumni.update', $alumni), $data);

        $response->assertRedirect(route('admin.alumni.index'));
        $response->assertSessionHas('success', 'Alumni berhasil diperbarui.');
        $this->assertDatabaseHas('alumni', [
            'id' => $alumni->id,
            'name' => 'Updated Name',
            'graduation_year' => 2021,
        ]);
    }

    public function test_can_update_alumni_image(): void
    {
        Storage::fake('public');

        $alumni = Alumni::factory()->create(['image_url' => 'alumni/old.jpg']);

        $newFile = \Illuminate\Http\UploadedFile::fake()->image('new-alumni.jpg');

        $data = [
            'name' => 'Alumni Name',
            'graduation_year' => 2020,
            'testimonial' => 'Testimonial',
            'image' => $newFile,
            'is_published' => true,
        ];

        $response = $this->put(route('admin.alumni.update', $alumni), $data);

        $response->assertRedirect();
        Storage::disk('public')->assertMissing('alumni/old.jpg');
        Storage::disk('public')->assertExists('alumni/' . $newFile->hashName());
    }

    public function test_can_delete_alumni(): void
    {
        $alumni = Alumni::factory()->create();

        $response = $this->delete(route('admin.alumni.destroy', $alumni));

        $response->assertRedirect(route('admin.alumni.index'));
        $response->assertSessionHas('success', 'Alumni berhasil dihapus.');
        $this->assertDatabaseMissing('alumni', ['id' => $alumni->id]);
    }

    public function test_deleting_alumni_removes_image(): void
    {
        Storage::fake('public');

        $file = \Illuminate\Http\UploadedFile::fake()->image('alumni.jpg');
        $path = $file->store('alumni', 'public');

        $alumni = Alumni::factory()->create(['image_url' => $path]);

        $this->delete(route('admin.alumni.destroy', $alumni));

        Storage::disk('public')->assertMissing($path);
    }

    public function test_can_create_unpublished_alumni(): void
    {
        $data = [
            'name' => 'Unpublished Alumni',
            'graduation_year' => 2023,
            'testimonial' => 'Testimonial',
            'is_published' => false,
        ];

        $this->post(route('admin.alumni.store'), $data);

        $this->assertDatabaseHas('alumni', [
            'name' => 'Unpublished Alumni',
            'is_published' => false,
        ]);
    }

    public function test_can_create_featured_alumni(): void
    {
        $data = [
            'name' => 'Featured Alumni',
            'graduation_year' => 2022,
            'testimonial' => 'Testimonial',
            'is_featured' => true,
            'is_published' => true,
        ];

        $this->post(route('admin.alumni.store'), $data);

        $this->assertDatabaseHas('alumni', [
            'name' => 'Featured Alumni',
            'is_featured' => true,
        ]);
    }

    public function test_can_set_sort_order(): void
    {
        $data = [
            'name' => 'Ordered Alumni',
            'graduation_year' => 2020,
            'testimonial' => 'Testimonial',
            'sort_order' => 15,
            'is_published' => true,
        ];

        $this->post(route('admin.alumni.store'), $data);

        $this->assertDatabaseHas('alumni', [
            'name' => 'Ordered Alumni',
            'sort_order' => 15,
        ]);
    }

    public function test_name_max_length_validation(): void
    {
        $data = [
            'name' => str_repeat('A', 256), // exceeds max of 255
            'graduation_year' => 2020,
            'testimonial' => 'Testimonial',
            'is_published' => true,
        ];

        $response = $this->post(route('admin.alumni.store'), $data);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_education_max_length_validation(): void
    {
        $data = [
            'name' => 'Alumni Name',
            'graduation_year' => 2020,
            'education' => str_repeat('A', 256), // exceeds max of 255
            'testimonial' => 'Testimonial',
            'is_published' => true,
        ];

        $response = $this->post(route('admin.alumni.store'), $data);

        $response->assertSessionHasErrors(['education']);
    }

    public function test_current_position_max_length_validation(): void
    {
        $data = [
            'name' => 'Alumni Name',
            'graduation_year' => 2020,
            'current_position' => str_repeat('A', 256), // exceeds max of 255
            'testimonial' => 'Testimonial',
            'is_published' => true,
        ];

        $response = $this->post(route('admin.alumni.store'), $data);

        $response->assertSessionHasErrors(['current_position']);
    }
}
