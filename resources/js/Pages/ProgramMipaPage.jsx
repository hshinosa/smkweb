import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
// Import academic data
import { programStudyData, pageMetadata } from '@/Utils/academicData';
// Import Lucide React icons
import { Microscope, FlaskConical, Dna, Calculator, GraduationCap, Award, TrendingUp, Users } from 'lucide-react';

// Import data navigasi
// Get navigation data from centralized source
const navigationData = getNavigationData();

export default function ProgramMipaPage() {
    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="Program MIPA - SMAN 1 Baleendah" />
            
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
                            Program MIPA
                        </h1>
                        <div className="h-1 w-24 bg-primary mt-2 mx-auto md:mx-0 mb-4"></div>
                        <p className={TYPOGRAPHY.bodyText + " text-gray-800 max-w-3xl mx-auto md:mx-0"}>
                            {programStudyData.mipa.description}
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
                                    Program <span className="text-primary">MIPA</span>
                                </h2>
                                <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-6"></div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 max-w-4xl mx-auto md:mx-0`}>
                                    {programStudyData.mipa.description}
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8 mb-6">
                                <div className="bg-primary text-white p-6 rounded-xl">
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} text-white mb-4`}>Fokus Pembelajaran</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-200 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-blue-100 font-medium`}>Kemampuan Analitis</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-200 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-blue-100 font-medium`}>Metode Ilmiah</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-200 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-blue-100 font-medium`}>Penelitian & Eksperimen</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-secondary p-6 rounded-xl">
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4`}>Keunggulan Program</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Laboratorium Lengkap</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Guru Berpengalaman</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Prestasi Olimpiade</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4 text-center`}>Persiapan Masa Depan</h3>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-center max-w-3xl mx-auto`}>
                                    Dengan pendekatan pembelajaran yang mengintegrasikan teori dan praktik, siswa akan 
                                    mengembangkan kemampuan berpikir kritis, problem solving, dan research skills yang 
                                    dibutuhkan untuk sukses di perguruan tinggi dan karier profesional.
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
                                Kurikulum yang dirancang khusus untuk mengembangkan kemampuan sains dan matematika siswa
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {programStudyData.mipa.coreSubjects.map((subject, index) => {
                                const icons = [Calculator, Microscope, FlaskConical, Dna];
                                const IconComponent = icons[index] || Calculator;
                                
                                return (
                                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mr-4">
                                                <IconComponent className="w-7 h-7 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-1`}>{subject.name}</h3>
                                                <p className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>{subject.hours} Jam/Minggu</p>
                                            </div>
                                        </div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-800 mb-3`}>
                                            {subject.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                </div>
            </section>

            {/* Facilities Section */}
            <section className="py-12 bg-secondary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="text-center md:text-left mb-8">
                                <h2 className={TYPOGRAPHY.sectionHeading}>
                                    Fasilitas <span className="text-primary">Laboratorium</span>
                                </h2>
                                <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-6"></div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 max-w-2xl mx-auto md:mx-0`}>
                                    Laboratorium berstandar nasional dengan peralatan modern untuk mendukung pembelajaran praktis
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                {programStudyData.mipa.facilities.map((facility, index) => {
                                    const icons = [Microscope, FlaskConical, Dna];
                                    const IconComponent = icons[index] || Microscope;
                                    
                                    return (
                                        <div key={index} className="text-center">
                                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                <IconComponent className="w-8 h-8 text-primary" />
                                            </div>
                                            <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-3`}>{facility.name}</h3>
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-sm mb-3`}>
                                                {facility.description}
                                            </p>
                                        </div>
                                    );
                                })}
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
                                Kebanggaan kami terhadap pencapaian alumni dan prestasi siswa Program MIPA
                            </p>
                        </div>

                        {/* Achievement Statistics */}
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                            <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-6 text-center`}>Prestasi Program MIPA</h3>
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="text-center border-r border-gray-200 last:border-r-0">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">95%</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-sm font-medium`}>Tingkat Kelulusan PTN</p>
                                    </div>
                                </div>
                                <div className="text-center border-r border-gray-200 last:border-r-0">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">25+</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-sm font-medium`}>Medali Olimpiade Sains</p>
                                    </div>
                                </div>
                                <div className="text-center border-r border-gray-200 last:border-r-0">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">300+</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-sm font-medium`}>Alumni di PTN Favorit</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-3">
                                        <div className="text-4xl font-bold text-primary mb-1">50+</div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-sm font-medium`}>Lulusan Kedokteran</p>
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
                                            DR
                                        </div>
                                        <div className="ml-4">
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-1`}>Dr. Rina Sari, M.D.</h4>
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-500 text-sm`}>Alumni 2018 - Dokter Spesialis Anak</p>
                                        </div>
                                    </div>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-4 text-sm leading-relaxed`}>
                                        "Program MIPA di SMAN 1 Baleendah memberikan fondasi yang kuat dalam sains. 
                                        Praktikum laboratorium dan bimbingan guru membantu saya lolos SBMPTN FK UI dan 
                                        kini menjadi dokter spesialis anak di RSUP Hasan Sadikin."
                                    </p>
                                    <div className="text-xs text-gray-500 border-t pt-3">
                                        <span className="font-medium">Pendidikan:</span> FK UI → Spesialis Anak UNPAD
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-gray-600 font-bold text-lg">
                                            AR
                                        </div>
                                        <div className="ml-4">
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-1`}>Arif Rahman, S.T., M.T.</h4>
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-500 text-sm`}>Alumni 2017 - Software Engineer</p>
                                        </div>
                                    </div>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 mb-4 text-sm leading-relaxed`}>
                                        "Matematika dan logika yang dipelajari di program MIPA sangat membantu dalam 
                                        programming. Sekarang saya bekerja sebagai Senior Software Engineer di startup 
                                        teknologi dan sedang menyelesaikan S2 Teknik Informatika ITB."
                                    </p>
                                    <div className="text-xs text-gray-500 border-t pt-3">
                                        <span className="font-medium">Pendidikan:</span> Teknik Informatika ITB → Tech Industry
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
                                {programStudyData.mipa.careerProspects.map((career, index) => (
                                    <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="border-l-4 border-primary pl-4 mb-4">
                                            <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-2`}>{career.field}</h3>
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                                {career.description}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg border-t">
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium text-xs mb-1`}>Perguruan Tinggi Tujuan:</p>
                                            <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-xs`}>{career.universities.join(', ')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-12 bg-primary sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className={`${TYPOGRAPHY.sectionHeading} text-white mb-6`}>
                            Bergabunglah dengan Program MIPA
                        </h2>
                        <p className={`${TYPOGRAPHY.bodyText} text-blue-100 mb-8 text-lg max-w-2xl mx-auto`}>
                            Wujudkan impian menjadi ilmuwan, dokter, atau insinyur masa depan. 
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