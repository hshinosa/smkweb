<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CurriculumSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CurriculumController extends Controller
{
    public function index()
    {
        $settings = CurriculumSetting::all()->keyBy('section_key');
        $sections = [];
        
        foreach (array_keys(CurriculumSetting::getSectionFields()) as $key) {
            $dbRow = $settings->get($key);
            $dbContent = ($dbRow && isset($dbRow['content'])) ? $dbRow['content'] : null;
            $sections[$key] = CurriculumSetting::getContent($key, $dbContent);
        }

        return Inertia::render('Admin/Curriculum/Index', [
            'settings' => $sections,
            'activeSection' => request('section', 'intro')
        ]);
    }

    public function update(Request $request)
    {
        $section = $request->input('section');

        if ($section === 'intro_fases') {
            // Handle Intro
            CurriculumSetting::updateOrCreate(
                ['section_key' => 'intro'],
                ['content' => [
                    'title' => $request->input('intro_title'),
                    'description' => $request->input('intro_description'),
                ]]
            );

            // Handle Fase E
            $faseEContent = [
                'title' => $request->input('fase_e_title'),
                'description' => $request->input('fase_e_description'),
                'points' => $request->input('fase_e_points', []),
                'image' => $request->input('fase_e_image_url'),
            ];
            
            $faseESetting = CurriculumSetting::firstOrNew(['section_key' => 'fase_e']);
            
            // Save first if new to ensure it has an ID
            if (!$faseESetting->exists) {
                $faseESetting->content = $faseEContent;
                $faseESetting->save();
            }
            
            if ($request->hasFile("fase_e_image")) {
                $faseESetting->clearMediaCollection('fase_e_image');
                $faseESetting->addMediaFromRequest("fase_e_image")->toMediaCollection('fase_e_image');
                $media = $faseESetting->getMedia('fase_e_image')->last();
                if ($media) {
                    $faseEContent['image'] = '/storage/' . $media->id . '/' . $media->file_name;
                }
            }
            $faseESetting->content = $faseEContent;
            $faseESetting->save();

            // Handle Fase F
            $faseFContent = [
                'title' => $request->input('fase_f_title'),
                'description' => $request->input('fase_f_description'),
                'points' => $request->input('fase_f_points', []),
                'image' => $request->input('fase_f_image_url'),
            ];
            
            $faseFSetting = CurriculumSetting::firstOrNew(['section_key' => 'fase_f']);
            
            // Save first if new to ensure it has an ID
            if (!$faseFSetting->exists) {
                $faseFSetting->content = $faseFContent;
                $faseFSetting->save();
            }
            
            if ($request->hasFile("fase_f_image")) {
                $faseFSetting->clearMediaCollection('fase_f_image');
                $faseFSetting->addMediaFromRequest("fase_f_image")->toMediaCollection('fase_f_image');
                $media = $faseFSetting->getMedia('fase_f_image')->last();
                if ($media) {
                    $faseFContent['image'] = '/storage/' . $media->id . '/' . $media->file_name;
                }
            }
            $faseFSetting->content = $faseFContent;
            $faseFSetting->save();

        } elseif ($section === 'hero') {
            $content = $request->input('content');
            $heroSetting = CurriculumSetting::firstOrNew(['section_key' => 'hero']);
            
            // Save first if new to ensure it has an ID
            if (!$heroSetting->exists) {
                $heroSetting->content = $content;
                $heroSetting->save();
            }
            
            if ($request->hasFile("content.image")) {
                $heroSetting->clearMediaCollection('hero_bg');
                $heroSetting->addMediaFromRequest("content.image")->toMediaCollection('hero_bg');
                $media = $heroSetting->getMedia('hero_bg')->last();
                if ($media) {
                    $content['image'] = '/storage/' . $media->id . '/' . $media->file_name;
                }
            } else {
                $content['image'] = $content['image_url'] ?? null;
            }
            unset($content['image_url']);
            
            $heroSetting->content = $content;
            $heroSetting->save();

        } else {
            // Handle Grading System, Learning Goals, and Metode
            $content = $request->input('content');
            
            if (!$content) {
                if ($section === 'grading_system') {
                    $content = [
                        'title' => $request->input('title'),
                        'description' => $request->input('description'),
                        'scales' => $request->input('scales', []),
                    ];
                } elseif ($section === 'learning_goals') {
                    $content = [
                        'title' => $request->input('title'),
                        'goals' => $request->input('goals', []),
                    ];
                } elseif ($section === 'metode') {
                    $content = [
                        'title' => $request->input('title'),
                        'items' => $request->input('items', []),
                    ];
                }
            }

            CurriculumSetting::updateOrCreate(
                ['section_key' => $section],
                ['content' => $content]
            );
        }

        return back()->with('success', 'Konten kurikulum berhasil diperbarui.');
    }
}
