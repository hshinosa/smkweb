import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import { useContentManagement } from '@/Hooks/useContentManagement';
import { Layout, Users, UserPlus, X, User as UserIcon, UserCog } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';

// Import Section Components
import HeroSection from '@/Components/Admin/TeacherSections/HeroSection';
import TeachersListSection from '@/Components/Admin/TeacherSections/TeachersListSection';

export default function Index({ teachers, currentSettings }) {
    const [activeTab, setActiveTab] = useState('hero');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form for settings (Hero)
    const {
        data: settingsData,
        setData: setSettingsData,
        processing: settingsProcessing,
        localSuccess,
        localErrors: settingsErrors,
        selectedFiles,
        previewUrls,
        handleFileChange,
        handleSubmit: handleSettingsSubmit,
    } = useContentManagement({
        title: currentSettings.title || '',
        subtitle: currentSettings.subtitle || '',
        image: currentSettings.image || '',
    }, route('admin.teachers.update_settings'));

    // Form for teacher data
    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        nip: '',
        type: 'guru',
        position: '',
        department: '',
        email: '',
        image: null,
        image_url: '',
    });

    const tabs = [
        { key: 'hero', label: 'Hero Section', description: 'Atur tampilan banner utama halaman Guru & Staff.', icon: Layout },
        { key: 'guru', label: 'Daftar Guru', description: 'Kelola data Tenaga Pendidik (Guru).', icon: Users },
        { key: 'staff', label: 'Daftar Staff', description: 'Kelola data Tenaga Kependidikan (Staff & TU).', icon: UserCog },
    ];

    const openModal = (teacher = null, type = 'guru') => {
        if (teacher) {
            setEditMode(true);
            setCurrentId(teacher.id);
            setData({
                name: teacher.name || '',
                nip: teacher.nip || '',
                type: teacher.type || 'guru',
                position: teacher.position || '',
                department: teacher.department || '',
                email: teacher.email || '',
                image: null,
                image_url: teacher.image_url || '',
            });
        } else {
            setEditMode(false);
            setCurrentId(null);
            reset();
            setData('type', type);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleTeacherSubmit = (e) => {
        if (e) e.preventDefault();
        if (editMode) {
            post(route('admin.teachers.update', currentId), {
                forceFormData: true,
                onSuccess: () => closeModal(),
                _method: 'PUT'
            });
        } else {
            post(route('admin.teachers.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            destroy(route('admin.teachers.destroy', id));
        }
    };

    const handleSaveSettings = (e) => {
        const formData = new FormData();
        formData.append('title', settingsData.title);
        formData.append('subtitle', settingsData.subtitle);
        if (selectedFiles.image_file) {
            formData.append('image_file', selectedFiles.image_file);
        }
        handleSettingsSubmit(e, formData);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'hero':
                return (
                    <HeroSection 
                        data={settingsData}
                        errors={settingsErrors}
                        setData={setSettingsData}
                        handleFileChange={handleFileChange}
                        previewUrls={previewUrls}
                    />
                );
            case 'guru':
                return (
                    <TeachersListSection 
                        teachers={teachers}
                        type="guru"
                        onEdit={(t) => openModal(t)}
                        onDelete={handleDelete}
                        onAdd={() => openModal(null, 'guru')}
                    />
                );
            case 'staff':
                return (
                    <TeachersListSection 
                        teachers={teachers}
                        type="staff"
                        onEdit={(t) => openModal(t)}
                        onDelete={handleDelete}
                        onAdd={() => openModal(null, 'staff')}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <ContentManagementPage
            headerTitle="Kelola Guru & Staff"
            headTitle="Admin - Guru & Staff"
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            processing={settingsProcessing}
            onSave={handleSaveSettings}
            success={localSuccess}
            errors={settingsErrors}
        >
            <div className="space-y-6">
                {renderTabContent()}
            </div>

            {/* Modal for Add/Edit Teacher */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeModal}>
                            <div className="absolute inset-0 bg-gray-500/75 backdrop-blur-sm"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleTeacherSubmit}>
                                <div className="bg-white px-6 pt-6 pb-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {editMode ? 'Edit Data' : 'Tambah Data'}
                                        </h3>
                                        <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="name" value="Nama Lengkap" />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="nip" value="NIP (Opsional)" />
                                                <TextInput
                                                    id="nip"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.nip}
                                                    onChange={(e) => setData('nip', e.target.value)}
                                                />
                                                <InputError message={errors.nip} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="type" value="Tipe" />
                                                <select
                                                    id="type"
                                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-lg shadow-sm"
                                                    value={data.type}
                                                    onChange={(e) => setData('type', e.target.value)}
                                                    required
                                                >
                                                    <option value="guru">Guru</option>
                                                    <option value="staff">Staff</option>
                                                </select>
                                                <InputError message={errors.type} className="mt-2" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="position" value="Jabatan" />
                                            <TextInput
                                                id="position"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.position}
                                                onChange={(e) => setData('position', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.position} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="department" value="Unit / Departemen" />
                                            <TextInput
                                                id="department"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.department}
                                                onChange={(e) => setData('department', e.target.value)}
                                            />
                                            <InputError message={errors.department} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="image" value="Foto Profil" />
                                            <FileUploadField
                                                id="image"
                                                onChange={(file) => setData('image', file)}
                                                previewUrl={data.image_url}
                                                label="Upload Foto"
                                            />
                                            <InputError message={errors.image} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                                    <PrimaryButton
                                        type="submit"
                                        className="!bg-primary text-white w-full sm:w-auto justify-center"
                                        disabled={processing}
                                    >
                                        {editMode ? 'Simpan Perubahan' : 'Tambah Data'}
                                    </PrimaryButton>
                                    <button
                                        type="button"
                                        className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                                        onClick={closeModal}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </ContentManagementPage>
    );
}

