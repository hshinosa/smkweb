// FILE: resources/js/Pages/Admin/Faqs/Index.jsx
// Fully responsive FAQs management page with accent color theme

import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus, Edit2, Trash2, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import Modal from '@/Components/Modal';

export default function Index({ faqs }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    const [expandedId, setExpandedId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        question: '', answer: '', category: '', is_published: true, sort_order: 0,
    });

    const tabs = [{ key: 'list', label: 'Daftar FAQ', description: 'Kelola FAQ.', icon: HelpCircle }];

    const openModal = (faq = null) => {
        if (faq) { setEditMode(true); setCurrentId(faq.id); setData({ question: faq.question || '', answer: faq.answer || '', category: faq.category || '', is_published: !!faq.is_published, sort_order: faq.sort_order || 0 }); }
        else { setEditMode(false); setCurrentId(null); reset(); }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) put(route('admin.faqs.update', currentId), { onSuccess: () => closeModal() });
        else post(route('admin.faqs.store'), { onSuccess: () => closeModal() });
    };

    const handleDelete = (id) => { if (confirm('Hapus FAQ ini?')) destroy(route('admin.faqs.destroy', id)); };

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    return (
        <ContentManagementPage headerTitle="Kelola FAQ" headTitle="FAQ" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} onSave={() => openModal()}
            extraHeader={<div className="flex justify-end"><PrimaryButton onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 flex items-center gap-2 px-4 py-2 text-sm sm:text-base"><Plus size={18} />Tambah FAQ</PrimaryButton></div>}>
            {success && <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"><div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div><p className="text-green-800 text-sm font-medium">{success}</p></div>}
            <div className="space-y-3 sm:space-y-4">
                {faqs.length > 0 ? faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button onClick={() => toggleExpand(faq.id)} className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors text-left">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider !text-accent-yellow bg-accent-yellow/10 px-2.5 py-1 rounded">{faq.category || 'Umum'}</span>
                                    {!faq.is_published && <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded">Draft</span>}
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm sm:text-lg pr-4">{faq.question}</h3>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <button onClick={(e) => { e.stopPropagation(); openModal(faq); }} className="p-2 !text-accent-yellow hover:bg-accent-yellow/10 rounded-lg"><Edit2 size={16} /></button>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                {expandedId === faq.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                            </div>
                        </button>
                        {expandedId === faq.id && <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100"><div className="pt-4"><h4 className="text-sm font-semibold text-gray-500 mb-2">Jawaban:</h4><div className="text-gray-700 leading-relaxed text-sm sm:text-base pl-3 border-l-2 !border-accent-yellow/20 rounded-r-lg">{faq.answer}</div></div></div>}
                    </div>
                )) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center"><div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><HelpCircle size={24} className="sm:w-8 sm:h-8 text-gray-400" /></div><p className="text-gray-500 font-medium mb-4 text-sm sm:text-base">Belum ada FAQ</p><PrimaryButton onClick={() => openModal()} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 text-sm sm:text-base px-4 py-2">Tambah FAQ</PrimaryButton></div>
                )}
            </div>
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10"><h3 className="text-lg sm:text-xl font-bold text-gray-900">{editMode ? 'Edit FAQ' : 'Tambah FAQ'}</h3><button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><X size={20} /></button></div>
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4"><div><InputLabel htmlFor="category" value="Kategori" /><TextInput id="category" type="text" className="mt-1 block w-full" value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="Contoh: Pendaftaran" /></div><div><InputLabel htmlFor="sort_order" value="Urutan" /><TextInput id="sort_order" type="number" className="mt-1 block w-full" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} /></div></div>
                        <div><InputLabel htmlFor="question" value="Pertanyaan" /><TextInput id="question" type="text" className="mt-1 block w-full" value={data.question} onChange={(e) => setData('question', e.target.value)} required placeholder="Pertanyaan..." /><InputError message={errors.question} className="mt-2" /></div>
                        <div><InputLabel htmlFor="answer" value="Jawaban" /><textarea id="answer" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-accent-yellow text-sm" rows="5" value={data.answer} onChange={(e) => setData('answer', e.target.value)} required placeholder="Jawaban..."></textarea><InputError message={errors.answer} className="mt-2" /></div>
                        <label className="flex items-center gap-2"><input type="checkbox" id="is_published" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-yellow focus:ring-accent-yellow" /><span className="text-sm text-gray-700">Publish</span></label>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200"><button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">Batal</button><PrimaryButton type="submit" disabled={processing} className="!bg-accent-yellow !text-gray-900 hover:!bg-yellow-500 px-5 py-2">{processing ? '...' : (editMode ? 'Simpan' : 'Tambah')}</PrimaryButton></div>
                    </form>
                </div>
            </Modal>
        </ContentManagementPage>
    );
}
