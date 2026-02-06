<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TkaAverage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TkaAverageController extends Controller
{
    public function index()
    {
        // Group by Year and Exam Type for List View
        $groups = TkaAverage::select('academic_year', 'exam_type')
            ->selectRaw('count(*) as subject_count')
            ->selectRaw('avg(average_score) as overall_average')
            ->groupBy('academic_year', 'exam_type')
            ->orderByDesc('academic_year')
            ->get();

        return Inertia::render('Admin/TkaAverages/Index', [
            'groups' => $groups
        ]);
    }

    public function show($academic_year, $exam_type)
    {
        // Detail view to edit subjects for a specific exam
        $subjects = TkaAverage::where('academic_year', $academic_year)
            ->where('exam_type', $exam_type)
            ->orderBy('subject_name')
            ->get();

        return Inertia::render('Admin/TkaAverages/Show', [
            'academic_year' => $academic_year,
            'exam_type' => $exam_type,
            'subjects' => $subjects
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year' => 'required|string',
            'exam_type' => 'required|string',
            'subject_name' => 'required|string',
            'average_score' => 'required|numeric|min:0',
        ]);

        TkaAverage::updateOrCreate(
            [
                'academic_year' => $validated['academic_year'],
                'exam_type' => $validated['exam_type'],
                'subject_name' => $validated['subject_name'],
            ],
            ['average_score' => $validated['average_score']]
        );

        return back()->with('success', 'Data berhasil disimpan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'subject_name' => 'required|string',
            'average_score' => 'required|numeric|min:0',
        ]);

        $item = TkaAverage::findOrFail($id);
        $item->update([
            'subject_name' => $validated['subject_name'],
            'average_score' => $validated['average_score'],
        ]);

        return back()->with('success', 'Data diperbarui.');
    }

    public function destroy($id)
    {
        TkaAverage::findOrFail($id)->delete();
        return back()->with('success', 'Data dihapus.');
    }
    
    // Bulk delete for a group
    public function destroyGroup(Request $request)
    {
        $year = $request->input('academic_year');
        $type = $request->input('exam_type');
        
        TkaAverage::where('academic_year', $year)
            ->where('exam_type', $type)
            ->delete();
            
        return redirect()->route('admin.tka-averages.index')->with('success', 'Data grup ujian berhasil dihapus.');
    }
}
