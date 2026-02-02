<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Helpers\HtmlSanitizer;
use App\Http\Controllers\Controller;
use App\Models\SpmbSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SpmbContentController extends Controller
{
    public function index()
    {
        $settingsFromDb = SpmbSetting::all()->keyBy('section_key');
        $pageData = [];
        $sectionKeys = array_keys(SpmbSetting::getSectionFields());

        foreach ($sectionKeys as $key) {
            $dbRow = $settingsFromDb->get($key);
            $dbContent = ($dbRow && isset($dbRow['content']) && is_array($dbRow['content'])) ? $dbRow['content'] : null;
            $pageData[$key] = SpmbSetting::getContent($key, $dbContent);

            // Override banner_image_url with actual Media Library URL if available
            if ($key === 'pengaturan_umum' && $dbRow) {
                $mediaUrl = $dbRow->getFirstMediaUrl('banner_image');
                if ($mediaUrl) {
                    $pageData[$key]['banner_image_url'] = $mediaUrl;
                }
            }
        }

        return Inertia::render('Admin/SpmbContentPage', [
            'currentSettings' => $pageData,
            'activeSection' => request('section', 'pengaturan_umum'), // Capture section passed from redirect
        ]);
    }

    public function storeOrUpdate(Request $request)
    {
        $inputData = $request->all();
        Log::info('SPMB Update Input Data Raw:', $inputData);

        // Determine which section is being updated to preserve it after redirect
        $targetSection = 'pengaturan_umum';
        // Priority check based on keys in request.
        // Note: The request structure might contain keys for multiple sections or just one.
        // Assuming the form submission structure from the frontend, we can infer the section.
        if (isset($inputData['pengaturan_umum'])) $targetSection = 'pengaturan_umum';
        elseif (isset($inputData['jalur_pendaftaran'])) $targetSection = 'jalur_pendaftaran';
        elseif (isset($inputData['jadwal_penting'])) $targetSection = 'jadwal_penting';
        elseif (isset($inputData['persyaratan'])) $targetSection = 'persyaratan';
        elseif (isset($inputData['prosedur'])) $targetSection = 'prosedur';
        elseif (isset($inputData['faq'])) $targetSection = 'faq';

        // Preprocess FormData inputs (strings -> arrays/booleans)
        // 1. Handle Boolean fields
        if (isset($inputData['pengaturan_umum']['is_registration_open'])) {
            $val = $inputData['pengaturan_umum']['is_registration_open'];
            // filter_var handles "true", "false", "1", "0", "on", "off"
            $inputData['pengaturan_umum']['is_registration_open'] = filter_var($val, FILTER_VALIDATE_BOOLEAN);
        }

        // 2. Handle JSON encoded fields (arrays sent as strings)
        $sectionsWithItems = ['jalur_pendaftaran', 'jadwal_penting', 'persyaratan', 'prosedur', 'faq'];
        foreach ($sectionsWithItems as $section) {
            if (isset($inputData[$section])) {
                // Decode 'items'
                if (isset($inputData[$section]['items']) && is_string($inputData[$section]['items'])) {
                    $decoded = json_decode($inputData[$section]['items'], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $inputData[$section]['items'] = $decoded;
                    } else {
                        Log::error("Failed to decode JSON for {$section}.items: " . json_last_error_msg());
                        // Fallback to empty array to avoid validation "must be array" error on string
                        $inputData[$section]['items'] = [];
                    }
                }
            }
        }

        // 3. Cleanup: Ensure empty arrays are actually empty arrays, not null
        foreach ($sectionsWithItems as $section) {
            if (!isset($inputData[$section]['items']) || $inputData[$section]['items'] === null) {
                $inputData[$section]['items'] = [];
            }
        }
        
        $rules = [];
        $sectionFields = SpmbSetting::getSectionFields();
        $finalDataToSave = [];

        foreach ($sectionFields as $sectionKey => $fields) {
            if (isset($inputData[$sectionKey])) {
                $sectionRules = [];
                $currentSectionDataFromRequest = $inputData[$sectionKey];
                $dataForThisSection = [];

                // Build validation rules based on section
                if ($sectionKey === 'pengaturan_umum') {
                    $sectionRules["{$sectionKey}.title"] = 'required|string|max:200';
                    $sectionRules["{$sectionKey}.description_html"] = 'required|string|max:5000';
                    $sectionRules["{$sectionKey}.banner_image_url"] = 'nullable|string|max:255';
                    $sectionRules["{$sectionKey}.banner_image_file"] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:10240';
                    $sectionRules["{$sectionKey}.whatsapp_number"] = 'nullable|string|max:20';
                    $sectionRules["{$sectionKey}.video_guide_url"] = 'nullable|string|max:255';
                    $sectionRules["{$sectionKey}.is_registration_open"] = 'required|boolean';
                    $sectionRules["{$sectionKey}.registration_year"] = 'required|string|max:20';
                    $sectionRules["{$sectionKey}.announcement_text"] = 'nullable|string|max:2000';
                } elseif ($sectionKey === 'jalur_pendaftaran') {
                    $sectionRules["{$sectionKey}.items"] = 'present|array';
                    $sectionRules["{$sectionKey}.items.*.label"] = 'required|string|max:200';
                    $sectionRules["{$sectionKey}.items.*.description"] = 'required|string|max:2000';
                    $sectionRules["{$sectionKey}.items.*.quota"] = 'required|string|max:50';
                    $sectionRules["{$sectionKey}.items.*.requirements"] = 'present|array';
                    $sectionRules["{$sectionKey}.items.*.requirements.*"] = 'required|string|max:500';
                } elseif ($sectionKey === 'jadwal_penting') {
                    $sectionRules["{$sectionKey}.items"] = 'present|array';
                    $sectionRules["{$sectionKey}.items.*.title"] = 'required_with:'.$sectionKey.'.items.*.date|nullable|string|max:200';
                    $sectionRules["{$sectionKey}.items.*.date"] = 'required_with:'.$sectionKey.'.items.*.title|nullable|date';
                    $sectionRules["{$sectionKey}.items.*.description"] = 'nullable|string|max:1000';
                } elseif ($sectionKey === 'persyaratan') {
                    $sectionRules["{$sectionKey}.items"] = 'present|array';
                    $sectionRules["{$sectionKey}.items.*.name"] = 'required_with:'.$sectionKey.'.items.*.description|nullable|string|max:200';
                    $sectionRules["{$sectionKey}.items.*.description"] = 'required_with:'.$sectionKey.'.items.*.name|nullable|string|max:1000';
                    $sectionRules["{$sectionKey}.items.*.required"] = 'required_with:'.$sectionKey.'.items.*.name|nullable|boolean';
                    $sectionRules["{$sectionKey}.additional_notes"] = 'nullable|string|max:2000';
                } elseif ($sectionKey === 'prosedur') {
                    $sectionRules["{$sectionKey}.items"] = 'present|array';
                    $sectionRules["{$sectionKey}.items.*.title"] = 'required_with:'.$sectionKey.'.items.*.description|nullable|string|max:200';
                    $sectionRules["{$sectionKey}.items.*.description"] = 'required_with:'.$sectionKey.'.items.*.title|nullable|string|max:1000';
                    $sectionRules["{$sectionKey}.contact_info"] = 'nullable|string|max:2000';
                } elseif ($sectionKey === 'faq') {
                    $sectionRules["{$sectionKey}.items"] = 'present|array';
                    $sectionRules["{$sectionKey}.items.*.question"] = 'required_with:'.$sectionKey.'.items.*.answer|nullable|string|max:500';
                    $sectionRules["{$sectionKey}.items.*.answer"] = 'required_with:'.$sectionKey.'.items.*.question|nullable|string|max:2000';
                }
                $rules = array_merge($rules, $sectionRules);

                // Collect only fields defined in $sectionFields[$sectionKey]
                foreach ($fields as $field) {
                    if (isset($currentSectionDataFromRequest[$field])) {
                        if ($field === 'items' && is_array($currentSectionDataFromRequest[$field])) {
                            // Filter out empty items for array fields
                            $dataForThisSection[$field] = array_values(array_filter($currentSectionDataFromRequest[$field], function ($item) use ($sectionKey) {
                                if ($sectionKey === 'jadwal_penting') {
                                    return ! empty(trim($item['title'] ?? '')) || ! empty(trim($item['date'] ?? ''));
                                } elseif ($sectionKey === 'persyaratan') {
                                    return ! empty(trim($item['name'] ?? '')) || ! empty(trim($item['description'] ?? ''));
                                } elseif ($sectionKey === 'prosedur') {
                                    return ! empty(trim($item['title'] ?? '')) || ! empty(trim($item['description'] ?? ''));
                                } elseif ($sectionKey === 'faq') {
                                    return ! empty(trim($item['question'] ?? ''));
                                } elseif ($sectionKey === 'jalur_pendaftaran') {
                                    return ! empty(trim($item['label'] ?? ''));
                                }
                                return true;
                            }));
                            
                            // Ensure empty arrays remain as arrays
                            if (empty($dataForThisSection[$field])) {
                                $dataForThisSection[$field] = [];
                            }
                        } elseif ($field === 'requirements' && is_array($currentSectionDataFromRequest[$field])) {
                            // Filter out empty requirements (for jalur_pendaftaran items)
                            $dataForThisSection[$field] = array_values(array_filter($currentSectionDataFromRequest[$field], function ($requirement) {
                                return ! empty(trim($requirement ?? ''));
                            }));
                            if (empty($dataForThisSection[$field])) {
                                $dataForThisSection[$field] = [];
                            }
                        } else {
                            $dataForThisSection[$field] = $currentSectionDataFromRequest[$field];
                        }
                    } else {
                        // If field is not in request, get from defaults to maintain structure
                        $defaultsForSection = SpmbSetting::getDefaults($sectionKey);
                        $dataForThisSection[$field] = $defaultsForSection[$field] ?? null;
                    }
                }
                $finalDataToSave[$sectionKey] = HtmlSanitizer::sanitizeSection($sectionKey, $dataForThisSection);
            }
        }

        $validator = Validator::make($inputData, $rules, [
            'jadwal_penting.items.*.title.required_with' => 'Judul kegiatan diperlukan jika tanggal diisi.',
            'jadwal_penting.items.*.date.required_with' => 'Tanggal kegiatan diperlukan jika judul diisi.',
            'persyaratan.items.*.name.required_with' => 'Nama dokumen diperlukan jika deskripsi diisi.',
            'persyaratan.items.*.description.required_with' => 'Deskripsi dokumen diperlukan jika nama diisi.',
            'prosedur.items.*.title.required_with' => 'Judul langkah diperlukan jika deskripsi diisi.',
            'prosedur.items.*.description.required_with' => 'Deskripsi langkah diperlukan jika judul diisi.',
            'faq.items.*.question.required_with' => 'Pertanyaan diperlukan jika jawaban diisi.',
            'faq.items.*.answer.required_with' => 'Jawaban diperlukan jika pertanyaan diisi.',
        ]);

        if ($validator->fails()) {
            Log::warning('Validasi gagal untuk update SPMB:', $validator->errors()->toArray());

            return back()->withErrors($validator)->withInput();
        }

        try {
            foreach ($finalDataToSave as $sectionKey => $content) {
                $setting = SpmbSetting::firstOrNew(['section_key' => $sectionKey]);
                
                // Save first if new to ensure it has an ID for media library
                if (!$setting->exists) {
                    $setting->content = $content;
                    $setting->save();
                }
                
                // Handle Media Uploads for Pengaturan Umum
                if ($sectionKey === 'pengaturan_umum') {
                    // Check for file upload
                    $fileKey = "{$sectionKey}.banner_image_file";
                    
                    if ($request->hasFile($fileKey)) {
                        // Clear existing media and add new one
                        $setting->clearMediaCollection('banner_image');
                        $setting->addMediaFromRequest($fileKey)->toMediaCollection('banner_image');
                        
                        // Get the Media Library URL (this will use the CustomPathGenerator)
                        // Store the full URL in the database so we can reference it
                        $mediaUrl = $setting->getFirstMediaUrl('banner_image');
                        if ($mediaUrl) {
                            // Extract relative path from full URL for storage
                            $content['banner_image_url'] = parse_url($mediaUrl, PHP_URL_PATH);
                        }
                    }
                }

                // Ensure content is array and not null before saving
                if (is_array($content)) {
                    $setting->content = $content;
                    $setting->save();
                } else {
                    Log::warning("Konten untuk section {$sectionKey} bukan array, tidak disimpan.", ['content' => $content]);
                }
            }

            ActivityLogger::log('Update Konten SPMB', 'Semua section SPMB telah diperbarui.', $request);

            return redirect()->route('admin.spmb.index', ['section' => $targetSection])
                ->with('success', 'Konten SPMB berhasil diperbarui!');

        } catch (\Exception $e) {
            Log::error('Error updating SPMB content: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return back()->withErrors(['general' => 'Gagal memperbarui konten: '.$e->getMessage()])->withInput();
        }
    }
}
