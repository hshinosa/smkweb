<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::where('section_key', 'hero_teachers')->first();
        $hero = SiteSetting::getContent('hero_teachers', $settings ? $settings->content : null);

        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => Teacher::orderBy('sort_order')->get(),
            'currentSettings' => $hero
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'image_file' => 'nullable|image|max:2048',
        ]);

        $settings = SiteSetting::firstOrNew(['section_key' => 'hero_teachers']);
        $content = $settings->content ?? SiteSetting::getDefaults('hero_teachers');

        $content['title'] = $validated['title'];
        $content['subtitle'] = $validated['subtitle'];

        if ($request->hasFile('image_file')) {
            if (isset($content['image']) && !str_starts_with($content['image'], '/images/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $content['image']));
            }
            $path = $request->file('image_file')->store('hero', 'public');
            $content['image'] = '/storage/' . $path;
        }

        $settings->content = $content;
        $settings->save();

        SiteSetting::forgetCache();

        return redirect()->back()->with('success', 'Pengaturan hero berhasil diperbarui');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:guru,staff',
            'position' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'nip' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('teachers', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        Teacher::create($validated);

        return redirect()->back()->with('success', 'Data Guru/Staff berhasil ditambahkan');
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:guru,staff',
            'position' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'nip' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($teacher->image_url) {
                $oldPath = str_replace('/storage/', '', $teacher->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('teachers', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $teacher->update($validated);

        return redirect()->back()->with('success', 'Data Guru/Staff berhasil diperbarui');
    }

    public function destroy(Teacher $teacher)
    {
        if ($teacher->image_url) {
            $oldPath = str_replace('/storage/', '', $teacher->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $teacher->delete();

        return redirect()->back()->with('success', 'Data Guru/Staff berhasil dihapus');
    }
}
