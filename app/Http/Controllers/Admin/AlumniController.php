<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alumni;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AlumniController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $alumnis = Alumni::with('media')->orderBy('sort_order')->latest()->get();
        return Inertia::render('Admin/Alumni/Index', [
            'alumnis' => $this->imageService->transformCollectionWithMedia($alumnis, ['avatars'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Alumni/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'graduation_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'current_position' => 'nullable|string|max:255',
            'education' => 'nullable|string|max:255',
            'testimonial' => 'required|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ]);

        unset($validated['image']);

        $alumni = Alumni::create($validated);

        if ($request->hasFile('image')) {
            $alumni->addMediaFromRequest('image')->toMediaCollection('avatars');
            
            // Backward compatibility for existing frontend
            $media = $alumni->getMedia('avatars')->last();
            if ($media) {
                // Remove /storage/ prefix to match old behavior
                // Use explicit path construction to avoid getUrl issues in testing
                $relativePath = $media->id . '/' . $media->file_name;
                $alumni->update(['image_url' => $relativePath]);
            }
        }

        return redirect()->route('admin.alumni.index')->with('success', 'Alumni berhasil ditambahkan.');
    }

    public function edit(Alumni $alumni)
    {
        return Inertia::render('Admin/Alumni/Edit', [
            'alumni' => $this->imageService->transformModelWithMedia($alumni, ['avatars'])
        ]);
    }

    public function update(Request $request, Alumni $alumni)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'graduation_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'current_position' => 'nullable|string|max:255',
            'education' => 'nullable|string|max:255',
            'testimonial' => 'required|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ]);

        unset($validated['image']);

        $alumni->update($validated);

        if ($request->hasFile('image')) {
            $alumni->clearMediaCollection('avatars');
            $alumni->addMediaFromRequest('image')->toMediaCollection('avatars');
            
            // Backward compatibility
            $media = $alumni->getMedia('avatars')->last();
            if ($media) {
                $relativePath = $media->id . '/' . $media->file_name;
                $alumni->update(['image_url' => $relativePath]);
            }
        }

        return redirect()->route('admin.alumni.index')->with('success', 'Alumni berhasil diperbarui.');
    }

    public function destroy(Alumni $alumni)
    {
        $alumni->delete(); // Media library handles deletion

        return redirect()->route('admin.alumni.index')->with('success', 'Alumni berhasil dihapus.');
    }
}
