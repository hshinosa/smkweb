<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\SiteSetting;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $settings = SiteSetting::where('section_key', 'hero_teachers')->first();
        $hero = SiteSetting::getContent('hero_teachers', $settings ? $settings->content : null);

        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => Teacher::with('media')->latest()->get(),
            'currentSettings' => $hero
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'image_file' => 'nullable|image|max:10240',
        ]);

        $settings = SiteSetting::firstOrNew(['section_key' => 'hero_teachers']);
        $content = $settings->content ?? SiteSetting::getDefaults('hero_teachers');

        $content['title'] = $validated['title'];
        $content['subtitle'] = $validated['subtitle'];

        // Save first if new to ensure it has an ID for media library
        if (!$settings->exists) {
            $settings->content = $content;
            $settings->save();
        }

        if ($request->hasFile('image_file')) {
            $settings->clearMediaCollection('hero_bg');
            $settings->addMediaFromRequest('image_file')->toMediaCollection('hero_bg');
            $media = $settings->getMedia('hero_bg')->last();
            if ($media) {
                $content['image'] = '/storage/' . $media->id . '/' . $media->file_name;
            }
        }

        $settings->content = $content;
        $settings->save();

        SiteSetting::forgetCache();

        return redirect()->back()->with('success', 'Pengaturan hero berhasil diperbarui');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:guru,staff',
            'position' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'nip' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Remove image from validated array
        unset($validated['image']);

        // Create teacher
        $teacher = Teacher::create($validated);

        // NEW: Use Media Library for automatic WebP + responsive variants
        if ($request->hasFile('image')) {
            $teacher->addMediaFromRequest('image')
                     ->toMediaCollection('photos');
            
            // Update image_url with proper media URL
            $media = $teacher->getFirstMedia('photos');
            if ($media) {
                $teacher->update(['image_url' => $media->getUrl()]);
            }
        }

        return redirect()->back()->with('success', 'Data Guru/Staff berhasil ditambahkan');
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:guru,staff',
            'position' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'nip' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Remove image from validated array
        unset($validated['image']);

        // Update teacher data
        $teacher->update($validated);

        // NEW: Update media if image provided
        if ($request->hasFile('image')) {
            // Clear old media
            $teacher->clearMediaCollection('photos');
            
            // Add new media
            $teacher->addMediaFromRequest('image')
                     ->toMediaCollection('photos');
            
            // Update image_url with proper media URL
            $media = $teacher->getFirstMedia('photos');
            if ($media) {
                $teacher->update(['image_url' => $media->getUrl()]);
            }
        }

        return redirect()->back()->with('success', 'Data Guru/Staff berhasil diperbarui');
    }

    public function destroy(Teacher $teacher)
    {
        // NEW: Media Library automatically deletes associated media
        $teacher->delete();

        return redirect()->back()->with('success', 'Data Guru/Staff berhasil dihapus');
    }
}
