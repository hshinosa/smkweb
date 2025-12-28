<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendarContent;
use Inertia\Inertia;

class AcademicCalendarPublicController extends Controller
{
    /**
     * Display the academic calendar page for public viewing
     */
    public function index()
    {
        // Get all calendar contents for display
        $calendarContents = AcademicCalendarContent::ordered()
            ->where('is_active', true)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'calendar_image_url' => $item->calendar_image_url,
                    'semester' => $item->semester,
                    'semester_name' => $item->semester_name,
                    'academic_year_start' => $item->academic_year_start,
                    'academic_year' => $item->academic_year,
                    'is_active' => $item->is_active,
                    'sort_order' => $item->sort_order,
                ];
            });

        // Get current academic year
        $latestCalendar = AcademicCalendarContent::where('is_active', true)
            ->orderBy('academic_year_start', 'desc')
            ->first();

        $currentAcademicYear = $latestCalendar
            ? $latestCalendar->academic_year_start.'/'.($latestCalendar->academic_year_start + 1)
            : '2024/2025';

        return Inertia::render('AcademicCalendarPage', [
            'calendarContents' => $calendarContents,
            'currentAcademicYear' => $currentAcademicYear,
        ]);
    }
}
