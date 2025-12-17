// FILE: resources/js/Pages/StrukturOrganisasiPage.jsx

import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';
import { X } from 'lucide-react';
// Import typography constants
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';

// Get navigation data from centralized source
const navigationData = getNavigationData();

const strukturImage = '/images/struktur-organisasi-sman1-baleendah.jpg';

export default function StrukturOrganisasiPage({ auth }) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const openImageModal = () => {
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    return (
        <div className="bg-white font-sans text-gray-800">
            <Head title="Struktur Organisasi - SMAN 1 Baleendah" description="Bagan struktur organisasi SMA Negeri 1 Baleendah." />

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* SECTION A: HERO BANNER */}
            <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/hero-bg-sman1-baleendah.jpeg" 
                        alt="Background Struktur Organisasi" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4 drop-shadow-lg`}>
                        Struktur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Organisasi</span>
                    </h1>
                </div>
            </section>

            {/* SECTION B: CHART (Bagan) */}
            <section className="py-20 bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl max-w-6xl mx-auto border border-gray-100">
                        <img
                            src={strukturImage}
                            alt="Bagan Struktur Organisasi SMA Negeri 1 Baleendah - Klik untuk memperbesar"
                            className="w-full h-auto rounded-xl border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
                            onClick={openImageModal}
                        />
                        <p className={`${TYPOGRAPHY.smallText} text-center mt-6 italic`}>
                            Klik pada gambar untuk memperbesar tampilan.
                        </p>
                    </div>
                </div>
            </section>

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />

            {/* Modal */}
            <Modal show={isImageModalOpen} onClose={closeImageModal} maxWidth="5xl">
                <div className="p-4 relative bg-white rounded-lg">
                    <button
                        onClick={closeImageModal}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white/80 rounded-full p-2 hover:bg-white transition-colors focus:outline-none z-10 shadow-sm"
                        aria-label="Tutup gambar"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={strukturImage}
                        alt="Bagan Struktur Organisasi SMA Negeri 1 Baleendah (diperbesar)"
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            </Modal>
        </div>
    );
}