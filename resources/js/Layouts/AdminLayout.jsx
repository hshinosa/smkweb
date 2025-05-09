// FILE: resources/js/Layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, usePage, Head, useForm } from '@inertiajs/react'; // <--- TAMBAHKAN useForm DI SINI
import {
    ChevronDown, ChevronRight, LayoutDashboard, LogOut, Settings, Newspaper,
    CalendarDays, Users, Briefcase, Info, GraduationCap, Handshake, Wrench, UserCog,
    FileText, Award, Library, Phone, School, UsersRound, Building // Pastikan semua ikon yang dipakai diimpor
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

const logoSekolah = '/images/logo-smkn15.png';

// Komponen SidebarItem (untuk item utama yang bisa jadi tombol dropdown atau link langsung)
const SidebarItem = ({ href, icon: Icon, children, isActive, hasSubmenu, isOpen, onClick }) => {
    const activeClass = isActive ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100';
    // Jika tidak ada onClick (artinya ini link langsung, bukan tombol dropdown) dan ada href, gunakan Link
    // Jika ada onClick (artinya ini tombol dropdown), gunakan button
    const isDirectLink = !hasSubmenu && href && href !== '#';
    const Tag = isDirectLink ? Link : 'button';

    return (
        <li>
            <Tag
                href={isDirectLink ? href : undefined} // Hanya set href jika Link
                type={Tag === 'button' ? 'button' : undefined}
                onClick={Tag === 'button' ? onClick : undefined} // onClick hanya untuk button
                className={`flex items-center justify-between w-full p-3 text-sm font-medium rounded-md transition-colors ${activeClass}`}
            >
                <span className="flex items-center">
                    {Icon && <Icon size={18} className="mr-3 flex-shrink-0" />}
                    {children}
                </span>
                {hasSubmenu && <ChevronDown size={16} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ml-auto`} />}
            </Tag>
        </li>
    );
};

// Komponen SubmenuItem (untuk item di dalam dropdown, bisa juga punya submenu lagi)
const SubmenuItem = ({ href, children, isActive, hasSubmenu, isOpen, onClick, level = 1 }) => {
    const activeClass = isActive ? 'text-primary font-semibold' : 'hover:text-primary';
    const isNestedDropdownButton = hasSubmenu; // Jika punya submenu lagi, dia adalah tombol
    const Tag = isNestedDropdownButton ? 'button' : Link;
    const indentClass = level === 1 ? 'ml-1' : 'ml-4'; // ml-4 untuk level 1, ml-12 untuk level 2
    return (
        <li>
            <Tag
                href={!isNestedDropdownButton && href ? href : undefined}
                type={isNestedDropdownButton ? 'button' : undefined}
                onClick={isNestedDropdownButton ? onClick : undefined}
                className={`flex items-center justify-between w-full py-2 px-3 text-xs rounded-md ${activeClass} ${indentClass}`}
            >
                {children}
                {hasSubmenu && <ChevronRight size={14} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ml-auto mr-10`} />} {/* Tambahkan mr-2 di sini */}
            </Tag>
        </li>
    );
};


// Data link (gunakan placeholder # jika rute admin belum siap)
const tentangKamiSidebarLinks = [
    { title: "Profil Sekolah", href: "#"},
    { title: "Visi & Misi", href: "#"},
    { title: "Struktur Organisasi", href: "#"},
    { title: "Fasilitas", href: "#"},
    { title: "Program Sekolah (Publik)", href: "#"},
    { title: "Daftar Guru & TU", href: "#"},
    { title: "Hubungi Kami", href: "#"},
];
const manajemenSekolahSidebarLinks = [
    { title: "Kurikulum", href: "#" },
    { title: "Kesiswaan", href: "#" },
    { title: "Humas & Industri", href: "#" },
    { title: "Sarana Prasarana", href: "#" },
];
const informasiSpmbSidebarLinks = [
    { title: "Pengaturan Umum SPMB", href: "#"},
    { title: "Jalur Pendaftaran", href: "#"},
    { title: "Jadwal Penting", href: "#"},
    { title: "Persyaratan", href: "#"},
    { title: "Prosedur", href: "#"},
    { title: "FAQ SPMB", href: "#"},
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
    { title: "Kalender Akademik", href: "#" },
    { title: "Berita dan Pengumuman", href: "#" },
];

