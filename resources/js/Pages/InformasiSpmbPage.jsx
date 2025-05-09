// FILE: resources/js/Pages/InformasiSpmbPage.jsx

import React, { useState } from 'react'; // Tambahkan useState
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal'; // Import komponen Modal
// Import ikon dari lucide-react
import { FileText, CalendarDays, BadgeCheck, ArrowRightCircle, UserPlus, X, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

// Path ke aset gambar Anda
const logoSmkn15 = '/images/logo-smkn15.png';

// Data Navigasi & Footer (diasumsikan sama)
// ... (Salin data navigasi & footer dari kode sebelumnya) ...
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


// Data untuk section "Kenapa SMKN 15 Bandung?" (sama seperti sebelumnya)
const kenapaSmkData = [
    { title: "Sekolah Berprestasi", description: "Terbukti menghasilkan lulusan berkualitas dan meraih berbagai penghargaan." },
    { title: "Fasilitas Lengkap", description: "Menyediakan sarana prasarana modern untuk mendukung pembelajaran." },
    { title: "Jaminan Kualitas", description: "Kurikulum relevan dengan industri dan pengajar yang kompeten." },
    { title: "Peluang Karir Terbuka", description: "Kerjasama erat dengan dunia industri untuk penempatan kerja dan magang." },
];

// --- UPDATE DATA SPMB DENGAN DETAIL CONTENT ---
const spmbInfoData = [
    {
        id: 'jalur',
        title: "Jalur Pendaftaran",
        description: "Informasi mengenai jalur pendaftaran yang tersedia, seperti jalur afirmasi, prestasi, dll.",
        icon: FileText,
        detailedContent: (
            <>
                <p className="mb-4">Secara umum, SPMB SMK Negeri di Jawa Barat (termasuk SMKN 15 Bandung) biasanya menyediakan beberapa jalur pendaftaran. Jalur yang tersedia dapat bervariasi setiap tahunnya, namun umumnya meliputi:</p>
                <ul className="list-disc space-y-2 pl-5 mb-4">
                    <li><strong>Jalur Afirmasi (KETM):</strong> Diperuntukkan bagi calon siswa dari Keluarga Ekonomi Tidak Mampu (KETM), Anak Berkebutuhan Khusus (ABK/CIBI), dan kondisi tertentu lainnya. Kuota biasanya cukup signifikan.</li>
                    <li><strong>Jalur Perpindahan Tugas Orang Tua/Wali/Anak Guru:</strong> Bagi calon siswa yang orang tuanya pindah tugas atau merupakan anak guru/tenaga kependidikan di sekolah tujuan.</li>
                    <li><strong>Jalur Prestasi:</strong>
                        <ul className='list-circle pl-5 mt-1'>
                            <li><strong>Nilai Rapor Unggulan:</strong> Berdasarkan rata-rata nilai rapor semester tertentu.</li>
                            <li><strong>Kejuaraan:</strong> Berdasarkan prestasi akademik atau non-akademik (olahraga, seni, dll.) tingkat kabupaten/kota, provinsi, nasional, atau internasional.</li>
                        </ul>
                    </li>
                     <li><strong>Jalur Prioritas Terdekat:</strong> Diperuntukkan bagi calon siswa yang berdomisili paling dekat dengan sekolah tujuan.</li>
                     <li><strong>Jalur Persiapan Kelas Industri:</strong> Untuk program keahlian tertentu yang bekerja sama dengan industri, mungkin ada seleksi khusus.</li>
                    {/* Tambahkan jalur lain jika relevan */}
                </ul>
                <p className="text-sm text-red-600 italic"><strong>Penting:</strong> Ketersediaan jalur, persyaratan detail, dan kuota dapat berubah setiap tahun. Selalu periksa informasi resmi terbaru di website SPMB Jawa Barat atau website SMKN 15 Bandung.</p>
            </>
        )
    },
    {
        id: 'jadwal',
        title: "Jadwal Penting",
        description: "Tanggal-tanggal penting terkait proses pendaftaran, seleksi, pengumuman, dan daftar ulang.",
        icon: CalendarDays,
        detailedContent: (
            <>
                <p className="mb-4">Jadwal SPMB biasanya dibagi menjadi beberapa tahap. Berikut adalah gambaran umum tahapan yang sering ada (tanggal spesifik berbeda setiap tahun):</p>
                <ul className="list-decimal space-y-2 pl-5 mb-4">
                    <li><strong>Pendaftaran dan Verifikasi Tahap 1:</strong> Biasanya untuk jalur Afirmasi, Perpindahan Tugas, dan Prestasi (Nilai Rapor & Kejuaraan).</li>
                    <li><strong>Tes Minat dan Bakat/Uji Kompetensi:</strong> Untuk program keahlian tertentu (jika ada).</li>
                    <li><strong>Pengumuman Hasil Tahap 1.</strong></li>
                    <li><strong>Daftar Ulang Tahap 1.</strong></li>
                    <li><strong>Pendaftaran dan Verifikasi Tahap 2:</strong> Biasanya untuk jalur Prioritas Terdekat dan sisa kuota jalur lain (jika ada).</li>
                    <li><strong>Pengumuman Hasil Tahap 2.</strong></li>
                    <li><strong>Daftar Ulang Tahap 2.</strong></li>
                    <li><strong>Awal Tahun Ajaran Baru.</strong></li>
                </ul>
                 <p className="text-sm text-red-600 italic"><strong>Penting:</strong> Tanggal pasti untuk setiap tahapan akan diumumkan secara resmi menjelang periode SPMB. Pantau terus website SPMB Jawa Barat dan website SMKN 15 Bandung.</p>
            </>
        )
    },
    {
        id: 'persyaratan',
        title: "Persyaratan",
        description: "Dokumen dan kriteria yang harus dipenuhi oleh calon siswa baru untuk mendaftar.",
        icon: BadgeCheck,
        detailedContent: (
            <>
                <p className="mb-4">Persyaratan umum dan khusus dapat bervariasi tergantung jalur pendaftaran. Namun, beberapa dokumen umum yang biasanya diperlukan adalah:</p>
                <strong className="block mb-2">Persyaratan Umum:</strong>
                <ul className="list-disc space-y-2 pl-5 mb-4">
                    <li>Ijazah SMP/sederajat atau Surat Keterangan Lulus (SKL).</li>
                    <li>Akta Kelahiran atau Surat Keterangan Lahir.</li>
                    <li>Kartu Keluarga (KK) yang telah diterbitkan minimal 1 tahun sebelum tanggal pendaftaran (untuk jalur tertentu).</li>
                    <li>Kartu Tanda Penduduk (KTP) orang tua/wali.</li>
                    <li>Buku Rapor (semester 1 s.d. 5 atau sesuai ketentuan).</li>
                    <li>Surat Tanggung Jawab Mutlak (SPTJM) dari orang tua/wali mengenai keabsahan data.</li>
                </ul>
                <strong className="block mb-2">Persyaratan Khusus:</strong>
                 <ul className="list-disc space-y-2 pl-5 mb-4">
                    <li><strong>Jalur Afirmasi (KETM):</strong> Kartu Program Keluarga Harapan (PKH), Kartu Indonesia Pintar (KIP), Kartu Keluarga Sejahtera (KKS), atau bukti terdaftar di DTKS.</li>
                    <li><strong>Jalur Perpindahan Tugas:</strong> Surat Keputusan Pindah Tugas.</li>
                    <li><strong>Jalur Prestasi Kejuaraan:</strong> Piagam/Sertifikat prestasi (asli).</li>
                    <li><strong>Program Keahlian Tertentu:</strong> Surat Keterangan Sehat dan/atau Surat Keterangan Tidak Buta Warna dari dokter pemerintah (biasanya diperlukan untuk jurusan seperti Kuliner, Perhotelan, DKV).</li>
                 </ul>
                <p className="text-sm text-red-600 italic"><strong>Penting:</strong> Pastikan semua dokumen adalah dokumen asli atau fotokopi yang dilegalisir sesuai ketentuan. Periksa daftar persyaratan spesifik untuk setiap jalur dan program keahlian di pengumuman resmi.</p>
            </>
        )
    },
    {
        id: 'prosedur',
        title: "Prosedur Pendaftaran",
        description: "Langkah-langkah detail yang harus diikuti calon siswa untuk melakukan pendaftaran online/offline.",
        icon: ArrowRightCircle,
        detailedContent: (
            <>
                <p className="mb-4">Proses pendaftaran SPMB SMK Negeri biasanya dilakukan secara online melalui website resmi SPMB provinsi. Langkah-langkah umumnya adalah sebagai berikut:</p>
                <ol className="list-decimal space-y-2 pl-5 mb-4">
                    <li><strong>Pembuatan Akun:</strong> Calon siswa (atau dibantu sekolah asal/mandiri) membuat akun di portal SPMB menggunakan NISN dan data lainnya.</li>
                    <li><strong>Login:</strong> Masuk ke portal SPMB menggunakan akun yang telah dibuat.</li>
                    <li><strong>Pengisian Biodata:</strong> Melengkapi data diri, data orang tua, data rapor, dan informasi lain yang diminta.</li>
                    <li><strong>Pemilihan Sekolah dan Jalur:</strong> Memilih SMKN 15 Bandung dan jalur pendaftaran yang sesuai. Beberapa jalur mungkin memungkinkan pemilihan lebih dari satu sekolah atau program keahlian.</li>
                    <li><strong>Pengunggahan Dokumen:</strong> Mengunggah hasil scan dokumen persyaratan sesuai dengan jalur yang dipilih. Pastikan format dan ukuran file sesuai ketentuan.</li>
                    <li><strong>Submit Pendaftaran:</strong> Mengecek kembali semua data dan dokumen, kemudian melakukan submit pendaftaran. Cetak bukti pendaftaran.</li>
                    <li><strong>Verifikasi:</strong> Panitia SPMB akan melakukan verifikasi data dan dokumen yang diunggah.</li>
                    <li><strong>Pemantauan Hasil:</strong> Memantau status pendaftaran dan pengumuman hasil seleksi melalui portal SPMB sesuai jadwal.</li>
                    <li><strong>Daftar Ulang:</strong> Jika dinyatakan lolos seleksi, segera lakukan daftar ulang di SMKN 15 Bandung sesuai jadwal dengan membawa dokumen yang diperlukan.</li>
                </ol>
                <p className="text-sm text-red-600 italic"><strong>Penting:</strong> Prosedur dapat sedikit berbeda setiap tahun. Selalu ikuti panduan resmi (Juknis SPMB) yang diterbitkan oleh Dinas Pendidikan Provinsi Jawa Barat.</p>
            </>
        )
    },
];
// --- AKHIR UPDATE DATA SPMB ---

export default function InformasiSpmbPage({ auth }) {
    // --- TAMBAHKAN STATE UNTUK MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: null });

    const openModal = (cardData) => {
        setModalContent({ title: cardData.title, content: cardData.detailedContent });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Optional: Reset content after closing animation is done
        // setTimeout(() => setModalContent({ title: '', content: null }), 300);
    };
    // --- AKHIR TAMBAHAN STATE ---

    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="Informasi SPMB - SMKN 15 Bandung" description="Informasi lengkap Seleksi Penerimaan Murid Baru (SPMB) SMKN 15 Bandung. Temukan jalur pendaftaran, jadwal penting, persyaratan, dan prosedur pendaftaran." />

            <Navbar
                logoSmkn15={logoSmkn15}
                tentangKamiLinks={tentangKamiLinks}
                manajemenSekolahSublinks={manajemenSekolahSublinks}
                akademikInformasiLinks={akademikInformasiLinks}
                programKeahlianDataNav={programKeahlianDataNav}
            />

            {/* Header Section */}
            <section className="pt-24 pb-12 bg-white">
                {/* ... (Konten header sama) ... */}
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
                        Informasi SPMB
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Wujudkan Masa Depan Cerahmu Bersama SMK Negeri 15 Bandung. Temukan semua informasi penting mengenai Seleksi Penerimaan Murid Baru (SPMB) di halaman ini.
                    </p>
                </div>
            </section>

             {/* Intro SPMB Section */}
             <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                {/* ... (Konten intro sama) ... */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="prose-sm text-gray-700 max-w-none">
                             <h2 className="text-3xl font-bold text-gray-800 mb-2">Siap Menjadi <span className="text-primary">Profesional Muda?</span></h2>
                            <div className="h-1 w-24 bg-primary mb-6"></div>
                            <p>SMK Negeri 15 Bandung membuka pintu kesempatan bagi para lulusan SMP/MTs yang bersemangat untuk mengembangkan potensi diri dan meraih masa depan gemilang di dunia kerja. Kami menyediakan pendidikan vokasi berkualitas yang relevan dengan tuntutan industri saat ini.</p>
                            <p>Dengan didukung oleh fasilitas modern, pengajar berpengalaman, dan program keahlian yang diminati, kami siap membekali Anda dengan keterampilan teknis dan soft skills yang dibutuhkan untuk sukses. Jangan biarkan mimpimu menunggu lebih lama!</p>
                             <p>Bergabunglah dengan ribuan alumni sukses kami dan mulailah perjalananmu menuju karir impian bersama SMK Negeri 15 Bandung.</p>
                        </div>
                        <div className="mt-8 md:mt-0 flex justify-center">
                             <img src="/images/logo-smkn15-large.png" alt="Logo SMKN 15 Bandung" className="max-w-xs w-full opacity-80"/>
                        </div>
                    </div>
                </div>
            </section>

            {/* Informasi Detail SPMB Section (Cards) - UPDATE DENGAN BUTTON MODAL */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center md:text-left mb-10 md:mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">
                            Informasi Penting <span className="text-primary">SPMB</span>
                        </h2>
                        <div className="h-1 w-24 bg-primary mt-2 mx-auto md:mx-0"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {spmbInfoData.map((info) => { // Hapus index jika tidak dipakai
                            const IconComponent = info.icon;
                            return (
                                <div key={info.id} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 border border-gray-100 flex flex-col">
                                    <div className="p-6 text-center flex-grow">
                                        {IconComponent && <IconComponent size={48} className="text-primary mx-auto mb-4" strokeWidth={1.5} />}
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors min-h-[2.5em]">
                                            {info.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {info.description}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 text-center border-t border-gray-100 mt-auto">
                                        {/* Ganti Link dengan Button untuk membuka modal */}
                                        <button
                                            onClick={() => openModal(info)}
                                            className="text-sm font-medium text-primary hover:underline focus:outline-none"
                                        >
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Kenapa SMKN 15 Bandung Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                {/* ... (Konten Kenapa SMKN 15 sama) ... */}
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                        Kenapa <span className="text-primary">SMK Negeri 15 Bandung?</span>
                    </h2>
                     <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                        Mencari sekolah yang tepat itu seperti memilih jalan menuju masa depan. Nah, SMK Negeri 15 Bandung hadir sebagai sekolah yang siap membentuk kamu menjadi profesional yang handal dan siap kerja. Ragu? Ini dia alasan kenapa SMK Negeri 15 Bandung adalah pilihan terbaik untukmu:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {kenapaSmkData.map((item, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                                <h3 className="font-semibold text-primary text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Call to Action Section */}
            <section className="py-12 bg-white text-center">
                {/* ... (Konten CTA sama) ... */}
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tunggu apa lagi? Jadilah bagian dari keluarga besar SMK Negeri 15 Bandung!</h2>
                    <p className="text-gray-600 mb-8">Mari wujudkan mimpimu bersama kami!</p>
                    <Link
                        href="https://SPMB.jabarprov.go.id/" // Ganti dengan link SPMB Jabar yang relevan/aktif
                        target="_blank" // Buka di tab baru
                        rel="noopener noreferrer" // Keamanan
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-darker transition duration-300"
                    >
                        <UserPlus size={20} className="mr-2" />
                        Kunjungi Portal SPMB Jabar
                    </Link>
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

            {/* --- MODAL UNTUK MENAMPILKAN DETAIL --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-primary">{modalContent.title}</h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="text-sm text-gray-700 space-y-3 prose prose-sm max-w-none">
                        {/* Render konten detail */}
                        {modalContent.content}
                    </div>
                    <div className="mt-6 text-right">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </Modal>
             {/* --- AKHIR MODAL --- */}

        </div>
    );
}