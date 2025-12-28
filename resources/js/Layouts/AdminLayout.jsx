// FILE: resources/js/Layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import {
    ChevronDown, ChevronRight, LayoutDashboard, LogOut, Newspaper,
    CalendarDays, Info, FileText, Image as ImageIcon, LayoutGrid,
    Menu as MenuIcon, X as XIcon, UserCog, Star, Mail, Settings
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import { Transition } from '@headlessui/react';
import ChatWidget from '@/Components/ChatWidget';

const SidebarItem = ({ href, icon: Icon, children, isActive, hasSubmenu, isOpen, onClick, isMobile = false, level = 0, closeMobileMenu }) => {
    const activeClass = isActive ? 'bg-primary/10 text-primary font-semibold' : (isMobile ? 'hover:bg-gray-100' : 'hover:bg-gray-50');
    const Tag = hasSubmenu ? 'button' : Link;
    const paddingLeft = isMobile ? `pl-${4 + level * 4}` : '';

    const handleClick = (e) => {
        if (hasSubmenu && onClick) {
            onClick(e);
        } else if (isMobile && !hasSubmenu && closeMobileMenu) {
            closeMobileMenu(); // Tutup menu mobile jika ini adalah link langsung di mobile
        }
        // Untuk Link, navigasi akan ditangani oleh Inertia
    };

    return (
        <li>
            <Tag
                href={!hasSubmenu && href ? href : undefined}
                type={Tag === 'button' ? 'button' : undefined}
                onClick={handleClick} // Gunakan handler baru
                className={`flex items-center justify-between w-full p-3 text-sm font-medium rounded-md transition-colors ${activeClass} ${paddingLeft}`}
            >
                <span className="flex items-center">
                    {Icon && <Icon size={18} className="mr-3 flex-shrink-0" />}
                    {children}
                </span>
                {hasSubmenu && (
                    <ChevronDown size={16} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ml-auto`} />
                )}
            </Tag>
        </li>
    );
};

// Komponen SubmenuItem (untuk item di dalam dropdown di sidebar desktop dan mobile)
const SubmenuItem = ({ href, children, isActive, hasSubmenu, isOpen, onClick, level = 1, isMobile = false, closeMobileMenu }) => {
    const activeClass = isActive ? 'text-primary font-semibold' : 'hover:text-primary';
    const Tag = hasSubmenu ? 'button' : Link;
    const indentClassDesktop = level === 1 ? 'border-l-2 border-gray-200 pl-4' : 'border-l-2 border-gray-200 pl-6'; // Indentasi desktop
    const indentClassMobile = `pl-${4 + level * 4} pr-3`; // Indentasi mobile
    const indentClass = isMobile ? indentClassMobile : indentClassDesktop;

    const handleClick = (e) => {
        if (hasSubmenu && onClick) {
            onClick(e);
        } else if (isMobile && !hasSubmenu && closeMobileMenu) {
            closeMobileMenu();
        }
    };

    return (
        <li className={!isMobile ? 'ml-[1.3rem]' : ''}>
            <Tag
                href={!hasSubmenu && href ? href : undefined}
                type={Tag === 'button' ? 'button' : undefined}
                onClick={handleClick}
                className={`flex items-center justify-between w-full py-2 text-xs rounded-md transition-all ${activeClass} ${indentClass} ${isMobile ? 'px-3' : ''}`}
            >
                {children}
                {hasSubmenu && (
                     <ChevronRight size={14} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ml-auto ${isMobile ? 'mr-2' : 'mr-1'}`} />
                )}
            </Tag>
        </li>
    );
};

