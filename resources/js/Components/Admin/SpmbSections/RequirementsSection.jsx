import React from 'react';
import { FileText, X, Plus, Info } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import MiniTextEditor from '@/Components/MiniTextEditor';
import FormSection from '@/Components/Admin/FormSection';

export default function RequirementsSection({ data, setData, addRequirement, removeRequirement, updateRequirement }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-blue-900 flex items-center">
                    <FileText size={20} className="mr-2" /> Dokumen Persyaratan
                </h3>
                <button
                    type="button"
                    onClick={addRequirement}
                    className="px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all !bg-accent-yellow hover:!bg-[#EAB308] border-0 text-sm !text-gray-900 font-bold rounded-xl"
                >
                    <Plus size={16} />
                    Tambah Dokumen
                </button>
            </div>

            <div className="space-y-4">
                    {(data.persyaratan.items || []).map((doc, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-md font-bold text-gray-800">Dokumen {index + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => removeRequirement(index)}
                                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel value="Nama Dokumen" />
                                        <TextInput
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={doc.name}
                                            onChange={(e) => updateRequirement(index, 'name', e.target.value)}
                                            placeholder="Contoh: Ijazah SMP/MTs"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={doc.required || false}
                                                onChange={(e) => updateRequirement(index, 'required', e.target.checked)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary h-5 w-5"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">Dokumen Wajib</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div>
                                    <InputLabel value="Deskripsi" />
                                    <TextInput
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={doc.description}
                                        onChange={(e) => updateRequirement(index, 'description', e.target.value)}
                                        placeholder="Keterangan tambahan tentang dokumen..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!data.persyaratan.items || data.persyaratan.items.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                            Belum ada dokumen persyaratan yang ditambahkan.
                        </div>
                    )}
                </div>

                <FormSection title="Catatan Tambahan" icon={Info}>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <MiniTextEditor
                        initialValue={data.persyaratan.additional_notes || ''}
                        onChange={(value) => setData('persyaratan', {
                            ...data.persyaratan,
                            additional_notes: value
                        })}
                        placeholder="Catatan tambahan tentang persyaratan..."
                    />
                </div>
            </FormSection>
        </div>
    );
}
