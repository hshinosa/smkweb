import React from 'react';
import { Layout, Plus, Trash2 } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import FileUploadField from '@/Components/Admin/FileUploadField';
import FormSection from '@/Components/Admin/FormSection';

export default function HeroSection({ data, setData, localErrors, formErrors, previewUrls, handleSectionInputChange, handleFileChange }) {
    const addStat = () => {
        const currentStats = data.hero?.stats || [];
        setData('hero', {
            ...data.hero,
            stats: [...currentStats, { label: '', value: '', icon_name: 'Trophy' }]
        });
    };

    const removeStat = (index) => {
        const currentStats = data.hero?.stats || [];
        setData('hero', {
            ...data.hero,
            stats: currentStats.filter((_, i) => i !== index)
        });
    };

    const updateStat = (index, key, value) => {
        const currentStats = [...(data.hero?.stats || [])];
        currentStats[index] = { ...currentStats[index], [key]: value };
        setData('hero', {
            ...data.hero,
            stats: currentStats
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <FormSection title="Konten Utama" icon={Layout}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="hero_title_line1" value="Judul Baris 1" />
                        <TextInput id="hero_title_line1" value={data.hero?.title_line1 || ''}
                            onChange={e => handleSectionInputChange('hero', 'title_line1', e.target.value)}
                            className="mt-1 block w-full" placeholder="Contoh: SMAN 1" />
                        <InputError message={localErrors['hero.title_line1'] || formErrors['hero.title_line1']} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="hero_title_line2" value="Judul Baris 2 (Highlight)" />
                        <TextInput id="hero_title_line2" value={data.hero?.title_line2 || ''}
                            onChange={e => handleSectionInputChange('hero', 'title_line2', e.target.value)}
                            className="mt-1 block w-full" placeholder="Contoh: Baleendah" />
                        <InputError message={localErrors['hero.title_line2'] || formErrors['hero.title_line2']} className="mt-1" />
                    </div>
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="hero_text" value="Teks Deskripsi Hero" />
                        <textarea
                            id="hero_text"
                            value={data.hero?.hero_text || ''}
                            onChange={e => handleSectionInputChange('hero', 'hero_text', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm min-h-[100px]"
                            placeholder="Tuliskan deskripsi singkat yang menarik..."
                        ></textarea>
                        <InputError message={localErrors['hero.hero_text'] || formErrors['hero.hero_text']} className="mt-1" />
                    </div>
                </div>
            </FormSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FileUploadField 
                    id="hero_background_image"
                    label="Gambar Latar Belakang (Hero Image)"
                    previewUrl={previewUrls.heroBackgroundImage}
                    error={localErrors['heroBackgroundImage'] || localErrors['hero.background_image'] || formErrors['hero.background_image']}
                    onChange={(file) => handleFileChange('heroBackgroundImage', file)}
                />

                <FileUploadField 
                    id="hero_student_image"
                    label="Gambar Siswa (Foreground)"
                    previewUrl={previewUrls.heroStudentImage}
                    error={localErrors['heroStudentImage'] || localErrors['hero.student_image'] || formErrors['hero.student_image']}
                    onChange={(file) => handleFileChange('heroStudentImage', file)}
                />
            </div>

            <FormSection title="Statistik Melayang (Floating Cards)" icon={Layout}>
                <div className="space-y-4">
                    {(data.hero?.stats || []).map((stat, index) => (
                        <div key={index} className="flex flex-wrap md:flex-nowrap items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                            <div className="flex-1 min-w-[150px]">
                                <InputLabel value="Label" />
                                <TextInput 
                                    value={stat.label || ''} 
                                    onChange={e => updateStat(index, 'label', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Contoh: Akreditasi"
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <InputLabel value="Nilai" />
                                <TextInput 
                                    value={stat.value || ''} 
                                    onChange={e => updateStat(index, 'value', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Contoh: A (Unggul)"
                                />
                            </div>
                            <div className="w-full md:w-40">
                                <InputLabel value="Ikon (Lucide)" />
                                <select
                                    value={stat.icon_name || 'Trophy'}
                                    onChange={e => updateStat(index, 'icon_name', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm"
                                >
                                    <option value="Trophy">Trophy</option>
                                    <option value="GraduationCap">GraduationCap</option>
                                    <option value="Users">Users</option>
                                    <option value="Calendar">Calendar</option>
                                    <option value="Leaf">Leaf</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeStat(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addStat}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary font-bold rounded-xl hover:bg-blue-100 transition-colors"
                    >
                        <Plus size={20} />
                        Tambah Statistik
                    </button>
                </div>
            </FormSection>
        </div>
    );
}
