// FILE: resources/js/Pages/ProgramSekolahPage.jsx

import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';
import SEOHead from '@/Components/SEOHead';
import ResponsiveImage, { HeroImage } from '@/Components/ResponsiveImage';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { usePage } from '@inertiajs/react';
import { 
    Search, ChevronLeft, ChevronRight, X, ArrowRight,
    Leaf, Lightbulb, Users, Microscope, BookOpen,
    GraduationCap, Trophy, Heart, Globe, Code, Music, Camera, Palette
} from 'lucide-react';

export default function ProgramSekolahPage({ programs = [] }) {
    const { siteSettings } = usePage().props;
    const navigationData = getNavigationData(siteSettings);
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const heroSettings = siteSettings?.hero_program || {};
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';

    // Map icon names to Lucide components
    const iconMap = {
        Leaf,
        Lightbulb,
        Users,
        Microscope,
        BookOpen,
        GraduationCap,
        Trophy,
        Heart,
        Globe,
        Code,
        Music,
        Camera,
        Palette
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

    // Get unique categories from programs
    const programCategories = useMemo(() => {
        const categories = ["Semua", ...new Set(programs.map(p => p.category))];
        return categories;
    }, [programs]);

    // Filtering Logic
    const filteredPrograms = useMemo(() => {
        return programs.filter(program => {
            const matchesCategory = activeCategory === "Semua" || program.category === activeCategory;
            const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm, programs]);

    const openModal = (program) => {
        setSelectedProgram(program);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white font-sans text-gray-800 min-h-screen flex flex-col">
            <SEOHead 
                title="Program Unggulan - SMAN 1 Baleendah"
                description="Berbagai program unggulan SMAN 1 Baleendah untuk mengembangkan potensi akademik dan non-akademik siswa secara maksimal."
                keywords="program sekolah, program unggulan, kegiatan sekolah, program pengembangan siswa, SMAN 1 Baleendah"
                image="/images/program-sekolah.jpg"
            />

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
                    {/* If Media Library adds backgroundImage property in the future: */}
                    {heroSettings?.backgroundImage ? (
                        <HeroImage media={heroSettings.backgroundImage} alt="Background Program Sekolah" />
                    ) : (
                        <HeroImage 
                            src="/images/hero-bg-sman1-baleendah.jpeg" 
                            alt="Background Program Sekolah" 
                        />
                    )}
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4`}>
                        {renderHighlightedTitle(heroSettings.title || 'Program Unggulan')}
                    </h1>
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        {heroSettings.subtitle || "Membangun karakter dan kompetensi siswa melalui berbagai inisiatif positif."}
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-16 bg-gray-50 flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* FILTER & SEARCH */}
                    <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
                        {/* Categories */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {programCategories.map((cat) => (
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

                        {/* Search */}
                        <div className="relative w-full max-w-xs">
                            <input
                                type="text"
                                placeholder="Cari program..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm text-sm"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                        </div>
                    </div>

                    {/* PROGRAM GRID */}
                    {filteredPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPrograms.map((program) => (
                                <div 
                                    key={program.id}
                                    onClick={() => openModal(program)}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group flex flex-col h-full overflow-hidden"
                                >
                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="mb-3">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${program.color_class || 'bg-blue-50 text-primary'}`}>
                                                {program.category}
                                            </span>
                                        </div>
                                        <h3 className={`${TYPOGRAPHY.cardTitle} mb-3 group-hover:text-primary transition-colors`}>
                                            {program.title}
                                        </h3>
                                        <p className={`${TYPOGRAPHY.bodyText} line-clamp-3 mb-6 text-sm flex-grow`}>
                                            {program.description}
                                        </p>
                                        <div className="flex items-center text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                                            Selengkapnya <ArrowRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Program tidak ditemukan</h3>
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

            {/* DETAIL MODAL */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                {selectedProgram && (
                    <div className="bg-white rounded-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className={`p-8 ${selectedProgram.color_class ? selectedProgram.color_class.split(' ')[0].replace('bg-', 'bg-opacity-20 bg-') : 'bg-primary/10'} flex items-center justify-between`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 bg-white rounded-xl shadow-sm`}>
                                    {(() => {
                                        const IconComponent = iconMap[selectedProgram.icon_name] || BookOpen;
                                        return <IconComponent size={32} className={selectedProgram.color_class ? selectedProgram.color_class.split(' ')[1] : 'text-primary'} />;
                                    })()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.title}</h2>
                                    <span className={`text-sm font-semibold ${selectedProgram.color_class ? selectedProgram.color_class.split(' ')[1] : 'text-primary'}`}>
                                        {selectedProgram.category}
                                    </span>
                                </div>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi Program</h3>
                            <p className={`${TYPOGRAPHY.bodyText} text-lg leading-relaxed`}>
                                {selectedProgram.description}
                            </p>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={closeModal}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}