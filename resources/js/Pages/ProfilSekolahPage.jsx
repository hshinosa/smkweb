// FILE: resources/js/Pages/ProfilSekolahPage.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SEOHead from '@/Components/SEOHead';
import ResponsiveImage, { HeroImage } from '@/Components/ResponsiveImage';
import { Check, Star, Target, MapPin, Building, Trophy, Users } from 'lucide-react';
// Import typography constants
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { usePage } from '@inertiajs/react';

// Get navigation data from centralized source

const timelineEvents = [
    {
        year: "1975",
        title: "Awal Pendirian",
        description: "Berdiri sebagai sekolah filial (kelas jauh) untuk memenuhi kebutuhan pendidikan di wilayah Baleendah.",
        side: "left"
    },
    {
        year: "1980",
        title: "Penegerian",
        description: "Resmi berdiri sendiri sebagai SMAN 1 Baleendah dengan SK Menteri Pendidikan, menandai era baru kemandirian.",
        side: "right"
    },
    {
        year: "2010",
        title: "Pengembangan Fasilitas",
        description: "Revitalisasi gedung utama dan pembangunan Masjid sekolah sebagai pusat pembentukan karakter siswa.",
        side: "left"
    },
    {
        year: "Sekarang",
        title: "Era Prestasi",
        description: "Menjadi Sekolah Penggerak dan meraih predikat Sekolah Adiwiyata Tingkat Provinsi/Nasional.",
        side: "right"
    }
];

const facilities = [
    { name: "Lab Komputer", image: "/images/panen-karya-sman1-baleendah.jpg" },
    { name: "Perpustakaan", image: "/images/hero-bg-sman1-baleendah.jpeg" }, // Placeholder reused
    { name: "Masjid Sekolah", image: "/images/keluarga-besar-sman1-baleendah.png" }, // Placeholder reused
    { name: "Lapangan Olahraga", image: "/images/hero-bg-sman1-baleendah.jpeg" }, // Placeholder reused
    { name: "Ruang Kelas Modern", image: "/images/panen-karya-sman1-baleendah.jpg" } // Placeholder reused
];

const misiPoints = [
    "Melaksanakan pembelajaran berbasis teknologi dan inovasi.",
    "Menanamkan nilai karakter dan budi pekerti luhur.",
    "Mengembangkan potensi akademik dan non-akademik siswa.",
    "Menciptakan lingkungan sekolah yang ramah dan berwawasan lingkungan.",
    "Menjalin kerjasama dengan berbagai institusi pendidikan tinggi."
];

export default function ProfilSekolahPage({ auth, hero, history, facilities }) {
    const { siteSettings } = usePage().props;
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';
    const navigationData = getNavigationData(siteSettings);
    
    // Helper to format image path correctly
    const formatImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    // Safety check and dynamic data extraction
    const timelineEvents = Array.isArray(history?.timeline) ? history.timeline : [];
    const historyTitle = history?.title || 'Jejak Langkah Kami';
    const historyDescription = history?.description_html || '';
    
    const facilityList = Array.isArray(facilities?.items) ? facilities.items : [];
    const facilitiesTitle = facilities?.title || 'Lingkungan Belajar Modern';
    const facilitiesDescription = facilities?.description || 'Fasilitas lengkap yang mendukung pengembangan akademik dan karakter siswa.';

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

    return (
        <div className="bg-white font-sans text-gray-800">
            <SEOHead 
                title={`${hero?.title || 'Profil & Sejarah'} - ${siteName}`}
                description={`Mengenal lebih dekat sejarah, visi, misi, dan fasilitas ${siteName}. Sekolah unggulan dengan tradisi akademik yang kuat sejak 1975.`}
                keywords="profil sekolah, sejarah SMAN 1 Baleendah, visi misi, fasilitas sekolah, tentang sekolah"
                image={hero?.background_image || "/images/profile-banner.jpg"}
            />

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* SECTION A: HERO BANNER */}
            <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {hero?.backgroundImage ? (
                        <HeroImage media={hero.backgroundImage} alt={`Gedung ${siteName}`} />
                    ) : (
                        <HeroImage 
                            src={formatImagePath(hero?.image_url) || "/images/hero-bg-sman1-baleendah.jpeg"} 
                            alt={`Gedung ${siteName}`} 
                        />
                    )}
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4 drop-shadow-lg`}>
                        {renderHighlightedTitle(hero?.title || `Mengenal ${siteName}`)}
                    </h1>
                </div>
            </section>

            {/* SECTION B: HISTORY TIMELINE */}
            <section className="py-20 bg-gray-50 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`} dangerouslySetInnerHTML={{ __html: historyTitle.replace('Kami', '<span class="text-primary">Kami</span>') }}>
                        </h2>
                        {historyDescription && (
                            <div 
                                className={`${TYPOGRAPHY.bodyText} max-w-3xl mx-auto prose prose-blue`}
                                dangerouslySetInnerHTML={{ __html: historyDescription }}
                            />
                        )}
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Center Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 rounded-full hidden md:block"></div>

                        <div className="space-y-12">
                            {timelineEvents.map((event, idx) => (
                                <div key={idx} className={`flex flex-col md:flex-row items-center justify-between ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Content Side */}
                                    <div className="w-full md:w-5/12 mb-8 md:mb-0">
                                        <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 border-primary hover:shadow-xl transition-shadow duration-300 ${idx % 2 !== 0 ? 'md:text-right md:border-l-0 md:border-r-4' : ''}`}>
                                            <span className="inline-block px-3 py-1 bg-blue-50 text-primary font-bold rounded-full text-sm mb-3">
                                                {event.year}
                                            </span>
                                            <h3 className={`${TYPOGRAPHY.cardTitle} mb-2 text-gray-900`}>
                                                {event.title}
                                            </h3>
                                            <p className={TYPOGRAPHY.bodyText}>
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Center Dot */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-yellow rounded-full border-4 border-white shadow-md hidden md:block"></div>

                                    {/* Empty Side for Spacing */}
                                    <div className="w-full md:w-5/12 hidden md:block"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION D: FACILITIES GALLERY */}
            <section className="py-20 bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                            {facilitiesTitle}
                        </h2>
                        <p className={`${TYPOGRAPHY.bodyText} max-w-2xl mx-auto`}>
                            {facilitiesDescription}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facilityList.map((facility, idx) => (
                            <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] cursor-pointer">
                                {facility.image_url ? (
                                    <ResponsiveImage 
                                        src={formatImagePath(facility.image_url)} 
                                        alt={facility.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">
                                        <Building className="w-16 h-16 opacity-20" />
                                        <span className="absolute inset-0 flex items-center justify-center font-bold text-lg p-4 text-center">
                                            {facility.title}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <h3 className="text-xl font-bold text-white mb-1">{facility.title}</h3>
                                    <p className="text-white/80 text-sm line-clamp-2">{facility.description}</p>
                                    <div className="h-1 w-12 bg-accent-yellow rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />
        </div>
    );
}