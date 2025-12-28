<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => Gallery::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:photo,video',
            'file' => 'nullable|file|max:10240', // 10MB max
            'url' => 'nullable|string|max:255',
            'thumbnail_url' => 'nullable|string|max:255',
            'is_external' => 'boolean',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'date' => 'nullable|date',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('galleries', 'public');
            $validated['url'] = Storage::url($path);
            $validated['is_external'] = false;
        }

        Gallery::create($validated);

        return redirect()->back()->with('success', 'Galeri berhasil ditambahkan');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:photo,video',
            'file' => 'nullable|file|max:10240',
            'url' => 'nullable|string|max:255',
            'thumbnail_url' => 'nullable|string|max:255',
            'is_external' => 'boolean',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'date' => 'nullable|date',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($gallery->url && !$gallery->is_external) {
                $oldPath = str_replace('/storage/', '', $gallery->url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('file')->store('galleries', 'public');
            $validated['url'] = Storage::url($path);
            $validated['is_external'] = false;
        }

        $gallery->update($validated);

        return redirect()->back()->with('success', 'Galeri berhasil diperbarui');
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->url && !$gallery->is_external) {
            $oldPath = str_replace('/storage/', '', $gallery->url);
            Storage::disk('public')->delete($oldPath);
        }

        $gallery->delete();

        return redirect()->back()->with('success', 'Galeri berhasil dihapus');
    }
}
