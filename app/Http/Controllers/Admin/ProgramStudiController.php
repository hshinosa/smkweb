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
            $settingsFromDb = ProgramStudiSetting::where("program_name", $programName)
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
            
            // Handle top-level files
            foreach ($fields as $fieldKey => $fieldType) {
                if ($fieldType === "image") {
                    if ($request->hasFile("{$sectionKey}.{$fieldKey}")) {
                        $file = $request->file("{$sectionKey}.{$fieldKey}");
                        $path = $file->store("program-studi", "public");
                        $content[$fieldKey] = "/storage/" . $path;
                    }
                }
            }

            // Handle lists with files
            if (isset($fields["items"]) && $fields["items"] === "list") {
                if (isset($content["items"]) && is_array($content["items"])) {
                    foreach ($content["items"] as $index => &$item) {
                        // Core Subjects Icon
                        if ($sectionKey === "core_subjects" && $request->hasFile("{$sectionKey}.items.{$index}.icon")) {
                             $file = $request->file("{$sectionKey}.items.{$index}.icon");
                             $path = $file->store("program-studi/icons", "public");
                             $item["icon"] = "/storage/" . $path;
                        }
                        
                        // Facilities Image
                        if ($sectionKey === "facilities" && $request->hasFile("{$sectionKey}.items.{$index}.image")) {
                             $file = $request->file("{$sectionKey}.items.{$index}.image");
                             $path = $file->store("program-studi/facilities", "public");
                             $item["image"] = "/storage/" . $path;
                        }

                        // Career Paths Icon (if image)
                        if ($sectionKey === "career_paths" && $request->hasFile("{$sectionKey}.items.{$index}.icon")) {
                             $file = $request->file("{$sectionKey}.items.{$index}.icon");
                             $path = $file->store("program-studi/icons", "public");
                             $item["icon"] = "/storage/" . $path;
                        }
                    }
                }
            }

            // Save to DB
            ProgramStudiSetting::updateOrCreate(
                ["program_name" => $programName, "section_key" => $sectionKey],
                ["content" => $content]
            );
        }

        return back()->with("success", "Data berhasil disimpan.");
    }
}
