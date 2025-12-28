import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FileUploadField from '@/Components/Admin/FileUploadField';
import MiniTextEditor from '@/Components/MiniTextEditor';
import { Plus, Edit2, Trash2, Newspaper, X, Eye } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';

export default function Index({ posts }) {
    const { success } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        category: 'Berita',
        content: '',
        excerpt: '',
        featured_image: null,
        featured_image_url: '',
        status: 'published',
    });

    const tabs = [
        { key: 'list', label: 'Berita & Pengumuman', description: 'Kelola publikasi berita, pengumuman, dan artikel sekolah.', icon: Newspaper },
    ];

    const openModal = (postItem = null) => {
        if (postItem) {
            setEditMode(true);
            setCurrentId(postItem.id);
            setData({
                title: postItem.title || '',
                category: postItem.category || 'Berita',
                content: postItem.content || '',
                excerpt: postItem.excerpt || '',
                featured_image: null,
                featured_image_url: postItem.featured_image || '',
                status: postItem.status || 'published',
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
            post(route('admin.posts.update', currentId), {
                forceFormData: true,
                onSuccess: () => closeModal(),
                _method: 'PUT'
            });
        } else {
            post(route('admin.posts.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            destroy(route('admin.posts.destroy', id));
        }
    };

    return (
        <ContentManagementPage
            headerTitle="Kelola Berita & Pengumuman"
            headTitle="Kelola Berita"
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
                        Tulis Berita
                    </PrimaryButton>
                </div>
            }
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                                    {posts.map((postItem) => (
                                        <tr key={postItem.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-12 w-20 rounded overflow-hidden bg-gray-100">
                                                    {postItem.featured_image ? (
                                                        <img src={postItem.featured_image} alt={postItem.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <Newspaper className="text-gray-400 w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 line-clamp-1">{postItem.title}</div>
                                                <div className="text-xs text-gray-500">{postItem.slug}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {postItem.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(postItem.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={`/berita/${postItem.slug}`} target="_blank" className="text-gray-600 hover:text-gray-900 mr-3">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => openModal(postItem)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(postItem.id)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editMode ? 'Edit Berita' : 'Tulis Berita Baru'}
                                        </h3>
                                        <button type="button" onClick={closeModal}>
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="title" value="Judul Berita" />
                                                <TextInput
                                                    id="title"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.title} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="category" value="Kategori" />
                                                <select
                                                    id="category"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.category}
                                                    onChange={(e) => setData('category', e.target.value)}
                                                    required
                                                >
                                                    <option value="Berita">Berita</option>
                                                    <option value="Pengumuman">Pengumuman</option>
                                                    <option value="Prestasi">Prestasi</option>
                                                    <option value="Akademik">Akademik</option>
                                                    <option value="Kegiatan">Kegiatan</option>
                                                    <option value="Alumni">Alumni</option>
                                                </select>
                                                <InputError message={errors.category} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="excerpt" value="Ringkasan (Excerpt)" />
                                                <textarea
                                                    id="excerpt"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    rows="3"
                                                    value={data.excerpt}
                                                    onChange={(e) => setData('excerpt', e.target.value)}
                                                    required
                                                ></textarea>
                                                <InputError message={errors.excerpt} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="featured_image" value="Gambar Utama" />
                                                <FileUploadField
                                                    id="featured_image"
                                                    onChange={(file) => setData('featured_image', file)}
                                                    previewUrl={data.featured_image_url}
                                                    label="Upload Gambar"
                                                />
                                                <InputError message={errors.featured_image} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="content" value="Konten Berita" />
                                                <MiniTextEditor
                                                    value={data.content}
                                                    onChange={(val) => setData('content', val)}
                                                />
                                                <InputError message={errors.content} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <PrimaryButton
                                        type="submit"
                                        className="sm:ml-3"
                                        disabled={processing}
                                    >
                                        {editMode ? 'Simpan Perubahan' : 'Publikasikan'}
                                    </PrimaryButton>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={closeModal}
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
