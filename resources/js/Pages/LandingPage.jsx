import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CountUp from 'react-countup';
import { 
    Users, 
    Trophy, 
    GraduationCap, 
    ArrowRight, 
    Microscope, 
    Globe, 
    BookOpen, 
    Calendar,
    MapPin,
    Phone,
    Mail,
    Leaf
} from 'lucide-react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { getNavigationData } from '@/Utils/navigationData';
import { TYPOGRAPHY } from '@/Utils/typography';
import { usePage } from '@inertiajs/react';

export default function LandingPage({ 
    heroContent, 
    aboutLpContent, 
    kepsekWelcomeLpContent, 
    programsLpContent,
    galleryLpContent,
    ctaLpContent,
    latestPosts = []
}) {
    const { siteSettings } = usePage().props;
    const navigationData = getNavigationData(siteSettings);
    
    // Map icon names to Lucide components
    const iconMap = {
        Microscope,
        Globe,
        BookOpen,
        Users,
        Trophy,
        GraduationCap,
        Calendar,
        Leaf
    };

    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';
    const siteDescription = siteSettings?.general?.site_description || 'Website Resmi SMAN 1 Baleendah';

    return (
        <div className="bg-secondary min-h-screen font-sans text-gray-800">
            <Head>
                <title>{`${siteName} - Generasi Unggul & Berkarakter`}</title>
                <meta name="description" content={siteDescription} />
            </Head>

            {/* Navbar */}
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* HERO SECTION */}
            <section className="relative pt-32 md:pt-40 overflow-hidden">
                {/* Hero Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={heroContent.background_image_url} 
                        alt="Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                {/* Blue Rectangle behind Student */}
                <div className="absolute top-0 left-1/2 h-full w-full md:w-[720px] bg-primary/80 z-0 hidden md:block"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Text */}
                        <div className="space-y-6 animate-fade-in-up">
                            <h1 className={TYPOGRAPHY.heroTitle}>
                                {heroContent.title_line1} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{heroContent.title_line2}</span>
                            </h1>
                            <p className={`${TYPOGRAPHY.heroText} max-w-lg`}>
                                {heroContent.hero_text}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link 
                                    href="/profil/sejarah" 
                                    className="px-8 py-3.5 bg-accent-yellow text-gray-900 font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-400 transition-all transform hover:-translate-y-1"
                                >
                                    Jelajahi Profil
                                </Link>
                                <Link 
                                    href="/informasi-spmb" 
                                    className="px-8 py-3.5 bg-white border-2 border-primary text-primary font-bold rounded-full hover:bg-blue-50 transition-all"
                                >
                                    Info PPDB
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Visual */}
                        <div className="relative mx-auto max-w-lg md:max-w-none w-full h-[500px] lg:h-[600px] flex justify-center items-end">
                            {/* Main Image */}
                            <img 
                                src={heroContent.student_image_url || "/images/anak-sma.png"} 
                                alt={`Siswa Berprestasi ${siteName}`} 
                                className="relative z-10 h-full w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            />

                            {/* Floating Glass Cards */}
                            {(heroContent.stats || []).map((stat, idx) => {
                                const Icon = iconMap[stat.icon_name] || Trophy;
                                const animations = ['animate-float-slow', 'animate-float-medium', 'animate-float-fast'];
                                const positions = [
                                    'top-10 -left-6 md:-left-12',
                                    'bottom-20 -right-4 md:-right-8',
                                    'bottom-8 left-4 md:-left-4'
                                ];
                                
                                return (
                                    <div 
                                        key={idx}
                                        className={`absolute ${positions[idx % positions.length]} bg-white/70 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow-lg flex items-center gap-3 ${animations[idx % animations.length]} max-w-[220px] z-20`}
                                    >
                                        <div className={`p-2 rounded-full ${idx === 0 ? 'bg-yellow-100 text-yellow-600' : idx === 1 ? 'bg-blue-100 text-primary' : 'bg-green-100 text-green-600'}`}>
                                            <Icon size={24} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                                            <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl bg-gray-200">
                                <img 
                                    src={aboutLpContent.image_url} 
                                    alt={aboutLpContent.title} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative dots */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-dots-pattern opacity-20 hidden md:block"></div>
                        </div>
                        <div>
                            <h2 className={`${TYPOGRAPHY.sectionHeading} mb-6`}>
                                {aboutLpContent.title.split(' ').slice(0, -1).join(' ')} <span className="text-primary">{aboutLpContent.title.split(' ').slice(-1)}</span>
                            </h2>
                            <div 
                                className={`${TYPOGRAPHY.bodyText} mb-8 prose prose-blue max-w-none`}
                                dangerouslySetInnerHTML={{ __html: aboutLpContent.description_html }}
                            />

                            <Link 
                                href="/profil/sejarah" 
                                className="inline-flex items-center mt-8 text-primary font-bold hover:text-primary-darker transition-colors"
                            >
                                Selengkapnya tentang kami <ArrowRight size={20} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* KEPSEK WELCOME SECTION */}
            <section className="py-20 bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        {/* Left Column: Title & Profile */}
                        <div className="space-y-8">
                            <div>
                                <h2 className={`${TYPOGRAPHY.sectionHeading} mb-6`}>
                                    Sambutan <span className="text-primary">Kepala Sekolah</span>
                                </h2>
                                <div className="flex flex-col items-center sm:items-start gap-6">
                                    <div className="relative w-full max-w-md h-[34rem] flex-shrink-0">
                                        <div className="absolute inset-0 bg-primary rounded-2xl rotate-6 opacity-20"></div>
                                        <img 
                                            src={kepsekWelcomeLpContent.kepsek_image_url} 
                                            alt={kepsekWelcomeLpContent.kepsek_name} 
                                            className="relative w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white"
                                        />
                                    </div>
                                    <div className="text-center sm:text-left w-full max-w-md">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {kepsekWelcomeLpContent.kepsek_name}
                                        </h3>
                                        <p className="text-primary font-medium mt-1">
                                            {kepsekWelcomeLpContent.kepsek_title}
                                        </p>
                                        <div className="w-12 h-1 bg-accent-yellow mt-4 mx-auto sm:mx-0 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Welcome Text */}
                        <div className="bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-gray-100 relative h-full flex flex-col justify-center">
                            {/* Quote Icon Decoration */}
                            <div className="absolute top-6 right-8 text-gray-100">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H16.017V21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 7.55228 5.0166 7V3H10.0166C11.6735 3 13.0166 4.34315 13.0166 6V15C13.0166 16.6569 11.6735 18 10.0166 18H7.0166V21H5.0166Z" />
                                </svg>
                            </div>
                            
                            <div 
                                className="prose prose-lg prose-blue text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: kepsekWelcomeLpContent.welcome_text_html }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ACADEMIC PROGRAMS SECTION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                            {programsLpContent.title.split(' ').slice(0, -1).join(' ')} <span className="text-primary">{programsLpContent.title.split(' ').slice(-1)}</span>
                        </h2>
                        <p className={TYPOGRAPHY.bodyText}>
                            {programsLpContent.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(programsLpContent.items || []).map((program, idx) => {
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
                                            Lihat Selengkapnya
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* NEWS & ANNOUNCEMENTS */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div className="max-w-2xl">
                            <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                                Berita <span className="text-primary">Smansa</span>
                            </h2>
                            <p className={TYPOGRAPHY.bodyText}>
                                Informasi terbaru seputar kegiatan sekolah, prestasi siswa, dan pengumuman akademik.
                            </p>
                        </div>
                        <Link href="/berita-pengumuman" className="hidden md:flex items-center text-primary font-bold hover:underline mt-4 md:mt-0">
                            Lihat Semua Berita <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {latestPosts.map((post) => (
                            <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <img 
                                        src={post.featured_image || "/images/hero-bg-sman1-baleendah.jpeg"} 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                                        alt={post.title} 
                                    />
                                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                                        <Calendar size={16} />
                                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <h3 className={`${TYPOGRAPHY.cardTitle} mb-3 line-clamp-2 hover:text-primary cursor-pointer`}>
                                        {post.title}
                                    </h3>
                                    <Link href={`/berita/${post.slug}`} className="text-primary font-semibold text-sm hover:underline">
                                        Baca Selengkapnya
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {latestPosts.length === 0 && (
                            <div className="col-span-3 text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">Belum ada berita terbaru.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/berita-pengumuman" className="inline-flex items-center text-primary font-bold hover:underline">
                            Lihat Semua Berita <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* GALLERY SECTION */}
            <section className="py-20 bg-white overflow-hidden">
                {/* ... (style tag remains same) */}
                <style>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes scroll-reverse {
                        0% { transform: translateX(-50%); }
                        100% { transform: translateX(0); }
                    }
                    .animate-scroll {
                        animation: scroll 30s linear infinite;
                    }
                    .animate-scroll-reverse {
                        animation: scroll-reverse 30s linear infinite;
                    }
                    .pause-hover:hover .animate-scroll,
                    .pause-hover:hover .animate-scroll-reverse {
                        animation-play-state: paused;
                    }
                `}</style>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} mb-4`}>
                            {galleryLpContent.title.split(' ').slice(0, -1).join(' ')} <span className="text-primary">{galleryLpContent.title.split(' ').slice(-1)}</span>
                        </h2>
                        <p className={TYPOGRAPHY.bodyText}>
                            {galleryLpContent.description}
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-col gap-6 pause-hover">
                    {/* Row 1 - Scroll Left */}
                    <div className="flex gap-6 animate-scroll w-max">
                        {/* Duplicate images to create seamless loop */}
                        {[...(galleryLpContent.images || []), ...(galleryLpContent.images || []), ...(galleryLpContent.images || [])].map((imgUrl, idx) => (
                            <div key={`row1-${idx}`} className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all relative group">
                                <img 
                                    src={imgUrl} 
                                    alt={`Gallery ${idx}`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                            </div>
                        ))}
                    </div>

                    {/* Row 2 - Scroll Right (Reverse) */}
                    <div className="flex gap-6 animate-scroll-reverse w-max">
                        {/* Duplicate images to create seamless loop (reversed) */}
                        {[...(galleryLpContent.images || []), ...(galleryLpContent.images || []), ...(galleryLpContent.images || [])].reverse().map((imgUrl, idx) => (
                            <div key={`row2-${idx}`} className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all relative group">
                                <img 
                                    src={imgUrl} 
                                    alt={`Gallery ${idx}`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
                    <Link 
                        href="/galeri" 
                        className="inline-flex items-center px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 hover:text-primary transition-all shadow-sm"
                    >
                        Lihat Galeri Lainnya <ArrowRight size={20} className="ml-2" />
                    </Link>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-20 bg-primary relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        {ctaLpContent.title}
                    </h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                        {ctaLpContent.description}
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

            {/* Footer */}
            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />
        </div>
    );
}
