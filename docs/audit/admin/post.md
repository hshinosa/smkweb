# Audit Admin & Technical Debt: Modul Berita (Post)

## 1. Slug Conflict Handling
**Masalah:**
- Jika admin membuat dua berita dengan judul sama, slug bisa bentrok dan menyebabkan error database atau menimpa konten lama.
- **Teknis:** Perlu mekanisme *auto-increment slug* (misal: `judul-berita-1`, `judul-berita-2`).

## 2. Image Optimization & SEO
**Masalah:**
- Gambar berita di-upload mentah. Tidak ada generasi format WebP atau resize otomatis.
- **QoL Upgrade:** Otomatis convert ke WebP dan buat variasi ukuran (thumbnail, medium, large).

## 3. Workflow Draft vs Publish
**Masalah:**
- Mungkin sudah ada kolom status, tapi UX-nya seringkali membingungkan.
- **QoL Upgrade:** Tombol "Simpan sebagai Draft" dan "Publish Sekarang" yang terpisah jelas. Fitur *Schedule Publish* (Tayang otomatis di tanggal depan) sangat dibutuhkan sekolah untuk pengumuman terjadwal.

## 4. Bulk Delete & Category Management
**Masalah:**
- Menghapus berita lama satu per satu sangat tidak efisien.
- Kategori berita mungkin *hardcoded* atau sulit dikelola.
- **QoL Upgrade:** Bulk Delete dan manajemen Kategori/Tag yang dinamis.
