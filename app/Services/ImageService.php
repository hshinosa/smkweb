<?php

namespace App\Services;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Support\Collection;

class ImageService
{
    /**
     * Transform a single media object to responsive image data for React
     *
     * @param Media|null $media
     * @return array|null
     */
    public function getResponsiveImageData(?Media $media): ?array
    {
        if (!$media) {
            return null;
        }

        // Use getFullUrl() to ensure absolute URL if needed, 
        // or just ensure it's a valid relative URL.
        // Spatie's getUrl() usually returns absolute URL based on APP_URL.
        return [
            'id' => $media->id,
            'original_url' => $media->getUrl(),
            'conversions' => [
                'mobile' => $media->hasGeneratedConversion('mobile') ? $media->getUrl('mobile') : null,
                'tablet' => $media->hasGeneratedConversion('tablet') ? $media->getUrl('tablet') : null,
                'desktop' => $media->hasGeneratedConversion('desktop') ? $media->getUrl('desktop') : null,
                'large' => $media->hasGeneratedConversion('large') ? $media->getUrl('large') : null,
                'webp' => $media->hasGeneratedConversion('webp') ? $media->getUrl('webp') : null,
                'thumb' => $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : null,
            ],
            'name' => $media->name,
            'file_name' => $media->file_name,
            'mime_type' => $media->mime_type,
            'size' => $media->size,
            'human_readable_size' => $media->human_readable_size,
            'custom_properties' => $media->custom_properties,
        ];
    }

    /**
     * Get first media from collection with responsive data
     *
     * @param mixed $model
     * @param string $collection
     * @return array|null
     */
    public function getFirstMediaData($model, string $collection = 'default'): ?array
    {
        $media = $model->getFirstMedia($collection);
        return $this->getResponsiveImageData($media);
    }

    /**
     * Get all media from collection with responsive data
     *
     * @param mixed $model
     * @param string $collection
     * @return array
     */
    public function getAllMediaData($model, string $collection = 'default'): array
    {
        return $model->getMedia($collection)->map(function ($media) {
            return $this->getResponsiveImageData($media);
        })->toArray();
    }

    /**
     * Transform model with media to include responsive image data
     *
     * @param mixed $model
     * @param array $mediaCollections Array of collection names
     * @return array
     */
    public function transformModelWithMedia($model, array $mediaCollections = ['featured']): array
    {
        $data = $model->toArray();

        foreach ($mediaCollections as $collection) {
            $key = $collection === 'default' ? 'media' : $collection . 'Image';
            $data[$key] = $this->getFirstMediaData($model, $collection);
        }

        return $data;
    }

    /**
     * Transform collection of models with media
     *
     * @param Collection $items
     * @param array $mediaCollections
     * @return array
     */
    public function transformCollectionWithMedia(Collection $items, array $mediaCollections = ['featured']): array
    {
        return $items->map(function ($item) use ($mediaCollections) {
            return $this->transformModelWithMedia($item, $mediaCollections);
        })->toArray();
    }

    /**
     * Get fallback image path
     *
     * @param string $type
     * @return string
     */
    public function getFallbackImage(string $type = 'default'): string
    {
        $fallbacks = [
            'hero' => '/images/hero-bg-sman1baleendah.jpeg',
            'post' => '/images/hero-bg-sman1baleendah.jpeg',
            'gallery' => '/images/hero-bg-sman1baleendah.jpeg',
            'default' => '/images/hero-bg-sman1baleendah.jpeg',
        ];

        return $fallbacks[$type] ?? $fallbacks['default'];
    }

    /**
     * Check if model has media in collection
     *
     * @param mixed $model
     * @param string $collection
     * @return bool
     */
    public function hasMedia($model, string $collection = 'default'): bool
    {
        return $model->getFirstMedia($collection) !== null;
    }
}
