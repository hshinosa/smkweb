import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Trash2, 
    BookOpen, 
    Award, 
    Target,
    Info
} from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import FileUploadField from '@/Components/Admin/FileUploadField';
import toast from 'react-hot-toast';

export default function Index({ auth, settings = {} }) {
    const [activeTab, setActiveTab] = useState('intro');


    // Form for Intro & Fases
    const introForm = useForm({
        section: 'intro_fases',
        intro_title: settings?.intro?.title || '',
        intro_description: settings?.intro?.description || '',
        fase_e_title: settings?.fase_e?.title || '',
        fase_e_description: settings?.fase_e?.description || '',
        fase_e_points: settings?.fase_e?.points || [],
        fase_e_image: null,
        fase_e_image_url: settings?.fase_e?.image || '',
        fase_f_title: settings?.fase_f?.title || '',
        fase_f_description: settings?.fase_f?.description || '',
        fase_f_points: settings?.fase_f?.points || [],
        fase_f_image: null,
        fase_f_image_url: settings?.fase_f?.image || '',
    });

    // Form for Grading System
    const gradingForm = useForm({
        section: 'grading_system',
        title: settings?.grading_system?.title || '',
        description: settings?.grading_system?.description || '',
        scales: settings?.grading_system?.scales || [],
    });

    // Form for Learning Goals
    const goalsForm = useForm({
        section: 'learning_goals',
        title: settings?.learning_goals?.title || '',
        goals: settings?.learning_goals?.goals || [],
    });

    // Form for Metode Pembelajaran
    const metodeForm = useForm({
        section: 'metode',
        title: settings?.metode?.title || '',
        items: settings?.metode?.items || [],
    });

    const tabs = [
        { key: 'intro', label: 'Intro & Fases', description: 'Kelola pendahuluan kurikulum dan fase belajar (E & F).', icon: BookOpen },
        { key: 'grading', label: 'Sistem Penilaian', description: 'Atur skala nilai dan predikat hasil belajar.', icon: Award },
        { key: 'goals', label: 'Tujuan Belajar', description: 'Daftar tujuan utama pembelajaran di sekolah.', icon: Target },
        { key: 'metode', label: 'Metode Belajar', description: 'Kelola metode pembelajaran yang diterapkan.', icon: Info },
    ];

    const activeForm = activeTab === 'intro' ? introForm : (activeTab === 'grading' ? gradingForm : (activeTab === 'goals' ? goalsForm : metodeForm));

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleIntroSubmit = (e) => {
        if (e) e.preventDefault();
        introForm.post(route('admin.curriculum.update'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Intro & Fase berhasil disimpan!');
            },
            onError: () => {
                toast.error('Gagal menyimpan Intro & Fase.');
            }
        });
    };

    const handleGradingSubmit = (e) => {
        if (e) e.preventDefault();
        gradingForm.post(route('admin.curriculum.update'), {
            onSuccess: () => {
                toast.success('Sistem Penilaian berhasil disimpan!');
            },
            onError: () => {
                toast.error('Gagal menyimpan Sistem Penilaian.');
            }
        });
    };

    const handleGoalsSubmit = (e) => {
        if (e) e.preventDefault();
        goalsForm.post(route('admin.curriculum.update'), {
            onSuccess: () => {
                toast.success('Tujuan Belajar berhasil disimpan!');
            },
            onError: () => {
                toast.error('Gagal menyimpan Tujuan Belajar.');
            }
        });
    };

    const handleMetodeSubmit = (e) => {
        if (e) e.preventDefault();
        metodeForm.post(route('admin.curriculum.update'), {
            onSuccess: () => {
                toast.success('Metode Pembelajaran berhasil disimpan!');
            },
            onError: () => {
                toast.error('Gagal menyimpan Metode Pembelajaran.');
            }
        });
    };

    const handleSave = (e) => {
        if (activeTab === 'intro') handleIntroSubmit(e);
        else if (activeTab === 'grading') handleGradingSubmit(e);
        else if (activeTab === 'goals') handleGoalsSubmit(e);
        else if (activeTab === 'metode') handleMetodeSubmit(e);
    };

    const addPoint = (form, field, value = '') => {
        const current = [...form.data[field]];
        current.push(value);
        form.setData(field, current);
    };

    const removePoint = (form, field, index) => {
        const current = [...form.data[field]];
        current.splice(index, 1);
        form.setData(field, current);
    };

    const updatePoint = (form, field, index, value) => {
        const current = [...form.data[field]];
        current[index] = value;
        form.setData(field, current);
    };

    const addScale = () => {
        const current = [...gradingForm.data.scales];
        current.push({ label: '', sub: '', range: '' });
        gradingForm.setData('scales', current);
    };

    const removeScale = (index) => {
        const current = [...gradingForm.data.scales];
        current.splice(index, 1);
        gradingForm.setData('scales', current);
    };

    const updateScale = (index, field, value) => {
        const current = [...gradingForm.data.scales];
        current[index][field] = value;
        gradingForm.setData('scales', current);
    };

    return (
        <ContentManagementPage
            headerTitle="Manajemen Kurikulum"
            headTitle="Manajemen Kurikulum"
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            processing={activeForm.processing}
            onSave={handleSave}
            errors={activeForm.errors}
        >
            <div className="space-y-6">
                {/* Tab Content: Intro & Fases */}
                {activeTab === 'intro' && (
                    <div className="space-y-6">
                        {/* Intro Section */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                                    Intro Kurikulum
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Pengenalan umum tentang kurikulum</p>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Intro</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={introForm.data.intro_title}
                                        onChange={e => introForm.setData('intro_title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi Intro</label>
                                    <textarea
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={introForm.data.intro_description}
                                        onChange={e => introForm.setData('intro_description', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Fase E Section */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                                    Fase E - Kelas X
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Kurikulum untuk siswa kelas 10</p>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Fase E</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={introForm.data.fase_e_title}
                                        onChange={e => introForm.setData('fase_e_title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi Fase E</label>
                                    <textarea
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={introForm.data.fase_e_description}
                                        onChange={e => introForm.setData('fase_e_description', e.target.value)}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Poin-poin Fase E</label>
                                    {introForm.data.fase_e_points.map((point, idx) => (
                                        <div key={idx} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={point}
                                                onChange={e => updatePoint(introForm, 'fase_e_points', idx, e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePoint(introForm, 'fase_e_points', idx)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addPoint(introForm, 'fase_e_points')}
                                        className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <Plus size={16} /> Tambah Poin
                                    </button>
                                </div>
                                <div>
                                    <FileUploadField
                                        label="Gambar Fase E"
                                        previewUrl={introForm.data.fase_e_image_url}
                                        onChange={(file) => introForm.setData('fase_e_image', file)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fase F Section */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                                    Fase F - Kelas XI - XII
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Kurikulum untuk siswa kelas 11 dan 12</p>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Fase F</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={introForm.data.fase_f_title}
                                        onChange={e => introForm.setData('fase_f_title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi Fase F</label>
                                    <textarea
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={introForm.data.fase_f_description}
                                        onChange={e => introForm.setData('fase_f_description', e.target.value)}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Poin-poin Fase F</label>
                                    {introForm.data.fase_f_points.map((point, idx) => (
                                        <div key={idx} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={point}
                                                onChange={e => updatePoint(introForm, 'fase_f_points', idx, e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePoint(introForm, 'fase_f_points', idx)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addPoint(introForm, 'fase_f_points')}
                                        className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <Plus size={16} /> Tambah Poin
                                    </button>
                                </div>
                                <div>
                                    <FileUploadField
                                        label="Gambar Fase F"
                                        previewUrl={introForm.data.fase_f_image_url}
                                        onChange={(file) => introForm.setData('fase_f_image', file)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Grading System */}
                {activeTab === 'grading' && (
                    <div className="space-y-6">
                        {/* Konfigurasi Penilaian */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                                    Konfigurasi Penilaian
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Pengaturan umum sistem penilaian</p>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Seksi</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={gradingForm.data.title}
                                        onChange={e => gradingForm.setData('title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi Seksi</label>
                                    <textarea
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={gradingForm.data.description}
                                        onChange={e => gradingForm.setData('description', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                                        Skala Nilai
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Daftar skala penilaian dan predikat</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addScale}
                                    className="flex items-center gap-1 text-sm bg-accent-yellow text-gray-900 px-3 py-2 rounded-md hover:bg-yellow-500 font-bold"
                                >
                                    <Plus size={16} /> Tambah Skala
                                </button>
                            </div>
                            <div className="space-y-4">
                                {gradingForm.data.scales.map((scale, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm relative">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Label (e.g. Sangat Baik)</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full text-sm rounded-md border-gray-300"
                                                value={scale.label}
                                                onChange={e => updateScale(idx, 'label', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Sub (e.g. Predikat A)</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full text-sm rounded-md border-gray-300"
                                                value={scale.sub}
                                                onChange={e => updateScale(idx, 'sub', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Rentang (e.g. 91 - 100)</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full text-sm rounded-md border-gray-300"
                                                value={scale.range}
                                                onChange={e => updateScale(idx, 'range', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-end justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeScale(idx)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Learning Goals */}
                {activeTab === 'goals' && (
                    <div className="space-y-6">
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                                    Tujuan Pembelajaran
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Daftar tujuan utama pembelajaran</p>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Seksi</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={goalsForm.data.title}
                                        onChange={e => goalsForm.setData('title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Daftar Tujuan</label>
                                    {goalsForm.data.goals.map((goal, idx) => (
                                        <div key={idx} className="flex gap-2 mb-2">
                                            <textarea
                                                rows="2"
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                value={goal}
                                                onChange={e => updatePoint(goalsForm, 'goals', idx, e.target.value)}
                                            ></textarea>
                                            <button
                                                type="button"
                                                onClick={() => removePoint(goalsForm, 'goals', idx)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-md self-start"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addPoint(goalsForm, 'goals')}
                                        className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <Plus size={16} /> Tambah Tujuan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Metode Pembelajaran */}
                {activeTab === 'metode' && (
                    <div className="space-y-6">
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                                    Metode Pembelajaran
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Metode yang diterapkan di sekolah</p>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Seksi</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={metodeForm.data.title}
                                        onChange={e => metodeForm.setData('title', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {metodeForm.data.items.map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 relative group">
                                            <button
                                                type="button"
                                                onClick={() => removePoint(metodeForm, 'items', idx)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Icon (Lucide)"
                                                    className="w-full text-xs rounded border-gray-300"
                                                    value={item.icon}
                                                    onChange={e => {
                                                        const items = [...metodeForm.data.items];
                                                        items[idx].icon = e.target.value;
                                                        metodeForm.setData('items', items);
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Judul"
                                                    className="w-full text-sm font-bold rounded border-gray-300"
                                                    value={item.title}
                                                    onChange={e => {
                                                        const items = [...metodeForm.data.items];
                                                        items[idx].title = e.target.value;
                                                        metodeForm.setData('items', items);
                                                    }}
                                                />
                                                <textarea
                                                    placeholder="Deskripsi"
                                                    className="w-full text-xs rounded border-gray-300"
                                                    value={item.desc}
                                                    onChange={e => {
                                                        const items = [...metodeForm.data.items];
                                                        items[idx].desc = e.target.value;
                                                        metodeForm.setData('items', items);
                                                    }}
                                                ></textarea>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addPoint(metodeForm, 'items', { title: '', desc: '', icon: 'Lightbulb' })}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-500 transition-colors"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ContentManagementPage>
    );
}
