// FILE: resources/js/Pages/ProfilSekolahPage.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar'; // Sesuaikan path jika perlu
import Footer from '@/Components/Footer'; // Sesuaikan path jika perlu
// Import ikon dari lucide-react (contoh, tambahkan sesuai kebutuhan)
import { Building, Target, Eye, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

// Path ke aset gambar Anda (sama seperti LandingPage)
const logoSmkn15 = '/images/logo-smkn15.png';
// Ganti dengan path gambar yang sesuai dari desain
const sejarahImage = '/images/keluarga-besar-smkn15.png'; // Ganti dengan path gambar aula/sejarah yang benar

// Data Navigasi & Footer (reuse atau definisikan ulang)
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
            <Head title="Profil & Sejarah - SMKN 15 Bandung" description="Pelajari sejarah panjang SMK Negeri 15 Bandung sejak 1919 hingga menjadi sekolah kejuruan unggulan di Bandung dengan program keahlian Pekerjaan Sosial, Kuliner, Perhotelan, dan DKV." />

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
                        Profil dan Sejarah SMK Negeri 15 Bandung
                    </h1>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto md:mx-0 text-center md:text-left">
                        Menelusuri jejak langkah SMK Negeri 15 Bandung dari masa ke masa, sebuah institusi pendidikan vokasi yang terus bertransformasi dan berkontribusi untuk negeri.
                    </p>
                </div>
            </section>

            {/* Sejarah & Summary Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {/* Kolom Teks Sejarah */}
                        <div className="md:col-span-2 prose max-w-none text-gray-700">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Perjalanan Panjang <span className="text-primary">SMKN 15 Bandung</span>
                            </h2>
                            <div className="h-1 w-24 bg-primary mb-8"></div>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Era Awal (1919 - 1953)</h3>
                            <p>
                                Sejarah SMK Negeri 15 Bandung berakar panjang, dimulai pada tahun <strong>1919</strong>. Pada masa itu, gedung sekolah yang kini berdiri megah di Jalan Jenderal Gatot Subroto, dibangun oleh organisasi Indo Europee Verbond (IEV). Fungsi awalnya adalah sebagai <strong>Kweek School Voor Onderwijzer</strong> (Sekolah Guru), sebuah lembaga pendidikan penting di era kolonial Belanda. Setelah kemerdekaan Indonesia diproklamasikan, semangat nasionalisme mendorong perubahan. Sekolah ini kemudian berganti nama menjadi <strong>Indooeenheidts Verbond</strong> atau Gabungan Indo Unit Kesatuan Indonesia (GIKI) pada tahun 1952. Transformasi berlanjut, dan pada tanggal <strong>1 Mei 1953</strong>, GIKI secara resmi berubah status menjadi <strong>SGA Negeri II Bandung</strong> (Sekolah Guru Atas).
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Transformasi Menuju Vokasi (1978 - 1997)</h3>
                            <p>
                                Perkembangan sistem pendidikan nasional terus berjalan. Pada tanggal <strong>22 April 1978</strong>, SGA Negeri II Bandung diubah menjadi <strong>SPG Negeri I Bandung</strong> (Sekolah Pendidikan Guru). Lima tahun kemudian, tepatnya pada <strong>1 September 1983</strong>, terjadi peralihan fungsi lagi. Berdasarkan Keputusan Kementerian Pendidikan dan Kebudayaan, SPG Negeri I Bandung dialihfungsikan menjadi <strong>SGO Negeri Bandung</strong> (Sekolah Guru Olahraga), menunjukkan fokus baru pada pendidikan keolahragaan.
                            </p>
                            <p>
                                Seiring dengan kebijakan baru pendidikan kejuruan, pada tahun <strong>1989</strong>, SGO Negeri Bandung kembali bertransformasi menjadi <strong>Sekolah Menengah Pekerjaan Sosial (SMPS) Negeri Bandung</strong>. Perubahan ini menandai awal fokus sekolah pada bidang kejuruan pekerjaan sosial. Puncak transformasi terjadi pada tahun <strong>1997</strong>. Melalui Keputusan Resmi Menteri Pendidikan, SMPS Negeri Bandung secara resmi berubah nama dan status menjadi <strong>SMK Negeri 15 Bandung</strong>, dengan fokus awal yang kuat pada Program Keahlian Pekerjaan Sosial. Nama inilah yang melekat hingga sekarang.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Perkembangan Modern (2006 - Sekarang)</h3>
                            <p>
                                Seiring berjalannya waktu dan tuntutan dunia kerja yang dinamis, SMK Negeri 15 Bandung terus beradaptasi dan berkembang. Sekolah mulai menambahkan program keahlian baru untuk menjawab kebutuhan industri. Pada tahun <strong>2006</strong>, sekolah ini membuka Program Keahlian <strong>Akomodasi Perhotelan</strong>. Langkah ini kemudian disusul dengan pembukaan Program Keahlian <strong>Jasa Boga</strong> (sekarang Kuliner) dan <strong>Multimedia</strong> (yang kemudian menjadi Desain Komunikasi Visual) pada tahun <strong>2016</strong>.
                            </p>
                            <p>
                                Saat ini, SMK Negeri 15 Bandung bangga menawarkan empat program keahlian utama yang relevan dan diminati: <strong>Pekerjaan Sosial, Akomodasi Perhotelan, Kuliner,</strong> dan <strong>Desain Komunikasi Visual (DKV)</strong>. Di tengah modernisasi program, gedung sekolah ini tetap mempertahankan arsitektur asli peninggalan kolonial Belanda, menjadikannya saksi bisu sekaligus simbol perjalanan sejarah panjang institusi ini dalam dunia pendidikan vokasi di Indonesia.
                            </p>
                        </div>

                        {/* Kolom Gambar dan Summary */}
                        <div className="md:col-span-1">
                            <img
                                src={sejarahImage} // Pastikan path ini benar
                                alt="Suasana kegiatan belajar mengajar di aula SMK Negeri 15 Bandung"
                                className="w-full rounded-lg shadow-xl mb-8 aspect-video object-cover"
                            />
                            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                                    <Building size={24} className="mr-2 text-primary" />
                                    SMK Negeri 15 Bandung
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    SMKN 15 Bandung adalah salah satu sekolah kejuruan unggulan di Kota Bandung yang memiliki reputasi baik di bidang pendidikan vokasi. Sekolah ini berfokus pada pengembangan kompetensi siswa dalam berbagai program keahlian yang relevan dengan kebutuhan industri modern.
                                </p>
                                <h4 className="text-md font-semibold text-gray-700 mb-2">Program Keahlian Unggulan:</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>Pekerjaan Sosial</li>
                                    <li>Kuliner</li>
                                    <li>Perhotelan</li>
                                    <li>Desain Komunikasi Visual (DKV)</li>
                                </ul>
                            </div>
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