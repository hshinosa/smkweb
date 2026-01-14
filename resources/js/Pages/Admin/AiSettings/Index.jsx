// FILE: resources/js/Pages/Admin/AiSettings/Index.jsx
// Consistent design with accent color theme

import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Cpu, Zap, Database } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import toast from 'react-hot-toast';

export default function Index({ settings }) {
    const { success } = usePage().props;
    const [activeTab, setActiveTab] = useState('primary');

    // Convert settings array to object
    const settingsMap = {};
    settings.forEach(s => {
        settingsMap[s.key] = s.value;
    });

    const { data, setData, post, processing, errors } = useForm({
        settings: [
            // Primary AI Settings
            { key: 'ai_model_base_url', value: settingsMap.ai_model_base_url || '' },
            { key: 'ai_model_api_key', value: settingsMap.ai_model_api_key || '' },
            { key: 'ai_model_name', value: settingsMap.ai_model_name || '' },
            { key: 'ai_embedding_model', value: settingsMap.ai_embedding_model || '' },
            { key: 'ai_max_tokens', value: settingsMap.ai_max_tokens || '2000' },
            { key: 'ai_temperature', value: settingsMap.ai_temperature || '0.7' },
            
            // RAG Settings
            { key: 'rag_enabled', value: settingsMap.rag_enabled || '1' },
            { key: 'rag_top_k', value: settingsMap.rag_top_k || '5' },
            
            // Ollama Settings
            { key: 'use_ollama_fallback', value: settingsMap.use_ollama_fallback || '1' },
            { key: 'ollama_base_url', value: settingsMap.ollama_base_url || '' },
            { key: 'ollama_model', value: settingsMap.ollama_model || '' },
            { key: 'ollama_embedding_model', value: settingsMap.ollama_embedding_model || '' },
        ]
    });

    const tabs = [
        { key: 'primary', label: 'Primary AI', description: 'Konfigurasi AI utama (OpenAI-compatible API).', icon: Cpu },
        { key: 'ollama', label: 'Ollama Fallback', description: 'Backup AI lokal ketika primary timeout/error.', icon: Zap },
        { key: 'rag', label: 'RAG Settings', description: 'Pengaturan Retrieval Augmented Generation.', icon: Database },
    ];

    const handleChange = (key, value) => {
        const updatedSettings = data.settings.map(s => 
            s.key === key ? { ...s, value } : s
        );
        setData('settings', updatedSettings);
    };

    const getSetting = (key) => {
        return data.settings.find(s => s.key === key)?.value || '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.ai-settings.update'), {
            onSuccess: () => toast.success('Pengaturan AI berhasil diperbarui'),
        });
    };

    return (
        <ContentManagementPage 
            headerTitle="AI Settings" 
            headTitle="AI Settings"
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSave={handleSubmit}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Primary AI Settings */}
                {activeTab === 'primary' && (
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="ai_model_base_url" value="Base URL" />
                                    <TextInput
                                        id="ai_model_base_url"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={getSetting('ai_model_base_url')}
                                        onChange={(e) => handleChange('ai_model_base_url', e.target.value)}
                                        placeholder="https://api-ai.example.com/v1"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="ai_model_api_key" value="API Key" />
                                    <TextInput
                                        id="ai_model_api_key"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={getSetting('ai_model_api_key')}
                                        onChange={(e) => handleChange('ai_model_api_key', e.target.value)}
                                        placeholder="sk-xxxxx"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="ai_model_name" value="Chat Model" />
                                    <TextInput
                                        id="ai_model_name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={getSetting('ai_model_name')}
                                        onChange={(e) => handleChange('ai_model_name', e.target.value)}
                                        placeholder="gemini-claude-sonnet-4-5-thinking"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="ai_embedding_model" value="Embedding Model" />
                                    <TextInput
                                        id="ai_embedding_model"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={getSetting('ai_embedding_model')}
                                        onChange={(e) => handleChange('ai_embedding_model', e.target.value)}
                                        placeholder="text-embedding-3-small"
                                        disabled
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Embedding menggunakan Ollama (primary API tidak support)
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="ai_max_tokens" value="Max Tokens" />
                                    <TextInput
                                        id="ai_max_tokens"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={getSetting('ai_max_tokens')}
                                        onChange={(e) => handleChange('ai_max_tokens', e.target.value)}
                                        placeholder="2000"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="ai_temperature" value="Temperature (0-1)" />
                                    <TextInput
                                        id="ai_temperature"
                                        type="number"
                                        step="0.1"
                                        className="mt-1 block w-full"
                                        value={getSetting('ai_temperature')}
                                        onChange={(e) => handleChange('ai_temperature', e.target.value)}
                                        placeholder="0.7"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ollama Settings */}
                {activeTab === 'ollama' && (
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="use_ollama_fallback"
                                    checked={getSetting('use_ollama_fallback') === '1'}
                                    onChange={(e) => handleChange('use_ollama_fallback', e.target.checked ? '1' : '0')}
                                    className="h-4 w-4 text-accent-yellow focus:ring-accent-yellow border-gray-300 rounded"
                                />
                                <label htmlFor="use_ollama_fallback" className="ml-2 block text-sm font-medium text-gray-900">
                                    Aktifkan Ollama sebagai fallback
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="ollama_base_url" value="Ollama Base URL" />
                                    <TextInput
                                        id="ollama_base_url"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={getSetting('ollama_base_url')}
                                        onChange={(e) => handleChange('ollama_base_url', e.target.value)}
                                        placeholder="http://localhost:11434"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="ollama_model" value="Ollama Chat Model" />
                                    <TextInput
                                        id="ollama_model"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={getSetting('ollama_model')}
                                        onChange={(e) => handleChange('ollama_model', e.target.value)}
                                        placeholder="llama3.2"
                                    />
                                </div>
                            </div>
                            <div>
                                <InputLabel htmlFor="ollama_embedding_model" value="Ollama Embedding Model (CRITICAL untuk RAG)" />
                                <TextInput
                                    id="ollama_embedding_model"
                                    type="text"
                                    className="mt-1 block w-full md:w-1/2"
                                    value={getSetting('ollama_embedding_model')}
                                    onChange={(e) => handleChange('ollama_embedding_model', e.target.value)}
                                    placeholder="nomic-embed-text"
                                />
                                <p className="mt-1 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                                    ⚠️ PENTING: Model ini HARUS installed di Ollama untuk RAG system
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* RAG Settings */}
                {activeTab === 'rag' && (
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rag_enabled"
                                    checked={getSetting('rag_enabled') === '1'}
                                    onChange={(e) => handleChange('rag_enabled', e.target.checked ? '1' : '0')}
                                    className="h-4 w-4 text-accent-yellow focus:ring-accent-yellow border-gray-300 rounded"
                                />
                                <label htmlFor="rag_enabled" className="ml-2 block text-sm font-medium text-gray-900">
                                    Aktifkan RAG (Retrieval Augmented Generation)
                                </label>
                            </div>
                            <div>
                                <InputLabel htmlFor="rag_top_k" value="Top K Documents" />
                                <TextInput
                                    id="rag_top_k"
                                    type="number"
                                    className="mt-1 block w-full md:w-1/2"
                                    value={getSetting('rag_top_k')}
                                    onChange={(e) => handleChange('rag_top_k', e.target.value)}
                                    placeholder="5"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Jumlah dokumen yang diambil untuk setiap query (default: 5)
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </ContentManagementPage>
    );
}
