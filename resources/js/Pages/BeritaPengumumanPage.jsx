import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Search, 
    Calendar, 
    ChevronRight, 
    TrendingUp, 
    Bell, 
    Newspaper, // Added for fallback
    Tag,
    ArrowRight
} from 'lucide-react';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { usePage } from '@inertiajs/react';

// --- MOCK DATA ---

const heroNews = [
    {
        id: 1,
        title: "PPDB 2025 Resmi Dibuka: Panduan Lengkap Pendaftaran",
        category: "Pengumuman",
        date: "15 Jan 2025",
        image: "/images/hero-bg-sman1-baleendah.jpeg", 
        isMain: true
    },
    {
        id: 2,
        title: "Tim Basket Putra Raih Juara 1 DBL West Java Series",
        category: "Prestasi",
        date: "14 Jan 2025",
        image: "https://placehold.co/400x250/0D47A1/FFFFFF?text=Basket+Juara",
        isMain: false
    },
    {
        id: 3,
        title: "Kunjungan Edukasi ke Museum Geologi Bandung",
        category: "Kegiatan",
        date: "12 Jan 2025",
        image: "https://placehold.co/400x250/0D47A1/FFFFFF?text=Museum+Geologi",
        isMain: false
    }
];

const latestNews = [
    {
        id: 4,
        title: "Siswa Berprestasi Raih Medali Emas OSN Fisika",
        excerpt: "Delegasi sekolah berhasil mengharumkan nama daerah di kancah nasional dengan perolehan medali emas pada bidang studi Fisika.",
        category: "Prestasi",
        date: "10 Jan 2025",
        image: "https://placehold.co/300x200/0D47A1/FFFFFF?text=OSN+Emas"
    },
    {
        id: 5,
        title: "Jadwal Ujian Tengah Semester Genap 2024/2025",
        excerpt: "Berikut adalah jadwal lengkap pelaksanaan UTS Genap untuk seluruh jenjang kelas X, XI, dan XII beserta tata tertib ujian.",
        category: "Akademik",
        date: "08 Jan 2025",
        image: null // Test placeholder pattern
    },
    {
        id: 6,
        title: "Workshop 'Public Speaking' bersama Alumni Sukses",
        excerpt: "Meningkatkan kepercayaan diri siswa dalam berkomunikasi di depan umum melalui pelatihan intensif bersama praktisi.",
        category: "Kegiatan",
        date: "05 Jan 2025",
        image: "https://placehold.co/300x200/0D47A1/FFFFFF?text=Public+Speaking"
    },
    {
        id: 7,
        title: "Penyuluhan Kesehatan Remaja dari Puskesmas Setempat",
        excerpt: "Pentingnya menjaga kesehatan fisik dan mental bagi remaja di era digital menjadi topik utama dalam penyuluhan kali ini.",
        category: "Kegiatan",
        date: "03 Jan 2025",
        image: "https://placehold.co/300x200/0D47A1/FFFFFF?text=Kesehatan"
    }
];

const popularNews = [
    { id: 1, title: "Syarat & Ketentuan PPDB Jalur Zonasi 2025" },
    { id: 2, title: "Daftar Ekstrakurikuler Paling Diminati Tahun Ini" },
    { id: 3, title: "Profil Lulusan Sekolah di PTN Favorit" },
    { id: 4, title: "Kalender Akademik Semester Genap 2024/2025" },
    { id: 5, title: "Prestasi Internasional Tim Robotik Sekolah" }
];

const announcements = [
    "Rapat Orang Tua Siswa Kelas XII (20 Jan 2025)",
    "Libur Nasional Tahun Baru Imlek (29 Jan 2025)",
    "Batas Akhir Pengumpulan Tugas Proyek (25 Jan 2025)",
    "Pendaftaran Ulang Semester Genap (1-5 Feb 2025)"
];

const categories = ["Semua", "Berita", "Pengumuman", "Prestasi", "Akademik", "Kegiatan", "Alumni"];

// --- COMPONENTS ---

