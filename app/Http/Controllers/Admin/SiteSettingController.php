<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Helpers\ActivityLogger;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->keyBy('section_key');
        $sections = [];
        
        foreach (array_keys(SiteSetting::getSectionFields()) as $key) {
            $dbRow = $settings->get($key);
            $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
            $sections[$key] = SiteSetting::getContent($key, $dbContent);
        }

        return Inertia::render('Admin/SiteSettings/Index', [
            'sections' => $sections,
            'activeSection' => request('section', 'general')
        ]);
    }

    public function update(Request $request)
    {
        $section = $request->input('section');
        
        // Validation
        $rules = [
            'section' => 'required|string',
            'content' => 'required|array',
        ];

        if ($section === 'general') {
            $rules['content.site_name'] = 'required|string|max:255';
            $rules['content.email'] = 'nullable|email|max:255';
            $rules['content.site_logo'] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
            $rules['content.site_favicon'] = 'nullable|image|mimes:ico,png,jpg,jpeg|max:1024';
        }

        $request->validate($rules);

        $content = $request->input('content');
        $existingSetting = SiteSetting::where('section_key', $section)->first();
        $existingContent = $existingSetting ? $existingSetting->content : [];

        // Handle file uploads for general
        if ($section === 'general') {
            if ($request->hasFile("content.site_logo")) {
                if (isset($existingContent['site_logo'])) {
                    Storage::disk('public')->delete($existingContent['site_logo']);
                }
                $path = $request->file("content.site_logo")->store('site', 'public');
                $content['site_logo'] = $path;
            } else {
                $content['site_logo'] = $existingContent['site_logo'] ?? null;
            }

            if ($request->hasFile("content.site_favicon")) {
                if (isset($existingContent['site_favicon'])) {
                    Storage::disk('public')->delete($existingContent['site_favicon']);
                }
                $path = $request->file("content.site_favicon")->store('site', 'public');
                $content['site_favicon'] = $path;
            } else {
                $content['site_favicon'] = $existingContent['site_favicon'] ?? null;
            }
        }

        // Handle file uploads for hero sections in SiteSetting
        if (str_starts_with($section, 'hero_')) {
            if ($request->hasFile("content.image_file")) {
                if (isset($existingContent['image'])) {
                    Storage::disk('public')->delete($existingContent['image']);
                }
                $path = $request->file("content.image_file")->store('hero', 'public');
                $content['image'] = $path;
            } else {
                $content['image'] = $existingContent['image'] ?? ($content['image'] ?? null);
            }
            unset($content['image_file']);
        }

        SiteSetting::updateOrCreate(
            ['section_key' => $section],
            ['content' => $content]
        );

        SiteSetting::forgetCache();

        ActivityLogger::log("Update Pengaturan Situs", "Memperbarui bagian: " . $section, $request);

        return back()->with('success', 'Pengaturan situs berhasil diperbarui.');
    }
}
