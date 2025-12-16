import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Phone, Mail, Link2 } from 'lucide-react';
import { getNavigationData } from '@/Utils/navigationData';

export default function Footer({
    logoSman1,
    googleMapsEmbedUrl,
    socialMediaLinks
}) {
    // Get navigation data from centralized source
    const navigationData = getNavigationData();
    
    // Use props if provided, otherwise use navigationData
    const finalLogoSman1 = logoSman1 || navigationData.logoSman1;
    const finalGoogleMapsEmbedUrl = googleMapsEmbedUrl || navigationData.googleMapsEmbedUrl;
    const finalSocialMediaLinks = socialMediaLinks || navigationData.socialMediaLinks;
    const profilLinks = navigationData.profilLinks;
    const akademikLinks = navigationData.akademikLinks;
    const programStudiLinks = navigationData.programStudiLinks;

    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    
                    {/* School Information & Map */}
                    <div className="lg:col-span-1 lg:pr-4">
                        <div className="flex items-center mb-4">
                            <img 
                                src={finalLogoSman1} 
                                alt="Logo SMAN 1 Baleendah" 
                                className="h-14 w-14 mr-4 flex-shrink-0" 
                            />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">
                                    SMA Negeri 1 Baleendah
                                </h3>
                                <p className="text-sm text-primary font-medium italic">
                                    Unggul dalam Prestasi, Berkarakter Mulia
                                </p>
                            </div>
                        </div>
                        
                        {/* Map */}
                        <div>
                            <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-md border border-gray-200">
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
                    </div>

                    {/* Profil Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Profil Sekolah
                        </h4>
                        <ul className="space-y-2">
                            {profilLinks.slice(0, 4).map(link => (
                                <li key={`footer-profil-${link.title}`}>
                                    <Link 
                                        href={link.href} 
                                        className="text-base text-gray-600 hover:text-primary transition-colors duration-200 block py-1"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Academic Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Akademik
                        </h4>
                        <ul className="space-y-2">
                            {akademikLinks.map(link => (
                                <li key={`footer-akad-${link.title}`}>
                                    <Link 
                                        href={link.href} 
                                        className="text-base text-gray-600 hover:text-primary transition-colors duration-200 block py-1"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link 
                                    href="/berita-pengumuman" 
                                    className="text-base text-gray-600 hover:text-primary transition-colors duration-200 block py-1"
                                >
                                    Berita & Pengumuman
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/informasi-spmb" 
                                    className="text-base text-gray-600 hover:text-primary transition-colors duration-200 block py-1"
                                >
                                    Informasi SPMB
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Kontak
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <MapPin className="w-6 h-6 text-primary mt-0.5 mr-3 flex-shrink-0" />
                                <p className="text-base text-gray-600 leading-relaxed">
                                    Jl. Raya Baleendah No. 456<br />
                                    Baleendah, Kabupaten Bandung<br />
                                    Jawa Barat 40375
                                </p>
                            </div>
                            
                            <div className="flex items-center">
                                <Phone className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
                                <a 
                                    href="tel:+622276543210" 
                                    className="text-base text-gray-600 hover:text-primary transition-colors"
                                >
                                    (022) 7654321
                                </a>
                            </div>
                            
                            <div className="flex items-center">
                                <Mail className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
                                <a 
                                    href="mailto:info@sman1baleendah.sch.id" 
                                    className="text-base text-gray-600 hover:text-primary transition-colors"
                                >
                                    info@sman1baleendah.sch.id
                                </a>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="mt-6">
                            <div className="flex flex-wrap gap-3">
                                {finalSocialMediaLinks.map(social => {
                                    const IconComponent = social.icon;
                                    return (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 group"
                                            title={`Ikuti kami di ${social.name}`}
                                        >
                                            {IconComponent ? (
                                                <IconComponent size={20} className="text-gray-600 group-hover:text-white" />
                                            ) : (
                                                <Link2 size={20} className="text-gray-600 group-hover:text-white" />
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-base text-gray-500">
                            © {new Date().getFullYear()} SMA Negeri 1 Baleendah. Hak Cipta Dilindungi Undang-Undang.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}