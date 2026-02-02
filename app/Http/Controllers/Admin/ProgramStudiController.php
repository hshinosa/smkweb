<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProgramStudiSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProgramStudiController extends Controller
{
    public function index(Request $request)
    {
        $programName = $request->query("program", "mipa"); // Default to mipa
        
        // Validate program name
        if (!in_array($programName, ["mipa", "ips", "bahasa"])) {
            return redirect()->route("admin.program-studi.index", ["program" => "mipa"]);
        }

        try {
            $settingsFromDb = ProgramStudiSetting::with('media')->where("program_name", $programName)
                ->get()
                ->keyBy("section_key");
            
            // Get thumbnail_card from any row (should be consistent per program)
            $heroSetting = $settingsFromDb->get('hero');
            $thumbnailCardUrl = null;
            
            if ($heroSetting) {
                $mediaUrl = $heroSetting->getFirstMediaUrl('thumbnail_card');
                if ($mediaUrl) {
                    $thumbnailCardUrl = $mediaUrl;
                } elseif ($heroSetting->thumbnail_card_url) {
                    // Fallback to stored path if media URL not found
                    $thumbnailCardUrl = asset($heroSetting->thumbnail_card_url);
                }
            }
            
            $pageData = [];
            $sectionKeys = array_keys(ProgramStudiSetting::getSectionFields());

            foreach ($sectionKeys as $key) {
                $dbRow = $settingsFromDb->get($key);
                $dbContent = ($dbRow && isset($dbRow["content"]) && is_array($dbRow["content"])) ? $dbRow["content"] : null;
                $pageData[$key] = ProgramStudiSetting::getContent($key, $dbContent);

                // Override image URLs with actual Media Library URLs
                if ($dbRow) {
                    // Handle top-level images
                    if ($key === 'hero') {
                        $mediaUrl = $dbRow->getFirstMediaUrl('hero_background_image');
                        if ($mediaUrl) $pageData[$key]['background_image'] = $mediaUrl;
                    }
                    
                    if ($key === 'facilities') {
                        $mediaUrl = $dbRow->getFirstMediaUrl('facilities_main_image');
                        if ($mediaUrl) $pageData[$key]['main_image'] = $mediaUrl;
                    }
                    
                    if ($key === 'alumni_spotlight') {
                        $mediaUrl = $dbRow->getFirstMediaUrl('alumni_spotlight_image');
                        if ($mediaUrl) $pageData[$key]['image'] = $mediaUrl;
                    }

                    // Handle nested list images (e.g. facilities, core_subjects)
                    if (isset($pageData[$key]['items']) && is_array($pageData[$key]['items'])) {
                        foreach ($pageData[$key]['items'] as $index => &$item) {
                            // Core Subjects Icon
                            if ($key === 'core_subjects') {
                                $mediaUrl = $dbRow->getFirstMediaUrl("core_subjects_item_{$index}_icon");
                                if ($mediaUrl) $item['icon'] = $mediaUrl;
                            }
                            // Facilities Image
                            if ($key === 'facilities') {
                                $mediaUrl = $dbRow->getFirstMediaUrl("facilities_item_{$index}_image");
                                if ($mediaUrl) $item['image'] = $mediaUrl;
                            }
                            // Career Paths Icon
                            if ($key === 'career_paths') {
                                $mediaUrl = $dbRow->getFirstMediaUrl("career_paths_item_{$index}_icon");
                                if ($mediaUrl) $item['icon'] = $mediaUrl;
                            }
                        }
                    }
                }
            }

            return Inertia::render("Admin/ProgramStudi/Index", [
                "currentSettings" => $pageData,
                "activeProgram" => $programName,
                "thumbnailCardUrl" => $thumbnailCardUrl, // For landing page card
            ]);
        } catch (\Exception $e) {
            Log::error("Error in ProgramStudiController@index: " . $e->getMessage(), [
                "trace" => $e->getTraceAsString()
            ]);
            return back()->withErrors(["general" => "Gagal memuat data: " . $e->getMessage()]);
        }
    }

    public function storeOrUpdate(Request $request)
    {
        $programName = $request->input("program_name");
        
        if (!in_array($programName, ["mipa", "ips", "bahasa"])) {
            return back()->withErrors(["general" => "Program studi tidak valid."]);
        }

        // Handle thumbnail_card upload for landing page
        if ($request->hasFile('thumbnail_card')) {
            $heroSetting = ProgramStudiSetting::firstOrCreate([
                'program_name' => $programName, 
                'section_key' => 'hero'
            ]);
            
            $file = $request->file('thumbnail_card');
            $heroSetting->clearMediaCollection('thumbnail_card');
            $heroSetting->addMedia($file)->toMediaCollection('thumbnail_card');
        }

        $sectionFields = ProgramStudiSetting::getSectionFields();
        
        foreach ($sectionFields as $sectionKey => $fields) {
            if (!$request->has($sectionKey)) continue;

            $content = $request->input($sectionKey);
            $setting = ProgramStudiSetting::firstOrNew(['program_name' => $programName, 'section_key' => $sectionKey]);
            
            // Get existing content to preserve images/data
            $existingContent = $setting->content ?? [];
            
            // Save the setting first to ensure it has an ID for media library
            if (!$setting->exists) {
                $setting->content = $content;
                $setting->save();
            }
            
            // Handle top-level files (background_image, main_image, image, etc.)
            foreach ($fields as $fieldKey => $fieldType) {
                if ($fieldType === "image") {
                    if ($request->hasFile("{$sectionKey}.{$fieldKey}")) {
                        $collection = $sectionKey . '_' . $fieldKey;
                        $setting->clearMediaCollection($collection);
                        $setting->addMediaFromRequest("{$sectionKey}.{$fieldKey}")->toMediaCollection($collection);
                        
                        $mediaUrl = $setting->getFirstMediaUrl($collection);
                        if ($mediaUrl) {
                            $content[$fieldKey] = parse_url($mediaUrl, PHP_URL_PATH);
                        }
                    } else {
                        // Preserve existing image if no new upload
                        if (isset($existingContent[$fieldKey])) {
                            $content[$fieldKey] = $existingContent[$fieldKey];
                        }
                    }
                }
            }

            // Handle lists with files
            if (isset($fields["items"]) && $fields["items"] === "list") {
                if (isset($content["items"]) && is_array($content["items"])) {
                    // Get existing content to preserve images
                    $existingContent = $setting->content ?? [];
                    
                    foreach ($content["items"] as $index => &$item) {
                        // Core Subjects Icon
                        if ($sectionKey === "core_subjects") {
                            if ($request->hasFile("{$sectionKey}.items.{$index}.icon")) {
                                $collection = "{$sectionKey}_item_{$index}_icon";
                                $setting->clearMediaCollection($collection);
                                $setting->addMediaFromRequest("{$sectionKey}.items.{$index}.icon")->toMediaCollection($collection);
                                
                                $mediaUrl = $setting->getFirstMediaUrl($collection);
                                if ($mediaUrl) $item["icon"] = parse_url($mediaUrl, PHP_URL_PATH);
                            } else {
                                // Preserve existing icon if no new upload
                                if (isset($existingContent["items"][$index]["icon"])) {
                                    $item["icon"] = $existingContent["items"][$index]["icon"];
                                }
                            }
                        }
                        
                        // Facilities Image
                        if ($sectionKey === "facilities") {
                            if ($request->hasFile("{$sectionKey}.items.{$index}.image")) {
                                $collection = "{$sectionKey}_item_{$index}_image";
                                $setting->clearMediaCollection($collection);
                                $setting->addMediaFromRequest("{$sectionKey}.items.{$index}.image")->toMediaCollection($collection);
                                
                                $mediaUrl = $setting->getFirstMediaUrl($collection);
                                if ($mediaUrl) $item["image"] = parse_url($mediaUrl, PHP_URL_PATH);
                            } else {
                                // Preserve existing image if no new upload
                                if (isset($existingContent["items"][$index]["image"])) {
                                    $item["image"] = $existingContent["items"][$index]["image"];
                                }
                            }
                        }

                        // Career Paths Icon
                        if ($sectionKey === "career_paths") {
                            if ($request->hasFile("{$sectionKey}.items.{$index}.icon")) {
                                $collection = "{$sectionKey}_item_{$index}_icon";
                                $setting->clearMediaCollection($collection);
                                $setting->addMediaFromRequest("{$sectionKey}.items.{$index}.icon")->toMediaCollection($collection);
                                
                                $mediaUrl = $setting->getFirstMediaUrl($collection);
                                if ($mediaUrl) $item["icon"] = parse_url($mediaUrl, PHP_URL_PATH);
                            } else {
                                // Preserve existing icon if no new upload
                                if (isset($existingContent["items"][$index]["icon"])) {
                                    $item["icon"] = $existingContent["items"][$index]["icon"];
                                }
                            }
                        }
                    }
                }
            }

            // Save to DB
            $setting->content = $content;
            $setting->save();
        }

        return back()->with("success", "Data berhasil disimpan.");
    }
}
