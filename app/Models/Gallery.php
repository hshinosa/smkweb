<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'url',
        'thumbnail_url',
        'is_external',
        'category',
        'tags',
        'date',
        'is_featured',
    ];

    protected $casts = [
        'tags' => 'array',
        'date' => 'date',
    ];
}
