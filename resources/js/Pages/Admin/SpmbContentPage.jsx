// resources/js/Pages/Admin/SpmbContentPage.jsx
import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import MiniTextEditor from '@/Components/MiniTextEditor';
import { X, Plus, Info, Calendar, Users, FileText, ClipboardList, HelpCircle } from 'lucide-react';
import { TYPOGRAPHY } from '@/Utils/typography';

export default function SpmbContentPage() {
    const { currentSettings, success, errors: pageErrorsFromLaravel } = usePage().props;

    // Inisialisasi form dengan semua section SPMB
    const { data, setData, put, processing, errors: formErrors, reset } = useForm({
        pengaturan_umum: currentSettings.pengaturan_umum || {},
        jalur_pendaftaran: currentSettings.jalur_pendaftaran || {},
        jadwal_penting: currentSettings.jadwal_penting || { events: [] },
        persyaratan: currentSettings.persyaratan || { documents: [] },
        prosedur: currentSettings.prosedur || { steps: [] },
        faq: currentSettings.faq || { items: [] },
    });

    const [localSuccess, setLocalSuccess] = useState(null);
    const [localErrors, setLocalErrors] = useState({});
    const [activeTab, setActiveTab] = useState('pengaturan_umum');

    useEffect(() => {
        if (success) {
            setLocalSuccess(success);
            const timer = setTimeout(() => setLocalSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    
    useEffect(() => {
        if (pageErrorsFromLaravel && Object.keys(pageErrorsFromLaravel).length > 0) {
            setLocalErrors(pageErrorsFromLaravel);
        } else {
            setLocalErrors({});
        }
    }, [pageErrorsFromLaravel]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalErrors({});
        put(route('admin.spmb.content.update_all'), {
            preserveScroll: true,
            onSuccess: () => {
                // Success message handled by localSuccess state
            },
            onError: (errors) => {
                setLocalErrors(errors);
            }
        });
    };

    // Tab configuration
    const tabs = [
        { 
            key: 'pengaturan_umum', 
            label: 'Pengaturan Umum', 
            icon: Info,
            description: 'Konfigurasi dasar SPMB'
        },
        { 
            key: 'jalur_pendaftaran', 
            label: 'Jalur Pendaftaran', 
            icon: Users,
            description: 'Jalur reguler dan prestasi'
        },
        { 
            key: 'jadwal_penting', 
            label: 'Jadwal Penting', 
            icon: Calendar,
            description: 'Timeline kegiatan SPMB'
        },
        { 
            key: 'persyaratan', 
            label: 'Persyaratan', 
            icon: FileText,
            description: 'Dokumen yang diperlukan'
        },
        { 
            key: 'prosedur', 
            label: 'Prosedur', 
            icon: ClipboardList,
            description: 'Langkah-langkah pendaftaran'
        },
        { 
            key: 'faq', 
            label: 'FAQ', 
            icon: HelpCircle,
            description: 'Pertanyaan yang sering diajukan'
        }
    ];

    // Helper functions for array fields
    const addArrayItem = (section, field, newItem) => {
        const currentArray = data[section][field] || [];
        setData(section, {
            ...data[section],
            [field]: [...currentArray, newItem]
        });
    };

    const removeArrayItem = (section, field, index) => {
        const currentArray = data[section][field] || [];
        const newArray = currentArray.filter((_, i) => i !== index);
        setData(section, {
            ...data[section],
            [field]: newArray
        });
    };

    const updateArrayItem = (section, field, index, key, value) => {
        const currentArray = data[section][field] || [];
        const newArray = [...currentArray];
        newArray[index] = { ...newArray[index], [key]: value };
        setData(section, {
            ...data[section],
            [field]: newArray
        });
    };

    const updateRequirementsArray = (section, field, index, value) => {
        const currentArray = data[section][field] || [];
        const newArray = [...currentArray];
        newArray[index] = value;
        setData(section, {
            ...data[section],
            [field]: newArray
        });
    };

    const addRequirement = (section, field) => {
        const currentArray = data[section][field] || [];
        setData(section, {
            ...data[section],
            [field]: [...currentArray, '']
        });
    };

    const removeRequirement = (section, field, index) => {
        const currentArray = data[section][field] || [];
        const newArray = currentArray.filter((_, i) => i !== index);
        setData(section, {
            ...data[section],
            [field]: newArray
        });
    };

    // Render different sections based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'pengaturan_umum':
                return (
                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="pengaturan_umum_title" value="Judul SPMB" />
                            <TextInput
                                id="pengaturan_umum_title"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.pengaturan_umum.title || ''}
                                onChange={(e) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    title: e.target.value
                                })}
                                required
                            />
                            <InputError message={localErrors['pengaturan_umum.title'] || formErrors['pengaturan_umum.title']} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pengaturan_umum_description" value="Deskripsi SPMB" />
                            <MiniTextEditor
                                value={data.pengaturan_umum.description || ''}
                                onChange={(value) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    description: value
                                })}
                                placeholder="Masukkan deskripsi tentang SPMB..."
                            />
                            <InputError message={localErrors['pengaturan_umum.description'] || formErrors['pengaturan_umum.description']} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pengaturan_umum_banner" value="URL Banner Image" />
                            <TextInput
                                id="pengaturan_umum_banner"
                                type="url"
                                className="mt-1 block w-full"
                                value={data.pengaturan_umum.banner_image_url || ''}
                                onChange={(e) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    banner_image_url: e.target.value
                                })}
                                placeholder="https://example.com/banner.jpg"
                            />
                            <InputError message={localErrors['pengaturan_umum.banner_image_url'] || formErrors['pengaturan_umum.banner_image_url']} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Status Pendaftaran" />
                            <div className="mt-2 space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <input
                                        type="radio"
                                        name="registration_open"
                                        value="true"
                                        checked={data.pengaturan_umum.registration_open === true}
                                        onChange={() => setData('pengaturan_umum', {
                                            ...data.pengaturan_umum,
                                            registration_open: true
                                        })}
                                        className="mr-2"
                                    />
                                    Pendaftaran Dibuka
                                </label>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <input
                                        type="radio"
                                        name="registration_open"
                                        value="false"
                                        checked={data.pengaturan_umum.registration_open === false}
                                        onChange={() => setData('pengaturan_umum', {
                                            ...data.pengaturan_umum,
                                            registration_open: false
                                        })}
                                        className="mr-2"
                                    />
                                    Pendaftaran Ditutup
                                </label>
                            </div>
                            <InputError message={localErrors['pengaturan_umum.registration_open'] || formErrors['pengaturan_umum.registration_open']} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pengaturan_umum_announcement" value="Pengumuman Khusus" />
                            <MiniTextEditor
                                value={data.pengaturan_umum.announcement || ''}
                                onChange={(value) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    announcement: value
                                })}
                                placeholder="Masukkan pengumuman khusus jika ada..."
                            />
                            <InputError message={localErrors['pengaturan_umum.announcement'] || formErrors['pengaturan_umum.announcement']} className="mt-2" />
                        </div>
                    </div>
                );

            case 'jalur_pendaftaran':
                return (
                    <div className="space-y-8">
                        {/* Jalur Reguler */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className={TYPOGRAPHY.cardTitle + " text-gray-900"}>Jalur Reguler</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <InputLabel value="Deskripsi Jalur Reguler" />
                                    <MiniTextEditor
                                        value={data.jalur_pendaftaran.regular?.description || ''}
                                        onChange={(value) => setData('jalur_pendaftaran', {
                                            ...data.jalur_pendaftaran,
                                            regular: {
                                                ...data.jalur_pendaftaran.regular,
                                                description: value
                                            }
                                        })}
                                        placeholder="Deskripsi jalur pendaftaran reguler..."
                                    />
                                    <InputError message={localErrors['jalur_pendaftaran.regular.description'] || formErrors['jalur_pendaftaran.regular.description']} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="Kuota Jalur Reguler" />
                                    <TextInput
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.jalur_pendaftaran.regular?.quota || ''}
                                        onChange={(e) => setData('jalur_pendaftaran', {
                                            ...data.jalur_pendaftaran,
                                            regular: {
                                                ...data.jalur_pendaftaran.regular,
                                                quota: parseInt(e.target.value) || 0
                                            }
                                        })}
                                        min="0"
                                    />
                                    <InputError message={localErrors['jalur_pendaftaran.regular.quota'] || formErrors['jalur_pendaftaran.regular.quota']} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="Persyaratan Jalur Reguler" />
                                    <div className="space-y-2 mt-2">
                                        {(data.jalur_pendaftaran.regular?.requirements || []).map((req, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <TextInput
                                                    type="text"
                                                    className="flex-1"
                                                    value={req}
                                                    onChange={(e) => updateRequirementsArray('jalur_pendaftaran', `regular.requirements`, index, e.target.value)}
                                                    placeholder={`Persyaratan ${index + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeRequirement('jalur_pendaftaran', 'regular.requirements', index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addRequirement('jalur_pendaftaran', 'regular.requirements')}
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <Plus size={16} className="mr-1" />
                                            Tambah Persyaratan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Jalur Prestasi */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className={TYPOGRAPHY.cardTitle + " text-gray-900"}>Jalur Prestasi</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <InputLabel value="Deskripsi Jalur Prestasi" />
                                    <MiniTextEditor
                                        value={data.jalur_pendaftaran.prestasi?.description || ''}
                                        onChange={(value) => setData('jalur_pendaftaran', {
                                            ...data.jalur_pendaftaran,
                                            prestasi: {
                                                ...data.jalur_pendaftaran.prestasi,
                                                description: value
                                            }
                                        })}
                                        placeholder="Deskripsi jalur pendaftaran prestasi..."
                                    />
                                    <InputError message={localErrors['jalur_pendaftaran.prestasi.description'] || formErrors['jalur_pendaftaran.prestasi.description']} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="Kuota Jalur Prestasi" />
                                    <TextInput
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.jalur_pendaftaran.prestasi?.quota || ''}
                                        onChange={(e) => setData('jalur_pendaftaran', {
                                            ...data.jalur_pendaftaran,
                                            prestasi: {
                                                ...data.jalur_pendaftaran.prestasi,
                                                quota: parseInt(e.target.value) || 0
                                            }
                                        })}
                                        min="0"
                                    />
                                    <InputError message={localErrors['jalur_pendaftaran.prestasi.quota'] || formErrors['jalur_pendaftaran.prestasi.quota']} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="Persyaratan Jalur Prestasi" />
                                    <div className="space-y-2 mt-2">
                                        {(data.jalur_pendaftaran.prestasi?.requirements || []).map((req, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <TextInput
                                                    type="text"
                                                    className="flex-1"
                                                    value={req}
                                                    onChange={(e) => updateRequirementsArray('jalur_pendaftaran', `prestasi.requirements`, index, e.target.value)}
                                                    placeholder={`Persyaratan ${index + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeRequirement('jalur_pendaftaran', 'prestasi.requirements', index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addRequirement('jalur_pendaftaran', 'prestasi.requirements')}
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <Plus size={16} className="mr-1" />
                                            Tambah Persyaratan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'jadwal_penting':
                return (
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <InputLabel value="Jadwal Kegiatan SPMB" />
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('jadwal_penting', 'events', { title: '', date: '', description: '' })}
                                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Tambah Jadwal
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(data.jadwal_penting.events || []).map((event, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-md font-medium text-gray-900">Kegiatan {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('jadwal_penting', 'events', index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel value="Nama Kegiatan" />
                                                <TextInput
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={event.title}
                                                    onChange={(e) => updateArrayItem('jadwal_penting', 'events', index, 'title', e.target.value)}
                                                    placeholder="Contoh: Pendaftaran Online"
                                                />
                                            </div>
                                            
                                            <div>
                                                <InputLabel value="Tanggal" />
                                                <TextInput
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    value={event.date}
                                                    onChange={(e) => updateArrayItem('jadwal_penting', 'events', index, 'date', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <InputLabel value="Deskripsi (Opsional)" />
                                            <TextInput
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={event.description || ''}
                                                onChange={(e) => updateArrayItem('jadwal_penting', 'events', index, 'description', e.target.value)}
                                                placeholder="Deskripsi tambahan..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'persyaratan':
                return (
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <InputLabel value="Dokumen Persyaratan" />
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('persyaratan', 'documents', { name: '', description: '', required: true })}
                                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Tambah Dokumen
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(data.persyaratan.documents || []).map((doc, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-md font-medium text-gray-900">Dokumen {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('persyaratan', 'documents', index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel value="Nama Dokumen" />
                                                <TextInput
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={doc.name}
                                                    onChange={(e) => updateArrayItem('persyaratan', 'documents', index, 'name', e.target.value)}
                                                    placeholder="Contoh: Ijazah SMP/MTs"
                                                />
                                            </div>
                                            
                                            <div>
                                                <InputLabel value="Deskripsi" />
                                                <TextInput
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={doc.description}
                                                    onChange={(e) => updateArrayItem('persyaratan', 'documents', index, 'description', e.target.value)}
                                                    placeholder="Keterangan tambahan tentang dokumen..."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={doc.required || false}
                                                        onChange={(e) => updateArrayItem('persyaratan', 'documents', index, 'required', e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    Dokumen Wajib
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Catatan Tambahan" />
                            <MiniTextEditor
                                value={data.persyaratan.additional_notes || ''}
                                onChange={(value) => setData('persyaratan', {
                                    ...data.persyaratan,
                                    additional_notes: value
                                })}
                                placeholder="Catatan tambahan tentang persyaratan..."
                            />
                        </div>
                    </div>
                );

            case 'prosedur':
                return (
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <InputLabel value="Langkah-langkah Pendaftaran" />
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('prosedur', 'steps', { title: '', description: '' })}
                                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Tambah Langkah
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(data.prosedur.steps || []).map((step, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-md font-medium text-gray-900">Langkah {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('prosedur', 'steps', index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel value="Judul Langkah" />
                                                <TextInput
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={step.title}
                                                    onChange={(e) => updateArrayItem('prosedur', 'steps', index, 'title', e.target.value)}
                                                    placeholder="Contoh: Daftar Online"
                                                />
                                            </div>
                                            
                                            <div>
                                                <InputLabel value="Deskripsi Langkah" />
                                                <MiniTextEditor
                                                    value={step.description}
                                                    onChange={(value) => updateArrayItem('prosedur', 'steps', index, 'description', value)}
                                                    placeholder="Jelaskan langkah-langkah detail..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Informasi Kontak" />
                            <MiniTextEditor
                                value={data.prosedur.contact_info || ''}
                                onChange={(value) => setData('prosedur', {
                                    ...data.prosedur,
                                    contact_info: value
                                })}
                                placeholder="Informasi kontak untuk bantuan pendaftaran..."
                            />
                        </div>
                    </div>
                );

            case 'faq':
                return (
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <InputLabel value="Pertanyaan yang Sering Diajukan" />
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('faq', 'items', { question: '', answer: '' })}
                                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Tambah FAQ
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(data.faq.items || []).map((item, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-md font-medium text-gray-900">FAQ {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('faq', 'items', index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel value="Pertanyaan" />
                                                <TextInput
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={item.question}
                                                    onChange={(e) => updateArrayItem('faq', 'items', index, 'question', e.target.value)}
                                                    placeholder="Tulis pertanyaan..."
                                                />
                                            </div>
                                            
                                            <div>
                                                <InputLabel value="Jawaban" />
                                                <MiniTextEditor
                                                    value={item.answer}
                                                    onChange={(value) => updateArrayItem('faq', 'items', index, 'answer', value)}
                                                    placeholder="Tulis jawaban..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Pilih tab untuk mulai mengedit konten SPMB.</div>;
        }
    };

    return (
        <AdminLayout headerTitle="Kelola Informasi SPMB">
            <Head title="Kelola Informasi SPMB" />
            
            <div className="max-w-screen-2xl mx-auto p-3 sm:p-4">
                {/* Success Message */}
                {localSuccess && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{localSuccess}</span>
                    </div>
                )}

                {/* General Error Messages */}
                {(localErrors.general || Object.keys(localErrors).length > 0) && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">
                            {localErrors.general || 'Terdapat kesalahan dalam pengisian form. Silakan periksa kembali.'}
                        </span>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Informasi SPMB</h1>
                        <p className={TYPOGRAPHY.secondaryText + " mt-2"}>
                            Kelola semua konten terkait Sistem Penerimaan Mahasiswa Baru (SPMB) dalam satu halaman.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`${
                                            isActive
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    >
                                        <Icon size={16} className="mr-2" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {tabs.find(tab => tab.key === activeTab)?.label}
                            </h2>
                            <p className={TYPOGRAPHY.secondaryText}>
                                {tabs.find(tab => tab.key === activeTab)?.description}
                            </p>
                        </div>

                        {renderTabContent()}

                        {/* Submit Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing} className="px-6 py-2">
                                    {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
