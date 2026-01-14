<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\AcademicCalendarContent;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AcademicCalendarController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index(Request $request)
    {
        $query = AcademicCalendarContent::query()->with('media');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('academic_year_start', 'like', "%{$search}%");
            });
        }

        $contents = $query->ordered()->paginate(10)->withQueryString();
        
        // Transform items in pagination
        $contents->through(function ($item) {
            return $this->imageService->transformModelWithMedia($item, ['calendar_images']);
        });

        return Inertia::render('Admin/AcademicCalendarContentPage', [
            'contents' => $contents,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'calendar_image' => 'required|file|image|mimes:jpeg,png,jpg,gif,svg,webp|max:10240',
            'semester' => 'required|integer|in:1,2',
            'academic_year_start' => 'required|integer|min:2000|max:2100',
            'sort_order' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $request->only(['title', 'semester', 'academic_year_start', 'sort_order']);

        $content = AcademicCalendarContent::create($data);

        // Handle file upload
        if ($request->hasFile('calendar_image')) {
            $content->addMediaFromRequest('calendar_image')->toMediaCollection('calendar_images');
            
            $media = $content->getMedia('calendar_images')->last();
            if ($media) {
                // Backward compatibility
                $content->update(['calendar_image_url' => '/storage/' . $media->id . '/' . $media->file_name]);
            }
        }

        ActivityLogger::log('create', "Menambahkan konten kalender akademik: {$content->title}");

        return redirect()->route('admin.academic-calendar.index')->with('success', 'Konten kalender akademik berhasil ditambahkan.');
    }

    public function update(Request $request, AcademicCalendarContent $academic_calendar)
    {
        $content = $academic_calendar; // Alias for minimal refactoring

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'calendar_image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,svg,webp|max:10240',
            'semester' => 'required|integer|in:1,2',
            'academic_year_start' => 'required|integer|min:2000|max:2100',
            'sort_order' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $request->only(['title', 'semester', 'academic_year_start', 'sort_order']);

        $content->update($data);

        // Handle file upload if new file is provided
        if ($request->hasFile('calendar_image')) {
            $content->clearMediaCollection('calendar_images');
            $content->addMediaFromRequest('calendar_image')->toMediaCollection('calendar_images');
            
            $media = $content->getMedia('calendar_images')->last();
            if ($media) {
                $content->update(['calendar_image_url' => '/storage/' . $media->id . '/' . $media->file_name]);
            }
        }

        ActivityLogger::log('update', "Memperbarui konten kalender akademik: {$content->title}");

        return redirect()->route('admin.academic-calendar.index')->with('success', 'Konten kalender akademik berhasil diperbarui.');
    }

    public function destroy(AcademicCalendarContent $academic_calendar)
    {
        $content = $academic_calendar; // Alias
        $title = $content->title;

        // Media Library handles deletion automatically
        $content->delete();

        ActivityLogger::log('delete', "Menghapus konten kalender akademik: {$title}");

        return redirect()->route('admin.academic-calendar.index')->with('success', 'Konten kalender akademik berhasil dihapus.');
    }

    public function setActive(AcademicCalendarContent $content)
    {
        $content->update(['is_active' => !$content->is_active]);
        
        $status = $content->is_active ? 'diaktifkan' : 'dinonaktifkan';
        ActivityLogger::log('update', "Mengubah status kalender akademik {$content->title} menjadi {$status}");

        return redirect()->route('admin.academic-calendar.index')->with('success', "Kalender akademik berhasil {$status}.");
    }
}
