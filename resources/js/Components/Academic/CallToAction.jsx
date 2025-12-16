import React from 'react';
import { Link } from '@inertiajs/react';
import { TYPOGRAPHY } from '@/Utils/typography';

/**
 * Reusable call-to-action component for academic pages
 * Provides consistent CTA section with title, description and action buttons
 */
export default function CallToAction({ 
    title = "Bergabunglah dengan SMAN 1 Baleendah",
    description = "Wujudkan impian pendidikan terbaik bersama kami. Dapatkan informasi lengkap tentang program studi dan proses pendaftaran.",
    primaryButton = { text: "Informasi SPMB", href: "/informasi-spmb" },
    secondaryButton = { text: "Hubungi Kami", href: "/kontak" },
    className = ""
}) {
    return (
        <section className={`py-12 bg-primary sm:py-16 lg:py-20 ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className={`${TYPOGRAPHY.sectionHeading} text-white mb-6`}>
                        {title}
                    </h2>
                    <p className={`${TYPOGRAPHY.bodyText} text-blue-100 mb-8 text-lg`}>
                        {description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {primaryButton && (
                            <Link 
                                href={primaryButton.href}
                                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                {primaryButton.text}
                            </Link>
                        )}
                        {secondaryButton && (
                            <Link 
                                href={secondaryButton.href}
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200"
                            >
                                {secondaryButton.text}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}