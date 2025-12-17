// FILE: resources/js/Pages/ProfilSekolahPage.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Check, Star, Target, MapPin, Building, Trophy, Users } from 'lucide-react';
// Import typography constants
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';

// Get navigation data from centralized source
const navigationData = getNavigationData();

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

export default function ProfilSekolahPage({ auth }) {
    return (
        <div className="bg-white font-sans text-gray-800">
            <Head title="Profil & Sejarah - SMAN 1 Baleendah" description="Mengenal lebih dekat sejarah, visi, misi, dan fasilitas SMAN 1 Baleendah." />

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
                    <img 
                        src="/images/hero-bg-sman1-baleendah.jpeg" 
                        alt="Gedung SMAN 1 Baleendah" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4 drop-shadow-lg`}>
                        Mengenal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">SMAN 1 Baleendah</span>
                    </h1>
                </div>
            </section>

            {/* SECTION B: HISTORY TIMELINE */}
            <section className="py-20 bg-gray-50 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                            Jejak Langkah <span className="text-primary">Kami</span>
                        </h2>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Center Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 rounded-full hidden md:block"></div>

                        <div className="space-y-12">
                            {timelineEvents.map((event, idx) => (
                                <div key={idx} className={`flex flex-col md:flex-row items-center justify-between ${event.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Content Side */}
                                    <div className="w-full md:w-5/12 mb-8 md:mb-0">
                                        <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 border-primary hover:shadow-xl transition-shadow duration-300 ${event.side === 'right' ? 'md:text-right md:border-l-0 md:border-r-4' : ''}`}>
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
                            Lingkungan Belajar <span className="text-primary">Modern</span>
                        </h2>
                        <p className={`${TYPOGRAPHY.bodyText} max-w-2xl mx-auto`}>
                            Fasilitas lengkap yang mendukung pengembangan akademik dan karakter siswa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facilities.map((facility, idx) => (
                            <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] cursor-pointer">
                                <img 
                                    src={facility.image} 
                                    alt={facility.name} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <h3 className="text-xl font-bold text-white mb-1">{facility.name}</h3>
                                    <div className="h-1 w-12 bg-accent-yellow rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
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