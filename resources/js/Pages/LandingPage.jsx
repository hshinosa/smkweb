import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CountUp from 'react-countup';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
// Impor ikon dari lucide-react
import { ChevronLeft, ChevronRight, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react'; // Ganti XIcon dengan Twitter jika itu maksudnya

// Path ke aset gambar Anda
const logoSmkn15 = '/images/logo-smkn15.png';

const placeholderProgram1 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+1';
const placeholderProgram2 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+2';
const placeholderProgram3 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+3';
const placeholderProgram4 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+4';
const placeholderProgram5 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+5';

const placeholderDKV = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=DKV';
const placeholderKuliner = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Kuliner';
const placeholderPekerjaanSosial = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Peksos';
const placeholderPerhotelan = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Hotel';

// Data untuk Program Keahlian (sama seperti sebelumnya)
const programKeahlianDataNav = [
    { nama: "DKV", link: "/programkeahlian/dkv" },
    { nama: "Perhotelan", link: "/programkeahlian/perhotelan" },
    { nama: "Kuliner", link: "/programkeahlian/kuliner" },
    { nama: "Pekerjaan Sosial", link: "/programkeahlian/pekerjaan-sosial" },
];

const programKeahlianData = [
    { nama: "Desain Komunikasi Visual", gambar: placeholderDKV, link: "/programkeahlian/dkv" },
    { nama: "Kuliner", gambar: placeholderKuliner, link: "/programkeahlian/kuliner" },
    { nama: "Pekerjaan Sosial", gambar: placeholderPekerjaanSosial, link: "/programkeahlian/pekerjaan-sosial" },
    { nama: "Perhotelan", gambar: placeholderPerhotelan, link: "/programkeahlian/perhotelan" },
];

// Data Fakta Sekolah (sama seperti sebelumnya)
const faktaSekolah = [
    { angka: 40, label: "Guru" },
    { angka: 10, label: "Staff" },
    { angka: 1700, label: "Siswa" },
    { angka: 22034, label: "Alumni" },
    { angka: 10, label: "Fasilitas" },
];

// Data Program Sekolah (sama seperti sebelumnya)
const programSekolah = [
    { nama: "Menuju Badan Layanan Umum Daerah (BLUD)", gambar: placeholderProgram1, link: "/program/blud" },
    { nama: "Kelas Industri Program Keahlian Perhotelan & Kuliner", gambar: placeholderProgram2, link: "/program/kelas-industri" },
    { nama: "Kunjungan Industri", gambar: placeholderProgram3, link: "/program/kunjungan-industri" },
    { nama: "Pengembangan Digital Library dan Prasarana", gambar: placeholderProgram4, link: "/program/digital-library" },
    { nama: "Program Kewirausahaan Siswa", gambar: placeholderProgram5, link: "/program/kewirausahaan" },
];

// Data Link Navigasi (sama seperti sebelumnya)
const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7320221071664!2d107.6164360758815!3d-6.922603993077097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e62c87267923%3A0x7ef8aaa0fcd59ec9!2sSMKN%2015%20Kota%20Bandung!5e0!3m2!1sid!2sid!4v1746550004423!5m2!1sid!2sid";

const tentangKamiLinks = [
    { title: "Profil Sekolah", href: "/profil-sekolah" },
    { title: "Visi & Misi", href: "/visi-misi" },
    { title: "Struktur Organisasi", href: "/struktur-organisasi" },
    { title: "Fasilitas", href: "/fasilitas" },
    { title: "Program Sekolah", href: "/program" },
    { title: "Daftar Guru & TU", href: "/daftar-guru-tu" },
    { title: "Hubungi Kami", href: "/hubungi-kami" },
];

const manajemenSekolahSublinks = [
    { title: "Kurikulum", href: "/manajemen/kurikulum" },
    { title: "Kesiswaan", href: "/manajemen/kesiswaan" },
    { title: "Hubungan Masyarakat dan Industri", href: "/manajemen/humas-industri" },
    { title: "Sarana Prasarana", href: "/manajemen/sarpras" },
];

const akademikInformasiLinks = [
    { title: "Kalender Akademik", href: "/kalender-akademik" },
    { title: "Berita dan Pengumuman", href: "/berita-pengumuman" },
];

// Update socialMediaLinks untuk menggunakan komponen Lucide
const socialMediaLinks = [
    { name: "Instagram", href: "https://www.instagram.com/smkn_15bandung", icon: Instagram, handle: "@smkn_15bandung" },
    { name: "Facebook", href: "https://www.facebook.com/SMKN15Bandung", icon: Facebook, handle: "SMKN 15 Bandung" },
    { name: "LinkedIn", href: "https://www.linkedin.com/school/smkn-15-bandung/", icon: Linkedin, handle: "SMKN 15 Bandung" },
    { name: "X", href: "https://twitter.com/smkn15bandung", icon: Twitter, handle: "@smkn15bandung" }, // Menggunakan ikon Twitter
];



export default function LandingPage({ 
    auth, 
    heroContent, 
    aboutLpContent, 
    kepsekWelcomeLpContent, 
    faktaLpContent 
}) {
    // Fallback data jika props tidak ada atau fieldnya kosong (pengamanan tambahan)
    const currentHeroContent = {
        title_line1: heroContent?.title_line1 || 'Selamat Datang di',
        title_line2: heroContent?.title_line2 || 'SMK Negeri 15 Bandung',
        background_image_url: heroContent?.background_image_url || '/images/hero-bg-smkn15.jpg',
    };

    const currentAboutLpContent = {
        title: aboutLpContent?.title || 'Tentang SMKN 15 Bandung',
        description_html: aboutLpContent?.description_html || '<p>Deskripsi default tentang sekolah kami. Kami berkomitmen untuk memberikan pendidikan berkualitas...</p>',
        image_url: aboutLpContent?.image_url || '/images/keluarga-besar-smkn15.png', // Ganti dengan placeholder yang sesuai
    };

    const currentKepsekWelcomeLpContent = {
        title: kepsekWelcomeLpContent?.title || 'Sambutan Kepala Sekolah',
        kepsek_name: kepsekWelcomeLpContent?.kepsek_name || 'Nama Kepala Sekolah',
        kepsek_title: kepsekWelcomeLpContent?.kepsek_title || 'Kepala SMK Negeri 15 Bandung',
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
            <Head title="SMKN 15 Bandung - Berani Berkarya" /> {/* Judul lebih spesifik */}

            <Navbar
                logoSmkn15={logoSmkn15}
                tentangKamiLinks={tentangKamiLinks}
                manajemenSekolahSublinks={manajemenSekolahSublinks}
                akademikInformasiLinks={akademikInformasiLinks}
                programKeahlianDataNav={programKeahlianDataNav}
            />

             {/* Hero Section */}
            <div className="relative pt-16 bg-cover bg-center h-[70vh] flex items-center justify-center"
                style={{ backgroundImage: `url('${currentHeroContent.background_image_url}')` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 text-center px-4">
                    <h2 className="text-3xl sm:text-3xl md:text-5xl font-bold text-white leading-tight">
                        {currentHeroContent.title_line1}
                    </h2>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-2">
                        {currentHeroContent.title_line2}
                    </h1>
                </div>
            </div>

            {/* Tentang SMKN 15 Bandung Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">                        <div className="prose prose-sm text-gray-700 max-w-none"> {/* Ukuran prose diperkecil untuk readability */}
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {currentAboutLpContent.title}
                            </h2>
                            <div className="h-1 w-24 bg-primary mb-6"></div>
                            <div className="text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: currentAboutLpContent.description_html }} />
                            <Link href={route('profil.sekolah')} className="mt-6 inline-block bg-primary text-white hover:bg-primary-darker transition duration-300 px-6 py-2 rounded-md text-base sm:text-lg font-semibold no-underline">
                                Lihat Selengkapnya
                            </Link>
                        </div>
                        <div className="mt-8 md:mt-0 flex justify-center">
                            <img src={currentAboutLpContent.image_url} alt="Tentang SMKN 15 Bandung" className="rounded-lg shadow-xl max-w-full md:max-w-2xl w-full h-auto object-cover aspect-video md:aspect-square"/> {/* Aspek rasio disesuaikan */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sambutan Kepala Sekolah Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                        <div className="md:col-span-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                {currentKepsekWelcomeLpContent.title}
                            </h2>
                            <h3 className="text-3xl sm:text-4xl font-semibold text-primary mb-2">SMKN 15 Bandung</h3>
                            <div className="h-1 w-24 bg-primary mb-8"></div>
                            <img src={currentKepsekWelcomeLpContent.kepsek_image_url} 
                                 alt={currentKepsekWelcomeLpContent.kepsek_name} 
                                 className="rounded-lg w-full max-w-xs mx-auto md:mx-0 shadow-lg"/>
                        </div>                        
                            <div className="md:col-span-8 prose prose-sm text-gray-700 max-w-none">                            
                                <div className="text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: currentKepsekWelcomeLpContent.welcome_text_html }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Keahlian Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center md:text-left mb-10 md:mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">
                            4 Program Keahlian <span className="text-primary">SMKN 15 Bandung</span>
                        </h2>
                        <div className="h-1 w-24 bg-primary mt-2 mx-auto md:mx-0"></div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {programKeahlianData.map((program, index) => (
                            <Link href={program.link} key={index} className="group block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 hover:scale-105">
                                <div className="w-full h-48 bg-gray-200">
                                    <img
                                        src={program.gambar}
                                        alt={program.nama}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                        {program.nama.split(" ").slice(0, -1).join(" ")}
                                        {(program.nama.includes("Visual") || program.nama.includes("Sosial")) && <br />}
                                        {program.nama.split(" ").pop()}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>            {/* Fakta SMKN 15 Bandung Section */}
            {currentFaktaLpContent && currentFaktaLpContent.items && currentFaktaLpContent.items.length > 0 && (
                <section className="py-12 sm:py-16 lg:py-20 bg-primary text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold">Fakta SMKN 15 Bandung</h2>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {currentFaktaLpContent.items.map((fakta, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-4xl lg:text-5xl font-bold">
                                        <CountUp start={0} end={Number(fakta.value) || 0} duration={2.5} separator="." decimal="," enableScrollSpy scrollSpyOnce />
                                    </p>
                                    <p className="text-sm lg:text-base uppercase tracking-wider mt-1">
                                        {fakta.label || 'Label Fakta'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* Program-Program SMKN 15 Bandung Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-1 text-center md:text-left">
                                Program-Program <span className="text-primary">SMKN 15 Bandung</span>
                            </h2>
                            <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-4 md:mb-0"></div>
                        </div>
                        <Link
                            href="/program"
                            className="bg-primary text-white hover:bg-primary-darker px-6 py-2 rounded-md text-sm font-semibold transition duration-300"
                        >
                            Lihat Selengkapnya
                        </Link>
                    </div>
                    <div className="relative px-0 sm:px-8 md:px-12">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
                            grabCursor={true}
                            className="program-swiper !pb-10" // Ensure pagination bullets are visible
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                768: { slidesPerView: 3, spaceBetween: 24 },
                                1024: { slidesPerView: 4, spaceBetween: 24 },
                            }}
                        >
                            {programSekolah.map((program, index) => (
                                <SwiperSlide key={index} className="pb-1 overflow-visible"> {/* Allow shadow to be visible */}
                                    <Link href={program.link} className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden h-full flex flex-col">
                                        <div className="w-full h-40 bg-gray-200">
                                            <img
                                                src={program.gambar}
                                                alt={program.nama}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4 flex-grow">
                                            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors min-h-[2.5em] line-clamp-2">
                                                {program.nama}
                                            </h3>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {/* Custom Navigation Buttons - Menggunakan Lucide Icons */}
                        <div className="swiper-button-prev-custom absolute top-1/2 left-0 transform -translate-y-1/2 z-10 cursor-pointer p-2 bg-white/70 hover:bg-white rounded-full shadow-md">
                           <ChevronLeft size={24} className="text-primary" />
                        </div>
                        <div className="swiper-button-next-custom absolute top-1/2 right-0 transform -translate-y-1/2 z-10 cursor-pointer p-2 bg-white/70 hover:bg-white rounded-full shadow-md">
                           <ChevronRight size={24} className="text-primary" />
                        </div>
                        {/* Custom Pagination Container */}
                        <div className="swiper-pagination-custom text-center mt-4"></div>
                    </div>
                </div>
            </section>

            <Footer
                logoSmkn15={logoSmkn15}
                googleMapsEmbedUrl={googleMapsEmbedUrl}
                tentangKamiLinks={tentangKamiLinks}
                akademikInformasiLinks={akademikInformasiLinks}
                programKeahlianDataNav={programKeahlianDataNav}
                socialMediaLinks={socialMediaLinks} // Pastikan data ini sudah diupdate
            />
        </div>
    );
}