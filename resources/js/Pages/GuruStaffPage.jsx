import React, { useState, useMemo } from 'react';
import { Search, Filter, User, MapPin, Phone, Mail, Users, GraduationCap } from 'lucide-react';

// Import Components
import { AcademicLayout, AcademicHero } from '@/Components/Academic';

// Import utilities
import { TYPOGRAPHY } from '@/Utils/typography';
import { 
    mockTeacherData, 
    teacherDepartments, 
    teacherStatuses, 
    teacherTypes,
    filterTeachersByDepartment,
    filterTeachersByStatus,
    filterTeachersByType,
    searchTeachers,
    getTeacherPhoto
} from '@/Utils/teacherData';

export default function GuruStaffPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('Semua');
    const [selectedStatus, setSelectedStatus] = useState('Semua');
    const [selectedType, setSelectedType] = useState('Semua');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Filter dan search teacher data
    const filteredData = useMemo(() => {
        let data = mockTeacherData;
        
        // Filter by department
        if (selectedDepartment !== 'Semua') {
            data = data.filter(teacher => teacher.department === selectedDepartment);
        }
        
        // Filter by status
        if (selectedStatus !== 'Semua') {
            data = data.filter(teacher => teacher.status === selectedStatus);
        }
        
        // Filter by type
        if (selectedType !== 'Semua') {
            data = data.filter(teacher => teacher.type === selectedType);
        }
        
        // Search
        if (searchQuery.trim()) {
            data = data.filter(teacher => 
                teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                teacher.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (teacher.subject && teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
                teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        return data;
    }, [selectedDepartment, selectedStatus, selectedType, searchQuery]);

    const openModal = (teacher) => {
        setSelectedTeacher(teacher);
        setModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    // Keyboard navigation for modal
    React.useEffect(() => {
        if (!modalOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen]);

    const closeModal = () => {
        setModalOpen(false);
        setSelectedTeacher(null);
        document.body.style.overflow = 'unset';
    };

    const TeacherCard = ({ teacher }) => (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group focus:ring-2 focus:ring-primary focus:outline-none"
            onClick={() => openModal(teacher)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(teacher);
                }
            }}
            aria-label={`Lihat detail ${teacher.name}`}
        >
            <div className="relative">
                <div className="aspect-square overflow-hidden">
                    <img 
                        src={getTeacherPhoto(teacher)} 
                        alt={teacher.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </div>
                <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${
                        teacher.type === 'teacher' ? 'bg-primary' : 'bg-green-600'
                    }`}>
                        {teacher.type === 'teacher' ? 'Guru' : 'Staff'}
                    </span>
                </div>
                <div className="absolute top-2 left-2">
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${
                        teacher.status === 'PNS' ? 'bg-blue-600' : 
                        teacher.status === 'Honorer' ? 'bg-orange-600' :
                        teacher.status === 'GTT' ? 'bg-purple-600' : 'bg-pink-600'
                    }`}>
                        {teacher.status}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className={`${TYPOGRAPHY.cardTitle} line-clamp-2 mb-1`}>
                    {teacher.name}
                </h3>
                <p className={`${TYPOGRAPHY.secondaryText} line-clamp-1 mb-2`}>
                    {teacher.position}
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{teacher.department}</span>
                </div>
                {teacher.subject && (
                    <div className="flex items-center text-gray-500 text-sm">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        <span className="line-clamp-1">{teacher.subject}</span>
                    </div>
                )}
            </div>
        </div>
    );

    const TeacherDetailModal = () => {
        if (!modalOpen || !selectedTeacher) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                    <div className="relative">
                        {/* Header with photo */}
                        <div className="bg-gradient-to-r from-primary to-primary-darker p-6 text-white">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                                    <img 
                                        src={getTeacherPhoto(selectedTeacher)} 
                                        alt={selectedTeacher.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold mb-2">{selectedTeacher.name}</h2>
                                    <p className="text-lg opacity-90 mb-2">{selectedTeacher.position}</p>
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                        <span className={`text-xs px-3 py-1 rounded-full ${
                                            selectedTeacher.type === 'teacher' ? 'bg-white text-primary' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {selectedTeacher.type === 'teacher' ? 'Guru' : 'Staff'}
                                        </span>
                                        <span className={`text-xs px-3 py-1 rounded-full ${
                                            selectedTeacher.status === 'PNS' ? 'bg-blue-100 text-blue-800' : 
                                            selectedTeacher.status === 'Honorer' ? 'bg-orange-100 text-orange-800' :
                                            selectedTeacher.status === 'GTT' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'
                                        }`}>
                                            {selectedTeacher.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4 flex items-center`}>
                                        <User className="w-5 h-5 mr-2 text-primary" />
                                        Informasi Personal
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className={`${TYPOGRAPHY.formLabel} block`}>NIP</label>
                                            <p className={`${TYPOGRAPHY.bodyText} mb-0`}>
                                                {selectedTeacher.nip || 'Tidak tersedia'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`${TYPOGRAPHY.formLabel} block`}>Jenis Kelamin</label>
                                            <p className={`${TYPOGRAPHY.bodyText} mb-0`}>
                                                {selectedTeacher.gender}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`${TYPOGRAPHY.formLabel} block`}>Agama</label>
                                            <p className={`${TYPOGRAPHY.bodyText} mb-0`}>
                                                {selectedTeacher.religion}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div>
                                    <h3 className={`${TYPOGRAPHY.subsectionHeading} mb-4 flex items-center`}>
                                        <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                                        Informasi Profesional
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className={`${TYPOGRAPHY.formLabel} block`}>Jabatan</label>
                                            <p className={`${TYPOGRAPHY.bodyText} mb-0`}>
                                                {selectedTeacher.position}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`${TYPOGRAPHY.formLabel} block`}>Departemen</label>
                                            <p className={`${TYPOGRAPHY.bodyText} mb-0`}>
                                                {selectedTeacher.department}
                                            </p>
                                        </div>
                                        {selectedTeacher.subject && (
                                            <div>
                                                <label className={`${TYPOGRAPHY.formLabel} block`}>Mata Pelajaran</label>
                                                <p className={`${TYPOGRAPHY.bodyText} mb-0`}>
                                                    {selectedTeacher.subject}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <label className={`${TYPOGRAPHY.formLabel} block`}>Status Kepegawaian</label>
                                            <p className={`${TYPOGRAPHY.bodyText} mb-0`}>
                                                {selectedTeacher.status}
                                            </p>
                                        </div>
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
        <AcademicLayout>
            <AcademicHero
                title="Guru & Staff"
                description="Tenaga pendidik dan kependidikan yang berdedikasi untuk kemajuan pendidikan di SMAN 1 Baleendah. Temui para guru dan staff yang berkomitmen memberikan pendidikan berkualitas tinggi."
                pageTitle="Guru & Staff - SMAN 1 Baleendah"
                metaDescription="Profil lengkap guru dan staff SMAN 1 Baleendah. Tenaga pendidik profesional dan berpengalaman yang mendukung proses pembelajaran berkualitas tinggi."
            />

                {/* Filter and Search Section */}
                <section className="py-8 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau jabatan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Department Filter */}
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {teacherDepartments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {teacherStatuses.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>

                            {/* Type Filter */}
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="Semua">Semua Tipe</option>
                                <option value="teacher">Guru</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>

                        {/* Results count */}
                        <div className="mt-4">
                            <p className={`${TYPOGRAPHY.secondaryText}`}>
                                Menampilkan {filteredData.length} dari {mockTeacherData.length} orang
                            </p>
                        </div>
                    </div>
                </section>

                {/* Teachers Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredData.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {filteredData.map((teacher) => (
                                    <TeacherCard key={teacher.id} teacher={teacher} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Users className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className={`${TYPOGRAPHY.subsectionHeading} text-gray-600 mb-2`}>
                                    Tidak ada hasil ditemukan
                                </h3>
                                <p className={`${TYPOGRAPHY.bodyText} text-gray-500`}>
                                    Coba ubah kata kunci pencarian atau pilih filter lain
                                </p>
                            </div>
                        )}
                    </div>
                </section>

            <TeacherDetailModal />
        </AcademicLayout>
    );
}