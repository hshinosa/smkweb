<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alumni;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Http\Requests\AlumniStoreRequest;
use App\Http\Requests\AlumniUpdateRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AlumniController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $alumnis = Alumni::with('media')->orderBy('sort_order')->latest()->get();
        
        $transformedAlumnis = $alumnis->map(function ($alumni) {
            $data = $this->imageService->transformModelWithMedia($alumni, ['avatars']);
            
            if ($alumni->content_type === 'video' && $alumni->video_source === 'upload') {
                $videoMedia = $alumni->getFirstMedia('videos');
                if ($videoMedia) {
                    $data['video_url'] = $videoMedia->getUrl();
                }
            }
            
            return $data;
        })->toArray();
        
        return Inertia::render('Admin/Alumni/Index', [
            'alumnis' => $transformedAlumnis
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Alumni/Create');
    }

    public function store(AlumniStoreRequest $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();
            
            if (isset($validated['testimonial'])) {
                $validated['testimonial'] = strip_tags($validated['testimonial']);
            }

            $alumni = Alumni::create($validated);

            if ($request->hasFile('image')) {
                $alumni->addMediaFromRequest('image')->toMediaCollection('avatars');
            }

            if ($request->content_type === 'video') {
                if ($request->video_source === 'upload' && $request->hasFile('video_file')) {
                    $alumni->addMediaFromRequest('video_file')->toMediaCollection('videos');
                }

                if ($request->hasFile('video_thumbnail')) {
                    $alumni->addMediaFromRequest('video_thumbnail')->toMediaCollection('video_thumbnails');
                }
            }

            DB::commit();
            return redirect()->route('admin.alumni.index')->with('success', 'Alumni berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to store alumni: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Gagal menyimpan data alumni. ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(Alumni $alumni)
    {
        return Inertia::render('Admin/Alumni/Edit', [
            'alumni' => $this->imageService->transformModelWithMedia($alumni, ['avatars'])
        ]);
    }

    public function update(AlumniUpdateRequest $request, Alumni $alumni)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();
            
            if (isset($validated['testimonial'])) {
                $validated['testimonial'] = strip_tags($validated['testimonial']);
            }

            $alumni->update($validated);

            if ($request->hasFile('image')) {
                $alumni->clearMediaCollection('avatars');
                $alumni->addMediaFromRequest('image')->toMediaCollection('avatars');
            }

            if ($request->content_type === 'video') {
                if ($request->video_source === 'upload' && $request->hasFile('video_file')) {
                    $alumni->clearMediaCollection('videos');
                    $alumni->addMediaFromRequest('video_file')->toMediaCollection('videos');
                }

                if ($request->hasFile('video_thumbnail')) {
                    $alumni->clearMediaCollection('video_thumbnails');
                    $alumni->addMediaFromRequest('video_thumbnail')->toMediaCollection('video_thumbnails');
                }
            }

            DB::commit();
            return redirect()->route('admin.alumni.index')->with('success', 'Alumni berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update alumni: ' . $e->getMessage());
            return back()->withErrors(['general' => 'Gagal memperbarui data alumni. ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(Alumni $alumni)
    {
        $alumni->delete();
        return redirect()->route('admin.alumni.index')->with('success', 'Alumni berhasil dihapus.');
    }
}
