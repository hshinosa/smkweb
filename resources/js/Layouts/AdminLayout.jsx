// FILE: resources/js/Layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import {
    ChevronDown, ChevronRight, LayoutDashboard, LogOut, Newspaper,
    CalendarDays, Info, FileText,
    Menu as MenuIcon, X as XIcon, UserCog // Hapus ikon yang tidak terpakai jika ada
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown'; // Untuk dropdown profil desktop
import { Transition } from '@headlessui/react'; // Import Transition

const logoSekolah = '/images/logo-sman1baleendah.png';

// Komponen SidebarItem (untuk item utama di sidebar desktop dan mobile)
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
    const indentClassDesktop = level === 1 ? 'ml-[1.3rem] border-l-2 border-gray-200 pl-2 pr-1' : 'ml-[1.3rem] border-l-2 border-gray-200 pl-5 pr-1'; // Indentasi desktop
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
        <li>
            <Tag
                href={!hasSubmenu && href ? href : undefined}
                type={Tag === 'button' ? 'button' : undefined}
                onClick={handleClick}
                className={`flex items-center justify-between w-full py-2 text-xs rounded-md ${activeClass} ${indentClass} ${isMobile ? 'px-3' : ''}`}
            >
                {children}
                {hasSubmenu && (
                     <ChevronRight size={14} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ml-auto ${isMobile ? 'mr-2' : 'mr-1'}`} />
                )}
            </Tag>
        </li>
    );
};

// Data link
const tentangKamiSidebarLinks = [
    { title: "Profil Sekolah", href: route('profil.sekolah')}, // Ganti # dengan route yang benar jika ada
    { title: "Visi & Misi", href: route('visi.misi')},
    { title: "Struktur Organisasi", href: route('struktur.organisasi')},
    { title: "Fasilitas", href: "#"}, // Ganti href jika ada
    { title: "Program Sekolah (Publik)", href: route('program.sekolah')},
    { title: "Daftar Guru & TU", href: "#"},
    { title: "Hubungi Kami", href: "#"},
];
const manajemenSekolahSidebarLinks = [
    { title: "Kurikulum", href: "#" },
    { title: "Kesiswaan", href: "#" },
    { title: "Humas & Industri", href: "#" },
    { title: "Sarana Prasarana", href: "#" },
];

const programKeahlianSubmenuLinks = [
    { title: "Pekerjaan Sosial", href: "#" },
    { title: "Kuliner", href: "#" },
    { title: "Perhotelan", href: "#" },
    { title: "Desain Komunikasi Visual", href: "#" },
];
const landingPageSubmenuLinks = [
    { title: "Hero Section", href: "#" },
    { title: "Tentang", href: "#" },
    { title: "Sambutan Kepala Sekolah", href: "#" },
    { title: "Program Keahlian (di LP)", href: "#" },
    { title: "Fakta", href: "#" },
];
const akademikSubmenuLinks = [
    { title: "Kalender Akademik", href: route('admin.academic-calendar.index') },
    { title: "Berita dan Pengumuman", href: "#" },
];


export default function AdminLayout({ children, headerTitle = "Dashboard Utama" }) {
    const { auth } = usePage().props;
    const admin = auth?.admin;

    const [openMenus, setOpenMenus] = useState({ /* ... state menu sama ... */ });
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
                        isActive={item.href && typeof route === 'function' && route().current(item.href)}
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
        { title: "Dashboard Utama", href: route('admin.dashboard'), icon: LayoutDashboard, submenuKey: 'dashboard' },
        {
            title: "Kelola Landing Page", // Nama diubah
            icon: Newspaper,
            href: route('admin.landingpage.content.index'), // Link langsung ke halaman pengelolaan
            submenuKey: 'landingPageContentManagement', // Key unik untuk state jika diperlukan (misal untuk active state)
            // sublinks dihapus karena semua form ada di satu halaman
        },
        {
            title: "Akademik & Informasi", icon: CalendarDays, submenuKey: 'akademik', sublinks: [
                ...akademikSubmenuLinks.map(s => ({...s, href: s.href || "#"})),
                { title: "Program Keahlian", submenuKey: 'programKeahlianAkademik', sublinks: programKeahlianSubmenuLinks.map(s => ({...s, href: s.href || "#"})) }
            ]
        },        {
            title: "Kelola Informasi SPMB", // Nama diubah untuk menunjukkan ini adalah halaman pengelolaan
            icon: FileText,
            href: route('admin.spmb.content.index'), // Link langsung ke halaman pengelolaan SPMB
            submenuKey: 'spmbContentManagement', // Key unik untuk state jika diperlukan (misal untuk active state)
            // sublinks dihapus karena semua form ada di satu halaman
        },
        {
            title: "Tentang Kami", icon: Info, submenuKey: 'tentangKami', sublinks: [
                ...tentangKamiSidebarLinks.map(s => ({...s, href: s.href || "#"})),
                { title: "Manajemen Sekolah", submenuKey: 'manajemenSekolah', sublinks: manajemenSekolahSidebarLinks.map(s => ({...s, href: s.href || "#"})) }
            ]
        }
    ];


    return (
        <div className="min-h-screen flex bg-gray-100">
            <Head title={`${headerTitle} - Admin SMAN 1 Baleendah`} />

            {/* Sidebar untuk Desktop */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex lg:flex-col fixed h-screen transform-gpu"> {/* Added transform-gpu for potentially smoother fixed positioning */}
                <div className="p-4 border-b border-gray-200">
                    <Link href={route('admin.dashboard')} className="flex items-center px-2">
                        <img src={logoSekolah} alt="Logo SMAN 1 Baleendah" className="h-10 w-auto" />
                        <span className="ml-3 text-lg font-semibold text-gray-800">SMAN 1 Baleendah</span>
                    </Link>
                </div>
                <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                    <ul>
                        {renderNavItemsRecursive(navigationStructure, 'sidebar', 0, false)}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-72"> {/* Padding kiri hanya untuk desktop */}
                <header className="bg-white shadow-sm border-b border-gray-200 p-3 sm:p-4 sticky top-0 z-30">
                    <div className="mx-auto flex justify-between items-center"> {/* Container dihilangkan untuk full width header */}
                        <div className="flex items-center">
                            <button onClick={toggleMobileMenu} className="lg:hidden p-2 mr-2 text-gray-600 hover:text-primary focus:outline-none">
                                {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                            </button>
                            <h1 className="text-md sm:text-xl font-semibold text-gray-700">{headerTitle}</h1>
                        </div>
                        <div className="flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center text-sm font-medium text-gray-700 hover:text-primary focus:outline-none p-1 sm:p-2 rounded-md hover:bg-gray-100">
                                        <img src={logoSekolah} alt="Profil Admin" className="h-7 w-7 rounded-full mr-0 sm:mr-2 object-cover" />
                                        <span className="hidden sm:inline">{admin ? admin.username : 'Admin'}</span>
                                        <ChevronDown size={16} className="ml-0 sm:ml-1" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link href={route('admin.logout')} method="post" as="button">
                                        <LogOut size={16} className="mr-2 inline-block text-red-500" />
                                        <span className="text-red-500">Logout</span>
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Mobile Navigation Menu dengan Transisi */}
                <Transition show={mobileMenuOpen} as={React.Fragment}>
                    <div className="lg:hidden fixed inset-0 z-40 flex" role="dialog" aria-modal="true">
                        {/* Overlay */}
                        <Transition.Child
                            as={React.Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={toggleMobileMenu}></div>
                        </Transition.Child>
                        
                        {/* Panel Menu */}
                        <Transition.Child
                            as={React.Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative flex flex-col w-72 max-w-[calc(100%-3rem)] bg-white h-full shadow-xl">
                                <div className="p-4 border-b flex justify-between items-center">
                                    <Link href={route('admin.dashboard')} className="flex items-center" onClick={closeMobileMenu}>
                                        <img src={logoSekolah} alt="Logo SMAN 1 Baleendah" className="h-8 w-auto" />
                                        <span className="ml-2 text-md font-semibold text-gray-800">SMAN 1 Baleendah</span>
                                    </Link>
                                    <button onClick={toggleMobileMenu} className="p-2 text-gray-500 hover:text-gray-700">
                                        <XIcon size={20} />
                                    </button>
                                </div>
                                <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                                    <ul>
                                        {renderNavItemsRecursive(navigationStructure, 'mobile', 0, true)}
                                    </ul>
                                    {/* Bagian profil di bawah menu mobile DIHAPUS */}
                                </nav>
                            </div>
                        </Transition.Child>
                    </div>
                </Transition>                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}