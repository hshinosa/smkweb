import React from 'react';
import { Info } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import MiniTextEditor from '@/Components/MiniTextEditor';
import FileUploadField from '@/Components/Admin/FileUploadField';
import FormSection from '@/Components/Admin/FormSection';

export default function AboutSection({ data, localErrors, formErrors, previewUrls, handleSectionInputChange, handleFileChange }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <FormSection title="Informasi Sekolah" icon={Info}>
                <div className="space-y-6">
                    <div>
                        <InputLabel htmlFor="about_lp_title" value="Judul Bagian Tentang" />
                        <TextInput id="about_lp_title" value={data.about_lp?.title || ''}
                            onChange={e => handleSectionInputChange('about_lp', 'title', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['about_lp.title'] || formErrors['about_lp.title']} className="mt-1" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <MiniTextEditor
                            label="Deskripsi Lengkap"
                            initialValue={data.about_lp?.description_html || ''}
                            onChange={html => handleSectionInputChange('about_lp', 'description_html', html)}
                            error={localErrors['about_lp.description_html'] || formErrors['about_lp.description_html']}
                        />
                    </div>
                </div>
            </FormSection>

            <FileUploadField 
                id="about_lp_image"
                label="Gambar Ilustrasi Tentang Sekolah"
                previewUrl={data.about_lp?.image}
                error={localErrors['aboutImage'] || localErrors['about_lp.image'] || formErrors['about_lp.image']}
                onChange={(file) => handleFileChange('aboutImage', file)}
            />
        </div>
    );
}
