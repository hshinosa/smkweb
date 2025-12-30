import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, ChevronLeft, ChevronRight, X, Play } from 'lucide-react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';

// Import utilities
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { usePage } from '@inertiajs/react';

export default function GaleriPage({ galleries = [] }) {
    const { siteSettings } = usePage().props;
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';
    const navigationData = getNavigationData(siteSettings);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const heroSettings = siteSettings?.hero_gallery || {};
    
    // Helper to format image path correctly
    const formatImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    // Get unique categories from galleries
    const categories = useMemo(() => {
        return ['Semua', ...new Set(galleries.map(item => item.category))];
    }, [galleries]);

    const renderHighlightedTitle = (title) => {
        if (!title) return null;
        const words = title.split(' ');
        if (words.length <= 1) return title;
        const lastWord = words.pop();
        return (
            <>
                {words.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{lastWord}</span>
            </>
        );
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Filter dan search gallery data
    const filteredData = useMemo(() => {
        let data = galleries;
        
        // Filter by category
        if (selectedCategory !== 'Semua') {
            data = data.filter(item => item.category === selectedCategory);
        }
        
        // Search
        if (searchQuery.trim()) {
            data = data.filter(item => 
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        
        return data;
    }, [selectedCategory, searchQuery, galleries]);

    // Reset pagination when filter/search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openLightbox = (item, index) => {
        setCurrentItem(item);
        setCurrentIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setCurrentItem(null);
        document.body.style.overflow = 'unset';
    };

    const navigateLightbox = (direction) => {
        const newIndex = direction === 'next' 
            ? (currentIndex + 1) % filteredData.length
            : (currentIndex - 1 + filteredData.length) % filteredData.length;
        
        setCurrentIndex(newIndex);
        setCurrentItem(filteredData[newIndex]);
    };

    // Keyboard navigation for lightbox
    React.useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    if (filteredData.length > 1) navigateLightbox('prev');
                    break;
                case 'ArrowRight':
                    if (filteredData.length > 1) navigateLightbox('next');
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, filteredData.length]);

    // Helper to render thumbnail based on item type
    const renderThumbnail = (item) => {
        const url = item.url || '';
        
        // For photos, just show the image
        if (item.type === 'photo') {
            return (
                <img 
                    src={url} 
                    alt={item.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
            );
        }
        
        // For videos, check if YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (youtubeMatch) {
            return (
                <img 
                    src={`https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`}
                    alt={item.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
            );
        }
        
        // For uploaded videos, use video element as thumbnail
        return (
            <video 
                src={url}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                muted
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => { e.target.currentTime = 0.1; }}
            />
        );
    };

    const GalleryItem = ({ item, index }) => (
        <div 
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            onClick={() => openLightbox(item, index)}
        >
            {/* Image Wrapper */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {renderThumbnail(item)}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Video Indicator */}
                {item.type === 'video' && (
                    <div className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full border border-white/50 group-hover:bg-accent-yellow group-hover:border-accent-yellow transition-colors duration-300">
                        <Play className="w-6 h-6 text-white group-hover:text-white ml-1" fill="currentColor" />
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-primary font-bold uppercase tracking-wider text-xs bg-blue-50 px-2 py-1 rounded-md">
                        {item.category}
                    </span>
                    <span className={`${TYPOGRAPHY.metaText}`}>
                        {new Date(item.date || item.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
                <h3 className={`${TYPOGRAPHY.cardTitle} mb-2 line-clamp-2 group-hover:text-primary transition-colors`}>
                    {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 font-sans">
                    {item.description}
                </p>
            </div>
        </div>
    );

    return (
        <div className="bg-secondary min-h-screen font-sans text-gray-800 flex flex-col">
            <Head title={`Galeri - ${siteName}`} description={`Galeri kehidupan sekolah ${siteName}.`} />

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* HERO SECTION */}
            <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={formatImagePath(heroSettings.image) || "/images/hero-bg-sman1-baleendah.jpeg"} 
                        alt="Background Galeri Sekolah" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4`}>
                        {renderHighlightedTitle(heroSettings.title || 'Galeri Sekolah')}
                    </h1>
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        {heroSettings.subtitle || `Momen berharga, prestasi, dan kreativitas siswa ${siteName}.`}
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-12 flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* FILTER & SEARCH */}
                    <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
                        {/* Categories */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                                        selectedCategory === cat 
                                        ? "bg-primary text-white shadow-md border-primary" 
                                        : "bg-white text-gray-600 hover:text-primary border border-gray-200 hover:border-primary"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full max-w-xs">
                            <input
                                type="text"
                                placeholder="Cari foto atau video..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm text-sm"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                        </div>
                    </div>

                    {/* GALLERY GRID */}
                    {filteredData.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedData.map((item, index) => {
                                    const globalIndex = (currentPage - 1) * itemsPerPage + index;
                                    return (
                                        <GalleryItem key={item.id} item={item} index={globalIndex} />
                                    );
                                })}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-12 gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                                                currentPage === page
                                                ? "bg-primary text-white shadow-md transform scale-110"
                                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-block p-4 rounded-full bg-white mb-4 shadow-sm">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Tidak ada galeri ditemukan</h3>
                            <p className="text-gray-500">Coba kata kunci lain atau ubah filter kategori.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />

            {/* LIGHTBOX */}
            {lightboxOpen && currentItem && (
                <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col">
                        
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Content Container */}
                        <div className="flex-grow flex items-center justify-center overflow-hidden rounded-lg bg-black">
                            {(() => {
                                const url = currentItem.url || '';
                                
                                // Photo
                                if (currentItem.type === 'photo') {
                                    return (
                                        <img 
                                            src={url} 
                                            alt={currentItem.title}
                                            className="max-w-full max-h-[70vh] object-contain"
                                        />
                                    );
                                }
                                
                                // YouTube video
                                const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                if (youtubeMatch) {
                                    return (
                                        <div className="w-[90vw] max-w-5xl aspect-video">
                                            <iframe 
                                                src={`https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`}
                                                className="w-full h-full"
                                                allowFullScreen
                                                allow="autoplay"
                                            />
                                        </div>
                                    );
                                }
                                
                                // Uploaded video
                                return (
                                    <video 
                                        src={url}
                                        controls
                                        className="max-w-full max-h-[70vh]"
                                        autoPlay
                                        playsInline
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                );
                            })()}
                        </div>

                        {/* Caption / Info */}
                        <div className="mt-4 text-white text-center">
                            <h2 className="text-xl font-bold font-serif mb-1">{currentItem.title}</h2>
                            <p className="text-white/70 text-sm">{currentItem.description}</p>
                        </div>

                        {/* Navigation Arrows */}
                        {filteredData.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -ml-12 p-2 text-white/50 hover:text-white transition-colors"
                                >
                                    <ChevronLeft className="w-10 h-10" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-12 p-2 text-white/50 hover:text-white transition-colors"
                                >
                                    <ChevronRight className="w-10 h-10" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
