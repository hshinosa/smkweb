import React from 'react';
import { Save } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ContentEditorHeader({ title, description, icon: Icon, processing, onSave }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    {Icon && <Icon size={32} className="text-primary p-1.5 bg-blue-50 rounded-lg" />}
                    {title}
                </h2>
                <p className="text-gray-500 mt-1 ml-1">
                    {description}
                </p>
            </div>
            <PrimaryButton 
                onClick={onSave}
                disabled={processing} 
                className="px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all !bg-accent-yellow hover:!bg-[#EAB308] border-0 text-sm !text-gray-900"
            >
                <Save size={16} />
                <span className="font-bold">{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </PrimaryButton>
        </div>
    );
}
