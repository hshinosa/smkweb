import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import { useContentManagement } from '@/Hooks/useContentManagement';
import { Layout, BookOpen, Microscope, Briefcase, UserCheck } from 'lucide-react';

import HeroSection from '@/Components/Admin/ProgramStudiSections/HeroSection';
import CoreSubjectsSection from '@/Components/Admin/ProgramStudiSections/CoreSubjectsSection';
import FacilitiesSection from '@/Components/Admin/ProgramStudiSections/FacilitiesSection';
import CareerPathsSection from '@/Components/Admin/ProgramStudiSections/CareerPathsSection';
import AlumniSpotlightSection from '@/Components/Admin/ProgramStudiSections/AlumniSpotlightSection';

export default function Index({ currentSettings, activeProgram }) {
    const {
        data,
        setData,
        processing,
        localSuccess,
        localErrors,
        handleSubmit,
    } = useContentManagement({
        hero: currentSettings.hero || {},
        core_subjects: currentSettings.core_subjects || { title: '', description: '', items: [] },
        facilities: currentSettings.facilities || { title: '', description: '', items: [] },
        career_paths: currentSettings.career_paths || { title: '', description: '', items: [] },
        alumni_spotlight: currentSettings.alumni_spotlight || {},
    }, route('admin.program-studi.update_all'));

    const [activeTab, setActiveTab] = useState('hero');

    const tabs = [
        {
            key: 'hero',
            label: 'Hero Section',
            description: 'Atur judul dan background utama halaman.',
            icon: Layout,
        },
        {
            key: 'core_subjects',
            label: 'Mata Pelajaran Unggulan',
            description: 'Daftar mata pelajaran inti program studi.',
            icon: BookOpen,
        },
        {
            key: 'facilities',
            label: 'Fasilitas Riset',
            description: 'Fasilitas pendukung praktikum dan riset.',
            icon: Microscope,
        },
        {
            key: 'career_paths',
            label: 'Prospek Karir',
            description: 'Peluang karir bagi lulusan.',
            icon: Briefcase,
        },
        {
            key: 'alumni_spotlight',
            label: 'Alumni Spotlight',
            description: 'Testimoni dan profil alumni sukses.',
            icon: UserCheck,
        },
    ];

    const handleProgramChange = (e) => {
        router.get(route('admin.program-studi.index'), { program: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Add program_name to the data before submitting
        handleSubmit(e, { program_name: activeProgram });
    };

    const renderActiveSection = () => {
        const sectionProps = {
            data: data[activeTab],
            setData: (key, value) => {
                const newData = { ...data[activeTab], [key]: value };
                setData(activeTab, newData);
            },
            errors: localErrors[activeTab] || {},
        };

        switch (activeTab) {
            case 'hero': return <HeroSection {...sectionProps} />;
            case 'core_subjects': return <CoreSubjectsSection {...sectionProps} />;
            case 'facilities': return <FacilitiesSection {...sectionProps} />;
            case 'career_paths': return <CareerPathsSection {...sectionProps} />;
            case 'alumni_spotlight': return <AlumniSpotlightSection {...sectionProps} />;
            default: return null;
        }
    };

    return (
        <ContentManagementPage
            headerTitle={`Edit Konten Program Studi ${activeProgram.toUpperCase()}`}
            headTitle={`Admin - Program Studi ${activeProgram.toUpperCase()}`}
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            processing={processing}
            onSave={handleSave}
            success={localSuccess}
            errors={localErrors}
            extraHeader={
                <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Layout className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Pilih Program Studi</h3>
                                <p className="text-xs text-gray-500">Pilih program yang ingin dikelola kontennya</p>
                            </div>
                        </div>
                        <div className="sm:ml-auto min-w-[280px]">
                            <select
                                id="program-select"
                                value={activeProgram}
                                onChange={handleProgramChange}
                                className="w-full border-gray-200 focus:border-primary focus:ring-primary rounded-lg shadow-sm text-sm transition-all"
                            >
                                <option value="mipa">MIPA (Matematika & Ilmu Pengetahuan Alam)</option>
                                <option value="ips">IPS (Ilmu Pengetahuan Sosial)</option>
                                <option value="bahasa">Bahasa & Budaya</option>
                            </select>
                        </div>
                    </div>
                </div>
            }
        >
            {renderActiveSection()}
        </ContentManagementPage>
    );
}
