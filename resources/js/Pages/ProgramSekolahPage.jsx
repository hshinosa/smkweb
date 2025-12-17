// FILE: resources/js/Pages/ProgramSekolahPage.jsx

import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { 
    Search, ChevronLeft, ChevronRight, X, ArrowRight,
    Leaf, Lightbulb, Users, Microscope, BookOpen
} from 'lucide-react';

const navigationData = getNavigationData();

// --- DATA PROGRAM ---
const programCategories = ["Semua", "Akademik", "Karakter & Agama", "Lingkungan", "Inovasi"];

const allPrograms = [
    { 
        id: 1, 
        title: "Program Hafidz & Kajian Muslim", 
        category: "Karakter & Agama",
        icon: BookOpen,
        color: "bg-blue-100 text-blue-600",
        description: "Program pembinaan keagamaan intensif untuk mencetak generasi penghafal Al-Qur'an dan memperdalam pemahaman nilai-nilai Islam yang rahmatan lil alamin." 
    },
    { 
        id: 2, 
        title: "Gerakan Memungut Sampah (GMS)", 
        category: "Lingkungan",
        icon: Leaf,
        color: "bg-green-100 text-green-600",
        description: "Inisiatif sekolah untuk menumbuhkan kesadaran lingkungan melalui pembiasaan memungut sampah sebelum dan sesudah kegiatan belajar mengajar." 
    },
    { 
        id: 3, 
        title: "Pengembangan Lab Sains & Bahasa", 
        category: "Akademik",
        icon: Microscope,
        color: "bg-purple-100 text-purple-600",
        description: "Modernisasi fasilitas laboratorium sains dan bahasa dengan peralatan terkini untuk mendukung pembelajaran praktikum yang efektif dan menyenangkan." 
    },
    { 
        id: 4, 
        title: "Implementasi Jabar Masagi & P5", 
        category: "Karakter & Agama",
        icon: Users,
        color: "bg-orange-100 text-orange-600",
        description: "Penguatan karakter siswa melalui nilai-nilai kearifan lokal Jawa Barat dan Proyek Penguatan Profil Pelajar Pancasila." 
    },
    { 
        id: 5, 
        title: "Pembelajaran Berbasis Proyek (PjBL)", 
        category: "Inovasi",
        icon: Lightbulb,
        color: "bg-yellow-100 text-yellow-600",
        description: "Metode pembelajaran inovatif yang mendorong siswa untuk berpikir kritis dan kreatif dalam memecahkan masalah nyata melalui proyek kolaboratif." 
    },
    { 
        id: 6, 
        title: "Kelas Unggulan MIPA & IPS", 
        category: "Akademik",
        icon: Microscope,
        color: "bg-indigo-100 text-indigo-600",
        description: "Program kelas khusus dengan kurikulum pengayaan untuk mempersiapkan siswa menghadapi kompetisi sains nasional dan seleksi masuk perguruan tinggi favorit." 
    },
    { 
        id: 7, 
        title: "Sekolah Pencetak Wirausaha (SPW)", 
        category: "Inovasi",
        icon: Lightbulb,
        color: "bg-red-100 text-red-600",
        description: "Program pelatihan kewirausahaan bagi siswa untuk mengembangkan mindset bisnis dan keterampilan manajerial sejak dini." 
    },
    { 
        id: 8, 
        title: "Program Sekolah Ramah Anak", 
        category: "Karakter & Agama",
        icon: Users,
        color: "bg-pink-100 text-pink-600",
        description: "Menciptakan lingkungan sekolah yang aman, nyaman, dan inklusif bagi seluruh warga sekolah, serta bebas dari perundungan." 
    }
];

export default function ProgramSekolahPage({ auth }) {
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filtering Logic
    const filteredPrograms = useMemo(() => {
        return allPrograms.filter(program => {
            const matchesCategory = activeCategory === "Semua" || program.category === activeCategory;
            const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm]);

    const openModal = (program) => {
        setSelectedProgram(program);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white font-sans text-gray-800 min-h-screen flex flex-col">
            <Head title="Program Unggulan - SMAN 1 Baleendah" description="Program dan kegiatan unggulan di SMAN 1 Baleendah." />

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
                    <img 
                        src="/images/hero-bg-sman1-baleendah.jpeg" 
                        alt="Background Program Sekolah" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300`}>
                        Program Unggulan
                    </h1>
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        Membangun karakter dan kompetensi siswa melalui berbagai inisiatif positif.
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
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${program.color}`}>
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
                        <div className={`p-8 ${selectedProgram.color.replace('text-', 'bg-').replace('100', '50')} flex items-center justify-between`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 bg-white rounded-xl shadow-sm`}>
                                    <selectedProgram.icon size={32} className={selectedProgram.color.split(' ')[1]} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.title}</h2>
                                    <span className={`text-sm font-semibold ${selectedProgram.color.split(' ')[1]}`}>
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