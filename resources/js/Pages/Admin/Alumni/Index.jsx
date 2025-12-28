// FILE: resources/js/Pages/Admin/Alumni/Index.jsx
// Fully responsive alumni management page with accent color theme

import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import { Plus, Edit2, Trash2, X, User, GraduationCap, Briefcase, Star } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import Modal from '@/Components/Modal';

export default function Index({ alumnis }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '', graduation_year: new Date().getFullYear(), current_position: '', education: '', testimonial: '', category: '', image: null, image_url: '', is_featured: false, is_published: true, sort_order: 0,
    });

    const tabs = [{ key: 'list', label: 'Daftar Alumni', description: 'Kelola data alumni.', icon: User }];

    const openModal = (alumni = null) => {
        if (alumni) { setEditMode(true); setCurrentId(alumni.id); setData({ name: alumni.name || '', graduation_year: alumni.graduation_year || new Date().getFullYear(), current_position: alumni.current_position || '', education: alumni.education || '', testimonial: alumni.testimonial || '', category: alumni.category || '', image: null, image_url: alumni.image_url || '', is_featured: !!alumni.is_featured, is_published: !!alumni.is_published, sort_order: alumni.sort_order || 0 }); }
        else { setEditMode(false); setCurrentId(null); reset(); }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) { post(route('admin.alumni.update', currentId), { forceFormData: true, onSuccess: () => closeModal(), _method: 'PUT' }); }
        else { post(route('admin.alumni.store'), { onSuccess: () => closeModal() }); }
    };

    const handleDelete = (id) => { if (confirm('Hapus data ini?')) destroy(route('admin.alumni.destroy', id)); };

    return (
        <ContentManagementPage headerTitle="Kelola Alumni" headTitle="Jejak Alumni" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} onSave={() => openModal()}
            extraHeader={<div className="flex justify-end"><PrimaryButton onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 flex items-center gap-2 px-4 py-2 text-sm sm:text-base"><Plus size={18} />Tambah Alumni</PrimaryButton></div>}>
            {success && <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"><div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div><p className="text-green-800 text-sm font-medium">{success}</p></div>}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {alumnis.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Alumni</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Angkatan</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Posisi/Pendidikan</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Featured</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {alumnis.map((alumni) => (
                                    <tr key={alumni.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">{alumni.image_url ? <img src={`/storage/${alumni.image_url}`} alt={alumni.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={18} /></div>}</div>
                                                <div><p className="font-semibold text-gray-900 text-sm">{alumni.name}</p><p className="text-xs text-gray-500">{alumni.category}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap"><span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-accent-yellow/10 text-accent-yellow">{alumni.graduation_year}</span></td>
                                        <td className="px-4 py-3 hidden md:table-cell"><div className="space-y-1"><div className="flex items-center gap-1.5 text-sm"><Briefcase size={14} className="text-gray-400" /><span className="text-gray-700">{alumni.current_position || '-'}</span></div><div className="flex items-center gap-1.5 text-xs"><GraduationCap size={12} className="text-gray-400" /><span className="text-gray-500">{alumni.education || '-'}</span></div></div></td>
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
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4"><div><InputLabel htmlFor="name" value="Nama" /><TextInput id="name" type="text" className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="Nama..." /><InputError message={errors.name} className="mt-2" /></div><div><InputLabel htmlFor="graduation_year" value="Tahun Lulus" /><TextInput id="graduation_year" type="number" className="mt-1 block w-full" value={data.graduation_year} onChange={(e) => setData('graduation_year', e.target.value)} /></div></div>
                        <div className="grid grid-cols-2 gap-4"><div><InputLabel htmlFor="category" value="Bidang" /><TextInput id="category" type="text" className="mt-1 block w-full" value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="Contoh: Kedokteran" /></div><div><InputLabel htmlFor="current_position" value="Pekerjaan" /><TextInput id="current_position" type="text" className="mt-1 block w-full" value={data.current_position} onChange={(e) => setData('current_position', e.target.value)} placeholder="Pekerjaan saat ini" /></div></div>
                        <div><InputLabel htmlFor="education" value="Pendidikan" /><TextInput id="education" type="text" className="mt-1 block w-full" value={data.education} onChange={(e) => setData('education', e.target.value)} placeholder="Pendidikan terakhir" /></div>
                        <div><InputLabel htmlFor="testimonial" value="Testimoni" /><textarea id="testimonial" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" rows="3" value={data.testimonial} onChange={(e) => setData('testimonial', e.target.value)} required placeholder="Cerita alumni..."></textarea><InputError message={errors.testimonial} className="mt-2" /></div>
                        <div><InputLabel htmlFor="image" value="Foto" /><FileUploadField label="Upload Foto" onChange={(file) => setData('image', file)} previewUrl={data.image_url ? `/storage/${data.image_url}` : null} error={errors.image} /></div>
                        <div className="flex flex-wrap gap-4 sm:gap-6"><label className="flex items-center gap-2"><input type="checkbox" id="is_featured" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-yellow focus:ring-accent-yellow" /><span className="text-sm text-gray-700">Featured</span></label><label className="flex items-center gap-2"><input type="checkbox" id="is_published" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-yellow focus:ring-accent-yellow" /><span className="text-sm text-gray-700">Publish</span></label></div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200"><button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">Batal</button><PrimaryButton type="submit" disabled={processing} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 px-5 py-2">{processing ? '...' : (editMode ? 'Simpan' : 'Tambah')}</PrimaryButton></div>
                    </form>
                </div>
            </Modal>
        </ContentManagementPage>
    );
}
