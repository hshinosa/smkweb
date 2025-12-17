import React, { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Search, MapPin, GraduationCap, X, Phone, Mail, User } from 'lucide-react';

// Import Components
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';

// Import utilities
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { mockTeacherData, getTeacherPhoto } from '@/Utils/teacherData';

const navigationData = getNavigationData();

// --- CONSTANTS & CONFIGURATION ---
const MGMP_GROUPS = [
    { id: 'pimpinan', title: 'Pimpinan & Manajemen', departments: ['Manajemen', 'Kepala Sekolah', 'Wakil Kepala Sekolah'] },
    { id: 'mipa', title: 'MIPA', departments: ['MIPA', 'Matematika', 'Fisika', 'Kimia', 'Biologi'] },
    { id: 'ips', title: 'IPS', departments: ['IPS', 'Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi'] },
    { id: 'bahasa', title: 'Bahasa & Budaya', departments: ['Bahasa', 'Bahasa Indonesia', 'Bahasa Inggris', 'Bahasa Sunda', 'Bahasa Asing'] },
    { id: 'vokasi', title: 'Vokasi & Teknologi', departments: ['Teknologi Informasi', 'TIK', 'Prakarya', 'Informatika'] },
    { id: 'penjas', title: 'Penjasorkes & Seni', departments: ['Olahraga', 'Seni', 'Seni Budaya', 'Penjasorkes'] },
    { id: 'agama', title: 'Pendidikan Agama & PKN', departments: ['Agama', 'Pendidikan Agama', 'PKN', 'PPKn'] },
    { id: 'staff', title: 'Tata Usaha & Staff', departments: ['Administrasi', 'Tata Usaha', 'Bimbingan Konseling', 'BK'] },
];

// Helper to determine group for a teacher
const getTeacherGroup = (teacher) => {
    // Check if teacher has a specific department that matches our groups
    for (const group of MGMP_GROUPS) {
        if (group.departments.includes(teacher.department)) {
            return group.id;
        }
        // Also check position if department is generic or missing
        if (teacher.position) {
             const pos = teacher.position.toLowerCase();
             if (group.departments.some(d => pos.includes(d.toLowerCase()))) {
                 return group.id;
             }
        }
    }
    // Default to Staff if type is staff, otherwise 'Lainnya' or put in Staff
    if (teacher.type === 'staff') return 'staff';
    return 'staff'; // Fallback
};

