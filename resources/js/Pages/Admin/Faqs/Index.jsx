import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus, Edit2, Trash2, X, HelpCircle } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';

export default function Index({ faqs }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        question: '',
        answer: '',
        category: '',
        is_published: true,
        sort_order: 0,
    });

    const tabs = [
        { key: 'list', label: 'Daftar FAQ', description: 'Kelola pertanyaan yang sering diajukan oleh pengunjung.', icon: HelpCircle },
    ];

    const openModal = (faq = null) => {
        if (faq) {
            setEditMode(true);
            setCurrentId(faq.id);
            setData({
                question: faq.question || '',
                answer: faq.answer || '',
                category: faq.category || '',
                is_published: !!faq.is_published,
                sort_order: faq.sort_order || 0,
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
            put(route('admin.faqs.update', currentId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.faqs.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
            destroy(route('admin.faqs.destroy', id));
        }
    };

    return (
        <ContentManagementPage
            headerTitle="Kelola FAQ"
            headTitle="Kelola FAQ"
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
                        Tambah FAQ
                    </PrimaryButton>
                </div>
            }
        >
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-blue-50 px-2 py-0.5 rounded">
                                            {faq.category || 'Umum'}
                                        </span>
                                        {!faq.is_published && (
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">{faq.question}</h3>
                                    <p className="text-gray-600 mt-2 text-sm line-clamp-2">{faq.answer}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => openModal(faq)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(faq.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {faqs.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <HelpCircle size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Belum ada FAQ yang ditambahkan.</p>
                        </div>
                    )}
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
                                            {editMode ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                                        </h3>
                                        <button 
                                            type="button"
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="category" value="Kategori" />
                                            <TextInput
                                                id="category"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                placeholder="e.g. Pendaftaran, Akademik, Umum"
                                            />
                                            <InputError message={errors.category} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="question" value="Pertanyaan" />
                                            <TextInput
                                                id="question"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.question}
                                                onChange={(e) => setData('question', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.question} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="answer" value="Jawaban" />
                                            <textarea
                                                id="answer"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                rows="6"
                                                value={data.answer}
                                                onChange={(e) => setData('answer', e.target.value)}
                                                required
                                            ></textarea>
                                            <InputError message={errors.answer} className="mt-2" />
                                        </div>

                                        <div className="flex items-center gap-6">
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
                                            <label className="flex items-center mt-6">
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
                                        {editMode ? 'Simpan Perubahan' : 'Tambah FAQ'}
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
