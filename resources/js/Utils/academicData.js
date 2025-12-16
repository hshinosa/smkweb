/**
 * Centralized academic data for consistent use across all academic pages
 * Provides single source of truth for curriculum, programs, and academic content
 */

// Curriculum Data Structure as defined in design document
export const curriculumData = {
    overview: {
        title: 'Kurikulum SMA Negeri 1 Baleendah',
        description: 'Kurikulum yang mengacu pada standar nasional dengan pengembangan lokal',
        implementationYear: '2024/2025'
    },
    programs: {
        mipa: {
            name: 'Matematika dan Ilmu Pengetahuan Alam',
            focus: 'Pengembangan kemampuan analitis dan scientific thinking',
            coreSubjects: ['Matematika', 'Fisika', 'Kimia', 'Biologi'],
            totalHours: 44
        },
        ips: {
            name: 'Ilmu Pengetahuan Sosial',
            focus: 'Pemahaman fenomena sosial dan pengembangan critical thinking',
            coreSubjects: ['Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi'],
            totalHours: 44
        },
        bahasa: {
            name: 'Ilmu Bahasa dan Budaya',
            focus: 'Pengembangan kemampuan komunikasi dan apresiasi budaya',
            coreSubjects: ['Bahasa Indonesia', 'Bahasa Inggris', 'Sastra', 'Antropologi'],
            totalHours: 44
        }
    },
    assessment: {
        system: 'Penilaian Autentik',
        components: ['Pengetahuan', 'Keterampilan', 'Sikap'],
        scale: '0-100'
    }
};

// Program Study Data Structure as defined in design document
export const programStudyData = {
    mipa: {
        title: 'Program MIPA',
        subtitle: 'Matematika dan Ilmu Pengetahuan Alam',
        description: 'Program yang memfokuskan pada pengembangan kemampuan analitis, logical thinking, dan scientific method dalam memahami fenomena alam.',
        coreSubjects: [
            {
                name: 'Matematika Wajib',
                hours: 4,
                description: 'Aljabar, geometri, trigonometri, kalkulus dasar'
            },
            {
                name: 'Matematika Peminatan',
                hours: 4,
                description: 'Matematika lanjutan untuk persiapan perguruan tinggi'
            },
            {
                name: 'Fisika',
                hours: 4,
                description: 'Mekanika, termodinamika, gelombang, listrik magnet'
            },
            {
                name: 'Kimia',
                hours: 4,
                description: 'Kimia dasar, organik, anorganik, dan analitik'
            },
            {
                name: 'Biologi',
                hours: 4,
                description: 'Biologi sel, genetika, ekologi, evolusi'
            }
        ],
        facilities: [
            {
                name: 'Laboratorium Fisika',
                description: 'Dilengkapi alat praktikum modern untuk eksperimen fisika'
            },
            {
                name: 'Laboratorium Kimia',
                description: 'Fasilitas lengkap untuk praktikum kimia dengan standar keselamatan tinggi'
            },
            {
                name: 'Laboratorium Biologi',
                description: 'Mikroskop digital dan specimen untuk praktikum biologi'
            }
        ],
        careerProspects: [
            {
                field: 'Kedokteran',
                universities: ['UI', 'UGM', 'ITB', 'UNPAD'],
                description: 'Dokter, dokter spesialis, peneliti medis'
            },
            {
                field: 'Teknik',
                universities: ['ITB', 'UI', 'UGM', 'ITS'],
                description: 'Insinyur, arsitek, teknisi'
            },
            {
                field: 'Sains Murni',
                universities: ['ITB', 'UI', 'UGM', 'UNPAD'],
                description: 'Peneliti, akademisi, analis laboratorium'
            }
        ]
    },
    ips: {
        title: 'Program IPS',
        subtitle: 'Ilmu Pengetahuan Sosial',
        description: 'Program yang mengembangkan pemahaman tentang fenomena sosial, ekonomi, dan budaya serta kemampuan critical thinking dalam menganalisis masalah sosial.',
        coreSubjects: [
            {
                name: 'Sejarah Peminatan',
                hours: 4,
                description: 'Sejarah Indonesia dan dunia, historiografi'
            },
            {
                name: 'Geografi',
                hours: 4,
                description: 'Geografi fisik, manusia, dan lingkungan'
            },
            {
                name: 'Ekonomi',
                hours: 4,
                description: 'Mikroekonomi, makroekonomi, ekonomi pembangunan'
            },
            {
                name: 'Sosiologi',
                hours: 4,
                description: 'Teori sosial, struktur sosial, perubahan sosial'
            }
        ],
        facilities: [
            {
                name: 'Laboratorium IPS',
                description: 'Ruang multimedia untuk pembelajaran interaktif IPS'
            },
            {
                name: 'Perpustakaan Khusus',
                description: 'Koleksi buku dan jurnal ilmu sosial yang lengkap'
            }
        ],
        careerProspects: [
            {
                field: 'Hukum',
                universities: ['UI', 'UGM', 'UNPAD', 'UNDIP'],
                description: 'Pengacara, hakim, notaris, konsultan hukum'
            },
            {
                field: 'Ekonomi & Bisnis',
                universities: ['UI', 'UGM', 'ITB', 'UNPAD'],
                description: 'Ekonom, analis keuangan, entrepreneur'
            },
            {
                field: 'Ilmu Politik',
                universities: ['UI', 'UGM', 'UNPAD', 'UNDIP'],
                description: 'Diplomat, analis politik, jurnalis'
            }
        ]
    },
    bahasa: {
        title: 'Program Bahasa',
        subtitle: 'Ilmu Bahasa dan Budaya',
        description: 'Program yang mengembangkan kemampuan komunikasi, apresiasi sastra, dan pemahaman budaya melalui pembelajaran bahasa Indonesia, bahasa asing, dan studi budaya.',
        coreSubjects: [
            {
                name: 'Bahasa Indonesia',
                hours: 4,
                description: 'Sastra Indonesia, linguistik, kritik sastra'
            },
            {
                name: 'Bahasa Inggris',
                hours: 4,
                description: 'Grammar lanjutan, literature, academic writing'
            },
            {
                name: 'Bahasa Asing Lain',
                hours: 4,
                description: 'Pilihan: Bahasa Arab, Jepang, atau Mandarin'
            },
            {
                name: 'Antropologi',
                hours: 4,
                description: 'Studi budaya, etnografi, antropologi linguistik'
            }
        ],
        facilities: [
            {
                name: 'Laboratorium Bahasa',
                description: 'Fasilitas audio-visual untuk pembelajaran bahasa asing'
            },
            {
                name: 'Perpustakaan Sastra',
                description: 'Koleksi karya sastra Indonesia dan dunia'
            }
        ],
        careerProspects: [
            {
                field: 'Sastra & Linguistik',
                universities: ['UI', 'UGM', 'UNPAD', 'UPI'],
                description: 'Penulis, editor, peneliti bahasa'
            },
            {
                field: 'Komunikasi',
                universities: ['UI', 'UGM', 'UNPAD', 'UNDIP'],
                description: 'Jurnalis, public relations, content creator'
            },
            {
                field: 'Pendidikan',
                universities: ['UPI', 'UNJ', 'UM', 'UNNES'],
                description: 'Guru, dosen, pengembang kurikulum'
            }
        ]
    }
};

