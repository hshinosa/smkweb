import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Info, Menu, X } from 'lucide-react';
import { TYPOGRAPHY } from '@/Utils/typography';

export default function Navbar({
    logoSman1,
    profilLinks,
    akademikLinks,
    programStudiLinks
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white fixed w-full z-50 shadow-navbar font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    {/* Logo and School Name */}
                    <div className="flex-shrink-0 flex items-center gap-4">
                        <Link href="/">
                            <img className="h-14 w-auto" src={logoSman1} alt="Logo SMAN 1 Baleendah" />
                        </Link>
                        <div className="hidden md:block">
                            <Link href="/" className="text-2xl font-bold text-gray-900 block leading-tight font-serif tracking-tight">
                                SMA Negeri 1 Baleendah
                            </Link>
                            <p className="text-base text-primary font-medium italic mt-0.5 font-sans">
                                Unggul dalam Prestasi, Berkarakter Mulia
                            </p>
                        </div>
                    </div>

                    {/* Menu Navigasi Desktop */}
                    <div className="hidden lg:ml-8 lg:flex lg:space-x-8 items-center">
                        {/* Dropdown Profil */}
                        <div className="relative group">
                            <button className={`${TYPOGRAPHY.navLink} group inline-flex items-center focus:outline-none py-2`}>
                                <span>Profil</span>
                                <ChevronDown size={20} className="ml-1 text-gray-400 group-hover:text-primary transition-colors" />
                            </button>
                            <div className="absolute left-0 mt-2 w-64 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-20 transform origin-top-left">
                                <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="profil-menu">
                                    {profilLinks.map(link => (
                                        <Link key={link.title} href={link.href} className="block px-6 py-3 text-base text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors font-medium" role="menuitem">
                                            {link.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Dropdown Akademik */}
                        <div className="relative group">
                            <button className={`${TYPOGRAPHY.navLink} group inline-flex items-center focus:outline-none py-2`}>
                                <span>Akademik</span>
                                <ChevronDown size={20} className="ml-1 text-gray-400 group-hover:text-primary transition-colors" />
                            </button>
                            <div className="absolute left-0 mt-2 w-72 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-20 transform origin-top-left">
                                <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="akademik-menu">
                                    {akademikLinks.map(link => (
                                        <Link key={link.title} href={link.href} className="block px-6 py-3 text-base text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors font-medium" role="menuitem">
                                            {link.title}
                                        </Link>
                                    ))}
                                    <div className="relative group/submenu border-t border-gray-100 mt-1 pt-1">
                                        <div className="flex justify-between items-center px-6 py-3 text-base text-gray-700 hover:bg-blue-50 hover:text-primary cursor-pointer font-medium" role="menuitem">
                                            <span>Program Studi</span>
                                            <ChevronRight size={18} className="text-gray-400" />
                                        </div>
                                        <div className="absolute left-full top-0 ml-2 w-64 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 ease-out z-30">
                                            <div className="py-2" role="menu" aria-orientation="vertical">
                                                {programStudiLinks.map(prog => (
                                                    <Link key={prog.title} href={prog.href} className="block px-6 py-3 text-base text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors font-medium" role="menuitem">
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
                        <Link href="/berita-pengumuman" className={TYPOGRAPHY.navLink}>
                            Berita
                        </Link>

                        {/* Menu Alumni */}
                        <Link href="/alumni" className={TYPOGRAPHY.navLink}>
                            Alumni
                        </Link>

                        {/* Menu Kontak */}
                        <Link href="/kontak" className={TYPOGRAPHY.navLink}>
                            Kontak
                        </Link>

                        {/* Tombol Info PPDB */}
                        <Link href="/informasi-spmb" className="bg-accent-yellow text-gray-900 hover:bg-yellow-400 inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                            <Info size={20} className="mr-2" />
                            Info PPDB
                        </Link>
                    </div>

                    {/* Tombol Menu Mobile */}
                    <div className="-mr-2 flex items-center lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="bg-white inline-flex items-center justify-center p-3 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none transition-colors"
                            aria-controls="mobile-menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="block h-8 w-8" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-8 w-8" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
            <div 
                className={`lg:hidden fixed inset-x-0 top-24 bg-white shadow-lg z-40 transition-all duration-300 ease-in-out transform origin-top ${mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0'}`}
                id="mobile-menu"
            >
                <div className="px-4 pt-4 pb-6 space-y-2 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    <div className="border-b border-gray-100 pb-2 mb-2">
                        <div className="group">
                            <button className="w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-gray-50 flex justify-between items-center transition-colors"
                                onClick={(e) => {
                                    const nextEl = e.currentTarget.nextElementSibling;
                                    nextEl.classList.toggle('hidden');
                                    e.currentTarget.querySelector('svg').classList.toggle('rotate-180');
                                }}>
                                Profil <ChevronDown size={22} className="transition-transform duration-200" />
                            </button>
                            <div className="hidden pl-4 space-y-1 bg-gray-50/50 rounded-b-lg mb-2">
                                {profilLinks.map(link => (
                                    <Link key={`mobile-${link.title}`} href={link.href} className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors">
                                        {link.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                         <div className="group">
                            <button className="w-full text-left px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-gray-50 flex justify-between items-center transition-colors"
                                onClick={(e) => {
                                    const nextEl = e.currentTarget.nextElementSibling;
                                    nextEl.classList.toggle('hidden');
                                    e.currentTarget.querySelector('svg').classList.toggle('rotate-180');
                                }}>
                                Akademik <ChevronDown size={22} className="transition-transform duration-200" />
                            </button>
                            <div className="hidden pl-4 space-y-1 bg-gray-50/50 rounded-b-lg mb-2">
                                {akademikLinks.map(link => (
                                    <Link key={`mobile-${link.title}`} href={link.href} className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors">
                                        {link.title}
                                    </Link>
                                ))}
                                <div className="pt-2 border-t border-gray-200/50 mt-1">
                                    <p className="px-4 py-2 text-sm font-bold text-gray-400 uppercase tracking-wider">Program Studi</p>
                                    {programStudiLinks.map(prog => (
                                        <Link key={`mobile-pk-${prog.title}`} href={prog.href} className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors">
                                            {prog.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Link href="/berita-pengumuman" className="block px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                        Berita Pengumuman
                    </Link>

                    <Link href="/alumni" className="block px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                        Alumni
                    </Link>

                    <Link href="/kontak" className="block px-4 py-4 rounded-lg text-lg font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                        Kontak
                    </Link>

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <Link href="/informasi-spmb" className="flex items-center justify-center w-full px-4 py-4 bg-accent-yellow text-gray-900 rounded-xl text-lg font-bold shadow-sm hover:bg-yellow-400 transition-colors">
                            <Info size={24} className="mr-2" />
                            Info PPDB
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
