import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, Globe, Share2, Layout, Image as ImageIcon } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import FileUploadField from '@/Components/Admin/FileUploadField';
import toast from 'react-hot-toast';

export default function Index({ auth, sections, activeSection: initialActiveSection }) {
    const [activeTab, setActiveTab] = useState(initialActiveSection || 'general');
    const [activeHeroPage, setActiveHeroPage] = useState('hero_teachers');

    const { data, setData, post, processing, errors } = useForm({
        section: activeTab === 'hero_sections' ? activeHeroPage : activeTab,
        content: sections[activeTab === 'hero_sections' ? activeHeroPage : activeTab] || {},
    });

    const heroOptions = [
        { key: 'hero_teachers', label: 'Halaman Guru & Staff' },
        { key: 'hero_posts', label: 'Halaman Berita & Pengumuman' },
        { key: 'hero_gallery', label: 'Halaman Galeri Sekolah' },
        { key: 'hero_alumni', label: 'Halaman Jejak Alumni' },
        { key: 'hero_extracurricular', label: 'Halaman Ekstrakurikuler' },
        { key: 'hero_contact', label: 'Halaman Kontak Kami' },
    ];

    const tabs = [
        { key: 'general', label: 'Umum', description: 'Pengaturan dasar situs, logo, dan informasi kontak.', icon: Globe },
        { key: 'social_media', label: 'Media Sosial', description: 'Tautan ke berbagai platform media sosial sekolah.', icon: Share2 },
        { key: 'footer', label: 'Footer', description: 'Pengaturan tampilan bagian bawah situs dan hak cipta.', icon: Layout },
        { key: 'hero_sections', label: 'Hero Halaman', description: 'Kelola banner utama untuk berbagai halaman website.', icon: ImageIcon },
    ];

    const handleTabChange = (tabId) => {
        const targetSection = tabId === 'hero_sections' ? activeHeroPage : tabId;
        setActiveTab(tabId);
        setData({
            section: targetSection,
            content: sections[targetSection] || {},
        });
    };

    const handleHeroPageChange = (e) => {
        const heroKey = e.target.value;
        setActiveHeroPage(heroKey);
        setData({
            section: heroKey,
            content: sections[heroKey] || {},
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.site-settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pengaturan berhasil disimpan!');
            },
            onError: () => {
                toast.error('Gagal menyimpan pengaturan.');
            }
        });
    };

    const handleInputChange = (field, value) => {
        setData('content', {
            ...data.content,
            [field]: value,
        });
    };

    const handleFileChange = (field, file) => {
        setData('content', {
            ...data.content,
            [field]: file,
        });
    };

    const renderHeroEditor = () => (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Judul Hero</label>
                <input
                    type="text"
                    value={data.content.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                />
            </div>
            <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Sub-judul Hero</label>
                <textarea
                    value={data.content.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    rows="3"
                    className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                />
            </div>
            <div className="space-y-4">
                <FileUploadField
                    label="Background Hero"
                    previewUrl={sections[data.section]?.image}
                    onChange={(file) => handleFileChange('image_file', file)}
                />
            </div>
        </div>
    );

    const renderGeneralForm = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nama Situs</label>
                    <input
                        type="text"
                        value={data.content.site_name || ''}
                        onChange={(e) => handleInputChange('site_name', e.target.value)}
                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${errors['content.site_name'] ? 'border-red-500' : ''}`}
                    />
                    {errors['content.site_name'] && <p className="text-red-500 text-xs mt-1">{errors['content.site_name']}</p>}
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Logo Situs</label>
                    <div className="flex items-center gap-4">
                        {sections.general.site_logo && (
                            <img 
                                src={sections.general.site_logo.startsWith('http') || sections.general.site_logo.startsWith('/') ? sections.general.site_logo : `/storage/${sections.general.site_logo}`} 
                                alt="Logo" 
                                className="h-12 w-auto bg-gray-100 p-1 rounded" 
                            />
                        )}
                        <input
                            type="file"
                            onChange={(e) => handleFileChange('site_logo', e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                        />
                    </div>
                    {errors['content.site_logo'] && <p className="text-red-500 text-xs mt-1">{errors['content.site_logo']}</p>}
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Favicon Situs</label>
                    <div className="flex items-center gap-4">
                        {sections.general.site_favicon && (
                            <img 
                                src={sections.general.site_favicon.startsWith('http') || sections.general.site_favicon.startsWith('/') ? sections.general.site_favicon : `/storage/${sections.general.site_favicon}`} 
                                alt="Favicon" 
                                className="h-8 w-8 bg-gray-100 p-1 rounded" 
                            />
                        )}
                        <input
                            type="file"
                            onChange={(e) => handleFileChange('site_favicon', e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                        />
                    </div>
                    {errors['content.site_favicon'] && <p className="text-red-500 text-xs mt-1">{errors['content.site_favicon']}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <textarea
                    value={data.content.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input
                        type="text"
                        value={data.content.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={data.content.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Google Maps URL (Link Berbagi)</label>
                <input
                    type="text"
                    value={data.content.google_maps_url || ''}
                    onChange={(e) => handleInputChange('google_maps_url', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Google Maps Embed URL (src dari iframe)</label>
                <textarea
                    value={data.content.google_maps_embed_url || ''}
                    onChange={(e) => handleInputChange('google_maps_embed_url', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
            </div>
        </div>
    );

    const renderSocialMediaForm = () => (
        <div className="space-y-6">
            {['instagram', 'facebook', 'youtube', 'twitter', 'linkedin'].map((platform) => (
                <div key={platform} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">{platform} URL</label>
                    <input
                        type="text"
                        value={data.content[platform] || ''}
                        onChange={(e) => handleInputChange(platform, e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        placeholder={`https://${platform}.com/...`}
                    />
                </div>
            ))}
        </div>
    );

    const renderFooterForm = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Teks Hak Cipta (Copyright)</label>
                <input
                    type="text"
                    value={data.content.copyright_text || ''}
                    onChange={(e) => handleInputChange('copyright_text', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat Footer</label>
                <textarea
                    value={data.content.footer_description || ''}
                    onChange={(e) => handleInputChange('footer_description', e.target.value)}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
            </div>
        </div>
    );

    return (
        <ContentManagementPage
            headerTitle="Pengaturan Situs"
            headTitle="Pengaturan Situs"
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            processing={processing}
            onSave={handleSubmit}
            errors={errors}
            extraHeader={activeTab === 'hero_sections' && (
                <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Pilih Halaman Hero</h3>
                                <p className="text-xs text-gray-500">Pilih halaman yang ingin dikelola banner utamanya</p>
                            </div>
                        </div>
                        <div className="sm:ml-auto min-w-[280px]">
                            <select
                                id="hero-page-select"
                                value={activeHeroPage}
                                onChange={handleHeroPageChange}
                                className="w-full border-gray-200 focus:border-primary focus:ring-primary rounded-lg shadow-sm text-sm transition-all"
                            >
                                {heroOptions.map(option => (
                                    <option key={option.key} value={option.key}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        >
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                {activeTab === 'general' && renderGeneralForm()}
                {activeTab === 'social_media' && renderSocialMediaForm()}
                {activeTab === 'footer' && renderFooterForm()}
                {activeTab === 'hero_sections' && renderHeroEditor()}
            </div>
        </ContentManagementPage>
    );
}
