import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import FileUploadField from '@/Components/Admin/FileUploadField';

export default function HeroSection({ data, setData, errors }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div>
                <InputLabel htmlFor="hero_description" value="Deskripsi Singkat" />
                <textarea
                    id="hero_description"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    rows="4"
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Deskripsi singkat tentang program studi ini..."
                />
                {errors?.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
                <FileUploadField
                    id="hero_background_image"
                    previewUrl={data.background_image}
                    onChange={(file) => setData('background_image', file)}
                    error={errors?.background_image}
                    label="Background Image"
                    description="Gambar latar belakang untuk hero section program studi ini."
                />
                <p className="text-xs text-gray-500 mt-2 ml-1">Recommended size: 1920x1080px</p>
            </div>
        </div>
    );
}