// Extracurricular Data Structure as defined in design document
export const extracurricularData = {
    categories: {
        sports: {
            name: 'Olahraga',
            activities: [
                {
                    name: 'Basket',
                    description: 'Pengembangan keterampilan basket dan kerjasama tim',
                    schedule: 'Selasa & Kamis 15:30-17:00',
                    achievements: ['Juara 2 Kabupaten Bandung 2024']
                },
                {
                    name: 'Futsal',
                    description: 'Latihan teknik futsal dan strategi permainan',
                    schedule: 'Senin & Rabu 15:30-17:00',
                    achievements: ['Juara 1 Antar SMA Se-Baleendah 2024']
                },
                {
                    name: 'Voli',
                    description: 'Pelatihan teknik dasar dan strategi permainan bola voli',
                    schedule: 'Rabu & Jumat 15:30-17:00',
                    achievements: ['Juara 3 Turnamen Antar SMA Kabupaten 2024']
                },
                {
                    name: 'Badminton',
                    description: 'Latihan teknik pukulan dan strategi permainan bulutangkis',
                    schedule: 'Selasa & Kamis 16:00-18:00',
                    achievements: ['Juara 1 Ganda Putra Tingkat Kabupaten 2024']
                },
                {
                    name: 'Sepak Bola',
                    description: 'Pelatihan teknik individu dan taktik tim sepak bola',
                    schedule: 'Sabtu 08:00-10:00',
                    achievements: ['Semifinalis Liga Pelajar Kabupaten Bandung 2024']
                }
            ]
        },
        arts: {
            name: 'Seni dan Budaya',
            activities: [
                {
                    name: 'Paduan Suara',
                    description: 'Pengembangan kemampuan vokal dan harmonisasi',
                    schedule: 'Rabu 14:00-16:00',
                    achievements: ['Juara 3 Festival Paduan Suara Tingkat Provinsi 2024']
                },
                {
                    name: 'Tari Tradisional',
                    description: 'Pelestarian dan pengembangan tari daerah Jawa Barat',
                    schedule: 'Jumat 15:00-17:00',
                    achievements: ['Juara 1 Festival Tari Tradisional Kabupaten 2024']
                },
                {
                    name: 'Teater',
                    description: 'Pengembangan kemampuan akting dan penulisan naskah',
                    schedule: 'Sabtu 13:00-15:00',
                    achievements: ['Juara 2 Festival Teater Pelajar Jawa Barat 2024']
                },
                {
                    name: 'Seni Rupa',
                    description: 'Eksplorasi berbagai teknik melukis dan menggambar',
                    schedule: 'Kamis 15:00-17:00',
                    achievements: ['Juara 1 Lomba Poster Pendidikan Tingkat Kabupaten 2024']
                },
                {
                    name: 'Musik',
                    description: 'Pembelajaran alat musik dan pembentukan band sekolah',
                    schedule: 'Selasa 15:30-17:30',
                    achievements: ['Juara 3 Band Competition SMA Se-Bandung 2024']
                }
            ]
        },
        academic: {
            name: 'Akademik',
            activities: [
                {
                    name: 'Olimpiade Sains',
                    description: 'Persiapan kompetisi olimpiade matematika, fisika, kimia, biologi',
                    schedule: 'Sabtu 08:00-12:00',
                    achievements: ['Medali Perunggu OSN Fisika 2024', 'Medali Perak OSN Matematika 2024']
                },
                {
                    name: 'English Club',
                    description: 'Pengembangan kemampuan bahasa Inggris melalui diskusi dan debat',
                    schedule: 'Jumat 14:00-16:00',
                    achievements: ['Juara 2 English Debate Competition Tingkat Provinsi 2024']
                },
                {
                    name: 'Jurnalistik',
                    description: 'Pelatihan menulis berita dan pengelolaan media sekolah',
                    schedule: 'Rabu 15:00-17:00',
                    achievements: ['Juara 1 Lomba Jurnalistik Siswa Tingkat Kabupaten 2024']
                },
                {
                    name: 'Robotika',
                    description: 'Pembelajaran pemrograman dan pembuatan robot sederhana',
                    schedule: 'Sabtu 13:00-16:00',
                    achievements: ['Juara 3 Kompetisi Robot Tingkat Provinsi 2024']
                },
                {
                    name: 'Karya Tulis Ilmiah',
                    description: 'Pelatihan penelitian dan penulisan karya ilmiah remaja',
                    schedule: 'Minggu 09:00-12:00',
                    achievements: ['Juara 2 LKTI Tingkat Nasional 2024']
                }
            ]
        },
        religious: {
            name: 'Keagamaan',
            activities: [
                {
                    name: 'Rohani Islam (ROHIS)',
                    description: 'Kegiatan keagamaan Islam dan pengembangan spiritual',
                    schedule: 'Jumat 12:00-14:00',
                    achievements: ['Juara 1 Lomba Tilawah Tingkat Kabupaten 2024']
                },
                {
                    name: 'Rohani Kristen',
                    description: 'Kegiatan keagamaan Kristen dan pelayanan sosial',
                    schedule: 'Sabtu 14:00-16:00',
                    achievements: ['Peserta Aktif Retreat Pemuda Kristen Tingkat Provinsi 2024']
                },
                {
                    name: 'Rohani Katolik',
                    description: 'Kegiatan keagamaan Katolik dan pengembangan iman',
                    schedule: 'Minggu 08:00-10:00',
                    achievements: ['Peserta Aktif Kemah Rohani Katolik Tingkat Keuskupan 2024']
                },
                {
                    name: 'Dharma Wacana',
                    description: 'Kegiatan keagamaan Hindu dan Buddha serta studi dharma',
                    schedule: 'Sabtu 10:00-12:00',
                    achievements: ['Peserta Aktif Dharma Shanti Tingkat Provinsi 2024']
                }
            ]
        },
        social: {
            name: 'Sosial dan Lingkungan',
            activities: [
                {
                    name: 'Palang Merah Remaja (PMR)',
                    description: 'Pelatihan pertolongan pertama dan kegiatan kemanusiaan',
                    schedule: 'Kamis 15:00-17:00',
                    achievements: ['Juara 1 Lomba PMR Tingkat Kabupaten 2024']
                },
                {
                    name: 'Pramuka',
                    description: 'Kegiatan kepanduan dan pengembangan karakter',
                    schedule: 'Sabtu 14:00-17:00',
                    achievements: ['Juara 2 Jambore Daerah Jawa Barat 2024']
                },
                {
                    name: 'Pecinta Alam',
                    description: 'Kegiatan alam bebas dan konservasi lingkungan',
                    schedule: 'Minggu 06:00-12:00',
                    achievements: ['Juara 1 Lomba Fotografi Alam Tingkat Provinsi 2024']
                },
                {
                    name: 'Relawan Sosial',
                    description: 'Kegiatan bakti sosial dan pemberdayaan masyarakat',
                    schedule: 'Sabtu 08:00-12:00',
                    achievements: ['Penghargaan Relawan Terbaik Kabupaten Bandung 2024']
                },
                {
                    name: 'Green School',
                    description: 'Program sekolah hijau dan edukasi lingkungan',
                    schedule: 'Jumat 15:00-17:00',
                    achievements: ['Sekolah Adiwiyata Tingkat Provinsi 2024']
                }
            ]
        }
    }
};

