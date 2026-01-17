<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProgramController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $programs = Program::with('media')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Programs/Index', [
            'programs' => $this->imageService->transformCollectionWithMedia($programs, ['program_images'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon_name' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:10240',
            'image_url' => 'nullable|string|max:255', // External URL input
            'color_class' => 'nullable|string|max:255',
            'description' => 'required|string',
            'link' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        unset($validated['image']);

        $program = Program::create($validated);

        if ($request->hasFile('image')) {
            $program->addMediaFromRequest('image')->toMediaCollection('program_images');
            
            // Backward compatibility: store media URL
            $media = $program->getFirstMedia('program_images');
            if ($media) {
                $program->update(['image_url' => $media->getUrl()]);
            }
        }

        return redirect()->back()->with('success', 'Program berhasil ditambahkan');
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon_name' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:10240',
            'image_url' => 'nullable|string|max:255',
            'color_class' => 'nullable|string|max:255',
            'description' => 'required|string',
            'link' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        unset($validated['image']);

        $program->update($validated);

        if ($request->hasFile('image')) {
            $program->clearMediaCollection('program_images');
            $program->addMediaFromRequest('image')->toMediaCollection('program_images');
            
            // Backward compatibility: store media URL
            $media = $program->getFirstMedia('program_images');
            if ($media) {
                $program->update(['image_url' => $media->getUrl()]);
            }
        }

        return redirect()->back()->with('success', 'Program berhasil diperbarui');
    }

    public function destroy(Program $program)
    {
        $program->delete(); // Media library handles deletion

        return redirect()->back()->with('success', 'Program berhasil dihapus');
    }
}
