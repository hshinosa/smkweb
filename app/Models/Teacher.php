<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Teacher extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'name',
        'type',
        'position',
        'department',
        'image_url',
        'nip',
        'email',
        'phone',
        'bio',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Register media conversions for teacher profile photos
     */
    public function registerMediaConversions(Media $media = null): void
    {
        // Mobile size (375px) - WebP
        $this
            ->addMediaConversion('mobile')
            ->width(375)
            ->format('webp')
            ->quality(80)
            ->performOnCollections('photos')
            ->nonQueued();

        // Tablet size (768px) - WebP
        $this
            ->addMediaConversion('tablet')
            ->width(768)
            ->format('webp')
            ->quality(85)
            ->performOnCollections('photos')
            ->nonQueued();

        // Desktop size (1280px) - WebP
        $this
            ->addMediaConversion('desktop')
            ->width(1280)
            ->format('webp')
            ->quality(90)
            ->performOnCollections('photos')
            ->nonQueued();

        // Large/HD size (1920px) - WebP
        $this
            ->addMediaConversion('large')
            ->width(1920)
            ->format('webp')
            ->quality(90)
            ->performOnCollections('photos')
            ->nonQueued();

        // Original as WebP (for modern browsers)
        $this
            ->addMediaConversion('webp')
            ->format('webp')
            ->quality(95)
            ->performOnCollections('photos')
            ->nonQueued();

        // Thumbnail for list view
        $this
            ->addMediaConversion('thumb')
            ->width(200)
            ->height(200)
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
            ->addMediaCollection('photos')
            ->singleFile() // One profile photo per teacher
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
    }
}
