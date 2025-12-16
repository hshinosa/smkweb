import React, { useState } from 'react';
// Import reusable academic components
import { 
    AcademicLayout, 
    AcademicHero, 
    ContentSection, 
    CallToAction 
} from '@/Components/Academic';
import ProgramStudiModal from '@/Components/ProgramStudiModal';
// Import typography constants
import { TYPOGRAPHY } from '@/Utils/typography';
// Import academic data
import { curriculumData, pageMetadata } from '@/Utils/academicData';
// Import Lucide React icons
import { Lightbulb, Users, Monitor } from 'lucide-react';

export default function KurikulumPage() {
    const [showProgramModal, setShowProgramModal] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);

    const openProgramModal = (programType) => {
        const program = {
            type: programType,
            link: `/akademik/program-studi/${programType.toLowerCase()}`
        };
        setSelectedProgram(program);
        setShowProgramModal(true);
    };

    const closeProgramModal = () => {
        setShowProgramModal(false);
        setSelectedProgram(null);
    };

    return (
        <AcademicLayout>
            <AcademicHero
                title="Kurikulum"
                description="Struktur kurikulum dan sistem pembelajaran yang komprehensif di SMA Negeri 1 Baleendah, dirancang untuk mempersiapkan siswa menghadapi tantangan pendidikan tinggi dan masa depan."
                pageTitle={pageMetadata.kurikulum.title}
                metaDescription={pageMetadata.kurikulum.description}
            />

            <ContentSection 
                backgroundColor="bg-secondary"
            >
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="text-center md:text-left mb-8">
                                <h2 className={TYPOGRAPHY.sectionHeading}>
                                    Kurikulum <span className="text-primary">Merdeka</span>
                                </h2>
                                <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-6"></div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 max-w-4xl mx-auto md:mx-0`}>
                                    SMA Negeri 1 Baleendah menerapkan Kurikulum Merdeka yang memberikan fleksibilitas 
                                    kepada siswa untuk memilih mata pelajaran sesuai dengan minat, bakat, dan aspirasi karier. 
                                    Kurikulum ini dirancang untuk mengembangkan kompetensi siswa secara holistik dan mempersiapkan 
                                    mereka menghadapi tantangan abad ke-21.
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8 mb-6">
                                <div className="bg-primary text-white p-6 rounded-xl">
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} text-white mb-4`}>Tahun Implementasi</h3>
                                    <div className="text-3xl font-bold mb-2">{curriculumData.overview.implementationYear}</div>
                                    <p className={`${TYPOGRAPHY.bodyText} text-blue-100`}>
                                        Implementasi penuh Kurikulum Merdeka di semua tingkat kelas
                                    </p>
                                </div>
                                
                                <div className="bg-secondary p-6 rounded-xl">
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4`}>Fokus Utama</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Profil Pelajar Pancasila</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Pembelajaran Berdiferensiasi</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                            <span className={`${TYPOGRAPHY.bodyText} text-gray-700 font-medium`}>Asesmen Autentik</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4 text-center`}>Keunggulan Kurikulum Merdeka</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <span className="text-primary font-bold">1</span>
                                            </div>
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold text-gray-800 mb-1`}>Fleksibilitas</h4>
                                        </div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-sm`}>
                                            Pemilihan mata pelajaran sesuai minat dan bakat
                                        </p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <span className="text-primary font-bold">2</span>
                                            </div>
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold text-gray-800 mb-1`}>Kolaborasi</h4>
                                        </div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-sm`}>
                                            Pembelajaran berbasis proyek dan kerjasama
                                        </p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <span className="text-primary font-bold">3</span>
                                            </div>
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold text-gray-800 mb-1`}>Karakter</h4>
                                        </div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-sm`}>
                                            Pengembangan profil pelajar Pancasila
                                        </p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <span className="text-primary font-bold">4</span>
                                            </div>
                                            <h4 className={`${TYPOGRAPHY.bodyText} font-semibold text-gray-800 mb-1`}>Teknologi</h4>
                                        </div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-800 text-sm`}>
                                            Integrasi teknologi dalam pembelajaran
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
            </ContentSection>

            <ContentSection 
                title="Studi"
                subtitle="Program"
                description="Tiga program studi yang tersedia dengan fokus pembelajaran yang berbeda sesuai minat dan bakat siswa"
                backgroundColor="bg-white"
            >
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* MIPA Program */}
                            <div 
                                onClick={() => openProgramModal('MIPA')}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                            >
                                <div className="mb-4 relative h-32 rounded-lg overflow-hidden">
                                    {/* Gambar siswa sebagai background utama */}
                                    <img 
                                        src="/images/anak-sma.png" 
                                        alt="Siswa SMAN 1 Baleendah"
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Overlay gradient untuk readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    {/* Subtle shine effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 mb-3 text-sm`}>
                                    {curriculumData.programs.mipa.focus}
                                </p>
                                <div className="mb-3">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Mata Pelajaran Inti:</h4>
                                    <ul className="space-y-1">
                                        {curriculumData.programs.mipa.coreSubjects.slice(0, 3).map((subject, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                                <span className={`${TYPOGRAPHY.bodyText} text-gray-800 text-xs`}>{subject}</span>
                                            </li>
                                        ))}
                                        {curriculumData.programs.mipa.coreSubjects.length > 3 && (
                                            <li className="text-xs text-gray-500 italic">+{curriculumData.programs.mipa.coreSubjects.length - 3} mata pelajaran lainnya</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="text-center mb-3">
                                    <span className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>
                                        {curriculumData.programs.mipa.totalHours} Jam/Minggu
                                    </span>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary text-white py-2 px-4 rounded-lg group-hover:bg-primary-darker transition-colors duration-200 text-sm font-medium">
                                        Lihat Detail Program
                                    </div>
                                </div>
                            </div>

                            {/* IPS Program */}
                            <div 
                                onClick={() => openProgramModal('IPS')}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                            >
                                <div className="mb-4 relative h-32 rounded-lg overflow-hidden">
                                    {/* Gambar siswa sebagai background utama */}
                                    <img 
                                        src="/images/anak-sma.png" 
                                        alt="Siswa SMAN 1 Baleendah"
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Overlay gradient untuk readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    {/* Subtle shine effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 mb-3 text-sm`}>
                                    {curriculumData.programs.ips.focus}
                                </p>
                                <div className="mb-3">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Mata Pelajaran Inti:</h4>
                                    <ul className="space-y-1">
                                        {curriculumData.programs.ips.coreSubjects.slice(0, 3).map((subject, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                                <span className={`${TYPOGRAPHY.bodyText} text-gray-800 text-xs`}>{subject}</span>
                                            </li>
                                        ))}
                                        {curriculumData.programs.ips.coreSubjects.length > 3 && (
                                            <li className="text-xs text-gray-500 italic">+{curriculumData.programs.ips.coreSubjects.length - 3} mata pelajaran lainnya</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="text-center mb-3">
                                    <span className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>
                                        {curriculumData.programs.ips.totalHours} Jam/Minggu
                                    </span>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary text-white py-2 px-4 rounded-lg group-hover:bg-primary-darker transition-colors duration-200 text-sm font-medium">
                                        Lihat Detail Program
                                    </div>
                                </div>
                            </div>

                            {/* Bahasa Program */}
                            <div 
                                onClick={() => openProgramModal('BAHASA')}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                            >
                                <div className="mb-4 relative h-32 rounded-lg overflow-hidden">
                                    {/* Gambar siswa sebagai background utama */}
                                    <img 
                                        src="/images/anak-sma.png" 
                                        alt="Siswa SMAN 1 Baleendah"
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Overlay gradient untuk readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    {/* Subtle shine effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                                </div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-800 mb-3 text-sm`}>
                                    {curriculumData.programs.bahasa.focus}
                                </p>
                                <div className="mb-3">
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2 text-sm`}>Mata Pelajaran Inti:</h4>
                                    <ul className="space-y-1">
                                        {curriculumData.programs.bahasa.coreSubjects.slice(0, 3).map((subject, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                                <span className={`${TYPOGRAPHY.bodyText} text-gray-800 text-xs`}>{subject}</span>
                                            </li>
                                        ))}
                                        {curriculumData.programs.bahasa.coreSubjects.length > 3 && (
                                            <li className="text-xs text-gray-500 italic">+{curriculumData.programs.bahasa.coreSubjects.length - 3} mata pelajaran lainnya</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="text-center mb-3">
                                    <span className={`${TYPOGRAPHY.bodyText} text-primary font-semibold text-sm`}>
                                        {curriculumData.programs.bahasa.totalHours} Jam/Minggu
                                    </span>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary text-white py-2 px-4 rounded-lg group-hover:bg-primary-darker transition-colors duration-200 text-sm font-medium">
                                        Lihat Detail Program
                                    </div>
                                </div>
                            </div>
                        </div>
            </ContentSection>

            <ContentSection 
                backgroundColor="bg-secondary"
            >
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                            <div className="text-center md:text-left mb-6">
                                <h2 className={TYPOGRAPHY.sectionHeading}>
                                    Sistem <span className="text-primary">Penilaian</span>
                                </h2>
                                <div className="h-1 w-32 bg-primary mt-2 mx-auto md:mx-0 mb-6"></div>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600 max-w-2xl mx-auto md:mx-0`}>
                                    {curriculumData.assessment.system} yang komprehensif dan berkeadilan untuk mengukur pencapaian kompetensi siswa
                                </p>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                                {curriculumData.assessment.components.map((component, index) => (
                                    <div key={index} className="border-l-4 border-primary pl-6">
                                        <div className="flex items-center mb-3">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white font-bold text-sm">{index + 1}</span>
                                            </div>
                                            <h3 className={`${TYPOGRAPHY.subsectionHeading}`}>{component}</h3>
                                        </div>
                                        <p className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                            {component === 'Pengetahuan' && 'Penilaian terhadap pemahaman konsep dan teori melalui ujian tertulis, lisan, dan penugasan.'}
                                            {component === 'Keterampilan' && 'Evaluasi kemampuan praktis dan aplikasi pengetahuan melalui praktikum, proyek, dan portofolio.'}
                                            {component === 'Sikap' && 'Observasi perilaku, kedisiplinan, dan karakter siswa dalam proses pembelajaran sehari-hari.'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-primary text-white p-6 rounded-xl">
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} text-white mb-4 text-center`}>Skala Penilaian</h3>
                                <p className={`${TYPOGRAPHY.bodyText} text-blue-100 mb-4 text-center`}>
                                    Menggunakan skala {curriculumData.assessment.scale} dengan kriteria:
                                </p>
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                                        <div className="font-bold text-xl mb-1">90-100</div>
                                        <div className="text-sm">Sangat Baik</div>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                                        <div className="font-bold text-xl mb-1">80-89</div>
                                        <div className="text-sm">Baik</div>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                                        <div className="font-bold text-xl mb-1">70-79</div>
                                        <div className="text-sm">Cukup</div>
                                    </div>
                                    <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                                        <div className="font-bold text-xl mb-1">0-69</div>
                                        <div className="text-sm">Perlu Perbaikan</div>
                                    </div>
                                </div>
                            </div>
                        </div>
            </ContentSection>

            <ContentSection 
                title="Pembelajaran"
                subtitle="Tujuan"
                description="Mengembangkan potensi siswa secara optimal melalui pembelajaran yang bermakna dan berkelanjutan"
                backgroundColor="bg-white"
            >
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-6`}>Kompetensi Utama</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                        <span className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                            Mengembangkan kemampuan berpikir kritis, kreatif, dan inovatif
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                        <span className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                            Membangun karakter yang berintegritas dan berjiwa kepemimpinan
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                        <span className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                            Menguasai teknologi informasi dan komunikasi
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                        <span className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                            Memiliki kemampuan komunikasi yang efektif dalam berbagai bahasa
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-6`}>Persiapan Masa Depan</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                        <span className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                            Kesiapan melanjutkan pendidikan ke perguruan tinggi terbaik
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                        <span className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                            Kemampuan beradaptasi dengan perkembangan zaman
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                        <span className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                            Jiwa entrepreneurship dan kemandirian
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                        <span className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                            Kepedulian terhadap lingkungan dan masyarakat
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Additional Learning Methods Section */}
                        <div className="mt-12 bg-secondary p-8 rounded-xl border border-gray-100">
                            <div className="text-center md:text-left mb-6">
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4`}>Metode Pembelajaran</h3>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-600`}>
                                    Pendekatan pembelajaran yang inovatif dan berpusat pada siswa
                                </p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Lightbulb className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2`}>Project Based Learning</h4>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                        Pembelajaran berbasis proyek yang mengintegrasikan teori dengan praktik nyata
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2`}>Collaborative Learning</h4>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                        Pembelajaran kolaboratif yang mengembangkan kemampuan kerjasama dan komunikasi
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Monitor className="w-8 h-8 text-primary" />
                                    </div>
                                    <h4 className={`${TYPOGRAPHY.bodyText} font-semibold mb-2`}>Digital Learning</h4>
                                    <p className={`${TYPOGRAPHY.bodyText} text-gray-600 text-sm`}>
                                        Pemanfaatan teknologi digital untuk pembelajaran yang interaktif dan menarik
                                    </p>
                                </div>
                            </div>
                        </div>
            </ContentSection>

            <CallToAction
                title="Bergabunglah dengan SMAN 1 Baleendah"
                description="Wujudkan impian pendidikan terbaik bersama kurikulum yang inovatif dan komprehensif"
                primaryButton={{
                    text: "Daftar Sekarang",
                    href: "/informasi-spmb"
                }}
                secondaryButton={{
                    text: "Pelajari Program Studi",
                    href: "/akademik/program-studi/mipa"
                }}
            />

            {/* Program Studi Modal */}
            <ProgramStudiModal 
                show={showProgramModal}
                onClose={closeProgramModal}
                program={selectedProgram}
            />
        </AcademicLayout>
    );
}