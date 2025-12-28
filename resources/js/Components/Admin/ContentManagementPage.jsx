import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ContentEditorSidebar from '@/Components/Admin/ContentEditorSidebar';
import ContentEditorHeader from '@/Components/Admin/ContentEditorHeader';

export default function ContentManagementPage({ 
    headerTitle, 
    headTitle, 
    tabs, 
    activeTab, 
    setActiveTab, 
    processing, 
    onSave, 
    success, 
    errors = {}, 
    extraHeader,
    children 
}) {
    const activeTabData = tabs.find(t => t.key === activeTab);

    return (
        <AdminLayout headerTitle={headerTitle}>
            <Head title={headTitle} />
            <div className="max-w-screen-2xl mx-auto p-2 sm:p-4">
                {/* Extra Header (e.g., Program Selector) */}
                {extraHeader && (
                    <div className="mb-6">
                        {extraHeader}
                    </div>
                )}

                {/* Success & Error Messages */}
                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r shadow-sm animate-fade-in-up flex items-center">
                        <div className="bg-green-100 rounded-full p-1 mr-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <span className="font-medium">{success}</span>
                    </div>
                )}
                {(errors.general || Object.keys(errors).length > 0) && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm animate-fade-in-up">
                        <p className="font-bold flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            Perhatian
                        </p>
                        <p className="mt-1 text-sm">
                            {errors.general || 'Terdapat kesalahan dalam pengisian form. Silakan periksa kembali field yang berwarna merah.'}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Sidebar Navigation */}
                    <ContentEditorSidebar 
                        tabs={tabs} 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                    />

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                         <form onSubmit={onSave}>
                            {/* Header Content */}
                            <ContentEditorHeader 
                                title={activeTabData?.label}
                                description={activeTabData?.description}
                                icon={activeTabData?.icon}
                                processing={processing}
                                onSave={onSave}
                            />

                            {/* Form Content */}
                            <div className="animate-fade-in">
                                {children}
                            </div>
                         </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
