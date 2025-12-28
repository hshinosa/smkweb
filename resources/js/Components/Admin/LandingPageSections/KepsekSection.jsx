import React from 'react';
import { User } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import MiniTextEditor from '@/Components/MiniTextEditor';
import FileUploadField from '@/Components/Admin/FileUploadField';
import FormSection from '@/Components/Admin/FormSection';

export default function KepsekSection({ data, localErrors, formErrors, previewUrls, handleSectionInputChange, handleFileChange }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <FormSection title="Profil Kepala Sekolah" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="kepsek_title" value="Judul Bagian Sambutan" />
                        <TextInput id="kepsek_title" value={data.kepsek_welcome_lp?.title || ''}
                            onChange={e => handleSectionInputChange('kepsek_welcome_lp', 'title', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['kepsek_welcome_lp.title'] || formErrors['kepsek_welcome_lp.title']} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="kepsek_name" value="Nama Lengkap" />
                        <TextInput id="kepsek_name" value={data.kepsek_welcome_lp?.kepsek_name || ''}
                            onChange={e => handleSectionInputChange('kepsek_welcome_lp', 'kepsek_name', e.target.value)}
                            className="mt-1 block w-full" placeholder="Contoh: Dr. H. Nama, M.Pd" />
                        <InputError message={localErrors['kepsek_welcome_lp.kepsek_name'] || formErrors['kepsek_welcome_lp.kepsek_name']} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="kepsek_title_role" value="Jabatan" />
                        <TextInput id="kepsek_title_role" value={data.kepsek_welcome_lp?.kepsek_title || ''}
                            onChange={e => handleSectionInputChange('kepsek_welcome_lp', 'kepsek_title', e.target.value)}
                            className="mt-1 block w-full" placeholder="Contoh: Kepala Sekolah" />
                        <InputError message={localErrors['kepsek_welcome_lp.kepsek_title'] || formErrors['kepsek_welcome_lp.kepsek_title']} className="mt-1" />
                    </div>
                    <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <MiniTextEditor
                            label="Isi Sambutan"
                            initialValue={data.kepsek_welcome_lp?.welcome_text_html || ''}
                            onChange={html => handleSectionInputChange('kepsek_welcome_lp', 'welcome_text_html', html)}
                            error={localErrors['kepsek_welcome_lp.welcome_text_html'] || formErrors['kepsek_welcome_lp.welcome_text_html']}
                        />
                    </div>
                </div>
            </FormSection>

            <FileUploadField 
                id="kepsek_image"
                label="Foto Resmi Kepala Sekolah"
                previewUrl={data.kepsek_welcome_lp?.kepsek_image}
                error={localErrors['kepsekImage'] || localErrors['kepsek_welcome_lp.kepsek_image'] || formErrors['kepsek_welcome_lp.kepsek_image']}
                onChange={(file) => handleFileChange('kepsekImage', file)}
            />
        </div>
    );
}
