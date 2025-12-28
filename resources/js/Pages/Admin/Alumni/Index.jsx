import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import { Plus, Edit2, Trash2, X, User, GraduationCap, Briefcase, Star, Users } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';

export default function Index({ alumnis }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        graduation_year: new Date().getFullYear(),
        current_position: '',
        education: '',
        testimonial: '',
        category: '',
        image: null,
        image_url: '',
        is_featured: false,
        is_published: true,
        sort_order: 0,
    });

    const tabs = [
        { key: 'list', label: 'Daftar Alumni', description: 'Kelola data jejak alumni dan testimoni mereka.', icon: Users },
    ];

    const openModal = (alumni = null) => {
        if (alumni) {
            setEditMode(true);
            setCurrentId(alumni.id);
            setData({
                name: alumni.name || '',
                graduation_year: alumni.graduation_year || new Date().getFullYear(),
                current_position: alumni.current_position || '',
                education: alumni.education || '',
                testimonial: alumni.testimonial || '',
                category: alumni.category || '',
                image: null,
                image_url: alumni.image_url || '',
                is_featured: !!alumni.is_featured,
                is_published: !!alumni.is_published,
                sort_order: alumni.sort_order || 0,
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
            post(route('admin.alumni.update', currentId), {
                forceFormData: true,
                onSuccess: () => closeModal(),
                _method: 'PUT'
            });
        } else {
            post(route('admin.alumni.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            destroy(route('admin.alumni.destroy', id));
        }
    };

    return (
        <ContentManagementPage
            headerTitle="Kelola Jejak Alumni"
            headTitle="Kelola Alumni"
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
                        Tambah Alumni
                    </PrimaryButton>
                </div>
            }
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Alumni</th>
                                <th className="p-4 font-semibold text-gray-600">Angkatan</th>
                                <th className="p-4 font-semibold text-gray-600">Posisi / Pendidikan</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Featured</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnis.map((alumni) => (
                                <tr key={alumni.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                {alumni.image_url ? (
                                                    <img 
                                                        src={`/storage/${alumni.image_url}`} 
                                                        alt={alumni.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <User size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{alumni.name}</div>
                                                <div className="text-xs text-gray-500">{alumni.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{alumni.graduation_year}</td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-700 flex items-center gap-1">
                                            <Briefcase size={14} className="text-gray-400" />
                                            {alumni.current_position || '-'}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <GraduationCap size={14} className="text-gray-400" />
                                            {alumni.education || '-'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        {alumni.is_featured ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <Star size={12} className="mr-1 fill-current" /> Featured
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            alumni.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {alumni.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => openModal(alumni)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(alumni.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {alumnis.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        Belum ada data alumni.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editMode ? 'Edit Alumni' : 'Tambah Alumni Baru'}
                                        </h3>
                                        <button 
                                            type="button"
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
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

                                        <div>
                                            <InputLabel htmlFor="graduation_year" value="Tahun Lulus" />
                                            <TextInput
                                                id="graduation_year"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.graduation_year}
                                                onChange={(e) => setData('graduation_year', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.graduation_year} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="category" value="Kategori / Bidang" />
                                            <TextInput
                                                id="category"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                placeholder="e.g. Kedokteran, Teknik, Bisnis"
                                            />
                                            <InputError message={errors.category} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="current_position" value="Pekerjaan / Posisi Saat Ini" />
                                            <TextInput
                                                id="current_position"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.current_position}
                                                onChange={(e) => setData('current_position', e.target.value)}
                                                placeholder="e.g. Software Engineer at Gojek"
                                            />
                                            <InputError message={errors.current_position} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="education" value="Pendidikan Terakhir" />
                                            <TextInput
                                                id="education"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.education}
                                                onChange={(e) => setData('education', e.target.value)}
                                                placeholder="e.g. Teknik Informatika - ITB"
                                            />
                                            <InputError message={errors.education} className="mt-2" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="testimonial" value="Testimoni / Cerita Sukses" />
                                            <textarea
                                                id="testimonial"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                rows="4"
                                                value={data.testimonial}
                                                onChange={(e) => setData('testimonial', e.target.value)}
                                                required
                                            ></textarea>
                                            <InputError message={errors.testimonial} className="mt-2" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FileUploadField
                                                label="Foto Alumni"
                                                onChange={(file) => setData('image', file)}
                                                previewUrl={data.image_url ? `/storage/${data.image_url}` : null}
                                                error={errors.image}
                                            />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="sort_order" value="Urutan Tampil" />
                                            <TextInput
                                                id="sort_order"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', e.target.value)}
                                            />
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                    checked={data.is_featured}
                                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Featured</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                    checked={data.is_published}
                                                    onChange={(e) => setData('is_published', e.target.checked)}
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Published</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        className="!bg-primary"
                                    >
                                        {editMode ? 'Simpan Perubahan' : 'Tambah Alumni'}
                                    </PrimaryButton>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
