<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'icon_name',
        'image_url',
        'color_class',
        'description',
        'link',
        'is_featured',
        'sort_order',
    ];
}
