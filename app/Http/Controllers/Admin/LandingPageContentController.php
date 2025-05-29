<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPageSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Helpers\ActivityLogger;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LandingPageContentController extends Controller
{
    // Tidak perlu getDefaults() lagi di sini, kita pakai dari model

    public function index()
    {
        $settingsFromDb = LandingPageSetting::all()->keyBy('section_key');
        $pageData = [];
        $sectionKeys = array_keys(LandingPageSetting::getSectionFields());

        foreach ($sectionKeys as $key) {
            $dbRow = $settingsFromDb->get($key);
            $dbContent = ($dbRow && isset($dbRow['content']) && is_array($dbRow['content'])) ? $dbRow['content'] : null;
            $pageData[$key] = LandingPageSetting::getContent($key, $dbContent);
        }
        // Log::info('Admin Landing Page Data to View:', $pageData);

        return Inertia::render('Admin/LandingPageContentPage', [
            'currentSettings' => $pageData,
        ]);
    }

    public function storeOrUpdate(Request $request)
    {
        $inputData = $request->all();
        $rules = [];
        $sectionFields = LandingPageSetting::getSectionFields(); // Ambil dari model
        $finalDataToSave = [];

        foreach ($sectionFields as $sectionKey => $fields) {
            if (isset($inputData[$sectionKey])) {
                $sectionRules = [];
                $currentSectionDataFromRequest = $inputData[$sectionKey];
                $dataForThisSection = [];

                // Bangun aturan validasi berdasarkan $fields
                if ($sectionKey === 'hero') {
                    $sectionRules["{$sectionKey}.title_line1"] = 'required|string|max:100';
                    $sectionRules["{$sectionKey}.title_line2"] = 'required|string|max:100';
                    $sectionRules["{$sectionKey}.background_image"] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
                } elseif ($sectionKey === 'about_lp') {
                    $sectionRules["{$sectionKey}.title"] = 'required|string|max:150';
                    $sectionRules["{$sectionKey}.description_html"] = 'required|string|max:5000';
                    $sectionRules["{$sectionKey}.image"] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
                } elseif ($sectionKey === 'kepsek_welcome_lp') {
                    $sectionRules["{$sectionKey}.title"] = 'required|string|max:150';
                    $sectionRules["{$sectionKey}.kepsek_name"] = 'required|string|max:100';
                    $sectionRules["{$sectionKey}.kepsek_title"] = 'required|string|max:100';
                    $sectionRules["{$sectionKey}.kepsek_image"] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
                    $sectionRules["{$sectionKey}.welcome_text_html"] = 'required|string|max:10000';
                } elseif ($sectionKey === 'fakta_lp') {
                    $sectionRules["{$sectionKey}.items"] = 'present|array';
                    $sectionRules["{$sectionKey}.items.*.label"] = 'required_with:'.$sectionKey.'.items.*.value|nullable|string|max:50';
                    $sectionRules["{$sectionKey}.items.*.value"] = 'required_with:'.$sectionKey.'.items.*.label|nullable|integer|min:0';
                }
                $rules = array_merge($rules, $sectionRules);

                // Ambil HANYA field yang didefinisikan di $sectionFields[$sectionKey]
                foreach ($fields as $field) {
                    if (isset($currentSectionDataFromRequest[$field])) {
                        if ($field === 'items' && $sectionKey === 'fakta_lp') {
                             // Filter item fakta yang valid (label atau value diisi)
                            $dataForThisSection[$field] = array_values(array_filter($currentSectionDataFromRequest[$field], function($item) {
                                return !empty(trim($item['label'] ?? '')) || !empty(trim($item['value'] ?? ''));
                            }));
                             // Jika setelah filter hasilnya array kosong, pastikan tetap array kosong
                            if(empty($dataForThisSection[$field])) $dataForThisSection[$field] = [];
                        } else {
                            $dataForThisSection[$field] = $currentSectionDataFromRequest[$field];
                        }
                    } else {
                        // Jika field tidak ada di request, ambil dari default untuk menjaga struktur
                        // Ini penting jika field bisa dikosongkan total di form
                        $defaultsForSection = LandingPageSetting::getDefaults($sectionKey);
                        $dataForThisSection[$field] = $defaultsForSection[$field] ?? null;
                    }
                }
                $finalDataToSave[$sectionKey] = $dataForThisSection;
            }
        }
        // Log::info('Data to validate: ', $inputData);
        // Log::info('Validation rules: ', $rules);


        $validator = Validator::make($inputData, $rules, [
            'fakta_lp.items.*.label.required_with' => 'Label fakta diperlukan jika angka diisi.',
            'fakta_lp.items.*.value.required_with' => 'Angka fakta diperlukan jika label diisi.',
        ]);

        if ($validator->fails()) {
            Log::warning('Validasi gagal untuk update Landing Page:', $validator->errors()->toArray());
            return back()->withErrors($validator)->withInput();
        }
        
        // $validatedData = $validator->validated(); // Ini akan mengambil semua data yang tervalidasi
        // Kita akan menggunakan $finalDataToSave yang sudah difilter fieldnya

        try {
            foreach ($finalDataToSave as $sectionKey => $content) {
                // Handle file uploads for each section
                if ($sectionKey === 'hero' && $request->hasFile('hero.background_image')) {
                    $file = $request->file('hero.background_image');
                    $fileName = time() . '_hero_bg_' . $file->getClientOriginalName();
                    $filePath = $file->storeAs('landing-page', $fileName, 'public');
                    
                    // Delete old file if exists
                    $existingContent = LandingPageSetting::where('section_key', $sectionKey)->first();
                    if ($existingContent && isset($existingContent->content['background_image_url'])) {
                        $oldFilePath = str_replace('/storage/', '', $existingContent->content['background_image_url']);
                        Storage::disk('public')->delete($oldFilePath);
                    }
                    
                    $content['background_image_url'] = '/storage/' . $filePath;
                } elseif ($sectionKey === 'about_lp' && $request->hasFile('about_lp.image')) {
                    $file = $request->file('about_lp.image');
                    $fileName = time() . '_about_' . $file->getClientOriginalName();
                    $filePath = $file->storeAs('landing-page', $fileName, 'public');
                    
                    // Delete old file if exists
                    $existingContent = LandingPageSetting::where('section_key', $sectionKey)->first();
                    if ($existingContent && isset($existingContent->content['image_url'])) {
                        $oldFilePath = str_replace('/storage/', '', $existingContent->content['image_url']);
                        Storage::disk('public')->delete($oldFilePath);
                    }
                    
                    $content['image_url'] = '/storage/' . $filePath;
                } elseif ($sectionKey === 'kepsek_welcome_lp' && $request->hasFile('kepsek_welcome_lp.kepsek_image')) {
                    $file = $request->file('kepsek_welcome_lp.kepsek_image');
                    $fileName = time() . '_kepsek_' . $file->getClientOriginalName();
                    $filePath = $file->storeAs('landing-page', $fileName, 'public');
                    
                    // Delete old file if exists
                    $existingContent = LandingPageSetting::where('section_key', $sectionKey)->first();
                    if ($existingContent && isset($existingContent->content['kepsek_image_url'])) {
                        $oldFilePath = str_replace('/storage/', '', $existingContent->content['kepsek_image_url']);
                        Storage::disk('public')->delete($oldFilePath);
                    }
                    
                    $content['kepsek_image_url'] = '/storage/' . $filePath;
                }

                // Pastikan content adalah array dan bukan null sebelum menyimpan
                if (is_array($content)) {
                    LandingPageSetting::updateOrCreate(
                        ['section_key' => $sectionKey],
                        ['content' => $content]
                    );
                } else {
                    Log::warning("Konten untuk section {$sectionKey} bukan array, tidak disimpan.", ['content' => $content]);
                }
            }

            ActivityLogger::log("Update Konten Landing Page", "Semua section Landing Page telah diperbarui.", $request);

            return redirect()->route('admin.landingpage.content.index')
                             ->with('success', "Konten Landing Page berhasil diperbarui!");

        } catch (\Exception $e) {
            Log::error("Error updating landing page content: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->withErrors(['general' => 'Gagal memperbarui konten: ' . $e->getMessage()])->withInput();
        }
    }
}