// Common page metadata for SEO consistency
export const pageMetadata = {
    kurikulum: {
        title: "Kurikulum - SMAN 1 Baleendah",
        description: "Kurikulum Merdeka SMA Negeri 1 Baleendah dengan program MIPA, IPS, dan Bahasa. Sistem pembelajaran modern dan komprehensif.",
        keywords: "kurikulum, SMAN 1 Baleendah, kurikulum merdeka, MIPA, IPS, Bahasa"
    },
    ekstrakurikuler: {
        title: "Ekstrakurikuler - SMAN 1 Baleendah",
        description: "Kegiatan ekstrakurikuler SMA Negeri 1 Baleendah meliputi olahraga, seni, akademik, keagamaan, dan sosial untuk pengembangan bakat siswa.",
        keywords: "ekstrakurikuler, SMAN 1 Baleendah, kegiatan siswa, olahraga, seni, akademik"
    },
    mipa: {
        title: "Program MIPA - SMAN 1 Baleendah",
        description: "Program Matematika dan Ilmu Pengetahuan Alam SMAN 1 Baleendah dengan laboratorium lengkap dan persiapan PTN terbaik.",
        keywords: "program MIPA, matematika, fisika, kimia, biologi, SMAN 1 Baleendah"
    },
    ips: {
        title: "Program IPS - SMAN 1 Baleendah",
        description: "Program Ilmu Pengetahuan Sosial SMAN 1 Baleendah dengan fokus sejarah, geografi, ekonomi, dan sosiologi.",
        keywords: "program IPS, sejarah, geografi, ekonomi, sosiologi, SMAN 1 Baleendah"
    },
    bahasa: {
        title: "Program Bahasa - SMAN 1 Baleendah",
        description: "Program Ilmu Bahasa dan Budaya SMAN 1 Baleendah dengan pembelajaran multibahasa dan studi budaya.",
        keywords: "program bahasa, bahasa Indonesia, bahasa Inggris, sastra, SMAN 1 Baleendah"
    }
};

