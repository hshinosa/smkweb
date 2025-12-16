import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
// Import typography constants
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';

// Import data navigasi
// Get navigation data from centralized source
const navigationData = getNavigationData();












// Data berita dan pengumuman
const beritaData = [
    {
        id: 1,
        judul: "Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2025/2026",
        tanggal: "15 Januari 2025",
        kategori: "Pengumuman",
        ringkasan: "Informasi lengkap mengenai jadwal, persyaratan, dan tata cara pendaftaran PPDB SMAN 1 Baleendah tahun ajaran 2025/2026.",
        gambar: "https://placehold.co/400x250/E2E8F0/A0AEC0?text=PPDB+2025"
    },
    {
        id: 2,
        judul: "Prestasi Gemilang Siswa SMAN 1 Baleendah di Olimpiade Sains Nasional",
        tanggal: "10 Januari 2025",
        kategori: "Berita",
        ringkasan: "Siswa SMAN 1 Baleendah meraih medali emas dalam Olimpiade Sains Nasional bidang Fisika tingkat provinsi Jawa Barat.",
        gambar: "https://placehold.co/400x250/E2E8F0/A0AEC0?text=OSN+2025"
    },
    {
        id: 3,
        judul: "Pelaksanaan Ujian Tengah Semester Genap 2024/2025",
        tanggal: "8 Januari 2025",
        kategori: "Pengumuman",
        ringkasan: "Jadwal dan tata tertib pelaksanaan Ujian Tengah Semester Genap tahun ajaran 2024/2025 untuk seluruh siswa.",
        gambar: "https://placehold.co/400x250/E2E8F0/A0AEC0?text=UTS+Genap"
    },
    {
        id: 4,
        judul: "Kegiatan Bakti Sosial SMAN 1 Baleendah di Desa Sekitar",
        tanggal: "5 Januari 2025",
        kategori: "Berita",
        ringkasan: "Siswa dan guru SMAN 1 Baleendah mengadakan kegiatan bakti sosial berupa pembagian sembako kepada masyarakat kurang mampu.",
        gambar: "https://placehold.co/400x250/E2E8F0/A0AEC0?text=Baksos"
    },
    {
        id: 5,
        judul: "Workshop Persiapan UTBK-SNBT 2025",
        tanggal: "3 Januari 2025",
        kategori: "Pengumuman",
        ringkasan: "Pelaksanaan workshop intensif persiapan UTBK-SNBT 2025 untuk siswa kelas XII dengan narasumber berpengalaman.",
        gambar: "https://placehold.co/400x250/E2E8F0/A0AEC0?text=UTBK+2025"
    },
    {
        id: 6,
        judul: "Festival Seni dan Budaya SMAN 1 Baleendah 2025",
        tanggal: "28 Desember 2024",
        kategori: "Berita",
        ringkasan: "Penyelenggaraan festival seni dan budaya tahunan yang menampilkan berbagai kreativitas siswa dalam bidang seni dan budaya.",
        gambar: "https://placehold.co/400x250/E2E8F0/A0AEC0?text=Festival+Seni"
    }
];

export default function BeritaPengumumanPage() {
    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="Berita & Pengumuman - SMAN 1 Baleendah" />
            
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* Header Section */}
            <section className="pt-24 pb-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center md:text-left">
                        <h1 className={TYPOGRAPHY.pageTitle}>
                            Berita & Pengumuman
                        </h1>
                        <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-4"></div>
                        <p className={TYPOGRAPHY.bodyText + " text-gray-600 max-w-3xl mx-auto md:mx-0"}>
                            Ikuti perkembangan terkini dan informasi penting dari SMA Negeri 1 Baleendah. 
                            Temukan berita prestasi siswa, kegiatan sekolah, dan pengumuman resmi yang perlu Anda ketahui.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filter Kategori */}
                    <div className="text-center mb-10 md:mb-12">
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button className={`px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-darker transition-colors ${TYPOGRAPHY.buttonText}`}>
                                Semua
                            </button>
                            <button className={`px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 ${TYPOGRAPHY.buttonText}`}>
                                Berita
                            </button>
                            <button className={`px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 ${TYPOGRAPHY.buttonText}`}>
                                Pengumuman
                            </button>
                        </div>
                    </div>

                    {/* Grid Berita */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {beritaData.map((berita) => (
                            <div key={berita.id} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1">
                                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                                    <img
                                        src={berita.gambar}
                                        alt={berita.judul}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            berita.kategori === 'Berita' 
                                                ? 'bg-primary text-white' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {berita.kategori}
                                        </span>
                                        <span className={TYPOGRAPHY.secondaryText + " text-gray-700"}>{berita.tanggal}</span>
                                    </div>
                                    <h3 className={TYPOGRAPHY.subsectionHeading + " group-hover:text-primary transition-colors mb-3 line-clamp-2"}>
                                        {berita.judul}
                                    </h3>
                                    <p className={TYPOGRAPHY.bodyText + " text-gray-800 line-clamp-3"}>
                                        {berita.ringkasan}
                                    </p>
                                    <button className={`text-primary hover:text-primary-darker transition-colors ${TYPOGRAPHY.buttonText}`}>
                                        Baca Selengkapnya →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 flex justify-center">
                        <div className="flex space-x-2">
                            <button className={`px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 ${TYPOGRAPHY.buttonText}`}>
                                ← Sebelumnya
                            </button>
                            <button className={`px-4 py-2 bg-primary text-white rounded-lg ${TYPOGRAPHY.buttonText}`}>
                                1
                            </button>
                            <button className={`px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 ${TYPOGRAPHY.buttonText}`}>
                                2
                            </button>
                            <button className={`px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 ${TYPOGRAPHY.buttonText}`}>
                                3
                            </button>
                            <button className={`px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 ${TYPOGRAPHY.buttonText}`}>
                                Selanjutnya →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pengumuman Penting Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-primary text-white p-8 rounded-xl shadow-lg">
                            <h3 className={TYPOGRAPHY.subsectionHeading + " text-white mb-6 flex items-center"}>
                                📢 Pengumuman Penting
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span className={TYPOGRAPHY.bodyText}>Pendaftaran PPDB 2025/2026 dibuka mulai 1 Februari 2025</span>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span className={TYPOGRAPHY.bodyText}>Ujian Tengah Semester Genap dimulai 10 Februari 2025</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span className={TYPOGRAPHY.bodyText}>Workshop UTBK-SNBT tersedia untuk siswa kelas XII</span>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <span className={TYPOGRAPHY.bodyText}>Kegiatan ekstrakurikuler dimulai kembali setelah libur semester</span>
                                    </div>
                                </div>
                            </div>
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