// FILE: resources/js/Pages/StrukturOrganisasiPage.jsx

import React, { useState } from 'react'; // Tambahkan useState
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal'; // Import komponen Modal
// Import ikon
import { Instagram, Facebook, Linkedin, Twitter, X } from 'lucide-react'; // X untuk tombol close modal
// Import typography constants
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';

// Path ke aset gambar Anda
// Get navigation data from centralized source
const navigationData = getNavigationData();

const strukturImage = '/images/struktur-organisasi-sman1-baleendah.jpg';

// Data Navigasi & Footer (diasumsikan sama)
// ... (Salin data navigasi & footer dari kode sebelumnya) ...
const programStudiDataNav = [
    { nama: "MIPA", link: "/program-studi/mipa" },
    { nama: "IPS", link: "/program-studi/ips" },
    { nama: "Bahasa", link: "/program-studi/bahasa" },
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
                 <title>Struktur Organisasi - SMAN 1 Baleendah</title>
                 <meta name="description" content="Lihat bagan struktur organisasi resmi SMA Negeri 1 Baleendah periode terbaru. Menampilkan hierarki kepemimpinan sekolah, wakil kepala sekolah, koordinator program studi, dan unit kerja lainnya." />
            </Head>

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* Header Section */}
            <section className="pt-24 pb-12 bg-white">
                {/* ... (konten header sama) ... */}
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className={TYPOGRAPHY.pageTitle + " text-center md:text-left"}>
                        Struktur Organisasi
                    </h1>                    <p className={TYPOGRAPHY.bodyText + " text-gray-600 max-w-4xl mx-auto md:mx-0 text-center md:text-left"}>
                        Bagan struktur organisasi SMA Negeri 1 Baleendah yang menunjukkan hierarki kepemimpinan dan koordinasi antar unit kerja di sekolah.
                    </p>
                </div>
            </section>

            {/* Struktur Organisasi Image Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-5xl mx-auto border border-gray-200">
                         <h2 className={TYPOGRAPHY.sectionHeading + " text-center mb-8"}>
                            Bagan Struktur Organisasi SMA Negeri 1 Baleendah
                         </h2>
                        <img
                            src={strukturImage}
                            alt="Bagan Struktur Organisasi SMA Negeri 1 Baleendah - Klik untuk memperbesar" // Update alt text
                            className="w-full h-auto rounded-md border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity duration-200" // Tambahkan cursor-pointer dan hover effect
                            onClick={openImageModal} // Tambahkan onClick handler
                        />
                        <p className={TYPOGRAPHY.smallText + " text-center mt-4"}>
                            Klik pada gambar untuk memperbesar.
                        </p>
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
                        alt="Bagan Struktur Organisasi SMA Negeri 1 Baleendah (diperbesar)"
                        className="w-full h-auto rounded" // Gambar mengisi modal
                    />
                </div>
            </Modal>

        </div>
    );
}