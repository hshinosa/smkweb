import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

// Get navigation data from centralized source
const navigationData = getNavigationData();












export default function KontakPage() {
    return (
        <div className="bg-secondary text-gray-800 font-sans">
            <Head title="Kontak - SMAN 1 Baleendah" />
            
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            {/* Header Section */}
            <section className="pt-24 pb-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center md:text-left">
                        <h1 className={TYPOGRAPHY.pageTitle}>
                            Kontak Kami
                        </h1>
                        <div className="h-1 w-24 bg-primary mt-2 mx-auto md:mx-0 mb-4"></div>
                        <p className={TYPOGRAPHY.bodyText + " text-gray-600 max-w-3xl mx-auto md:mx-0"}>
                            Hubungi SMA Negeri 1 Baleendah untuk informasi lebih lanjut mengenai pendaftaran, 
                            program akademik, atau pertanyaan lainnya. Kami siap membantu Anda.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Informasi Kontak */}
                        <div>
                            <h2 className={TYPOGRAPHY.sectionHeading}>
                                Informasi <span className="text-primary">Kontak</span>
                            </h2>
                            <div className="h-1 w-24 bg-primary mb-8"></div>
                                
                                {/* Alamat */}
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-primary/10 text-primary rounded-lg p-3 flex-shrink-0">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={TYPOGRAPHY.cardTitle + " text-gray-900 mb-2"}>Alamat Sekolah</h3>
                                            <p className={TYPOGRAPHY.secondaryText + " text-gray-600 leading-relaxed"}>
                                                Jl. Raya Baleendah No. 456<br />
                                                Kelurahan Baleendah, Kecamatan Baleendah<br />
                                                Kabupaten Bandung, Jawa Barat 40375
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Telepon */}
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-primary/10 text-primary rounded-lg p-3 flex-shrink-0">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={TYPOGRAPHY.cardTitle + " text-gray-900 mb-2"}>Telepon</h3>
                                            <div className={TYPOGRAPHY.secondaryText + " text-gray-600 space-y-1"}>
                                                <p><span className="font-medium">Kantor:</span> (022) 7654321</p>
                                                <p><span className="font-medium">Fax:</span> (022) 7654322</p>
                                                <p><span className="font-medium">WhatsApp:</span> +62 812-3456-7890</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-primary/10 text-primary rounded-lg p-3 flex-shrink-0">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={TYPOGRAPHY.cardTitle + " text-gray-900 mb-2"}>Email</h3>
                                            <div className={TYPOGRAPHY.secondaryText + " text-gray-600 space-y-1"}>
                                                <p><span className="font-medium">Umum:</span> info@sman1baleendah.sch.id</p>
                                                <p><span className="font-medium">Akademik:</span> akademik@sman1baleendah.sch.id</p>
                                                <p><span className="font-medium">PPDB:</span> ppdb@sman1baleendah.sch.id</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Jam Operasional */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-primary/10 text-primary rounded-lg p-3 flex-shrink-0">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={TYPOGRAPHY.cardTitle + " text-gray-900 mb-2"}>Jam Operasional</h3>
                                            <div className={TYPOGRAPHY.secondaryText + " text-gray-600 space-y-1"}>
                                                <p><span className="font-medium">Senin - Jumat:</span> 07:00 - 16:00 WIB</p>
                                                <p><span className="font-medium">Sabtu:</span> 07:00 - 12:00 WIB</p>
                                                <p><span className="font-medium">Minggu:</span> Tutup</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        {/* Form Kontak */}
                        <div>
                            <h2 className={TYPOGRAPHY.sectionHeading}>
                                Kirim <span className="text-primary">Pesan</span>
                            </h2>
                            <div className="h-1 w-24 bg-primary mb-8"></div>
                            
                            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
                                <form className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={TYPOGRAPHY.formLabel}>
                                                    Nama Lengkap *
                                                </label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    placeholder="Masukkan nama lengkap"
                                                />
                                            </div>
                                            <div>
                                                <label className={TYPOGRAPHY.formLabel}>
                                                    Email *
                                                </label>
                                                <input 
                                                    type="email" 
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    placeholder="Masukkan email"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={TYPOGRAPHY.formLabel}>
                                                    Nomor Telepon
                                                </label>
                                                <input 
                                                    type="tel" 
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    placeholder="Masukkan nomor telepon"
                                                />
                                            </div>
                                            <div>
                                                <label className={TYPOGRAPHY.formLabel}>
                                                    Kategori Pesan
                                                </label>
                                                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                                    <option value="">Pilih kategori</option>
                                                    <option value="ppdb">PPDB</option>
                                                    <option value="akademik">Akademik</option>
                                                    <option value="umum">Informasi Umum</option>
                                                    <option value="kerjasama">Kerjasama</option>
                                                    <option value="lainnya">Lainnya</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={TYPOGRAPHY.formLabel}>
                                                Subjek *
                                            </label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Masukkan subjek pesan"
                                            />
                                        </div>

                                        <div>
                                            <label className={TYPOGRAPHY.formLabel}>
                                                Pesan *
                                            </label>
                                            <textarea 
                                                rows="6"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Tulis pesan Anda di sini..."
                                            ></textarea>
                                        </div>

                                        <button 
                                            type="submit"
                                            className={"w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-darker transition-colors flex items-center justify-center " + TYPOGRAPHY.buttonText}
                                        >
                                            <Send className="w-5 h-5 mr-2" />
                                            Kirim Pesan
                                        </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Peta Lokasi */}
                    <div className="mt-20">
                        <div className="text-center mb-12">
                            <h2 className={TYPOGRAPHY.sectionHeading}>
                                Lokasi <span className="text-primary">Sekolah</span>
                            </h2>
                            <div className="h-1 w-24 bg-primary mx-auto mb-4"></div>
                            <p className={TYPOGRAPHY.bodyText + " text-gray-600 max-w-2xl mx-auto"}>
                                Temukan lokasi SMA Negeri 1 Baleendah yang strategis dan mudah diakses
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                            <div className="aspect-video rounded-lg overflow-hidden">
                                <iframe
                                    src={navigationData.googleMapsEmbedUrl}
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
                </div>
            </section>

            {/* Media Sosial Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className={TYPOGRAPHY.sectionHeading}>
                            Terhubung dengan <span className="text-primary">Kami</span>
                        </h2>
                        <div className="h-1 w-24 bg-primary mx-auto mb-6"></div>
                        <p className={TYPOGRAPHY.bodyText + " text-gray-600 mb-10 max-w-2xl mx-auto"}>
                            Ikuti media sosial kami untuk mendapatkan update terbaru tentang kegiatan sekolah, 
                            prestasi siswa, dan informasi penting lainnya.
                        </p>
                        <div className="flex justify-center flex-wrap gap-4">
                            {navigationData.socialMediaLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <a 
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-gray-50 hover:bg-primary text-gray-700 hover:text-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-3 min-w-[140px]"
                                        title={`Ikuti kami di ${social.name}`}
                                    >
                                        {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
                                        <span className="font-medium">{social.name}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <Footer
                logoSman1={navigationData.logoSman1}
                googleMapsEmbedUrl={navigationData.googleMapsEmbedUrl}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
                socialMediaLinks={navigationData.socialMediaLinks}
            />
        </div>
    );
}