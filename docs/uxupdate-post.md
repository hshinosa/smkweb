# Perencanaan Update UX Modul Berita & Pengumuman

Dokumen ini berisi rencana peningkatan User Experience (Basic/Must Have) untuk modul Berita & Pengumuman.

## 1. Filter Kategori Berita (Public)
**Masalah:**
Semua jenis konten (Berita Kegiatan, Pengumuman Penting, Artikel Prestasi) tercampur dalam satu feed. Pengunjung sulit menemukan informasi spesifik seperti "Pengumuman Libur" di antara berita kegiatan.

**Solusi:**
Tab Navigasi atau Dropdown Kategori.
- **Kategori Dasar:** Berita Sekolah, Pengumuman Akademik, Prestasi Siswa, Artikel.
- **Tampilan:** Tab pill di atas list berita.

## 2. "Berita Terkait" / Related Posts (Public)
**Masalah:**
Setelah membaca satu berita, pengunjung harus kembali ke halaman utama untuk mencari berita lain, meningkatkan *bounce rate*.

**Solusi:**
Section "Berita Lainnya" di bagian bawah halaman detail berita.
- **Logika:** Menampilkan 3 berita terbaru lainnya atau berita dengan kategori yang sama.

## 3. Fitur Preview Sebelum Publish (Admin)
**Masalah:**
Admin tidak yakin bagaimana tampilan berita (terutama formatting teks dan gambar) di halaman publik sebelum tombol Publish ditekan.

**Solusi:**
Tombol "Preview" di editor berita.
- **Aksi:** Membuka tab baru yang merender konten berita seolah-olah sudah live, namun datanya belum disimpan permanen ke database publik.
