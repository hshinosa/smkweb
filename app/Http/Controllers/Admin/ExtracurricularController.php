<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Extracurricular;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ExtracurricularController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $extracurriculars = Extracurricular::with('media')->orderBy('sort_order')->get();

        $transformedData = $extracurriculars->map(function ($extracurricular) {
            return $extracurricular->toArray();
        });

        return Inertia::render('Admin/Extracurriculars/Index', [
            'extracurriculars' => $transformedData
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:organisasi,ekstrakurikuler',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'activity_description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'bg_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'icon_name' => 'nullable|string|max:255',
            'achievements' => 'nullable|array',
            'achievements_data' => 'nullable|array',
            'achievements_data.*.title' => 'required|string',
            'achievements_data.*.level' => 'nullable|string',
            'achievements_data.*.year' => 'nullable|string',
            'training_info' => 'nullable|array',
            'training_info.days' => 'nullable|array',
            'training_info.days.*' => 'string',
            'training_info.start_time' => 'nullable|string',
            'training_info.end_time' => 'nullable|string',
            'training_info.location' => 'nullable|string',
            'training_info.coach' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Remove images from validated array
        $images = [
            'image' => $request->file('image'),
            'bg_image' => $request->file('bg_image'),
            'profile_image' => $request->file('profile_image')
        ];
        unset($validated['image'], $validated['bg_image'], $validated['profile_image']);

        $extracurricular = Extracurricular::create($validated);

        // Handle media uploads
        if ($images['image']) {
            $extracurricular->addMedia($images['image'])->toMediaCollection('images');
        }
        if ($images['bg_image']) {
            $extracurricular->addMedia($images['bg_image'])->toMediaCollection('bg_images');
        }
        if ($images['profile_image']) {
            $extracurricular->addMedia($images['profile_image'])->toMediaCollection('profile_images');
        }

        // Optionally allow redirecting with active_tab
        $activeTab = $validated['type'];
        return redirect()->route('admin.extracurriculars.index', ['tab' => $activeTab])
                        ->with('success', 'Ekstrakurikuler berhasil ditambahkan');
    }

    public function update(Request $request, Extracurricular $extracurricular)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:organisasi,ekstrakurikuler',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'activity_description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'bg_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'icon_name' => 'nullable|string|max:255',
            'achievements' => 'nullable|array',
            'achievements_data' => 'nullable|array',
            'achievements_data.*.title' => 'required|string',
            'achievements_data.*.level' => 'nullable|string',
            'achievements_data.*.year' => 'nullable|string',
            'training_info' => 'nullable|array',
            'training_info.days' => 'nullable|array',
            'training_info.days.*' => 'string',
            'training_info.start_time' => 'nullable|string',
            'training_info.end_time' => 'nullable|string',
            'training_info.location' => 'nullable|string',
            'training_info.coach' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Remove images from validated array
        $images = [
            'image' => $request->file('image'),
            'bg_image' => $request->file('bg_image'),
            'profile_image' => $request->file('profile_image')
        ];
        unset($validated['image'], $validated['bg_image'], $validated['profile_image']);

        $extracurricular->update($validated);

        // Update media if provided
        if ($images['image']) {
            $extracurricular->clearMediaCollection('images');
            $extracurricular->addMedia($images['image'])->toMediaCollection('images');
        }
        if ($images['bg_image']) {
            $extracurricular->clearMediaCollection('bg_images');
            $extracurricular->addMedia($images['bg_image'])->toMediaCollection('bg_images');
        }
        if ($images['profile_image']) {
            $extracurricular->clearMediaCollection('profile_images');
            $extracurricular->addMedia($images['profile_image'])->toMediaCollection('profile_images');
        }

        // Optionally allow redirecting with active_tab
        $activeTab = $validated['type'];
        return redirect()->route('admin.extracurriculars.index', ['tab' => $activeTab])
                        ->with('success', 'Ekstrakurikuler berhasil diperbarui');
    }

    public function destroy(Extracurricular $extracurricular)
    {
        // Keep track of type before delete to redirect back to correct tab
        $activeTab = $extracurricular->type;
        
        // NEW: Media Library automatically deletes associated media
        $extracurricular->delete();

        return redirect()->route('admin.extracurriculars.index', ['tab' => $activeTab])
                        ->with('success', 'Ekstrakurikuler berhasil dihapus');
    }
}
