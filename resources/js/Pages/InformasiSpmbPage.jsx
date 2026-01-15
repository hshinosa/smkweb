import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { 
    CheckCircle2, 
    MapPin, 
    Trophy, 
    HeartHandshake, 
    Truck, 
    Calendar, 
    ChevronDown, 
    ChevronUp, 
    Download, 
    ExternalLink, 
    HelpCircle,
    Info,
    MessageCircle,
    PlayCircle
} from 'lucide-react';

import Navbar from '@/Components/Navbar';
import SEOHead from '@/Components/SEOHead';
import { HeroImage } from '@/Components/ResponsiveImage';
import Footer from '@/Components/Footer';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { usePage } from '@inertiajs/react';

// --- FALLBACK DATA: JALUR PENDAFTARAN ---
const fallbackJalurData = [
    {
        id: 'zonasi',
        label: 'Zonasi',
        icon: MapPin,
        quota: '50%',
        description: 'Jalur pendaftaran bagi calon peserta didik yang berdomisili di dalam wilayah zonasi yang ditetapkan.',
        requirements: [
            'Kartu Keluarga (minimal 1 tahun)',
            'Akta Kelahiran / Surat Keterangan Lahir',
            'Ijazah / Surat Keterangan Lulus',
            'Titik koordinat tempat tinggal'
        ]
    },
    {
        id: 'prestasi',
        label: 'Prestasi',
        icon: Trophy,
        quota: '25%',
        description: 'Jalur bagi siswa dengan pencapaian akademik (nilai rapor) atau non-akademik (kejuaraan/lomba).',
        requirements: [
            'Nilai Rapor semester 1-5',
            'Sertifikat/Piagam Kejuaraan (min. tingkat Kota/Kab)',
            'Surat Tanggung Jawab Mutlak (SPTJM)',
            'Akta Kelahiran & KK'
        ]
    },
    {
        id: 'afirmasi',
        label: 'Afirmasi',
        icon: HeartHandshake,
        quota: '20%',
        description: 'Diperuntukkan bagi calon peserta didik dari keluarga ekonomi tidak mampu (KETM) dan penyandang disabilitas.',
        requirements: [
            'Kartu KIP / PKH / KKS / Terdaftar DTKS',
            'Surat Keterangan Tidak Mampu (jika ada)',
            'Akta Kelahiran & KK',
            'Surat Pernyataan Orang Tua'
        ]
    },
    {
        id: 'perpindahan',
        label: 'Perpindahan',
        icon: Truck,
        quota: '5%',
        description: 'Bagi calon peserta didik yang mengikuti perpindahan tugas orang tua/wali atau anak guru.',
        requirements: [
            'Surat Keputusan Pindah Tugas Orang Tua',
            'Surat Keterangan Domisili',
            'Akta Kelahiran & KK',
            'Ijazah / Surat Keterangan Lulus'
        ]
    }
];

// --- FALLBACK DATA: TIMELINE ---
const fallbackTimelineData = [
    { date: '15-20 Jun', title: 'Pendaftaran & Verifikasi', status: 'completed' },
    { date: '21-25 Jun', title: 'Uji Kompetensi (Prestasi)', status: 'active' },
    { date: '30 Jun', title: 'Pengumuman Hasil', status: 'upcoming' },
    { date: '1-3 Jul', title: 'Daftar Ulang', status: 'upcoming' },
];

// --- FALLBACK DATA: FAQ ---
const fallbackFaqData = [
    {
        question: "Bagaimana cara menghitung jarak zonasi?",
        answer: "Jarak zonasi dihitung berdasarkan garis lurus (point to point) dari koordinat domisili tempat tinggal calon peserta didik ke titik koordinat sekolah menggunakan sistem teknologi informasi."
    },
    {
        question: "Apakah bisa mendaftar di 2 jalur sekaligus?",
        answer: "Calon peserta didik dapat mendaftar pada tahap 1 (Afirmasi/Prestasi/Perpindahan) and jika tidak lolos, dapat mendaftar kembali pada tahap 2 (Zonasi). Namun, tidak bisa mendaftar 2 jalur berbeda dalam satu tahap yang sama."
    },
    {
        question: "Berapa nilai minimal untuk jalur prestasi rapor?",
        answer: "Tidak ada passing grade tetap. Seleksi dilakukan melalui pemeringkatan berdasarkan akumulasi rata-rata nilai rapor semester 1 s.d. 5 dari seluruh pendaftar."
    },
    {
        question: "Apakah sertifikat online diakui untuk jalur prestasi?",
        answer: "Sertifikat kejuaraan yang diakui adalah yang diselenggarakan oleh instansi pemerintah atau induk organisasi yang kompeten. Sertifikat webinar/partisipasi online biasanya tidak memiliki bobot poin yang signifikan."
    }
];

