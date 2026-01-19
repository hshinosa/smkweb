// FILE: resources/js/Pages/Admin/InstagramSettings/Index.jsx
// Instagram Bot Account Management UI

import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Instagram, Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Activity } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import ContentManagementPage from '@/Components/Admin/ContentManagementPage';
import toast from 'react-hot-toast';

export default function Index({ accounts, statistics }) {
    const { success, error } = usePage().props;
    const [activeTab, setActiveTab] = useState('accounts');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [showPassword, setShowPassword] = useState({});

    // Form for adding new account
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        is_active: true,
        notes: '',
    });

    // Form for editing account
    const editForm = useForm({
        username: '',
        password: '',
        is_active: true,
        notes: '',
    });

    const tabs = [
        { key: 'accounts', label: 'Bot Accounts', description: 'Manage Instagram bot accounts', icon: Instagram },
        { key: 'statistics', label: 'Statistics', description: 'Scraping statistics and activity', icon: Activity },
    ];

    const handleAddAccount = (e) => {
        e.preventDefault();
        post(route('admin.instagram-bots.store'), {
            preserveScroll: false,
            onSuccess: () => {
                toast.success('Bot account berhasil ditambahkan');
                setShowAddModal(false);
                reset();
            },
            onError: (errors) => {
                console.error('Add errors:', errors);
                toast.error('Gagal menambahkan bot account');
            }
        });
    };

    const handleEditAccount = (e) => {
        e.preventDefault();
        
        console.log('Submitting edit:', {
            id: editingAccount.id,
            data: editForm.data,
            route: route('admin.instagram-bots.update', editingAccount.id)
        });
        
        editForm.put(route('admin.instagram-bots.update', editingAccount.id), {
            preserveScroll: false,
            preserveState: false,
            onSuccess: (page) => {
                console.log('Update success:', page);
                toast.success('Bot account berhasil diperbarui');
                setShowEditModal(false);
                setEditingAccount(null);
                editForm.reset();
            },
            onError: (errors) => {
                console.error('Update errors:', errors);
                toast.error('Gagal memperbarui bot account');
            }
        });
    };

    const handleDeleteAccount = (accountId, username) => {
        if (!confirm(`Yakin ingin menghapus bot account @${username}?`)) return;
        
        router.delete(route('admin.instagram-bots.destroy', accountId), {
            preserveScroll: false,
            onSuccess: () => toast.success('Bot account berhasil dihapus'),
            onError: () => toast.error('Gagal menghapus bot account'),
        });
    };

    const openEditModal = (account) => {
        setEditingAccount(account);
        editForm.setData({
            username: account.username,
            password: '', // Don't prefill password
            is_active: account.is_active,
            notes: account.notes || '',
        });
        setShowEditModal(true);
    };

    const testConnection = async (accountId) => {
        try {
            const response = await fetch(route('admin.instagram-bots.test', accountId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            const result = await response.json();
            
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error('Gagal test koneksi');
        }
    };

    const togglePasswordVisibility = (accountId) => {
        setShowPassword(prev => ({
            ...prev,
            [accountId]: !prev[accountId]
        }));
    };

    const getStatusBadge = (account) => {
        const badgeClasses = {
            'success': 'bg-green-100 text-green-800',
            'warning': 'bg-yellow-100 text-yellow-800',
            'danger': 'bg-red-100 text-red-800',
        };

        const icons = {
            'success': <CheckCircle className="w-4 h-4" />,
            'warning': <AlertCircle className="w-4 h-4" />,
            'danger': <XCircle className="w-4 h-4" />,
        };

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badgeClasses[account.status_badge]}`}>
                {icons[account.status_badge]}
                {account.status_text}
            </span>
        );
    };

    React.useEffect(() => {
        if (success) toast.success(success);
        if (error) toast.error(error);
    }, [success, error]);

    return (
        <ContentManagementPage 
            headerTitle="Instagram Bot Settings" 
            headTitle="Instagram Bot Settings"
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            noForm={true}
        >
            {/* Accounts Tab */}
            {activeTab === 'accounts' && (
                <div className="space-y-6">
                    {/* Add Button */}
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Manage Instagram bot accounts untuk scraping konten berita
                        </p>
                        <PrimaryButton type="button" onClick={() => setShowAddModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Bot Account
                        </PrimaryButton>
                    </div>

                    {/* Accounts List */}
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        {accounts.length === 0 ? (
                            <div className="p-12 text-center">
                                <Instagram className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 mb-4">Belum ada bot account</p>
                                <PrimaryButton type="button" onClick={() => setShowAddModal(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Bot Account
                                </PrimaryButton>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Username
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Password
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Used
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Notes
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {accounts.map((account) => (
                                            <tr key={account.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Instagram className="w-5 h-5 text-pink-500 mr-2" />
                                                        <span className="font-medium text-gray-900">@{account.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-sm text-gray-600 font-mono">
                                                            {showPassword[account.id] ? account.masked_password.replace(/•/g, '*') : account.masked_password}
                                                        </code>
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePasswordVisibility(account.id)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showPassword[account.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(account)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {account.last_used_at || 'Never'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {account.notes || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => testConnection(account.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Test Connection"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(account)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteAccount(account.id, account.username)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'statistics' && (
                <div className="space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Scraped</p>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.total_scraped}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Instagram className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Processing</p>
                                    <p className="text-2xl font-bold text-yellow-600">{statistics.pending_processing}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Processed</p>
                                    <p className="text-2xl font-bold text-green-600">{statistics.processed}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Errors</p>
                                    <p className="text-2xl font-bold text-red-600">{statistics.errors}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity by Source */}
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Top Sources</h3>
                        </div>
                        <div className="p-6">
                            {statistics.by_source.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No scraping activity yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {statistics.by_source.map((source, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Instagram className="w-5 h-5 text-pink-500" />
                                                <span className="font-medium text-gray-900">@{source.username}</span>
                                            </div>
                                            <span className="text-sm text-gray-600">{source.count} posts</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        </div>
                        <div className="p-6">
                            {statistics.recent_activity.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No recent activity</p>
                            ) : (
                                <div className="space-y-3">
                                    {statistics.recent_activity.map((activity, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Activity className="w-5 h-5 text-blue-500" />
                                                <span className="text-gray-900">@{activity.username}</span>
                                                <span className="text-sm text-gray-500">{activity.time}</span>
                                            </div>
                                            <span className={`text-xs px-2.5 py-1 rounded-full ${
                                                activity.status === 'Processed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {activity.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Account Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Add Bot Account</h3>
                        </div>
                        <form onSubmit={handleAddAccount}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <InputLabel htmlFor="username" value="Instagram Username" />
                                    <TextInput
                                        id="username"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        placeholder="username_bot"
                                        required
                                    />
                                    <InputError message={errors.username} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="notes" value="Notes (Optional)" />
                                    <textarea
                                        id="notes"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Catatan tentang bot account ini..."
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                        Active (enable scraping)
                                    </label>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                                <SecondaryButton type="button" onClick={() => { setShowAddModal(false); reset(); }}>
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Account'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Account Modal */}
            {showEditModal && editingAccount && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Bot Account</h3>
                        </div>
                        <form onSubmit={handleEditAccount}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <InputLabel htmlFor="edit_username" value="Instagram Username" />
                                    <TextInput
                                        id="edit_username"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={editForm.data.username}
                                        onChange={(e) => editForm.setData('username', e.target.value)}
                                        required
                                    />
                                    <InputError message={editForm.errors.username} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="edit_password" value="Password (leave empty to keep current)" />
                                    <TextInput
                                        id="edit_password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <InputError message={editForm.errors.password} className="mt-2" />
                                    <p className="mt-1 text-xs text-gray-500">Leave empty to keep current password</p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="edit_notes" value="Notes (Optional)" />
                                    <textarea
                                        id="edit_notes"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                        value={editForm.data.notes}
                                        onChange={(e) => editForm.setData('notes', e.target.value)}
                                        placeholder="Catatan tentang bot account ini..."
                                    />
                                    <InputError message={editForm.errors.notes} className="mt-2" />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="edit_is_active"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                    />
                                    <label htmlFor="edit_is_active" className="ml-2 text-sm text-gray-700">
                                        Active (enable scraping)
                                    </label>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                                <SecondaryButton 
                                    type="button" 
                                    onClick={() => { 
                                        setShowEditModal(false); 
                                        setEditingAccount(null); 
                                        editForm.reset(); 
                                    }}
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Updating...' : 'Update Account'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ContentManagementPage>
    );
}
