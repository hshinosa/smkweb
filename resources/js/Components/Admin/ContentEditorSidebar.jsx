import React, { useState } from 'react';
import { ChevronRight, Menu, X, ChevronDown } from 'lucide-react';

export default function ContentEditorSidebar({ tabs, activeTab, setActiveTab }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const activeTabData = tabs.find(t => t.key === activeTab);
    const ActiveIcon = activeTabData?.icon;

    return (
        <div className="lg:col-span-1 lg:sticky lg:top-6 z-30">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Mobile Header (Togglable) */}
                <div 
                    className="lg:hidden p-4 bg-primary text-white flex justify-between items-center cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-3">
                        {ActiveIcon && <ActiveIcon size={20} />}
                        <div>
                            <p className="text-[10px] uppercase font-bold opacity-70 leading-none mb-1">Menu Editor</p>
                            <h3 className="font-bold text-sm leading-none">{activeTabData?.label}</h3>
                        </div>
                    </div>
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        {isExpanded ? <X size={18} /> : <ChevronDown size={18} className="animate-bounce" />}
                    </div>
                </div>

                {/* Desktop Title (Hidden on Mobile) */}
                <div className="hidden lg:block mb-6 px-6 pt-6">
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Menu Editor</h1>
                    <p className="text-sm text-gray-500 mt-1">Konfigurasi konten halaman</p>
                </div>

                <nav className={`space-y-1 p-2 lg:p-4 lg:block ${isExpanded ? 'block' : 'hidden'}`}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    setIsExpanded(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-4 lg:py-5 text-left rounded-xl transition-all duration-200 group ${
                                    isActive 
                                    ? 'bg-blue-50 text-primary shadow-sm ring-1 ring-blue-100' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isActive ? 'bg-white text-primary shadow-sm' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary'}`}>
                                    <Icon size={20} className="lg:w-6 lg:h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className={`block font-bold text-sm lg:text-base truncate ${isActive ? 'text-gray-900' : ''}`}>{tab.label}</span>
                                    <span className="text-xs text-gray-400 hidden xl:block mt-1 leading-tight">
                                        {tab.description}
                                    </span>
                                </div>
                                {isActive && <ChevronRight size={18} className="ml-auto text-primary flex-shrink-0" />}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
