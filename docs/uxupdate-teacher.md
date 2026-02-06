# Perencanaan Update UX Modul Guru & Staff

Dokumen ini berisi rencana peningkatan User Experience (Basic/Must Have) untuk modul Guru & Staff.

## 1. Pencarian Realtime (Public)
**Masalah:**
Daftar guru/staff bisa mencapai puluhan orang. Mencari nama spesifik secara manual (scrolling) menyulitkan orang tua atau siswa.

**Solusi:**
Tambahkan Search Bar di halaman "Guru & Staff".
- **Fitur:** Pencarian berdasarkan Nama dan NIP (opsional).
- **Interaksi:** Hasil muncul instan saat mengetik.

## 2. Filter Mata Pelajaran / Jabatan (Public)
**Masalah:**
Pengunjung sering mencari guru berdasarkan spesialisasi, misal "Siapa saja guru Bahasa Inggris?".

**Solusi:**
Dropdown Filter Kategori.
- **Opsi:** "Semua", "Kepala Sekolah", "Guru MIPA", "Guru Bahasa", "Staff Tata Usaha".
- **Implementasi:** Memanfaatkan kolom `subject` atau `position`.

## 3. Quick Sort Order (Admin)
**Masalah:**
Mengatur urutan tampil guru (misal Kepala Sekolah harus paling atas) seringkali ribet jika harus edit satu per satu.

**Solusi:**
Fitur Reorder Sederhana di tabel Admin.
- **Fitur:** Kolom input nomor urut yang bisa diedit langsung di tabel (tanpa masuk modal edit), lalu tombol "Update Urutan" massal.
