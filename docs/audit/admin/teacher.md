# Audit Admin & Technical Debt: Modul Guru & Staff

## 1. Manajemen Media (Foto)
**Masalah:**
- Tidak ada otomatisasi kompresi/resize foto guru saat diupload. Foto beresolusi tinggi (5MB+) akan memperlambat loading halaman publik dan admin.
- **Teknis:** Controller mungkin hanya menggunakan `store()`, tanpa intervensi *image processing*.
- **QoL Upgrade:** Implementasi `Intervention Image` atau Spatie Media Conversions untuk membuat thumbnail otomatis (misal: 300x400px).

## 2. Validasi Data
**Masalah:**
- Validasi NIP/GTK ID mungkin belum mengecek keunikan (`unique:teachers,nip`). Potensi duplikasi data.
- **Teknis:** Cek `TeacherRequest`.

## 3. Fitur Reorder (Pengurutan)
**Masalah:**
- Admin sulit mengatur urutan tampil (misal: Kepala Sekolah -> Wakasek -> Guru). Biasanya mengandalkan urutan input ID atau nama (Alfabetis).
- **QoL Upgrade:** Fitur *Drag-and-Drop Reorder* di tabel admin, atau kolom input `sort_order` yang bisa diedit langsung di tabel (*Editable Column*).

## 4. Bulk Actions
**Masalah:**
- Menghapus banyak data guru (misal guru pensiun massal atau data dummy) harus dilakukan satu per satu.
- **QoL Upgrade:** Checkbox di tabel index -> Tombol "Hapus Terpilih".
