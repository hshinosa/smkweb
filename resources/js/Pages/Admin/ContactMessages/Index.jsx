import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Trash2, Eye, CheckCircle, Clock } from 'lucide-react';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';

export default function Index({ messages }) {
    const { delete: destroy } = useForm();
    const [activeTab, setActiveTab] = useState('list');

    const tabs = [
        { key: 'list', label: 'Pesan Masuk', description: 'Lihat dan kelola pesan dari formulir kontak situs.', icon: Mail },
    ];

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
            destroy(route('admin.contact-messages.destroy', id));
        }
    };

    return (
        <ContentManagementPage
            headerTitle="Interaksi & Pesan"
            headTitle="Pesan Kontak"
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Pengirim</th>
                                <th className="px-6 py-4 font-semibold">Subjek</th>
                                <th className="px-6 py-4 font-semibold">Tanggal</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {messages.data.length > 0 ? (
                                messages.data.map((message) => (
                                    <tr key={message.id} className={`hover:bg-gray-50 transition-colors ${!message.is_read ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            {message.is_read ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3" /> Dibaca
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <Clock className="w-3 h-3" /> Baru
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{message.name}</div>
                                            <div className="text-xs text-gray-500">{message.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 line-clamp-1">{message.subject}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(message.created_at).toLocaleDateString('id-ID', { 
                                                day: 'numeric', 
                                                month: 'short', 
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link 
                                                href={route('admin.contact-messages.show', message.id)}
                                                className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(message.id)}
                                                className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>Belum ada pesan masuk.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {messages.links && messages.links.length > 3 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-center gap-2">
                        {messages.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1 rounded-md text-sm ${
                                    link.active 
                                        ? 'bg-primary text-white' 
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </ContentManagementPage>
    );
}