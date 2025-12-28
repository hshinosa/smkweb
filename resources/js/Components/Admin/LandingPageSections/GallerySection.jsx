import React from 'react';
import { Image, ChevronRight } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import FormSection from '@/Components/Admin/FormSection';

export default function GallerySection({ data, handleSectionInputChange }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <FormSection title="Header Galeri" icon={Image}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="gallery_title" value="Judul Section" />
                        <TextInput id="gallery_title" value={data.gallery_lp?.title || ''}
                            onChange={e => handleSectionInputChange('gallery_lp', 'title', e.target.value)}
                            className="mt-1 block w-full" />
                    </div>
                    <div>
                        <InputLabel htmlFor="gallery_description" value="Deskripsi Singkat" />
                        <TextInput id="gallery_description" value={data.gallery_lp?.description || ''}
                            onChange={e => handleSectionInputChange('gallery_lp', 'description', e.target.value)}
                            className="mt-1 block w-full" />
                    </div>
                </div>
            </FormSection>

            <div className="p-8 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div>
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Manajemen Foto Galeri</h4>
                    <p className="text-gray-900 max-w-xl">
                        Upload, hapus, dan kelola foto-foto kegiatan sekolah untuk ditampilkan di galeri landing page.
                    </p>
                </div>
                <a 
                    href={route('admin.galleries.index')} 
                    className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center"
                >
                    Buka Halaman Galeri <ChevronRight size={18} className="ml-2" />
                </a>
            </div>
        </div>
    );
}