export default function InformasiSpmbPage({ spmbData }) {
    const { siteSettings } = usePage().props;
    const navigationData = getNavigationData(siteSettings);
    const { 
        pengaturan_umum, 
        jalur_pendaftaran, 
        jadwal_penting, 
        persyaratan, 
        prosedur, 
        faq 
    } = spmbData || {};

    // Map icons for jalur
    const getIconForJalur = (label) => {
        const l = label?.toLowerCase() || '';
        if (l.includes('zonasi')) return MapPin;
        if (l.includes('prestasi')) return Trophy;
        if (l.includes('afirmasi')) return HeartHandshake;
        if (l.includes('perpindahan')) return Truck;
        return CheckCircle2;
    };

    // Process Jalur Data
    const displayJalurData = jalur_pendaftaran?.items?.length > 0 
        ? jalur_pendaftaran.items.map((item, idx) => ({
            id: item.label?.toLowerCase().replace(/\s+/g, '-') || `jalur-${idx}`,
            label: item.label,
            icon: getIconForJalur(item.label),
            quota: item.quota || '0%',
            description: item.description || '',
            requirements: item.requirements || []
        }))
        : fallbackJalurData;

    const [activeTab, setActiveTab] = useState(displayJalurData[0]?.id || 'zonasi');
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const activeJalur = displayJalurData.find(j => j.id === activeTab) || displayJalurData[0];

    // Process Timeline Data
    const displayTimelineData = jadwal_penting?.items?.length > 0
        ? jadwal_penting.items
        : fallbackTimelineData;

    // Process FAQ Data
    const displayFaqData = faq?.items?.length > 0
        ? faq.items
        : fallbackFaqData;

    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';

    const renderHighlightedTitle = (title) => {
        if (!title) return null;
        
        // Target names to highlight
        const targets = [
            'SMA Negeri 1 Baleendah',
            'SMAN 1 Baleendah',
            siteName
        ].filter(Boolean);

        for (const schoolName of targets) {
            if (title.includes(schoolName)) {
                const parts = title.split(schoolName);
                return (
                    <>
                        {parts[0]}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            {schoolName}
                        </span>
                        {parts[1]}
                    </>
                );
            }
        }

        const words = title.split(' ');
        if (words.length <= 1) return title;
        const lastWord = words.pop();
        return (
            <>
                {words.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{lastWord}</span>
            </>
        );
    };

    // Helper to format image path correctly
    const formatImagePath = (path) => {
        if (!path) return null;
        if (typeof path !== 'string') return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    return (
        <div className="bg-white font-sans text-gray-800">
            <SEOHead 
                title={`${pengaturan_umum?.title || "Informasi PPDB"} 2025 - ${siteName}`}
                description="Informasi lengkap Penerimaan Peserta Didik Baru (PPDB) 2025 SMAN 1 Baleendah. Jadwal, syarat, jalur pendaftaran (zonasi, prestasi, afirmasi, perpindahan), prosedur, dan FAQ."
                keywords="PPDB 2025, PPDB Bandung, pendaftaran SMA, jalur zonasi, jalur prestasi, PPDB online, SMAN 1 Baleendah"
                image={pengaturan_umum?.hero_background_image || "/images/ppdb-2025-banner.jpg"}
            />
            
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            <main>
                {/* 1. HERO SECTION (High Energy) */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-32">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                    {pengaturan_umum?.banner_image && typeof pengaturan_umum.banner_image === 'object' ? (
                        <HeroImage media={pengaturan_umum.banner_image} alt={`Siswa ${siteName}`} />
                    ) : formatImagePath(pengaturan_umum?.banner_image_url) && (
                        <img 
                            src={formatImagePath(pengaturan_umum.banner_image_url)} 
                            alt={`Siswa ${siteName}`} 
                            className="w-full h-full object-cover"
                            loading="eager"
                            fetchpriority="high"
                            width="1920"
                            height="1080"
                        />
                    )}
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 animate-fade-in-up">
                            <span className="text-white font-bold text-sm tracking-wide uppercase">
                                PPDB Tahun Ajaran {pengaturan_umum?.registration_year || "2025/2026"}
                            </span>
                        </div>
                        <h1 className={`${TYPOGRAPHY.heroTitle} mb-6 drop-shadow-lg`}>
                            {renderHighlightedTitle(pengaturan_umum?.title || "Informasi Penerimaan Peserta Didik Baru")}
                        </h1>
                        <div 
                            className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto mb-10 opacity-95`}
                            dangerouslySetInnerHTML={{ __html: pengaturan_umum?.description_html || `Selamat datang di portal informasi pendaftaran siswa baru ${siteName}.` }}
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {pengaturan_umum?.is_registration_open ? (
                                <a 
                                    href="https://ppdb.jabarprov.go.id/" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-accent-yellow text-primary font-bold rounded-xl hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,193,7,0.5)] flex items-center gap-2"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Daftar Sekarang (Portal Jabar)
                                </a>
                            ) : (
                                <div 
                                    className="px-8 py-4 bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold rounded-xl backdrop-blur-sm prose prose-invert prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: pengaturan_umum?.announcement_text || "Pendaftaran Belum Dibuka" }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-50 -translate-x-1/2 z-20 animate-bounce hidden md:block">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-accent-yellow text-primary shadow-lg">
                            <ChevronDown className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Decorative Wave Bottom */}
                    <div className="absolute -bottom-6 left-0 right-0 w-full overflow-hidden leading-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-white block w-full h-auto">
                            <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                </section>

                {/* 2. SECTION: JALUR PENDAFTARAN (Interactive Tabs) */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className={TYPOGRAPHY.sectionHeading}>{jalur_pendaftaran?.title || "Jalur Pendaftaran"}</h2>
                            <p className={`${TYPOGRAPHY.bodyText} mt-4`}>
                                {jalur_pendaftaran?.description || "Pilih jalur yang sesuai dengan kualifikasi dan kebutuhan Anda."}
                            </p>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {displayJalurData.map((jalur) => {
                                const Icon = jalur.icon;
                                const isActive = activeTab === jalur.id;
                                return (
                                    <button
                                        key={jalur.id}
                                        onClick={() => setActiveTab(jalur.id)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 border-2 ${
                                            isActive 
                                                ? 'bg-primary border-primary text-white shadow-lg scale-105' 
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {jalur.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content Area */}
                        {activeJalur && (
                            <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 animate-fade-in-up">
                                <div className="flex flex-col md:flex-row gap-12">
                                    {/* Left: Description & Quota */}
                                    <div className="md:w-1/2">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-blue-100 rounded-xl text-primary">
                                                {React.createElement(activeJalur.icon, { size: 32 })}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{activeJalur.label}</h3>
                                                <span className="inline-block px-3 py-1 bg-accent-yellow/20 text-yellow-700 text-xs font-bold rounded-full mt-1">
                                                    Kuota: {activeJalur.quota}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                            {activeJalur.description}
                                        </p>
                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <p className="text-sm text-primary font-medium flex items-start gap-2">
                                                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                                                Pastikan Anda memilih jalur yang paling sesuai dengan kondisi dan prestasi Anda untuk memperbesar peluang diterima.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Requirements Checklist */}
                                    <div className="md:w-1/2 border-l border-gray-200 md:pl-12 pt-8 md:pt-0">
                                        <h4 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            Syarat Dokumen Utama
                                        </h4>
                                        <ul className="space-y-4">
                                            {activeJalur.requirements?.map((req, idx) => (
                                                <li key={idx} className="flex items-start gap-3 group">
                                                    <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    </div>
                                                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 2.5 SECTION: PROSEDUR & PERSYARATAN UMUM */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            {/* Prosedur Pendaftaran */}
                            <div>
                                <h2 className={`${TYPOGRAPHY.sectionHeading} mb-8 text-left`}>Prosedur <span className="text-primary">Pendaftaran</span></h2>
                                <div className="space-y-6">
                                    {(prosedur?.items || []).map((step, idx) => (
                                        <div key={idx} className="flex gap-6 group">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                                <div 
                                                    className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: step.description }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {(!prosedur?.items || prosedur.items.length === 0) && (
                                        <p className="text-gray-500 italic">Informasi prosedur pendaftaran akan segera diperbarui.</p>
                                    )}
                                </div>
                                
                                {prosedur?.contact_info && (
                                    <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                        <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                                            <MessageCircle className="w-5 h-5" />
                                            Bantuan Pendaftaran
                                        </h4>
                                        <div 
                                            className="text-sm text-gray-700 prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: prosedur.contact_info }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Persyaratan Umum */}
                            <div>
                                <h2 className={`${TYPOGRAPHY.sectionHeading} mb-8 text-left`}>Persyaratan <span className="text-primary">Umum</span></h2>
                                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                                    <ul className="space-y-4 mb-8">
                                        {(persyaratan?.items || []).map((doc, idx) => (
                                            <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-100">
                                                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${doc.required ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900">{doc.name}</span>
                                                        {doc.required && (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Wajib</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                        {(!persyaratan?.items || persyaratan.items.length === 0) && (
                                            <p className="text-gray-500 italic">Informasi persyaratan umum akan segera diperbarui.</p>
                                        )}
                                    </ul>

                                    {persyaratan?.additional_notes && (
                                        <div className="pt-6 border-t border-gray-100">
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <Info className="w-5 h-5 text-accent-yellow" />
                                                Catatan Penting
                                            </h4>
                                            <div 
                                                className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: persyaratan.additional_notes }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. SECTION: ALUR & JADWAL (Timeline) */}
                <section className="py-20 bg-secondary overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className={TYPOGRAPHY.sectionHeading}>{jadwal_penting?.title || "Alur & Jadwal Penting"}</h2>
                            <p className={`${TYPOGRAPHY.bodyText} mt-4`}>
                                {jadwal_penting?.description || "Catat tanggal-tanggal penting agar tidak tertinggal proses seleksi."}
                            </p>
                        </div>

                        <div className="relative max-w-5xl mx-auto">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                                {displayTimelineData.map((item, index) => (
                                    <div key={index} className="relative group">
                                        {/* Node Circle */}
                                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center border-4 transition-all duration-500 mb-6 bg-white ${
                                            item.status === 'completed' ? 'border-green-500 text-green-500' :
                                            item.status === 'active' ? 'border-primary text-primary shadow-[0_0_20px_rgba(13,71,161,0.3)] scale-110' :
                                            'border-gray-300 text-gray-400'
                                        }`}>
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="text-center bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                                                item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                item.status === 'active' ? 'bg-blue-100 text-primary' :
                                                'bg-gray-100 text-gray-500'
                                            }`}>
                                                {item.date}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. SECTION: FAQ (Accordion) */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className={TYPOGRAPHY.sectionHeading}>{faq?.title || "Pertanyaan Umum (FAQ)"}</h2>
                            <p className={`${TYPOGRAPHY.bodyText} mt-4`}>
                                {faq?.description || "Jawaban atas pertanyaan yang sering diajukan oleh calon siswa dan orang tua."}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {displayFaqData.map((faqItem, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none group"
                                    >
                                        <span className="font-bold text-gray-900 font-serif text-lg group-hover:text-primary transition-colors">{faqItem.question}</span>
                                        {openFaqIndex === index ? (
                                            <ChevronUp className="w-5 h-5 text-primary" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                    <div 
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                            openFaqIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                            {faqItem.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. SECTION: HELP CENTER (Sticky/Distinct) */}
                <section className="py-12 bg-primary text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-accent-yellow rounded-full flex items-center justify-center text-primary shadow-lg flex-shrink-0">
                                    <MessageCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Kesulitan Mendaftar?</h3>
                                    <p className="text-blue-100 text-lg">Tim Helpdesk PPDB kami siap membantu Anda setiap hari kerja.</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <a 
                                    href={`https://wa.me/${pengaturan_umum?.whatsapp_number || '628123456789'}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Chat WhatsApp
                                </a>
                                <a 
                                    href={pengaturan_umum?.video_guide_url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Panduan Video
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
                socialMediaLinks={navigationData.socialMediaLinks}
            />
        </div>
    );
}
