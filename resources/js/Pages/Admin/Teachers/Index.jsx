// FILE: resources/js/Pages/Admin/Teachers/Index.jsx
// Redesigned with consistent card-based UI and accessibility

import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import { useContentManagement } from '@/Hooks/useContentManagement';
import { Layout, Users, UserCog, X, User, Edit, Trash2 } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import Modal from '@/Components/Modal';

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
        e.preventDefault();
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

    // Filter teachers by type
    const teachersByType = (type) => teachers.filter(t => t.type === type);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'hero':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="title" value="Judul Halaman" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full"
                                value={settingsData.title}
                                onChange={(e) => setSettingsData('title', e.target.value)}
                                placeholder="Contoh: Guru & Staff SMAN 1 Baleendah"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="subtitle" value="Sub Judul" />
                            <TextInput
                                id="subtitle"
                                type="text"
                                className="mt-1 block w-full"
                                value={settingsData.subtitle}
                                onChange={(e) => setSettingsData('subtitle', e.target.value)}
                                placeholder="Contoh: Tenaga Pendidik dan Kependidikan Berkompeten"
                            />
                        </div>
                        <div>
                            <InputLabel value="Gambar Header" />
                            <FileUploadField
                                id="hero_image"
                                label="Gambar Banner"
                                previewUrl={previewUrls.image_file ? URL.createObjectURL(previewUrls.image_file) : (settingsData.image || '')}
                                onChange={(file) => handleFileChange('image_file', file)}
                                description="Gunakan gambar dengan rasio 16:9 untuk hasil terbaik"
                            />
                        </div>
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <PrimaryButton
                                onClick={handleSaveSettings}
                                disabled={settingsProcessing}
                                className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500"
                            >
                                {settingsProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </PrimaryButton>
                        </div>
                    </div>
                );
            case 'guru':
                return (
                    <TeachersListSection 
                        teachers={teachersByType('guru')}
                        title="Tenaga Pendidik (Guru)"
                        onEdit={(t) => openModal(t, 'guru')}
                        onDelete={handleDelete}
                        onAdd={() => openModal(null, 'guru')}
                    />
                );
            case 'staff':
                return (
                    <TeachersListSection 
                        teachers={teachersByType('staff')}
                        title="Tenaga Kependidikan (Staff)"
                        onEdit={(t) => openModal(t, 'staff')}
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
            headTitle="Guru & Staff"
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
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                    {/* Header */}
                    <div className="p-5 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                {editMode ? 'Edit Data' : 'Tambah Data Baru'}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                {editMode ? 'Perbarui data guru/staff' : 'Tambahkan data baru'}
                            </p>
                        </div>
                        <button 
                            onClick={closeModal} 
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleTeacherSubmit} className="p-5 sm:p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Nama lengkap..."
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="type" value="Tipe" />
                                <select
                                    id="type"
                                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow focus:ring-accent-yellow text-sm"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                >
                                    <option value="guru">Guru</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="nip" value="NIP (Opsional)" />
                                <TextInput
                                    id="nip"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.nip}
                                    onChange={(e) => setData('nip', e.target.value)}
                                    placeholder="Nomor Induk Pegawai"
                                />
                                <InputError message={errors.nip} className="mt-2" />
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
                                    placeholder="Contoh: Guru Matematika"
                                />
                                <InputError message={errors.position} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="department" value="Unit / Departemen" />
                            <TextInput
                                id="department"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.department}
                                onChange={(e) => setData('department', e.target.value)}
                                placeholder="Contoh: MIPA"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@contoh.com"
                            />
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

                        {/* Action buttons with accent color */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors order-2 sm:order-1"
                            >
                                Batal
                            </button>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 px-6 py-2.5 font-semibold order-1 sm:order-2"
                            >
                                {processing ? 'Menyimpan...' : (editMode ? 'Simpan Perubahan' : 'Tambah Data')}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </ContentManagementPage>
    );
}

// Teachers List Section Component
function TeachersListSection({ teachers, title, onEdit, onDelete, onAdd }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2 !bg-accent-yellow !text-gray-900 rounded-lg hover:!bg-yellow-500 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
                >
                    <User size={18} />
                    Tambah
                </button>
            </div>

            {teachers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Foto</th>
                                <th className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Jabatan</th>
                                <th className="px-4 py-3 sm:px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 sm:px-6 whitespace-nowrap">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                            {teacher.image_url ? (
                                                <img src={teacher.image_url} alt={teacher.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <User size={20} className="sm:w-6 sm:h-6" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 sm:px-6">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{teacher.name}</p>
                                            {teacher.nip && <p className="text-xs text-gray-500 font-mono mt-0.5">{teacher.nip}</p>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 sm:px-6 text-sm text-gray-600 hidden sm:table-cell">{teacher.position}</td>
                                    <td className="px-4 py-3 sm:px-6 text-right">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                            <button 
                                                onClick={() => onEdit(teacher)} 
                                                className="p-2 !text-accent-yellow hover:bg-accent-yellow/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(teacher.id)} 
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-8 sm:p-12 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Users size={28} className="sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium mb-4 text-sm sm:text-base">Belum ada data</p>
                    <button
                        onClick={onAdd}
                        className="px-4 py-2 !bg-accent-yellow !text-gray-900 rounded-lg hover:!bg-yellow-500 transition-colors text-sm font-medium"
                    >
                        Tambah {title.split('(')[1]?.replace(')', '') || ''}
                    </button>
                </div>
            )}
        </div>
    );
}
