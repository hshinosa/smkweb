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
            
            $pageData = [];
            $sectionKeys = array_keys(ProgramStudiSetting::getSectionFields());

            foreach ($sectionKeys as $key) {
                $dbRow = $settingsFromDb->get($key);
                $dbContent = ($dbRow && isset($dbRow["content"]) && is_array($dbRow["content"])) ? $dbRow["content"] : null;
                $pageData[$key] = ProgramStudiSetting::getContent($key, $dbContent);
            }

            return Inertia::render("Admin/ProgramStudi/Index", [
                "currentSettings" => $pageData,
                "activeProgram" => $programName,
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

        $sectionFields = ProgramStudiSetting::getSectionFields();
        
        foreach ($sectionFields as $sectionKey => $fields) {
            if (!$request->has($sectionKey)) continue;

            $content = $request->input($sectionKey);
            $setting = ProgramStudiSetting::firstOrNew(['program_name' => $programName, 'section_key' => $sectionKey]);
            
            // Handle top-level files
            foreach ($fields as $fieldKey => $fieldType) {
                if ($fieldType === "image") {
                    if ($request->hasFile("{$sectionKey}.{$fieldKey}")) {
                        $collection = $sectionKey . '_' . $fieldKey;
                        $setting->clearMediaCollection($collection);
                        $setting->addMediaFromRequest("{$sectionKey}.{$fieldKey}")->toMediaCollection($collection);
                        $media = $setting->getMedia($collection)->last();
                        if ($media) {
                            $content[$fieldKey] = '/storage/' . $media->id . '/' . $media->file_name;
                        }
                    }
                }
            }

            // Handle lists with files
            if (isset($fields["items"]) && $fields["items"] === "list") {
                if (isset($content["items"]) && is_array($content["items"])) {
                    foreach ($content["items"] as $index => &$item) {
                        // Core Subjects Icon
                        if ($sectionKey === "core_subjects" && $request->hasFile("{$sectionKey}.items.{$index}.icon")) {
                             $collection = "{$sectionKey}_item_{$index}_icon";
                             $setting->clearMediaCollection($collection);
                             $setting->addMediaFromRequest("{$sectionKey}.items.{$index}.icon")->toMediaCollection($collection);
                             $media = $setting->getMedia($collection)->last();
                             if ($media) $item["icon"] = '/storage/' . $media->id . '/' . $media->file_name;
                        }
                        
                        // Facilities Image
                        if ($sectionKey === "facilities" && $request->hasFile("{$sectionKey}.items.{$index}.image")) {
                             $collection = "{$sectionKey}_item_{$index}_image";
                             $setting->clearMediaCollection($collection);
                             $setting->addMediaFromRequest("{$sectionKey}.items.{$index}.image")->toMediaCollection($collection);
                             $media = $setting->getMedia($collection)->last();
                             if ($media) $item["image"] = '/storage/' . $media->id . '/' . $media->file_name;
                        }

                        // Career Paths Icon (if image)
                        if ($sectionKey === "career_paths" && $request->hasFile("{$sectionKey}.items.{$index}.icon")) {
                             $collection = "{$sectionKey}_item_{$index}_icon";
                             $setting->clearMediaCollection($collection);
                             $setting->addMediaFromRequest("{$sectionKey}.items.{$index}.icon")->toMediaCollection($collection);
                             $media = $setting->getMedia($collection)->last();
                             if ($media) $item["icon"] = '/storage/' . $media->id . '/' . $media->file_name;
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
