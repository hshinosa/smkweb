<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Alumni extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'name',
        'graduation_year',
        'current_position',
        'education',
        'testimonial',
        'image_url', // Tetap disimpan untuk backward compatibility
        'category',
        'is_featured',
        'is_published',
        'sort_order',
    ];

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(200)
            ->height(200)
            ->format('webp')
            ->quality(80)
            ->nonQueued();

        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(90)
            ->nonQueued();
    }
}
