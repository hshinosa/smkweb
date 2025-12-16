import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Info, Menu, X } from 'lucide-react';

export default function Navbar({
    logoSman1,
    profilLinks,
    akademikLinks,
    programStudiLinks
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white fixed w-full z-50 shadow-navbar">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo and School Name */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <img className="h-12 w-auto" src={logoSman1} alt="Logo SMAN 1 Baleendah" />
                        </Link>
                        <div className="ml-4 hidden md:block">
                            <Link href="/" className="text-xl sm:text-2xl font-semibold text-gray-800 block leading-tight">
                                SMA Negeri 1 Baleendah
                            </Link>
                            <p className="text-sm text-primary font-medium italic mt-1">
                                Unggul dalam Prestasi, Berkarakter Mulia
                            </p>
                        </div>
                    </div>

                    {/* Menu Navigasi Desktop */}
                    <div className="hidden sm:ml-8 sm:flex sm:space-x-6 items-center">
                        {/* Dropdown Profil */}
                        <div className="relative group">
                            <button className="text-gray-700 hover:text-primary inline-flex items-center px-3 py-3 text-base sm:text-lg font-medium focus:outline-none">
                                Profil
                                <ChevronDown size={22} className="ml-2 text-gray-400 group-hover:text-primary" />
                            </button>
                            <div className="absolute left-0 mt-0 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-20 transform-gpu">
                                <div className="py-2 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="profil-menu">
                                    {profilLinks.map(link => (
                                        <Link key={link.title} href={link.href} className="block px-5 py-3 text-base text-gray-700 hover:bg-gray-100 hover:text-primary whitespace-nowrap" role="menuitem">
                                            {link.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Dropdown Akademik */}
                        <div className="relative group">
                            <button className="text-gray-700 hover:text-primary inline-flex items-center px-3 py-3 text-base sm:text-lg font-medium focus:outline-none">
                                Akademik
                                <ChevronDown size={22} className="ml-2 text-gray-400 group-hover:text-primary" />
                            </button>
                            <div className="absolute left-0 mt-0 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-20 transform-gpu">
                                <div className="py-2 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="akademik-menu">
                                    {akademikLinks.map(link => (
                                        <Link key={link.title} href={link.href} className="block px-5 py-3 text-base text-gray-700 hover:bg-gray-100 hover:text-primary whitespace-nowrap" role="menuitem">
                                            {link.title}
                                        </Link>
                                    ))}
                                    <div className="relative group/submenu">
                                        <div className="flex justify-between items-center px-5 py-3 text-base text-gray-700 hover:bg-gray-100 hover:text-primary cursor-default whitespace-nowrap" role="menuitem">
                                            <span>Program Studi</span>
                                            <ChevronRight size={18} className="text-gray-400 ml-2" />
                                        </div>
                                        <div className="absolute left-full top-[-1px] ml-px w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 ease-in-out z-30">
                                            <div className="py-2 divide-y divide-gray-100" role="menu" aria-orientation="vertical">
                                                {programStudiLinks.map(prog => (
                                                    <Link key={prog.title} href={prog.href} className="block px-5 py-3 text-base text-gray-700 hover:bg-gray-100 hover:text-primary whitespace-nowrap" role="menuitem">
                                                        {prog.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Berita Pengumuman */}
                        <Link href="/berita-pengumuman" className="text-gray-700 hover:text-primary inline-flex items-center px-3 py-3 text-base sm:text-lg font-medium">
                            Berita Pengumuman
                        </Link>

                        {/* Menu Kontak */}
                        <Link href="/kontak" className="text-gray-700 hover:text-primary inline-flex items-center px-3 py-3 text-base sm:text-lg font-medium">
                            Kontak
                        </Link>

                        {/* Tombol Informasi SPMB */}
                        <Link href="/informasi-spmb" className="bg-primary text-white hover:bg-primary-darker inline-flex items-center px-4 py-3 border border-transparent text-base sm:text-lg font-medium rounded-md self-center">
                            <Info size={22} className="mr-2" />
                            Informasi SPMB
                        </Link>
                    </div>

                    {/* Tombol Menu Mobile */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="bg-white inline-flex items-center justify-center p-3 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                            aria-controls="mobile-menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Ganti ikon hamburger/close */}
                            {mobileMenuOpen ? (
                                <X className="block h-7 w-7" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-7 w-7" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu Content */}
            {mobileMenuOpen && (
                <div className="sm:hidden absolute w-full bg-white shadow-lg z-40" id="mobile-menu">
                    <div className="px-3 pt-3 pb-4 space-y-2">
                        <div className="group">
                            <button className="w-full text-left px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex justify-between items-center"
                                onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('hidden')}>
                                Profil <ChevronDown size={22} />
                            </button>
                            <div className="hidden pl-6 mt-2 space-y-1">
                                {profilLinks.map(link => (
                                    <Link key={`mobile-${link.title}`} href={link.href} className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">{link.title}</Link>
                                ))}
                            </div>
                        </div>
                         <div className="group">
                            <button className="w-full text-left px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex justify-between items-center"
                                onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('hidden')}>
                                Akademik <ChevronDown size={22} />
                            </button>
                            <div className="hidden pl-6 mt-2 space-y-1">
                                {akademikLinks.map(link => (
                                    <Link key={`mobile-${link.title}`} href={link.href} className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">{link.title}</Link>
                                ))}
                                <div className="group/submenu">
                                    <button className="w-full text-left px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 flex justify-between items-center"
                                        onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('hidden')}>
                                        Program Studi <ChevronDown size={22} />
                                    </button>
                                    <div className="hidden pl-6 mt-2 space-y-1">
                                        {programStudiLinks.map(prog => (
                                            <Link key={`mobile-pk-${prog.title}`} href={prog.href} className="block px-4 py-3 rounded-md text-base font-medium text-gray-500 hover:text-primary hover:bg-gray-50">{prog.title}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Menu Berita Pengumuman Mobile */}
                        <Link href="/berita-pengumuman" className="block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                            Berita Pengumuman
                        </Link>

                        {/* Menu Kontak Mobile */}
                        <Link href="/kontak" className="block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                            Kontak
                        </Link>

                        <Link href="/informasi-spmb" className="bg-primary text-white block px-4 py-3 rounded-md text-base font-medium hover:bg-primary-darker text-center mt-3">
                            <Info size={22} className="mr-2 inline" />
                            Informasi SPMB
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}