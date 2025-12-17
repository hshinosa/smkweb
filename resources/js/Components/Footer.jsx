import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Phone, Mail, Link2, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { getNavigationData } from '@/Utils/navigationData';

export default function Footer({
    logoSman1,
    googleMapsEmbedUrl,
    socialMediaLinks,
    showMap = true
}) {
    // Get navigation data from centralized source
    const navigationData = getNavigationData();
    
    // Use props if provided, otherwise use navigationData
    const finalLogoSman1 = logoSman1 || navigationData.logoSman1;
    const finalGoogleMapsEmbedUrl = googleMapsEmbedUrl || navigationData.googleMapsEmbedUrl;
    const finalSocialMediaLinks = socialMediaLinks || navigationData.socialMediaLinks;

    // Combined Quick Links
    const quickLinks = [
        { title: "Profil Sekolah", href: "/profil/sejarah" },
        { title: "Info PPDB", href: "/informasi-spmb" },
        { title: "Program Studi", href: "/akademik/program-studi/mipa" },
        { title: "Berita & Pengumuman", href: "/berita-pengumuman" },
        { title: "Kontak Kami", href: "/kontak" },
    ];

    return (
        <footer className="bg-primary text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    
                    {/* Column 1: Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img 
                                src={finalLogoSman1} 
                                alt="Logo SMAN 1 Baleendah" 
                                className="h-16 w-16 bg-white rounded-full p-1" 
                            />
                            <div>
                                <h3 className="text-lg font-bold leading-tight">
                                    SMAN 1 <br/> Baleendah
                                </h3>
                            </div>
                        </div>
                        <p className="text-blue-100 text-sm leading-relaxed">
                            Mewujudkan generasi unggul, berkarakter, dan berwawasan global. Sekolah pilihan terbaik untuk masa depan gemilang.
                        </p>
                        <div className="flex gap-3 pt-2">
                             {finalSocialMediaLinks.map(social => {
                                const IconComponent = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent-yellow hover:text-gray-900 transition-all"
                                        title={social.name}
                                    >
                                        {IconComponent ? <IconComponent size={18} /> : <Link2 size={18} />}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-accent-yellow mb-6">Tautan Cepat</h4>
                        <ul className="space-y-3">
                            {quickLinks.map(link => (
                                <li key={link.title}>
                                    <Link 
                                        href={link.href} 
                                        className="text-blue-100 hover:text-white hover:translate-x-1 transition-all inline-block"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-accent-yellow mb-6">Hubungi Kami</h4>
                        <div className="space-y-4 text-blue-100">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-accent-yellow mt-1 flex-shrink-0" />
                                <p className="text-sm">
                                    Jl. R.A.A. Wiranatakusumah No. 30,<br />
                                    Baleendah, Bandung,<br />
                                    Jawa Barat 40375
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-accent-yellow flex-shrink-0" />
                                <a href="tel:+62225940268" className="text-sm hover:text-white">
                                    (022) 5940268
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-accent-yellow flex-shrink-0" />
                                <a href="mailto:info@sman1baleendah.sch.id" className="text-sm hover:text-white">
                                    info@sman1baleendah.sch.id
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Map */}
                    {showMap && (
                        <div>
                            <h4 className="text-lg font-bold text-accent-yellow mb-6">Lokasi Sekolah</h4>
                            <div className="w-full h-48 bg-gray-300 rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
                                <iframe
                                    src={finalGoogleMapsEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Peta Lokasi SMAN 1 Baleendah"
                                ></iframe>
                            </div>
                        </div>
                    )}

                </div>

                <div className="mt-12 pt-8 border-t border-blue-900 text-center text-blue-200 text-sm">
                    <p>© {new Date().getFullYear()} SMAN 1 Baleendah. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
