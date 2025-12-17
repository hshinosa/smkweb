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
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';

const navigationData = getNavigationData();

// --- MOCK DATA ---
const alumniStats = [
    { label: "Alumni", value: "15.000+", icon: Users },
    { label: "Lulusan di PTN Favorit", value: "85%", icon: Building2 },
    { label: "Karir BUMN/Multinasional", value: "Berkarir", icon: Briefcase },
];

const featuredAlumni = {
    name: "Dr. Asep Suherman, Sp.PD",
    role: "Kepala RSUD Al-Ihsan",
    batch: "Angkatan 1998",
    quote: "SMAN 1 Baleendah mengajarkan saya disiplin dan integritas yang menjadi fondasi karir saya di dunia kesehatan. Guru-guru yang dedikatif membuat masa sekolah menjadi pengalaman tak terlupakan.",
    image: "https://placehold.co/600x800/0D47A1/FFFFFF?text=Dr.+Asep",
};

const alumniTestimonials = [
    {
        id: 1,
        name: "Rina Wulandari",
        batch: "Alumni 2015",
        role: "Software Engineer at Gojek",
        education: "Teknik Informatika - ITB",
        category: "Teknik/Engineering",
        quote: "Fasilitas lab komputer di sekolah sangat membantu saya mengenal dunia coding sejak dini. Terima kasih SMAN 1 Baleendah!",
        image: "https://placehold.co/100x100/0D47A1/FFFFFF?text=RW"
    },
    {
        id: 2,
        name: "Budi Santoso",
        batch: "Alumni 2010",
        role: "Founder & CEO Kopi Kenangan",
        education: "Manajemen Bisnis - UI",
        category: "Bisnis",
        quote: "Jiwa kepemimpinan saya ditempa melalui organisasi OSIS. Pengalaman itu sangat berharga saat membangun bisnis sendiri.",
        image: "https://placehold.co/100x100/0D47A1/FFFFFF?text=BS"
    },
    {
        id: 3,
        name: "Siti Aminah",
        batch: "Alumni 2018",
        role: "Dokter Muda",
        education: "Kedokteran - UNPAD",
        category: "Kedokteran",
        quote: "Dukungan guru-guru biologi sangat luar biasa dalam membimbing saya menembus ketatnya persaingan masuk FK.",
        image: "https://placehold.co/100x100/0D47A1/FFFFFF?text=SA"
    },
    {
        id: 4,
        name: "Reza Rahadian",
        batch: "Alumni 2012",
        role: "Arsitek",
        education: "Arsitektur - UGM",
        category: "Teknik/Engineering",
        quote: "Seni dan matematika diajarkan dengan seimbang, membuat saya mencintai dunia arsitektur.",
        image: "https://placehold.co/100x100/0D47A1/FFFFFF?text=RR"
    },
    {
        id: 5,
        name: "Dewi Sartika",
        batch: "Alumni 2016",
        role: "Diplomat",
        education: "Hubungan Internasional - UGM",
        category: "Pemerintahan",
        quote: "Kemampuan bahasa asing saya terasah berkat klub bahasa di sekolah. Sangat berguna untuk karir saya sekarang.",
        image: "https://placehold.co/100x100/0D47A1/FFFFFF?text=DS"
    },
    {
        id: 6,
        name: "Andi Wijaya",
        batch: "Alumni 2014",
        role: "Seniman Visual",
        education: "DKV - ISI Yogyakarta",
        category: "Seni & Media",
        quote: "Sekolah memberikan ruang ekspresi yang luas bagi siswa yang berminat di bidang seni.",
        image: "https://placehold.co/100x100/0D47A1/FFFFFF?text=AW"
    },
];

const categories = ["Semua", "Kedokteran", "Teknik/Engineering", "Bisnis", "Seni & Media", "Pemerintahan"];

// --- COMPONENTS ---

const AlumniCard = ({ alumni }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 relative overflow-hidden mb-6 break-inside-avoid">
        {/* Background Accent */}
        <Quote className="absolute top-4 right-4 w-16 h-16 text-gray-100 opacity-50 rotate-180" />
        
        <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <img 
                    src={alumni.image} 
                    alt={alumni.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                    <h4 className="font-bold text-gray-900 font-serif">{alumni.name}</h4>
                    <p className="text-xs text-primary font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        {alumni.batch}
                    </p>
                </div>
            </div>

            {/* Quote */}
            <p className="text-gray-600 italic text-sm leading-relaxed mb-6 line-clamp-4">
                "{alumni.quote}"
            </p>

            {/* Footer Info */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{alumni.role}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-500">
                    <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{alumni.education}</span>
                </div>
            </div>
        </div>
    </div>
);

export default function AlumniPage() {
    const [activeCategory, setActiveCategory] = useState("Semua");

    const filteredAlumni = activeCategory === "Semua" 
        ? alumniTestimonials 
        : alumniTestimonials.filter(a => a.category === activeCategory);

    return (
        <div className="bg-secondary font-sans text-gray-800">
            <Head title="Jejak Alumni - SMAN 1 Baleendah" />
            
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            <main>
                {/* 1. HERO SECTION */}
                <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-20">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/hero-bg-sman1-baleendah.jpeg" 
                            alt="Background" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className={`${TYPOGRAPHY.heroTitle} mb-6 max-w-4xl mx-auto`}>
                            Jejak Langkah <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                Alumni Smansa
                            </span>
                        </h1>
                        <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto mb-10 opacity-90`}>
                            Ribuan cerita sukses bermula dari sini. Tersebar di berbagai Universitas Top dan Perusahaan Multinasional, membawa nama baik almamater.
                        </p>
                    </div>
                </section>

                {/* 2. ALUMNI SPOTLIGHT */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-secondary rounded-3xl overflow-hidden shadow-2xl max-w-6xl mx-auto">
                            <div className="flex flex-col lg:flex-row">
                                {/* Image Side */}
                                <div className="lg:w-2/5 relative min-h-[400px]">
                                    <img 
                                        src={featuredAlumni.image} 
                                        alt={featuredAlumni.name} 
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10"></div>
                                </div>
                                
                                {/* Content Side */}
                                <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow/20 text-yellow-700 text-xs font-bold uppercase tracking-wider w-fit mb-6">
                                        <Award className="w-4 h-4" />
                                        Success Story
                                    </div>
                                    
                                    <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-relaxed mb-8">
                                        "{featuredAlumni.quote}"
                                    </blockquote>
                                    
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{featuredAlumni.name}</h3>
                                        <p className="text-primary font-medium">{featuredAlumni.role}</p>
                                        <p className="text-gray-500 text-sm mt-1">{featuredAlumni.batch}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. WALL OF VOICES */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className={TYPOGRAPHY.sectionHeading}>Apa Kata Alumni?</h2>
                            <p className={`${TYPOGRAPHY.bodyText} mt-4 max-w-2xl mx-auto`}>
                                Dengar langsung pengalaman mereka selama bersekolah di SMAN 1 Baleendah.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {categories.map((cat) => (
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
                                Apakah Anda Alumni SMAN 1 Baleendah?
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Mari berbagi cerita inspiratif Anda untuk memotivasi adik-adik kelas dan mempererat tali silaturahmi keluarga besar SMAN 1 Baleendah.
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
