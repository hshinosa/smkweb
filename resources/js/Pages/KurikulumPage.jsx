import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Microscope, 
    Globe, 
    Languages, 
    CheckCircle, 
    Lightbulb, 
    Users, 
    Monitor,
    Award,
    TrendingUp,
    Target
} from 'lucide-react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SEOHead from '@/Components/SEOHead';
import { HeroImage } from '@/Components/ResponsiveImage';

// Import utilities
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { getPageMetadata } from '@/Utils/academicData';
import { usePage } from '@inertiajs/react';

export default function KurikulumPage({ programs = [], curriculumData }) {
    const { siteSettings } = usePage().props;
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';
    const navigationData = getNavigationData(siteSettings);
    const pageMetadata = getPageMetadata(siteName);
    const { hero, intro, fase_e, fase_f, grading_system, learning_goals, metode } = curriculumData || {};

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

    // Map icon names to Lucide components
    const iconMap = {
        Microscope,
        Globe,
        BookOpen,
        Languages,
        Monitor,
        Award,
        TrendingUp,
        Target,
        Users
    };

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
            <SEOHead 
                title={pageMetadata.kurikulum.title}
                description={pageMetadata.kurikulum.description}
                keywords="kurikulum, kurikulum merdeka, mata pelajaran, sistem pembelajaran, SMAN 1 Baleendah"
                image="/images/kurikulum-banner.jpg"
            />

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* 1. HERO SECTION (Redefined) */}
            <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {hero?.backgroundImage ? (
                        <HeroImage media={hero.backgroundImage} alt="Background Kurikulum" />
                    ) : (
                        <img 
                            src={formatImagePath(hero?.image) || "/images/hero-bg-sman1-baleendah.jpeg"} 
                            alt="Background Kurikulum" 
                            className="w-full h-full object-cover"
                            loading="eager"
                            fetchpriority="high"
                            width="1920"
                            height="1080"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4`}>
                        {renderHighlightedTitle(hero?.title || 'Kurikulum & Pembelajaran')}
                    </h1>
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        {hero?.subtitle || 'Menerapkan Kurikulum Merdeka untuk menggali potensi unik setiap siswa.'}
                    </p>
                </div>
            </section>

            {/* 2. SECTION: INTRO KURIKULUM (The Concept) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                            {intro?.title || 'Kurikulum Merdeka'}
                        </h2>
                        <p className={`${TYPOGRAPHY.bodyText}`}>
                            {intro?.description}
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Row 1: Fase E */}
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            <div className="w-full md:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] group">
                                    <img 
                                        src={formatImagePath(fase_e?.image) || "/images/hero-bg-sman1-baleendah.jpeg"} 
                                        alt="Siswa Belajar" 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <div className="bg-primary/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold inline-block mb-2">
                                            FASE E
                                        </div>
                                        <h3 className="text-2xl font-bold">Kelas X</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-4">
                                <h3 className="text-3xl font-bold text-gray-900">{fase_e?.title}</h3>
                                <div className="h-1 w-20 bg-primary rounded-full"></div>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {fase_e?.description}
                                </p>
                                <ul className="space-y-3 pt-2">
                                    {(fase_e?.points || []).map((point, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-700">
                                            <CheckCircle className="w-5 h-5 text-primary" fill="currentColor" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Row 2: Fase F */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
                            <div className="w-full md:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] group">
                                    <img 
                                        src={formatImagePath(fase_f?.image) || "/images/panen-karya-sman1-baleendah.jpg"} 
                                        alt="Diskusi Kelompok" 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <div className="bg-accent-yellow/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold text-gray-900 inline-block mb-2">
                                            FASE F
                                        </div>
                                        <h3 className="text-2xl font-bold">Kelas XI - XII</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-4">
                                <h3 className="text-3xl font-bold text-gray-900">{fase_f?.title}</h3>
                                <div className="h-1 w-20 bg-accent-yellow rounded-full"></div>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {fase_f?.description}
                                </p>
                                <ul className="space-y-3 pt-2">
                                    {(fase_f?.points || []).map((point, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-700">
                                            <CheckCircle className="w-5 h-5 text-accent-yellow" fill="currentColor" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SECTION: PROGRAM STUDI (Landing Page Style) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                            Program <span className="text-primary">Akademik</span>
                        </h2>
                        <p className={TYPOGRAPHY.bodyText}>
                            Pilihan program studi yang dirancang untuk mempersiapkan siswa menuju jenjang pendidikan tinggi dan karir masa depan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {programs.map((program, idx) => {
                            const IconComponent = iconMap[program.icon_name] || Microscope;
                            return (
                                <div key={idx} className="group flex flex-col items-center">
                                    {/* Image Area - Floating above */}
                                    <div className="h-80 w-full flex items-end justify-center overflow-visible z-0 pb-5">
                                        <img 
                                            src={program.image_url || "/images/anak-sma-programstudi.png"} 
                                            alt={program.title}
                                            className="h-full w-auto object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative -mt-12 pt-10 flex-1 flex flex-col z-10 w-full">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors ${program.color_class || 'bg-blue-50 text-primary'}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <h3 className={`${TYPOGRAPHY.cardTitle} mb-2`}>{program.title}</h3>
                                        <p className={`${TYPOGRAPHY.smallText} mb-8 leading-relaxed flex-1`}>
                                            {program.description}
                                        </p>
                                        <Link 
                                            href={program.link || '#'}
                                            className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-center block"
                                        >
                                            Lihat Mata Pelajaran
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. SECTION: SISTEM PENILAIAN (Elegant Data) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>{grading_system?.title}</h2>
                        <p className={`${TYPOGRAPHY.bodyText} max-w-2xl mx-auto`}>
                            {grading_system?.description}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            {/* Left: Description */}
                            <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-50">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{grading_system?.title}</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {grading_system?.description}
                                </p>
                                <div className="flex items-center gap-2 text-primary font-medium">
                                    <Award className="w-5 h-5" />
                                    <span>Berbasis Kompetensi</span>
                                </div>
                            </div>

                            {/* Right: Data Points */}
                            <div className="p-8 md:p-12 space-y-6 bg-white">
                                {(grading_system?.scales || []).map((scale, idx) => (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <div>
                                            <div className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{scale.label}</div>
                                            <div className="text-sm text-gray-500">{scale.sub}</div>
                                        </div>
                                        <div className="px-4 py-1 bg-blue-50 text-blue-600 font-bold rounded-full text-sm border border-blue-100">
                                            {scale.range}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. SECTION: METODE & TUJUAN (Combined) */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Tujuan (Checkmark Cards) */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-8 text-white">
                                {learning_goals?.title}
                            </h2>
                            <div className="space-y-4">
                                {(learning_goals?.goals || []).map((goal, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">
                                            {goal}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metode (Icon Grid) */}
                        <div className="bg-white/5 rounded-[40px] p-8 md:p-12 border border-white/10">
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <Lightbulb className="text-accent-yellow" />
                                {metode?.title || 'Metode Pembelajaran'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {(metode?.items || [
                                    { icon: 'Users', title: "Collaborative", desc: "Belajar kelompok & diskusi" },
                                    { icon: 'Monitor', title: "Digital Based", desc: "Integrasi LMS & IT" },
                                    { icon: 'Target', title: "Project Based", desc: "Penyelesaian masalah nyata" },
                                    { icon: 'TrendingUp', title: "Adaptive", desc: "Sesuai kecepatan siswa" }
                                ]).map((item, idx) => {
                                    const IconComponent = iconMap[item.icon] || Lightbulb;
                                    return (
                                        <div key={idx} className="group">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>
                                            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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
