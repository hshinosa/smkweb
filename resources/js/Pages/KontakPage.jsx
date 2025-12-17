import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Send, 
    ChevronDown, 
    ChevronUp,
    Instagram,
    Youtube,
    Facebook,
    Twitter
} from 'lucide-react';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { TYPOGRAPHY } from '@/Utils/typography';
import { getNavigationData } from '@/Utils/navigationData';

const navigationData = getNavigationData();

// --- MOCK DATA ---
const faqs = [
    {
        question: "Kapan Pendaftaran PPDB dibuka?",
        answer: "Pendaftaran PPDB biasanya dibuka pada bulan Juni setiap tahunnya. Jadwal resmi akan diumumkan melalui website ini dan media sosial resmi sekolah."
    },
    {
        question: "Apa saja syarat pindahan ke SMAN 1 Baleendah?",
        answer: "Syarat pindahan meliputi surat keterangan pindah dari sekolah asal, rapor lengkap, surat kelakuan baik, dan ketersediaan kuota di kelas yang dituju. Silakan hubungi bagian Tata Usaha untuk detail lebih lanjut."
    },
    {
        question: "Berapa biaya SPP per bulan?",
        answer: "SMAN 1 Baleendah adalah sekolah negeri yang tidak memungut biaya SPP bulanan (gratis) sesuai dengan kebijakan pemerintah provinsi Jawa Barat."
    },
    {
        question: "Apakah ada program beasiswa?",
        answer: "Ya, tersedia berbagai program beasiswa seperti PIP (Program Indonesia Pintar) dan beasiswa prestasi untuk siswa yang memenuhi kriteria."
    }
];

const socialLinks = [
    { name: 'Instagram', icon: Instagram, color: 'bg-pink-600', href: '#' },
    { name: 'YouTube', icon: Youtube, color: 'bg-red-600', href: '#' },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', href: '#' },
    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500', href: '#' },
];

export default function KontakPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="bg-white font-sans text-gray-800">
            <Head title="Kontak Kami - SMAN 1 Baleendah" />
            
            <Navbar
                logoSman1={navigationData.logoSman1}
                profilLinks={navigationData.profilLinks}
                akademikLinks={navigationData.akademikLinks}
                programStudiLinks={navigationData.programStudiLinks}
            />

            <main className="pt-20">
                {/* 1. HERO SECTION (Replaced to match Berita style) */}
                <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-20">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/hero-bg-sman1-baleendah.jpeg" 
                            alt="Siswa SMAN 1 Baleendah" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        
                        <h1 className={`${TYPOGRAPHY.heroTitle} mb-6 max-w-4xl mx-auto`}>
                            Kunjungi <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                SMAN 1 Baleendah
                            </span>
                        </h1>
                        
                        <p className={`${TYPOGRAPHY.heroText} max-w-2xl mx-auto mb-10 opacity-90`}>
                            Kami menantikan kehadiran Anda. Silakan hubungi kami untuk informasi lebih lanjut atau jadwalkan kunjungan ke sekolah kami.
                        </p>

                        {/* Social Icons Row */}
                        <div className="flex gap-4 justify-center">
                            {socialLinks.map((social, idx) => (
                                <a 
                                    key={idx}
                                    href={social.href}
                                    className={`${social.color} w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg`}
                                    title={social.name}
                                >
                                    <social.icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. SECTION: CONTACT INFO & MAP (Integrated) */}
                <section className="relative py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl h-[600px] border border-gray-200">
                            {/* Background Map (Static Placeholder for now, ideally interactive) */}
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

                            {/* Floating Card (Overlay) */}
                            <div className="absolute top-1/2 left-4 lg:left-12 transform -translate-y-1/2 w-[90%] max-w-md bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/50">
                                <h3 className={`${TYPOGRAPHY.sectionHeading} text-2xl mb-6 border-b border-gray-100 pb-4`}>
                                    Informasi Kontak
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Alamat</p>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                Jl. R.A.A. Wiranatakusumah No. 30, Baleendah, Bandung, Jawa Barat 40375
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Telepon</p>
                                            <p className="text-gray-600 text-sm">(022) 5940268</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Email</p>
                                            <p className="text-gray-600 text-sm">info@sman1baleendah.sch.id</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Jam Operasional</p>
                                            <p className="text-gray-600 text-sm">Senin - Jumat, 07:00 - 16:00 WIB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. SECTION: MESSAGE FORM & FAQ (Combined) */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                            
                            {/* Left Column: Message Form */}
                            <div>
                                <div className="mb-8">
                                    <h2 className={TYPOGRAPHY.sectionHeading}>Kirim <span className="text-primary">Pesan</span></h2>
                                    <p className={`${TYPOGRAPHY.bodyText} mt-4`}>
                                        Punya pertanyaan? Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda.
                                    </p>
                                </div>

                                <form className="space-y-6 text-left">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                id="name"
                                                className="peer w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-primary focus:ring-0 rounded-t-lg transition-colors placeholder-transparent"
                                                placeholder="Nama Lengkap"
                                            />
                                            <label 
                                                htmlFor="name"
                                                className="absolute left-4 -top-2.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                                            >
                                                Nama Lengkap
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <input 
                                                type="email" 
                                                id="email"
                                                className="peer w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-primary focus:ring-0 rounded-t-lg transition-colors placeholder-transparent"
                                                placeholder="Email"
                                            />
                                            <label 
                                                htmlFor="email"
                                                className="absolute left-4 -top-2.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                                            >
                                                Email
                                            </label>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            id="subject"
                                            className="peer w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-primary focus:ring-0 rounded-t-lg transition-colors placeholder-transparent"
                                            placeholder="Subjek"
                                        />
                                        <label 
                                            htmlFor="subject"
                                            className="absolute left-4 -top-2.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                                        >
                                            Subjek
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <textarea 
                                            id="message"
                                            rows="5"
                                            className="peer w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-primary focus:ring-0 rounded-t-lg transition-colors placeholder-transparent resize-none"
                                            placeholder="Pesan Anda"
                                        ></textarea>
                                        <label 
                                            htmlFor="message"
                                            className="absolute left-4 -top-2.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                                        >
                                            Pesan Anda
                                        </label>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-darker transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                        Kirim Pesan Sekarang
                                    </button>
                                </form>
                            </div>

                            {/* Right Column: FAQ */}
                            <div>
                                <div className="mb-8">
                                    <h2 className={TYPOGRAPHY.sectionHeading}>Pertanyaan <span className="text-primary">Umum (FAQ)</span></h2>
                                    <p className={`${TYPOGRAPHY.bodyText} mt-4`}>
                                        Jawaban atas pertanyaan yang sering diajukan oleh calon siswa dan orang tua.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <div 
                                            key={index} 
                                            className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                                        >
                                            <button
                                                onClick={() => toggleFaq(index)}
                                                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                                            >
                                                <span className="font-bold text-gray-900 font-serif text-lg">{faq.question}</span>
                                                {openFaqIndex === index ? (
                                                    <ChevronUp className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>
                                            <div 
                                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                                    openFaqIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <p className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

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
