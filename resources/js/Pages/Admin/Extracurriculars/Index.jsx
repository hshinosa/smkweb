// FILE: resources/js/Pages/Admin/Extracurriculars/Index.jsx
// Fully responsive extracurriculars management page with accent color theme

import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import { Plus, Edit2, Trash2, X, Star, Clock } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import Modal from '@/Components/Modal';
import toast from 'react-hot-toast';

export default function Index({ extracurriculars }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        name: '', category: 'Olahraga', description: '', image: null, image_url: '', schedule: '', is_active: true,
    });

    const tabs = [{ key: 'list', label: 'Daftar Ekskul', description: 'Kelola ekstrakurikuler.', icon: Star }];
    const categories = ['Olahraga', 'Seni & Budaya', 'Akademik & Sains', 'Keagamaan & Sosial', 'Organisasi & Kepemimpinan', 'Teknologi & Inovasi'];

    const openModal = (item = null) => {
        if (item) { setEditMode(true); setCurrentId(item.id); setData({ name: item.name || '', category: item.category || 'Olahraga', description: item.description || '', image: null, image_url: item.image_url || '', schedule: item.schedule || '', is_active: !!item.is_active }); }
        else { setEditMode(false); setCurrentId(null); reset(); }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            post(route('admin.extracurriculars.update', currentId), {
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    toast.success('Ekskul berhasil diperbarui');
                },
                _method: 'PUT'
            });
        } else {
            post(route('admin.extracurriculars.store'), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Ekskul baru berhasil ditambahkan');
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Hapus ekskul ini?')) {
            destroy(route('admin.extracurriculars.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Ekskul berhasil dihapus')
            });
        }
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('/')) return url;
        return `/storage/${url}`;
    };

    const getCategoryColor = (cat) => {
        const colors = { 'Olahraga': 'bg-green-100 text-green-700', 'Seni & Budaya': 'bg-purple-100 text-purple-700', 'Akademik & Sains': 'bg-blue-100 text-blue-700', 'Keagamaan & Sosial': 'bg-yellow-100 text-yellow-700', 'Organisasi & Kepemimpinan': 'bg-red-100 text-red-700', 'Teknologi & Inovasi': 'bg-cyan-100 text-cyan-700' };
        return colors[cat] || 'bg-gray-100 text-gray-700';
    };

    return (
        <ContentManagementPage 
            headerTitle="Kelola Ekskul" 
            headTitle="Ekstrakurikuler" 
            tabs={tabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            noForm={true}
            extraHeader={<div className="flex justify-end"><PrimaryButton type="button" onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 flex items-center gap-2 px-4 py-2 text-sm sm:text-base"><Plus size={18} />Tambah Ekskul</PrimaryButton></div>}
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {extracurriculars.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gambar</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Kategori</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {extracurriculars.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap"><div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">{item.image_url ? <img src={getImageUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Star className="text-gray-400 w-6 h-6" /></div>}</div></td>
                                        <td className="px-4 py-3"><p className="font-semibold text-gray-900 text-sm">{item.name}</p>{item.description && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 hidden sm:block">{item.description}</p>}</td>
                                        <td className="px-4 py-3 hidden sm:table-cell"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>{item.category}</span></td>
                                        <td className="px-4 py-3"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                        <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1"><button onClick={() => openModal(item)} className="p-2 !text-accent-yellow hover:bg-accent-yellow/10 rounded-lg"><Edit2 size={16} /></button><button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 sm:p-12 text-center"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><Star size={24} className="sm:w-8 sm:h-8 text-gray-400" /></div><p className="text-gray-500 font-medium mb-4 text-sm sm:text-base">Belum ada ekskul</p><PrimaryButton onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 text-sm sm:text-base px-4 py-2">Tambah Ekskul</PrimaryButton></div>
                )}
            </div>
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10"><h3 className="text-lg sm:text-xl font-bold text-gray-900">{editMode ? 'Edit Ekskul' : 'Tambah Ekskul'}</h3><button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><X size={20} /></button></div>
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><InputLabel htmlFor="name" value="Nama Ekskul" /><TextInput id="name" type="text" className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="Nama..." /><InputError message={errors.name} className="mt-2" /></div>
                            <div><InputLabel htmlFor="category" value="Kategori" /><select id="category" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" value={data.category} onChange={(e) => setData('category', e.target.value)}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        </div>
                        <div><InputLabel htmlFor="schedule" value="Jadwal" /><TextInput id="schedule" type="text" className="mt-1 block w-full" value={data.schedule} onChange={(e) => setData('schedule', e.target.value)} placeholder="Contoh: Senin & Kamis, 15:30" /></div>
                        <div><InputLabel htmlFor="description" value="Deskripsi" /><textarea id="description" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" rows="3" value={data.description} onChange={(e) => setData('description', e.target.value)} required></textarea><InputError message={errors.description} className="mt-2" /></div>
                        <div><InputLabel htmlFor="image" value="Gambar" /><FileUploadField id="image" onChange={(file) => setData('image', file)} previewUrl={data.image_url} label="Upload" /></div>
                        <label className="flex items-center gap-2"><input type="checkbox" id="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-yellow focus:ring-accent-yellow" /><span className="text-sm text-gray-700">Aktif</span></label>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200"><button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">Batal</button><PrimaryButton type="submit" disabled={processing} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500">{processing ? '...' : (editMode ? 'Simpan' : 'Tambah')}</PrimaryButton></div>
                    </form>
                </div>
            </Modal>
        </ContentManagementPage>
    );
}
