<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpmbSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Helpers\ActivityLogger;
use Illuminate\Support\Facades\Validator;

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
        }

        return Inertia::render('Admin/SpmbContentPage', [
            'currentSettings' => $pageData,
        ]);
    }

    public function storeOrUpdate(Request $request)
    {
        $inputData = $request->all();
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
                    $sectionRules["{$sectionKey}.description"] = 'required|string|max:5000';
                    $sectionRules["{$sectionKey}.banner_image_url"] = 'nullable|string|max:255';
                    $sectionRules["{$sectionKey}.registration_open"] = 'required|boolean';
                    $sectionRules["{$sectionKey}.announcement"] = 'nullable|string|max:2000';
                } elseif ($sectionKey === 'jalur_pendaftaran') {
                    $sectionRules["{$sectionKey}.regular"] = 'present|array';
                    $sectionRules["{$sectionKey}.regular.description"] = 'required|string|max:2000';
                    $sectionRules["{$sectionKey}.regular.quota"] = 'required|integer|min:0';
                    $sectionRules["{$sectionKey}.regular.requirements"] = 'present|array';
                    $sectionRules["{$sectionKey}.regular.requirements.*"] = 'required|string|max:500';
                    $sectionRules["{$sectionKey}.prestasi"] = 'present|array';
                    $sectionRules["{$sectionKey}.prestasi.description"] = 'required|string|max:2000';
                    $sectionRules["{$sectionKey}.prestasi.quota"] = 'required|integer|min:0';
                    $sectionRules["{$sectionKey}.prestasi.requirements"] = 'present|array';
                    $sectionRules["{$sectionKey}.prestasi.requirements.*"] = 'required|string|max:500';
                } elseif ($sectionKey === 'jadwal_penting') {
                    $sectionRules["{$sectionKey}.events"] = 'present|array';
                    $sectionRules["{$sectionKey}.events.*.title"] = 'required_with:'.$sectionKey.'.events.*.date|nullable|string|max:200';
                    $sectionRules["{$sectionKey}.events.*.date"] = 'required_with:'.$sectionKey.'.events.*.title|nullable|date';
                    $sectionRules["{$sectionKey}.events.*.description"] = 'nullable|string|max:1000';
                } elseif ($sectionKey === 'persyaratan') {
                    $sectionRules["{$sectionKey}.documents"] = 'present|array';
                    $sectionRules["{$sectionKey}.documents.*.name"] = 'required_with:'.$sectionKey.'.documents.*.description|nullable|string|max:200';
                    $sectionRules["{$sectionKey}.documents.*.description"] = 'required_with:'.$sectionKey.'.documents.*.name|nullable|string|max:1000';
                    $sectionRules["{$sectionKey}.documents.*.required"] = 'required_with:'.$sectionKey.'.documents.*.name|nullable|boolean';
                    $sectionRules["{$sectionKey}.additional_notes"] = 'nullable|string|max:2000';
                } elseif ($sectionKey === 'prosedur') {
                    $sectionRules["{$sectionKey}.steps"] = 'present|array';
                    $sectionRules["{$sectionKey}.steps.*.title"] = 'required_with:'.$sectionKey.'.steps.*.description|nullable|string|max:200';
                    $sectionRules["{$sectionKey}.steps.*.description"] = 'required_with:'.$sectionKey.'.steps.*.title|nullable|string|max:1000';
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
                        if (in_array($field, ['events', 'documents', 'steps', 'items']) && is_array($currentSectionDataFromRequest[$field])) {
                            // Filter out empty items for array fields
                            $dataForThisSection[$field] = array_values(array_filter($currentSectionDataFromRequest[$field], function($item) use ($field) {
                                if ($field === 'events') {
                                    return !empty(trim($item['title'] ?? '')) || !empty(trim($item['date'] ?? ''));
                                } elseif ($field === 'documents') {
                                    return !empty(trim($item['name'] ?? '')) || !empty(trim($item['description'] ?? ''));
                                } elseif ($field === 'steps') {
                                    return !empty(trim($item['title'] ?? '')) || !empty(trim($item['description'] ?? ''));
                                } elseif ($field === 'items') {
                                    return !empty(trim($item['question'] ?? '')) || !empty(trim($item['answer'] ?? ''));
                                }
                                return true;
                            }));
                            // Ensure empty arrays remain as arrays
                            if(empty($dataForThisSection[$field])) $dataForThisSection[$field] = [];
                        } elseif ($field === 'requirements' && is_array($currentSectionDataFromRequest[$field])) {
                            // Filter out empty requirements
                            $dataForThisSection[$field] = array_values(array_filter($currentSectionDataFromRequest[$field], function($requirement) {
                                return !empty(trim($requirement ?? ''));
                            }));
                            if(empty($dataForThisSection[$field])) $dataForThisSection[$field] = [];
                        } else {
                            $dataForThisSection[$field] = $currentSectionDataFromRequest[$field];
                        }
                    } else {
                        // If field is not in request, get from defaults to maintain structure
                        $defaultsForSection = SpmbSetting::getDefaults($sectionKey);
                        $dataForThisSection[$field] = $defaultsForSection[$field] ?? null;
                    }
                }
                $finalDataToSave[$sectionKey] = $dataForThisSection;
            }
        }

        $validator = Validator::make($inputData, $rules, [
            'jadwal_penting.events.*.title.required_with' => 'Judul kegiatan diperlukan jika tanggal diisi.',
            'jadwal_penting.events.*.date.required_with' => 'Tanggal kegiatan diperlukan jika judul diisi.',
            'persyaratan.documents.*.name.required_with' => 'Nama dokumen diperlukan jika deskripsi diisi.',
            'persyaratan.documents.*.description.required_with' => 'Deskripsi dokumen diperlukan jika nama diisi.',
            'prosedur.steps.*.title.required_with' => 'Judul langkah diperlukan jika deskripsi diisi.',
            'prosedur.steps.*.description.required_with' => 'Deskripsi langkah diperlukan jika judul diisi.',
            'faq.items.*.question.required_with' => 'Pertanyaan diperlukan jika jawaban diisi.',
            'faq.items.*.answer.required_with' => 'Jawaban diperlukan jika pertanyaan diisi.',
        ]);

        if ($validator->fails()) {
            Log::warning('Validasi gagal untuk update SPMB:', $validator->errors()->toArray());
            return back()->withErrors($validator)->withInput();
        }

        try {
            foreach ($finalDataToSave as $sectionKey => $content) {
                // Ensure content is array and not null before saving
                if (is_array($content)) {
                    SpmbSetting::updateOrCreate(
                        ['section_key' => $sectionKey],
                        ['content' => $content]
                    );
                } else {
                    Log::warning("Konten untuk section {$sectionKey} bukan array, tidak disimpan.", ['content' => $content]);
                }
            }

            ActivityLogger::log("Update Konten SPMB", "Semua section SPMB telah diperbarui.", $request);

            return redirect()->route('admin.spmb.content.index')
                             ->with('success', "Konten SPMB berhasil diperbarui!");

        } catch (\Exception $e) {
            Log::error("Error updating SPMB content: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->withErrors(['general' => 'Gagal memperbarui konten: ' . $e->getMessage()])->withInput();
        }
    }
}