export default function AdminLayout({ children, headerTitle = "Dashboard Utama" }) {
    const { auth, siteSettings } = usePage().props;
    const admin = auth?.admin;
    
    // Fix image URL handling: use asset helper logic if path doesn't start with http or /
    const getAssetUrl = (path, fallback) => {
        if (!path) return fallback;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    const logoSekolah = getAssetUrl(siteSettings?.general?.site_logo, '/images/logo-sman1-baleendah.png');
    const siteName = siteSettings?.general?.site_name || 'SMAN 1 Baleendah';

    const [openMenus, setOpenMenus] = useState({
        konten_utama: true,
        master_data: true,
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMenu = (menuName) => (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setMobileMenuOpen(false);


    const renderNavItemsRecursive = (items, parentKey, currentLevel, isMobile) => {
        return items.map(item => {
            const ItemOrSubItemComponent = currentLevel === 0 ? SidebarItem : SubmenuItem;
            const menuKey = item.submenuKey || item.title.toLowerCase().replace(/\s+/g, '_').replace(/[&()]/g, ''); // lebih aman untuk key
            const hasSubmenu = !!item.sublinks && item.sublinks.length > 0;

            return (
                <React.Fragment key={`${parentKey}-${menuKey}`}>
                    <ItemOrSubItemComponent
                        href={!hasSubmenu ? item.href : undefined}
                        icon={currentLevel === 0 ? item.icon : undefined}
                        isActive={item.routeName ? route().current(item.routeName) : (item.href && item.href !== '#' && route().current(item.href))}
                        hasSubmenu={hasSubmenu}
                        isOpen={openMenus[menuKey]}
                        onClick={hasSubmenu ? toggleMenu(menuKey) : undefined}
                        isMobile={isMobile}
                        level={currentLevel}
                        closeMobileMenu={closeMobileMenu} // Teruskan fungsi closeMobileMenu
                    >
                        {item.title}
                    </ItemOrSubItemComponent>
                    {hasSubmenu && openMenus[menuKey] && (
                        <ul className={`space-y-px ${isMobile ? '' : 'submenu-desktop-wrapper'}`}>
                            {renderNavItemsRecursive(item.sublinks, menuKey, currentLevel + 1, isMobile)}
                        </ul>
                    )}
                </React.Fragment>
            );
        });
    };

    const navigationStructure = [
        { title: "Dashboard Utama", href: route('admin.dashboard'), icon: LayoutDashboard, routeName: 'admin.dashboard' },
        {
            title: "Kelola Konten Utama",
            icon: LayoutGrid,
            submenuKey: 'konten_utama',
            sublinks: [
                { title: "Landing Page", href: route('admin.landingpage.content.index'), routeName: 'admin.landingpage.content.*' },
                { title: "Informasi SPMB", href: route('admin.spmb.index'), routeName: 'admin.spmb.*' },
                { title: "Program Studi", href: route('admin.program-studi.index'), routeName: 'admin.program-studi.*' },
                { title: "Profil Sekolah", href: route('admin.school-profile.index'), routeName: 'admin.school-profile.*' },
                { title: "Kurikulum", href: route('admin.curriculum.index'), routeName: 'admin.curriculum.*' },
                { title: "Kalender Akademik", href: route('admin.academic-calendar.index'), routeName: 'admin.academic-calendar.*' },
            ]
        },
        {
            title: "Master Data & Berita",
            icon: Newspaper,
            submenuKey: 'master_data',
            sublinks: [
                { title: "Berita & Pengumuman", href: route('admin.posts.index'), routeName: 'admin.posts.*' },
                { title: "Guru & Staff", href: route('admin.teachers.index'), routeName: 'admin.teachers.*' },
                { title: "Ekstrakurikuler", href: route('admin.extracurriculars.index'), routeName: 'admin.extracurriculars.*' },
                { title: "Jejak Alumni", href: route('admin.alumni.index'), routeName: 'admin.alumni.*' },
                { title: "Galeri Sekolah", href: route('admin.galleries.index'), routeName: 'admin.galleries.*' },
                { title: "FAQ", href: route('admin.faqs.index'), routeName: 'admin.faqs.*' },
            ]
        },
        {
            title: "Interaksi & Pesan",
            icon: Mail,
            href: route('admin.contact-messages.index'),
            routeName: 'admin.contact-messages.*',
        },
        {
            title: "Pengaturan Situs",
            icon: Settings,
            href: route('admin.site-settings.index'),
            routeName: 'admin.site-settings.*',
        }
    ];


    return (
        <div className="h-screen flex bg-gray-100 overflow-hidden">
            <Head title={`${headerTitle} - Admin ${siteName}`} />

            {/* Sidebar untuk Desktop */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex lg:flex-col fixed h-screen transform-gpu">
                <div className="p-4 border-b border-gray-200">
                    <Link href={route('admin.dashboard')} className="flex items-center px-2">
                        <img src={logoSekolah} alt={`Logo ${siteName}`} className="h-10 w-auto" />
                        <span className="ml-3 text-lg font-semibold text-gray-800">{siteName}</span>
                    </Link>
                </div>
                <nav className="flex-grow p-4 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                    <ul>
                        {renderNavItemsRecursive(navigationStructure, 'sidebar', 0, false)}
                    </ul>
                </nav>

                {/* Profile Section at Bottom */}
                <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50/50">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center w-full text-left text-sm font-medium text-gray-700 hover:bg-white p-2 rounded-xl transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
                                <img src={logoSekolah} alt="Profil Admin" className="h-9 w-9 rounded-full mr-3 object-cover border border-gray-200 shadow-sm" />
                                <div className="flex-grow min-w-0 mr-2">
                                    <p className="font-bold text-gray-900 truncate">{admin ? admin.username : 'Admin'}</p>
                                    <p className="text-xs text-gray-500 truncate capitalize">Administrator</p>
                                </div>
                                <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="top" width="48" contentClasses="py-1 bg-white mb-2 shadow-2xl border border-gray-100 rounded-xl overflow-hidden">
                            <div className="px-4 py-2 border-b border-gray-50 bg-gray-50/30 mb-1">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-medium text-gray-600">Online</span>
                                </div>
                            </div>
                            <Dropdown.Link href={route('admin.logout')} method="post" as="button" className="w-full text-left">
                                <div className="flex items-center text-red-600 hover:text-red-700 transition-colors">
                                    <LogOut size={16} className="mr-2" />
                                    <span className="font-semibold">Keluar</span>
                                </div>
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-72"> {/* Padding kiri hanya untuk desktop */}
                {/* Mobile Header (Visible only on mobile/tablet) */}
                <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-40">
                    <button 
                        onClick={toggleMobileMenu} 
                        className="p-2 -ml-2 text-gray-600 hover:text-primary focus:outline-none transition-colors"
                        aria-label="Toggle Menu"
                    >
                        <MenuIcon size={24} />
                    </button>
                    <div className="ml-3 flex items-center gap-3 overflow-hidden">
                        <img src={logoSekolah} alt="Logo" className="h-8 w-auto flex-shrink-0" />
                        <h1 className="text-sm font-bold text-gray-800 truncate uppercase tracking-wider">{headerTitle}</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto pt-4 sm:pt-6">
                    {/* Page Header (Title) - Integrated into main area for desktop */}
                    <div className="px-4 sm:px-6 mb-2 hidden lg:block">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">{headerTitle}</h1>
                    </div>
                    {children}
                </main>

                {/* Mobile Navigation Menu with Transition */}
                <Transition show={mobileMenuOpen} as={React.Fragment}>
                    <div className="lg:hidden fixed inset-0 z-[60] flex" role="dialog" aria-modal="true">
                        <Transition.Child
                            as={React.Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" onClick={toggleMobileMenu}></div>
                        </Transition.Child>
                        
                        <Transition.Child
                            as={React.Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative flex flex-col w-80 max-w-[calc(100%-3rem)] bg-white h-full shadow-2xl">
                                <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                                    <Link href={route('admin.dashboard')} className="flex items-center" onClick={closeMobileMenu}>
                                        <img src={logoSekolah} alt={`Logo ${siteName}`} className="h-10 w-auto" />
                                        <span className="ml-2 text-md font-bold text-gray-800">{siteName}</span>
                                    </Link>
                                    <button onClick={toggleMobileMenu} className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-full">
                                        <XIcon size={20} />
                                    </button>
                                </div>
                                <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                                    <ul>
                                        {renderNavItemsRecursive(navigationStructure, 'mobile', 0, true)}
                                    </ul>
                                </nav>
                                
                                {/* Mobile Profile Section */}
                                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center min-w-0">
                                            <img src={logoSekolah} alt="Profil Admin" className="h-10 w-10 rounded-full mr-3 object-cover border-2 border-primary/10 shadow-sm" />
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900 truncate text-sm">{admin ? admin.username : 'Admin'}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Administrator</p>
                                            </div>
                                        </div>
                                        <Link 
                                            href={route('admin.logout')} 
                                            method="post" 
                                            as="button" 
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Logout"
                                        >
                                            <LogOut size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Transition>

                <ChatWidget />
            </div>
        </div>
    );
}