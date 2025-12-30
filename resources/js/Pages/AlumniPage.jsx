import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { 
    GraduationCap, 
    Briefcase, 
    Quote, 
    Search, 
    ChevronRight, 
    Users, 
    Building2, 
    Award,
    Send
} from 'lucide-react';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SEOHead from '@/Components/SEOHead';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { usePage } from '@inertiajs/react';
import { ThumbnailImage, ContentImage } from '@/Components/ResponsiveImage';

// --- MOCK DATA ---
const alumniStats = [
    { label: "Alumni", value: "15.000+", icon: Users },
    { label: "Lulusan di PTN Favorit", value: "85%", icon: Building2 },
    { label: "Karir BUMN/Multinasional", value: "Berkarir", icon: Briefcase },
];

// --- COMPONENTS ---

const AlumniCard = ({ alumni }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 relative overflow-hidden mb-6 break-inside-avoid">
        {/* Background Accent */}
        <Quote className="absolute top-4 right-4 w-16 h-16 text-gray-100 opacity-50 rotate-180" />
        
        <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                    {alumni.avatarsImage || alumni.image_url ? (
                        <ThumbnailImage 
                            src={alumni.image_url ? `/storage/${alumni.image_url}` : null}
                            media={alumni.avatarsImage}
                            alt={alumni.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <Users size={24} />
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 font-serif">{alumni.name}</h4>
                    <p className="text-xs text-primary font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        Angkatan {alumni.graduation_year}
                    </p>
                </div>
            </div>

            {/* Quote */}
            <p className="text-gray-600 italic text-sm leading-relaxed mb-6 line-clamp-4">
                "{alumni.testimonial}"
            </p>

            {/* Footer Info */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{alumni.current_position}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-500">
                    <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{alumni.education}</span>
                </div>
            </div>
        </div>
    </div>
);

export default function AlumniPage({ auth, alumnis = [] }) {
    const { siteSettings } = usePage().props;
    const navigationData = getNavigationData(siteSettings);
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchTerm, setSearchTerm] = useState("");

    const heroSettings = siteSettings?.hero_alumni || {};
    
    // Helper to format image path correctly
    const formatImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    // Get featured alumni from data
    const featuredAlumniData = alumnis.find(a => a.is_featured) || alumnis[0];

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

    // Get unique categories from data
    const dynamicCategories = ["Semua", ...new Set(alumnis.map(a => a.category).filter(Boolean))];

    // Filtering Logic
    const filteredAlumni = alumnis.filter(alumni => {
        const matchesCategory = activeCategory === "Semua" || alumni.category === activeCategory;
        const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (alumni.current_position && alumni.current_position.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';

    return (
        <div className="bg-secondary font-sans text-gray-800">
            <SEOHead 
                title={`Jejak Alumni - ${siteName}`}
                description={`Profil alumni sukses ${siteName}. Testimoni, kisah sukses, dan jaringan alumni di berbagai bidang profesi.`}
                keywords={`alumni, lulusan, alumni sukses, testimoni alumni, ${siteName}`}
                image="/images/alumni-banner.jpg"
            />
            
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            <main>
                {/* 1. HERO SECTION (Consistent with AcademicCalendarPage) */}
                <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-20">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={formatImagePath(heroSettings.image) || "/images/hero-bg-sman1-baleendah.jpeg"} 
                            alt="Background" 
                            className="w-full h-full object-cover"
                            loading="eager"
                            fetchpriority="high"
                        />
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center text-white">
                        <h1 className={`${TYPOGRAPHY.heroTitle} mb-4`}>
                            {renderHighlightedTitle(heroSettings.title || 'Jejak Alumni')}
                        </h1>
                        <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                            {heroSettings.subtitle || `Ribuan cerita sukses bermula dari sini. Tersebar di berbagai Universitas Top dan Perusahaan Multinasional, membawa nama baik almamater.`}
                        </p>
                    </div>
                </section>

                {/* 2. ALUMNI SPOTLIGHT */}
                {featuredAlumniData && (
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-secondary rounded-3xl overflow-hidden shadow-2xl max-w-6xl mx-auto">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Image Side */}
                                    <div className="lg:w-2/5 relative min-h-[400px]">
                                        {featuredAlumniData.avatarsImage || featuredAlumniData.image_url ? (
                                            <ContentImage 
                                                src={featuredAlumniData.image_url ? `/storage/${featuredAlumniData.image_url}` : null}
                                                media={featuredAlumniData.avatarsImage}
                                                alt={featuredAlumniData.name} 
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <Users size={100} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10"></div>
                                    </div>
                                    
                                    {/* Content Side */}
                                    <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow/20 text-yellow-700 text-xs font-bold uppercase tracking-wider w-fit mb-6">
                                            <Award className="w-4 h-4" />
                                            Success Story
                                        </div>
                                        
                                        <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-relaxed mb-8">
                                            "{featuredAlumniData.testimonial}"
                                        </blockquote>
                                        
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{featuredAlumniData.name}</h3>
                                            <p className="text-primary font-medium">{featuredAlumniData.current_position}</p>
                                            <p className="text-gray-500 text-sm mt-1">Angkatan {featuredAlumniData.graduation_year}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. WALL OF VOICES */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className={TYPOGRAPHY.sectionHeading}>Apa Kata Alumni?</h2>
                            <p className={`${TYPOGRAPHY.bodyText} mt-4 max-w-2xl mx-auto`}>
                                Dengar langsung pengalaman mereka selama bersekolah di {siteName}.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {dynamicCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                        activeCategory === cat 
                                        ? "bg-primary text-white shadow-md transform scale-105" 
                                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Masonry Grid */}
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {filteredAlumni.map((alumni) => (
                                <AlumniCard key={alumni.id} alumni={alumni} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. CTA SECTION */}
                <section className="py-16 bg-white border-t border-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-blue-50 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-blue-100">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif mb-4">
                                Apakah Anda Alumni {siteName}?
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Mari berbagi cerita inspiratif Anda untuk memotivasi adik-adik kelas dan mempererat tali silaturahmi keluarga besar {siteName}.
                            </p>
                            <button className="inline-flex items-center px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-darker transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                <Send className="w-5 h-5 mr-2" />
                                Submit Testimoni
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
