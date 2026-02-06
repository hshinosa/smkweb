# Perencanaan Update UX Modul Akademik

Dokumen ini berisi rencana peningkatan User Experience (UX) untuk modul "Data Serapan PTN" dan "Hasil TKA" yang baru diimplementasikan.

## 1. Fitur Import Excel untuk Hasil TKA (Admin)
**Masalah:**
Saat ini input data Hasil TKA dilakukan manual satu per satu. Ini tidak efisien untuk jumlah mata pelajaran yang banyak.

**Solusi:**
Menambahkan fitur Import Excel di halaman Admin Hasil TKA.
- **Format Excel:** Kolom `Tahun`, `Jenis Ujian`, `Mata Pelajaran`, `Nilai Rata-rata`.
- **Proses:** Admin upload file -> Sistem membaca & update/create data otomatis.
- **Benefit:** Mempercepat pengisian data rekapitulasi nilai.

## 2. Pencarian Jurusan Realtime (Public)
**Masalah:**
Pada halaman "Data Serapan PTN", daftar jurusan di dalam setiap PTN bisa sangat panjang. Pengunjung kesulitan menemukan jurusan spesifik (misal: "Kedokteran").

**Solusi:**
Menambahkan Search Bar di atas daftar rincian PTN.
- **Mekanisme:** Realtime filtering pada sisi client (frontend).
- **Interaksi:** Pengunjung mengetik kata kunci -> Accordion PTN otomatis terbuka/terfilter hanya menampilkan jurusan yang cocok.
- **Benefit:** Memudahkan orang tua/siswa mencari jurusan target mereka.

## 3. Grafik Tren Tahunan / Year-over-Year (Public)
**Masalah:**
Grafik saat ini hanya menampilkan snapshot data per tahun (bar chart perbandingan mapel). Pengunjung sulit melihat progres kenaikan/penurunan prestasi sekolah dari tahun ke tahun.

**Solusi:**
Menambahkan Line Chart (Grafik Garis) "Tren Nilai Rata-rata".
- **Data:** Mengambil rata-rata total seluruh mapel per tahun (misal: 2023, 2024, 2025).
- **Tampilan:** Grafik garis sederhana di bagian atas halaman Hasil TKA.
- **Benefit:** Menunjukkan konsistensi prestasi akademik sekolah secara visual.

---
*Dibuat pada: 6 Februari 2026*
