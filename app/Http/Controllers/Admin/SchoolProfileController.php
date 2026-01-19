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
            
            // 1. Handle flat fields (like image_url in history or organization)
            foreach ($files as $field => $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    if ($field === 'image_url' || $field === 'image') {
                        $setting->clearMediaCollection($sectionKey);
                        $media = $setting->addMedia($file)->toMediaCollection($sectionKey);
                        $content['image_url'] = $media->getUrl();
                        if (isset($content['image'])) unset($content['image']);
                    }
                }
            }

            // 2. Handle nested items (like facilities images)
            if ($sectionKey === 'facilities' && isset($files['items']) && is_array($files['items'])) {
                foreach ($files['items'] as $index => $itemFile) {
                    if (isset($itemFile['image_file']) && $itemFile['image_file'] instanceof \Illuminate\Http\UploadedFile) {
                        $collectionName = "facilities_item_{$index}";
                        $setting->clearMediaCollection($collectionName);
                        $media = $setting->addMedia($itemFile['image_file'])->toMediaCollection($collectionName);
                        
                        // Update the specific item's image_url in the content array
                        if (isset($content['items'][$index])) {
                            $content['items'][$index]['image_url'] = $media->getUrl();
                            // Remove the temporary file object from the content array to avoid JSON encoding issues
                            if (isset($content['items'][$index]['image_file'])) {
                                unset($content['items'][$index]['image_file']);
                            }
                        }
                    }
                }
            }
        }

        // Preserve existing images if no new one was uploaded
        if (isset($existingContent['image_url']) && !isset($content['image_url']) && !isset($content['image'])) {
            $content['image_url'] = $existingContent['image_url'];
        }

        // Preserve existing facility images if no new one was uploaded and items still exist
        if ($sectionKey === 'facilities' && isset($existingContent['items']) && isset($content['items'])) {
            foreach ($content['items'] as $index => $item) {
                if (!isset($item['image_url']) && isset($existingContent['items'][$index]['image_url'])) {
                    $content['items'][$index]['image_url'] = $existingContent['items'][$index]['image_url'];
                }
            }
        }
        $setting->content = HtmlSanitizer::sanitizeSection($sectionKey, $content);
        $setting->save();

        return redirect()->back()->with('success', 'Konten profil berhasil diperbarui.');
    }
}