// Helper functions for data access and manipulation
export const getExtracurricularByCategory = (category) => {
    return extracurricularData.categories[category] || null;
};

export const getAllExtracurricularActivities = () => {
    const allActivities = [];
    Object.values(extracurricularData.categories).forEach(category => {
        category.activities.forEach(activity => {
            allActivities.push({
                ...activity,
                category: category.name
            });
        });
    });
    return allActivities;
};

export const getProgramStudyByType = (type) => {
    return programStudyData[type] || null;
};

export const getAllPrograms = () => {
    return Object.keys(programStudyData).map(key => ({
        type: key,
        ...programStudyData[key]
    }));
};

export const getCurriculumByProgram = (program) => {
    return curriculumData.programs[program] || null;
};

// Validation functions to ensure data completeness
export const validateProgramData = (programData) => {
    const requiredFields = ['title', 'subtitle', 'description', 'coreSubjects', 'facilities', 'careerProspects'];
    return requiredFields.every(field => programData && programData[field]);
};

export const validateExtracurricularData = (activityData) => {
    const requiredFields = ['name', 'description', 'schedule'];
    return requiredFields.every(field => activityData && activityData[field]);
};

export const validateCurriculumData = (curriculumData) => {
    return curriculumData && 
           curriculumData.overview && 
           curriculumData.programs && 
           curriculumData.assessment &&
           Object.keys(curriculumData.programs).length === 3; // MIPA, IPS, Bahasa
};

// Content structure helpers for consistent page layouts
export const createPageContent = (title, description, sections) => {
    return {
        title,
        description,
        sections: sections || [],
        metadata: {
            lastUpdated: new Date().toISOString(),
            version: '1.0'
        }
    };
};

export const createContentSection = (id, title, content, type = 'text') => {
    return {
        id,
        title,
        content,
        type
    };
};