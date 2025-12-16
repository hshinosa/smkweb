// FILE: resources/js/Pages/InformasiSpmbPage.jsx

import React, { useState } from 'react'; // Tambahkan useState
import { Head, Link } from '@inertiajs/react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal'; // Import komponen Modal
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
// Import ikon dari lucide-react
import { FileText, CalendarDays, BadgeCheck, ArrowRightCircle, UserPlus, X, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

// Path ke aset gambar Anda
// Get navigation data from centralized source
const navigationData = getNavigationData();

// Data Navigasi & Footer (konsisten dengan struktur navbar baru)

// Data untuk section "Kenapa SMAN 1 Baleendah?" 
const kenapaSmansaData = [
    { title: "Sekolah Berprestasi", description: "Terbukti menghasilkan lulusan berkualitas dan meraih berbagai penghargaan akademik." },
    { title: "Fasilitas Lengkap", description: "Menyediakan sarana prasarana modern untuk mendukung pembelajaran akademik." },
    { title: "Jaminan Kualitas", description: "Kurikulum berkualitas dan pengajar yang kompeten dan berpengalaman." },
    { title: "Persiapan PTN Terbaik", description: "Program pembelajaran yang dirancang untuk mempersiapkan siswa masuk perguruan tinggi negeri." },
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
                <p className="mb-4">Secara umum, SPMB SMA Negeri di Jawa Barat (termasuk SMAN 1 Baleendah) biasanya menyediakan beberapa jalur pendaftaran. Jalur yang tersedia dapat bervariasi setiap tahunnya, namun umumnya meliputi:</p>
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
                     <li><strong>Jalur Kelas Unggulan:</strong> Untuk program studi tertentu (MIPA, IPS, Bahasa) yang memiliki kurikulum diperkaya, mungkin ada seleksi khusus.</li>
                    {/* Tambahkan jalur lain jika relevan */}
                </ul>
                <p className="text-sm text-primary italic"><strong>Penting:</strong> Ketersediaan jalur, persyaratan detail, dan kuota dapat berubah setiap tahun. Selalu periksa informasi resmi terbaru di website SPMB Jawa Barat atau website SMAN 1 Baleendah.</p>
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
                 <p className="text-sm text-primary italic"><strong>Penting:</strong> Tanggal pasti untuk setiap tahapan akan diumumkan secara resmi menjelang periode SPMB. Pantau terus website SPMB Jawa Barat dan website SMAN 1 Baleendah.</p>
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
                    <li><strong>Program Studi Tertentu:</strong> Surat Keterangan Sehat dari dokter pemerintah (mungkin diperlukan untuk program studi tertentu sesuai ketentuan sekolah).</li>
                 </ul>
                <p className="text-sm text-primary italic"><strong>Penting:</strong> Pastikan semua dokumen adalah dokumen asli atau fotokopi yang dilegalisir sesuai ketentuan. Periksa daftar persyaratan spesifik untuk setiap jalur dan program studi di pengumuman resmi.</p>
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
                <p className="mb-4">Proses pendaftaran SPMB SMA Negeri biasanya dilakukan secara online melalui website resmi SPMB provinsi. Langkah-langkah umumnya adalah sebagai berikut:</p>
                <ol className="list-decimal space-y-2 pl-5 mb-4">
                    <li><strong>Pembuatan Akun:</strong> Calon siswa (atau dibantu sekolah asal/mandiri) membuat akun di portal SPMB menggunakan NISN dan data lainnya.</li>
                    <li><strong>Login:</strong> Masuk ke portal SPMB menggunakan akun yang telah dibuat.</li>
                    <li><strong>Pengisian Biodata:</strong> Melengkapi data diri, data orang tua, data rapor, dan informasi lain yang diminta.</li>
                    <li><strong>Pemilihan Sekolah dan Jalur:</strong> Memilih SMAN 1 Baleendah dan jalur pendaftaran yang sesuai. Beberapa jalur mungkin memungkinkan pemilihan lebih dari satu sekolah atau program studi.</li>
                    <li><strong>Pengunggahan Dokumen:</strong> Mengunggah hasil scan dokumen persyaratan sesuai dengan jalur yang dipilih. Pastikan format dan ukuran file sesuai ketentuan.</li>
                    <li><strong>Submit Pendaftaran:</strong> Mengecek kembali semua data dan dokumen, kemudian melakukan submit pendaftaran. Cetak bukti pendaftaran.</li>
                    <li><strong>Verifikasi:</strong> Panitia SPMB akan melakukan verifikasi data dan dokumen yang diunggah.</li>
                    <li><strong>Pemantauan Hasil:</strong> Memantau status pendaftaran dan pengumuman hasil seleksi melalui portal SPMB sesuai jadwal.</li>
                    <li><strong>Daftar Ulang:</strong> Jika dinyatakan lolos seleksi, segera lakukan daftar ulang di SMAN 1 Baleendah sesuai jadwal dengan membawa dokumen yang diperlukan.</li>
                </ol>
                <p className="text-sm text-primary italic"><strong>Penting:</strong> Prosedur dapat sedikit berbeda setiap tahun. Selalu ikuti panduan resmi (Juknis SPMB) yang diterbitkan oleh Dinas Pendidikan Provinsi Jawa Barat.</p>
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
            <Head title="Informasi SPMB - SMAN 1 Baleendah" description="Informasi lengkap Seleksi Penerimaan Murid Baru (SPMB) SMAN 1 Baleendah. Temukan jalur pendaftaran, jadwal penting, persyaratan, dan prosedur pendaftaran." />

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* Header Section */}
            <section className="pt-24 pb-12 bg-white">
                {/* ... (Konten header sama) ... */}
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className={TYPOGRAPHY.pageTitle}>
                        Informasi SPMB
                    </h1>                    <p className={TYPOGRAPHY.bodyText + " text-gray-600 max-w-3xl mx-auto"}>
                        Wujudkan Masa Depan Cerahmu Bersama SMA Negeri 1 Baleendah. Temukan semua informasi penting mengenai Seleksi Penerimaan Murid Baru (SPMB) di halaman ini.
                    </p>
                </div>
            </section>

             {/* Intro SPMB Section */}
             <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                {/* ... (Konten intro sama) ... */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">                        <div className="max-w-none">
                             <h2 className={TYPOGRAPHY.sectionHeading}>Siap Meraih <span className="text-primary">Prestasi Akademik Terbaik?</span></h2>
                            <div className="h-1 w-24 bg-primary mb-6"></div>
                            <p className={TYPOGRAPHY.bodyText + " mb-4"}>SMA Negeri 1 Baleendah membuka pintu kesempatan bagi para lulusan SMP/MTs yang bersemangat untuk mengembangkan potensi akademik dan meraih masa depan gemilang melalui pendidikan tinggi. Kami menyediakan pendidikan menengah atas berkualitas dengan tiga program studi unggulan.</p>
                            <p className={TYPOGRAPHY.bodyText + " mb-4"}>Dengan didukung oleh fasilitas modern, pengajar berpengalaman, dan program studi MIPA, IPS, dan Bahasa yang berkualitas, kami siap membekali Anda dengan pengetahuan akademik dan karakter yang kuat untuk sukses di perguruan tinggi. Jangan biarkan mimpimu menunggu lebih lama!</p>
                             <p className={TYPOGRAPHY.bodyText}>Bergabunglah dengan ribuan alumni sukses kami dan mulailah perjalananmu menuju prestasi akademik terbaik bersama SMA Negeri 1 Baleendah.</p>
                        </div>
                        <div className="mt-8 md:mt-0 flex justify-center">
                             <img src="/images/logo-sman1-baleendah-large.png" alt="Logo SMAN 1 Baleendah" className="max-w-xs w-full opacity-80"/>
                        </div>
                    </div>
                </div>
            </section>

            {/* Informasi Detail SPMB Section (Cards) - UPDATE DENGAN BUTTON MODAL */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center md:text-left mb-10 md:mb-12">
                        <h2 className={TYPOGRAPHY.sectionHeading + " mb-1"}>
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
                                        <h3 className={TYPOGRAPHY.cardTitle + " text-gray-800 mb-2 group-hover:text-primary transition-colors min-h-[2.5em]"}>
                                            {info.title}
                                        </h3>                                        <p className={TYPOGRAPHY.secondaryText + " mb-4"}>
                                            {info.description}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 text-center border-t border-gray-100 mt-auto">
                                        {/* Ganti Link dengan Button untuk membuka modal */}
                                        <button
                                            onClick={() => openModal(info)}
                                            className={TYPOGRAPHY.buttonText + " text-primary hover:underline focus:outline-none"}
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
                    <h2 className={TYPOGRAPHY.sectionHeading + " text-center mb-10"}>
                        Kenapa <span className="text-primary">SMA Negeri 1 Baleendah?</span>
                    </h2>                     <p className={TYPOGRAPHY.bodyText + " text-center text-gray-600 mb-12 max-w-3xl mx-auto"}>
                        Mencari sekolah yang tepat itu seperti memilih jalan menuju masa depan. Nah, SMA Negeri 1 Baleendah hadir sebagai sekolah yang siap membentuk kamu menjadi siswa berprestasi dan berkarakter kuat. Ragu? Ini dia alasan kenapa SMA Negeri 1 Baleendah adalah pilihan terbaik untukmu:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {kenapaSmansaData.map((item, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                                <h3 className={TYPOGRAPHY.cardTitle + " mb-2"}>{item.title}</h3>
                                <p className={TYPOGRAPHY.secondaryText}>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Call to Action Section */}
            <section className="py-12 bg-white text-center">
                {/* ... (Konten CTA sama) ... */}
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className={TYPOGRAPHY.subsectionHeading + " text-gray-700 mb-4"}>Tunggu apa lagi? Jadilah bagian dari keluarga besar SMA Negeri 1 Baleendah!</h2>
                    <p className={TYPOGRAPHY.bodyText + " text-gray-600 mb-8"}>Mari wujudkan mimpimu bersama kami!</p>
                    <Link
                        href="https://SPMB.jabarprov.go.id/" // Ganti dengan link SPMB Jabar yang relevan/aktif
                        target="_blank" // Buka di tab baru
                        rel="noopener noreferrer" // Keamanan
                        className={"inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md text-white bg-primary hover:bg-primary-darker transition duration-300 " + TYPOGRAPHY.buttonText}
                    >
                        <UserPlus size={20} className="mr-2" />
                        Kunjungi Portal SPMB Jabar
                    </Link>
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

            {/* --- MODAL UNTUK MENAMPILKAN DETAIL --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={TYPOGRAPHY.sectionHeading + " text-primary"}>{modalContent.title}</h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <X size={24} />
                        </button>
                    </div>                    <div className={TYPOGRAPHY.bodyText + " space-y-3 prose prose-sm max-w-none"}>
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