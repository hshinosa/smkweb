# Audit Admin & Technical Debt: Sistem & Pengaturan

## 1. Audit Log (Pencatatan Aktivitas)
**Masalah:**
- Tidak ada jejak siapa yang mengubah data. "Siapa yang menghapus berita X?".
- **QoL Upgrade:** Package `spatie/laravel-activitylog` untuk mencatat setiap aksi CRUD admin.

## 2. Contact Message Management
**Masalah:**
- Inbox pesan kontak menumpuk tanpa status jelas. Pesan 2 tahun lalu masih bercampur dengan pesan baru.
- **QoL Upgrade:** Fitur *Archive* otomatis atau manual, serta status "Replied" (Manual toggle).

## 3. Security & RBAC
**Masalah:**
- Semua admin memiliki akses Super Admin? Potensi bahaya jika akun guru biasa disalahgunakan.
- **QoL Upgrade:** Role Management (Super Admin, Editor Berita, Admin Akademik).
