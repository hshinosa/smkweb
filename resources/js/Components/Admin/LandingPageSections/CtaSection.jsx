import React from 'react';
import { Megaphone } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import FormSection from '@/Components/Admin/FormSection';

export default function CtaSection({ data, handleSectionInputChange }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <FormSection title="Call to Action (CTA)" icon={Megaphone}>
                <div className="space-y-6">
                    <div>
                        <InputLabel htmlFor="cta_title" value="Judul Ajakan" />
                        <TextInput id="cta_title" value={data.cta_lp?.title || ''}
                            onChange={e => handleSectionInputChange('cta_lp', 'title', e.target.value)}
                            className="mt-1 block w-full" placeholder="Contoh: Siap Bergabung Bersama Kami?" />
                    </div>
                    <div>
                        <InputLabel htmlFor="cta_description" value="Deskripsi Ajakan" />
                        <textarea id="cta_description" value={data.cta_lp?.description || ''}
                            onChange={e => handleSectionInputChange('cta_lp', 'description', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows="3"></textarea>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
