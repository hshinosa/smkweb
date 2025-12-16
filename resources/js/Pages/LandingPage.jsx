import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CountUp from 'react-countup';
import { Users } from 'lucide-react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ProgramStudiModal from '@/Components/ProgramStudiModal';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
// Data untuk Program Studi SMA
const programStudiData = [
    { 
        nama: "MIPA (Matematika dan Ilmu Pengetahuan Alam)", 
        type: "MIPA",
        link: "/akademik/program-studi/mipa" 
    },
    { 
        nama: "IPS (Ilmu Pengetahuan Sosial)", 
        type: "IPS",
        link: "/akademik/program-studi/ips" 
    },
    { 
        nama: "Bahasa (Ilmu Bahasa dan Budaya)", 
        type: "BAHASA",
        link: "/akademik/program-studi/bahasa" 
    },
];



// Get navigation data from centralized source
const navigationData = getNavigationData();





export default function LandingPage({ 
    heroContent, 
    aboutLpContent, 
    kepsekWelcomeLpContent, 
    faktaLpContent 
}) {
    const [showProgramModal, setShowProgramModal] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);

    const openProgramModal = (program) => {
        setSelectedProgram(program);
        setShowProgramModal(true);
    };

    const closeProgramModal = () => {
        setShowProgramModal(false);
        setSelectedProgram(null);
    };
    // Fallback data jika props tidak ada atau fieldnya kosong (pengamanan tambahan)
    const currentHeroContent = {
        title_line1: heroContent?.title_line1 || 'Selamat Datang di',
        title_line2: heroContent?.title_line2 || 'SMA Negeri 1 Baleendah',
        background_image_url: heroContent?.background_image_url || '/images/hero-bg-sman1-baleendah.jpg',
    };

    const currentAboutLpContent = {
        title: aboutLpContent?.title || 'Tentang SMAN 1 Baleendah',
        description_html: aboutLpContent?.description_html || '<p>Deskripsi default tentang sekolah kami. Kami berkomitmen untuk memberikan pendidikan akademik berkualitas...</p>',
        image_url: aboutLpContent?.image_url || '/images/keluarga-besar-sman1-baleendah.png', // Ganti dengan placeholder yang sesuai
    };

    const currentKepsekWelcomeLpContent = {
        title: kepsekWelcomeLpContent?.title || 'Sambutan Kepala Sekolah',
        kepsek_name: kepsekWelcomeLpContent?.kepsek_name || 'H. Dudi Rohdiana, S.Pd., M.M.',
        kepsek_title: kepsekWelcomeLpContent?.kepsek_title || 'Kepala SMA Negeri 1 Baleendah',
        kepsek_image_url: kepsekWelcomeLpContent?.kepsek_image_url || '/images/kepala-sekolah.jpg',
        welcome_text_html: kepsekWelcomeLpContent?.welcome_text_html || '<p>Assalamu\'alaikum Warahmatullahi Wabarakatuh...</p>',
    };

    const currentFaktaLpContent = {
        items: faktaLpContent?.items && faktaLpContent.items.length > 0 ? faktaLpContent.items : [
            { label: "Guru", value: 30 }, // Fallback jika items kosong
            { label: "Siswa", value: 1500 },
        ]
    };


    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="SMAN 1 Baleendah - Unggul dalam Prestasi, Berkarakter, dan Berwawasan Global" /> {/* Judul lebih spesifik */}

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

             {/* Hero Section */}
            <div className="relative pt-16 bg-cover bg-center h-[50vh] flex items-center justify-center"
                style={{ backgroundImage: `url('${currentHeroContent.background_image_url}')` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 text-center px-4">
                    <h2 className={TYPOGRAPHY.heroSubtitle + " leading-tight"}>
                        {currentHeroContent.title_line1}
                    </h2>
                    <h1 className={TYPOGRAPHY.heroTitle + " mt-2"}>
                        {currentHeroContent.title_line2}
                    </h1>
                </div>
            </div>

            {/* Pengumuman Penting Section */}
            <section className="py-8 bg-gradient-to-r from-primary to-primary-darker text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6">
                        <h2 className={TYPOGRAPHY.sectionHeading + " text-white mb-4 flex items-center justify-center gap-3"}>
                            <Users className="w-8 h-8" />
                            Pengumuman Penting
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <h3 className={TYPOGRAPHY.cardTitle + " text-white mb-2"}>PPDB 2025/2026</h3>
                            <p className={TYPOGRAPHY.bodyText + " text-white/90 text-sm mb-3"}>
                                Pendaftaran siswa baru dibuka Februari 2025. Info lengkap syarat dan jadwal tersedia.
                            </p>
                            <Link href="/informasi-spmb" className="text-white/90 hover:text-white text-sm font-medium underline">
                                Selengkapnya →
                            </Link>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <h3 className={TYPOGRAPHY.cardTitle + " text-white mb-2"}>Ujian Semester</h3>
                            <p className={TYPOGRAPHY.bodyText + " text-white/90 text-sm mb-3"}>
                                UTS Genap dimulai 10 Februari. Siswa diharapkan mempersiapkan diri dengan baik.
                            </p>
                            <Link href="/berita-pengumuman" className="text-white/90 hover:text-white text-sm font-medium underline">
                                Selengkapnya →
                            </Link>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <h3 className={TYPOGRAPHY.cardTitle + " text-white mb-2"}>Prestasi OSN</h3>
                            <p className={TYPOGRAPHY.bodyText + " text-white/90 text-sm mb-3"}>
                                Siswa kelas XI meraih medali emas OSN Fisika tingkat Provinsi Jawa Barat.
                            </p>
                            <Link href="/berita-pengumuman" className="text-white/90 hover:text-white text-sm font-medium underline">
                                Selengkapnya →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tentang SMAN 1 Baleendah Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">                        
                        <div className="max-w-none">
                            <h2 className={TYPOGRAPHY.sectionHeading}>
                                {currentAboutLpContent.title}
                            </h2>
                            <div className="h-1 w-24 bg-primary mb-6"></div>
                            <div className={TYPOGRAPHY.bodyText + " text-gray-800"} dangerouslySetInnerHTML={{ __html: currentAboutLpContent.description_html }} />
                            
                            {/* Academic Excellence Highlights */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">95%</div>
                                    <div className="text-sm text-gray-700">Tingkat Kelulusan PTN</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">A</div>
                                    <div className="text-sm text-gray-700">Akreditasi Sekolah</div>
                                </div>
                            </div>
                            
                            <Link href={route('profil.sekolah')} className="mt-6 inline-block bg-primary text-white hover:bg-primary-darker transition duration-300 px-6 py-2 rounded-md text-base sm:text-lg font-semibold no-underline">
                                Lihat Selengkapnya
                            </Link>
                        </div>
                        <div className="mt-8 md:mt-0 flex justify-center">
                            <img src={currentAboutLpContent.image_url} alt="Tentang SMAN 1 Baleendah" className="rounded-lg shadow-xl max-w-full md:max-w-2xl w-full h-auto object-cover aspect-video md:aspect-square"/> 
                        </div>
                    </div>
                </div>
            </section>



            {/* Sambutan Kepala Sekolah Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                        <div className="md:col-span-4">
                            <h2 className={TYPOGRAPHY.subsectionHeading + " mb-1"}>
                                {currentKepsekWelcomeLpContent.title}
                            </h2>
                            <h3 className={TYPOGRAPHY.sectionHeading + " text-primary mb-2"}>SMAN 1 Baleendah</h3>
                            <div className="h-1 w-24 bg-primary mb-8"></div>
                            <img src={currentKepsekWelcomeLpContent.kepsek_image_url} 
                                 alt={currentKepsekWelcomeLpContent.kepsek_name} 
                                 className="rounded-lg w-full max-w-xs mx-auto md:mx-0 shadow-lg"/>
                            <div className="mt-4 text-center md:text-left">
                                <p className={TYPOGRAPHY.bodyText + " font-semibold text-gray-800"}>{currentKepsekWelcomeLpContent.kepsek_name}</p>
                                <p className={TYPOGRAPHY.bodyText + " text-gray-600 text-sm"}>{currentKepsekWelcomeLpContent.kepsek_title}</p>
                            </div>
                        </div>                        
                        <div className="md:col-span-8 max-w-none">                            
                            <div className={TYPOGRAPHY.bodyText + " text-gray-800"} dangerouslySetInnerHTML={{ __html: currentKepsekWelcomeLpContent.welcome_text_html }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Studi Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-10 md:mb-12">
                        <h2 className={TYPOGRAPHY.sectionHeading + " mb-4"}>
                            Program Studi <span className="text-primary">SMAN 1 Baleendah</span>
                        </h2>
                        <div className="h-1 w-24 bg-primary mx-auto mb-4"></div>
                        <p className={TYPOGRAPHY.bodyText + " text-gray-700 max-w-3xl mx-auto"}>
                            Pilih program studi sesuai minat dan bakatmu untuk persiapan masuk perguruan tinggi
                        </p>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {programStudiData.map((program, index) => (
                            <div 
                                key={index} 
                                onClick={() => openProgramModal(program)}
                                className="group cursor-pointer bg-white rounded-xl shadow-lg program-card-hover overflow-hidden"
                            >
                                <div className="w-full h-48 relative overflow-hidden rounded-t-xl">
                                    {/* Gambar siswa sebagai background utama */}
                                    <img 
                                        src="/images/anak-sma.png" 
                                        alt="Siswa SMAN 1 Baleendah"
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Overlay gradient untuk readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    {/* Subtle shine effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                                </div>
                                <div className="p-6">
                                    <h4 className={TYPOGRAPHY.bodyText + " font-semibold text-gray-800 mb-2"}>
                                        {program.type === "MIPA" ? "Matematika & IPA" : 
                                         program.type === "IPS" ? "Ilmu Pengetahuan Sosial" : "Ilmu Bahasa & Budaya"}
                                    </h4>
                                    <p className={TYPOGRAPHY.bodyText + " text-gray-700 text-sm mb-4"}>
                                        {program.type === "MIPA" ? "Program untuk siswa yang menyukai sains dan matematika. Cocok untuk jurusan teknik, kedokteran, dan sains." : 
                                         program.type === "IPS" ? "Program untuk siswa yang tertarik dengan ilmu sosial, ekonomi, dan sejarah. Persiapan untuk fakultas sosial dan hukum." : 
                                         "Program untuk siswa yang suka bahasa dan sastra. Cocok untuk jurusan bahasa, komunikasi, dan pendidikan."}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-primary font-medium text-sm group-hover:text-primary-darker transition-colors">
                                            Lihat Detail →
                                        </div>
                                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            Klik untuk detail
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>            {/* Fakta SMAN 1 Baleendah Section */}
            {currentFaktaLpContent && currentFaktaLpContent.items && currentFaktaLpContent.items.length > 0 && (
                <section className="py-12 sm:py-16 lg:py-20 bg-primary text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className={TYPOGRAPHY.sectionHeading + " text-white"}>Fakta SMAN 1 Baleendah</h2>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {currentFaktaLpContent.items.map((fakta, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-4xl lg:text-5xl font-bold">
                                        <CountUp start={0} end={Number(fakta.value) || 0} duration={2.5} separator="." decimal="," enableScrollSpy scrollSpyOnce />
                                    </p>
                                    <p className="text-sm sm:text-base uppercase tracking-wider mt-1">
                                        {fakta.label || 'Label Fakta'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* Berita & Pengumuman Terbaru Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12">
                        <div>
                            <h2 className={TYPOGRAPHY.sectionHeading + " mb-1 text-center md:text-left"}>
                                Berita & <span className="text-primary">Pengumuman Terbaru</span>
                            </h2>
                            <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-4 md:mb-0"></div>
                        </div>
                        <Link
                            href="/berita-pengumuman"
                            className={"bg-primary text-white hover:bg-primary-darker px-6 py-2 rounded-md transition duration-300 " + TYPOGRAPHY.buttonText}
                        >
                            Lihat Semua Berita
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">Pengumuman</span>
                                    <span className="text-gray-500 text-sm">15 Jan 2025</span>
                                </div>
                                <h3 className={TYPOGRAPHY.cardTitle + " text-gray-800 mb-3 line-clamp-2"}>
                                    Pendaftaran Siswa Baru 2025/2026
                                </h3>
                                <p className={TYPOGRAPHY.bodyText + " text-gray-700 text-sm mb-4 line-clamp-3"}>
                                    Pendaftaran siswa baru tahun ajaran 2025/2026 akan segera dibuka. Siapkan berkas dan pelajari persyaratannya.
                                </p>
                                <Link href="/berita-pengumuman" className="text-primary hover:text-primary-darker font-medium text-sm">
                                    Baca Selengkapnya →
                                </Link>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Prestasi</span>
                                    <span className="text-gray-500 text-sm">10 Jan 2025</span>
                                </div>
                                <h3 className={TYPOGRAPHY.cardTitle + " text-gray-800 mb-3 line-clamp-2"}>
                                    Juara OSN Fisika Tingkat Provinsi
                                </h3>
                                <p className={TYPOGRAPHY.bodyText + " text-gray-700 text-sm mb-4 line-clamp-3"}>
                                    Ahmad Rizki siswa kelas XI MIPA berhasil meraih medali emas OSN Fisika tingkat Provinsi Jawa Barat 2025.
                                </p>
                                <Link href="/berita-pengumuman" className="text-primary hover:text-primary-darker font-medium text-sm">
                                    Baca Selengkapnya →
                                </Link>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Akademik</span>
                                    <span className="text-gray-500 text-sm">8 Jan 2025</span>
                                </div>
                                <h3 className={TYPOGRAPHY.cardTitle + " text-gray-800 mb-3 line-clamp-2"}>
                                    Bimbingan UTBK untuk Kelas XII
                                </h3>
                                <p className={TYPOGRAPHY.bodyText + " text-gray-700 text-sm mb-4 line-clamp-3"}>
                                    Sekolah mengadakan bimbingan khusus UTBK-SNBT untuk siswa kelas XII. Gratis untuk semua siswa.
                                </p>
                                <Link href="/berita-pengumuman" className="text-primary hover:text-primary-darker font-medium text-sm">
                                    Baca Selengkapnya →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 bg-gradient-to-r from-primary to-primary-darker text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className={TYPOGRAPHY.sectionHeading + " text-white mb-4"}>
                        Daftar di SMAN 1 Baleendah
                    </h2>
                    <p className={TYPOGRAPHY.bodyText + " text-white/90 max-w-2xl mx-auto mb-8"}>
                        Raih prestasi terbaikmu bersama kami. Sekolah dengan fasilitas lengkap dan guru berpengalaman.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/informasi-spmb" 
                            className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link 
                            href="/kontak" 
                            className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </section>

            {/* Program Studi Modal */}
            <ProgramStudiModal 
                show={showProgramModal}
                onClose={closeProgramModal}
                program={selectedProgram}
            />

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />
        </div>
    );
}