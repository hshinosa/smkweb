import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, CheckCircle, Upload } from 'lucide-react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function AcademicCalendarContentPage({ contents, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        calendar_image: null,
        semester: 1, // Default to odd semester (Ganjil)
        academic_year_start: new Date().getFullYear(),
        sort_order: 0,
    });

    const openCreateModal = () => {
        reset();
        setEditingContent(null);
        setSelectedFile(null);
        setPreviewUrl('');
        setShowModal(true);
    };    const openEditModal = (content) => {
        setData({
            title: content.title,
            calendar_image: null,
            semester: content.semester,
            academic_year_start: content.academic_year_start,
            sort_order: content.sort_order,
        });
        setEditingContent(content);
        setSelectedFile(null);
        setPreviewUrl(content.calendar_image_url || '');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingContent(null);
        setSelectedFile(null);
        setPreviewUrl('');
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
          const formData = new FormData();
        formData.append('title', data.title);
        formData.append('semester', data.semester);
        formData.append('academic_year_start', data.academic_year_start);
        formData.append('sort_order', data.sort_order);
        
        if (selectedFile) {
            formData.append('calendar_image', selectedFile);
        }
          if (editingContent) {
            put(route('admin.academic-calendar.update', editingContent.id), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                },
            });
        } else {
            post(route('admin.academic-calendar.store'), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    const handleDelete = (content) => {
        if (confirm(`Yakin ingin menghapus "${content.title}"?`)) {
            router.delete(route('admin.academic-calendar.destroy', content.id));
        }
    };

    const handleSetActive = (content) => {
        router.patch(route('admin.academic-calendar.set-active', content.id));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.academic-calendar.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout headerTitle="Kelola Kalender Akademik">
            <Head title="Kelola Kalender Akademik" />
            
            <div className="max-w-screen-2xl mx-auto p-3 sm:p-4">
                <div className="space-y-6">
                    {/* Search and Filters dengan Button Tambah */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Cari Berdasarkan Judul</h2>
                            <PrimaryButton onClick={openCreateModal} className="flex items-center gap-2">
                                <Plus size={16} />
                                Tambah Kalender Baru
                            </PrimaryButton>
                        </div>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari berdasarkan judul, deskripsi, atau tahun akademik..."
                                    className="w-full"
                                />
                            </div>
                            <PrimaryButton type="submit" className="flex items-center gap-2">
                                <Search size={16} />
                                Cari
                            </PrimaryButton>
                        </form>
                    </div>

                    {/* Content List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                                            Kalender Akademik
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                            Semester & Tahun
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                            Urutan
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {contents.data.length > 0 ? (
                                        contents.data.map((content) => (
                                            <tr key={content.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            <img
                                                                className="h-12 w-12 rounded object-cover border"
                                                                src={content.calendar_image_url}
                                                                alt={content.title}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://placehold.co/48x48/E5E7EB/9CA3AF?text=IMG';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ml-3 min-w-0 flex-1">                                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                                {content.title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900">
                                                    <div className="flex flex-col">                                                        <span className="font-medium">{content.semester === 1 ? 'Semester Ganjil' : 'Semester Genap'}</span>
                                                        <span className="text-xs text-gray-500">{content.academic_year_start}/{content.academic_year_start + 1}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 text-center">
                                                    {content.sort_order}
                                                </td>
                                                <td className="px-3 py-4 text-sm font-medium">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => openEditModal(content)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(content)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-3 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p>Belum ada kalender akademik yang ditambahkan.</p>
                                                    <PrimaryButton onClick={openCreateModal} className="mt-2">
                                                        Tambah Kalender Pertama
                                                    </PrimaryButton>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {contents.links && contents.links.length > 3 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan {contents.from} - {contents.to} dari {contents.total} hasil
                                    </div>
                                    <div className="flex gap-1">
                                        {contents.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-1 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        {editingContent ? 'Edit Kalender Akademik' : 'Tambah Kalender Akademik'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="title" value="Judul" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                placeholder="Contoh: Kalender Akademik SMA Negeri 1 Baleendah"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="calendar_image" value="Gambar Kalender" />
                            <div className="flex flex-col gap-2">
                                <input
                                    id="calendar_image"
                                    type="file"
                                    accept="image/*"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            // Validasi ukuran file (max 2MB)
                                            if (file.size > 2 * 1024 * 1024) {
                                                alert('Ukuran file terlalu besar. Maksimal 2MB.');
                                                return;
                                            }
                                            
                                            // Validasi tipe file
                                            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/svg+xml'];
                                            if (!validImageTypes.includes(file.type)) {
                                                alert('Format file tidak didukung. Gunakan format JPG, PNG, GIF, atau SVG.');
                                                return;
                                            }

                                            setSelectedFile(file);
                                            setData('calendar_image', file);

                                            // Create preview URL
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setPreviewUrl(event.target.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <InputError message={errors.calendar_image} className="mt-2" />
                                <p className="text-xs text-gray-500 mt-1">
                                    Pilih file gambar kalender akademik (JPG, PNG, GIF, SVG - Maksimal 2MB)
                                </p>
                                {previewUrl && (
                                    <div className="mt-2 relative w-full max-w-xs h-48 border rounded-md overflow-hidden bg-gray-50 shadow-sm">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="object-contain w-full h-full"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/400x300/E5E7EB/9CA3AF?text=Preview';
                                            }}
                                        />
                                        <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs font-medium text-gray-700">
                                            Preview
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="academic_year_start" value="Tahun Awal Akademik" />
                                <TextInput
                                    id="academic_year_start"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.academic_year_start}
                                    onChange={(e) => setData('academic_year_start', parseInt(e.target.value) || new Date().getFullYear())}
                                    required
                                    placeholder="2024"
                                    min="2000"
                                    max="2100"
                                />
                                <InputError message={errors.academic_year_start} className="mt-2" />
                                <p className="text-xs text-gray-500 mt-1">
                                    Contoh: 2024 untuk tahun akademik 2024/2025
                                </p>
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="semester" value="Semester" />
                                <select
                                    id="semester"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.semester}
                                    onChange={(e) => setData('semester', parseInt(e.target.value))}
                                    required
                                >
                                    <option value={1}>Semester Ganjil</option>
                                    <option value={2}>Semester Genap</option>
                                </select>
                                <InputError message={errors.semester} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div>
                                <InputLabel htmlFor="sort_order" value="Urutan" />
                                <TextInput
                                    id="sort_order"
                                    type="number"
                                    className="mt-1 block w-24"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                                <InputError message={errors.sort_order} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : (editingContent ? 'Perbarui' : 'Simpan')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
