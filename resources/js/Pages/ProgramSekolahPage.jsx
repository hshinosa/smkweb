// FILE: resources/js/Pages/ProgramSekolahPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal'; // Import Modal
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
// Import ikon
import { Instagram, Facebook, Linkedin, Twitter, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'; // Tambahkan X

// Path ke aset gambar Anda
// Get navigation data from centralized source
const navigationData = getNavigationData();

// Base URL untuk placeholder, bisa disesuaikan
const placeholderBaseUrl = "https://placehold.co/400x300/E2E8F0/A0AEC0";
const placeholderProgramImage = `${placeholderBaseUrl}`;

// Data Navigasi & Footer
// ... (Salin data navigasi & footer) ...
const programStudiDataNav = [
    { nama: "MIPA", link: "/program-studi/mipa" },
    { nama: "IPS", link: "/program-studi/ips" },
    { nama: "Bahasa", link: "/program-studi/bahasa" },
];

// --- DATA PROGRAM SEKOLAH DENGAN DESKRIPSI ---
const placeholderDescription = "Informasi detail mengenai program ini akan segera ditambahkan. Program ini bertujuan untuk meningkatkan [aspek relevan] siswa dan mempersiapkan mereka untuk [tujuan program].";
const createSlug = (title) => { /* ... fungsi createSlug sama ... */
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};
const allProgramSekolahData = [
    { id: 1, title: "Program Hafidz Juz ke-30 dan Hatam al Qur’an", image: `${placeholderBaseUrl}?text=Prog+1`, link: `/program/${createSlug("Program Hafidz Juz ke-30 dan Hatam al Qur’an")}`, description: "Program pembinaan keagamaan untuk meningkatkan kemampuan hafalan Al-Qur'an siswa, khususnya Juz 30, serta mendorong penyelesaian bacaan Al-Qur'an secara keseluruhan." },
    { id: 2, title: "Program Kajian Muslim (KaMus) dan Jumát Barokah", image: `${placeholderBaseUrl}?text=Prog+2`, link: `/program/${createSlug("Program Kajian Muslim (KaMus) dan Jumát Barokah")}`, description: "Kegiatan rutin untuk pendalaman ilmu agama Islam melalui kajian tematik dan kegiatan berbagi di hari Jumat guna meningkatkan spiritualitas dan kepedulian sosial." },
    { id: 3, title: "Penguatan Pendidikan Karakter (Implementasi 7 Harkat)", image: `${placeholderBaseUrl}?text=Prog+3`, link: `/program/${createSlug("Penguatan Pendidikan Karakter (Implementasi 7 Harkat)")}`, description: "Implementasi nilai-nilai karakter dasar (jujur, tanggung jawab, disiplin, dll.) dalam seluruh kegiatan sekolah untuk membentuk pribadi siswa yang berakhlak mulia." },
    { id: 4, title: "Gerakan Memungut Sampah (GMS)", image: `${placeholderBaseUrl}?text=Prog+4`, link: `/program/${createSlug("Gerakan Memungut Sampah (GMS)")}`, description: "Program pembiasaan untuk menumbuhkan kesadaran dan kepedulian siswa terhadap kebersihan lingkungan sekolah dan sekitarnya." },
    { id: 5, title: "Pembelajaran dan Asesmen Berbasis Proyek Kolaborasi", image: `${placeholderBaseUrl}?text=Prog+5`, link: `/program/${createSlug("Pembelajaran dan Asesmen Berbasis Proyek Kolaborasi")}`, description: "Metode pembelajaran yang mendorong siswa bekerja sama dalam tim untuk menyelesaikan proyek nyata, mengintegrasikan berbagai mata pelajaran dan dinilai secara autentik." },
    { id: 6, title: "Pembelajaran Berbasis Dunia Kerja", image: `${placeholderBaseUrl}?text=Prog+6`, link: `/program/${createSlug("Pembelajaran Berbasis Dunia Kerja")}`, description: "Pendekatan pembelajaran yang mengintegrasikan praktik dan standar industri ke dalam kurikulum, termasuk magang dan guru tamu dari industri." },
    { id: 7, title: "Implementasi Jabar Masagi dan P5", image: `${placeholderBaseUrl}?text=Prog+7`, link: `/program/${createSlug("Implementasi Jabar Masagi dan P5")}`, description: "Mengintegrasikan nilai-nilai kearifan lokal Jawa Barat (Jabar Masagi) dan Proyek Penguatan Profil Pelajar Pancasila (P5) dalam pembelajaran dan kegiatan sekolah." },
    { id: 8, title: "Pengembangan Laboratorium Sains dan Bahasa", image: `${placeholderBaseUrl}?text=Prog+8`, link: `/program/${createSlug("Pengembangan Laboratorium Sains dan Bahasa")}`, description: "Mengembangkan fasilitas laboratorium sains (fisika, kimia, biologi) dan laboratorium bahasa untuk mendukung pembelajaran program studi MIPA, IPS, dan Bahasa." },
    { id: 9, title: "Sekolah Pencetak Wirausaha (SPW)", image: `${placeholderBaseUrl}?text=Prog+9`, link: `/program/${createSlug("Sekolah Pencetak Wirausaha (SPW)")}`, description: "Program yang bertujuan menumbuhkan jiwa kewirausahaan siswa melalui pelatihan, pendampingan, dan fasilitasi pengembangan ide bisnis." },
    { id: 10, title: "Sekolah Ramah Anak (SRA)", image: `${placeholderBaseUrl}?text=Prog+10`, link: `/program/${createSlug("Sekolah Ramah Anak (SRA)")}`, description: "Menciptakan lingkungan sekolah yang aman, nyaman, inklusif, dan melindungi hak-hak anak selama proses belajar mengajar." },
    { id: 11, title: "Sekoper Cinta", image: `${placeholderBaseUrl}?text=Prog+11`, link: `/program/${createSlug("Sekoper Cinta")}`, description: "Program pemberdayaan perempuan (Sekolah Perempuan Capai Impian dan Cita-cita) yang mungkin diadaptasi atau didukung oleh sekolah." },
    { id: 12, title: "Gelar Karya", image: `${placeholderBaseUrl}?text=Prog+12`, link: `/program/${createSlug("Gelar Karya")}`, description: "Acara rutin untuk menampilkan hasil karya, proyek, dan kreativitas siswa dari berbagai program keahlian kepada publik dan industri." },
    { id: 13, title: "Peningkatan Kapasitas Kepemimpinan Kepala Sekolah", image: `${placeholderBaseUrl}?text=Prog+13`, link: `/program/${createSlug("Peningkatan Kapasitas Kepemimpinan Kepala Sekolah")}`, description: "Program pengembangan profesional berkelanjutan bagi kepala sekolah untuk meningkatkan kompetensi manajerial dan kepemimpinan." },
    { id: 14, title: "Peningkatan Kompetensi GTK", image: `${placeholderBaseUrl}?text=Prog+14`, link: `/program/${createSlug("Peningkatan Kompetensi GTK")}`, description: "Program pelatihan dan pengembangan bagi Guru dan Tenaga Kependidikan (GTK) untuk meningkatkan kualitas pengajaran dan layanan pendidikan." },
    { id: 15, title: "Pengembangan Digital Library dan Sarana-Prasarana", image: `${placeholderBaseUrl}?text=Prog+15`, link: `/program/${createSlug("Pengembangan Digital Library dan Sarana-Prasarana")}`, description: "Upaya modernisasi fasilitas sekolah, termasuk pengembangan perpustakaan digital dan peningkatan sarana fisik lainnya." },
    { id: 16, title: "Kunjungan Industri", image: `${placeholderBaseUrl}?text=Prog+16`, link: `/program/${createSlug("Kunjungan Industri")}`, description: "Kegiatan pembelajaran di luar sekolah dengan mengunjungi perusahaan atau industri relevan untuk memberikan wawasan dunia kerja kepada siswa." },
    { id: 17, title: "LKS dan Berbagai Kegiatan Lomba", image: `${placeholderBaseUrl}?text=Prog+17`, link: `/program/${createSlug("LKS dan Berbagai Kegiatan Lomba")}`, description: "Partisipasi aktif sekolah dalam Lomba Kompetensi Siswa (LKS) dan berbagai kompetisi akademik maupun non-akademik lainnya." },
    { id: 18, title: "Beasiswa dan kerjasama dengan PT", image: `${placeholderBaseUrl}?text=Prog+18`, link: `/program/${createSlug("Beasiswa dan kerjasama dengan PT")}`, description: "Upaya menjalin kerjasama dengan Perguruan Tinggi (PT) untuk program beasiswa, jalur masuk khusus, atau program kemitraan lainnya." },
    { id: 19, title: "Job Fair - Edu Fair dan Tracer Study", image: `${placeholderBaseUrl}?text=Prog+19`, link: `/program/${createSlug("Job Fair - Edu Fair dan Tracer Study")}`, description: "Kegiatan pameran kerja, pameran pendidikan lanjut, serta pelacakan alumni (Tracer Study) untuk membantu lulusan dan evaluasi program." },
    { id: 20, title: "Kelas Unggulan Program Studi MIPA dan IPS", image: `${placeholderBaseUrl}?text=Prog+20`, link: `/program/${createSlug("Kelas Unggulan Program Studi MIPA dan IPS")}`, description: "Program kelas khusus dengan kurikulum diperkaya dan pembelajaran intensif untuk mempersiapkan siswa menghadapi kompetisi akademik dan seleksi perguruan tinggi terbaik." },
    { id: 21, title: "Menuju Badan Layanan Umum Daerah (BLUD)", image: `${placeholderBaseUrl}?text=Prog+21`, link: `/program/${createSlug("Menuju Badan Layanan Umum Daerah (BLUD)")}`, description: "Proses transformasi sekolah menjadi BLUD untuk meningkatkan fleksibilitas pengelolaan keuangan dan layanan pendidikan." },
];
// --- AKHIR DATA PROGRAM SEKOLAH ---

const ITEMS_PER_PAGE = 8;

export default function ProgramSekolahPage({ auth }) {

    // --- STATE UNTUK SEARCH, PAGINATION, DAN MODAL ---
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);
    // --- AKHIR STATE ---

    // --- LOGIKA FILTERING ---
    const filteredPrograms = useMemo(() => {
        if (!searchTerm) {
            return allProgramSekolahData;
        }
        return allProgramSekolahData.filter(program =>
            program.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // --- LOGIKA PAGINATION ---
    const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);

    // --- HANDLER ---
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };
    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // --- HANDLER MODAL ---
    const openProgramModal = (program) => {
        setSelectedProgram(program);
        setIsProgramModalOpen(true);
    };
    const closeProgramModal = () => {
        setIsProgramModalOpen(false);
        // Optional: clear selected program after animation
        // setTimeout(() => setSelectedProgram(null), 300);
    };
    // --- AKHIR HANDLER ---

    return (
        <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex flex-col">
            <Head>
                 <title>Program Unggulan & Kegiatan - SMAN 1 Baleendah</title>
                 <meta name="description" content="Jelajahi berbagai program unggulan dan kegiatan kesiswaan di SMA Negeri 1 Baleendah, mulai dari penguatan karakter akademik, program MIPA, IPS, Bahasa, olimpiade sains, hingga kegiatan ekstrakurikuler yang beragam." />
            </Head>

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* Header Section */}
            <section className="pt-24 pb-12 bg-white shadow-sm">
                 {/* ... (Konten header sama) ... */}
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className={TYPOGRAPHY.pageTitle + " text-center md:text-left"}>
                        Program & Kegiatan Sekolah
                    </h1>                    <p className={TYPOGRAPHY.bodyText + " text-gray-600 max-w-4xl mx-auto md:mx-0 text-center md:text-left"}>
                        Berbagai inisiatif dan aktivitas yang dirancang untuk mengembangkan prestasi akademik, kreativitas, dan karakter siswa SMA Negeri 1 Baleendah secara holistik.
                    </p>
                </div>
            </section>

            {/* Program List Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20 flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- SEARCH BAR --- */}
                    <div className="mb-8 max-w-xl mx-auto">
                        {/* ... (Search bar sama) ... */}
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari program atau kegiatan..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* --- KARTU PROGRAM (DENGAN onClick) --- */}
                    {currentItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {currentItems.map((program) => (
                                <div
                                    key={program.id}
                                    className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden h-full flex flex-col transform hover:-translate-y-1 cursor-pointer" // Tambah cursor-pointer
                                    onClick={() => openProgramModal(program)} // Tambah onClick
                                >
                                    <div className="relative w-full h-48 bg-gray-300 overflow-hidden">
                                        <img
                                            src={program.image}
                                            alt={`Ilustrasi Program ${program.title}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-fallback.png'; }}
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className={TYPOGRAPHY.cardTitle + " group-hover:text-primary transition-colors flex-grow min-h-[3em] leading-snug"}>
                                            {program.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={TYPOGRAPHY.secondaryText + " text-center mt-10"}>Program atau kegiatan tidak ditemukan.</p>
                    )}

                    {/* --- PAGINATION CONTROLS --- */}
                    {totalPages > 1 && (
                         <div className="mt-12 flex justify-center items-center space-x-4">
                            {/* ... (Kontrol pagination sama) ... */}
                             <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                                aria-label="Halaman Sebelumnya"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm text-gray-700">
                                Halaman {currentPage} dari {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
                                aria-label="Halaman Berikutnya"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
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

             {/* --- MODAL DETAIL PROGRAM (GAMBAR 16:9) --- */}
            <Modal show={isProgramModalOpen} onClose={closeProgramModal} maxWidth="2xl">
                <div className="p-6">
                    {selectedProgram ? (
                        <>
                            <div className="flex justify-between items-start mb-4">
                                <h2 className={TYPOGRAPHY.sectionHeading + " text-primary pr-8"}>{selectedProgram.title}</h2>
                                <button
                                    onClick={closeProgramModal}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0"
                                    aria-label="Tutup detail program"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* ==== MODIFIKASI AREA GAMBAR ==== */}
                            <div className="mb-4 w-full aspect-w-16 aspect-h-9 overflow-hidden rounded-md bg-gray-200">
                                {/* Container dengan rasio 16:9 */}
                                <img
                                    src={selectedProgram.image}
                                    alt={`Ilustrasi ${selectedProgram.title}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-fallback.png'; }}
                                />
                            </div>
                            {/* ==== AKHIR MODIFIKASI ==== */}                            <div className={TYPOGRAPHY.bodyText + " space-y-3 prose prose-sm max-w-none"}>
                                <p>{selectedProgram.description || "Deskripsi untuk program ini belum tersedia."}</p>
                            </div>

                            <div className="mt-6 text-right">
                                <button
                                    type="button"
                                    onClick={closeProgramModal}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                >
                                    Tutup
                                </button>
                            </div>
                        </>
                    ) : (
                         <div className={TYPOGRAPHY.secondaryText + " text-center p-10"}>Menutup...</div>
                    )}
                </div>
            </Modal>
            {/* --- AKHIR MODAL --- */}

        </div>
    );
}