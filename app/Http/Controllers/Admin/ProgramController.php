<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Programs/Index', [
            'programs' => Program::orderBy('sort_order')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon_name' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string|max:255',
            'color_class' => 'nullable|string|max:255',
            'description' => 'required|string',
            'link' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('programs', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        Program::create($validated);

        return redirect()->back()->with('success', 'Program berhasil ditambahkan');
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon_name' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string|max:255',
            'color_class' => 'nullable|string|max:255',
            'description' => 'required|string',
            'link' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($program->image_url && !str_starts_with($program->image_url, 'http')) {
                $oldPath = str_replace('/storage/', '', $program->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('image')->store('programs', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $program->update($validated);

        return redirect()->back()->with('success', 'Program berhasil diperbarui');
    }

    public function destroy(Program $program)
    {
        if ($program->image_url && !str_starts_with($program->image_url, 'http')) {
            $oldPath = str_replace('/storage/', '', $program->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $program->delete();

        return redirect()->back()->with('success', 'Program berhasil dihapus');
    }
}
