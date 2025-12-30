// Mock data untuk galeri sekolah SMAN 1 Baleendah
export const mockGalleryData = [
    {
        id: 1,
        title: "Upacara Bendera Senin",
        description: "Kegiatan rutin upacara bendera setiap hari Senin di halaman sekolah",
        type: "photo",
        url: "https://picsum.photos/800/600?random=1",
        thumbnail: "https://picsum.photos/300/200?random=1",
        category: "Kegiatan Akademik",
        date: "2024-01-15",
        tags: ["upacara", "bendera", "rutin", "senin"]
    },
    {
        id: 2,
        title: "Lomba Basket Antar Kelas",
        description: "Pertandingan basket seru antar kelas dalam rangka pekan olahraga sekolah",
        type: "photo",
        url: "https://picsum.photos/800/600?random=2",
        thumbnail: "https://picsum.photos/300/200?random=2",
        category: "Olahraga",
        date: "2024-01-20",
        tags: ["basket", "lomba", "OLAHRAGA", "kelas"]
    },
    {
        id: 3,
        title: "Pentas Seni Budaya",
        description: "Pertunjukan seni dan budaya siswa dalam acara tahunan sekolah",
        type: "photo",
        url: "https://picsum.photos/800/600?random=3",
        thumbnail: "https://picsum.photos/300/200?random=3",
        category: "Seni & Budaya",
        date: "2024-02-10",
        tags: ["seni", "budaya", "pentas", "tahunan"]
    },
    {
        id: 4,
        title: "Wisuda Kelas XII",
        description: "Upacara wisuda dan pelepasan siswa kelas XII tahun ajaran 2023/2024",
        type: "photo",
        url: "https://picsum.photos/800/600?random=4",
        thumbnail: "https://picsum.photos/300/200?random=4",
        category: "Wisuda",
        date: "2024-06-15",
        tags: ["wisuda", "kelas12", "pelepasan", "lulus"]
    },
    {
        id: 5,
        title: "Juara OlimpiMAtematika",
        description: "Siswa meraih juara 1 OlimpiMAtematika tingkat Kabupaten",
        type: "photo",
        url: "https://picsum.photos/800/600?random=5",
        thumbnail: "https://picsum.photos/300/200?random=5",
        category: "Prestasi",
        date: "2024-03-25",
        tags: ["olimpiade", "matematika", "juara", "prestasi"]
    },
    {
        id: 6,
        title: "Laboratorium Kimia Baru",
        description: "Fasilitas laboratorium kimia yang baru direnovasi dengan peralatan modern",
        type: "photo",
        url: "https://picsum.photos/800/600?random=6",
        thumbnail: "https://picsum.photos/300/200?random=6",
        category: "Fasilitas",
        date: "2024-01-10",
        tags: ["laboratorium", "kimia", "fasilitas", "renovasi"]
    },
    {
        id: 7,
        title: "Kegiatan Pramuka",
        description: "Kegiatan rutin pramuka setiap hari Jumat sore di lingkungan sekolah",
        type: "photo",
        url: "https://picsum.photos/800/600?random=7",
        thumbnail: "https://picsum.photos/300/200?random=7",
        category: "Kegiatan Akademik",
        date: "2024-02-02",
        tags: ["pramuka", "ekstrakurikuler", "jumat", "rutin"]
    },
    {
        id: 8,
        title: "Festival Band Sekolah",
        description: "Kompetisi band antar sekolah se-Kabupaten Bandung yang diadakan di sekolah",
        type: "photo",
        url: "https://picsum.photos/800/600?random=8",
        thumbnail: "https://picsum.photos/300/200?random=8",
        category: "Seni & Budaya",
        date: "2024-04-12",
        tags: ["band", "musik", "festival", "kompetisi"]
    },
    {
        id: 9,
        title: "Turnamen Futsal",
        description: "Turnamen futsal antar kelas yang berlangsung selama seminggu",
        type: "photo",
        url: "https://picsum.photos/800/600?random=9",
        thumbnail: "https://picsum.photos/300/200?random=9",
        category: "Olahraga",
        date: "2024-03-05",
        tags: ["futsal", "turnamen", "OLAHRAGA", "kelas"]
    },
    {
        id: 10,
        title: "Perpustakaan Digital",
        description: "Fasilitas perpustakaan digital dengan akses internet dan e-book terlengkap",
        type: "photo",
        url: "https://picsum.photos/800/600?random=10",
        thumbnail: "https://picsum.photos/300/200?random=10",
        category: "Fasilitas",
        date: "2024-01-25",
        tags: ["perpustakaan", "digital", "ebook", "internet"]
    },
    {
        id: 11,
        title: "Lomba Debat Bahasa Inggris",
        description: "Kompetisi debat bahasa Inggris tingkat SMA se-Jawa Barat",
        type: "photo",
        url: "https://picsum.photos/800/600?random=11",
        thumbnail: "https://picsum.photos/300/200?random=11",
        category: "Prestasi",
        date: "2024-05-18",
        tags: ["debat", "english", "lomba", "jawabarat"]
    },
    {
        id: 12,
        title: "Pelatihan Robotika",
        description: "Workshop dan pelatihan robotika untuk siswa program MIPA",
        type: "photo",
        url: "https://picsum.photos/800/600?random=12",
        thumbnail: "https://picsum.photos/300/200?random=12",
        category: "Kegiatan Akademik",
        date: "2024-04-08",
        tags: ["robotika", "workshop", "mipa", "teknologi"]
    }
];

export const galleryCategories = [
    "Semua",
    "Kegiatan Akademik",
    "Olahraga", 
    "Seni & Budaya",
    "Wisuda",
    "Prestasi",
    "Fasilitas"
];

// Helper function untuk filter berdasarkan kategori
export const filterGalleryByCategory = (category) => {
    if (category === "Semua") {
        return mockGalleryData;
    }
    return mockGalleryData.filter(item => item.category === category);
};

// Helper function untuk search
export const searchGallery = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return mockGalleryData.filter(item => 
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
};
