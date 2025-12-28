import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    MapPin, 
    TrendingUp, 
    Users, 
    Scale, 
    Briefcase, 
    Newspaper, 
    Quote,
    Globe,
    Landmark
} from 'lucide-react';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { getPageMetadata } from '@/Utils/academicData';
import { usePage } from '@inertiajs/react';

export default function ProgramIpsPage({ content }) {
    const { siteSettings } = usePage().props;
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';
    const navigationData = getNavigationData(siteSettings);
    const pageMetadata = getPageMetadata(siteName);
    const { hero, core_subjects, facilities, career_paths, alumni_spotlight } = content || {};

    // Helper to format image path correctly
    const formatImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    const renderHighlightedTitle = (title) => {
        if (!title) return null;
        return (
            <>
                Program Studi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{title}</span>
            </>
        );
    };

    return (
        <div className="bg-white font-sans text-gray-800">
            <Head title={hero?.title || pageMetadata.ips.title} description={hero?.description || pageMetadata.ips.description} />
            
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* 1. HERO SECTION (Immersive) */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={formatImagePath(hero?.background_image) || "/images/hero-bg-sman1-baleendah.jpeg"} 
                        alt="Ilmu Pengetahuan Sosial" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 animate-fade-in-up">
                        <span className="text-white font-bold text-sm tracking-wide uppercase">Terakreditasi A (Unggul)</span>
                    </div>
                    
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-6 max-w-4xl mx-auto`}>
                        {renderHighlightedTitle("Ilmu Pengetahuan Sosial")}
                    </h1>
                    
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        {hero?.description || "Membentuk pemikir kritis dan analis sosial yang peka terhadap dinamika masyarakat global serta siap menjadi pemimpin masa depan."}
                    </p>
                </div>
            </section>

            {/* 2. CORE SUBJECTS (Glass Cards) */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                            {core_subjects?.title || "Mata Pelajaran"} <span className="text-primary">Inti</span>
                        </h2>
                        <p className={TYPOGRAPHY.bodyText}>
                            {core_subjects?.description || "Kurikulum komprehensif untuk membangun wawasan sosial, ekonomi, dan pemahaman geopolitik."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {core_subjects?.items && core_subjects.items.length > 0 ? (
                            core_subjects.items.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300">
                                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 overflow-hidden">
                                        {item.icon ? (
                                            <img src={item.icon} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="w-8 h-8 text-orange-600 transition-colors" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <>
                                {/* Sosiologi */}
                                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300">
                                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                        <Users className="w-8 h-8 text-orange-600 transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Sosiologi</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Studi interaksi sosial, struktur masyarakat, and pemecahan masalah sosial kontemporer.
                                    </p>
                                </div>

                                {/* Ekonomi */}
                                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                        <TrendingUp className="w-8 h-8 text-blue-600 transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Ekonomi</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Prinsip ekonomi, akuntansi, dan manajemen untuk memahami dinamika pasar dan kesejahteraan.
                                    </p>
                                </div>

                                {/* Geografi */}
                                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300">
                                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                        <MapPin className="w-8 h-8 text-green-600 transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Geografi</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Analisis spasial, lingkungan, dan interaksi manusia dengan alam dalam konteks global.
                                    </p>
                                </div>

                                {/* Sejarah */}
                                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300">
                                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                        <BookOpen className="w-8 h-8 text-red-600 transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Sejarah</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Memahami masa lalu untuk membangun masa depan melalui analisis peristiwa dan perubahan sosial.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. FACILITIES (Photo Gallery) */}
            <section className="py-24 bg-white">
                <style>{`
                    @keyframes scroll-vertical {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    .animate-scroll-vertical {
                        animation: scroll-vertical 20s linear infinite;
                    }
                    .pause-hover:hover .animate-scroll-vertical {
                        animation-play-state: paused;
                    }
                `}</style>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div className="max-w-2xl">
                            <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                                {facilities?.title || "Fasilitas Penunjang"}
                            </h2>
                            <p className={TYPOGRAPHY.bodyText}>
                                {facilities?.description || "Sarana modern untuk mendukung riset sosial, diskusi, dan pembelajaran interaktif."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                        {/* Left Column: Main Static Item */}
                        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden group shadow-lg h-full">
                            <img 
                                src={facilities?.main_image || "/images/hero-bg-sman1-baleendah.jpeg"} 
                                alt={facilities?.main_title || "Fasilitas Utama"} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 left-0 p-8">
                                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full mb-3 inline-block">Utama</span>
                                <h3 className="text-2xl font-bold text-white font-serif">{facilities?.main_title || "Perpustakaan & Ruang Diskusi"}</h3>
                                <p className="text-gray-300 mt-2 max-w-md">{facilities?.main_description || "Koleksi literatur sosial lengkap dengan ruang diskusi yang nyaman untuk debat dan kajian."}</p>
                            </div>
                        </div>

                        {/* Right Column: Vertical Marquee */}
                        <div className="lg:col-span-1 relative rounded-3xl overflow-hidden bg-gray-100 h-full pause-hover">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="animate-scroll-vertical flex flex-col gap-4 p-4">
                                    {/* Duplicated items for seamless loop */}
                                    {facilities?.items && facilities.items.length > 0 ? (
                                        [...facilities.items, ...facilities.items].map((item, idx) => (
                                            <div key={idx} className="relative rounded-2xl overflow-hidden shadow-md h-48 flex-shrink-0 group/item">
                                                <img 
                                                    src={item.image || "/images/hero-bg-sman1-baleendah.jpeg"} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/0 transition-colors"></div>
                                                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                                                    <p className="text-white font-bold text-sm">{item.title}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        [1, 2, 3, 4, 1, 2, 3, 4].map((item, idx) => (
                                            <div key={idx} className="relative rounded-2xl overflow-hidden shadow-md h-48 flex-shrink-0 group/item">
                                                <img 
                                                    src={idx % 2 === 0 ? "/images/hero-bg-sman1-baleendah.jpeg" : "/images/anak-sma.png"} 
                                                    alt={`Facility ${item}`} 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/0 transition-colors"></div>
                                                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                                                    <p className="text-white font-bold text-sm">
                                                        {idx % 2 === 0 ? "Lab Komputer IPS" : "Ruang Multimedia"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* Gradient overlays to mask edges */}
                            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/20 to-transparent z-10 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/20 to-transparent z-10 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. ALUMNI & PROSPEK (Split View) */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Left Column: Career Paths */}
                        <div>
                            <h2 className={`${TYPOGRAPHY.sectionHeading} mb-6`}>
                                {career_paths?.title || "Membuka Jalan Menuju Karir Profesional"}
                            </h2>
                            <p className={`${TYPOGRAPHY.bodyText} mb-10`}>
                                {career_paths?.description || `Lulusan Program IPS ${siteName} memiliki kompetensi tinggi untuk bersaing di perguruan tinggi negeri dan berbagai sektor strategis.`}
                            </p>

                            <div className="space-y-6">
                                {career_paths?.items && career_paths.items.length > 0 ? (
                                    career_paths.items.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg overflow-hidden w-12 h-12 flex items-center justify-center">
                                                {item.icon ? (
                                                    <img src={item.icon} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Briefcase className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                                                <p className="text-sm text-gray-600">{item.description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300">
                                            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                                                <Scale className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">Hukum & Politik</h4>
                                                <p className="text-sm text-gray-600">Pengacara, Hakim, Diplomat, Analis Kebijakan Publik.</p>
                                            </div>
                                        </div>
                                        {/* ... other static items */}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Alumni Spotlight (Landing Page Style) */}
                        <div className="relative mt-12 lg:mt-0">
                            <div className="group relative flex flex-col h-full max-w-md mx-auto">
                                {/* Image Area - Floating above */}
                                <div className="h-80 w-full flex items-end justify-center overflow-visible z-0 pb-5">
                                    <img 
                                        src={alumni_spotlight?.image || "/images/anak-sma.png"} 
                                        alt={alumni_spotlight?.name || "Alumni Sukses"}
                                        className="h-full w-auto object-contain drop-shadow-xl transition-transform duration-500" 
                                    />
                                </div>
                                
                                {/* Content Section */}
                                <div className="bg-white rounded-3xl p-8 shadow-xl transition-all duration-300 border border-gray-100 relative -mt-12 pt-10 flex-1 flex flex-col z-10 w-full text-center">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-transform duration-300">
                                        <Quote size={20} fill="currentColor" />
                                    </div>
                                    
                                    <blockquote className="text-gray-600 italic text-lg mb-6 leading-relaxed">
                                        "{alumni_spotlight?.quote || `Kemampuan analisis sosial dan public speaking yang saya asah di ${siteName} menjadi modal utama saya saat menempuh pendidikan Hukum di Universitas Padjadjaran.`}"
                                    </blockquote>
                                    
                                    <div className="border-t border-gray-100 pt-6">
                                        <h3 className="font-bold text-gray-900 text-xl font-serif">{alumni_spotlight?.name || "Sarah Amalia, S.H."}</h3>
                                        <p className="text-primary font-medium text-sm">{alumni_spotlight?.description || "Alumni 2019 • Fakultas Hukum UNPAD"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 5. CTA SECTION (Consistent with Landing Page) */}
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
        </div>
    );
}
