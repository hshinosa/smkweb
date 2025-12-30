// FILE: resources/js/Pages/Admin\Posts/Index.jsx
// Fully responsive posts management page with accent color theme

import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import MiniTextEditor from '@/Components/MiniTextEditor';
import { Plus, Edit2, Trash2, X, Eye, Newspaper, ExternalLink } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import Modal from '@/Components/Modal';

export default function Index({ posts }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        title: '', category: 'Berita', content: '', excerpt: '', featured_image: null, featured_image_url: '', status: 'published',
    });

    const tabs = [{ key: 'list', label: 'Berita & Pengumuman', description: 'Kelola konten berita.', icon: Newspaper }];

    const openModal = (postItem = null) => {
        if (postItem) { setEditMode(true); setCurrentId(postItem.id); setData({ title: postItem.title || '', category: postItem.category || 'Berita', content: postItem.content || '', excerpt: postItem.excerpt || '', featured_image: null, featured_image_url: postItem.featured_image || '', status: postItem.status || 'published' }); }
        else { setEditMode(false); setCurrentId(null); reset(); }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) { post(route('admin.posts.update', currentId), { forceFormData: true, onSuccess: () => closeModal(), _method: 'PUT' }); }
        else { post(route('admin.posts.store'), { onSuccess: () => closeModal() }); }
    };

    const handleDelete = (id) => { 
        if (confirm('Hapus berita ini?')) {
            destroy(route('admin.posts.destroy', id), { preserveScroll: true }); 
        }
    };

    return (
        <ContentManagementPage 
            headerTitle="Kelola Berita" 
            headTitle="Berita & Pengumuman" 
            tabs={tabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            noForm={true}
            extraHeader={<div className="flex justify-end"><PrimaryButton type="button" onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 flex items-center gap-2 px-4 py-2 text-sm sm:text-base"><Plus size={18} />Tulis Berita</PrimaryButton></div>}
        >
            {success && <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"><div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div><p className="text-green-800 text-sm font-medium">{success}</p></div>}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {posts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gambar</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Judul</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Kategori</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {posts.map((postItem) => (
                                    <tr key={postItem.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap"><div className="h-12 w-16 rounded-lg overflow-hidden bg-gray-100">{postItem.featured_image ? <img src={postItem.featured_image} alt={postItem.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Newspaper className="text-gray-400 w-6 h-6" /></div>}</div></td>
                                        <td className="px-4 py-3"><p className="font-semibold text-gray-900 text-sm truncate max-w-[120px] sm:max-w-none">{postItem.title}</p><p className="text-xs text-gray-500 font-mono hidden sm:block">{postItem.slug}</p></td>
                                        <td className="px-4 py-3 hidden md:table-cell"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{postItem.category}</span></td>
                                        <td className="px-4 py-3"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${postItem.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{postItem.status === 'published' ? 'Publis' : 'Draft'}</span></td>
                                        <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1"><Link href={`/berita/${postItem.slug}`} target="_blank" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><ExternalLink size={16} /></Link><button onClick={() => openModal(postItem)} className="p-2 !text-accent-yellow hover:bg-accent-yellow/10 rounded-lg"><Edit2 size={16} /></button><button onClick={() => handleDelete(postItem.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 sm:p-12 text-center"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><Newspaper size={24} className="sm:w-8 sm:h-8 text-gray-400" /></div><p className="text-gray-500 font-medium mb-4 text-sm sm:text-base">Belum ada berita</p><PrimaryButton onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 text-sm sm:text-base px-4 py-2">Tulis Berita</PrimaryButton></div>
                )}
            </div>
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="4xl">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-4xl w-full mx-auto max-h-[95vh] overflow-y-auto">
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10"><div><h3 className="text-lg sm:text-xl font-bold text-gray-900">{editMode ? 'Edit Berita' : 'Berita Baru'}</h3><p className="text-xs sm:text-sm text-gray-500 mt-0.5">{editMode ? 'Perbarui' : 'Buat baru'}</p></div><button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><X size={20} /></button></div>
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div><InputLabel htmlFor="title" value="Judul" /><TextInput id="title" type="text" className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} required placeholder="Judul..." /><InputError message={errors.title} className="mt-2" /></div>
                                <div className="grid grid-cols-2 gap-3"><div><InputLabel htmlFor="category" value="Kategori" /><select id="category" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" value={data.category} onChange={(e) => setData('category', e.target.value)}><option value="Berita">Berita</option><option value="Pengumuman">Pengumuman</option><option value="Prestasi">Prestasi</option><option value="Akademik">Akademik</option><option value="Kegiatan">Kegiatan</option></select></div><div><InputLabel htmlFor="status" value="Status" /><select id="status" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" value={data.status} onChange={(e) => setData('status', e.target.value)}><option value="published">Publis</option><option value="draft">Draft</option></select></div></div>
                                <div><InputLabel htmlFor="excerpt" value="Ringkasan" /><textarea id="excerpt" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" rows="3" value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} required></textarea><InputError message={errors.excerpt} className="mt-2" /></div>
                                <div><InputLabel htmlFor="featured_image" value="Gambar Utama" /><FileUploadField id="featured_image" onChange={(file) => setData('featured_image', file)} previewUrl={data.featured_image_url} label="Upload" /></div>
                            </div>
                            <div><InputLabel htmlFor="content" value="Konten" /><MiniTextEditor value={data.content} onChange={(val) => setData('content', val)} /><InputError message={errors.content} className="mt-2" /></div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-200"><button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">Batal</button><PrimaryButton type="submit" disabled={processing} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 px-5 py-2">{processing ? '...' : (editMode ? 'Simpan' : 'Publikasikan')}</PrimaryButton></div>
                    </form>
                </div>
            </Modal>
        </ContentManagementPage>
    );
}
