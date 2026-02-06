# Audit Admin & Technical Debt: Modul Akademik
Mencakup: Kurikulum, Program Studi, Kalender Akademik.

## 1. Kalender Akademik: Bulk Import
**Masalah:**
- Admin harus menginput 50+ agenda kegiatan setahun satu per satu. Sangat melelahkan.
- **QoL Upgrade:** Fitur Import Excel/CSV untuk Kalender Akademik (Format: Tanggal, Nama Kegiatan, Kategori, Libur Y/N).

## 2. Program Studi: Media Management
**Masalah:**
- Galeri kegiatan jurusan biasanya terbatas atau sulit diupdate.
- **QoL Upgrade:** Integrasi modul *Gallery* agar bisa di-tag ke jurusan tertentu ("Album IPA"), sehingga otomatis muncul di halaman jurusan tanpa upload ulang.

## 3. Kurikulum: Dokumen Versioning
**Masalah:**
- Dokumen kurikulum (PDF) sering berubah setiap tahun/semester. File lama mungkin tertumpuk di storage tanpa dihapus.
- **Teknis:** Mekanisme *Garbage Collection* untuk menghapus PDF lama saat diganti baru.
