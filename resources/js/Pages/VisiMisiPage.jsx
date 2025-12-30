// FILE: resources/js/Pages/VisiMisiPage.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SEOHead from '@/Components/SEOHead';
import { HeroImage } from '@/Components/ResponsiveImage';
import { Check, Star, Target } from 'lucide-react';
// Import typography constants
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { usePage } from '@inertiajs/react';

export default function VisiMisiPage({ auth, visionMission, hero }) {
    const { siteSettings } = usePage().props;
    const navigationData = getNavigationData(siteSettings);
    const { vision, mission, goals } = visionMission || {};

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

    return (
        <div className="bg-white font-sans text-gray-800">
            <SEOHead 
                title={`${hero?.title || 'Visi & Misi'} - SMAN 1 Baleendah`}
                description="Visi dan Misi SMA Negeri 1 Baleendah. Membentuk peserta didik berakhlak mulia, berprestasi akademik tinggi, bercarakter kuat, dan berwawasan global."
                keywords="visi misi, tujuan sekolah, nilai nilai sekolah, SMAN 1 Baleendah"
                image={hero?.background_image || "/images/visi-misi-banner.jpg"}
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
                        <HeroImage media={hero.backgroundImage} alt="Background Visi Misi" />
                    ) : (
                        <HeroImage 
                            src={formatImagePath(hero?.image_url) || "/images/hero-bg-sman1-baleendah.jpeg"} 
                            alt="Background Visi Misi" 
                        />
                    )}
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4 drop-shadow-lg`}>
                        {renderHighlightedTitle(hero?.title || 'Visi & Misi Sekolah')}
                    </h1>
                </div>
            </section>

            {/* SECTION C: VISI & MISI */}
            <section className="py-20 bg-white border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
                        {/* Left Card (VISI) */}
                        <div className="bg-primary rounded-3xl p-10 md:p-14 text-white relative overflow-hidden flex flex-col justify-center shadow-xl group">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                            
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                    <Star className="text-accent-yellow w-8 h-8" fill="currentColor" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 border-b border-white/20 pb-4 inline-block">
                                    Visi Sekolah
                                </h2>
                                <p className="text-xl md:text-2xl leading-relaxed font-medium italic text-blue-50">
                                    "{vision || "Terwujudnya Peserta Didik yang Beriman, Cerdas, Terampil, Mandiri, dan Berwawasan Global."}"
                                </p>
                            </div>
                        </div>

                        {/* Right Card (MISI) */}
                        <div className="bg-white rounded-3xl p-10 md:p-14 border-2 border-accent-yellow shadow-xl flex flex-col justify-center relative">
                            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
                                <Target className="text-yellow-600 w-8 h-8" />
                            </div>
                            <h2 className={`${TYPOGRAPHY.sectionHeading} mb-6`}>
                                Misi Sekolah
                            </h2>
                            <ul className="space-y-4">
                                {(mission || []).map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-4 group">
                                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className={TYPOGRAPHY.bodyText}>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION D: GOALS */}
            {goals && goals.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className={TYPOGRAPHY.sectionHeading}>
                                Tujuan Strategis <span className="text-primary">Sekolah</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {goals.map((goal, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-primary">
                                    <p className="text-gray-700 font-medium">{goal}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />
        </div>
    );
}