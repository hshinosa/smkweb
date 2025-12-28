<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AlumniController extends Controller
{
    public function index()
    {
        $alumnis = Alumni::orderBy('sort_order')->latest()->get();
        return Inertia::render('Admin/Alumni/Index', [
            'alumnis' => $alumnis
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

        if ($request->hasFile('image')) {
            $validated['image_url'] = Storage::disk('public')->put('alumni', $request->file('image'));
        }

        Alumni::create($validated);

        return redirect()->route('admin.alumni.index')->with('success', 'Alumni berhasil ditambahkan.');
    }

    public function edit(Alumni $alumni)
    {
        return Inertia::render('Admin/Alumni/Edit', [
            'alumni' => $alumni
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

        if ($request->hasFile('image')) {
            if ($alumni->image_url) {
                Storage::disk('public')->delete($alumni->image_url);
            }
            $validated['image_url'] = Storage::disk('public')->put('alumni', $request->file('image'));
        }

        $alumni->update($validated);

        return redirect()->route('admin.alumni.index')->with('success', 'Alumni berhasil diperbarui.');
    }

    public function destroy(Alumni $alumni)
    {
        if ($alumni->image_url) {
            Storage::disk('public')->delete($alumni->image_url);
        }
        $alumni->delete();

        return redirect()->route('admin.alumni.index')->with('success', 'Alumni berhasil dihapus.');
    }
}
