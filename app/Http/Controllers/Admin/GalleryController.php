<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileUnacceptableForCollection;

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
                $data = $this->imageService->transformModelWithMedia($gallery, ['images']);
                
                // Fix: If url doesn't have proper prefix and is not from media library
                if (isset($data['url']) && !empty($data['url'])) {
                    // If it's not already a full URL and doesn't start with /
                    if (!str_starts_with($data['url'], 'http') && !str_starts_with($data['url'], '/')) {
                        // Assume it's in /images/ directory (common for older gallery entries)
                        $data['url'] = '/images/' . $data['url'];
                    }
                }
                
                return $data;
            })
        ]);
    }

    public function store(Request $request)
    {
        // Debug: Log incoming request data
        Log::info('Gallery Store Request:', [
            'all' => $request->all(),
            'has_file' => $request->hasFile('file'),
            'files' => $request->file(),
        ]);

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
                    if ($value && $value instanceof \Illuminate\Http\UploadedFile && $value->getSize() / 1024 > $max) {
                        $fail("Ukuran file " . ($request->type === 'video' ? 'video' : 'foto') . " tidak boleh lebih dari " . ($max/1024) . " MB.");
                    }
                },
            ],
            'url' => 'nullable|string|max:255',
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
            $validated['is_external'] = false; 

            $gallery = Gallery::create($validated);

            $collection = $request->type === 'video' ? 'videos' : 'images';

            try {
                $gallery->addMediaFromRequest('file')
                        ->toMediaCollection($collection);
                
                // Keep url for backward compatibility
                $media = $gallery->getFirstMedia($collection);
                $gallery->update(['url' => $media->getUrl()]);
            } catch (FileUnacceptableForCollection $e) {
                $gallery->delete(); 
                return redirect()->back()->withErrors(['file' => 'File tidak valid atau ukurannya terlalu besar.']);
            }
        } elseif ($request->url && $request->type === 'video' && $request->is_external) {
            $validated['url'] = $request->url;
            $validated['is_external'] = true;
            Gallery::create($validated);
        } else {
            if ($request->url && $request->is_external) {
                $validated['url'] = $request->url;
                $validated['is_external'] = true;
                Gallery::create($validated);
            } else {
                $validated['url'] = '';
                Gallery::create($validated);
            }
        }

        return redirect()->back()->with('success', 'Galeri berhasil ditambahkan');
    }

    public function update(Request $request, Gallery $gallery)
    {
        try {
            // Debug and normalize method
            if ($request->input('_method') === 'PUT') {
                $request->setMethod('PUT');
            }

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
                        if ($value && $value instanceof \Illuminate\Http\UploadedFile && $value->getSize() / 1024 > $max) {
                            $fail("Ukuran file " . ($request->type === 'video' ? 'video' : 'foto') . " tidak boleh lebih dari " . ($max/1024) . " MB.");
                        }
                    },
                ],
                'url' => 'nullable|string|max:255',
                'thumbnail_url' => 'nullable|string|max:255',
                'category' => 'nullable|string|max:255',
                'tags' => 'nullable|array',
                'date' => 'nullable|date',
                'is_featured' => 'sometimes',
                'is_external' => 'sometimes',
            ]);

            // Fix boolean values from FormData (handles 'true', 'false', '1', '0')
            $validated['is_featured'] = filter_var($request->get('is_featured', $gallery->is_featured), FILTER_VALIDATE_BOOLEAN);
            $validated['is_external'] = filter_var($request->get('is_external', $gallery->is_external), FILTER_VALIDATE_BOOLEAN);

            // Handle file upload with Media Library
            if ($request->hasFile('file')) {
                $gallery->clearMediaCollection('images');
                $gallery->clearMediaCollection('videos');

                $collection = $request->type === 'video' ? 'videos' : 'images';

                try {
                    $gallery->addMediaFromRequest('file')
                            ->toMediaCollection($collection);
                    
                    $media = $gallery->getFirstMedia($collection);
                    $validated['url'] = $media->getUrl();
                    $validated['is_external'] = false;
                } catch (FileUnacceptableForCollection $e) {
                    return redirect()->back()->withErrors(['file' => 'File tidak valid atau ukurannya terlalu besar.']);
                }
            } elseif ($request->url && $request->type === 'video' && $validated['is_external']) {
                $validated['url'] = $request->url;
                $validated['is_external'] = true;
                $gallery->clearMediaCollection('images');
            }

            $gallery->update($validated);

            return redirect()->back()->with('success', 'Galeri berhasil diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['general' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();
        return redirect()->back()->with('success', 'Galeri berhasil dihapus');
    }
}
