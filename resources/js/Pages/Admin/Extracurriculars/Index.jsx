import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import { Plus, Edit2, Trash2, Star, X } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';

export default function Index({ extracurriculars }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        category: 'Olahraga',
        description: '',
        image: null,
        image_url: '',
        schedule: '',
        is_active: true,
    });

    const tabs = [
        { key: 'list', label: 'Daftar Ekskul', description: 'Kelola kegiatan ekstrakurikuler sekolah.', icon: Star },
    ];

    const openModal = (item = null) => {
        if (item) {
            setEditMode(true);
            setCurrentId(item.id);
            setData({
                name: item.name || '',
                category: item.category || 'Olahraga',
                description: item.description || '',
                image: null,
                image_url: item.image_url || '',
                schedule: item.schedule || '',
                is_active: !!item.is_active,
            });
        } else {
            setEditMode(false);
            setCurrentId(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (editMode) {
            post(route('admin.extracurriculars.update', currentId), {
                forceFormData: true,
                onSuccess: () => closeModal(),
                _method: 'PUT'
            });
        } else {
            post(route('admin.extracurriculars.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus ekstrakurikuler ini?')) {
            destroy(route('admin.extracurriculars.destroy', id));
        }
    };

    return (
        <ContentManagementPage
            headerTitle="Kelola Ekstrakurikuler"
            headTitle="Kelola Ekskul"
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSave={() => openModal()}
            extraHeader={
                <div className="flex justify-end">
                    <PrimaryButton 
                        onClick={() => openModal()}
                        className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Ekskul
                    </PrimaryButton>
                </div>
            }
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {extracurriculars.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-12 w-20 rounded overflow-hidden bg-gray-100">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <Star className="text-gray-400 w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.schedule || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editMode ? 'Edit Ekskul' : 'Tambah Ekskul Baru'}
                                        </h3>
                                        <button type="button" onClick={closeModal}>
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="name" value="Nama Ekstrakurikuler" />
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

                                        <div>
                                            <InputLabel htmlFor="category" value="Kategori" />
                                            <select
                                                id="category"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                required
                                            >
                                                <option value="Olahraga">Olahraga</option>
                                                <option value="Seni & Budaya">Seni & Budaya</option>
                                                <option value="Akademik & Sains">Akademik & Sains</option>
                                                <option value="Keagamaan & Sosial">Keagamaan & Sosial</option>
                                            </select>
                                            <InputError message={errors.category} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="schedule" value="Jadwal Latihan" />
                                            <TextInput
                                                id="schedule"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.schedule}
                                                onChange={(e) => setData('schedule', e.target.value)}
                                                placeholder="Contoh: Senin & Rabu, 15:30 - 17:00"
                                            />
                                            <InputError message={errors.schedule} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="description" value="Deskripsi" />
                                            <textarea
                                                id="description"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                rows="4"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                required
                                            ></textarea>
                                            <InputError message={errors.description} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="image" value="Gambar / Logo" />
                                            <FileUploadField
                                                id="image"
                                                onChange={(file) => setData('image', file)}
                                                previewUrl={data.image_url}
                                                label="Upload Gambar"
                                            />
                                            <InputError message={errors.image} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <PrimaryButton
                                        type="submit"
                                        className="sm:ml-3"
                                        disabled={processing}
                                    >
                                        {editMode ? 'Simpan Perubahan' : 'Tambah Ekskul'}
                                    </PrimaryButton>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
