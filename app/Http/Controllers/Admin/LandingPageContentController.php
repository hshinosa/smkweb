<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Helpers\HtmlSanitizer;
use App\Http\Controllers\Controller;
use App\Models\LandingPageSetting;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LandingPageContentController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }
    // Tidak perlu getDefaults() lagi di sini, kita pakai dari model

    public function index()
    {
        try {
            $settingsFromDb = LandingPageSetting::with('media')->get()->keyBy('section_key');
            $pageData = [];
            $sectionKeys = array_keys(LandingPageSetting::getSectionFields());

            foreach ($sectionKeys as $key) {
                $dbRow = $settingsFromDb->get($key);
                $dbContent = ($dbRow && isset($dbRow['content']) && is_array($dbRow['content'])) ? $dbRow['content'] : null;
                $content = LandingPageSetting::getContent($key, $dbContent);

                // Inject Media Library data if available
                if ($dbRow) {
                    if ($key === 'hero') {
                        $bgMedia = $this->imageService->getFirstMediaData($dbRow, 'hero_background');
                        if ($bgMedia) $content['backgroundImage'] = $bgMedia;

                        $studentMedia = $this->imageService->getFirstMediaData($dbRow, 'hero_student');
                        if ($studentMedia) $content['studentImage'] = $studentMedia;
                    } elseif ($key === 'about_lp') {
                        $aboutMedia = $this->imageService->getFirstMediaData($dbRow, 'about_image');
                        if ($aboutMedia) $content['aboutImage'] = $aboutMedia;
                    } elseif ($key === 'kepsek_welcome_lp') {
                        $kepsekMedia = $this->imageService->getFirstMediaData($dbRow, 'kepsek_image');
                        if ($kepsekMedia) $content['kepsekImage'] = $kepsekMedia;
                    }
                }

                $pageData[$key] = $content;
            }
            // Log::info('Admin Landing Page Data to View:', $pageData);

            return Inertia::render('Admin/LandingPageContentPage', [
                'currentSettings' => $pageData,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in LandingPageContentController@index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['general' => 'Gagal memuat data: ' . $e->getMessage()]);
        }
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
                    $sectionRules["{$sectionKey}.hero_text"] = 'required|string|max:500';
                    $sectionRules["{$sectionKey}.background_image"] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
                    $sectionRules["{$sectionKey}.student_image"] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
                    $sectionRules["{$sectionKey}.stats"] = 'nullable|array';
                    $sectionRules["{$sectionKey}.stats.*.label"] = 'required|string|max:50';
                    $sectionRules["{$sectionKey}.stats.*.value"] = 'required|string|max:50';
                    $sectionRules["{$sectionKey}.stats.*.icon_name"] = 'required|string|max:50';
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
                } elseif ($sectionKey === 'programs_lp') {
                    $sectionRules["{$sectionKey}.title"] = 'required|string|max:150';
                    $sectionRules["{$sectionKey}.description"] = 'required|string|max:500';
                    // items is now managed separately
                } elseif ($sectionKey === 'gallery_lp') {
                    $sectionRules["{$sectionKey}.title"] = 'required|string|max:150';
                    $sectionRules["{$sectionKey}.description"] = 'required|string|max:500';
                    // images is now managed separately
                } elseif ($sectionKey === 'cta_lp') {
                    $sectionRules["{$sectionKey}.title"] = 'required|string|max:200';
                    $sectionRules["{$sectionKey}.description"] = 'required|string|max:500';
                }
                $rules = array_merge($rules, $sectionRules);

                // Ambil HANYA field yang didefinisikan di $sectionFields[$sectionKey]
                foreach ($fields as $field) {
                    if (isset($currentSectionDataFromRequest[$field])) {
                        if ($field === 'items' && $sectionKey === 'programs_lp') {
                            // Filter item yang valid
                            $dataForThisSection[$field] = array_values(array_filter($currentSectionDataFromRequest[$field], function ($item) {
                                return ! empty(trim($item['title'] ?? ''));
                            }));
                            // Jika setelah filter hasilnya array kosong, pastikan tetap array kosong
                            if (empty($dataForThisSection[$field])) {
                                $dataForThisSection[$field] = [];
                            }
                        } elseif ($field === 'images' && $sectionKey === 'gallery_lp') {
                            $dataForThisSection[$field] = array_values(array_filter($currentSectionDataFromRequest[$field], function ($url) {
                                return ! empty(trim($url));
                            }));
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
                $finalDataToSave[$sectionKey] = HtmlSanitizer::sanitizeSection($sectionKey, $dataForThisSection);
            }
        }
        // Log::info('Data to validate: ', $inputData);
        // Log::info('Validation rules: ', $rules);

        $validator = Validator::make($inputData, $rules);

        if ($validator->fails()) {
            Log::warning('Validasi gagal untuk update Landing Page:', $validator->errors()->toArray());

            return back()->withErrors($validator)->withInput();
        }

        // $validatedData = $validator->validated(); // Ini akan mengambil semua data yang tervalidasi
        // Kita akan menggunakan $finalDataToSave yang sudah difilter fieldnya

        try {
            foreach ($finalDataToSave as $sectionKey => $content) {
                // Find or create setting first to attach media
                $setting = LandingPageSetting::firstOrNew(['section_key' => $sectionKey]);
                
                // Handle file uploads for each section
                if ($sectionKey === 'hero') {
                    if ($request->hasFile('hero.background_image')) {
                        $setting->clearMediaCollection('hero_background');
                        $setting->addMediaFromRequest('hero.background_image')
                                        ->toMediaCollection('hero_background');
                        $media = $setting->getMedia('hero_background')->last();
                        if ($media) {
                            $content['background_image_url'] = '/storage/' . $media->id . '/' . $media->file_name;
                        }
                    }

                    if ($request->hasFile('hero.student_image')) {
                        $setting->clearMediaCollection('hero_student');
                        $setting->addMediaFromRequest('hero.student_image')
                                        ->toMediaCollection('hero_student');
                        $media = $setting->getMedia('hero_student')->last();
                        if ($media) {
                            $content['student_image_url'] = '/storage/' . $media->id . '/' . $media->file_name;
                        }
                    }
                } elseif ($sectionKey === 'about_lp' && $request->hasFile('about_lp.image')) {
                    $setting->clearMediaCollection('about_image');
                    $setting->addMediaFromRequest('about_lp.image')
                                    ->toMediaCollection('about_image');
                    $media = $setting->getMedia('about_image')->last();
                    if ($media) {
                        $content['image_url'] = '/storage/' . $media->id . '/' . $media->file_name;
                    }
                } elseif ($sectionKey === 'kepsek_welcome_lp' && $request->hasFile('kepsek_welcome_lp.kepsek_image')) {
                    $setting->clearMediaCollection('kepsek_image');
                    $setting->addMediaFromRequest('kepsek_welcome_lp.kepsek_image')
                                    ->toMediaCollection('kepsek_image');
                    $media = $setting->getMedia('kepsek_image')->last();
                    if ($media) {
                        $content['kepsek_image_url'] = '/storage/' . $media->id . '/' . $media->file_name;
                    }
                }

                // Pastikan content adalah array dan bukan null sebelum menyimpan
                if (is_array($content)) {
                    $finalContent = $content;
                    
                    if ($setting->exists && is_array($setting->content)) {
                        // Merge to preserve fields not in the request (like items or images)
                        $finalContent = array_merge($setting->content, $content);
                    }

                    $setting->content = $finalContent;
                    $setting->save();
                } else {
                    Log::warning("Konten untuk section {$sectionKey} bukan array, tidak disimpan.", ['content' => $content]);
                }
            }

            ActivityLogger::log('Update Konten Landing Page', 'Semua section Landing Page telah diperbarui.', $request);

            return redirect()->route('admin.landingpage.content.index')
                ->with('success', 'Konten Landing Page berhasil diperbarui!');

        } catch (\Exception $e) {
            Log::error('Error updating landing page content: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return back()->withErrors(['general' => 'Gagal memperbarui konten: '.$e->getMessage()])->withInput();
        }
    }
}
