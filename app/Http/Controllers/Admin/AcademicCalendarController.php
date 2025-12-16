<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\AcademicCalendarContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AcademicCalendarController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicCalendarContent::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('academic_year_start', 'like', "%{$search}%");
            });
        }

        $contents = $query->ordered()->paginate(10)->withQueryString();

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
            'calendar_image' => 'required|file|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'semester' => 'required|integer|in:1,2',
            'academic_year_start' => 'required|integer|min:2000|max:2100',
            'sort_order' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $request->only(['title', 'semester', 'academic_year_start', 'sort_order']);

        // Handle file upload
        if ($request->hasFile('calendar_image')) {
            $file = $request->file('calendar_image');
            $fileName = time().'_'.$file->getClientOriginalName();
            $filePath = $file->storeAs('academic-calendar', $fileName, 'public');
            $data['calendar_image_url'] = '/storage/'.$filePath;
        }

        $content = AcademicCalendarContent::create($data);

        ActivityLogger::log('create', "Menambahkan konten kalender akademik: {$content->title}");

        return redirect()->route('admin.academic-calendar.index')->with('success', 'Konten kalender akademik berhasil ditambahkan.');
    }

    public function update(Request $request, AcademicCalendarContent $content)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'calendar_image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'semester' => 'required|integer|in:1,2',
            'academic_year_start' => 'required|integer|min:2000|max:2100',
            'sort_order' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $request->only(['title', 'semester', 'academic_year_start', 'sort_order']);

        // Handle file upload if new file is provided
        if ($request->hasFile('calendar_image')) {
            if ($content->calendar_image_url && str_starts_with($content->calendar_image_url, '/storage/')) {
                $oldPath = public_path($content->calendar_image_url);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
            $file = $request->file('calendar_image');
            $fileName = time().'_'.$file->getClientOriginalName();
            $filePath = $file->storeAs('academic-calendar', $fileName, 'public');
            $data['calendar_image_url'] = '/storage/'.$filePath;
        }

        $content->update($data);

        ActivityLogger::log('update', "Memperbarui konten kalender akademik: {$content->title}");

        return redirect()->route('admin.academic-calendar.index')->with('success', 'Konten kalender akademik berhasil diperbarui.');
    }

    public function destroy(AcademicCalendarContent $content)
    {
        $title = $content->title;

        // Delete associated image file if it exists and is stored locally
        if ($content->calendar_image_url && str_starts_with($content->calendar_image_url, '/storage/')) {
            $filePath = str_replace('/storage/', '', $content->calendar_image_url);
            Storage::disk('public')->delete($filePath);
        }

        $content->delete();

        ActivityLogger::log('delete', "Menghapus konten kalender akademik: {$title}");

        return redirect()->route('admin.academic-calendar.index')->with('success', 'Konten kalender akademik berhasil dihapus.');
    }
}
