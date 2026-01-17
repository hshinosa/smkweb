<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\HtmlSanitizer;
use App\Http\Controllers\Controller;
use App\Models\SchoolProfileSetting;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SchoolProfileController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $settings = SchoolProfileSetting::with('media')->get()->keyBy('section_key');
        $sections = [];
        foreach (array_keys(SchoolProfileSetting::getSectionFields()) as $key) {
            $dbRow = $settings->get($key);
            
            // Get content - accessor automatically handles JSON decoding
            $dbContent = ($dbRow && $dbRow->content) ? $dbRow->content : null;
            
            // Get merged content with defaults
            $content = SchoolProfileSetting::getContent($key, $dbContent);
            
            // Append responsive image data if exists
            if ($dbRow) {
                // Check if we have media for this section
                $media = $this->imageService->getFirstMediaData($dbRow, $key);
                if ($media) {
                    $content['backgroundImage'] = $media;
                }
            }
            
            $sections[$key] = $content;
        }

        return Inertia::render('Admin/SchoolProfile/Index', [
            'sections' => $sections,
            'activeSection' => request('section', 'history')
        ]);
    }

    public function update(Request $request)
    {
        $sectionKey = $request->input('section');
        $content = $request->input('content');

        // Find or create setting
        $setting = SchoolProfileSetting::firstOrNew(['section_key' => $sectionKey]);
        $existingContent = $setting->content ?? [];

        // Save first if new to ensure it has an ID for media library
        if (!$setting->exists) {
            $setting->content = $content;
            $setting->save();
        }

        // Handle file uploads with Media Library
        if ($request->hasFile('content')) {
            $files = $request->file('content');
            foreach ($files as $field => $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    // Only process 'image_url' or 'image' field for Media Library
                    if ($field === 'image_url' || $field === 'image') {
                        // Clear old media in this collection (using section_key as collection name)
                        $setting->clearMediaCollection($sectionKey);
                        
                        // Add new media
                        $media = $setting->addMedia($file)
                                        ->toMediaCollection($sectionKey);
                        
                        // Set URL for backward compatibility
                        $content['image_url'] = $media->getUrl();
                        
                        // Remove temporary 'image' field if exists
                        if (isset($content['image'])) unset($content['image']);
                    } else {
                        // Other files (like timeline items)
                        $collectionName = $sectionKey . '_' . $field;
                        $setting->clearMediaCollection($collectionName);
                        $media = $setting->addMedia($file)->toMediaCollection($collectionName);
                        $content[$field] = $media->getUrl();
                    }
                }
            }
        }

        // Preserve existing images if no new one was uploaded
        if (isset($existingContent['image_url']) && !isset($content['image_url']) && !isset($content['image'])) {
            $content['image_url'] = $existingContent['image_url'];
        }

        // Save content
        $setting->content = HtmlSanitizer::sanitizeSection($sectionKey, $content);
        $setting->save();

        return redirect()->back()->with('success', 'Konten profil berhasil diperbarui.');
    }
}
