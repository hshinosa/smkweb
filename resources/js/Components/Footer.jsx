import React from 'react';
import { Link } from '@inertiajs/react';
import { InstagramIcon, FacebookIcon, LinkedinIcon, XIcon } from './Icons'; // Assuming Icons.jsx is in the same folder

export default function Footer({
    logoSmkn15,
    googleMapsEmbedUrl,
    tentangKamiLinks,
    akademikInformasiLinks,
    programKeahlianDataNav,
    socialMediaLinks
}) {
    return (
        <footer className="bg-secondary text-gray-700 pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
                    <div className="lg:col-span-3 md:col-span-6">
                        <div className="flex items-center mb-4">
                            <img src={logoSmkn15} alt="Logo SMKN 15 Bandung" className="h-12 mr-3" />
                            <span className="text-xl font-semibold text-gray-800">SMK Negeri 15 Bandung</span>
                        </div>
                        <p className="text-sm mb-2">Jalan Jendral Gatot Subroto No. 4, Kelurahan Burangrang, Kecamatan Lengkong, Kota Bandung, Jawa Barat 40262</p>
                        <p className="text-sm mb-2">(022) 7303659</p>
                        <p className="text-sm mb-4">smklimabelas@gmail.com</p>
                        <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-md">
                            <iframe
                                src={googleMapsEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Peta SMKN 15 Bandung"
                            ></iframe>
                        </div>
                    </div>

                    <div className="lg:col-span-1"></div> {/* Spacer */}

                    <div className="lg:col-span-3 md:col-span-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tentang Kami</h3>
                        <ul className="space-y-[15px]">
                            {tentangKamiLinks.map(link => (
                                <li key={`footer-tentang-${link.title}`}>
                                    <Link href={link.href} className="text-sm hover:text-primary transition-colors">{link.title}</Link>
                                </li>
                            ))}
                            {/* Explicitly add Manajemen Sekolah link for footer, if structure differs from nav */}
                            <li><Link href="/manajemen-sekolah" className="text-sm hover:text-primary transition-colors">Manajemen Sekolah</Link></li> 
                        </ul>
                    </div>
                    <div className="lg:col-span-3 md:col-span-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Akademik & Informasi</h3>
                        <ul className="space-y-[15px]">
                            {akademikInformasiLinks.map(link => (
                                 <li key={`footer-akad-${link.title}`}><Link href={link.href} className="text-sm hover:text-primary transition-colors">{link.title}</Link></li>
                            ))}
                            {programKeahlianDataNav.map(link => (
                                <li key={`footer-pk-${link.nama}`}><Link href={link.link} className="text-sm hover:text-primary transition-colors">{link.nama}</Link></li>
                            ))}
                            <li><Link href="/informasi-spmb" className="text-sm hover:text-primary transition-colors">Informasi SPMB</Link></li>
                        </ul>
                    </div>
                    <div className="lg:col-span-2 md:col-span-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tautan</h3>
                        <ul className="space-y-[19px]">
                            {socialMediaLinks.map(social => (
                                 <li key={social.name}>
                                     <a href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:text-primary transition-colors group">
                                         {social.icon && <social.icon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-primary" />}
                                         {!social.icon && <span className="w-5 h-5 mr-2 text-gray-500 group-hover:text-primary">{social.name.substring(0,1)}</span>}
                                         {social.handle}
                                     </a>
                                 </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-300">
                    <div className="container mx-auto px-6 sm:px-6 lg:px-6 pt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ©{new Date().getFullYear()} SMK Negeri 15 Bandung. Hak Cipta Dilindungi Undang-Undang.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}