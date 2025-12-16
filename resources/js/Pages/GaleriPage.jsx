import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

// Import Components
import { AcademicLayout, AcademicHero } from '@/Components/Academic';

// Import utilities
import { TYPOGRAPHY } from '@/Utils/typography';
import { mockGalleryData, galleryCategories, filterGalleryByCategory } from '@/Utils/galleryData';

export default function GaleriPage() {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter dan search gallery data
    const filteredData = useMemo(() => {
        let data = mockGalleryData;
        
        // Filter by category
        if (selectedCategory !== 'Semua') {
            data = filterGalleryByCategory(selectedCategory);
        }
        
        // Search
        if (searchQuery.trim()) {
            data = data.filter(item => 
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        
        return data;
    }, [selectedCategory, searchQuery]);

    const openLightbox = (item, index) => {
        setCurrentItem(item);
        setCurrentIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
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

    const GalleryItem = ({ item, index }) => (
        <div 
            className="group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            onClick={() => openLightbox(item, index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(item, index);
                }
            }}
            aria-label={`Lihat ${item.title}`}
        >
            <div className="relative aspect-video overflow-hidden">
                <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" fill="white" />
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {item.category}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className={`${TYPOGRAPHY.cardTitle} line-clamp-2`}>
                    {item.title}
                </h3>
                <p className={`${TYPOGRAPHY.secondaryText} line-clamp-2 mb-2`}>
                    {item.description}
                </p>
                <p className={`${TYPOGRAPHY.smallText}`}>
                    {new Date(item.date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>
        </div>
    );

    const Lightbox = () => {
        if (!lightboxOpen || !currentItem) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4">
                <div className="relative max-w-4xl max-h-full w-full">
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Navigation buttons */}
                    {filteredData.length > 1 && (
                        <>
                            <button
                                onClick={() => navigateLightbox('prev')}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => navigateLightbox('next')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Content */}
                    <div className="bg-white rounded-lg overflow-hidden">
                        <div className="relative">
                            {currentItem.type === 'photo' ? (
                                <img 
                                    src={currentItem.url} 
                                    alt={currentItem.title}
                                    className="w-full max-h-96 object-contain"
                                />
                            ) : (
                                <video 
                                    src={currentItem.url}
                                    controls
                                    className="w-full max-h-96"
                                    autoPlay
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="bg-primary text-white text-sm px-3 py-1 rounded-full">
                                    {currentItem.category}
                                </span>
                                <span className={`${TYPOGRAPHY.smallText}`}>
                                    {new Date(currentItem.date).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <h2 className={`${TYPOGRAPHY.subsectionHeading} mb-2`}>
                                {currentItem.title}
                            </h2>
                            <p className={`${TYPOGRAPHY.bodyText} mb-4`}>
                                {currentItem.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {currentItem.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AcademicLayout>
            <AcademicHero
                title="Galeri"
                description="Dokumentasi visual kegiatan, prestasi, dan momen berharga di SMAN 1 Baleendah. Lihat koleksi foto dan video yang menampilkan kehidupan sekolah yang dinamis dan beragam."
                pageTitle="Galeri - SMAN 1 Baleendah"
                metaDescription="Galeri foto dan video kegiatan sekolah SMAN 1 Baleendah. Dokumentasi visual prestasi, kegiatan akademik, olahraga, seni budaya, dan momen bersejarah sekolah."
            />

                {/* Filter and Search Section */}
                <section className="py-8 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative w-full lg:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari foto atau video..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                {galleryCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            selectedCategory === category
                                                ? 'bg-primary text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results count */}
                        <div className="mt-4">
                            <p className={`${TYPOGRAPHY.secondaryText}`}>
                                Menampilkan {filteredData.length} dari {mockGalleryData.length} item
                            </p>
                        </div>
                    </div>
                </section>

                {/* Gallery Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredData.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {filteredData.map((item, index) => (
                                    <GalleryItem key={item.id} item={item} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Filter className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} text-gray-600 mb-2`}>
                                    Tidak ada hasil ditemukan
                                </h3>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-500`}>
                                    Coba ubah kata kunci pencarian atau pilih kategori lain
                                </p>
                            </div>
                        )}
                    </div>
                </section>

            <Lightbox />
        </AcademicLayout>
    );
}