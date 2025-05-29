<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicCalendarContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'calendar_image_url',
        'semester',
        'academic_year_start',
        'sort_order',
    ];

    public static function getDefaults(): array
    {
        return [
            'title' => 'Kalender Akademik SMK Negeri 15 Bandung',
            'calendar_image_url' => '/images/kalender-akademik-default.jpg',
            'semester' => 1, // 1 for odd/ganjil
            'academic_year_start' => 2024, // 2024/2025
            'sort_order' => 0,
        ];
    }

    public function getAcademicYearAttribute()
    {
        return $this->academic_year_start . '/' . ($this->academic_year_start + 1);
    }
    
    // Helper method to get semester name
    public function getSemesterNameAttribute()
    {
        return $this->semester == 1 ? 'Ganjil' : 'Genap';
    }
    
    public function scopeOrdered($query)
    {
        $columns = \Schema::getColumnListing('academic_calendar_contents');
        if (in_array('academic_year_start', $columns)) {
            return $query->orderBy('academic_year_start', 'desc')
                        ->orderBy('semester', 'asc')
                        ->orderBy('sort_order', 'asc');
        } else {
            return $query->orderBy('id', 'desc')
                        ->orderBy('sort_order', 'asc');
        }
    }
}
