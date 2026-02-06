# Audit Admin & Technical Debt: Modul Galeri

## 1. Multi-Upload (Bulk Upload)
**Masalah:**
- Admin upload dokumentasi acara (50 foto) satu per satu? UX nightmare.
- **QoL Upgrade:** Area *Dropzone* yang mendukung upload simultan banyak file.

## 2. Thumbnail Generation
**Masalah:**
- Menampilkan 50 foto resolusi asli di halaman admin akan membuat browser nge-lag berat.
- **Teknis:** Gunakan *media library* yang otomatis generate *responsive images* (srcset).

## 3. Video Handling
**Masalah:**
- Upload video langsung ke server sangat membebani storage dan bandwidth.
- **QoL Upgrade:** Prioritaskan embed YouTube/Vimeo. Jika harus upload, batasi durasi/size dan otomatis compress (misal pakai FFmpeg, tapi sulit di shared hosting).
