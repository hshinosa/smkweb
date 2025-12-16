import { Camera, Facebook, Linkedin, Twitter } from 'lucide-react';

/**
 * Centralized navigation data for consistent use across all academic pages
 * Provides single source of truth for navigation links and social media
 */
export function getNavigationData() {
    return {
        logoSman1: '/images/logo-sman1-baleendah.png',
        googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8947!2d107.6298!3d-6.9876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e62c87267923%3A0x7ef8aaa0fcd59ec9!2sSMAN%201%20Baleendah%2C%20Baleendah%2C%20Kabupaten%20Bandung%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1746550004423!5m2!1sid!2sid",
        
        profilLinks: [
            { title: "Profil Sekolah", href: "/profil-sekolah" },
            { title: "Visi Misi", href: "/visi-misi" },
            { title: "Struktur Organisasi", href: "/struktur-organisasi" },
            { title: "Program Sekolah", href: "/program" },
            { title: "Galeri", href: "/galeri" },
            { title: "Guru & Staff", href: "/guru-staff" },
        ],

        akademikLinks: [
            { title: "Kalender Akademik", href: "/kalender-akademik" },
            { title: "Kurikulum", href: "/akademik/kurikulum" },
            { title: "Ekstrakurikuler", href: "/akademik/ekstrakurikuler" },
        ],

        programStudiLinks: [
            { title: "MIPA", href: "/akademik/program-studi/mipa" },
            { title: "IPS", href: "/akademik/program-studi/ips" },
            { title: "Bahasa", href: "/akademik/program-studi/bahasa" },
        ],

        socialMediaLinks: [
            { 
                name: "Instagram", 
                href: "https://www.instagram.com/sman1baleendah", 
                handle: "@sman1baleendah",
                icon: Camera
            },
            { 
                name: "Facebook", 
                href: "https://www.facebook.com/SMAN1Baleendah", 
                handle: "SMAN 1 Baleendah",
                icon: Facebook
            },
            { 
                name: "LinkedIn", 
                href: "https://www.linkedin.com/school/sman-1-baleendah/", 
                handle: "SMAN 1 Baleendah",
                icon: Linkedin
            },
            { 
                name: "X", 
                href: "https://twitter.com/sman1baleendah", 
                handle: "@sman1baleendah",
                icon: Twitter
            },
        ]
    };
}