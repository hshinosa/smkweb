import React from 'react';
import { Info } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import MiniTextEditor from '@/Components/MiniTextEditor';
import FormSection from '@/Components/Admin/FormSection';

export default function GeneralSettingsSection({ data, setData, localErrors, formErrors }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <FormSection title="Konfigurasi Dasar SPMB" icon={Info}>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="pengaturan_umum_title" value="Judul Halaman" />
                            <TextInput
                                id="pengaturan_umum_title"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.pengaturan_umum.title || ''}
                                onChange={(e) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    title: e.target.value
                                })}
                                placeholder="Informasi Penerimaan Peserta Didik Baru"
                            />
                            <InputError message={localErrors['pengaturan_umum.title'] || formErrors['pengaturan_umum.title']} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pengaturan_umum_year" value="Tahun Ajaran" />
                            <TextInput
                                id="pengaturan_umum_year"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.pengaturan_umum.registration_year || ''}
                                onChange={(e) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    registration_year: e.target.value
                                })}
                                placeholder="2025/2026"
                            />
                            <InputError message={localErrors['pengaturan_umum.registration_year'] || formErrors['pengaturan_umum.registration_year']} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Deskripsi Utama" />
                        <div className="mt-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <MiniTextEditor
                                initialValue={data.pengaturan_umum.description_html || ''}
                                onChange={(value) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    description_html: value
                                })}
                                placeholder="Masukkan deskripsi utama halaman SPMB..."
                            />
                        </div>
                        <InputError message={localErrors['pengaturan_umum.description_html'] || formErrors['pengaturan_umum.description_html']} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="pengaturan_umum_banner" value="URL Banner Image" />
                            <TextInput
                                id="pengaturan_umum_banner"
                                type="url"
                                className="mt-1 block w-full"
                                value={data.pengaturan_umum.banner_image_url || ''}
                                onChange={(e) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    banner_image_url: e.target.value
                                })}
                                placeholder="https://example.com/banner.jpg"
                            />
                            <InputError message={localErrors['pengaturan_umum.banner_image_url'] || formErrors['pengaturan_umum.banner_image_url']} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pengaturan_umum_brochure" value="URL Brosur PDF" />
                            <TextInput
                                id="pengaturan_umum_brochure"
                                type="url"
                                className="mt-1 block w-full"
                                value={data.pengaturan_umum.brochure_url || ''}
                                onChange={(e) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    brochure_url: e.target.value
                                })}
                                placeholder="https://example.com/brosur.pdf"
                            />
                            <InputError message={localErrors['pengaturan_umum.brochure_url'] || formErrors['pengaturan_umum.brochure_url']} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="pengaturan_umum_whatsapp" value="Nomor WhatsApp Helpdesk" />
                            <TextInput
                                id="pengaturan_umum_whatsapp"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.pengaturan_umum.whatsapp_number || ''}
                                onChange={(e) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    whatsapp_number: e.target.value
                                })}
                                placeholder="628123456789"
                            />
                            <InputError message={localErrors['pengaturan_umum.whatsapp_number'] || formErrors['pengaturan_umum.whatsapp_number']} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pengaturan_umum_video" value="URL Video Panduan" />
                            <TextInput
                                id="pengaturan_umum_video"
                                type="url"
                                className="mt-1 block w-full"
                                value={data.pengaturan_umum.video_guide_url || ''}
                                onChange={(e) => setData('pengaturan_umum', {
                                    ...data.pengaturan_umum,
                                    video_guide_url: e.target.value
                                })}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                            <InputError message={localErrors['pengaturan_umum.video_guide_url'] || formErrors['pengaturan_umum.video_guide_url']} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Status Pendaftaran" />
                        <div className="mt-2 space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <input
                                    type="radio"
                                    name="is_registration_open"
                                    value="true"
                                    checked={data.pengaturan_umum.is_registration_open === true}
                                    onChange={() => setData('pengaturan_umum', {
                                        ...data.pengaturan_umum,
                                        is_registration_open: true
                                    })}
                                    className="mr-2"
                                />
                                Pendaftaran Dibuka
                            </label>
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <input
                                    type="radio"
                                    name="is_registration_open"
                                    value="false"
                                    checked={data.pengaturan_umum.is_registration_open === false}
                                    onChange={() => setData('pengaturan_umum', {
                                        ...data.pengaturan_umum,
                                        is_registration_open: false
                                    })}
                                    className="mr-2"
                                />
                                Pendaftaran Ditutup
                            </label>
                        </div>
                        <InputError message={localErrors['pengaturan_umum.is_registration_open'] || formErrors['pengaturan_umum.is_registration_open']} className="mt-2" />
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <InputLabel htmlFor="pengaturan_umum_announcement" value="Pengumuman Khusus (Jika Pendaftaran Ditutup)" />
                        <MiniTextEditor
                            initialValue={data.pengaturan_umum.announcement_text || ''}
                            onChange={(value) => setData('pengaturan_umum', {
                                ...data.pengaturan_umum,
                                announcement_text: value
                            })}
                            placeholder="Masukkan pengumuman khusus jika ada..."
                        />
                        <InputError message={localErrors['pengaturan_umum.announcement_text'] || formErrors['pengaturan_umum.announcement_text']} className="mt-2" />
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
