import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Video } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';

export default function Index({ galleries }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        description: '',
        type: 'photo',
        file: null,
        url: '',
        thumbnail_url: '',
        is_external: false,
        category: '',
        tags: [],
        date: new Date().toISOString().split('T')[0],
        is_featured: true,
    });

    const tabs = [
        { key: 'list', label: 'Galeri Foto & Video', description: 'Kelola dokumentasi visual kegiatan sekolah.', icon: ImageIcon },
    ];

    const openModal = (gallery = null) => {
        if (gallery) {
            setEditMode(true);
            setCurrentId(gallery.id);
            setData({
                title: gallery.title || '',
                description: gallery.description || '',
                type: gallery.type || 'photo',
                file: null,
                url: gallery.url || '',
                thumbnail_url: gallery.thumbnail_url || '',
                is_external: !!gallery.is_external,
                category: gallery.category || '',
                tags: gallery.tags || [],
                date: gallery.date || new Date().toISOString().split('T')[0],
                is_featured: !!gallery.is_featured,
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
            post(route('admin.galleries.update', currentId), {
                forceFormData: true,
                onSuccess: () => closeModal(),
                _method: 'PUT'
            });
        } else {
            post(route('admin.galleries.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) {
            destroy(route('admin.galleries.destroy', id));
        }
    };

    return (
        <ContentManagementPage
            headerTitle="Kelola Galeri Sekolah"
            headTitle="Kelola Galeri"
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
                        Tambah Item
                    </PrimaryButton>
                </div>
            }
        >
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {galleries.map((item) => (
                        <div key={item.id} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all relative">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                {item.type === 'photo' ? (
                                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                                        <Video size={48} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(item)} className="p-2 bg-white/90 rounded-full text-blue-600 shadow-sm hover:bg-white">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 rounded-full text-red-600 shadow-sm hover:bg-white">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                {item.is_featured && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded uppercase">
                                        Featured
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold text-gray-800 truncate text-sm">{item.title}</h4>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{item.category || 'Umum'}</span>
                                    <span className="text-[10px] text-gray-400">{item.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editMode ? 'Edit Item Galeri' : 'Tambah Item Galeri Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Judul" />
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
                                    <InputLabel htmlFor="type" value="Tipe Media" />
                                    <select
                                        id="type"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        <option value="photo">Foto</option>
                                        <option value="video">Video</option>
                                    </select>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Deskripsi (Opsional)" />
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="2"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_external"
                                            checked={data.is_external}
                                            onChange={(e) => setData('is_external', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <label htmlFor="is_external" className="ml-2 text-sm text-gray-600">Gunakan URL Luar (YouTube/Cloudinary)</label>
                                    </div>
                                </div>

                                {data.is_external ? (
                                    <div>
                                        <InputLabel htmlFor="url" value="URL Media" />
                                        <TextInput
                                            id="url"
                                            className="mt-1 block w-full"
                                            value={data.url}
                                            onChange={(e) => setData('url', e.target.value)}
                                            placeholder="https://..."
                                            required={data.is_external}
                                        />
                                        <InputError message={errors.url} className="mt-2" />
                                    </div>
                                ) : (
                                    <div>
                                        <InputLabel value="Upload File" />
                                        <FileUploadField
                                            id="gallery_file"
                                            label="File Galeri"
                                            previewUrl={data.url && !data.file ? data.url : (data.file ? URL.createObjectURL(data.file) : '')}
                                            onChange={(file) => setData('file', file)}
                                            error={errors.file}
                                            description="Pilih file foto untuk galeri"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="category" value="Kategori" />
                                    <TextInput
                                        id="category"
                                        className="mt-1 block w-full"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        placeholder="Contoh: Kegiatan, Fasilitas"
                                    />
                                    <InputError message={errors.category} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="date" value="Tanggal" />
                                    <TextInput
                                        id="date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                    />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_featured_gallery"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                                <label htmlFor="is_featured_gallery" className="ml-2 text-sm text-gray-600">Tampilkan di Landing Page</label>
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
                                    {editMode ? 'Simpan Perubahan' : 'Tambah Item'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ContentManagementPage>
    );
}
