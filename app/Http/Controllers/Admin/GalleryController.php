<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $galleries = Gallery::with('media')->latest()->get();

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => $galleries->map(function ($gallery) {
                return $this->imageService->transformModelWithMedia($gallery, ['images']);
            })
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:photo,video',
            'file' => [
                'nullable',
                'file',
                'mimes:jpeg,png,jpg,webp,mp4,webm,mov',
                function ($attribute, $value, $fail) use ($request) {
                    $max = $request->type === 'video' ? 20480 : 5120; // 20MB vs 5MB
                    if ($value->getSize() / 1024 > $max) {
                        $fail("Ukuran file " . ($request->type === 'video' ? 'video' : 'foto') . " tidak boleh lebih dari " . ($max/1024) . " MB.");
                    }
                },
            ],
            'video_url' => 'nullable|string|max:255', // For YouTube/external videos
            'thumbnail_url' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'date' => 'nullable|date',
            'is_featured' => 'boolean',
            'is_external' => 'boolean',
        ]);

        if (empty($validated['date'])) {
            $validated['date'] = now();
        }

        // Handle file upload with Media Library
        if ($request->hasFile('file')) {
            // Placeholder URL to satisfy NOT NULL constraint before media upload
            $validated['url'] = 'temp'; 
            $validated['is_external'] = false; // Ensure it's local
            
            $gallery = Gallery::create($validated);
            
            $collection = $request->type === 'video' ? 'videos' : 'images';
            $gallery->addMediaFromRequest('file')
                     ->toMediaCollection($collection);
            
            // Keep url for backward compatibility
            $media = $gallery->getFirstMedia($collection);
            // Use media URL which respects the PathGenerator config
            $mediaUrl = $media->getUrl();
            // Convert absolute URL to relative path for cross-domain compatibility
            $relativePath = parse_url($mediaUrl, PHP_URL_PATH);
            $gallery->update(['url' => $relativePath]);
        } elseif ($request->video_url && $request->type === 'video') {
            // For external videos (YouTube, etc.)
            $validated['url'] = $request->video_url;
            $validated['is_external'] = true;
            Gallery::create($validated);
        } else {
            // External URL fallback
            if ($request->url) {
                $validated['url'] = $request->url;
                $validated['is_external'] = true;
                Gallery::create($validated);
            } else {
                // Fail safe: url cannot be null
                $validated['url'] = ''; 
                Gallery::create($validated);
            }
        }

        return redirect()->back()->with('success', 'Galeri berhasil ditambahkan');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:photo,video',
            'file' => [
                'nullable',
                'file',
                'mimes:jpeg,png,jpg,webp,mp4,webm,mov',
                function ($attribute, $value, $fail) use ($request) {
                    $max = $request->type === 'video' ? 20480 : 5120;
                    if ($value->getSize() / 1024 > $max) {
                        $fail("Ukuran file " . ($request->type === 'video' ? 'video' : 'foto') . " tidak boleh lebih dari " . ($max/1024) . " MB.");
                    }
                },
            ],
            'video_url' => 'nullable|string|max:255',
            'thumbnail_url' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'date' => 'nullable|date',
            'is_featured' => 'boolean',
            'is_external' => 'boolean',
        ]);

        // Handle file upload with Media Library
        if ($request->hasFile('file')) {
            // NEW: Clear old media and add new
            $gallery->clearMediaCollection('images');
            $gallery->clearMediaCollection('videos');
            
            $collection = $request->type === 'video' ? 'videos' : 'images';
            $gallery->addMediaFromRequest('file')
                     ->toMediaCollection($collection);
            
            // Update url for backward compatibility
            $media = $gallery->getFirstMedia($collection);
            // Use media URL which respects the PathGenerator config
            $mediaUrl = $media->getUrl();
            $relativePath = parse_url($mediaUrl, PHP_URL_PATH);
            $validated['url'] = $relativePath;
            $validated['is_external'] = false;
        } elseif ($request->video_url && $request->type === 'video') {
            // Update external video URL
            $validated['url'] = $request->video_url;
            $validated['is_external'] = true;
            // Clear images if switching to video
            $gallery->clearMediaCollection('images');
        }

        $gallery->update($validated);

        return redirect()->back()->with('success', 'Galeri berhasil diperbarui');
    }

    public function destroy(Gallery $gallery)
    {
        // NEW: Media Library automatically deletes associated media
        $gallery->delete();

        return redirect()->back()->with('success', 'Galeri berhasil dihapus');
    }
}
