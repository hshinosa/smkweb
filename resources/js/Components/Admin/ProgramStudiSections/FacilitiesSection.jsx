import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import FileUploadField from '@/Components/Admin/FileUploadField';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus, Trash2 } from 'lucide-react';

export default function FacilitiesSection({ data, setData, errors }) {
    const addItem = () => {
        const currentItems = Array.isArray(data.items) ? data.items : [];
        setData('items', [...currentItems, { title: '', image: null }]);
    };

    const removeItem = (index) => {
        const currentItems = Array.isArray(data.items) ? data.items : [];
        setData('items', currentItems.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const currentItems = Array.isArray(data.items) ? data.items : [];
        const newItems = [...currentItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            {/* Section Header */}
            <div className="space-y-4">
                <div>
                    <InputLabel htmlFor="fac_title" value="Judul Section" />
                    <TextInput
                        id="fac_title"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.title || ''}
                        onChange={(e) => setData('title', e.target.value)}
                    />
                </div>
                <div>
                    <InputLabel htmlFor="fac_desc" value="Deskripsi Section" />
                    <textarea
                        id="fac_desc"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        rows="2"
                        value={data.description || ''}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                </div>
            </div>

            {/* Main Facility */}
            <div className="border p-4 rounded-lg bg-blue-50">
                <h3 className="text-lg font-medium text-blue-900 mb-4">Fasilitas Utama (Highlight)</h3>
                <div className="space-y-4">
                    <div>
                        <InputLabel value="Judul Fasilitas Utama" />
                        <TextInput
                            type="text"
                            className="mt-1 block w-full"
                            value={data.main_title || ''}
                            onChange={(e) => setData('main_title', e.target.value)}
                        />
                    </div>
                    <div>
                        <InputLabel value="Deskripsi Fasilitas Utama" />
                        <textarea
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="3"
                            value={data.main_description || ''}
                            onChange={(e) => setData('main_description', e.target.value)}
                        />
                    </div>
                    <div>
                        <FileUploadField
                            id="main_fac_image"
                            previewUrl={data.main_image}
                            onChange={(file) => setData('main_image', file)}
                            label="Gambar Fasilitas Utama"
                            description="Gambar besar yang akan ditampilkan sebagai highlight fasilitas."
                        />
                    </div>
                </div>
            </div>

            {/* Other Facilities List */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Daftar Fasilitas Lainnya (Marquee)</h3>
                    <PrimaryButton 
                        type="button" 
                        onClick={addItem} 
                        className="px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all !bg-accent-yellow hover:!bg-[#EAB308] border-0 text-sm !text-gray-900"
                    >
                        <Plus size={16} /> 
                        <span className="font-bold">Tambah Fasilitas</span>
                    </PrimaryButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(data.items) && data.items.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50 relative">
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="space-y-3">
                                <div>
                                    <InputLabel value="Nama Fasilitas" />
                                    <TextInput
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={item.title || ''}
                                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <FileUploadField
                                        id={`fac_item_img_${index}`}
                                        previewUrl={item.image}
                                        onChange={(file) => updateItem(index, 'image', file)}
                                        label="Gambar Fasilitas"
                                        description="Gambar kecil untuk daftar fasilitas."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {(!data.items || data.items.length === 0) && (
                    <p className="text-gray-500 text-center py-4">Belum ada fasilitas tambahan.</p>
                )}
            </div>
        </div>
    );
}
