import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Info, Menu, X } from 'lucide-react';

export default function Navbar({
    logoSmkn15,
    tentangKamiLinks,
    manajemenSekolahSublinks,
    akademikInformasiLinks,
    programKeahlianDataNav
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white fixed w-full z-50 shadow-navbar">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* ... (logo and desktop title remains the same) ... */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <img className="h-10 w-auto" src={logoSmkn15} alt="Logo SMKN 15 Bandung" />
                        </Link>
                        <Link href="/" className="ml-3 text-xl font-semibold text-gray-800 hidden md:block">
                            SMK Negeri 15 Bandung
                        </Link>
                    </div>

                    {/* Menu Navigasi Desktop */}
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                        {/* Dropdown Tentang Kami */}
                        <div className="relative group">
                            <button className="text-gray-700 hover:text-primary inline-flex items-center px-1 py-2 text-sm font-medium focus:outline-none">
                                Tentang Kami
                                {/* Ganti ikon */}
                                <ChevronDown size={20} className="ml-1 text-gray-400 group-hover:text-primary" />
                            </button>
                            <div className="absolute left-0 mt-0 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-20 transform-gpu">
                                <div className="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="tentang-kami-menu">
                                    {/* ... (map tentangKamiLinks) ... */}
                                    {tentangKamiLinks.map(link => (
                                        <Link key={link.title} href={link.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">
                                            {link.title}
                                        </Link>
                                    ))}
                                    {/* Submenu Manajemen Sekolah */}
                                    <div className="relative group/submenu">
                                        <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary cursor-default" role="menuitem">
                                            <span>Manajemen Sekolah</span>
                                            {/* Ganti ikon */}
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </div>
                                        <div className="absolute left-full top-[-1px] ml-px w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 ease-in-out z-30">
                                            <div className="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical">
                                                {manajemenSekolahSublinks.map(sublink => (
                                                    <Link key={sublink.title} href={sublink.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">
                                                        {sublink.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dropdown Akademik & Informasi */}
                        <div className="relative group">
                            <button className="text-gray-700 hover:text-primary inline-flex items-center px-1 py-2 text-sm font-medium focus:outline-none">
                                Akademik & Informasi
                                {/* Ganti ikon */}
                                <ChevronDown size={20} className="ml-1 text-gray-400 group-hover:text-primary" />
                            </button>
                            <div className="absolute left-0 mt-0 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-20 transform-gpu">
                                <div className="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="akademik-menu">
                                    {/* ... (map akademikInformasiLinks) ... */}
                                    {akademikInformasiLinks.map(link => (
                                        <Link key={link.title} href={link.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">
                                            {link.title}
                                        </Link>
                                    ))}
                                    <div className="relative group/submenu">
                                        <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary cursor-default" role="menuitem">
                                            <span>Program Keahlian</span>
                                             {/* Ganti ikon */}
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </div>
                                        <div className="absolute left-full top-[-1px] ml-px w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 ease-in-out z-30">
                                            <div className="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical">
                                                {programKeahlianDataNav.map(prog => (
                                                    <Link key={prog.nama} href={prog.link} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary" role="menuitem">
                                                        {prog.nama}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Informasi SPMB */}
                        <Link href="/informasi-spmb" className="bg-primary text-white hover:bg-primary-darker inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md self-center">
                            {/* Ganti ikon */}
                            <Info size={20} className="mr-2" />
                            Informasi SPMB
                        </Link>
                    </div>

                    {/* Tombol Menu Mobile */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                            aria-controls="mobile-menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Ganti ikon hamburger/close */}
                            {mobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu Content */}
            {mobileMenuOpen && (
                <div className="sm:hidden absolute w-full bg-white shadow-lg z-40" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <div className="group">
                            <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex justify-between items-center"
                                onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('hidden')}>
                                Tentang Kami <ChevronDown size={20} /> {/* Ganti ikon */}
                            </button>
                            <div className="hidden pl-4 mt-1 space-y-1">
                                {tentangKamiLinks.map(link => (
                                    <Link key={`mobile-${link.title}`} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">{link.title}</Link>
                                ))}
                                {/* Mobile: Manajemen Sekolah Submenu */}
                                <div className="group/submenu">
                                    <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 flex justify-between items-center"
                                        onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('hidden')}>
                                        Manajemen Sekolah <ChevronDown size={20} /> {/* Ganti ikon */}
                                    </button>
                                    <div className="hidden pl-4 mt-1 space-y-1">
                                        {manajemenSekolahSublinks.map(sublink => (
                                            <Link key={`mobile-ms-${sublink.title}`} href={sublink.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-primary hover:bg-gray-50">{sublink.title}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div className="group">
                            <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex justify-between items-center"
                                onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('hidden')}>
                                Akademik & Informasi <ChevronDown size={20} /> {/* Ganti ikon */}
                            </button>
                            <div className="hidden pl-4 mt-1 space-y-1">
                                {akademikInformasiLinks.map(link => (
                                    <Link key={`mobile-${link.title}`} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">{link.title}</Link>
                                ))}
                                <div className="group/submenu">
                                    <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 flex justify-between items-center"
                                        onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('hidden')}>
                                        Program Keahlian <ChevronDown size={20} /> {/* Ganti ikon */}
                                    </button>
                                    <div className="hidden pl-4 mt-1 space-y-1">
                                        {programKeahlianDataNav.map(prog => (
                                            <Link key={`mobile-pk-${prog.nama}`} href={prog.link} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-primary hover:bg-gray-50">{prog.nama}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link href="/informasi-spmb" className="bg-primary text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-darker text-center mt-2">
                             {/* Ganti ikon */}
                            <Info size={20} className="mr-1 inline" />
                            Informasi SPMB
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}