export default function AdminLayout({ children, headerTitle = "Dashboard Utama" }) {
    const { auth, errors: pageErrors, status } = usePage().props;
    const admin = auth?.admin; // Gunakan optional chaining

    const [openMenus, setOpenMenus] = useState({
        landingPage: false,
        akademik: false,
        programKeahlianAkademik: false,
        tentangKami: false,
        manajemenSekolah: false,
        informasiSpmb: false,
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: processingPassword, errors: passwordErrors, reset: resetPasswordForm, recentlySuccessful: passwordRecentlySuccessful } = useForm({
        current_password: '', password: '', password_confirmation: '',
    });

    const toggleMenu = (menuName) => (e) => {
        // Pastikan event ada sebelum memanggil preventDefault
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    // ... (fungsi password modal tetap sama) ...
    const openPasswordModal = () => { resetPasswordForm(); setShowPasswordModal(true); };
    const closePasswordModal = () => setShowPasswordModal(false);
    const handlePasswordUpdate = (e) => { e.preventDefault(); updatePassword(route('admin.password.update'), { preserveScroll: true, onSuccess: () => closePasswordModal(), }); };
    useEffect(() => { if (passwordRecentlySuccessful) { resetPasswordForm('current_password', 'password', 'password_confirmation'); } }, [passwordRecentlySuccessful]);

    return (
        <div className="min-h-screen flex bg-gray-100">
            <Head title={`${headerTitle} - Admin SMKN 15 Bandung`} />

            {/* Sidebar */}
            {/* Beri lebar tetap, flex-col, dan h-screen agar tingginya penuh */}
            <aside className="w-80 bg-white border-r border-gray-200 flex flex-col fixed h-screen lg:sticky lg:top-0">
                {/* Bagian Logo (tidak ikut scroll) */}
                <div className="p-4 border-b border-gray-200"> {/* Tambahkan border-b untuk pemisah */}
                    <Link href={route('admin.dashboard')} className="flex items-center px-2">
                        <img src={logoSekolah} alt="Logo SMKN 15" className="h-10 w-auto" />
                        <span className="ml-3 text-lg font-semibold text-gray-800">SMKN 15 Bandung</span>
                    </Link>
                </div>

                {/* Bagian Navigasi (bisa di-scroll) */}
                {/* flex-grow agar mengambil sisa tinggi, overflow-y-auto untuk scroll vertikal */}
                <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                    <ul>
                        <SidebarItem href={route('admin.dashboard')} icon={LayoutDashboard} isActive={route().current('admin.dashboard')}>
                            Dashboard Utama
                        </SidebarItem>

                        {/* Landing Page Dropdown */}
                        <SidebarItem icon={Newspaper} hasSubmenu isOpen={openMenus.landingPage} onClick={toggleMenu('landingPage')}>
                            Landing Page
                        </SidebarItem>
                        {openMenus.landingPage && (
                            <ul className="pl-0 border-l-2 border-gray-200 ml-[1.3rem] py-1"> {/* ml disesuaikan agar garis pas */}
                                {landingPageSubmenuLinks.map(link => <SubmenuItem key={link.title} href={link.href} level={1}>{link.title}</SubmenuItem>)}
                            </ul>
                        )}

                        {/* Akademik & Informasi Dropdown */}
                        <SidebarItem icon={CalendarDays} hasSubmenu isOpen={openMenus.akademik} onClick={toggleMenu('akademik')}>
                            Akademik & Informasi
                        </SidebarItem>
                        {openMenus.akademik && (
                            <ul className="pl-0 border-l-2 border-gray-200 ml-[1.3rem] py-1">
                                {akademikSubmenuLinks.map(link => <SubmenuItem key={link.title} href={link.href} level={1}>{link.title}</SubmenuItem>)}
                                <SubmenuItem
                                    hasSubmenu isOpen={openMenus.programKeahlianAkademik}
                                    onClick={toggleMenu('programKeahlianAkademik')} level={1}
                                >
                                    Program Keahlian
                                </SubmenuItem>
                                {openMenus.programKeahlianAkademik && (
                                    <ul className="pl-0 border-l-2 border-gray-200 ml-[1.3rem] py-1">
                                        {programKeahlianSubmenuLinks.map(link => <SubmenuItem key={link.title} href={link.href} level={2}>{link.title}</SubmenuItem>)}
                                    </ul>
                                )}
                            </ul>
                        )}

                        {/* Informasi SPMB Dropdown */}
                        <SidebarItem icon={FileText} hasSubmenu isOpen={openMenus.informasiSpmb} onClick={toggleMenu('informasiSpmb')}>
                            Informasi SPMB
                        </SidebarItem>
                        {openMenus.informasiSpmb && (
                            <ul className="pl-0 border-l-2 border-gray-200 ml-[1.3rem] py-1">
                                {informasiSpmbSidebarLinks.map(link => (
                                    <SubmenuItem key={link.title} href={link.href} level={1}>
                                        {link.title}
                                    </SubmenuItem>
                                ))}
                            </ul>
                        )}

                        {/* Tentang Kami Dropdown */}
                        <SidebarItem icon={Info} hasSubmenu isOpen={openMenus.tentangKami} onClick={toggleMenu('tentangKami')}>
                            Tentang Kami
                        </SidebarItem>
                        {openMenus.tentangKami && (
                            <ul className="pl-0 border-l-2 border-gray-200 ml-[1.3rem] py-1">
                                {tentangKamiSidebarLinks.map(link => (
                                    <SubmenuItem key={link.title} href={link.href} level={1}>
                                        {link.title}
                                    </SubmenuItem>
                                ))}
                                <SubmenuItem
                                    hasSubmenu isOpen={openMenus.manajemenSekolah}
                                    onClick={toggleMenu('manajemenSekolah')} level={1}
                                >
                                    Manajemen Sekolah
                                </SubmenuItem>
                                {openMenus.manajemenSekolah && (
                                    <ul className="pl-0 border-l-2 border-gray-200 ml-[1.3rem] py-1">
                                        {manajemenSekolahSidebarLinks.map(sublink => (
                                            <SubmenuItem key={sublink.title} href={sublink.href} level={2}>
                                                {sublink.title}
                                            </SubmenuItem>
                                        ))}
                                    </ul>
                                )}
                            </ul>
                        )}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-30">
                    <div className="container mx-auto flex justify-between items-center px-4">
                        <h1 className="text-xl font-semibold text-gray-700">{headerTitle}</h1>
                        <div className="flex items-center space-x-4">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center text-sm font-medium text-gray-700 hover:text-primary focus:outline-none p-2 rounded-md hover:bg-gray-100">
                                        <img src={logoSekolah} alt="Profil Admin" className="h-7 w-7 rounded-full mr-2 object-cover" />
                                        <span>{admin ? admin.username : 'Admin'}</span>
                                        <ChevronDown size={16} className="ml-1" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <button
                                        type="button" onClick={openPasswordModal}
                                        className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition hover:bg-gray-100 focus:outline-none"
                                    >
                                        <UserCog size={16} className="mr-2 inline-block" /> Edit Password
                                    </button>
                                    <Dropdown.Link href={route('admin.logout')} method="post" as="button">
                                        <LogOut size={16} className="mr-2 inline-block text-red-500" />
                                        <span className="text-red-500">Logout</span>
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {status === 'password-updated' && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">Password berhasil diperbarui.</div>
                    )}
                    {children}
                </main>
            </div>

            {/* Modal Edit Password */}
            <Modal show={showPasswordModal} onClose={closePasswordModal} maxWidth="lg">
                {/* ... (Form modal sama persis seperti sebelumnya) ... */}
                 <form onSubmit={handlePasswordUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Ubah Password Admin
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="current_password_modal" value="Password Saat Ini" />
                            <TextInput
                                id="current_password_modal" type="password" className="mt-1 block w-full"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                required autoComplete="current-password"
                            />
                            <InputError message={passwordErrors.current_password} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="new_password_modal" value="Password Baru" />
                            <TextInput
                                id="new_password_modal" type="password" className="mt-1 block w-full"
                                value={passwordData.password}
                                onChange={(e) => setPasswordData('password', e.target.value)}
                                required autoComplete="new-password"
                            />
                            <InputError message={passwordErrors.password} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="confirm_password_modal" value="Konfirmasi Password Baru" />
                            <TextInput
                                id="confirm_password_modal" type="password" className="mt-1 block w-full"
                                value={passwordData.password_confirmation}
                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                required autoComplete="new-password"
                            />
                            <InputError message={passwordErrors.password_confirmation} className="mt-1" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={closePasswordModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                        > Batal </button>
                        <PrimaryButton disabled={processingPassword}>
                            {processingPassword ? 'Menyimpan...' : 'Simpan Password'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}