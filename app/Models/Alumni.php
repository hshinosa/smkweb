<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'graduation_year',
        'current_position',
        'education',
        'testimonial',
        'image_url',
        'category',
        'is_featured',
        'is_published',
        'sort_order',
    ];
}
