import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import { Plus, Edit2, Trash2, Upload, X, ExternalLink } from 'lucide-react';

export default function Index({ programs }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        category: '',
        icon_name: '',
        image: null,
        image_url: '',
        color_class: '',
        description: '',
        link: '',
        is_featured: true,
        sort_order: 0,
    });

    const openModal = (program = null) => {
        if (program) {
            setEditMode(true);
            setCurrentId(program.id);
            setData({
                title: program.title || '',
                category: program.category || '',
                icon_name: program.icon_name || '',
                image: null,
                image_url: program.image_url || '',
                color_class: program.color_class || '',
                description: program.description || '',
                link: program.link || '',
                is_featured: !!program.is_featured,
                sort_order: program.sort_order || 0,
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
        e.preventDefault();
        if (editMode) {
            // Use POST with _method=PUT for file uploads in Laravel
            post(route('admin.programs.update', currentId), {
                forceFormData: true,
                onSuccess: () => closeModal(),
                _method: 'PUT'
            });
        } else {
            post(route('admin.programs.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus program ini?')) {
            destroy(route('admin.programs.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Program Sekolah" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Program Sekolah</h2>
                            <PrimaryButton 
                                onClick={() => openModal()}
                                className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Program
                            </PrimaryButton>
                        </div>

                        {success && (
                            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                                {success}
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-4 border-b font-semibold text-gray-700">Judul</th>
                                        <th className="p-4 border-b font-semibold text-gray-700">Kategori</th>
                                        <th className="p-4 border-b font-semibold text-gray-700">Featured</th>
                                        <th className="p-4 border-b font-semibold text-gray-700">Urutan</th>
                                        <th className="p-4 border-b font-semibold text-gray-700 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {programs.map((program) => (
                                        <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 border-b">
                                                <div className="font-medium text-gray-900">{program.title}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{program.description}</div>
                                            </td>
                                            <td className="p-4 border-b text-gray-600">{program.category}</td>
                                            <td className="p-4 border-b">
                                                {program.is_featured ? (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Ya</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Tidak</span>
                                                )}
                                            </td>
                                            <td className="p-4 border-b text-gray-600">{program.sort_order}</td>
                                            <td className="p-4 border-b text-right">
                                                <button 
                                                    onClick={() => openModal(program)}
                                                    className="text-blue-600 hover:text-blue-800 mr-3"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(program.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editMode ? 'Edit Program' : 'Tambah Program Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Judul Program" />
                                    <TextInput
                                        id="title"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="category" value="Kategori" />
                                    <TextInput
                                        id="category"
                                        className="mt-1 block w-full"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.category} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="icon_name" value="Nama Ikon (Lucide)" />
                                    <TextInput
                                        id="icon_name"
                                        className="mt-1 block w-full"
                                        value={data.icon_name}
                                        onChange={(e) => setData('icon_name', e.target.value)}
                                        placeholder="Contoh: Microscope, Globe, Leaf"
                                    />
                                    <InputError message={errors.icon_name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="color_class" value="Class Warna (Tailwind)" />
                                    <TextInput
                                        id="color_class"
                                        className="mt-1 block w-full"
                                        value={data.color_class}
                                        onChange={(e) => setData('color_class', e.target.value)}
                                        placeholder="Contoh: bg-blue-100 text-blue-600"
                                    />
                                    <InputError message={errors.color_class} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Deskripsi" />
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="link" value="Link Halaman (Opsional)" />
                                <TextInput
                                    id="link"
                                    className="mt-1 block w-full"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                    placeholder="/akademik/program-studi/mipa"
                                />
                                <InputError message={errors.link} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel value="Gambar Program (Opsional)" />
                                    <FileUploadField
                                        id="program_image"
                                        label="Gambar Program"
                                        previewUrl={data.image_url && !data.image ? data.image_url : (data.image ? URL.createObjectURL(data.image) : '')}
                                        onChange={(file) => setData('image', file)}
                                        error={errors.image}
                                        description="Jika diisi, akan menggantikan ikon di landing page."
                                    />
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <label htmlFor="is_featured" className="ml-2 text-sm text-gray-600">Tampilkan di Landing Page</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <InputLabel htmlFor="sort_order" value="Urutan" />
                                        <TextInput
                                            id="sort_order"
                                            type="number"
                                            className="w-20"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Batal
                                </button>
                                <PrimaryButton 
                                    disabled={processing}
                                    className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 shadow-sm"
                                >
                                    {editMode ? 'Simpan Perubahan' : 'Tambah Program'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
