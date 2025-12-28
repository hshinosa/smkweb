<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Extracurricular;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ExtracurricularController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Extracurriculars/Index', [
            'extracurriculars' => Extracurricular::orderBy('sort_order')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'icon_name' => 'nullable|string|max:255',
            'schedule' => 'nullable|string|max:255',
            'coach_name' => 'nullable|string|max:255',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('extracurriculars', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        Extracurricular::create($validated);

        return redirect()->back()->with('success', 'Ekstrakurikuler berhasil ditambahkan');
    }

    public function update(Request $request, Extracurricular $extracurricular)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'icon_name' => 'nullable|string|max:255',
            'schedule' => 'nullable|string|max:255',
            'coach_name' => 'nullable|string|max:255',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($extracurricular->image_url) {
                $oldPath = str_replace('/storage/', '', $extracurricular->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('extracurriculars', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $extracurricular->update($validated);

        return redirect()->back()->with('success', 'Ekstrakurikuler berhasil diperbarui');
    }

    public function destroy(Extracurricular $extracurricular)
    {
        if ($extracurricular->image_url) {
            $oldPath = str_replace('/storage/', '', $extracurricular->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $extracurricular->delete();

        return redirect()->back()->with('success', 'Ekstrakurikuler berhasil dihapus');
    }
}
