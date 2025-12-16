// FILE: resources/js/Pages/VisiMisiPage.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar'; // Sesuaikan path jika perlu
import Footer from '@/Components/Footer'; // Sesuaikan path jika perlu
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
// Import ikon dari lucide-react
import { Eye, Target, Dot, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react'; // Dot untuk list misi

// Path ke aset gambar Anda (sama seperti LandingPage)
// Get navigation data from centralized source
const navigationData = getNavigationData();

// Path gambar spesifik untuk Visi & Misi dari desain
const visiImage = '/images/keluarga-besar-sman1-baleendah.png'; // Ganti dengan path gambar atas yang benar
const misiImage = '/images/panen-karya-sman1-baleendah.jpg'; // Ganti dengan path gambar bawah yang benar

// Data Navigasi & Footer (reuse atau definisikan ulang)
// (Salin data yang sama seperti di ProfilSekolahPage.jsx)
const programStudiDataNav = [
    { nama: "MIPA", link: "/program-studi/mipa" },
    { nama: "IPS", link: "/program-studi/ips" },
    { nama: "Bahasa", link: "/program-studi/bahasa" },
];

// Data Visi & Misi dari desain
const visiMotto = "“Creativity (C), Adaptability (A), Responsibility (R), Dan Empathy (E)”";
const visiText = "Membentuk Peserta Didik Yang Berakhlak Mulia, Empati, Inovatif, Kompeten, Mandiri Dan Bernalar Kritis, Mampu Beradaptasi Dengan Perkembangan Teknologi, Mempunyai Daya Saing Tinggi Di Dunia Kerja, Berkomitmen Terhadap Segala Keputusan Yang Diambil.";
const misiPoints = [
    "Mampu Untuk Merasakan Keadaan Emosional Orang Lain, Menciptakan Keinginan Untuk Berbagi Dan Menolong Sesama Serta Kepedulian Sosial.",
    "Memiliki Kecerdasan Spiritual Dan Tenggang Rasa Antar Umat Beragama, Berkarakter Dan Berbudi Pekerti",
    "Mampu Berinovasi Dan Berdaya Saing Tinggi Untuk Berwirausaha Sesuai Dengan Tuntutan Dunia Usaha, Dunia Industri, Dan Dunia Kerja (DUDIKA).",
    "Unggul Dan Kompeten Dalam Program Studi MIPA, IPS, Dan Bahasa Untuk Persiapan Perguruan Tinggi Terbaik.",
    "Memiliki Kesadaran Diri, Mampu Menganalisis, Serta Menyesuaikan Terhadap Perubahan Di Lingkungan Sekolah, Masyarakat, Nasional, Dan Internasional. Secara Nilai, Etika, Dan Norma."
];

export default function VisiMisiPage({ auth }) {

    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head>
                <title>Visi & Misi - SMAN 1 Baleendah | Unggul dalam Prestasi, Berkarakter, dan Berwawasan Global</title>
                <meta name="description" content="Visi dan Misi SMA Negeri 1 Baleendah. Membentuk peserta didik berakhlak mulia, berprestasi akademik tinggi, berkarakter kuat, dan berwawasan global melalui program pendidikan akademik unggulan dengan tiga jurusan: MIPA, IPS, dan Bahasa." />
            </Head>

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
                programKeahlianDataNav={programStudiDataNav}
            />

            {/* Header Section */}
            <section className="pt-24 pb-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className={TYPOGRAPHY.pageTitle + " text-center md:text-left"}>
                        Visi dan Misi SMA Negeri 1 Baleendah
                    </h1>                    <p className={TYPOGRAPHY.bodyText + " text-gray-600 max-w-4xl mx-auto md:mx-0 text-center md:text-left"}>
                        Landasan dan arah tujuan pendidikan di SMA Negeri 1 Baleendah dalam mencetak generasi penerus bangsa yang unggul dan berkarakter.
                    </p>
                </div>
            </section>

            {/* Visi Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Kolom Gambar Visi */}
                        <div className="order-1 md:order-1">
                            <img
                                src={visiImage} // Pastikan path ini benar
                                alt="Keluarga Besar SMA Negeri 1 Baleendah Tahun 2024-2025 - Visi Sekolah"
                                className="w-full rounded-lg shadow-xl aspect-[16/10] object-cover" // Sesuaikan aspect ratio jika perlu
                            />
                             {/* Kutipan di bawah gambar (jika diinginkan, opsional) */}
                            <p className={TYPOGRAPHY.secondaryText + " text-center italic mt-2"}>
                                "Di sini, kita belajar tentang ilmu, akhlak, dan keberanian. Mari bersama membangun masa depan dengan hati dan karya."
                            </p>
                        </div>

                        {/* Kolom Teks Visi */}
                        <div className="order-2 md:order-2">
                            <h2 className={TYPOGRAPHY.sectionHeading + " mb-4 flex items-center"}>
                                <Eye size={36} className="mr-3 text-primary" /> Visi
                            </h2>
                            <div className="h-1 w-16 bg-primary mb-6"></div>                            
                            <p className={TYPOGRAPHY.bodyText + " text-primary font-semibold italic"}>
                                {visiMotto}
                            </p>
                            <p className={TYPOGRAPHY.bodyText}>
                                {visiText}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Misi Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Kolom Teks Misi */}
                        <div className="order-2 md:order-1">
                            <h2 className={TYPOGRAPHY.sectionHeading + " mb-4 flex items-center"}>
                                <Target size={36} className="mr-3 text-primary" /> Misi
                            </h2>
                            <div className="h-1 w-16 bg-primary mb-6"></div>                            <ul className="space-y-4 text-gray-700">
                                {misiPoints.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <Dot className="text-primary w-6 h-6 mr-2 flex-shrink-0 mt-1" />
                                        <span className={TYPOGRAPHY.bodyText}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Kolom Gambar Misi */}
                        <div className="order-1 md:order-2">
                            <img
                                src={misiImage} // Pastikan path ini benar
                                alt="Kegiatan Akademik dan Ekstrakurikuler SMAN 1 Baleendah - Misi Sekolah"
                                className="w-full rounded-lg shadow-xl aspect-[16/10] object-cover" // Sesuaikan aspect ratio
                            />
                        </div>
                    </div>
                </div>
            </section>

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