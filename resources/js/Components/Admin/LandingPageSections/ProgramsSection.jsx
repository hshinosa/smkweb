import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import FormSection from '@/Components/Admin/FormSection';

export default function ProgramsSection({ data, localErrors, formErrors, handleSectionInputChange }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <FormSection title="Header Program" icon={BookOpen}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="programs_title" value="Judul Section" />
                        <TextInput id="programs_title" value={data.programs_lp?.title || ''}
                            onChange={e => handleSectionInputChange('programs_lp', 'title', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['programs_lp.title'] || formErrors['programs_lp.title']} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel htmlFor="programs_description" value="Deskripsi Singkat" />
                        <TextInput id="programs_description" value={data.programs_lp?.description || ''}
                            onChange={e => handleSectionInputChange('programs_lp', 'description', e.target.value)}
                            className="mt-1 block w-full" />
                        <InputError message={localErrors['programs_lp.description'] || formErrors['programs_lp.description']} className="mt-1" />
                    </div>
                </div>
            </FormSection>

            <div className="p-8 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div>
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Manajemen Program Studi</h4>
                    <p className="text-gray-900 max-w-xl">
                        Kelola detail konten untuk setiap program studi (MIPA, IPS, Bahasa) seperti kurikulum, fasilitas, dan prospek karir.
                    </p>
                </div>
                <a 
                    href={route('admin.program-studi.index')} 
                    className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center"
                >
                    Buka Halaman Program Studi <ChevronRight size={18} className="ml-2" />
                </a>
            </div>
        </div>
    );
}
