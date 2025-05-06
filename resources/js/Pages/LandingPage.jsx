import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CountUp from 'react-countup';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // Import modul yang dibutuhkan

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Path ke aset gambar Anda
const logoSmkn15 = '/images/logo-smkn15.png';
const heroBgImage = '/images/hero-bg-smkn15.jpg';
const groupPhoto = '/images/keluarga-besar-smkn15.png';
const kepalaSekolahPhoto = '/images/kepala-sekolah.jpg'; // Pastikan path ini benar

// Placeholder gambar untuk Program-Program
const placeholderProgram1 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+1';
const placeholderProgram2 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+2';
const placeholderProgram3 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+3';
const placeholderProgram4 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+4';
const placeholderProgram5 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+5';

// Definisi Komponen Ikon (pastikan semua digunakan atau hapus yang tidak perlu)
const ChevronDownIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ChevronLeftIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const InformationCircleIcon = (props) => (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const InstagramIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);
  
const FacebookIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);
  
const LinkedinIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
);
  
const XIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const placeholderDKV = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=DKV';
const placeholderKuliner = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Kuliner';
const placeholderPekerjaanSosial = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Peksos';
const placeholderPerhotelan = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Hotel';

export default function LandingPage({ auth }) {
    // Pastikan URL Embed Google Maps ini valid dan sudah Anda ganti dari placeholder
    const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7320221071664!2d107.6164360758815!3d-6.922603993077097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e62c87267923%3A0x7ef8aaa0fcd59ec9!2sSMKN%2015%20Kota%20Bandung!5e0!3m2!1sid!2sid!4v1746550004423!5m2!1sid!2sid";
    
    // Data untuk Program Keahlian
    const programKeahlian = [
        { nama: "Desain Komunikasi Visual", gambar: placeholderDKV, link: "/programkeahlian/dkv" },
        { nama: "Kuliner", gambar: placeholderKuliner, link: "/programkeahlian/kuliner" },
        { nama: "Pekerjaan Sosial", gambar: placeholderPekerjaanSosial, link: "/programkeahlian/pekerjaan-sosial" },
        { nama: "Perhotelan", gambar: placeholderPerhotelan, link: "/programkeahlian/perhotelan" },
    ];

    // Data untuk Fakta SMKN 15 (Angka statis untuk sekarang)
    const faktaSekolah = [
        { angka: 40, label: "Guru" },
        { angka: 10, label: "Staff" },
        { angka: 1700, label: "Siswa" },
        { angka: 22034, label: "Alumni" },
        { angka: 10, label: "Fasilitas" },
    ];

    const programSekolah = [
        { nama: "Menuju Badan Layanan Umum Daerah (BLUD)", gambar: placeholderProgram1, link: "/program/blud" },
        { nama: "Kelas Industri Program Keahlian Perhotelan & Kuliner", gambar: placeholderProgram2, link: "/program/kelas-industri" },
        { nama: "Kunjungan Industri", gambar: placeholderProgram3, link: "/program/kunjungan-industri" },
        { nama: "Pengembangan Digital Library dan Prasarana", gambar: placeholderProgram4, link: "/program/digital-library" },
        { nama: "Program Kewirausahaan Siswa", gambar: placeholderProgram5, link: "/program/kewirausahaan" }, // Contoh tambahan
    ];

    return (
        <div className="bg-secondary text-gray-800 font-sans"> {/* Menambahkan font-sans untuk konsistensi */}
            <Head title="SMKN 15 Bandung" />

            {/* Navbar */}
            <nav className="bg-white fixed w-full z-50 shadow-navbar">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <img className="h-10 w-auto" src={logoSmkn15} alt="Logo SMKN 15 Bandung" />
                            </Link>
                            <Link href="/" className="ml-3 text-xl font-semibold text-gray-800">
                                SMK Negeri 15 Bandung
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                            <Link href="/kalender-akademik" className="text-gray-700 hover:text-primary inline-flex items-center px-1 text-sm font-medium">
                                Kalender Akademik
                            </Link>
                            <Link href="/berita-pengumuman" className="text-gray-700 hover:text-primary inline-flex items-center px-1 text-sm font-medium">
                                Berita dan Pengumuman
                            </Link>
                            <div className="relative group">
                                <button className="text-gray-700 hover:text-primary inline-flex items-center px-1 text-sm font-medium focus:outline-none">
                                    Tentang Kami
                                    <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400 group-hover:text-primary" />
                                </button>
                                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-20">
                                    <div className="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <Link href="/profil-sekolah" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Profil Sekolah</Link>
                                        <Link href="/visi-misi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Visi & Misi</Link>
                                        <Link href="/struktur-organisasi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Struktur Organisasi</Link>
                                        <Link href="/fasilitas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Fasilitas</Link>
                                        <div className="relative group/submenu">
                                            <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary cursor-pointer" role="menuitem">
                                                <span>Program Keahlian</span>
                                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <div className="absolute left-full top-[-1px] ml-px w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 ease-in-out z-30">
                                                <div className="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical">
                                                    <Link href="/programkeahlian/dkv" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">DKV</Link>
                                                    <Link href="/programkeahlian/perhotelan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Perhotelan</Link>
                                                    <Link href="/programkeahlian/kuliner" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Kuliner</Link>
                                                    <Link href="/programkeahlian/pekerjaan-sosial" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Pekerjaan Sosial</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href="/program" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Program</Link>
                                        <Link href="/daftar-guru-tu" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Daftar Guru & TU</Link>
                                        <Link href="/manajemen-sekolah" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Manajemen Sekolah</Link>
                                        <Link href="/hubungi-kami" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">Hubungi Kami</Link>
                                    </div>
                                </div>
                            </div>
                            <Link href="/informasi-ppdb" className="bg-primary text-white hover:bg-primary-darker inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md self-center">
                                <InformationCircleIcon className="h-5 w-5 mr-2" />
                                Informasi PPDB
                            </Link>
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-16 bg-cover bg-center h-[70vh] flex items-center justify-center" style={{ backgroundImage: `url('${heroBgImage}')` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 text-center px-4">
                    <h2 className="text-3xl sm:text-3xl md:text-5xl font-bold text-white leading-tight">Selamat Datang di</h2>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-2">SMK Negeri 15 Bandung</h1>
                </div>
            </div>

            {/* Tentang SMKN 15 Bandung Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="prose-sm text-gray-700 max-w-none">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tentang <span className="text-primary">SMKN 15 Bandung</span></h2>
                            <div className="h-1 w-24 bg-primary mb-6"></div>
                            <p>SMKN 15 Bandung adalah salah satu sekolah kejuruan negeri unggulan di Kota Bandung yang memiliki reputasi baik dalam pendidikan vokasi. Sekolah ini berfokus pada pengembangan kompetensi siswa agar relevan dengan kebutuhan industri modern.</p>
                            <p>Kami menawarkan berbagai program keahlian strategis, termasuk Pekerjaan Sosial, Kuliner, Perhotelan, dan Desain Komunikasi Visual, yang didukung oleh pengajar kompeten dan fasilitas memadai.</p>
                            <p>Tujuan kami adalah mencetak lulusan yang tidak hanya terampil secara profesional tetapi juga berkarakter mulia, berani, dan penuh karya, siap untuk bekerja maupun melanjutkan pendidikan ke jenjang yang lebih tinggi. Mari bersama membangun masa depan di SMKN 15 Bandung.</p>
                            <Link href="/tentang/profil-sekolah" className="mt-6 inline-block bg-primary text-white hover:bg-primary-darker transition duration-300 px-6 py-2 rounded-md text-lg font-semibold no-underline">
                                Lihat Selengkapnya
                            </Link>
                        </div>
                        <div className="mt-8 md:mt-0 flex justify-center">
                            <img src={groupPhoto} alt="Keluarga Besar SMKN 15 Bandung Tahun 2024-2025" className="rounded-lg shadow-xl max-w-2xl w-full"/>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sambutan Kepala Sekolah Section */}
            <section className="py-12 bg-secondary-bg sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                        <div className="md:col-span-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Sambutan Kepala Sekolah</h2>
                            <h3 className="text-4xl font-semibold text-primary mb-2">SMKN 15 Bandung</h3>
                            <div className="h-1 w-24 bg-primary mb-8"></div>
                            <img src={kepalaSekolahPhoto} alt="Dra. Lilis Yuyun, M.M.Pd. - Kepala Sekolah SMKN 15 Bandung" className="rounded-lg w-full max-w-xs mx-auto md:mx-0"/>
                        </div>
                        <div className="md:col-span-8 prose-sm text-gray-700 max-w-none">
                            <p className="font-semibold">Sampurasun!</p>
                            <p>Bismillahirrahmanirrahim.</p>
                            <p>Alhamdulillahi rabbil ‘alamin. Wassalatu wassalamu ‘ala asyrafil anbiya-i wal mursalin, wa’ala alihi wasahbihi ajma’in.</p>
                            <p>Puji syukur senantiasa kita panjatkan kehadirat Allah SWT, Tuhan Yang Maha Esa, atas limpahan rahmat dan karunia-Nya yang tiada henti. Shalawat serta salam semoga selalu tercurah kepada junjungan kita, Nabi Muhammad SAW, beserta keluarga dan para sahabatnya. Alhamdulillahilladzi bi ni’matihi tatimmush sholihat, Alhamdulillah rabbil ‘alamin.</p>
                            <p>Dengan penuh kehangatan, saya, Dra. Lilis Yuyun, M.M.Pd., selaku Kepala Sekolah, menyambut Bapak, Ibu, para Pendidik dan Tenaga Kependidikan, Orang Tua/Wali Murid, para Alumni, Mitra Industri, serta Ananda siswa-siswi SMK Negeri 15 Bandung yang kami banggakan, di situs resmi sekolah kita. Platform digital ini kami persembahkan sebagai jendela informasi utama, sarana untuk mengenal lebih dekat dinamika kehidupan di SMK Negeri 15 Bandung.</p>
                            <p>Melalui situs ini, kami berupaya menyajikan informasi yang relevan dan terkini mengenai profil sekolah, visi-misi, program keahlian unggulan kami yaitu Pekerjaan Sosial, Kuliner, Perhotelan, dan Desain Komunikasi Visual, berbagai kegiatan kesiswaan yang positif, prestasi yang telah diraih, serta fasilitas pendukung pembelajaran yang terus kami kembangkan.</p>
                            <p>Saya ingin menyampaikan apresiasi dan ucapan terima kasih yang tulus kepada tim pengelola website yang telah berupaya keras menyajikan informasi sekolah secara komprehensif. Tentu, kami menyadari bahwa situs ini masih dalam proses pengembangan dan penyempurnaan. Oleh karena itu, masukan, saran, dan kritik yang membangun dari seluruh civitas akademika dan masyarakat umum sangat kami nantikan demi kemajuan bersama.</p>
                            <p>Lebih dari sekadar penyedia informasi, kami berharap website ini dapat menjadi ruang interaksi yang positif, mempererat jalinan silaturahmi, dan membangun sinergi antar seluruh elemen sekolah dan masyarakat. Semangat ini selaras dengan motto yang menjadi jiwa sekolah kita:</p>
                            <p className="font-semibold">SMK Negeri 15 Bandung: CARE</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Creativity (Kreativitas):</strong> Mengembangkan daya cipta dan inovasi.</li>
                                <li><strong>Adaptability (Adaptabilitas):</strong> Siap beradaptasi dengan perubahan.</li>
                                <li><strong>Responsibility (Tanggung Jawab):</strong> Memiliki rasa tanggung jawab yang tinggi.</li>
                                <li><strong>Empathy (Empati):</strong> Menumbuhkan kepedulian terhadap sesama.</li>
                            </ul>
                            <p>Nilai-nilai inilah yang kami tanamkan dalam setiap langkah pendidikan dan pembinaan karakter, agar lulusan kami tidak hanya cakap secara teknis, tetapi juga memiliki kepribadian yang luhur dan siap berkontribusi.</p>
                            <p>Akhir kata, mari kita satukan langkah, bekerja dan berkarya dengan niat tulus ikhlas demi mengantarkan anak-anak didik kita menuju gerbang kesuksesan. Terima kasih atas kunjungan dan perhatian Anda. Semoga Allah SWT senantiasa membimbing dan meridhoi setiap usaha kita, memberikan kesehatan, kebahagiaan, dan kelancaran. Amin Ya Rabbal ‘Alamin.</p>
                            <p>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p>
                            <div className="mt-6">
                                <p className="font-semibold">Hormat kami,</p>
                                <p className="font-semibold">Dra. Lilis Yuyun, M.M.Pd.</p>
                                <p>Kepala Sekolah SMK Negeri 15 Bandung</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Keahlian Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20"> {/* Atau bg-secondary */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center md:text-left mb-10 md:mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">
                            4 Program Keahlian <span className="text-primary">SMKN 15 Bandung</span>
                        </h2>
                        <div className="h-1 w-24 bg-primary mt-2 mx-auto md:mx-0"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {programKeahlian.map((program, index) => (
                            <Link href={program.link} key={index} className="group block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 hover:scale-105">
                                <div className="w-full h-48 bg-gray-200">
                                    <img 
                                        src={program.gambar} 
                                        alt={program.nama} 
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                        {program.nama.split(" ").slice(0, -1).join(" ")}
                                        {program.nama.includes("Visual") && <br />} {/* Break line untuk DKV */}
                                        {program.nama.split(" ").pop()}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fakta SMKN 15 Bandung Section */}
            <section className="py-12 sm:py-12 lg:py-18 bg-primary text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 md:mb-12">
                        <h2 className="text-3xl font-bold">
                            Fakta SMKN 15 Bandung
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 text-center">
                        {faktaSekolah.map((fakta, index) => (
                            <div key={index} className="py-4">
                                <p className="text-4xl lg:text-5xl font-bold">
                                    <CountUp start={0} end={fakta.angka} duration={2} separator="," enableScrollSpy scrollSpyOnce /> {/* Menggunakan CountUp untuk animasi angka */}
                                </p>
                                <p className="text-sm lg:text-base uppercase tracking-wider mt-1">
                                    {fakta.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Program-Program SMKN 15 Bandung Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20"> {/* Atau bg-secondary */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-1 text-center md:text-left">
                                Program-Program <span className="text-primary">SMKN 15 Bandung</span>
                            </h2>
                            <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-4 md:mb-0"></div>
                        </div>
                        <Link 
                            href="/program-sekolah"
                            className="bg-primary text-white hover:bg-primary-darker px-6 py-2 rounded-md text-sm font-semibold transition duration-300"
                        >
                            Lihat Selengkapnya
                        </Link>
                    </div>

                    {/* Tambahkan div wrapper untuk Swiper agar bisa memberi padding untuk shadow dan tombol navigasi */}
                    <div className="relative px-0 sm:px-8 md:px-12"> {/* Padding horizontal untuk ruang tombol navigasi */}
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20} // Kurangi jarak antar slide jika kartu lebih kecil
                            slidesPerView={1}
                            navigation={{
                                nextEl: '.swiper-button-next-custom', // Selector kustom
                                prevEl: '.swiper-button-prev-custom', // Selector kustom
                            }}
                            pagination={{ clickable: true, el: '.swiper-pagination-custom' }} // Selector kustom
                            grabCursor={true}
                            className="program-swiper !pb-10" // !pb-10 untuk memberi ruang pada pagination
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                768: { slidesPerView: 3, spaceBetween: 24 },
                                1024: { slidesPerView: 4, spaceBetween: 24 }, // Jumlah kartu bisa 3 atau 4
                            }}
                        >
                            {programSekolah.map((program, index) => (
                                <SwiperSlide key={index} className="pb-1 overflow-visible"> {/* Sedikit padding bawah pada slide untuk shadow */}
                                    <Link href={program.link} className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden h-full flex flex-col">
                                        {/* Mengurangi tinggi gambar */}
                                        <div className="w-full h-40 bg-gray-200"> {/* Tinggi gambar disesuaikan (misal h-40 atau h-36) */}
                                            <img 
                                                src={program.gambar} 
                                                alt={program.nama} 
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4 flex-grow"> {/* Padding pada konten teks */}
                                            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors min-h-[2.5em] line-clamp-2"> {/* Ukuran font dan min-height disesuaikan */}
                                                {program.nama}
                                            </h3>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        {/* Tombol Navigasi Kustom & Pagination */}
                        <div className="swiper-button-prev-custom absolute top-1/2 left-0 transform -translate-y-1/2 z-10 cursor-pointer p-2 bg-white/70 hover:bg-white rounded-full shadow-md">
                            <ChevronLeftIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="swiper-button-next-custom absolute top-1/2 right-0 transform -translate-y-1/2 z-10 cursor-pointer p-2 bg-white/70 hover:bg-white rounded-full shadow-md">
                            <ChevronRightIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="swiper-pagination-custom text-center"></div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-secondary-bg text-gray-700 pt-16 pb-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
                        <div className="lg:col-span-3 md:col-span-6"> {/* Disesuaikan agar peta lebih proporsional di md */}
                            <div className="flex items-center mb-4">
                                <img src={logoSmkn15} alt="Logo SMKN 15 Bandung" className="h-12 mr-3" />
                                <span className="text-xl font-semibold text-gray-800">SMK Negeri 15 Bandung</span>
                            </div>
                            <p className="text-sm mb-2">Jalan Jendral Gatot Subroto No. 4, Kelurahan Burangrang, Kecamatan Lengkong, Kota Bandung, Jawa Barat 40262</p>
                            <p className="text-sm mb-2">(022) 7303659</p>
                            <p className="text-sm mb-4">smklimabelas@gmail.com</p>
                            <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-md"> {/* Menggunakan aspect ratio dari core Tailwind */}
                                <iframe
                                    src={googleMapsEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Peta SMKN 15 Bandung"
                                ></iframe>
                            </div>
                        </div>

                        <div className="lg:col-span-1"> {/* Disesuaikan untuk md */}
                        </div>

                        <div className="lg:col-span-3 md:col-span-6"> {/* Disesuaikan untuk md */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tentang Kami</h3>
                            <ul className="space-y-[15px]">
                                <li><Link href="/tentang/profil-sekolah" className="text-sm hover:text-primary transition-colors">Profil Sekolah</Link></li>
                                <li><Link href="/tentang/visi-misi" className="text-sm hover:text-primary transition-colors">Visi & Misi</Link></li>
                                <li><Link href="/tentang/struktur-organisasi" className="text-sm hover:text-primary transition-colors">Struktur Organisasi</Link></li>
                                <li><Link href="/tentang/fasilitas" className="text-sm hover:text-primary transition-colors">Fasilitas</Link></li>
                                <li><Link href="/tentang/program" className="text-sm hover:text-primary transition-colors">Program</Link></li>
                                <li><Link href="/tentang/daftar-guru-tu" className="text-sm hover:text-primary transition-colors">Daftar Guru dan TU</Link></li>
                                <li><Link href="/tentang/manajemen-sekolah" className="text-sm hover:text-primary transition-colors">Manajemen Sekolah</Link></li>
                                <li><Link href="/hubungi-kami" className="text-sm hover:text-primary transition-colors">Hubungi Kami</Link></li>
                            </ul>
                        </div>
                        <div className="lg:col-span-3 md:col-span-6"> {/* Disesuaikan untuk md */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Akademik & Informasi</h3>
                            <ul className="space-y-[15px]">
                                <li><Link href="/programkeahlian" className="text-sm hover:text-primary transition-colors">Program Keahlian</Link></li>
                                <li><Link href="/informasi-ppdb" className="text-sm hover:text-primary transition-colors">Informasi PPDB</Link></li>
                                <li><Link href="/kalender-akademik" className="text-sm hover:text-primary transition-colors">Kalender Akademik</Link></li>
                                <li><Link href="/berita-pengumuman" className="text-sm hover:text-primary transition-colors">Berita dan Pengumuman</Link></li>
                            </ul>
                        </div>
                        <div className="lg:col-span-2 md:col-span-6"> {/* Disesuaikan untuk md */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tautan</h3>
                            <ul className="space-y-[19px]">
                                <li><a href="https://www.instagram.com/smkn_15bandung" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:text-primary transition-colors group"><InstagramIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-primary" /> @smkn_15bandung</a></li>
                                <li><a href="https://www.facebook.com/SMKN15Bandung" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:text-primary transition-colors group"><FacebookIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-primary" /> SMKN 15 Bandung</a></li>
                                <li><a href="https://www.linkedin.com/school/smkn-15-bandung/" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:text-primary transition-colors group"><LinkedinIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-primary" /> SMKN 15 Bandung</a></li>
                                <li><a href="https://twitter.com/smkn15bandung" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:text-primary transition-colors group"><XIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-primary" /> @smkn15bandung</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-300"> {/* Garis akan membentang penuh */}
                    <div className="container mx-auto px-6 sm:px-6 lg:px-6 pt-6 text-center"> {/* Container baru untuk padding teks copyright */}
                        <p className="text-sm text-gray-600">
                            ©{new Date().getFullYear()} SMK Negeri 15 Bandung. Hak Cipta Dilindungi Undang-Undang.
                        </p>
                    </div>
                </div>
                </div>
            </footer>
        </div>
    );
}

// Opsional: Terapkan layout default jika Anda membuatnya nanti
// LandingPage.layout = page => <AppLayout children={page} title="Selamat Datang" />