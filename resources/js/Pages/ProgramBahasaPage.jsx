import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Globe, 
    Languages, 
    Users, 
    Mic, 
    PenTool, 
    GraduationCap, 
    Quote,
    Briefcase,
    Newspaper
} from 'lucide-react';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';

const navigationData = getNavigationData();

export default function ProgramBahasaPage() {
    return (
        <div className="bg-white font-sans text-gray-800">
            <Head title="Program Bahasa - SMAN 1 Baleendah" description="Program Studi Bahasa dan Budaya SMAN 1 Baleendah" />
            
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
                        src="/images/hero-bg-sman1-baleendah.jpeg" 
                        alt="Program Bahasa SMAN 1 Baleendah" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 animate-fade-in-up">
                        <span className="text-white font-bold text-sm tracking-wide uppercase">Terakreditasi A (Unggul)</span>
                    </div>
                    
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-6 max-w-4xl mx-auto`}>
                        Bahasa & <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-300">
                            Ilmu Budaya
                        </span>
                    </h1>
                    
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        Membuka jendela dunia melalui penguasaan bahasa asing, literasi sastra, dan pemahaman lintas budaya yang mendalam.
                    </p>
                </div>
            </section>

            {/* 2. CORE SUBJECTS (Glass Cards) */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                            Mata Pelajaran <span className="text-primary">Inti</span>
                        </h2>
                        <p className={TYPOGRAPHY.bodyText}>
                            Kurikulum yang dirancang untuk mengasah kemampuan komunikasi, analisis kritis, dan kreativitas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Sastra Indonesia */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                <BookOpen className="w-8 h-8 text-red-600 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Sastra Indonesia</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Analisis karya sastra klasik & modern, penulisan kreatif, dan jurnalistik.
                            </p>
                        </div>

                        {/* Bahasa Inggris */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                <Globe className="w-8 h-8 text-blue-600 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Bahasa Inggris</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Komunikasi global, literatur dunia, public speaking, dan debat bahasa Inggris.
                            </p>
                        </div>

                        {/* Bahasa Asing Lain */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300">
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                <Languages className="w-8 h-8 text-purple-600 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Bahasa Asing</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Penguasaan bahasa ketiga (Jepang/Jerman/Perancis) untuk daya saing internasional.
                            </p>
                        </div>

                        {/* Antropologi */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                <Users className="w-8 h-8 text-orange-600 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Antropologi</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Memahami keragaman budaya, struktur masyarakat, dan perilaku manusia.
                            </p>
                        </div>
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
                                Fasilitas <span className="text-primary">Penunjang</span>
                            </h2>
                            <p className={TYPOGRAPHY.bodyText}>
                                Lingkungan belajar yang mendukung pengembangan kemampuan bahasa dan ekspresi seni.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                        {/* Left Column: Main Static Item */}
                        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden group shadow-lg h-full">
                            <img 
                                src="/images/hero-bg-sman1-baleendah.jpeg" 
                                alt="Laboratorium Bahasa" 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 left-0 p-8">
                                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-3 inline-block">Utama</span>
                                <h3 className="text-2xl font-bold text-white font-serif">Laboratorium Bahasa Multimedia</h3>
                                <p className="text-gray-300 mt-2 max-w-md">Dilengkapi perangkat audio-visual modern untuk latihan listening dan speaking yang efektif.</p>
                            </div>
                        </div>

                        {/* Right Column: Vertical Marquee */}
                        <div className="lg:col-span-1 relative rounded-3xl overflow-hidden bg-gray-100 h-full pause-hover">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="animate-scroll-vertical flex flex-col gap-4 p-4">
                                    {/* Duplicated items for seamless loop */}
                                    {[1, 2, 3, 4, 1, 2, 3, 4].map((item, idx) => (
                                        <div key={idx} className="relative rounded-2xl overflow-hidden shadow-md h-48 flex-shrink-0 group/item">
                                            <img 
                                                src={idx % 2 === 0 ? "/images/hero-bg-sman1-baleendah.jpeg" : "/images/anak-sma.png"} 
                                                alt={`Facility ${item}`} 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/0 transition-colors"></div>
                                            <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                                                <p className="text-white font-bold text-sm">
                                                    {idx % 2 === 0 ? "Perpustakaan Lengkap" : "Ruang Seni & Teater"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
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
                                Membuka Jalan Menuju <br/>
                                <span className="text-primary">Karir Global</span>
                            </h2>
                            <p className={`${TYPOGRAPHY.bodyText} mb-10`}>
                                Lulusan Program Bahasa memiliki keunggulan komunikasi dan adaptabilitas budaya yang tinggi, membuka peluang karir di kancah internasional.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Hubungan Internasional</h4>
                                        <p className="text-sm text-gray-600">Diplomat, Staff Kedutaan, NGO Internasional, Penerjemah.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300">
                                    <div className="p-3 bg-pink-50 text-pink-600 rounded-lg">
                                        <Newspaper className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Media & Komunikasi</h4>
                                        <p className="text-sm text-gray-600">Jurnalis, Public Relations, Content Creator, Broadcaster.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300">
                                    <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Pendidikan & Budaya</h4>
                                        <p className="text-sm text-gray-600">Dosen, Guru Bahasa, Penulis, Editor, Peneliti Budaya.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Alumni Spotlight (Landing Page Style) */}
                        <div className="relative mt-12 lg:mt-0">
                            <div className="group relative flex flex-col h-full max-w-md mx-auto">
                                {/* Image Area - Floating above */}
                                <div className="h-80 w-full flex items-end justify-center overflow-visible z-0 pb-5">
                                    <img 
                                        src="/images/anak-sma.png" 
                                        alt="Alumni Sukses"
                                        className="h-full w-auto object-contain drop-shadow-xl transition-transform duration-500" 
                                    />
                                </div>
                                
                                {/* Content Section */}
                                <div className="bg-white rounded-3xl p-8 shadow-xl transition-all duration-300 border border-gray-100 relative -mt-12 pt-10 flex-1 flex flex-col z-10 w-full text-center">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-transform duration-300">
                                        <Quote size={20} fill="currentColor" />
                                    </div>
                                    
                                    <blockquote className="text-gray-600 italic text-lg mb-6 leading-relaxed">
                                        "Kemampuan bahasa asing yang saya asah di SMAN 1 Baleendah membuka peluang beasiswa ke luar negeri dan karir di perusahaan multinasional."
                                    </blockquote>
                                    
                                    <div className="border-t border-gray-100 pt-6">
                                        <h3 className="font-bold text-gray-900 text-xl font-serif">Sarah Amalia</h3>
                                        <p className="text-primary font-medium text-sm">Alumni 2019 • Hubungan Internasional UGM</p>
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
                        Siap Menjadi Bagian dari <br/> Keluarga Besar SMAN 1 Baleendah?
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
