// FILE: resources/js/Pages/VisiMisiPage.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar'; // Sesuaikan path jika perlu
import Footer from '@/Components/Footer'; // Sesuaikan path jika perlu
// Import ikon dari lucide-react
import { Eye, Target, Dot, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react'; // Dot untuk list misi

// Path ke aset gambar Anda (sama seperti LandingPage)
const logoSmkn15 = '/images/logo-smkn15.png';
// Path gambar spesifik untuk Visi & Misi dari desain
const visiImage = '/images/keluarga-besar-smkn15.png'; // Ganti dengan path gambar atas yang benar
const misiImage = '/images/panen-karya-smkn15.jpg'; // Ganti dengan path gambar bawah yang benar

// Data Navigasi & Footer (reuse atau definisikan ulang)
// (Salin data yang sama seperti di ProfilSekolahPage.jsx)
const programKeahlianDataNav = [
    { nama: "DKV", link: "/programkeahlian/dkv" },
    { nama: "Perhotelan", link: "/programkeahlian/perhotelan" },
    { nama: "Kuliner", link: "/programkeahlian/kuliner" },
    { nama: "Pekerjaan Sosial", link: "/programkeahlian/pekerjaan-sosial" },
];
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
const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7320221071664!2d107.6164360758815!3d-6.922603993077097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e62c87267923%3A0x7ef8aaa0fcd59ec9!2sSMKN%2015%20Kota%20Bandung!5e0!3m2!1sid!2sid!4v1746550004423!5m2!1sid!2sid";
const socialMediaLinks = [
    { name: "Instagram", href: "https://www.instagram.com/smkn_15bandung", icon: Instagram, handle: "@smkn_15bandung" },
    { name: "Facebook", href: "https://www.facebook.com/SMKN15Bandung", icon: Facebook, handle: "SMKN 15 Bandung" },
    { name: "LinkedIn", href: "https://www.linkedin.com/school/smkn-15-bandung/", icon: Linkedin, handle: "SMKN 15 Bandung" },
    { name: "X", href: "https://twitter.com/smkn15bandung", icon: Twitter, handle: "@smkn15bandung" },
];

// Data Visi & Misi dari desain
const visiMotto = "“Creativity (C), Adaptability (A), Responsibility (R), Dan Empathy (E)”";
const visiText = "Membentuk Peserta Didik Yang Berakhlak Mulia, Empati, Inovatif, Kompeten, Mandiri Dan Bernalar Kritis, Mampu Beradaptasi Dengan Perkembangan Teknologi, Mempunyai Daya Saing Tinggi Di Dunia Kerja, Berkomitmen Terhadap Segala Keputusan Yang Diambil.";
const misiPoints = [
    "Mampu Untuk Merasakan Keadaan Emosional Orang Lain, Menciptakan Keinginan Untuk Berbagi Dan Menolong Sesama Serta Kepedulian Sosial.",
    "Memiliki Kecerdasan Spiritual Dan Tenggang Rasa Antar Umat Beragama, Berkarakter Dan Berbudi Pekerti",
    "Mampu Berinovasi Dan Berdaya Saing Tinggi Untuk Berwirausaha Sesuai Dengan Tuntutan Dunia Usaha, Dunia Industri, Dan Dunia Kerja (DUDIKA).",
    "Unggul Dan Kompeten Dalam Program Keahlian Pekerjaan Sosial, Perhotelan, Kuliner, Dan Desain Komunikasi Visual.",
    "Memiliki Kesadaran Diri, Mampu Menganalisis, Serta Menyesuaikan Terhadap Perubahan Di Lingkungan Sekolah, Masyarakat, Nasional, Dan Internasional. Secara Nilai, Etika, Dan Norma."
];

export default function VisiMisiPage({ auth }) {

    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head>
                <title>Visi & Misi - SMKN 15 Bandung | Kreatif, Adaptif, Bertanggung Jawab, Empati (CARE)</title>
                <meta name="description" content="Visi dan Misi SMK Negeri 15 Bandung. Membentuk peserta didik berakhlak mulia, kompeten, berdaya saing tinggi, dan berkarakter CARE (Creativity, Adaptability, Responsibility, Empathy) melalui program pendidikan vokasi unggulan." />
            </Head>

            <Navbar
                logoSmkn15={logoSmkn15}
                tentangKamiLinks={tentangKamiLinks}
                manajemenSekolahSublinks={manajemenSekolahSublinks}
                akademikInformasiLinks={akademikInformasiLinks}
                programKeahlianDataNav={programKeahlianDataNav}
            />

            {/* Header Section */}
            <section className="pt-24 pb-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 text-center md:text-left">
                        Visi dan Misi SMK Negeri 15 Bandung
                    </h1>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto md:mx-0 text-center md:text-left">
                        Landasan dan arah tujuan pendidikan di SMK Negeri 15 Bandung dalam mencetak generasi penerus bangsa yang unggul dan berkarakter.
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
                                alt="Keluarga Besar SMK Negeri 15 Bandung Tahun 2024-2025 - Visi Sekolah"
                                className="w-full rounded-lg shadow-xl aspect-[16/10] object-cover" // Sesuaikan aspect ratio jika perlu
                            />
                             {/* Kutipan di bawah gambar (jika diinginkan, opsional) */}
                            <p className="text-center italic text-sm text-gray-600 mt-2">
                                "Di sini, kita belajar tentang ilmu, akhlak, dan keberanian. Mari bersama membangun masa depan dengan hati dan karya."
                            </p>
                        </div>

                        {/* Kolom Teks Visi */}
                        <div className="order-2 md:order-2">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center">
                                <Eye size={36} className="mr-3 text-primary" /> Visi
                            </h2>
                            <div className="h-1 w-16 bg-primary mb-6"></div>
                            <p className="text-primary font-semibold text-lg mb-4 italic">
                                {visiMotto}
                            </p>
                            <p className="text-gray-700 text-lg leading-relaxed">
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
                            <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center">
                                <Target size={36} className="mr-3 text-primary" /> Misi
                            </h2>
                            <div className="h-1 w-16 bg-primary mb-6"></div>
                            <ul className="space-y-4 text-gray-700">
                                {misiPoints.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <Dot className="text-primary w-6 h-6 mr-2 flex-shrink-0 mt-1" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Kolom Gambar Misi */}
                        <div className="order-1 md:order-2">
                            <img
                                src={misiImage} // Pastikan path ini benar
                                alt="Kegiatan Panen Karya dan Market Day SMKN 15 Bandung - Misi Sekolah"
                                className="w-full rounded-lg shadow-xl aspect-[16/10] object-cover" // Sesuaikan aspect ratio
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer
                logoSmkn15={logoSmkn15}
                googleMapsEmbedUrl={googleMapsEmbedUrl}
                tentangKamiLinks={tentangKamiLinks}
                akademikInformasiLinks={akademikInformasiLinks}
                programKeahlianDataNav={programKeahlianDataNav}
                socialMediaLinks={socialMediaLinks}
            />
        </div>
    );
}