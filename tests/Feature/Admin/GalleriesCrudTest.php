<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Gallery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GalleriesCrudTest extends TestCase
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

    public function test_can_view_galleries_index_page(): void
    {
        Gallery::factory()->count(3)->create();

        $response = $this->get(route('admin.galleries.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('Admin/Galleries/Index')
            ->has('galleries', 3)
        );
    }

    public function test_can_create_photo_gallery_with_file(): void
    {
        Storage::fake('public');

        $file = \Illuminate\Http\UploadedFile::fake()->image('gallery-photo.jpg');
        $data = [
            'title' => 'Wisuda 2024',
            'description' => 'Dokumentasi wisuda angkatan 2024',
            'type' => 'photo',
            'file' => $file,
            'category' => 'Kegiatan Sekolah',
            'date' => now()->toDateString(),
            'is_featured' => true,
        ];

        $response = $this->post(route('admin.galleries.store'), $data);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Galeri berhasil ditambahkan');
        $this->assertDatabaseHas('galleries', [
            'title' => 'Wisuda 2024',
            'type' => 'photo',
        ]);
        Storage::disk('public')->assertExists('galleries/' . $file->hashName());
    }

    public function test_can_create_video_gallery_with_file(): void
    {
        Storage::fake('public');

        $file = \Illuminate\Http\UploadedFile::fake()->create('video.mp4', 5000, 'video/mp4');
        $data = [
            'title' => 'Video Promosi Sekolah',
            'description' => 'Video promosi untuk PPDB',
            'type' => 'video',
            'file' => $file,
            'is_featured' => false,
        ];

        $response = $this->post(route('admin.galleries.store'), $data);

        $response->assertRedirect();
        $this->assertDatabaseHas('galleries', [
            'title' => 'Video Promosi Sekolah',
            'type' => 'video',
        ]);
    }

    public function test_can_create_external_video_gallery(): void
    {
        $data = [
            'title' => 'YouTube Link',
            'description' => 'Video dari YouTube',
            'type' => 'video',
            'url' => 'https://youtube.com/watch?v=example',
            'is_external' => true,
        ];

        $response = $this->post(route('admin.galleries.store'), $data);

        $response->assertRedirect();
        $this->assertDatabaseHas('galleries', [
            'title' => 'YouTube Link',
            'type' => 'video',
            'is_external' => true,
        ]);
    }

    public function test_validation_requires_title_and_type(): void
    {
        $data = [
            'title' => '',
            'type' => '',
        ];

        $response = $this->post(route('admin.galleries.store'), $data);

        $response->assertSessionHasErrors(['title', 'type']);
    }

    public function test_type_must_be_valid(): void
    {
        $data = [
            'title' => 'Test Gallery',
            'type' => 'invalid_type',
        ];

        $response = $this->post(route('admin.galleries.store'), $data);

        $response->assertSessionHasErrors(['type']);
    }

    public function test_can_update_gallery(): void
    {
        $gallery = Gallery::factory()->create([
            'title' => 'Old Title',
            'type' => 'photo',
        ]);

        $data = [
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'type' => 'photo',
            'category' => 'Updated Category',
            'date' => now()->toDateString(),
            'is_featured' => false,
        ];

        $response = $this->put(route('admin.galleries.update', $gallery), $data);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Galeri berhasil diperbarui');
        $this->assertDatabaseHas('galleries', [
            'id' => $gallery->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_can_update_gallery_file(): void
    {
        Storage::fake('public');

        $gallery = Gallery::factory()->create([
            'url' => '/storage/galleries/old.jpg',
            'is_external' => false,
        ]);

        $newFile = \Illuminate\Http\UploadedFile::fake()->image('new-gallery.jpg');

        $data = [
            'title' => 'Gallery',
            'type' => 'photo',
            'file' => $newFile,
        ];

        $response = $this->put(route('admin.galleries.update', $gallery), $data);

        $response->assertRedirect();
        Storage::disk('public')->assertMissing('galleries/old.jpg');
        Storage::disk('public')->assertExists('galleries/' . $newFile->hashName());
    }

    public function test_can_delete_gallery(): void
    {
        $gallery = Gallery::factory()->create();

        $response = $this->delete(route('admin.galleries.destroy', $gallery));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Galeri berhasil dihapus');
        $this->assertDatabaseMissing('galleries', ['id' => $gallery->id]);
    }

    public function test_deleting_gallery_removes_file(): void
    {
        Storage::fake('public');

        $file = \Illuminate\Http\UploadedFile::fake()->image('gallery.jpg');
        $path = $file->store('galleries', 'public');

        $gallery = Gallery::factory()->create([
            'url' => '/storage/' . $path,
            'is_external' => false,
        ]);

        $this->delete(route('admin.galleries.destroy', $gallery));

        Storage::disk('public')->assertMissing($path);
    }

    public function test_deleting_external_gallery_does_not_delete_external_file(): void
    {
        Storage::fake('public');

        $gallery = Gallery::factory()->create([
            'url' => 'https://example.com/video.mp4',
            'is_external' => true,
        ]);

        $response = $this->delete(route('admin.galleries.destroy', $gallery));

        $response->assertRedirect();
        $this->assertDatabaseMissing('galleries', ['id' => $gallery->id]);
    }

    public function test_file_max_size_validation(): void
    {
        $file = \Illuminate\Http\UploadedFile::fake()->create('large-file.mp4', 10241); // 10MB + 1KB
        $data = [
            'title' => 'Test Gallery',
            'type' => 'video',
            'file' => $file,
        ];

        $response = $this->post(route('admin.galleries.store'), $data);

        $response->assertSessionHasErrors(['file']);
    }

    public function test_can_set_thumbnail_url(): void
    {
        $data = [
            'title' => 'Gallery with Thumbnail',
            'type' => 'video',
            'url' => 'https://example.com/video.mp4',
            'is_external' => true,
            'thumbnail_url' => 'https://example.com/thumb.jpg',
        ];

        $this->post(route('admin.galleries.store'), $data);

        $this->assertDatabaseHas('galleries', [
            'title' => 'Gallery with Thumbnail',
            'thumbnail_url' => 'https://example.com/thumb.jpg',
        ]);
    }

    public function test_can_set_tags(): void
    {
        $data = [
            'title' => 'Tagged Gallery',
            'type' => 'photo',
            'tags' => ['wisuda', '2024', 'sekolah'],
        ];

        $this->post(route('admin.galleries.store'), $data);

        $gallery = Gallery::where('title', 'Tagged Gallery')->first();
        $this->assertEquals(['wisuda', '2024', 'sekolah'], $gallery->tags);
    }

    public function test_date_must_be_valid(): void
    {
        $data = [
            'title' => 'Test Gallery',
            'type' => 'photo',
            'date' => 'invalid-date',
        ];

        $response = $this->post(route('admin.galleries.store'), $data);

        $response->assertSessionHasErrors(['date']);
    }

    public function test_title_max_length_validation(): void
    {
        $data = [
            'title' => str_repeat('A', 256), // exceeds max of 255
            'type' => 'photo',
        ];

        $response = $this->post(route('admin.galleries.store'), $data);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_category_max_length_validation(): void
    {
        $data = [
            'title' => 'Gallery',
            'type' => 'photo',
            'category' => str_repeat('A', 256), // exceeds max of 255
        ];

        $response = $this->post(route('admin.galleries.store'), $data);

        $response->assertSessionHasErrors(['category']);
    }

    public function test_can_create_featured_gallery(): void
    {
        $data = [
            'title' => 'Featured Gallery',
            'type' => 'photo',
            'is_featured' => true,
        ];

        $this->post(route('admin.galleries.store'), $data);

        $this->assertDatabaseHas('galleries', [
            'title' => 'Featured Gallery',
            'is_featured' => true,
        ]);
    }
}
