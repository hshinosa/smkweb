# Perencanaan Update UX Modul Galeri Sekolah

Dokumen ini berisi rencana peningkatan User Experience (Basic/Must Have) untuk modul Galeri Sekolah.

## 1. Filter Album / Kategori Acara (Public)
**Masalah:**
Foto kegiatan Wisuda, Lomba 17-an, dan Rapat Guru tercampur dalam satu grid besar. Pengunjung sulit melihat dokumentasi acara tertentu.

**Solusi:**
Sistem Album atau Filter Kategori.
- **Implementasi:** Dropdown atau Tab Kategori (Wisuda, Pensi, Upacara, Fasilitas).
- **Struktur:** Satu item Galeri bisa berisi banyak foto (Konsep Album), bukan foto tunggal yang terpisah.

## 2. Lightbox Viewer (Public)
**Masalah:**
Melihat foto satu per satu dengan membuka halaman baru atau tab baru sangat mengganggu flow pengguna.

**Solusi:**
Implementasi Lightbox (Modal Popup).
- **Interaksi:** Klik thumbnail -> Foto membesar di overlay -> Bisa swipe/klik panah Kanan/Kiri untuk lihat foto selanjutnya tanpa tutup modal.

## 3. Bulk Upload (Admin)
**Masalah:**
Dokumentasi acara biasanya menghasilkan puluhan foto. Mengunggahnya satu per satu di Admin sangat tidak efisien.

**Solusi:**
Area Drag-and-Drop Multiple Files.
- **Fitur:** Admin bisa seleksi 20 foto sekaligus -> Upload -> Sistem otomatis membuat entri galeri atau memasukkannya ke satu album.
