import React from 'react'; // Removed useState as it's now in Navbar
import { Head, Link } from '@inertiajs/react';
import CountUp from 'react-countup';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import Components
import Navbar from '@/Components/Navbar'; // Adjust path as per your project structure
import Footer from '@/Components/Footer'; // Adjust path
import { ChevronLeftIcon, ChevronRightIcon, InstagramIcon, FacebookIcon, LinkedinIcon, XIcon } from '@/Components/Icons'; // Adjust path

// Path ke aset gambar Anda
const logoSmkn15 = '/images/logo-smkn15.png';
const heroBgImage = '/images/hero-bg-smkn15.jpg';
const groupPhoto = '/images/keluarga-besar-smkn15.png';
const kepalaSekolahPhoto = '/images/kepala-sekolah.jpg';

const placeholderProgram1 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+1';
const placeholderProgram2 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+2';
const placeholderProgram3 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+3';
const placeholderProgram4 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+4';
const placeholderProgram5 = 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=Program+5';

// Data untuk Program Keahlian
const placeholderDKV = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=DKV';
const placeholderKuliner = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Kuliner';
const placeholderPekerjaanSosial = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Peksos';
const placeholderPerhotelan = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Hotel';

const programKeahlianDataNav = [
    { nama: "DKV", link: "/programkeahlian/dkv" },
    { nama: "Perhotelan", link: "/programkeahlian/perhotelan" },
    { nama: "Kuliner", link: "/programkeahlian/kuliner" },
    { nama: "Pekerjaan Sosial", link: "/programkeahlian/pekerjaan-sosial" },
];

const programKeahlianData = [
    { nama: "Desain Komunikasi Visual", gambar: placeholderDKV, link: "/programkeahlian/dkv" },
    { nama: "Kuliner", gambar: placeholderKuliner, link: "/programkeahlian/kuliner" },
    { nama: "Pekerjaan Sosial", gambar: placeholderPekerjaanSosial, link: "/programkeahlian/pekerjaan-sosial" },
    { nama: "Perhotelan", gambar: placeholderPerhotelan, link: "/programkeahlian/perhotelan" },
];

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
    { nama: "Program Kewirausahaan Siswa", gambar: placeholderProgram5, link: "/program/kewirausahaan" },
];

const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7320221071664!2d107.6164360758815!3d-6.922603993077097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e62c87267923%3A0x7ef8aaa0fcd59ec9!2sSMKN%2015%20Kota%20Bandung!5e0!3m2!1sid!2sid!4v1746550004423!5m2!1sid!2sid";
    
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

const socialMediaLinks = [
    { name: "Instagram", href: "https://www.instagram.com/smkn_15bandung", icon: InstagramIcon, handle: "@smkn_15bandung" },
    { name: "Facebook", href: "https://www.facebook.com/SMKN15Bandung", icon: FacebookIcon, handle: "SMKN 15 Bandung" },
    { name: "LinkedIn", href: "https://www.linkedin.com/school/smkn-15-bandung/", icon: LinkedinIcon, handle: "SMKN 15 Bandung" },
    { name: "X", href: "https://twitter.com/smkn15bandung", icon: XIcon, handle: "@smkn15bandung" },
];


export default function LandingPage({ auth }) {
    
    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="SMKN 15 Bandung" />

            <Navbar
                logoSmkn15={logoSmkn15}
                tentangKamiLinks={tentangKamiLinks}
                manajemenSekolahSublinks={manajemenSekolahSublinks}
                akademikInformasiLinks={akademikInformasiLinks}
                programKeahlianDataNav={programKeahlianDataNav}
            />

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
                            <Link href="/profil-sekolah" className="mt-6 inline-block bg-primary text-white hover:bg-primary-darker transition duration-300 px-6 py-2 rounded-md text-lg font-semibold no-underline">
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
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
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
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center md:text-left mb-10 md:mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">
                            4 Program Keahlian <span className="text-primary">SMKN 15 Bandung</span>
                        </h2>
                        <div className="h-1 w-24 bg-primary mt-2 mx-auto md:mx-0"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {programKeahlianData.map((program, index) => (
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
                                        {(program.nama.includes("Visual") || program.nama.includes("Sosial")) && <br />}
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
                                    <CountUp start={0} end={fakta.angka} duration={2} separator="," enableScrollSpy scrollSpyOnce />
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
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-1 text-center md:text-left">
                                Program-Program <span className="text-primary">SMKN 15 Bandung</span>
                            </h2>
                            <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-4 md:mb-0"></div>
                        </div>
                        <Link 
                            href="/program"
                            className="bg-primary text-white hover:bg-primary-darker px-6 py-2 rounded-md text-sm font-semibold transition duration-300"
                        >
                            Lihat Selengkapnya
                        </Link>
                    </div>
                    <div className="relative px-0 sm:px-8 md:px-12">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
                            grabCursor={true}
                            className="program-swiper !pb-10" // Ensure pagination bullets are visible
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                768: { slidesPerView: 3, spaceBetween: 24 },
                                1024: { slidesPerView: 4, spaceBetween: 24 },
                            }}
                        >
                            {programSekolah.map((program, index) => (
                                <SwiperSlide key={index} className="pb-1 overflow-visible"> {/* Allow shadow to be visible */}
                                    <Link href={program.link} className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden h-full flex flex-col">
                                        <div className="w-full h-40 bg-gray-200">
                                            <img 
                                                src={program.gambar} 
                                                alt={program.nama} 
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4 flex-grow">
                                            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors min-h-[2.5em] line-clamp-2">
                                                {program.nama}
                                            </h3>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {/* Custom Navigation Buttons */}
                        <div className="swiper-button-prev-custom absolute top-1/2 left-0 transform -translate-y-1/2 z-10 cursor-pointer p-2 bg-white/70 hover:bg-white rounded-full shadow-md">
                           <ChevronLeftIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="swiper-button-next-custom absolute top-1/2 right-0 transform -translate-y-1/2 z-10 cursor-pointer p-2 bg-white/70 hover:bg-white rounded-full shadow-md">
                           <ChevronRightIcon className="w-6 h-6 text-primary" /> {/* Make sure this uses the correct icon */}
                        </div>
                        {/* Custom Pagination Container */}
                        <div className="swiper-pagination-custom text-center mt-4"></div>
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