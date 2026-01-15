<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiteSetting;
use App\Services\ImageService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Helpers\ActivityLogger;

class SiteSettingController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $settings = SiteSetting::with('media')->get()->keyBy('section_key');
        $sections = [];
        
        foreach (array_keys(SiteSetting::getSectionFields()) as $key) {
            $dbRow = $settings->get($key);
            $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
            $content = SiteSetting::getContent($key, $dbContent);
            
            // Append responsive image data if exists
            if ($dbRow) {
                // For hero sections with 'image'
                if (str_starts_with($key, 'hero_')) {
                    $media = $this->imageService->getFirstMediaData($dbRow, $key);
                    if ($media) {
                        $content['backgroundImage'] = $media;
                    }
                }
                
                // For general settings with logo/favicon
                if ($key === 'general') {
                    $logoMedia = $this->imageService->getFirstMediaData($dbRow, 'site_logo');
                    if ($logoMedia) $content['siteLogoMedia'] = $logoMedia;
                    
                    $faviconMedia = $this->imageService->getFirstMediaData($dbRow, 'site_favicon');
                    if ($faviconMedia) $content['siteFaviconMedia'] = $faviconMedia;
                }
            }
            
            $sections[$key] = $content;
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
            $rules['content.site_logo'] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240';
            $rules['content.site_favicon'] = 'nullable|image|mimes:ico,png,jpg,jpeg|max:1024';
        }

        $request->validate($rules);

        $content = $request->input('content');
        
        // Find or create setting
        $setting = SiteSetting::firstOrNew(['section_key' => $section]);
        $existingContent = $setting->content ?? [];

        // Save first if new to ensure it has an ID for media library
        if (!$setting->exists) {
            $setting->content = $content;
            $setting->save();
        }

        // Handle file uploads with Media Library
        if ($section === 'general') {
            if ($request->hasFile("content.site_logo")) {
                $setting->clearMediaCollection('site_logo');
                $media = $setting->addMediaFromRequest("content.site_logo")
                                ->toMediaCollection('site_logo');
                $content['site_logo'] = $media->getUrl();
            } else {
                $content['site_logo'] = $existingContent['site_logo'] ?? null;
            }

            if ($request->hasFile("content.site_favicon")) {
                $setting->clearMediaCollection('site_favicon');
                $media = $setting->addMediaFromRequest("content.site_favicon")
                                ->toMediaCollection('site_favicon');
                $content['site_favicon'] = $media->getUrl();
            } else {
                $content['site_favicon'] = $existingContent['site_favicon'] ?? null;
            }
        }

        // Handle file uploads for hero sections in SiteSetting
        if (str_starts_with($section, 'hero_')) {
            if ($request->hasFile("content.image_file")) {
                $setting->clearMediaCollection($section);
                $media = $setting->addMediaFromRequest("content.image_file")
                                ->toMediaCollection($section);
                $content['image'] = $media->getUrl();
            } else {
                $content['image'] = $existingContent['image'] ?? ($content['image'] ?? null);
            }
            unset($content['image_file']);
        }

        $setting->content = $content;
        $setting->save();

        SiteSetting::forgetCache();

        ActivityLogger::log("Update Pengaturan Situs", "Memperbarui bagian: " . $section, $request);

        return back()->with('success', 'Pengaturan situs berhasil diperbarui.');
    }
}
