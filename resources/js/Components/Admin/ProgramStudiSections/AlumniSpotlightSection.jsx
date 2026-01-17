import React from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import FileUploadField from '@/Components/Admin/FileUploadField';
import { getImageUrl } from '@/Utils/imageUtils';

export default function AlumniSpotlightSection({ data, setData, errors }) {
    return (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
            <div className="border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    Alumni Spotlight
                </h3>
                <p className="text-sm text-gray-600 mt-1">Testimoni alumni program studi</p>
            </div>

            <div>
                <FileUploadField
                    id="alumni_image"
                    previewUrl={getImageUrl(data.image)}
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
                <p className="text-sm text-gray-500 mt-1">Testimoni atau kutipan dari alumni</p>
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
                    <p className="text-sm text-gray-500 mt-1">Nama lengkap alumni</p>
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
                    <p className="text-sm text-gray-500 mt-1">Tahun lulus dan pencapaian</p>
                    {errors?.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
            </div>
        </div>
    );
}
