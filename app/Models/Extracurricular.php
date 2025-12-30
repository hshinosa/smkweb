<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Extracurricular extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'name',
        'category',
        'description',
        'icon_name',
        'schedule',
        'coach_name',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Register media conversions for extracurricular images
     */
    public function registerMediaConversions(Media $media = null): void
    {
        // Mobile size (375px) - WebP
        $this
            ->addMediaConversion('mobile')
            ->width(375)
            ->format('webp')
            ->quality(80)
            ->performOnCollections('images')
            ->nonQueued();

        // Tablet size (768px) - WebP
        $this
            ->addMediaConversion('tablet')
            ->width(768)
            ->format('webp')
            ->quality(85)
            ->performOnCollections('images')
            ->nonQueued();

        // Desktop size (1280px) - WebP
        $this
            ->addMediaConversion('desktop')
            ->width(1280)
            ->format('webp')
            ->quality(90)
            ->performOnCollections('images')
            ->nonQueued();

        // Large/HD size (1920px) - WebP
        $this
            ->addMediaConversion('large')
            ->width(1920)
            ->format('webp')
            ->quality(90)
            ->performOnCollections('images')
            ->nonQueued();

        // Original as WebP (for modern browsers)
        $this
            ->addMediaConversion('webp')
            ->format('webp')
            ->quality(95)
            ->performOnCollections('images')
            ->nonQueued();

        // Thumbnail for gallery view
        $this
            ->addMediaConversion('thumb')
            ->width(400)
            ->height(300)
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }

    /**
     * Register media collections
     */
    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
    }
}
