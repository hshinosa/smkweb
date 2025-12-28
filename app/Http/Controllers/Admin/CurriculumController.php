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
            if ($request->hasFile("fase_e_image")) {
                $path = $request->file("fase_e_image")->store('kurikulum', 'public');
                $faseEContent['image'] = '/storage/' . $path;
            }
            CurriculumSetting::updateOrCreate(['section_key' => 'fase_e'], ['content' => $faseEContent]);

            // Handle Fase F
            $faseFContent = [
                'title' => $request->input('fase_f_title'),
                'description' => $request->input('fase_f_description'),
                'points' => $request->input('fase_f_points', []),
                'image' => $request->input('fase_f_image_url'),
            ];
            if ($request->hasFile("fase_f_image")) {
                $path = $request->file("fase_f_image")->store('kurikulum', 'public');
                $faseFContent['image'] = '/storage/' . $path;
            }
            CurriculumSetting::updateOrCreate(['section_key' => 'fase_f'], ['content' => $faseFContent]);

        } elseif ($section === 'hero') {
            $content = $request->input('content');
            if ($request->hasFile("content.image")) {
                $path = $request->file("content.image")->store('kurikulum', 'public');
                $content['image'] = '/storage/' . $path;
            } else {
                $content['image'] = $content['image_url'] ?? null;
            }
            unset($content['image_url']);
            CurriculumSetting::updateOrCreate(['section_key' => 'hero'], ['content' => $content]);

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
