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

                    $heroImageMedia = $this->imageService->getFirstMediaData($dbRow, 'hero_image');
                    if ($heroImageMedia) $content['heroImageMedia'] = $heroImageMedia;
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
            
            // Only validate file fields if they are actually files (not strings/URLs)
            if ($request->hasFile('content.site_logo')) {
                $rules['content.site_logo'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:10240';
            }
            if ($request->hasFile('content.hero_image')) {
                $rules['content.hero_image'] = 'image|mimes:jpeg,png,jpg,gif,webp|max:10240';
            }
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
            // Handle site_logo
            if ($request->hasFile("content.site_logo")) {
                $setting->clearMediaCollection('site_logo');
                $media = $setting->addMediaFromRequest("content.site_logo")
                                ->toMediaCollection('site_logo');
                $content['site_logo'] = $media->getUrl();
            } elseif (isset($existingContent['site_logo'])) {
                // Preserve existing logo URL
                $content['site_logo'] = $existingContent['site_logo'];
            }

            // Handle hero_image
            if ($request->hasFile("content.hero_image")) {
                $setting->clearMediaCollection('hero_image');
                $media = $setting->addMediaFromRequest("content.hero_image")
                                ->toMediaCollection('hero_image');
                $content['hero_image'] = $media->getUrl();
            } elseif (isset($existingContent['hero_image'])) {
                // Preserve existing hero_image URL
                $content['hero_image'] = $existingContent['hero_image'];
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

        return redirect()->route('admin.site-settings.index', ['section' => $section])
            ->with('success', 'Pengaturan situs berhasil diperbarui.');
    }
}
