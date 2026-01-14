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
        
        // Transform alumni data including video URLs from media library
        $transformedAlumnis = $alumnis->map(function ($alumni) {
            $data = $this->imageService->transformModelWithMedia($alumni, ['avatars']);
            
            // Add video URL from media library for uploaded videos
            if ($alumni->content_type === 'video' && $alumni->video_source === 'upload') {
                $videoMedia = $alumni->getFirstMedia('videos');
                if ($videoMedia) {
                    $data['video_url'] = $videoMedia->getUrl();
                }
            }
            
            return $data;
        })->toArray();
        
        return Inertia::render('Admin/Alumni/Index', [
            'alumnis' => $transformedAlumnis
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Alumni/Create');
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'graduation_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'testimonial' => 'required_if:content_type,text|nullable|string',
            'content_type' => 'required|in:text,video',
            'image' => 'nullable|image|max:10240',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];

        // Add conditional validation based on video source
        if ($request->content_type === 'video') {
            $rules['video_source'] = 'required|in:youtube,upload';
            
            if ($request->video_source === 'youtube') {
                $rules['video_url'] = ['required', 'url', 'max:500', function ($attribute, $value, $fail) {
                    if (!Alumni::isYouTubeUrl($value)) {
                        $fail('URL harus berupa URL YouTube yang valid.');
                    }
                }];
            } else if ($request->video_source === 'upload') {
                $rules['video_file'] = 'required|mimetypes:video/mp4,video/webm,video/ogg,video/quicktime|max:51200'; // 50MB max
            }
            
            $rules['video_thumbnail'] = 'nullable|image|max:10240';
        }

        $validated = $request->validate($rules);

        unset($validated['image'], $validated['video_thumbnail'], $validated['video_file']);

        $alumni = Alumni::create($validated);

        // Handle profile image
        if ($request->hasFile('image')) {
            $alumni->addMediaFromRequest('image')->toMediaCollection('avatars');
            
            $media = $alumni->getMedia('avatars')->last();
            if ($media) {
                $relativePath = $media->id . '/' . $media->file_name;
                $alumni->update(['image_url' => $relativePath]);
            }
        }

        // Handle video based on source
        if ($request->content_type === 'video') {
            if ($request->video_source === 'upload' && $request->hasFile('video_file')) {
                $alumni->addMediaFromRequest('video_file')->toMediaCollection('videos');
                
                // Use the media library's getUrl() which respects the PathGenerator
                $media = $alumni->getFirstMedia('videos');
                if ($media) {
                    // Store the full URL path that respects the PathGenerator
                    $alumni->update(['video_url' => $media->getUrl()]);
                }
            }

            // Handle video thumbnail upload
            if ($request->hasFile('video_thumbnail')) {
                $alumni->addMediaFromRequest('video_thumbnail')->toMediaCollection('video_thumbnails');
                
                // Use the media library's getUrl() which respects the PathGenerator
                $media = $alumni->getFirstMedia('video_thumbnails');
                if ($media) {
                    $alumni->update(['video_thumbnail_url' => $media->getUrl()]);
                }
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
        $rules = [
            'name' => 'required|string|max:255',
            'graduation_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'testimonial' => 'required_if:content_type,text|nullable|string',
            'content_type' => 'required|in:text,video',
            'image' => 'nullable|image|max:10240',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];

        // Add conditional validation based on video source
        if ($request->content_type === 'video') {
            $rules['video_source'] = 'required|in:youtube,upload';
            
            if ($request->video_source === 'youtube') {
                $rules['video_url'] = ['required', 'url', 'max:500', function ($attribute, $value, $fail) {
                    if (!Alumni::isYouTubeUrl($value)) {
                        $fail('URL harus berupa URL YouTube yang valid.');
                    }
                }];
            } else if ($request->video_source === 'upload') {
                $rules['video_file'] = 'nullable|mimetypes:video/mp4,video/webm,video/ogg,video/quicktime|max:51200';
            }
            
            $rules['video_thumbnail'] = 'nullable|image|max:10240';
        }

        $validated = $request->validate($rules);

        unset($validated['image'], $validated['video_thumbnail'], $validated['video_file']);

        $alumni->update($validated);

        // Handle profile image
        if ($request->hasFile('image')) {
            $alumni->clearMediaCollection('avatars');
            $alumni->addMediaFromRequest('image')->toMediaCollection('avatars');
            
            $media = $alumni->getMedia('avatars')->last();
            if ($media) {
                $relativePath = $media->id . '/' . $media->file_name;
                $alumni->update(['image_url' => $relativePath]);
            }
        }

        // Handle video based on source
        if ($request->content_type === 'video') {
            if ($request->video_source === 'upload' && $request->hasFile('video_file')) {
                $alumni->clearMediaCollection('videos');
                $alumni->addMediaFromRequest('video_file')->toMediaCollection('videos');
                
                // Use the media library's getUrl() which respects the PathGenerator
                $media = $alumni->getFirstMedia('videos');
                if ($media) {
                    // Store the full URL path that respects the PathGenerator
                    $alumni->update(['video_url' => $media->getUrl()]);
                }
            }

            // Handle video thumbnail upload
            if ($request->hasFile('video_thumbnail')) {
                $alumni->clearMediaCollection('video_thumbnails');
                $alumni->addMediaFromRequest('video_thumbnail')->toMediaCollection('video_thumbnails');
                
                // Use the media library's getUrl() which respects the PathGenerator
                $media = $alumni->getFirstMedia('video_thumbnails');
                if ($media) {
                    $alumni->update(['video_thumbnail_url' => $media->getUrl()]);
                }
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
