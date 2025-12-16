import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
// Import academic data
import { extracurricularData, pageMetadata } from '@/Utils/academicData';

// Import data navigasi
// Get navigation data from centralized source
const navigationData = getNavigationData();














export default function EkstrakurikulerPage() {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openDetailModal = (activity, categoryName) => {
        setSelectedActivity({ ...activity, categoryName });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedActivity(null);
    };

    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="Ekstrakurikuler - SMAN 1 Baleendah" />
            
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
                            Ekstrakurikuler
                        </h1>
                        <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-4"></div>
                        <p className={TYPOGRAPHY.bodyText + " text-gray-800 max-w-3xl mx-auto md:mx-0"}>
                            Kegiatan pengembangan bakat dan minat siswa SMA Negeri 1 Baleendah yang dirancang untuk 
                            membentuk karakter, mengasah kemampuan, dan meraih prestasi di berbagai bidang.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Render all extracurricular categories dynamically */}
                    {Object.entries(extracurricularData.categories).map(([categoryKey, category]) => (
                        <div key={categoryKey} className="mb-16">
                            <div className="text-center md:text-left mb-10">
                                <h2 className={TYPOGRAPHY.sectionHeading}>
                                    Ekstrakurikuler <span className="text-primary">{category.name}</span>
                                </h2>
                                <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.activities.map((activity, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <div className="p-5">
                                            {/* Header Card */}
                                            <h3 className={TYPOGRAPHY.cardTitle + " mb-3"}>
                                                {activity.name}
                                            </h3>
                                            
                                            {/* Deskripsi */}
                                            <p className={TYPOGRAPHY.bodyText + " text-gray-800 mb-3 line-clamp-3"}>
                                                {activity.description.length > 120 
                                                    ? activity.description.substring(0, 120) + "..." 
                                                    : activity.description
                                                }
                                            </p>
                                            
                                            {/* Jadwal */}
                                            <div className="mb-3">
                                                <p className={TYPOGRAPHY.secondaryText}>
                                                    <span className="font-semibold text-gray-800">Jadwal:</span> {activity.schedule}
                                                </p>
                                            </div>
                                            
                                            {/* Prestasi */}
                                            <div className="mb-4">
                                                <p className={TYPOGRAPHY.secondaryText + " font-semibold text-gray-800 mb-2"}>
                                                    Prestasi Terbaru:
                                                </p>
                                                {activity.achievements.length > 0 ? (
                                                    <div className="bg-gray-50 p-3 rounded border-l-4 border-primary">
                                                        <div className="flex items-start">
                                                            <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                            <span className={TYPOGRAPHY.secondaryText + " text-gray-700"}>
                                                                {activity.achievements[0].length > 50 
                                                                    ? activity.achievements[0].substring(0, 50) + "..." 
                                                                    : activity.achievements[0]
                                                                }
                                                            </span>
                                                        </div>
                                                        {activity.achievements.length > 1 && (
                                                            <p className="text-primary text-xs font-medium mt-1 ml-5">
                                                                +{activity.achievements.length - 1} prestasi lainnya
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-50 p-3 rounded text-center">
                                                        <span className={TYPOGRAPHY.secondaryText + " text-gray-500 italic"}>
                                                            Belum ada prestasi tercatat
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Tombol */}
                                        <div className="px-5 pb-5">
                                            <button
                                                onClick={() => openDetailModal(activity, category.name)}
                                                className="w-full bg-primary hover:bg-primary-darker text-white font-medium py-2.5 px-4 rounded transition-colors duration-200 text-sm"
                                            >
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Info Pendaftaran Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary text-white rounded-xl p-8 shadow-lg">
                        <h2 className={TYPOGRAPHY.sectionHeading + " text-white mb-6"}>Informasi Pendaftaran</h2>
                        <p className={TYPOGRAPHY.bodyText + " text-white mb-6"}>
                            Pendaftaran ekstrakurikuler dibuka setiap awal tahun ajaran. Siswa dapat memilih 
                            maksimal 2 ekstrakurikuler sesuai dengan minat dan bakat masing-masing untuk 
                            mengembangkan potensi diri secara optimal.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className={TYPOGRAPHY.cardTitle + " text-white mb-3"}>Syarat Pendaftaran:</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className={TYPOGRAPHY.secondaryText + " text-white"}>Pendaftaran melalui wali kelas atau langsung ke pembina ekstrakurikuler</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className={TYPOGRAPHY.secondaryText + " text-white"}>Mengisi formulir pendaftaran dan menyerahkan pas foto 3x4</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className={TYPOGRAPHY.cardTitle + " text-white mb-3"}>Ketentuan:</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className={TYPOGRAPHY.secondaryText + " text-white"}>Mengikuti seleksi untuk beberapa ekstrakurikuler tertentu</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className={TYPOGRAPHY.secondaryText + " text-white"}>Komitmen mengikuti kegiatan minimal 1 tahun</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal Detail Ekstrakurikuler */}
            <Modal show={showModal} onClose={closeModal} maxWidth="5xl">
                {selectedActivity && (
                    <div className="p-6">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                            <div>
                                <h2 className={TYPOGRAPHY.sectionHeading + " text-gray-900"}>
                                    {selectedActivity.name}
                                </h2>
                                <p className={TYPOGRAPHY.secondaryText + " text-primary font-medium"}>
                                    Ekstrakurikuler {selectedActivity.categoryName}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content Modal - Layout 2 Kolom */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Kolom Kiri - Deskripsi */}
                            <div>
                                <h3 className={TYPOGRAPHY.cardTitle + " mb-4 text-gray-900"}>
                                    Deskripsi Kegiatan
                                </h3>
                                <div className="space-y-4">
                                    <p className={TYPOGRAPHY.bodyText + " text-gray-700 leading-relaxed"}>
                                        {selectedActivity.description}
                                    </p>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className={TYPOGRAPHY.secondaryText + " font-semibold text-gray-900 mb-2"}>
                                            Jadwal Kegiatan
                                        </h4>
                                        <p className={TYPOGRAPHY.secondaryText + " text-gray-700"}>
                                            {selectedActivity.schedule}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded border-l-4 border-primary">
                                        <h4 className={TYPOGRAPHY.secondaryText + " font-semibold text-gray-800 mb-3"}>
                                            Manfaat Mengikuti Kegiatan
                                        </h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span className={TYPOGRAPHY.secondaryText + " text-gray-700"}>
                                                    Mengembangkan bakat dan minat sesuai bidang
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span className={TYPOGRAPHY.secondaryText + " text-gray-700"}>
                                                    Melatih kerjasama tim dan kepemimpinan
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span className={TYPOGRAPHY.secondaryText + " text-gray-700"}>
                                                    Membangun karakter dan kedisiplinan
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span className={TYPOGRAPHY.secondaryText + " text-gray-700"}>
                                                    Kesempatan meraih prestasi dan penghargaan
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Kolom Kanan - Prestasi */}
                            <div>
                                <h3 className={TYPOGRAPHY.cardTitle + " mb-4 text-gray-900"}>
                                    Prestasi yang Diraih
                                </h3>
                                <div className="bg-white border border-gray-200 rounded max-h-96 overflow-y-auto">
                                    <div className="p-4">
                                        {selectedActivity.achievements.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedActivity.achievements.map((achievement, index) => (
                                                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded border-l-4 border-primary">
                                                        <span className="inline-block w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
                                                            {index + 1}
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className={TYPOGRAPHY.secondaryText + " text-gray-800 font-medium"}>
                                                                {achievement}
                                                            </p>
                                                            <p className={TYPOGRAPHY.secondaryText + " text-gray-500 text-xs mt-1"}>
                                                                Tahun {new Date().getFullYear()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className={TYPOGRAPHY.secondaryText + " text-gray-500"}>
                                                    Belum ada prestasi yang tercatat
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info Tambahan */}
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                                    <h4 className={TYPOGRAPHY.secondaryText + " font-semibold text-blue-800 mb-2"}>
                                        Informasi Pendaftaran
                                    </h4>
                                    <p className={TYPOGRAPHY.secondaryText + " text-blue-700"}>
                                        Untuk bergabung dengan ekstrakurikuler ini, silakan hubungi pembina atau daftar melalui wali kelas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-200">
                            <SecondaryButton onClick={closeModal}>
                                Tutup
                            </SecondaryButton>
                            <PrimaryButton onClick={closeModal}>
                                Hubungi Pembina
                            </PrimaryButton>
                        </div>
                    </div>
                )}
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