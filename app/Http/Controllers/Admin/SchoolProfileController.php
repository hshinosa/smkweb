<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\HtmlSanitizer;
use App\Http\Controllers\Controller;
use App\Models\SchoolProfileSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SchoolProfileController extends Controller
{
    public function index()
    {
        $settings = SchoolProfileSetting::all()->keyBy('section_key');
        $sections = [];
        foreach (array_keys(SchoolProfileSetting::getSectionFields()) as $key) {
            $dbRow = $settings->get($key);
            $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
            $sections[$key] = SchoolProfileSetting::getContent($key, $dbContent);
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

        // Extract image paths if not uploaded but already exist
        $existing = SchoolProfileSetting::where('section_key', $sectionKey)->first();
        $existingContent = $existing ? $existing->content : [];

        // Handle file uploads if any
        if ($request->hasFile('content')) {
            $files = $request->file('content');
            foreach ($files as $field => $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $path = $file->store('profile', 'public');
                    $content[$field] = '/storage/' . $path;
                }
            }
        }

        // Preserve existing images if no new one was uploaded and no field exists in request
        if (isset($existingContent['image_url']) && !isset($content['image'])) {
            $content['image_url'] = $existingContent['image_url'];
        } elseif (isset($content['image'])) {
            // "image" was the temporary key from frontend FileUploadField
            $content['image_url'] = $content['image'];
            unset($content['image']);
        }

        SchoolProfileSetting::updateOrCreate(
            ['section_key' => $sectionKey],
            ['content' => HtmlSanitizer::sanitizeSection($sectionKey, $content)]
        );

        return redirect()->back()->with('success', 'Konten profil berhasil diperbarui.');
    }
}
