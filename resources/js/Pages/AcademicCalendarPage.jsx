import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';
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
    const logoSmkn15 = '/images/logo-smkn15.png';
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
    ];    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head>
                <title>Kalender Akademik - SMKN 15 Bandung</title>
                <meta name="description" content="Kalender akademik resmi SMK Negeri 15 Bandung untuk tahun ajaran terkini. Berisi informasi jadwal penting semester, ujian, libur dan kegiatan sekolah." />
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
                        Kalender Akademik
                    </h1>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-600 max-w-4xl mx-auto md:mx-0 text-center md:text-left">
                        Tahun Ajaran {currentAcademicYear || "Terbaru"}
                    </p>
                </div>
            </section>            {/* Flash Message */}
            {flash && flash.success && (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
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
                                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
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
                                        
                                        <p className="text-center text-xs text-gray-500 mt-4">
                                            Klik pada gambar untuk memperbesar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-5xl mx-auto border border-gray-200 text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada kalender akademik</h3>
                                <p className="mt-1 text-base text-gray-500">
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
