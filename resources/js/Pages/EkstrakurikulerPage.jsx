import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Dribbble, 
    Activity, 
    Music, 
    Mic, 
    Cpu, 
    Bot, 
    Flag, 
    BookHeart, 
    Target, 
    Palette, 
    Globe, 
    Zap, 
    Users, 
    Trophy, 
    Clock, 
    MapPin, 
    Phone, 
    Calendar,
    ArrowRight,
    Star,
    Award,
    Heart,
    Microscope,
    Compass
} from 'lucide-react';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SEOHead from '@/Components/SEOHead';
import Modal from '@/Components/Modal';
import ResponsiveImage, { HeroImage } from '@/Components/ResponsiveImage';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { getPageMetadata } from '@/Utils/academicData';
import { usePage } from '@inertiajs/react';

// --- Helper Functions for Visuals ---

const getCategoryTheme = (categoryName) => {
    const icons = {
        'Olahraga': Activity,
        'Seni & Budaya': Palette,
        'Akademik & Sains': Cpu,
        'Keagamaan & Sosial': Heart
    };

    // Unified theme using project primary colors
    return {
        color: 'text-primary',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        accent: 'bg-primary',
        light: 'bg-blue-50',
        icon: icons[categoryName] || Star
    };
};

const getActivityIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('basket')) return Dribbble;
    if (lowerName.includes('futsal') || lowerName.includes('sepak bola')) return Target;
    if (lowerName.includes('voli')) return Activity;
    if (lowerName.includes('badminton') || lowerName.includes('bulu tangkis')) return Zap;
    if (lowerName.includes('musik') || lowerName.includes('band')) return Music;
    if (lowerName.includes('paduan suara') || lowerName.includes('vokal')) return Mic;
    if (lowerName.includes('tari')) return Users;
    if (lowerName.includes('teater') || lowerName.includes('drama')) return Palette;
    if (lowerName.includes('robotik') || lowerName.includes('it')) return Bot;
    if (lowerName.includes('kir') || lowerName.includes('ilmiah')) return Microscope;
    if (lowerName.includes('english') || lowerName.includes('bahasa')) return Globe;
    if (lowerName.includes('paskibra')) return Flag;
    if (lowerName.includes('pramuka')) return Compass;
    if (lowerName.includes('rohis') || lowerName.includes('keagamaan')) return BookHeart;
    if (lowerName.includes('pmr') || lowerName.includes('kesehatan')) return Heart;
    
    return Star; // Default icon
};

// --- Components ---

