import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { Calendar, X, ZoomIn, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function AcademicCalendarPage({ 
    auth, 
    calendarContents = [],
    currentAcademicYear 
}) {
    const page = usePage();
    const flash = page.props.flash || {};
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);

    // Filter active calendar contents
    const activeCalendars = calendarContents.filter(content => content.is_active);    // Prioritize Semester Ganjil (1) first, then Semester Genap (2), otherwise use the first calendar
    useEffect(() => {
        if (activeCalendars.length > 0 && !selectedCalendar) {
            // Find the Semester Ganjil calendar (semester = 1)
            const ganjilCalendar = activeCalendars.find(cal => cal.semester === 1);
            
            // If found, select it, otherwise fallback to the first available calendar
            setSelectedCalendar(ganjilCalendar || activeCalendars[0]);
        }
    }, [calendarContents, selectedCalendar]);
    
    useEffect(() => {
        if (flash && flash.success) {
            const timer = setTimeout(() => {
                flash.success = null;
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const openImageModal = (calendar) => {
        setSelectedCalendar(calendar);
        setShowImageModal(true);
    };
    
    const closeImageModal = () => {
        setShowImageModal(false);
    };

    // Standard navigation data used across the site
    // Get navigation data from centralized source
const navigationData = getNavigationData();

    const programStudiDataNav = [
        { nama: "MIPA", link: "/program-studi/mipa" },
        { nama: "IPS", link: "/program-studi/ips" },
        { nama: "Bahasa", link: "/program-studi/bahasa" },
    ];
    

    

    
    
        return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head>
                <title>Kalender Akademik - SMAN 1 Baleendah</title>
<meta name="description" content="Kalender akademik resmi SMA Negeri 1 Baleendah untuk tahun ajaran terkini. Berisi informasi jadwal penting semester, ujian, libur dan kegiatan sekolah." />
            </Head>
            
            <Navbar 
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* Header Section */}
            <section className="pt-24 pb-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className={TYPOGRAPHY.pageTitle + " text-center md:text-left"}>
                        Kalender Akademik
                    </h1>
                    <p className={TYPOGRAPHY.bodyText + " text-gray-600 max-w-4xl mx-auto md:mx-0 text-center md:text-left"}>
                        Tahun Ajaran {currentAcademicYear || "Terbaru"}
                    </p>
                </div>
            </section>            {/* Flash Message */}
            {flash && flash.success && (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-blue-100 border border-primary text-primary px-4 py-3 rounded">
                        {flash.success}
                    </div>
                </div>
            )}

            <main>                {/* Calendar Selection Tabs - Changed to semester tabs */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white">
                    <div className="border-b border-gray-200 max-w-5xl mx-auto">
                        <nav className="flex -mb-px space-x-8 overflow-x-auto justify-center" aria-label="Tabs">
                            <button
                                onClick={() => setSelectedCalendar(calendarContents.find(cal => cal.semester === 1) || null)}
                                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                                    selectedCalendar && selectedCalendar.semester === 1
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Semester Ganjil
                            </button>
                            <button
                                onClick={() => setSelectedCalendar(calendarContents.find(cal => cal.semester === 2) || null)}
                                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                                    selectedCalendar && selectedCalendar.semester === 2
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Semester Genap
                            </button>
                        </nav>
                    </div>
                </div>
                  {/* Selected Calendar Content */}
                <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {selectedCalendar ? (
                            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-5xl mx-auto border border-gray-200">
                                <h2 className={TYPOGRAPHY.subsectionHeading + " text-center text-gray-800 mb-8"}>
                                    Kalender Akademik {selectedCalendar.academic_year} Semester {selectedCalendar.semester_name}
                                </h2>
                                
                                <div className="flex justify-center">
                                    <div className="w-full max-w-4xl">
                                        <img 
                                            src={selectedCalendar.calendar_image_url} 
                                            alt={`Kalender Akademik ${selectedCalendar.academic_year} Semester ${selectedCalendar.semester_name} - Klik untuk memperbesar`}
                                            className="w-full h-auto rounded-md border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                                            onClick={() => openImageModal(selectedCalendar)}
                                        />
                                        
                                        <p className={TYPOGRAPHY.secondaryText + " text-center mt-4"}>
                                            Klik pada gambar untuk memperbesar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-5xl mx-auto border border-gray-200 text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className={TYPOGRAPHY.cardTitle + " mt-2 text-gray-900"}>Tidak ada kalender akademik</h3>
                                <p className={TYPOGRAPHY.secondaryText + " mt-1"}>
                                    Kalender akademik belum tersedia saat ini.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>            {/* Full Image Modal */}
            <Modal show={showImageModal} onClose={closeImageModal} maxWidth="5xl">
                <div className="p-4 relative">
                    {/* Tombol Close di sudut kanan atas */}
                    <button
                        onClick={closeImageModal}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white/70 rounded-full p-1 focus:outline-none z-10"
                        aria-label="Tutup gambar"
                    >
                        <X size={24} />
                    </button>
                    
                    {selectedCalendar && (
                        <img 
                            src={selectedCalendar.calendar_image_url} 
                            alt={`Kalender Akademik ${selectedCalendar.academic_year} (diperbesar)`}
                            className="w-full h-auto rounded max-h-[80vh] object-contain"
                        />
                    )}
                </div>
            </Modal>
            
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
