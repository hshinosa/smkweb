import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    History, 
    Target, 
    Building2, 
    Network, 
    Plus, 
    Trash2, 
    MoveUp, 
    MoveDown,
    Image as ImageIcon
} from 'lucide-react';
import FileUploadField from '@/Components/Admin/FileUploadField';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import MiniTextEditor from '@/Components/MiniTextEditor';
import toast from 'react-hot-toast';

export default function SchoolProfileIndex({ auth, sections, activeSection: initialSection }) {
    const [activeTab, setActiveTab] = useState(initialSection || 'history');
    const [activeHeroPage, setActiveHeroPage] = useState('hero_history');
    
    const { data, setData, post, processing, errors } = useForm({
        section: activeTab === 'hero_sections' ? activeHeroPage : activeTab,
        content: sections[activeTab === 'hero_sections' ? activeHeroPage : activeTab] || {}
    });

    const heroOptions = [
        { key: 'hero_history', label: 'Halaman Sejarah Sekolah' },
        { key: 'hero_vision_mission', label: 'Halaman Visi & Misi' },
        { key: 'hero_organization', label: 'Halaman Struktur Organisasi' },
    ];

    const tabs = [
        { key: 'history', label: 'Konten Sejarah', description: 'Kelola lini masa sejarah berdirinya sekolah.', icon: History },
        { key: 'vision_mission', label: 'Konten Visi & Misi', description: 'Visi, misi, dan tujuan strategis sekolah.', icon: Target },
        { key: 'facilities', label: 'Konten Fasilitas', description: 'Daftar fasilitas pendukung kegiatan belajar mengajar.', icon: Building2 },
        { key: 'organization', label: 'Bagan Organisasi', description: 'Bagan struktur kepengurusan sekolah.', icon: Network },
        { key: 'hero_sections', label: 'Hero Halaman', description: 'Kelola banner utama untuk berbagai halaman profil.', icon: ImageIcon },
    ];

    const handleTabChange = (tabId) => {
        const targetSection = tabId === 'hero_sections' ? activeHeroPage : tabId;
        setActiveTab(tabId);
        setData({
            section: targetSection,
            content: sections[targetSection] || {}
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
        if (e) e.preventDefault();
        post(route('admin.school-profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Perubahan berhasil disimpan!');
            },
            onError: () => {
                toast.error('Gagal menyimpan perubahan. Silakan periksa formulir.');
            }
        });
    };

    // Helper to update nested content
    const updateContent = (key, value) => {
        setData('content', {
            ...data.content,
            [key]: value
        });
    };

    // --- Section Specific Renderers ---

    const renderHeroEditor = () => {
        const heroData = data.content || {};
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700">Judul Hero</label>
                    <input
                        type="text"
                        value={heroData.title || ''}
                        onChange={(e) => updateContent('title', e.target.value)}
                        className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="space-y-4">
                    <FileUploadField
                        label="Background Hero"
                        previewUrl={heroData.image_url}
                        onChange={(file) => updateContent('image', file)}
                    />
                </div>
            </div>
        );
    };

    const renderHistoryEditor = () => {
        const historyData = data.content || {};
        const events = Array.isArray(historyData.timeline) ? historyData.timeline : [];
        
        const updateTimeline = (newTimeline) => {
            updateContent('timeline', newTimeline);
        };

        const addEvent = () => {
            updateTimeline([...events, { year: '', title: '', description: '' }]);
        };

        const removeEvent = (index) => {
            const newEvents = [...events];
            newEvents.splice(index, 1);
            updateTimeline(newEvents);
        };

        const updateEvent = (index, field, value) => {
            const newEvents = [...events];
            newEvents[index] = { ...newEvents[index], [field]: value };
            updateTimeline(newEvents);
        };

        const moveEvent = (index, direction) => {
            if ((direction === -1 && index === 0) || (direction === 1 && index === events.length - 1)) return;
            const newEvents = [...events];
            const temp = newEvents[index];
            newEvents[index] = newEvents[index + direction];
            newEvents[index + direction] = temp;
            updateTimeline(newEvents);
        };

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">Judul Sejarah</label>
                        <input
                            type="text"
                            value={historyData.title || ''}
                            onChange={(e) => updateContent('title', e.target.value)}
                            className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                        />
                    </div>
                <div className="space-y-4">
                        <FileUploadField
                            label="Gambar Sejarah"
                            previewUrl={historyData.image_url}
                            onChange={(file) => updateContent('image', file)}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <MiniTextEditor
                            label="Deskripsi Sejarah"
                            initialValue={historyData.description_html || ''}
                            onChange={(content) => updateContent('description_html', content)}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Timeline Sejarah</h3>
                    <button
                        type="button"
                        onClick={addEvent}
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah Peristiwa
                    </button>
                </div>

                <div className="space-y-4">
                    {events.map((event, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tahun</label>
                                    <input
                                        type="text"
                                        value={event.year}
                                        onChange={(e) => updateEvent(index, 'year', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                                        placeholder="Contoh: 1975"
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Judul Peristiwa</label>
                                    <input
                                        type="text"
                                        value={event.title}
                                        onChange={(e) => updateEvent(index, 'title', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                                        placeholder="Contoh: Awal Pendirian"
                                    />
                                </div>
                                <div className="md:col-span-5">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Deskripsi</label>
                                    <textarea
                                        value={event.description}
                                        onChange={(e) => updateEvent(index, 'description', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                                        rows="2"
                                        placeholder="Jelaskan peristiwa singkat..."
                                    />
                                </div>
                                <div className="md:col-span-1 flex flex-col justify-center items-center space-y-2">
                                    <button type="button" onClick={() => moveEvent(index, -1)} className="text-gray-400 hover:text-primary"><MoveUp className="w-4 h-4" /></button>
                                    <button type="button" onClick={() => removeEvent(index)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    <button type="button" onClick={() => moveEvent(index, 1)} className="text-gray-400 hover:text-primary"><MoveDown className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderVisionMissionEditor = () => {
        const visionMissionData = data.content || {};
        const vision = visionMissionData.vision || '';
        const mission = Array.isArray(visionMissionData.mission) ? visionMissionData.mission : [];
        const goals = Array.isArray(visionMissionData.goals) ? visionMissionData.goals : [];

        const updateList = (field, index, value) => {
            const currentList = field === 'mission' ? mission : goals;
            const newList = [...currentList];
            newList[index] = value;
            updateContent(field, newList);
        };

        const addListItem = (field) => {
            const currentList = field === 'mission' ? mission : goals;
            updateContent(field, [...currentList, '']);
        };

        const removeListItem = (field, index) => {
            const currentList = field === 'mission' ? mission : goals;
            const newList = [...currentList];
            newList.splice(index, 1);
            updateContent(field, newList);
        };

        return (
            <div className="space-y-8">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Visi Sekolah</label>
                    <textarea
                        value={vision}
                        onChange={(e) => updateContent('vision', e.target.value)}
                        className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                        rows="3"
                        placeholder="Masukkan visi sekolah..."
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-bold text-gray-700">Misi Sekolah</label>
                            <button type="button" onClick={() => addListItem('mission')} className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                                <Plus className="w-4 h-4 mr-1" /> Tambah Misi
                            </button>
                        </div>
                        <div className="space-y-3">
                            {mission.map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateList('mission', idx, e.target.value)}
                                        className="flex-1 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                                    />
                                    <button type="button" onClick={() => removeListItem('mission', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-bold text-gray-700">Tujuan Sekolah</label>
                            <button type="button" onClick={() => addListItem('goals')} className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                                <Plus className="w-4 h-4 mr-1" /> Tambah Tujuan
                            </button>
                        </div>
                        <div className="space-y-3">
                            {goals.map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateList('goals', idx, e.target.value)}
                                        className="flex-1 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                                    />
                                    <button type="button" onClick={() => removeListItem('goals', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderFacilitiesEditor = () => {
        const facilityData = data.content || {};
        const facilities = Array.isArray(facilityData.items) ? facilityData.items : [];

        const updateFacilities = (newItems) => {
            updateContent('items', newItems);
        };

        const addFacility = () => {
            updateFacilities([...facilities, { title: '', description: '', icon: 'Building2' }]);
        };

        const removeFacility = (index) => {
            const newList = [...facilities];
            newList.splice(index, 1);
            updateFacilities(newList);
        };

        const updateFacility = (index, field, value) => {
            const newList = [...facilities];
            newList[index] = { ...newList[index], [field]: value };
            updateFacilities(newList);
        };

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-8">
                    <div className="md:col-span-2 space-y-4">
                        <label className="block text-sm font-bold text-gray-700">Judul Fasilitas</label>
                        <input
                            type="text"
                            value={facilityData.title || ''}
                            onChange={(e) => updateContent('title', e.target.value)}
                            className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <label className="block text-sm font-bold text-gray-700">Deskripsi Fasilitas</label>
                        <textarea
                            value={facilityData.description || ''}
                            onChange={(e) => updateContent('description', e.target.value)}
                            className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                            rows="2"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Daftar Fasilitas</h3>
                    <button
                        type="button"
                        onClick={addFacility}
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah Fasilitas
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {facilities.map((facility, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                            <button
                                type="button"
                                onClick={() => removeFacility(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nama Fasilitas</label>
                                    <input
                                        type="text"
                                        value={facility.title}
                                        onChange={(e) => updateFacility(index, 'title', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                                        placeholder="Contoh: Laboratorium Komputer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Deskripsi</label>
                                    <textarea
                                        value={facility.description}
                                        onChange={(e) => updateFacility(index, 'description', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                                        rows="2"
                                        placeholder="Jelaskan fasilitas..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Icon (Lucide)</label>
                                    <input
                                        type="text"
                                        value={facility.icon}
                                        onChange={(e) => updateFacility(index, 'icon', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                                        placeholder="Contoh: Monitor"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderOrganizationEditor = () => {
        const orgData = data.content || {};

        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h3 className="text-lg font-medium text-gray-900">Bagan Struktur Organisasi</h3>
                </div>
                
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700">Judul Struktur</label>
                    <input
                        type="text"
                        value={orgData.title || ''}
                        onChange={(e) => updateContent('title', e.target.value)}
                        className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                    />
                </div>

                <div className="space-y-4">
                    <FileUploadField
                        label="Gambar Bagan Struktur"
                        previewUrl={orgData.image_url}
                        onChange={(file) => updateContent('image', file)}
                    />
                </div>

                <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Tips:</p>
                        <p>Gunakan gambar dengan resolusi tinggi (minimal 1200px lebar) agar teks pada bagan tetap terbaca jelas saat diperbesar oleh pengunjung.</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <ContentManagementPage
            headerTitle="Konten Profil Sekolah"
            headTitle="Konten Profil Sekolah"
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
                                <p className="text-xs text-gray-500">Pilih halaman profil yang ingin dikelola banner utamanya</p>
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
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {activeTab === 'hero_sections' && renderHeroEditor()}
                {activeTab === 'history' && renderHistoryEditor()}
                {activeTab === 'vision_mission' && renderVisionMissionEditor()}
                {activeTab === 'facilities' && renderFacilitiesEditor()}
                {activeTab === 'organization' && renderOrganizationEditor()}
            </div>
        </ContentManagementPage>
    );
}
