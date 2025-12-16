// FILE: resources/js/Pages/ProfilSekolahPage.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar'; // Sesuaikan path jika perlu
import Footer from '@/Components/Footer'; // Sesuaikan path jika perlu
// Import ikon dari lucide-react (contoh, tambahkan sesuai kebutuhan)
import { Building, Target, Eye, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
// Import typography constants
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';

// Path ke aset gambar Anda (sama seperti LandingPage)
// Get navigation data from centralized source
const navigationData = getNavigationData();

// Ganti dengan path gambar yang sesuai dari desain
const sejarahImage = '/images/keluarga-besar-sman1-baleendah.png'; // Ganti dengan path gambar aula/sejarah yang benar

// Data Navigasi & Footer (konsisten dengan struktur navbar baru)

// Data Visi & Misi (Contoh)
const visi = "Menjadi lembaga pendidikan vokasi unggulan yang menghasilkan lulusan berkarakter mulia, kompeten di bidangnya, adaptif terhadap perubahan, dan berdaya saing global.";
const misi = [
    "Menyelenggarakan pendidikan yang berkualitas dengan kurikulum yang relevan dengan kebutuhan industri.",
    "Mengembangkan potensi peserta didik secara optimal melalui pembelajaran berbasis proyek dan pengalaman kerja nyata.",
    "Membentuk karakter peserta didik yang beriman, bertaqwa, berakhlak mulia, mandiri, dan bertanggung jawab.",
    "Menjalin kemitraan strategis dengan dunia usaha dan dunia industri (DUDI) untuk penyelarasan kurikulum, magang, dan penyerapan lulusan.",
    "Meningkatkan kompetensi pendidik dan tenaga kependidikan secara berkelanjutan.",
    "Mengembangkan sarana prasarana pendidikan yang modern dan representatif.",
    "Menciptakan lingkungan belajar yang kondusif, aman, nyaman, dan menyenangkan.",
];

export default function ProfilSekolahPage({ auth }) {

    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="Profil & Sejarah - SMAN 1 Baleendah" description="Pelajari sejarah dan profil SMA Negeri 1 Baleendah sebagai sekolah menengah atas unggulan di Baleendah dengan program studi MIPA, IPS, dan Bahasa yang berkualitas." />

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
                        Profil dan Sejarah SMA Negeri 1 Baleendah
                    </h1>                    <p className={TYPOGRAPHY.bodyText + " text-gray-600 max-w-4xl mx-auto md:mx-0 text-center md:text-left"}>
                        Menelusuri jejak langkah SMA Negeri 1 Baleendah sebagai institusi pendidikan menengah atas yang terus berkembang dan berkontribusi untuk kemajuan pendidikan di Baleendah.
                    </p>
                </div>
            </section>

            {/* Sejarah & Summary Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">                        {/* Kolom Teks Sejarah */}
                        <div className="md:col-span-2 prose prose-sm max-w-none text-gray-700">
                            <h2 className={TYPOGRAPHY.sectionHeading + " mb-4"}>
                                Profil Sekolah <span className="text-primary">SMAN 1 Baleendah</span>
                            </h2>
                            <div className="h-1 w-24 bg-primary mb-8"></div>

                            <h3 className={TYPOGRAPHY.subsectionHeading + " mt-6 mb-2"}>Visi dan Misi</h3>
                            <p className={TYPOGRAPHY.bodyText}>
                                <strong>SMA Negeri 1 Baleendah</strong> berkomitmen untuk menjadi lembaga pendidikan menengah atas yang unggul dalam prestasi akademik, berkarakter kuat, dan berwawasan global. Sekolah ini mengutamakan pengembangan potensi siswa secara holistik melalui pendidikan yang berkualitas dan berorientasi pada pencapaian prestasi akademik yang tinggi.
                            </p>

                            <h3 className={TYPOGRAPHY.subsectionHeading + " mt-6 mb-2"}>Program Studi Unggulan</h3>
                            <p className={TYPOGRAPHY.bodyText}>
                                SMAN 1 Baleendah menyediakan tiga program studi utama yang dirancang untuk mempersiapkan siswa menghadapi tantangan pendidikan tinggi dan masa depan yang cerah:
                            </p>
                            <ul className={"list-disc list-inside mt-2 space-y-1 " + TYPOGRAPHY.bodyText}>
                                <li><strong>MIPA (Matematika dan Ilmu Pengetahuan Alam)</strong> - Fokus pada pengembangan kemampuan analitis dan pemahaman mendalam tentang sains dan matematika</li>
                                <li><strong>IPS (Ilmu Pengetahuan Sosial)</strong> - Mengembangkan pemahaman tentang dinamika sosial, ekonomi, dan budaya masyarakat</li>
                                <li><strong>Bahasa (Ilmu Bahasa dan Budaya)</strong> - Memperdalam kemampuan berbahasa dan apresiasi terhadap sastra serta budaya</li>
                            </ul>

                            <h3 className={TYPOGRAPHY.subsectionHeading + " mt-6 mb-2"}>Fasilitas dan Lingkungan Belajar</h3>
                            <p className={TYPOGRAPHY.bodyText}>
                                Sekolah ini dilengkapi dengan fasilitas pembelajaran modern yang mendukung proses belajar mengajar yang efektif. Lingkungan sekolah yang kondusif dan tenaga pengajar yang berkualitas menciptakan atmosfer akademik yang mendorong siswa untuk berprestasi dan mengembangkan karakter yang kuat.
                            </p>
                        </div>

                        {/* Kolom Gambar dan Summary */}
                        <div className="md:col-span-1">
                            <img
                                src={sejarahImage} // Pastikan path ini benar
                                alt="Suasana kegiatan belajar mengajar di SMA Negeri 1 Baleendah"
                                className="w-full rounded-lg shadow-xl mb-8 aspect-video object-cover"
                            />
                            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                                <h3 className={TYPOGRAPHY.subsectionHeading + " mb-3 flex items-center"}>
                                    <Building size={24} className="mr-2 text-primary" />
                                    SMA Negeri 1 Baleendah
                                </h3>                                <p className={TYPOGRAPHY.bodyText + " text-gray-600"}>
                                    SMAN 1 Baleendah adalah sekolah menengah atas unggulan di Kabupaten Bandung yang memiliki reputasi baik dalam bidang pendidikan akademik. Sekolah ini berfokus pada pengembangan prestasi akademik siswa dan pembentukan karakter yang kuat untuk mempersiapkan mereka menghadapi jenjang pendidikan tinggi.
                                </p>
                                <h4 className="text-md font-semibold text-gray-700 mb-2">Program Studi Unggulan:</h4>
                                <ul className={"list-disc list-inside text-gray-600 space-y-1 " + TYPOGRAPHY.bodyText}>
                                    <li>MIPA (Matematika dan Ilmu Pengetahuan Alam)</li>
                                    <li>IPS (Ilmu Pengetahuan Sosial)</li>
                                    <li>Bahasa (Ilmu Bahasa dan Budaya)</li>
                                </ul>
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