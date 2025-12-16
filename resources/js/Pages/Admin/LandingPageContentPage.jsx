// resources/js/Pages/Admin/LandingPageContentPage.jsx
import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import MiniTextEditor from '@/Components/MiniTextEditor';
import { TYPOGRAPHY } from '@/Utils/typography';
import { X, Plus, Upload } from 'lucide-react';

export default function LandingPageContentPage() {
    const { currentSettings, success, errors: pageErrorsFromLaravel } = usePage().props;

    // Inisialisasi form dengan semua section
    const { data, setData, post, processing, errors: formErrors, reset } = useForm({
        hero: currentSettings.hero || {},
        about_lp: currentSettings.about_lp || {},
        kepsek_welcome_lp: currentSettings.kepsek_welcome_lp || {},
        fakta_lp: currentSettings.fakta_lp || { items: [] },
    });

    // State untuk file uploads dan previews
    const [selectedFiles, setSelectedFiles] = useState({
        heroBackgroundImage: null,
        aboutImage: null,
        kepsekImage: null,
    });
    
    const [previewUrls, setPreviewUrls] = useState({
        heroBackgroundImage: currentSettings.hero?.background_image_url || '',
        aboutImage: currentSettings.about_lp?.image_url || '',
        kepsekImage: currentSettings.kepsek_welcome_lp?.kepsek_image_url || '',
    });

    const [localSuccess, setLocalSuccess] = useState(null);
    const [localErrors, setLocalErrors] = useState({});
    const [activeTab, setActiveTab] = useState('hero');

    // Tab configuration mirip SPMB
    const tabs = [
        { key: 'hero', label: 'Hero', description: 'Bagian utama landing page (judul & gambar latar)' },
        { key: 'about', label: 'Tentang', description: 'Bagian tentang sekolah' },
        { key: 'kepsek', label: 'Kepsek', description: 'Bagian sambutan kepala sekolah' },
        { key: 'fakta', label: 'Fakta', description: 'Bagian fakta-fakta sekolah' },
    ];

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
    // File handling functions
    const handleFileChange = (fileType, file) => {
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setLocalErrors(prev => ({
                    ...prev,
                    [fileType]: 'Ukuran file tidak boleh lebih dari 2MB'
                }));
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
            if (!allowedTypes.includes(file.type)) {
                setLocalErrors(prev => ({
                    ...prev,
                    [fileType]: 'File harus berupa gambar (JPEG, PNG, JPG, GIF, SVG)'
                }));
                return;
            }

            // Clear any previous errors for this file type
            setLocalErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fileType];
                return newErrors;
            });

            setSelectedFiles(prev => ({
                ...prev,
                [fileType]: file
            }));

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrls(prev => ({
                    ...prev,
                    [fileType]: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalErrors({});

        const formData = new FormData();
        
        // Add text data
        formData.append('hero[title_line1]', data.hero?.title_line1 || '');
        formData.append('hero[title_line2]', data.hero?.title_line2 || '');
        formData.append('about_lp[title]', data.about_lp?.title || '');
        formData.append('about_lp[description_html]', data.about_lp?.description_html || '');
        formData.append('kepsek_welcome_lp[title]', data.kepsek_welcome_lp?.title || '');
        formData.append('kepsek_welcome_lp[kepsek_name]', data.kepsek_welcome_lp?.kepsek_name || '');
        formData.append('kepsek_welcome_lp[kepsek_title]', data.kepsek_welcome_lp?.kepsek_title || '');
        formData.append('kepsek_welcome_lp[welcome_text_html]', data.kepsek_welcome_lp?.welcome_text_html || '');
        
        // Add fakta items
        if (data.fakta_lp?.items) {
            data.fakta_lp.items.forEach((item, index) => {
                formData.append(`fakta_lp[items][${index}][label]`, item.label || '');
                formData.append(`fakta_lp[items][${index}][value]`, item.value || '');
            });
        }

        // Add files
        if (selectedFiles.heroBackgroundImage) {
            formData.append('hero[background_image]', selectedFiles.heroBackgroundImage);
        }
        if (selectedFiles.aboutImage) {
            formData.append('about_lp[image]', selectedFiles.aboutImage);
        }
        if (selectedFiles.kepsekImage) {
            formData.append('kepsek_welcome_lp[kepsek_image]', selectedFiles.kepsekImage);
        }

        post(route('admin.landingpage.content.update_all'), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Clear selected files after successful upload
                setSelectedFiles({
                    heroBackgroundImage: null,
                    aboutImage: null,
                    kepsekImage: null,
                });
            },
            onError: (serverErrors) => {
                console.error("Save error:", serverErrors);
                setLocalErrors(serverErrors);
            }
        });
    };

    // Handler untuk nested state (seperti hero.title_line1)
    const handleSectionInputChange = (section, field, value) => {
        setData(prevData => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value,
            }
        }));
         // Bersihkan error spesifik saat user mulai mengetik
        if (localErrors[`${section}.${field}`]) {
            setLocalErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[`${section}.${field}`];
                return newErrors;
            });
        }
    };

    // Handler untuk Fakta Sekolah (array of objects)
    const handleFaktaItemChange = (index, field, value) => {
        const newItems = [...(data.fakta_lp.items || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        handleSectionInputChange('fakta_lp', 'items', newItems);
    };

    const addFaktaItem = () => {
        const newItems = [...(data.fakta_lp.items || []), { label: '', value: '' }];
        handleSectionInputChange('fakta_lp', 'items', newItems);
    };

    const removeFaktaItem = (index) => {
        const newItems = (data.fakta_lp.items || []).filter((_, i) => i !== index);
        handleSectionInputChange('fakta_lp', 'items', newItems);
    };

    // Render tab content mirip SPMB
    const renderTabContent = () => {
        if (activeTab === 'hero') {
            return (
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="hero_title_line1" value="Judul Baris 1" />
                        <TextInput id="hero_title_line1" value={data.hero?.title_line1 || ''}
                            onChange={e => handleSectionInputChange('hero', 'title_line1', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['hero.title_line1'] || formErrors['hero.title_line1']} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="hero_title_line2" value="Judul Baris 2" />
                        <TextInput id="hero_title_line2" value={data.hero?.title_line2 || ''}
                            onChange={e => handleSectionInputChange('hero', 'title_line2', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['hero.title_line2'] || formErrors['hero.title_line2']} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="hero_background_image" value="Gambar Latar Hero" />
                        <div className="flex flex-col gap-2">
                            <input
                                id="hero_background_image"
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFileChange('heroBackgroundImage', e.target.files[0]);
                                    }
                                }}
                            />
                            <p className={TYPOGRAPHY.smallText}>
                                Format yang didukung: JPEG, PNG, JPG, GIF, SVG. Maksimal 2MB.
                            </p>
                            {previewUrls.heroBackgroundImage && (
                                <div className="mt-2">
                                    <img 
                                        src={previewUrls.heroBackgroundImage} 
                                        alt="Preview Latar Hero" 
                                        className="max-h-40 rounded object-cover border"
                                    />
                                </div>
                            )}
                        </div>
                        <InputError message={localErrors['heroBackgroundImage'] || localErrors['hero.background_image'] || formErrors['hero.background_image']} className="mt-1" />
                    </div>
                </div>
            );
        }
        if (activeTab === 'about') {
            return (
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="about_lp_title" value="Judul Tentang" />
                        <TextInput id="about_lp_title" value={data.about_lp?.title || ''}
                            onChange={e => handleSectionInputChange('about_lp', 'title', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['about_lp.title'] || formErrors['about_lp.title']} className="mt-1" />
                    </div>
                    <MiniTextEditor
                        label="Deskripsi Tentang"
                        initialValue={data.about_lp?.description_html || ''}
                        onChange={html => handleSectionInputChange('about_lp', 'description_html', html)}
                        error={localErrors['about_lp.description_html'] || formErrors['about_lp.description_html']}
                    />
                    <div>
                        <InputLabel htmlFor="about_lp_image" value="Gambar Tentang" />
                        <div className="flex flex-col gap-2">
                            <input
                                id="about_lp_image"
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFileChange('aboutImage', e.target.files[0]);
                                    }
                                }}
                            />
                            <p className={TYPOGRAPHY.smallText}>
                                Format yang didukung: JPEG, PNG, JPG, GIF, SVG. Maksimal 2MB.
                            </p>
                            {previewUrls.aboutImage && (
                                <div className="mt-2">
                                    <img 
                                        src={previewUrls.aboutImage} 
                                        alt="Preview Tentang" 
                                        className="max-h-40 rounded object-cover border"
                                    />
                                </div>
                            )}
                        </div>
                        <InputError message={localErrors['aboutImage'] || localErrors['about_lp.image'] || formErrors['about_lp.image']} className="mt-1" />
                    </div>
                </div>
            );
        }
        if (activeTab === 'kepsek') {
            return (
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="kepsek_title" value="Judul Sambutan" />
                        <TextInput id="kepsek_title" value={data.kepsek_welcome_lp?.title || ''}
                            onChange={e => handleSectionInputChange('kepsek_welcome_lp', 'title', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['kepsek_welcome_lp.title'] || formErrors['kepsek_welcome_lp.title']} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="kepsek_name" value="Nama Kepala Sekolah" />
                        <TextInput id="kepsek_name" value={data.kepsek_welcome_lp?.kepsek_name || ''}
                            onChange={e => handleSectionInputChange('kepsek_welcome_lp', 'kepsek_name', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['kepsek_welcome_lp.kepsek_name'] || formErrors['kepsek_welcome_lp.kepsek_name']} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="kepsek_title_role" value="Jabatan Kepala Sekolah" />
                        <TextInput id="kepsek_title_role" value={data.kepsek_welcome_lp?.kepsek_title || ''}
                            onChange={e => handleSectionInputChange('kepsek_welcome_lp', 'kepsek_title', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['kepsek_welcome_lp.kepsek_title'] || formErrors['kepsek_welcome_lp.kepsek_title']} className="mt-1" />
                    </div>
                    <MiniTextEditor
                        label="Teks Sambutan"
                        initialValue={data.kepsek_welcome_lp?.welcome_text_html || ''}
                        onChange={html => handleSectionInputChange('kepsek_welcome_lp', 'welcome_text_html', html)}
                        error={localErrors['kepsek_welcome_lp.welcome_text_html'] || formErrors['kepsek_welcome_lp.welcome_text_html']}
                    />
                    <div>
                        <InputLabel htmlFor="kepsek_image" value="Foto Kepala Sekolah" />
                        <div className="flex flex-col gap-2">
                            <input
                                id="kepsek_image"
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFileChange('kepsekImage', e.target.files[0]);
                                    }
                                }}
                            />
                            <p className={TYPOGRAPHY.smallText}>
                                Format yang didukung: JPEG, PNG, JPG, GIF, SVG. Maksimal 2MB.
                            </p>
                            {previewUrls.kepsekImage && (
                                <div className="mt-2">
                                    <img 
                                        src={previewUrls.kepsekImage} 
                                        alt="Preview Foto Kasek" 
                                        className="max-h-40 rounded object-cover border"
                                    />
                                </div>
                            )}
                        </div>
                        <InputError message={localErrors['kepsekImage'] || localErrors['kepsek_welcome_lp.kepsek_image'] || formErrors['kepsek_welcome_lp.kepsek_image']} className="mt-1" />
                    </div>
                </div>
            );
        }
        if (activeTab === 'fakta') {
            return (
                <div className="space-y-4">
                    {(data.fakta_lp?.items || []).map((item, index) => (
                        <div key={index} className="flex items-end space-x-2 p-3 border rounded-md">
                            <div className="flex-1">
                                <InputLabel htmlFor={`fakta_label_${index}`} value="Label" />
                                <TextInput id={`fakta_label_${index}`} value={item.label}
                                    onChange={e => handleFaktaItemChange(index, 'label', e.target.value)}
                                    className="mt-1 block w-full" />
                                <InputError message={localErrors[`fakta_lp.items.${index}.label`] || formErrors[`fakta_lp.items.${index}.label`]} className="mt-1" />
                            </div>
                            <div className="flex-1">
                                <InputLabel htmlFor={`fakta_value_${index}`} value="Angka" />
                                <TextInput type="number" id={`fakta_value_${index}`} value={item.value}
                                    onChange={e => handleFaktaItemChange(index, 'value', parseInt(e.target.value) || 0)}
                                    className="mt-1 block w-full" />
                                <InputError message={localErrors[`fakta_lp.items.${index}.value`] || formErrors[`fakta_lp.items.${index}.value`]} className="mt-1" />
                            </div>
                            <button type="button" onClick={() => removeFaktaItem(index)}
                                className="p-2 text-red-500 hover:text-red-700">
                                <X size={20}/>
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addFaktaItem}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                        <Plus size={16} className="mr-1"/> Tambah Item Fakta
                    </button>
                </div>
            );
        }
        return <div>Pilih tab untuk mulai mengedit konten landing page.</div>;
    };

    return (
        <AdminLayout headerTitle="Kelola Konten Landing Page">
            <Head title="Kelola Landing Page" />
            <div className="max-w-screen-2xl mx-auto p-3 sm:p-4">
                {/* Success & Error Messages */}
                {localSuccess && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{localSuccess}</span>
                    </div>
                )}
                {(localErrors.general || Object.keys(localErrors).length > 0) && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">
                            {localErrors.general || 'Terdapat kesalahan dalam pengisian form. Silakan periksa kembali.'}
                        </span>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Konten Landing Page</h1>
                        <p className="text-gray-600 mt-2">
                            Kelola semua konten utama landing page sekolah dalam satu halaman.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    >
                                        {tab.label}
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
                            <p className="text-gray-600 text-sm">
                                {tabs.find(tab => tab.key === activeTab)?.description}
                            </p>
                        </div>
                        {renderTabContent()}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing} className="px-6 py-2">
                                    {processing ? 'Menyimpan Semua...' : 'Simpan Semua Perubahan'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}