export default function GuruStaffPage() {
    const [activeGroup, setActiveGroup] = useState(MGMP_GROUPS[0].id);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Grouping Logic
    const groupedTeachers = useMemo(() => {
        const groups = {};
        
        // Initialize groups
        MGMP_GROUPS.forEach(g => {
            groups[g.id] = [];
        });

        // Distribute teachers
        mockTeacherData.forEach(teacher => {
            // Filter by search query first
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const match = 
                    teacher.name.toLowerCase().includes(query) ||
                    teacher.position.toLowerCase().includes(query) ||
                    (teacher.subject && teacher.subject.toLowerCase().includes(query));
                if (!match) return;
            }

            const groupId = getTeacherGroup(teacher);
            if (groups[groupId]) {
                groups[groupId].push(teacher);
            }
        });

        return groups;
    }, [searchQuery]);

    // Scroll Spy & Navigation Logic
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Adjust for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveGroup(id);
        }
    };

    // Modal Handlers
    const openModal = (teacher) => {
        setSelectedTeacher(teacher);
        setModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedTeacher(null);
        document.body.style.overflow = 'unset';
    };

    // --- SUB-COMPONENTS ---

    const SidebarNav = () => (
        <div className="hidden lg:block w-1/4 pr-8">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900 mb-4 px-4 text-lg font-serif">Kategori</h3>
                <ul className="space-y-1">
                    {MGMP_GROUPS.map((group) => (
                        <li key={group.id}>
                            <button
                                onClick={() => scrollToSection(group.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-4 ${
                                    activeGroup === group.id
                                    ? "border-accent-yellow bg-blue-50 text-primary font-bold"
                                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                {group.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    const MobileNav = () => (
        <div className="lg:hidden sticky top-20 z-30 bg-white shadow-sm border-b border-gray-200 mb-8 -mx-4 px-4 py-3 overflow-x-auto flex gap-2 no-scrollbar">
            {MGMP_GROUPS.map((group) => (
                <button
                    key={group.id}
                    onClick={() => scrollToSection(group.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        activeGroup === group.id
                        ? "bg-primary text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    {group.title}
                </button>
            ))}
        </div>
    );

    const TeacherCard = ({ teacher }) => (
        <div 
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 flex flex-col h-full"
            onClick={() => openModal(teacher)}
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img 
                    src={getTeacherPhoto(teacher)} 
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <h3 className={`${TYPOGRAPHY.cardTitle} text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2`}>
                    {teacher.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-3 line-clamp-1">
                    {teacher.position}
                </p>
                
                <div className="mt-auto space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-xs">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        <span className="line-clamp-1">{teacher.department}</span>
                    </div>
                    {teacher.subject && (
                        <div className="flex items-center text-gray-500 text-xs">
                            <GraduationCap className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span className="line-clamp-1">{teacher.subject}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const TeacherDetailModal = () => {
        if (!modalOpen || !selectedTeacher) return null;

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="relative h-32 bg-primary flex-shrink-0">
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full shadow-lg">
                            <img 
                                src={getTeacherPhoto(selectedTeacher)} 
                                alt={selectedTeacher.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white"
                            />
                        </div>
                    </div>

                    {/* Body */}
                    <div className="pt-20 px-8 pb-8 overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-serif mb-1">{selectedTeacher.name}</h2>
                            <p className="text-primary font-medium text-lg">{selectedTeacher.position}</p>
                            <div className="flex gap-2 mt-3">
                                <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full">
                                    {selectedTeacher.status}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                                    {selectedTeacher.department}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Informasi Akademik</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">NIP</p>
                                        <p className="text-gray-800 font-medium">{selectedTeacher.nip || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Mata Pelajaran</p>
                                        <p className="text-gray-800 font-medium">{selectedTeacher.subject || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Kontak & Lainnya</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                        <span className="text-sm">{selectedTeacher.email || 'Email tidak tersedia'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <User className="w-4 h-4 mr-3 text-gray-400" />
                                        <span className="text-sm">{selectedTeacher.gender}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
            <Head title="Guru & Staff - SMAN 1 Baleendah" description="Profil Guru dan Staff Pengajar SMAN 1 Baleendah." />

            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* HERO SECTION */}
            <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/hero-bg-sman1-baleendah.jpeg" 
                        alt="Background Guru & Staff" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className={`${TYPOGRAPHY.heroTitle} mb-4`}>
                        Guru & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Staff</span>
                    </h1>
                    <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto opacity-90`}>
                        Tenaga pendidik dan kependidikan yang berdedikasi untuk kemajuan pendidikan di SMAN 1 Baleendah.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-16 bg-gray-50 flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-12 relative">
                        <input
                            type="text"
                            placeholder="Cari nama guru, mata pelajaran, atau jabatan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-full border-0 shadow-md focus:ring-2 focus:ring-primary text-gray-700"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Sidebar Navigation (Desktop) */}
                        <SidebarNav />

                        {/* Mobile Navigation (Tabs) */}
                        <MobileNav />

                        {/* Content Area */}
                        <div className="w-full lg:w-3/4 space-y-16">
                            {MGMP_GROUPS.map((group) => {
                                const teachersInGroup = groupedTeachers[group.id];
                                if (teachersInGroup.length === 0) return null;

                                return (
                                    <div key={group.id} id={group.id} className="scroll-mt-32">
                                        <div className="mb-8 border-b border-gray-200 pb-4">
                                            <h2 className={`${TYPOGRAPHY.sectionHeading} text-2xl md:text-3xl`}>
                                                {group.title}
                                            </h2>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {teachersInGroup.map((teacher) => (
                                                <TeacherCard key={teacher.id} teacher={teacher} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Empty State */}
                            {Object.values(groupedTeachers).every(g => g.length === 0) && (
                                <div className="text-center py-20">
                                    <div className="inline-block p-4 rounded-full bg-white mb-4 shadow-sm">
                                        <Search size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Tidak ada data ditemukan</h3>
                                    <p className="text-gray-500">Coba kata kunci lain.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                socialMediaLinks={navigationData.socialMediaLinks}
            />

            <TeacherDetailModal />
        </div>
    );
}