<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\HtmlSanitizer;
use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $posts = Post::with(['author', 'media'])->latest()->get();
        
        // Fetch scraped feeds for these posts to get potential missing images
        $scrapedFeeds = \Illuminate\Support\Facades\DB::table('sc_raw_news_feeds')
            ->whereIn('processed_post_id', $posts->pluck('id'))
            ->get()
            ->keyBy('processed_post_id');

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts->map(function ($post) use ($scrapedFeeds) {
                $data = $this->imageService->transformModelWithMedia($post, ['featured', 'gallery']);
                
                // Attach potential scraped images
                $feed = $scrapedFeeds->get($post->id);
                if ($feed && !empty($feed->image_paths)) {
                    $paths = json_decode($feed->image_paths, true) ?? [];
                    $scrapedImages = [];
                    foreach ($paths as $path) {
                        $cleanPath = ltrim($path, '/\\');
                        
                        // Handle path prefix differences
                        if (str_starts_with($cleanPath, 'downloads/')) {
                            $cleanPath = substr($cleanPath, 10);
                        }
                        
                        // Ensure no double slashes
                        $cleanPath = ltrim($cleanPath, '/');
                        
                        $scrapedImages[] = '/scraped-images/' . $cleanPath;
                    }
                    $data['scraped_images'] = $scrapedImages;
                }
                
                return $data;
            })
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:5120', // 5MB
            'category' => 'required|string|max:255',
            'status' => 'required|in:draft,published',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['content'] = HtmlSanitizer::sanitize($validated['content']);
        $validated['slug'] = Str::slug($request->title) . '-' . uniqid();
        $validated['author_id'] = Auth::guard('admin')->id();
        
        if (!$request->published_at && $request->status === 'published') {
            $validated['published_at'] = now();
        }

        // Remove featured_image from validated array (will use Media Library instead)
        unset($validated['featured_image']);
        
        $post = Post::create($validated);

        // NEW: Use Media Library for automatic WebP + responsive variants generation
        if ($request->hasFile('featured_image')) {
            $post->addMediaFromRequest('featured_image')
                 ->toMediaCollection('featured');
        }

        // Handle Gallery Images
        if ($request->has('images') && is_array($request->images)) {
            foreach ($request->images as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $post->addMedia($image)->toMediaCollection('gallery');
                }
            }
        }

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil dibuat');
    }

    public function update(Request $request, Post $post)
    {
        // DEBUG: Log incoming request data
        Log::info('[PostController] Update request received', [
            'post_id' => $post->id,
            'has_title' => $request->has('title'),
            'title_value' => $request->input('title'),
            'has_content' => $request->has('content'),
            'content_length' => strlen($request->input('content', '')),
            'has_category' => $request->has('category'),
            'has_status' => $request->has('status'),
            'has_excerpt' => $request->has('excerpt'),
            'has_images' => $request->has('images'),
            'has_new_images' => $request->has('new_images'),
            'has_existing_images' => $request->has('existing_images'),
            'all_keys' => array_keys($request->all()),
            'content_type' => $request->header('Content-Type'),
            'method' => $request->method(),
        ]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:5120',
            'category' => 'required|string|max:255',
            'status' => 'required|in:draft,published',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['content'] = HtmlSanitizer::sanitize($validated['content']);

        if ($request->title !== $post->title) {
            $validated['slug'] = Str::slug($request->title) . '-' . uniqid();
        }

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = $post->published_at ?? now();
        }

        if ($validated['status'] === 'draft') {
            $validated['published_at'] = null;
        }

        // Remove featured_image from validated array
        unset($validated['featured_image']);

        // NEW: Use Media Library
        if ($request->hasFile('featured_image')) {
            // Clear old media (Media Library handles cleanup)
            $post->clearMediaCollection('featured');
            
            // Add new media
            $post->addMediaFromRequest('featured_image')
                 ->toMediaCollection('featured');
        }

        // Handle Gallery Images - NEW FORMAT with new_images and existing_images
        $hasNewFormat = $request->has('existing_images') || $request->has('new_images');
        
        if ($hasNewFormat) {
            // New format: existing_images (JSON string of URLs) + new_images (uploaded files)
            $existingImagesJson = $request->input('existing_images', '[]');
            $keptUrls = json_decode($existingImagesJson, true) ?? [];
            
            Log::info('[PostController] Processing images with new format', [
                'existing_images_json' => $existingImagesJson,
                'kept_urls_count' => count($keptUrls),
                'new_images_count' => count($request->allFiles()['new_images'] ?? []),
            ]);
            
            // Get all existing media items for gallery
            $existingMedia = $post->getMedia('gallery');
            
            // Delete media that is NOT in keptUrls
            foreach ($existingMedia as $media) {
                if (!in_array($media->getUrl(), $keptUrls)) {
                     $media->delete();
                }
            }
            
            // Handle scraped images (local paths)
            foreach ($keptUrls as $url) {
                if (str_starts_with($url, '/scraped-images/')) {
                    $matchFound = false;
                    $scrapedFilename = basename($url);
                    
                    foreach ($existingMedia as $m) {
                        if ($m->file_name === $scrapedFilename || str_contains($m->getUrl(), $scrapedFilename)) {
                            $matchFound = true;
                            break;
                        }
                    }
                    
                    if (!$matchFound) {
                        $relativePath = str_replace('/scraped-images/', '', $url);
                        $fullPath = base_path('instagram-scraper/downloads/' . $relativePath);
                        
                        if (str_contains($relativePath, '..')) {
                            continue;
                        }

                        if (file_exists($fullPath)) {
                            try {
                                $post->addMedia($fullPath)
                                    ->preservingOriginal()
                                    ->toMediaCollection('gallery');
                            } catch (\Exception $e) {
                                Log::error("Failed to import scraped image: {$fullPath}. Error: " . $e->getMessage());
                            }
                        }
                    }
                }
            }
            
            // Add new uploaded files (new_images[0], new_images[1], etc.)
            $newImages = $request->allFiles()['new_images'] ?? [];
            foreach ($newImages as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $post->addMedia($image)->toMediaCollection('gallery');
                }
            }
        } elseif ($request->has('images') && is_array($request->images)) {
            // Legacy format: images array with mixed strings and files
            $existingMedia = $post->getMedia('gallery');
            
            $keptUrls = collect($request->images)
                ->filter(fn($i) => is_string($i))
                ->toArray();
                
            foreach ($existingMedia as $media) {
                if (!in_array($media->getUrl(), $keptUrls)) {
                     $media->delete();
                }
            }
            
            foreach ($keptUrls as $url) {
                if (str_starts_with($url, '/scraped-images/')) {
                    $matchFound = false;
                    $scrapedFilename = basename($url);
                    
                    foreach ($existingMedia as $m) {
                        if ($m->file_name === $scrapedFilename || str_contains($m->getUrl(), $scrapedFilename)) {
                            $matchFound = true;
                            break;
                        }
                    }
                    
                    if (!$matchFound) {
                        $relativePath = str_replace('/scraped-images/', '', $url);
                        $fullPath = base_path('instagram-scraper/downloads/' . $relativePath);
                        
                        if (str_contains($relativePath, '..')) {
                            continue;
                        }

                        if (file_exists($fullPath)) {
                            try {
                                $post->addMedia($fullPath)
                                    ->preservingOriginal()
                                    ->toMediaCollection('gallery');
                            } catch (\Exception $e) {
                                Log::error("Failed to import scraped image: {$fullPath}. Error: " . $e->getMessage());
                            }
                        }
                    }
                }
            }
            
            foreach ($request->images as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $post->addMedia($image)->toMediaCollection('gallery');
                }
            }
        }

        $post->update($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil diperbarui');
    }

    public function destroy(Post $post)
    {
        // Media Library automatically deletes associated media
        $post->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus');
    }
}
