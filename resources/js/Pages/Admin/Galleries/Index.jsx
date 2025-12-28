// FILE: resources/js/Pages/Admin\Galleries\Index.jsx
// Fully responsive galleries management page with accent color theme

import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Video, Star } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import Modal from '@/Components/Modal';

export default function Index({ galleries }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        title: '', description: '', type: 'photo', file: null, url: '', is_external: false, category: '', date: new Date().toISOString().split('T')[0], is_featured: true,
    });

    const tabs = [{ key: 'list', label: 'Galeri Foto & Video', description: 'Kelola dokumentasi visual.', icon: ImageIcon }];

    const openModal = (gallery = null) => {
        if (gallery) {
            setEditMode(true); setCurrentId(gallery.id);
            setData({ title: gallery.title || '', description: gallery.description || '', type: gallery.type || 'photo', file: null, url: gallery.url || '', is_external: !!gallery.is_external, category: gallery.category || '', date: gallery.date || new Date().toISOString().split('T')[0], is_featured: !!gallery.is_featured });
        } else { setEditMode(false); setCurrentId(null); reset(); }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) { post(route('admin.galleries.update', currentId), { forceFormData: true, onSuccess: () => closeModal(), _method: 'PUT' }); }
        else { post(route('admin.galleries.store'), { onSuccess: () => closeModal() }); }
    };

    const handleDelete = (id) => { if (confirm('Hapus item ini?')) destroy(route('admin.galleries.destroy', id)); };

    return (
        <ContentManagementPage headerTitle="Kelola Galeri" headTitle="Galeri Sekolah" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} onSave={() => openModal()}
            extraHeader={<div className="flex justify-end"><PrimaryButton onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 flex items-center gap-2 px-4 py-2 text-sm sm:text-base"><Plus size={18} />Tambah Item</PrimaryButton></div>}>
            {success && <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"><div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div><p className="text-green-800 text-sm font-medium">{success}</p></div>}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                {galleries.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {galleries.map((item) => (
                            <div key={item.id} className="group bg-white border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="aspect-square bg-gray-100 relative">
                                    {item.type === 'photo' ? <img src={item.url} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white"><Video size={24} className="sm:w-8 sm:h-8" /></div>}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button onClick={() => openModal(item)} className="p-2 bg-white/90 rounded-full text-accent-yellow hover:bg-white"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 rounded-full text-red-600 hover:bg-white"><Trash2 size={16} /></button>
                                    </div>
                                    {item.is_featured && <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-[10px] sm:text-xs font-bold rounded flex items-center gap-1"><Star size={10} className="sm:size-3" /> Featured</div>}
                                    {item.type === 'video' && <div className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-[10px] sm:text-xs font-bold rounded">Video</div>}
                                </div>
                                <div className="p-2 sm:p-3"><h4 className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{item.title}</h4><div className="flex justify-between items-center mt-1"><span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.category || '-'}</span><span className="text-[10px] sm:text-xs text-gray-400">{item.date}</span></div></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 sm:p-12 text-center"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><ImageIcon size={24} className="sm:w-8 sm:h-8 text-gray-400" /></div><p className="text-gray-500 font-medium mb-4 text-sm sm:text-base">Belum ada item</p><PrimaryButton onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 text-sm sm:text-base px-4 py-2">Tambah Item</PrimaryButton></div>
                )}
            </div>
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10"><h3 className="text-lg sm:text-xl font-bold text-gray-900">{editMode ? 'Edit Item' : 'Tambah Item'}</h3><button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><X size={20} /></button></div>
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><InputLabel htmlFor="title" value="Judul" /><TextInput id="title" type="text" className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} required placeholder="Judul..." /><InputError message={errors.title} className="mt-2" /></div><div><InputLabel htmlFor="type" value="Tipe" /><select id="type" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" value={data.type} onChange={(e) => setData('type', e.target.value)}><option value="photo">Foto</option><option value="video">Video</option></select></div></div>
                        <div><InputLabel htmlFor="description" value="Deskripsi (Opsional)" /><textarea id="description" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" rows="2" value={data.description} onChange={(e) => setData('description', e.target.value)}></textarea></div>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3"><label className="flex items-center gap-2"><input type="checkbox" id="is_external" checked={data.is_external} onChange={(e) => setData('is_external', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-yellow focus:ring-accent-yellow" /><span className="text-sm font-medium">URL Eksternal</span></label>{data.is_external ? <div><InputLabel htmlFor="url" value="URL" /><TextInput id="url" type="url" className="mt-1 block w-full" value={data.url} onChange={(e) => setData('url', e.target.value)} placeholder="https://..." /><InputError message={errors.url} className="mt-2" /></div> : <FileUploadField id="gallery_file" label="Upload File" previewUrl={data.url && !data.file ? data.url : (data.file ? URL.createObjectURL(data.file) : '')} onChange={(file) => setData('file', file)} error={errors.file} />}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><InputLabel htmlFor="category" value="Kategori" /><TextInput id="category" type="text" className="mt-1 block w-full" value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="Kategori..." /></div><div><InputLabel htmlFor="date" value="Tanggal" /><TextInput id="date" type="date" className="mt-1 block w-full" value={data.date} onChange={(e) => setData('date', e.target.value)} /></div></div>
                        <label className="flex items-center gap-2"><input type="checkbox" id="is_featured_gallery" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-yellow focus:ring-accent-yellow" /><span className="text-sm text-gray-700">Featured</span></label>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200"><button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">Batal</button><PrimaryButton type="submit" disabled={processing} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500">{processing ? '...' : (editMode ? 'Simpan' : 'Tambah')}</PrimaryButton></div>
                    </form>
                </div>
            </Modal>
        </ContentManagementPage>
    );
}
