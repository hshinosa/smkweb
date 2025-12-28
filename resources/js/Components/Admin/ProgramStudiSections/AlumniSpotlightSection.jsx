import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import FileUploadField from '@/Components/Admin/FileUploadField';

export default function AlumniSpotlightSection({ data, setData, errors }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div>
                <FileUploadField
                    id="alumni_image"
                    previewUrl={data.image}
                    onChange={(file) => setData('image', file)}
                    error={errors?.image}
                    label="Foto Alumni"
                    description="Foto alumni yang akan ditampilkan sebagai testimoni."
                />
            </div>

            <div>
                <InputLabel htmlFor="alumni_quote" value="Kutipan / Testimoni" />
                <textarea
                    id="alumni_quote"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    rows="4"
                    value={data.quote || ''}
                    onChange={(e) => setData('quote', e.target.value)}
                    placeholder="Tuliskan testimoni alumni di sini..."
                />
                {errors?.quote && <p className="text-red-500 text-sm mt-1">{errors.quote}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel htmlFor="alumni_name" value="Nama Alumni" />
                    <TextInput
                        id="alumni_name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.name || ''}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Contoh: Dr. Aditya"
                    />
                    {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                    <InputLabel htmlFor="alumni_desc" value="Keterangan (Tahun / Pekerjaan)" />
                    <TextInput
                        id="alumni_desc"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.description || ''}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Contoh: Alumni 2018 • Fakultas Kedokteran UI"
                    />
                    {errors?.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
            </div>
        </div>
    );
}