const NewsItem = ({ news }) => (
    <div className="flex flex-col sm:flex-row gap-6 group border-b border-gray-100 last:border-0 pb-6 last:pb-0">
        {/* Image / Placeholder - Fixed Width 30% */}
        <div className="w-full sm:w-[30%] h-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
            {news.featured_image ? (
                <img 
                    src={news.featured_image} 
                    alt={news.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4 text-center">
                    <Newspaper className="w-12 h-12 text-gray-300" />
                </div>
            )}
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold text-primary shadow-sm">
                {news.category}
            </div>
        </div>

        {/* Content - Width 70% */}
        <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center text-xs text-gray-500 mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <Link href={`/berita/${news.slug}`} className="block">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 font-serif">
                    {news.title}
                </h3>
            </Link>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {news.excerpt}
            </p>
            <Link href={`/berita/${news.slug}`} className="text-primary text-sm font-semibold hover:underline inline-flex items-center">
                Baca Selengkapnya <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
        </div>
    </div>
);

export default function BeritaPengumumanPage({ posts = [], popularPosts = [] }) {
    const { siteSettings } = usePage().props;
    const navigationData = getNavigationData(siteSettings);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');

    const heroSettings = siteSettings?.hero_posts || {};
    
    // Helper to format image path correctly
    const formatImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = activeCategory === 'Semua' || post.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [posts, searchQuery, activeCategory]);

    const heroNews = filteredPosts.slice(0, 3);
    const latestNews = filteredPosts.slice(3);
    const popularNews = popularPosts.length > 0 ? popularPosts : posts.slice(0, 5);
    const announcements = posts.filter(p => p.category === 'Pengumuman').slice(0, 4).map(p => p.title);

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

    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';

    return (
        <div className="bg-secondary font-sans text-gray-800">
            <Head title={`${heroSettings.title || 'Berita & Pengumuman'} - ${siteName}`} />
            
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* HERO SECTION (Immersive) */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={formatImagePath(heroSettings.image) || "/images/hero-bg-sman1-baleendah.jpeg"} 
                        alt={`Berita ${siteName}`} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-6 max-w-4xl mx-auto`}>
                        {renderHighlightedTitle(heroSettings.title || 'Berita & Pengumuman')}
                    </h1>
                    
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        {heroSettings.subtitle || `Dapatkan informasi terkini seputar prestasi siswa, agenda sekolah, dan berita terbaru dari ${siteName}.`}
                    </p>
                </div>
            </section>

            <main className="py-12 relative z-0">
                {/* PART 1: HERO SECTION (Strict Grid) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    {heroNews.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Headline (Left - 2 Cols) */}
                            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden group shadow-lg h-[500px]">
                                <img 
                                    src={heroNews[0].featured_image || '/images/hero-bg-sman1-baleendah.jpeg'} 
                                    alt={heroNews[0].title} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                {/* Overlay Fix */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                                
                                {/* Positioning Fix: Flexbox */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                                    <span className="inline-block self-start px-3 py-1 bg-accent-yellow text-gray-900 text-xs font-bold rounded-full mb-4">
                                        {heroNews[0].category}
                                    </span>
                                    <Link href={`/berita/${heroNews[0].slug}`}>
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-serif leading-tight mb-3 hover:underline decoration-accent-yellow decoration-2 underline-offset-4">
                                            {heroNews[0].title}
                                        </h2>
                                    </Link>
                                    <div className="flex items-center text-gray-300 text-sm">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(heroNews[0].created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            {/* Sub-Headlines (Right - 1 Col) */}
                            <div className="flex flex-col gap-6">
                                {heroNews.slice(1).map((news) => (
                                    <div key={news.id} className="relative flex-1 rounded-2xl overflow-hidden group shadow-md h-[238px]">
                                        <img 
                                            src={news.featured_image || '/images/hero-bg-sman1-baleendah.jpeg'} 
                                            alt={news.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                                            <span className="inline-block self-start px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded mb-2 border border-white/30">
                                                {news.category}
                                            </span>
                                            <Link href={`/berita/${news.slug}`}>
                                                <h3 className="text-lg font-bold text-white font-serif leading-snug hover:text-accent-yellow transition-colors">
                                                    {news.title}
                                                </h3>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">Belum ada berita</h3>
                            <p className="text-gray-500">Silakan kembali lagi nanti untuk informasi terbaru.</p>
                        </div>
                    )}
                </section>

                {/* PART 2: MAIN CONTENT AREA (Strict Grid) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* Left Column: Latest News (8 Cols) */}
                        <div className="lg:col-span-8">
                            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                                <h2 className="text-2xl font-bold text-gray-900 font-serif">Berita Terbaru</h2>
                                <div className="flex gap-2">
                                    <select 
                                        value={activeCategory}
                                        onChange={(e) => setActiveCategory(e.target.value)}
                                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2"
                                    >
                                        {categories.map((cat, idx) => (
                                            <option key={idx} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="space-y-6">
                                    {latestNews.map((news) => (
                                        <NewsItem key={news.id} news={news} />
                                    ))}
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-12 flex justify-center">
                                <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 hover:shadow-md transition-all duration-300 flex items-center gap-2">
                                    Muat Lebih Banyak <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Sidebar (4 Cols) */}
                        <div className="lg:col-span-4 flex flex-col gap-10">
                            
                            {/* Search Widget */}
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Cari berita..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm outline-none transition-all"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>

                            {/* Pengumuman Penting Widget (Fixed Style) */}
                            <div className="bg-yellow-50 border-l-4 border-accent-yellow p-6 rounded-r-xl relative overflow-hidden">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-orange-600" />
                                    Pengumuman Penting
                                </h3>
                                <ul className="space-y-3">
                                    {announcements.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-800 border-b border-accent-yellow/20 last:border-0 pb-2 last:pb-0">
                                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Terpopuler Widget */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Terpopuler
                                </h3>
                                <div className="space-y-5">
                                    {popularNews.map((news, idx) => (
                                        <Link key={news.id} href={`/berita/${news.slug}`} className="flex gap-4 group">
                                            <span className="text-3xl font-bold text-gray-300 font-serif group-hover:text-primary transition-colors">
                                                0{idx + 1}
                                            </span>
                                            <div>
                                                <h4 className="text-gray-800 font-medium text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                    {news.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Categories Widget */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-primary" />
                                    Kategori
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat, idx) => (
                                        <Link key={idx} href="#" className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-primary hover:text-white transition-colors">
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
