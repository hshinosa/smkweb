<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\HtmlSanitizer;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Posts/Index', [
            'posts' => Post::with('author')->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:2048',
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

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('posts', 'public');
            $validated['featured_image'] = Storage::url($path);
        }

        Post::create($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil dibuat');
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:2048',
            'category' => 'required|string|max:255',
            'status' => 'required|in:draft,published',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['content'] = HtmlSanitizer::sanitize($validated['content']);

        if ($request->title !== $post->title) {
            $validated['slug'] = Str::slug($request->title) . '-' . uniqid();
        }

        if ($request->hasFile('featured_image')) {
            if ($post->featured_image) {
                $oldPath = str_replace('/storage/', '', $post->featured_image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('featured_image')->store('posts', 'public');
            $validated['featured_image'] = Storage::url($path);
        }

        $post->update($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil diperbarui');
    }

    public function destroy(Post $post)
    {
        if ($post->featured_image) {
            $oldPath = str_replace('/storage/', '', $post->featured_image);
            Storage::disk('public')->delete($oldPath);
        }

        $post->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus');
    }
}
