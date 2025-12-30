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

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts->map(function ($post) {
                return $this->imageService->transformModelWithMedia($post, ['featured']);
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

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil dibuat');
    }

    public function update(Request $request, Post $post)
    {
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
