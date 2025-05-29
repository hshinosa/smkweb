// FILE: resources/js/Pages/StrukturOrganisasiPage.jsx

import React, { useState } from 'react'; // Tambahkan useState
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal'; // Import komponen Modal
// Import ikon
import { Instagram, Facebook, Linkedin, Twitter, X } from 'lucide-react'; // X untuk tombol close modal

// Path ke aset gambar Anda
const logoSmkn15 = '/images/logo-smkn15.png';
const strukturImage = '/images/struktur-organisasi-smkn15.jpg';

// Data Navigasi & Footer (diasumsikan sama)
// ... (Salin data navigasi & footer dari kode sebelumnya) ...
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


export default function StrukturOrganisasiPage({ auth }) {
    // State untuk mengontrol modal gambar
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const openImageModal = () => {
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head>
                 <title>Struktur Organisasi - SMKN 15 Bandung</title>
                 <meta name="description" content="Lihat bagan struktur organisasi resmi SMK Negeri 15 Bandung periode terbaru. Menampilkan hierarki kepemimpinan sekolah, wakil kepala sekolah, ketua program keahlian, dan unit kerja lainnya." />
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
                {/* ... (konten header sama) ... */}
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 text-center md:text-left">
                        Struktur Organisasi
                    </h1>                    <p className="text-sm sm:text-base leading-relaxed text-gray-600 max-w-4xl mx-auto md:mx-0 text-center md:text-left">
                        Bagan struktur organisasi SMK Negeri 15 Bandung yang menunjukkan hierarki kepemimpinan dan koordinasi antar unit kerja di sekolah.
                    </p>
                </div>
            </section>

            {/* Struktur Organisasi Image Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-5xl mx-auto border border-gray-200">
                         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
                            Bagan Struktur Organisasi SMK Negeri 15 Bandung
                         </h2>
                        <img
                            src={strukturImage}
                            alt="Bagan Struktur Organisasi SMK Negeri 15 Bandung - Klik untuk memperbesar" // Update alt text
                            className="w-full h-auto rounded-md border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity duration-200" // Tambahkan cursor-pointer dan hover effect
                            onClick={openImageModal} // Tambahkan onClick handler
                        />
                        <p className="text-center text-xs text-gray-500 mt-4">
                            Klik pada gambar untuk memperbesar.
                        </p>
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

            {/* Modal untuk menampilkan gambar diperbesar */}
            <Modal show={isImageModalOpen} onClose={closeImageModal} maxWidth="5xl"> {/* Gunakan maxWidth yang lebih besar */}
                <div className="p-4 relative"> {/* Padding dan relative untuk positioning tombol close */}
                    {/* Tombol Close di sudut kanan atas */}
                    <button
                        onClick={closeImageModal}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white/70 rounded-full p-1 focus:outline-none z-10"
                        aria-label="Tutup gambar" // Accessibility
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={strukturImage}
                        alt="Bagan Struktur Organisasi SMK Negeri 15 Bandung (diperbesar)"
                        className="w-full h-auto rounded" // Gambar mengisi modal
                    />
                </div>
            </Modal>

        </div>
    );
}