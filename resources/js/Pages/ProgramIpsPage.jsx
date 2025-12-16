import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
// Import Lucide React icons
import { Building2, MapPin, TrendingUp, BookOpen, GraduationCap, Award, Users, Monitor } from 'lucide-react';

// Import data navigasi
// Get navigation data from centralized source
const navigationData = getNavigationData();












export default function ProgramIpsPage() {
    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="Program IPS - SMAN 1 Baleendah" />
            
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
                            Program IPS
                        </h1>
                        <div className="h-1 w-24 bg-primary mt-2 mx-auto md:mx-0 mb-4"></div>
                        <p className={TYPOGRAPHY.bodyText + " text-gray-800 max-w-3xl mx-auto md:mx-0"}>
                            Program Ilmu Pengetahuan Sosial yang mengembangkan pemahaman fenomena sosial, 
                            kemampuan berpikir kritis, dan analisis masalah sosial untuk mempersiapkan siswa 
                            memasuki perguruan tinggi terbaik di bidang hukum, ekonomi, politik, dan ilmu sosial.
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
                                    Program <span className="text-primary">IPS</span>
                                </h2>
                                <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-6"></div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 max-w-4xl mx-auto md:mx-0`}>
                                    Program Ilmu Pengetahuan Sosial di SMAN 1 Baleendah dirancang untuk mengembangkan 
                                    pemahaman tentang fenomena sosial, ekonomi, dan budaya serta kemampuan berpikir kritis 
                                    dalam menganalisis masalah sosial. Program ini mempersiapkan siswa untuk melanjutkan 
                                    pendidikan ke perguruan tinggi terbaik di bidang hukum, ekonomi, politik, dan ilmu sosial.
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8 mb-6">
                                <div className="bg-primary text-white p-6 rounded-xl">
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} text-white mb-4`}>Fokus Pembelajaran</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-200 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-blue-100 font-medium`}>Analisis Sosial</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-200 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-blue-100 font-medium`}>Critical Thinking</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-200 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-blue-100 font-medium`}>Penelitian Sosial</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-secondary p-6 rounded-xl">
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4`}>Keunggulan Program</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Studi Lapangan</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Perpustakaan Khusus</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Debat & Diskusi</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4 text-center`}>Persiapan Masa Depan</h3>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-center max-w-3xl mx-auto`}>
                                    Dengan pendekatan pembelajaran yang mengintegrasikan teori sosial dengan praktik lapangan, 
                                    siswa akan mengembangkan kemampuan analisis sosial, metodologi penelitian, dan communication 
                                    skills yang dibutuhkan untuk sukses di perguruan tinggi dan karier profesional.
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
                                Kurikulum yang dirancang khusus untuk mengembangkan kemampuan analisis sosial dan pemahaman masyarakat
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Sejarah */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                                        <BookOpen className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-1`}>Sejarah Peminatan</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>4 Jam/Minggu</p>
                                    </div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-3`}>
                                    Sejarah Indonesia dan dunia, historiografi, metodologi penelitian sejarah, 
                                    dan analisis sumber sejarah.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Cakupan Materi:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Sejarah Indonesia & Dunia</li>
                                        <li>• Metodologi Penelitian</li>
                                        <li>• Analisis Sumber Sejarah</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Geografi */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                                        <MapPin className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-1`}>Geografi</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>4 Jam/Minggu</p>
                                    </div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-3`}>
                                    Geografi fisik, manusia, lingkungan, SIG (Sistem Informasi Geografis), 
                                    dan studi lapangan.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Cakupan Materi:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Geografi Fisik & Manusia</li>
                                        <li>• Sistem Informasi Geografis</li>
                                        <li>• Studi Lapangan</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Ekonomi */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                                        <TrendingUp className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-1`}>Ekonomi</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>4 Jam/Minggu</p>
                                    </div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-3`}>
                                    Mikroekonomi, makroekonomi, ekonomi pembangunan, kewirausahaan, 
                                    dan analisis pasar.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Cakupan Materi:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Mikro & Makroekonomi</li>
                                        <li>• Kewirausahaan</li>
                                        <li>• Analisis Pasar</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Sosiologi */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                                        <Users className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-1`}>Sosiologi</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>4 Jam/Minggu</p>
                                    </div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-3`}>
                                    Teori sosial, struktur sosial, perubahan sosial, metodologi penelitian sosial, 
                                    dan studi masyarakat.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Cakupan Materi:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Teori & Struktur Sosial</li>
                                        <li>• Metodologi Penelitian</li>
                                        <li>• Studi Masyarakat</li>
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
                                    Fasilitas pembelajaran modern yang mendukung pengembangan kemampuan analisis sosial
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Monitor className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-3`}>Laboratorium IPS</h3>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm mb-3`}>
                                        Ruang multimedia untuk pembelajaran interaktif dengan teknologi terkini 
                                        dan fasilitas presentasi modern.
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-xs`}>Fasilitas:</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Proyektor & Smart Board</li>
                                            <li>• Komputer & Internet</li>
                                            <li>• Audio Visual System</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-3`}>Perpustakaan Khusus</h3>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm mb-3`}>
                                        Koleksi buku dan jurnal ilmu sosial yang lengkap untuk mendukung 
                                        penelitian dan pembelajaran.
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-xs`}>Koleksi:</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Buku Referensi IPS</li>
                                            <li>• Jurnal Ilmiah</li>
                                            <li>• Database Digital</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-3`}>Ruang Peta & SIG</h3>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm mb-3`}>
                                        Fasilitas peta dan sistem informasi geografis untuk pembelajaran 
                                        geografi dan analisis spasial.
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-xs`}>Peralatan:</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Peta Tematik</li>
                                            <li>• Software GIS</li>
                                            <li>• GPS & Kompas</li>
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
                                Kebanggaan kami terhadap pencapaian alumni dan prestasi siswa Program IPS
                            </p>
                        </div>

                        {/* Achievement Statistics */}
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                            <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-6 text-center`}>Prestasi Program IPS</h3>
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="text-center border-r border-gray-200 last:border-r-0">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">92%</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm font-medium`}>Tingkat Kelulusan PTN</p>
                                    </div>
                                </div>
                                <div className="text-center border-r border-gray-200 last:border-r-0">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">20+</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm font-medium`}>Prestasi Debat & Olimpiade</p>
                                    </div>
                                </div>
                                <div className="text-center border-r border-gray-200 last:border-r-0">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">250+</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm font-medium`}>Alumni di PTN Favorit</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">40+</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm font-medium`}>Lulusan Hukum & Ekonomi</p>
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
                                            AS
                                        </div>
                                        <div className="ml-4">
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-1`}>Ahmad Syahrul, S.H., M.H.</h4>
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-500 text-sm`}>Alumni 2019 - Pengacara</p>
                                        </div>
                                    </div>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-4 text-sm leading-relaxed`}>
                                        "Program IPS di SMAN 1 Baleendah mengajarkan saya berpikir kritis dan analitis. 
                                        Pembelajaran debat dan diskusi sangat membantu saya lolos SBMPTN Fakultas Hukum UI 
                                        dan kini menjadi pengacara di firma hukum terkemuka."
                                    </p>
                                    <div className="text-xs text-gray-500 border-t pt-3">
                                        <span className="font-medium">Pendidikan:</span> Fakultas Hukum UI → Pengacara
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-gray-600 font-bold text-lg">
                                            SP
                                        </div>
                                        <div className="ml-4">
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-1`}>Sari Permata, S.E., M.M.</h4>
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-500 text-sm`}>Alumni 2018 - Business Analyst</p>
                                        </div>
                                    </div>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-4 text-sm leading-relaxed`}>
                                        "Mata pelajaran ekonomi dan sosiologi memberikan pemahaman mendalam tentang 
                                        dinamika bisnis dan masyarakat. Sekarang saya bekerja sebagai Business Analyst 
                                        di perusahaan multinasional dan sedang menyelesaikan MBA."
                                    </p>
                                    <div className="text-xs text-gray-500 border-t pt-3">
                                        <span className="font-medium">Pendidikan:</span> Ekonomi UGM → Business Analyst
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
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-2`}>Bidang Hukum</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                            Profesi di bidang hukum dan keadilan
                                        </p>
                                    </div>
                                    <ul className={`${TYPOGRAPHY.bodyText} text-gray-700 space-y-2 mb-4 text-sm`}>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Pengacara & Advokat</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Hakim & Jaksa</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Notaris & PPAT</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Konsultan Hukum</span>
                                        </li>
                                    </ul>
                                    <div className="bg-gray-50 p-3 rounded-lg border-t">
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium text-xs mb-1`}>Perguruan Tinggi Tujuan:</p>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-xs`}>UI, UGM, UNPAD, UNDIP, UNAIR</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <div className="border-l-4 border-primary pl-4 mb-4">
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-2`}>Ekonomi & Bisnis</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                            Profesi di bidang ekonomi dan bisnis
                                        </p>
                                    </div>
                                    <ul className={`${TYPOGRAPHY.bodyText} text-gray-700 space-y-2 mb-4 text-sm`}>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Ekonom & Analis Keuangan</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Manajer & Entrepreneur</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Konsultan Bisnis</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Perbankan & Asuransi</span>
                                        </li>
                                    </ul>
                                    <div className="bg-gray-50 p-3 rounded-lg border-t">
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium text-xs mb-1`}>Perguruan Tinggi Tujuan:</p>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-xs`}>UI, UGM, ITB, UNPAD, IPB</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <div className="border-l-4 border-primary pl-4 mb-4">
                                        <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-2`}>Ilmu Politik & Sosial</h3>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                            Profesi di bidang politik dan sosial
                                        </p>
                                    </div>
                                    <ul className={`${TYPOGRAPHY.bodyText} text-gray-700 space-y-2 mb-4 text-sm`}>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Diplomat & PNS</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Analis Politik</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Jurnalis & Media</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span>Peneliti Sosial</span>
                                        </li>
                                    </ul>
                                    <div className="bg-gray-50 p-3 rounded-lg border-t">
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium text-xs mb-1`}>Perguruan Tinggi Tujuan:</p>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-xs`}>UI, UGM, UNPAD, UNDIP, FISIP</p>
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
                            Bergabunglah dengan Program IPS
                        </h2>
                        <p className={`${TYPOGRAPHY.bodyText} text-blue-100 mb-8 text-lg max-w-2xl mx-auto`}>
                            Wujudkan impian menjadi ahli hukum, ekonom, atau diplomat masa depan. 
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