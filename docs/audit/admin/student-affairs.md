# Audit Admin & Technical Debt: Modul Kesiswaan
Mencakup: Alumni, Ekskul, Prestasi (PTN & TKA).

## 1. Alumni: Verifikasi Data
**Masalah:**
- Jika fitur "Kirim Testimoni" dibuka ke publik, admin butuh filter kuat untuk mencegah spam/konten tidak layak.
- **QoL Upgrade:** Dashboard "Pending Approval" dengan tombol *Approve/Reject* cepat.

## 2. Ekskul: Jadwal Terstruktur
**Masalah:**
- Jadwal latihan seringkali hanya teks bebas ("Senin sore"). Sulit untuk difilter oleh siswa ("Saya cari ekskul hari Selasa").
- **Teknis:** Kolom terstruktur (JSON/Relasi) untuk hari dan jam latihan.

## 3. Prestasi TKA: Error Handling Import
**Masalah:**
- Saat import Excel nilai, jika ada format salah di baris ke-50, apakah seluruh proses gagal? Atau sebagian masuk?
- **Teknis:** Implementasi *Transaction Database* (DB Transaction) agar data atomik (masuk semua atau gagal semua), serta laporan error baris mana yang bermasalah.
