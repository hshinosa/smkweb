// FILE: resources/js/Pages/Admin/Alumni/Index.jsx
// Fully responsive alumni management page with accent color theme and video support

import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import { Plus, Edit2, Trash2, X, User, GraduationCap, Briefcase, Star, Video, FileText } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import Modal from '@/Components/Modal';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/Utils/imageUtils';

export default function Index({ alumnis }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, delete: destroy, processing, errors, reset, transform } = useForm({
        name: '',
        graduation_year: new Date().getFullYear(),
        testimonial: '',
        content_type: 'text',
        image: null,
        image_url: '',
        video_source: 'youtube',
        video_url: '',
        video_file: null,
        is_featured: false,
        is_published: true,
        sort_order: 0,
    });

    const tabs = [{ key: 'list', label: 'Daftar Alumni', description: 'Kelola data alumni.', icon: User }];

    const openModal = (alumni = null) => {
        if (alumni) {
            setEditMode(true);
            setCurrentId(alumni.id);
            setData({
                name: alumni.name || '',
                graduation_year: alumni.graduation_year || new Date().getFullYear(),
                testimonial: alumni.testimonial || '',
                content_type: alumni.content_type || 'text',
                image: null,
                image_url: alumni.image_url || '',
                video_source: alumni.video_source || 'youtube',
                video_url: alumni.video_url || '',
                video_file: null,
                is_featured: !!alumni.is_featured,
                is_published: !!alumni.is_published,
                sort_order: alumni.sort_order || 0
            });
        }
        else { setEditMode(false); setCurrentId(null); reset(); }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            transform((data) => ({
                ...data,
                _method: 'PUT',
            }));
            post(route('admin.alumni.update', currentId), {
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    toast.success('Data alumni berhasil diperbarui');
                },
            });
        } else {
            transform((data) => data); // Reset transform or ensure no _method for create
            post(route('admin.alumni.store'), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Alumni baru berhasil ditambahkan');
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Hapus data ini?')) {
            destroy(route('admin.alumni.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Data alumni berhasil dihapus')
            });
        }
    };

    return (
        <ContentManagementPage 
            headerTitle="Kelola Alumni" 
            headTitle="Jejak Alumni" 
            tabs={tabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            noForm={true}
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header with Add Button */}
                <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h3 className="font-bold text-gray-900 text-lg">Daftar Alumni</h3>
                    <PrimaryButton type="button" onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 flex items-center gap-2 px-4 py-2 text-sm font-medium w-full sm:w-auto justify-center">
                        <Plus size={18} />Tambah Alumni
                    </PrimaryButton>
                </div>
                {alumnis.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Alumni</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Angkatan</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Featured</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {alumnis.map((alumni) => (
                                    <tr key={alumni.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">
                                                    {alumni.avatarsImage?.original_url || alumni.image_url ? (
                                                        <img
                                                            src={alumni.avatarsImage?.original_url || getImageUrl(alumni.image_url)}
                                                            alt={alumni.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={18} /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-gray-900 text-sm">{alumni.name}</p>
                                                        {alumni.content_type === 'video' && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                                <Video size={10} /> {alumni.video_source === 'youtube' ? 'YouTube' : 'Upload'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap"><span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-accent-yellow/10 text-accent-yellow">{alumni.graduation_year}</span></td>
                                        <td className="px-4 py-3 text-center">{alumni.is_featured ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><Star size={12} fill="currentColor" /> Ya</span> : <span className="text-gray-300">-</span>}</td>
                                        <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1"><button onClick={() => openModal(alumni)} className="p-2 !text-accent-yellow hover:bg-accent-yellow/10 rounded-lg"><Edit2 size={16} /></button><button onClick={() => handleDelete(alumni.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 sm:p-12 text-center"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><User size={24} className="sm:w-8 sm:h-8 text-gray-400" /></div><p className="text-gray-500 font-medium mb-4 text-sm sm:text-base">Belum ada alumni</p><PrimaryButton onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 text-sm sm:text-base px-4 py-2">Tambah Alumni</PrimaryButton></div>
                )}
            </div>
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10"><h3 className="text-lg sm:text-xl font-bold text-gray-900">{editMode ? 'Edit Alumni' : 'Tambah Alumni'}</h3><button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><X size={20} /></button></div>
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                        {/* Section 1: Tipe Konten */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                                    Tipe Konten
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Pilih format testimoni alumni</p>
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="content_type"
                                        value="text"
                                        checked={data.content_type === 'text'}
                                        onChange={(e) => setData(d => ({ ...d, content_type: 'text', is_featured: false }))}
                                        className="w-4 h-4 text-accent-yellow focus:ring-accent-yellow"
                                    />
                                    <FileText size={16} className="text-gray-500" />
                                    <span className="text-sm text-gray-700">Testimoni (Teks)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="content_type"
                                        value="video"
                                        checked={data.content_type === 'video'}
                                        onChange={(e) => setData(d => ({ ...d, content_type: 'video', is_featured: true }))}
                                        className="w-4 h-4 text-accent-yellow focus:ring-accent-yellow"
                                    />
                                    <Video size={16} className="text-red-500" />
                                    <span className="text-sm text-gray-700">Video (Featured)</span>
                                </label>
                            </div>
                            <p className="text-sm text-gray-500">Video otomatis ditampilkan sebagai featured</p>
                        </div>

                        {/* Section 2: Data Alumni */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                                    Data Alumni
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Informasi identitas alumni</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="name" value="Nama" />
                                    <TextInput id="name" type="text" className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="Nama..." />
                                    <p className="text-sm text-gray-500 mt-1">Nama lengkap alumni</p>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="graduation_year" value="Tahun Lulus" />
                                    <TextInput id="graduation_year" type="number" className="mt-1 block w-full" value={data.graduation_year} onChange={(e) => setData('graduation_year', e.target.value)} />
                                    <p className="text-sm text-gray-500 mt-1">Angkatan kelulusan</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Konten Testimoni */}
                        {data.content_type === 'text' ? (
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                                <div className="border-b pb-3">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                                        Testimoni
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Cerita dan pengalaman alumni</p>
                                </div>
                                <div>
                                    <InputLabel htmlFor="testimonial" value="Testimoni" />
                                    <textarea id="testimonial" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" rows="3" value={data.testimonial} onChange={(e) => setData('testimonial', e.target.value)} required placeholder="Cerita alumni..."></textarea>
                                    <p className="text-sm text-gray-500 mt-1">Cerita singkat dari alumni</p>
                                    <InputError message={errors.testimonial} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="image" value="Foto Profil" />
                                    <FileUploadField
                                        id="image"
                                        label="Upload Foto"
                                        onChange={(file) => setData('image', file)}
                                        previewUrl={getImageUrl(data.image_url)}
                                        error={errors.image}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                                <div className="border-b pb-3">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                                        Video Testimoni
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Upload video atau masukkan link YouTube</p>
                                </div>
                                <div>
                                    <InputLabel value="Sumber Video" />
                                    <div className="mt-2 flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100">
                                            <input
                                                type="radio"
                                                name="video_source"
                                                value="youtube"
                                                checked={data.video_source === 'youtube'}
                                                onChange={(e) => setData('video_source', e.target.value)}
                                                className="w-4 h-4 text-accent-yellow focus:ring-accent-yellow"
                                            />
                                            <span className="text-sm text-gray-700">YouTube</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100">
                                            <input
                                                type="radio"
                                                name="video_source"
                                                value="upload"
                                                checked={data.video_source === 'upload'}
                                                onChange={(e) => setData('video_source', e.target.value)}
                                                className="w-4 h-4 text-accent-yellow focus:ring-accent-yellow"
                                            />
                                            <span className="text-sm text-gray-700">Upload File</span>
                                        </label>
                                    </div>
                                </div>

                                {data.video_source === 'youtube' ? (
                                    <div>
                                        <InputLabel htmlFor="video_url" value="URL Video YouTube" />
                                        <TextInput
                                            id="video_url"
                                            type="url"
                                            className="mt-1 block w-full"
                                            value={data.video_url}
                                            onChange={(e) => setData('video_url', e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Salin link video dari YouTube</p>
                                        <InputError message={errors.video_url} className="mt-2" />
                                    </div>
                                ) : (
                                    <div>
                                        <InputLabel htmlFor="video_file" value="File Video" />
                                        <FileUploadField
                                            id="video_file"
                                            label="Upload Video"
                                            accept="video/*"
                                            fileType="video"
                                            onChange={(file) => setData('video_file', file)}
                                            previewUrl={getImageUrl(data.video_url)}
                                            error={errors.video_file}
                                            description="Format: MP4, WebM. Maksimal 50MB."
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Section 4: Pengaturan */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                                    Pengaturan
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Status publikasi</p>
                            </div>
                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" id="is_published" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-yellow focus:ring-accent-yellow" />
                                    <span className="text-sm text-gray-700">Publish</span>
                                </label>
                            </div>
                            <p className="text-sm text-gray-500">Centang untuk menampilkan di website</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">Batal</button>
                            <PrimaryButton type="submit" disabled={processing} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 px-5 py-2">{processing ? '...' : (editMode ? 'Simpan' : 'Tambah')}</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </ContentManagementPage>
    );
}
