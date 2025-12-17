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

// Import utilities
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { pageMetadata } from '@/Utils/academicData';

const navigationData = getNavigationData();

export default function KurikulumPage() {
    // Programs Data
    const programs = [
        {
            title: "MIPA",
            fullName: "Matematika & Ilmu Pengetahuan Alam",
            icon: Microscope,
            description: "Program unggulan bagi siswa yang berminat dalam sains, teknologi, dan matematika. Fasilitas laboratorium lengkap.",
            link: "/akademik/program-studi/mipa",
            type: "MIPA"
        },
        {
            title: "IPS",
            fullName: "Ilmu Pengetahuan Sosial",
            icon: Globe,
            description: "Mendalami fenomena sosial, ekonomi, dan sejarah. Membentuk karakter kritis dan berwawasan luas.",
            link: "/akademik/program-studi/ips",
            type: "IPS"
        },
        {
            title: "Bahasa",
            fullName: "Ilmu Bahasa & Budaya",
            icon: BookOpen,
            description: "Eksplorasi bahasa asing dan seni budaya. Mempersiapkan siswa kompeten dalam komunikasi global.",
            link: "/akademik/program-studi/bahasa",
            type: "BAHASA"
        }
    ];

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
            <Head title={pageMetadata.kurikulum.title} description={pageMetadata.kurikulum.description} />

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
                    <img 
                        src="/images/hero-bg-sman1-baleendah.jpeg" 
                        alt="Background Kurikulum" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4`}>
                        Kurikulum & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Pembelajaran</span>
                    </h1>
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        Menerapkan Kurikulum Merdeka untuk menggali potensi unik setiap siswa.
                    </p>
                </div>
            </section>

            {/* 2. SECTION: INTRO KURIKULUM (The Concept) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                            Kurikulum <span className="text-primary">Merdeka</span>
                        </h2>
                        <p className={`${TYPOGRAPHY.bodyText}`}>
                            SMA Negeri 1 Baleendah menerapkan Kurikulum Merdeka yang memberikan fleksibilitas 
                            kepada siswa untuk memilih mata pelajaran sesuai dengan minat, bakat, dan aspirasi karier.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Row 1: Fase E */}
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            <div className="w-full md:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] group">
                                    <img 
                                        src="/images/hero-bg-sman1-baleendah.jpeg" 
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
                                <h3 className="text-3xl font-bold text-gray-900">Eksplorasi Minat & Bakat</h3>
                                <div className="h-1 w-20 bg-primary rounded-full"></div>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Pada fase ini, siswa difokuskan untuk mengenali potensi diri melalui pembelajaran mata pelajaran umum. 
                                    Siswa didorong untuk mengeksplorasi berbagai bidang ilmu sebelum menentukan pilihan spesifik di fase berikutnya.
                                </p>
                                <ul className="space-y-3 pt-2">
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-primary" fill="currentColor" />
                                        <span>Penguatan fondasi literasi & numerasi</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-primary" fill="currentColor" />
                                        <span>Proyek Penguatan Profil Pelajar Pancasila</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Row 2: Fase F */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
                            <div className="w-full md:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] group">
                                    <img 
                                        src="/images/panen-karya-sman1-baleendah.jpg" 
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
                                <h3 className="text-3xl font-bold text-gray-900">Pendalaman Materi & Penjurusan</h3>
                                <div className="h-1 w-20 bg-accent-yellow rounded-full"></div>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Siswa memilih mata pelajaran pilihan yang relevan dengan rencana studi lanjut atau karir. 
                                    Pembelajaran lebih mendalam dan terfokus untuk mempersiapkan kompetensi spesifik.
                                </p>
                                <ul className="space-y-3 pt-2">
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-accent-yellow" fill="currentColor" />
                                        <span>Pemilihan mata pelajaran peminatan</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-accent-yellow" fill="currentColor" />
                                        <span>Persiapan intensif menuju Perguruan Tinggi</span>
                                    </li>
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
                        {programs.map((program, idx) => (
                            <div key={idx} className="group flex flex-col items-center">
                                {/* Image Area - Floating above */}
                                <div className="h-80 w-full flex items-end justify-center overflow-visible z-0 pb-5">
                                    <img 
                                        src="/images/anak-sma-programstudi.png" 
                                        alt={program.fullName}
                                        className="h-full w-auto object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500" 
                                    />
                                </div>
                                
                                {/* Content Section */}
                                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative -mt-12 pt-10 flex-1 flex flex-col z-10 w-full">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <program.icon size={24} />
                                    </div>
                                    <h3 className={`${TYPOGRAPHY.cardTitle} mb-2`}>{program.fullName}</h3>
                                    <p className={`${TYPOGRAPHY.smallText} mb-8 leading-relaxed flex-1`}>
                                        {program.description}
                                    </p>
                                    <Link 
                                        href={program.link}
                                        className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-center block"
                                    >
                                        Lihat Mata Pelajaran
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. SECTION: SISTEM PENILAIAN (Elegant Data) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>Sistem Penilaian</h2>
                        <p className={`${TYPOGRAPHY.bodyText} max-w-2xl mx-auto`}>
                            Standar penilaian kompetensi siswa berdasarkan capaian pembelajaran.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            {/* Left: Description */}
                            <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-50">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Skala Penilaian</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Penilaian dilakukan secara komprehensif mencakup aspek pengetahuan, keterampilan, dan sikap. 
                                    Setiap predikat mencerminkan tingkat penguasaan kompetensi siswa.
                                </p>
                                <div className="flex items-center gap-2 text-primary font-medium">
                                    <Award className="w-5 h-5" />
                                    <span>Berbasis Kompetensi</span>
                                </div>
                            </div>

                            {/* Right: Data Points */}
                            <div className="p-8 md:p-12 space-y-6 bg-white">
                                <div className="flex items-center justify-between group">
                                    <div>
                                        <div className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Predikat A (Sangat Baik)</div>
                                        <div className="text-sm text-gray-500">Penguasaan materi sangat mendalam</div>
                                    </div>
                                    <div className="px-4 py-1 bg-blue-50 text-blue-600 font-bold rounded-full text-sm border border-blue-100">
                                        90 - 100
                                    </div>
                                </div>

                                <div className="flex items-center justify-between group">
                                    <div>
                                        <div className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Predikat B (Baik)</div>
                                        <div className="text-sm text-gray-500">Penguasaan materi baik</div>
                                    </div>
                                    <div className="px-4 py-1 bg-gray-50 text-gray-600 font-bold rounded-full text-sm border border-gray-200">
                                        80 - 89
                                    </div>
                                </div>

                                <div className="flex items-center justify-between group">
                                    <div>
                                        <div className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Predikat C (Cukup)</div>
                                        <div className="text-sm text-gray-500">Penguasaan materi cukup</div>
                                    </div>
                                    <div className="px-4 py-1 bg-gray-50 text-gray-600 font-bold rounded-full text-sm border border-gray-200">
                                        75 - 79
                                    </div>
                                </div>

                                <div className="flex items-center justify-between group">
                                    <div>
                                        <div className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Predikat D (Kurang)</div>
                                        <div className="text-sm text-gray-500">Perlu bimbingan intensif</div>
                                    </div>
                                    <div className="px-4 py-1 bg-gray-50 text-gray-600 font-bold rounded-full text-sm border border-gray-200">
                                        &lt; 75
                                    </div>
                                </div>
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
                                Tujuan Pembelajaran
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "Mengembangkan kemampuan berpikir kritis dan kreatif",
                                    "Membangun karakter berintegritas dan kepemimpinan",
                                    "Menguasai literasi digital dan teknologi",
                                    "Memiliki wawasan global dan kearifan lokal",
                                    "Siap melanjutkan ke perguruan tinggi unggulan"
                                ].map((goal, idx) => (
                                    <div key={idx} className="flex items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-white" fill="currentColor" />
                                        </div>
                                        <span className="text-lg font-medium">{goal}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metode (Glassmorphism Cards) */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-8 text-white">
                                Metode Pembelajaran
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group text-center">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Lightbulb className="w-8 h-8 text-blue-300" fill="currentColor" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Project Based</h3>
                                    <p className="text-gray-400 text-sm">Pembelajaran berbasis proyek nyata untuk solusi kreatif.</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group text-center">
                                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Users className="w-8 h-8 text-purple-300" fill="currentColor" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Collaborative</h3>
                                    <p className="text-gray-400 text-sm">Kerja sama tim untuk membangun soft skills.</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group text-center sm:col-span-2">
                                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Monitor className="w-8 h-8 text-cyan-300" fill="currentColor" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Digital Integration</h3>
                                    <p className="text-gray-400 text-sm">Pemanfaatan LMS dan teknologi terkini dalam KBM.</p>
                                </div>
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