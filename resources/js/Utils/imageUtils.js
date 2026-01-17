/**
 * Utility functions for image path normalization and URL generation.
 */

/**
 * Normalizes an image URL to a consistent format.
 * Handles:
 * 1. Absolute URLs (converts to relative if containing /storage/)
 * 2. Relative paths (ensures they start with /storage/ if needed)
 * 3. External URLs (returns as-is)
 * 
 * @param {string} url - The URL or path to normalize
 * @returns {string|null} - The normalized URL or null if empty
 */
export const normalizeUrl = (url) => {
    if (!url) return null;

    // If it's an absolute URL with /storage/ in it, extract the relative path
    if (typeof url === 'string' && url.includes('/storage/')) {
        const storageIndex = url.indexOf('/storage/');
        return url.substring(storageIndex);
    }

    // If it starts with http but doesn't have /storage/, return as-is (external image)
    if (typeof url === 'string' && url.startsWith('http')) {
        return url;
    }

    // If it already starts with /, return as-is
    if (typeof url === 'string' && url.startsWith('/')) {
        return url;
    }

    // Otherwise, assume it's a relative path from the storage disk and prefix it
    return `/storage/${url}`;
};

/**
 * Legacy helper name for backward compatibility during migration
 * @param {string} url 
 * @returns {string}
 */
export const getImageUrl = (url) => normalizeUrl(url) || '';
