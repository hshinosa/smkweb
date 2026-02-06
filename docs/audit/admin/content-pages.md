# Audit Admin & Technical Debt: Halaman Konten (Landing, SPMB, FAQ)

## 1. Landing Page (Beranda)
**Masalah:**
- **Fleksibilitas:** Urutan section (Hero, Sambutan, Berita, Galeri) biasanya *hardcoded* di view. Admin tidak bisa memindahkan "Berita" ke atas "Sambutan".
- **Performance:** Section Hero sering memuat gambar besar tanpa *preload* atau *responsive srcset*, menyebabkan LCP (Largest Contentful Paint) buruk.
- **QoL Upgrade:** Fitur *Section Reordering* dan *Image Optimization* otomatis untuk Hero banner.

## 2. Informasi SPMB (PPDB)
**Masalah:**
- **Struktur Konten:** Seringkali hanya satu editor teks raksasa (WYSIWYG), sulit mengatur layout info biaya, syarat, dan jadwal secara terpisah.
- **Visual Timeline:** Editor saat ini hanya mendukung teks/tabel standar, sulit membuat visualisasi alur pendaftaran yang menarik.
- **QoL Upgrade:** Pemisahan field input yang lebih granular (Tab Syarat, Tab Biaya, Tab Jadwal) dan komponen builder untuk Timeline.

## 3. FAQ (Tanya Jawab)
**Masalah:**
- **Kategorisasi:** Jika FAQ ada 50+, tanpa kategori akan sangat berantakan di admin maupun publik. Semua pertanyaan tampil dalam satu list panjang.
- **Feedback Loop:** Tidak ada cara mengetahui apakah jawaban FAQ membantu pengguna atau tidak.
- **QoL Upgrade:** Manajemen Kategori FAQ (Akademik, Sarana, Umum) dan fitur "Was this helpful?" voting.