const ActivityCard = ({ activity, categoryTheme, onClick }) => {
    const Icon = getActivityIcon(activity.name);
    
    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
            {/* Header Visual */}
            <div className={`h-32 ${categoryTheme.light} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10 bg-pattern-dots"></div>
                <div className={`w-16 h-16 ${categoryTheme.accent} rounded-2xl rotate-3 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {activity.name}
                </h3>
                
                {/* Schedule Badge */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.schedule ? activity.schedule.split(',')[0] : 'Jadwal Menyusul'} {/* Take first part of schedule */}
                    </div>
                </div>

                {/* Description Truncated */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                    {activity.description}
                </p>

                {/* Prestasi Highlight */}
                {activity.achievements && activity.achievements.length > 0 && (
                    <div className="mb-6 flex items-start gap-2 text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <Trophy className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span className="font-medium line-clamp-1">{activity.achievements[0]}</span>
                    </div>
                )}

                {/* Action Button */}
                <button 
                    onClick={onClick}
                    className="w-full py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary hover:text-white"
                >
                    Lihat Detail <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const ActivityDetailModal = ({ show, onClose, activity, categoryTheme }) => {
    if (!activity) return null;
    const Icon = getActivityIcon(activity.name);

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="bg-white rounded-2xl overflow-hidden">
                {/* Modal Header Banner */}
                <div className="h-48 relative overflow-hidden bg-gray-900">
                    {/* Image */}
                    <ResponsiveImage 
                        src={activity.image_url || "/images/hero-bg-sman1baleendah.jpeg"} 
                        alt={activity.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                    
                    <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-end gap-6">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center transform translate-y-4">
                                <Icon className={`w-10 h-10 ${categoryTheme.color}`} />
                            </div>
                            <div className="text-white pb-2">
                                <div className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Ekstrakurikuler</div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold">{activity.name}</h2>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BookHeart className="w-5 h-5 text-gray-400" />
                                Deskripsi Kegiatan
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {activity.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Jejak Prestasi
                            </h3>
                            
                            {/* Vertical Timeline for Achievements */}
                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                                {activity.achievements && activity.achievements.length > 0 ? (
                                    activity.achievements.map((achievement, idx) => (
                                        <div key={idx} className="relative">
                                            <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${categoryTheme.accent}`}></div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                                                <p className="font-bold text-gray-800">{achievement}</p>
                                                <p className="text-sm text-gray-500 mt-1">Tingkat Kota/Provinsi • 2024</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic pl-4">Belum ada data prestasi terbaru.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info Box */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-8">
                            <h3 className="font-bold text-gray-900 mb-6 text-lg">Informasi Latihan</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2.5 rounded-lg ${categoryTheme.light} ${categoryTheme.color}`}>
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Jadwal</p>
                                        <p className="font-medium text-gray-900">{activity.schedule}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className={`p-2.5 rounded-lg ${categoryTheme.light} ${categoryTheme.color}`}>
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Lokasi</p>
                                        <p className="font-medium text-gray-900">Lapangan Utama / Aula</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className={`p-2.5 rounded-lg ${categoryTheme.light} ${categoryTheme.color}`}>
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Pembina</p>
                                        <p className="font-medium text-gray-900">{activity.coach_name || 'Akan diinformasikan'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                                    <p className="text-sm font-bold text-primary mb-1">
                                        Tertarik Bergabung?
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Silakan hubungi Wali Kelas atau Pembina Ekstrakurikuler untuk informasi pendaftaran lebih lanjut.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

// --- Main Page Component ---

export default function EkstrakurikulerPage({ extracurriculars = [] }) {
    const { siteSettings } = usePage().props;
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';
    const navigationData = getNavigationData(siteSettings);
    const pageMetadata = getPageMetadata(siteName);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeCategoryTheme, setActiveCategoryTheme] = useState(null);

    const heroSettings = siteSettings?.hero_extracurricular || {};
    
    // Helper to format image path correctly
    const formatImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

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

    const openDetailModal = (activity, categoryName) => {
        setSelectedActivity(activity);
        setActiveCategoryTheme(getCategoryTheme(categoryName));
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => setSelectedActivity(null), 300); // Delay clear for animation
    };

    const groupedActivities = useMemo(() => {
        const categories = [...new Set(extracurriculars.map(e => e.category))];
        return categories.map(cat => ({
            category: cat,
            activities: extracurriculars.filter(e => e.category === cat)
        }));
    }, [extracurriculars]);

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
            <SEOHead 
                title={pageMetadata.ekstrakurikuler.title}
                description={pageMetadata.ekstrakurikuler.description}
                keywords={`ekstrakurikuler, ekskul, kegiatan sekolah, OSIS, pramuka, basket, futsal, musik, sains, robotika, ${siteName}`}
                image="/images/ekskul-banner.jpg"
            />
            
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* 1. HERO SECTION (Consistent with KurikulumPage) */}
            <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <HeroImage 
                        src={formatImagePath(heroSettings.image) || "/images/hero-bg-sman1baleendah.jpeg"} 
                        alt={`Background Ekstrakurikuler ${siteName}`} 
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4`}>
                        {renderHighlightedTitle(heroSettings.title || 'Ekstrakurikuler')}
                    </h1>
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        {heroSettings.subtitle || `Wadah kreativitas dan prestasi siswa ${siteName} untuk membentuk karakter unggul.`}
                    </p>
                </div>
            </section>

            {/* 2. CATALOG SECTION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Render Categories */}
                    {groupedActivities.length > 0 ? (
                        groupedActivities.map((group, idx) => {
                            const theme = getCategoryTheme(group.category);
                            
                            return (
                                <div key={idx} className="mb-20 last:mb-0">
                                    {/* Category Header */}
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className={`p-3 rounded-xl ${theme.light} ${theme.color}`}>
                                            <theme.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className={`${TYPOGRAPHY.sectionHeading} text-gray-900`}>
                                                {group.category}
                                            </h2>
                                            <div className={`h-1.5 w-24 ${theme.accent} mt-2 rounded-full`}></div>
                                        </div>
                                    </div>

                                    {/* Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {group.activities.map((activity, index) => (
                                            <ActivityCard 
                                                key={index} 
                                                activity={activity} 
                                                categoryTheme={theme}
                                                onClick={() => openDetailModal(activity, group.category)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20">
                            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">Belum ada data ekstrakurikuler</h3>
                            <p className="text-gray-500">Silakan kembali lagi nanti.</p>
                        </div>
                    )}

                </div>
            </section>

            {/* 3. CTA / JOIN SECTION */}
            <section className="py-20 bg-primary relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Siap Menjadi Bagian dari <br/> Keluarga Besar {siteName}?
                    </h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                        Dapatkan informasi lengkap mengenai pendaftaran peserta didik baru, jadwal, dan persyaratan yang dibutuhkan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/informasi-spmb" 
                            className="px-8 py-4 bg-accent-yellow text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link 
                            href="/kontak" 
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </section>

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />

            {/* Detail Modal */}
            <ActivityDetailModal 
                show={showModal} 
                onClose={closeModal} 
                activity={selectedActivity} 
                categoryTheme={activeCategoryTheme}
            />
        </div>
    );
}