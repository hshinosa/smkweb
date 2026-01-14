<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Extracurricular;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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

        return Inertia::render('Admin/Extracurriculars/Index', [
            'extracurriculars' => $extracurriculars->map(function ($extracurricular) {
                return $this->imageService->transformModelWithMedia($extracurricular, ['images']);
            })
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'icon_name' => 'nullable|string|max:255',
            'schedule' => 'nullable|string|max:255',
            'coach_name' => 'nullable|string|max:255',
            'achievements' => 'nullable|array', // New field
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Remove image from validated array
        unset($validated['image']);

        $extracurricular = Extracurricular::create($validated);

        // NEW: Use Media Library for automatic WebP + responsive variants
        if ($request->hasFile('image')) {
            $extracurricular->addMediaFromRequest('image')
                     ->toMediaCollection('images');
        }

        return redirect()->back()->with('success', 'Ekstrakurikuler berhasil ditambahkan');
    }

    public function update(Request $request, Extracurricular $extracurricular)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'icon_name' => 'nullable|string|max:255',
            'schedule' => 'nullable|string|max:255',
            'coach_name' => 'nullable|string|max:255',
            'achievements' => 'nullable|array', // New field
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Remove image from validated array
        unset($validated['image']);

        $extracurricular->update($validated);

        // NEW: Update media if image provided
        if ($request->hasFile('image')) {
            // Clear old media
            $extracurricular->clearMediaCollection('images');
            
            // Add new media
            $extracurricular->addMediaFromRequest('image')
                     ->toMediaCollection('images');
        }

        return redirect()->back()->with('success', 'Ekstrakurikuler berhasil diperbarui');
    }

    public function destroy(Extracurricular $extracurricular)
    {
        // NEW: Media Library automatically deletes associated media
        $extracurricular->delete();

        return redirect()->back()->with('success', 'Ekstrakurikuler berhasil dihapus');
    }
}
