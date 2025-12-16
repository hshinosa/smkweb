import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
// Import Lucide React icons
import { BookOpen, Globe, Mic, PenTool, GraduationCap, Award, Users, Languages } from 'lucide-react';

// Import data navigasi
// Get navigation data from centralized source
const navigationData = getNavigationData();












export default function ProgramBahasaPage() {
    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="Program Bahasa - SMAN 1 Baleendah" />
            
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
                            Program Bahasa
                        </h1>
                        <div className="h-1 w-24 bg-primary mt-2 mx-auto md:mx-0 mb-4"></div>
                        <p className={TYPOGRAPHY.bodyText + " text-gray-800 max-w-3xl mx-auto md:mx-0"}>
                            Program Ilmu Bahasa dan Budaya yang mengembangkan kemampuan komunikasi, 
                            apresiasi sastra, dan pemahaman budaya untuk mempersiapkan siswa memasuki 
                            perguruan tinggi terbaik di bidang sastra, linguistik, komunikasi, dan pendidikan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Program Overview Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="text-center md:text-left mb-8">
                                <h2 className={TYPOGRAPHY.sectionHeading}>
                                    Program <span className="text-primary">Bahasa</span>
                                </h2>
                                <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-6"></div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 max-w-4xl mx-auto md:mx-0`}>
                                    Program Ilmu Bahasa dan Budaya di SMAN 1 Baleendah dirancang untuk mengembangkan 
                                    kemampuan komunikasi, apresiasi sastra, dan pemahaman budaya melalui pembelajaran 
                                    bahasa Indonesia, bahasa asing, dan studi budaya. Program ini mempersiapkan siswa 
                                    untuk melanjutkan pendidikan ke perguruan tinggi terbaik di bidang sastra, linguistik, 
                                    komunikasi, dan pendidikan.
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8 mb-6">
                                <div className="bg-primary text-white p-6 rounded-xl">
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} text-white mb-4`}>Fokus Pembelajaran</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-200 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-blue-100 font-medium`}>Komunikasi Multibahasa</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-200 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-blue-100 font-medium`}>Apresiasi Sastra</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-200 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-blue-100 font-medium`}>Studi Budaya</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-secondary p-6 rounded-xl">
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4`}>Keunggulan Program</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Laboratorium Bahasa</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Sertifikasi Internasional</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Pertukaran Budaya</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4 text-center`}>Persiapan Masa Depan</h3>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-center max-w-3xl mx-auto`}>
                                    Dengan pendekatan pembelajaran yang mengintegrasikan teori bahasa dengan praktik komunikasi, 
                                    siswa akan mengembangkan kemampuan literasi, creative writing, public speaking, dan 
                                    cross-cultural communication yang dibutuhkan untuk sukses di era globalisasi.
                                </p>
                            </div>
                        </div>
                </div>
            </section>

            {/* Core Subjects Section */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center md:text-left mb-8">
                            <h2 className={TYPOGRAPHY.sectionHeading}>
                                Mata Pelajaran <span className="text-primary">Inti</span>
                            </h2>
                            <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-4"></div>
                            <p className={`${TYPOGRAPHY.bodyText} text-gray-600 max-w-2xl mx-auto md:mx-0`}>
                                Kurikulum yang dirancang khusus untuk mengembangkan kemampuan bahasa dan apresiasi budaya
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Bahasa Indonesia */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                                        <BookOpen className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-1`}>Bahasa Indonesia</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>4 Jam/Minggu</p>
                                    </div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-3`}>
                                    Sastra Indonesia, linguistik, kritik sastra, creative writing, 
                                    dan jurnalistik.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Cakupan Materi:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Sastra & Linguistik</li>
                                        <li>• Creative Writing</li>
                                        <li>• Kritik Sastra</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Bahasa Inggris */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                                        <Globe className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-1`}>Bahasa Inggris</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>4 Jam/Minggu</p>
                                    </div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-3`}>
                                    Grammar lanjutan, literature, academic writing, public speaking, 
                                    dan TOEFL preparation.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Cakupan Materi:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Grammar & Literature</li>
                                        <li>• Academic Writing</li>
                                        <li>• TOEFL Preparation</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Bahasa Asing Pilihan */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                                        <Languages className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-1`}>Bahasa Asing Pilihan</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>4 Jam/Minggu</p>
                                    </div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-3`}>
                                    Pilihan: Bahasa Arab, Jepang, atau Mandarin dengan fokus 
                                    komunikasi praktis.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Pilihan Bahasa:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Bahasa Arab</li>
                                        <li>• Bahasa Jepang</li>
                                        <li>• Bahasa Mandarin</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Antropologi */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                                        <Users className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-1`}>Antropologi</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>4 Jam/Minggu</p>
                                    </div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-3`}>
                                    Studi budaya, etnografi, antropologi linguistik, dan 
                                    penelitian budaya lokal.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Cakupan Materi:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Studi Budaya</li>
                                        <li>• Etnografi</li>
                                        <li>• Penelitian Budaya</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                </div>
            </section>

            {/* Facilities Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="text-center md:text-left mb-8">
                                <h2 className={TYPOGRAPHY.sectionHeading}>
                                    Fasilitas <span className="text-primary">Pembelajaran</span>
                                </h2>
                                <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-6"></div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 max-w-2xl mx-auto md:mx-0`}>
                                    Fasilitas pembelajaran modern yang mendukung pengembangan kemampuan bahasa dan budaya
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Mic className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-3`}>Laboratorium Bahasa</h3>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm mb-3`}>
                                        Fasilitas audio-visual modern untuk pembelajaran bahasa asing 
                                        dan pronunciation dengan teknologi terkini.
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-xs`}>Fasilitas:</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Audio-Visual System</li>
                                            <li>• Language Software</li>
                                            <li>• Recording Studio</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-3`}>Perpustakaan Sastra</h3>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm mb-3`}>
                                        Koleksi karya sastra Indonesia dan dunia, jurnal linguistik, 
                                        dan majalah budaya yang lengkap.
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-xs`}>Koleksi:</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Karya Sastra Klasik</li>
                                            <li>• Jurnal Linguistik</li>
                                            <li>• Majalah Budaya</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <PenTool className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-3`}>Studio Kreatif</h3>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm mb-3`}>
                                        Ruang untuk kegiatan teater, storytelling, dan produksi 
                                        konten kreatif multibahasa.
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-xs`}>Kegiatan:</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Teater & Drama</li>
                                            <li>• Creative Writing</li>
                                            <li>• Content Production</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </section>

            {/* Success Stories & Alumni Achievements */}
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center md:text-left mb-12">
                            <h2 className={TYPOGRAPHY.sectionHeading}>
                                Prestasi dan <span className="text-primary">Alumni</span>
                            </h2>
                            <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-6"></div>
                            <p className={`${TYPOGRAPHY.bodyText} text-gray-600 max-w-2xl mx-auto md:mx-0`}>
                                Kebanggaan kami terhadap pencapaian alumni dan prestasi siswa Program Bahasa
                            </p>
                        </div>

                        {/* Achievement Statistics */}
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                            <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-6 text-center`}>Prestasi Program Bahasa</h3>
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="text-center border-r border-gray-200 last:border-r-0">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">90%</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm font-medium`}>Tingkat Kelulusan PTN</p>
                                    </div>
                                </div>
                                <div className="text-center border-r border-gray-200 last:border-r-0">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">18+</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm font-medium`}>Prestasi Sastra & Bahasa</p>
                                    </div>
                                </div>
                                <div className="text-center border-r border-gray-200 last:border-r-0">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">200+</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm font-medium`}>Alumni di PTN Favorit</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">35+</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm font-medium`}>Sertifikat Bahasa Internasional</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alumni Success Stories */}
                        <div className="bg-gray-50 rounded-xl p-8">
                            <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-6 text-center`}>Testimoni Alumni</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-gray-600 font-bold text-lg">
                                            DP
                                        </div>
                                        <div className="ml-4">
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-1`}>Dina Puspita, S.S., M.Hum.</h4>
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-500 text-sm`}>Alumni 2019 - Dosen Sastra</p>
                                        </div>
                                    </div>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-4 text-sm leading-relaxed`}>
                                        "Program Bahasa di SMAN 1 Baleendah mengasah kemampuan literasi dan apresiasi sastra saya. 
                                        Pembelajaran multibahasa dan studi budaya membantu saya lolos SBMPTN Sastra Indonesia UI 
                                        dan kini menjadi dosen di universitas terkemuka."
                                    </p>
                                    <div className="text-xs text-gray-500 border-t pt-3">
                                        <span className="font-medium">Pendidikan:</span> Sastra Indonesia UI → Dosen
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-gray-600 font-bold text-lg">
                                            RH
                                        </div>
                                        <div className="ml-4">
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-1`}>Rizki Hakim, S.I.Kom., M.A.</h4>
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-500 text-sm`}>Alumni 2018 - Jurnalis</p>
                                        </div>
                                    </div>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-4 text-sm leading-relaxed`}>
                                        "Kemampuan menulis dan komunikasi yang diasah di program Bahasa sangat membantu 
                                        karier jurnalistik saya. Sekarang saya bekerja sebagai jurnalis internasional 
                                        dan sedang menyelesaikan S2 Komunikasi di luar negeri."
                                    </p>
                                    <div className="text-xs text-gray-500 border-t pt-3">
                                        <span className="font-medium">Pendidikan:</span> Ilmu Komunikasi UNPAD → Jurnalis
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </section>

            {/* Career Prospects Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                            <div className="text-center md:text-left mb-8">
                                <h2 className={TYPOGRAPHY.sectionHeading}>
                                    Prospek Karir dan <span className="text-primary">Perguruan Tinggi</span>
                                </h2>
                                <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-6"></div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 max-w-2xl mx-auto md:mx-0`}>
                                    Peluang karir yang luas dan akses ke perguruan tinggi terbaik di Indonesia
                                </p>
                            </div>
                            
                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <div className="border-l-4 border-primary pl-4 mb-4">
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-2`}>Sastra & Linguistik</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                            Profesi di bidang sastra dan bahasa
                                        </p>
                                    </div>
                                    <ul className={`${TYPOGRAPHY.bodyText} text-gray-700 space-y-2 mb-4 text-sm`}>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Penulis & Sastrawan</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Editor & Penyunting</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Peneliti Bahasa</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Penerjemah</span>
                                        </li>
                                    </ul>
                                    <div className="bg-gray-50 p-3 rounded-lg border-t">
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium text-xs mb-1`}>Perguruan Tinggi Tujuan:</p>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-xs`}>UI, UGM, UNPAD, UPI, UNDIP</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <div className="border-l-4 border-primary pl-4 mb-4">
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-2`}>Komunikasi & Media</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                            Profesi di bidang komunikasi dan media
                                        </p>
                                    </div>
                                    <ul className={`${TYPOGRAPHY.bodyText} text-gray-700 space-y-2 mb-4 text-sm`}>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Jurnalis & Reporter</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Public Relations</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Content Creator</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Broadcaster</span>
                                        </li>
                                    </ul>
                                    <div className="bg-gray-50 p-3 rounded-lg border-t">
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium text-xs mb-1`}>Perguruan Tinggi Tujuan:</p>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-xs`}>UI, UGM, UNPAD, UNDIP, UNAIR</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <div className="border-l-4 border-primary pl-4 mb-4">
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-2`}>Pendidikan & Diplomasi</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                            Profesi di bidang pendidikan dan diplomasi
                                        </p>
                                    </div>
                                    <ul className={`${TYPOGRAPHY.bodyText} text-gray-700 space-y-2 mb-4 text-sm`}>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Guru & Dosen</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Diplomat</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Pengembang Kurikulum</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Cultural Attaché</span>
                                        </li>
                                    </ul>
                                    <div className="bg-gray-50 p-3 rounded-lg border-t">
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium text-xs mb-1`}>Perguruan Tinggi Tujuan:</p>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-xs`}>UPI, UNJ, UM, UNNES, UI</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-12 bg-primary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} text-white mb-6`}>
                            Bergabunglah dengan Program Bahasa
                        </h2>
                        <p className={`${TYPOGRAPHY.bodyText} text-blue-100 mb-8 text-lg max-w-2xl mx-auto`}>
                            Wujudkan impian menjadi sastrawan, jurnalis, atau diplomat masa depan. 
                            Dapatkan informasi lengkap tentang pendaftaran dan persyaratan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/informasi-spmb"
                                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                Informasi SPMB
                            </Link>
                            <Link 
                                href="/kontak"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200"
                            >
                                Hubungi Kami
                            </Link>
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