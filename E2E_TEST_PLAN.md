# Rencana Pengujian End-to-End (E2E) Admin Frontend

**Tujuan:** Memverifikasi bahwa semua operasi CRUD (Create, Read, Update, Delete) berfungsi dengan benar dan notifikasi toast muncul sesuai aksi.

## Prasyarat
1.  Server Laravel berjalan (`php artisan serve`).
2.  Server Vite berjalan (`npm run dev`).
3.  Database sudah di-seed dengan data awal.
4.  Login sebagai Admin.

## Modul 1: Alumni (`/admin/alumni`)

### 1.1 Read (Index)
-   **Aksi:** Buka halaman `/admin/alumni`.
-   **Ekspektasi:** Tabel daftar alumni ditampilkan dengan benar.

### 1.2 Create
-   **Aksi:** Klik tombol "Tambah Alumni".
-   **Isi Form:**
    -   Nama: "Test Alumni"
    -   Tahun Lulus: "2025"
    -   Bidang: "Teknologi"
    -   Pekerjaan: "Software Engineer"
    -   Pendidikan: "S1 Informatika"
    -   Testimoni: "Ini adalah testimoni test."
    -   Upload Foto (opsional).
-   **Submit:** Klik tombol "Tambah".
-   **Ekspektasi:**
    -   Modal tertutup.
    -   Toast muncul: "Alumni baru berhasil ditambahkan" (hijau).
    -   Data baru muncul di tabel.

### 1.3 Update
-   **Aksi:** Klik ikon edit (pensil) pada data "Test Alumni".
-   **Isi Form:** Ubah Nama menjadi "Test Alumni Updated".
-   **Submit:** Klik tombol "Simpan".
-   **Ekspektasi:**
    -   Modal tertutup.
    -   Toast muncul: "Data alumni berhasil diperbarui" (hijau).
    -   Nama di tabel berubah menjadi "Test Alumni Updated".

### 1.4 Delete
-   **Aksi:** Klik ikon hapus (tempat sampah) pada data "Test Alumni Updated".
-   **Konfirmasi:** Klik "OK" pada dialog konfirmasi.
-   **Ekspektasi:**
    -   Data hilang dari tabel.
    -   Toast muncul: "Data alumni berhasil dihapus" (hijau).

## Modul 2: RAG Documents (`/admin/rag-documents`)

### 2.1 Read (Index)
-   **Aksi:** Buka halaman `/admin/rag-documents`.
-   **Ekspektasi:** Tabel daftar dokumen RAG ditampilkan.

### 2.2 Create
-   **Aksi:** Klik tombol "Tambah Dokumen".
-   **Isi Form:**
    -   Judul: "Test Document"
    -   Kategori: "Umum"
    -   Konten: "Ini adalah konten dokumen test."
-   **Submit:** Klik tombol "Simpan".
-   **Ekspektasi:**
    -   Redirect ke halaman index.
    -   Toast muncul: "Dokumen berhasil disimpan" (hijau).
    -   Data baru muncul di tabel.

### 2.3 Update
-   **Aksi:** Klik ikon edit pada "Test Document".
-   **Isi Form:** Ubah Judul menjadi "Test Document Updated".
-   **Submit:** Klik tombol "Simpan".
-   **Ekspektasi:**
    -   Redirect ke halaman index.
    -   Toast muncul: "Dokumen berhasil diperbarui" (hijau).
    -   Judul di tabel berubah.

### 2.4 Delete
-   **Aksi:** Klik ikon hapus pada "Test Document Updated".
-   **Konfirmasi:** Klik "OK".
-   **Ekspektasi:**
    -   Data hilang dari tabel.
    -   Toast muncul: "Dokumen berhasil dihapus" (hijau).

### 2.5 Reprocess
-   **Aksi:** Klik ikon refresh (reprocess) pada dokumen yang ada.
-   **Konfirmasi:** Klik "OK".
-   **Ekspektasi:**
    -   Ikon berputar (loading).
    -   Toast muncul: "Dokumen berhasil diproses ulang" (hijau).

## Modul 3: AI Settings (`/admin/ai-settings`)

### 3.1 Read (Index)
-   **Aksi:** Buka halaman `/admin/ai-settings`.
-   **Ekspektasi:** Form pengaturan AI ditampilkan.

### 3.2 Update
-   **Aksi:** Ubah nilai "Base URL" menjadi "https://test-api.com/v1".
-   **Submit:** Klik tombol "Simpan Perubahan".
-   **Ekspektasi:**
    -   Toast muncul: "Pengaturan AI berhasil diperbarui" (hijau).
    -   Nilai input tetap "https://test-api.com/v1" (reload halaman untuk verifikasi persistensi).

## Modul 4: Posts (`/admin/posts`)

### 4.1 Create
-   **Aksi:** Klik "Tulis Berita".
-   **Isi Form:** Judul "Test Post", Kategori "Berita", Konten "Test content".
-   **Submit:** Klik "Publikasikan".
-   **Ekspektasi:** Toast "Berita baru berhasil dipublikasikan".

### 4.2 Update
-   **Aksi:** Edit "Test Post". Ubah Judul.
-   **Submit:** Klik "Simpan".
-   **Ekspektasi:** Toast "Berita berhasil diperbarui".

### 4.3 Delete
-   **Aksi:** Hapus post.
-   **Ekspektasi:** Toast "Berita berhasil dihapus".

## Modul 5: Teachers (`/admin/teachers`)

### 5.1 Create (Tab Guru)
-   **Aksi:** Buka tab "Daftar Guru". Klik "Tambah".
-   **Isi Form:** Nama "Test Guru", Jabatan "Guru Matematika".
-   **Submit:** Klik "Tambah Data".
-   **Ekspektasi:** Toast "Data guru/staff baru berhasil ditambahkan".

### 5.2 Update
-   **Aksi:** Edit "Test Guru". Ubah Jabatan.
-   **Submit:** Klik "Simpan Perubahan".
-   **Ekspektasi:** Toast "Data guru/staff berhasil diperbarui".

### 5.3 Delete
-   **Aksi:** Hapus "Test Guru".
-   **Ekspektasi:** Toast "Data guru/staff berhasil dihapus".

## Modul 6: Galleries (`/admin/galleries`)

### 6.1 Create
-   **Aksi:** Klik "Tambah Item".
-   **Isi Form:** Judul "Test Gallery", Upload gambar.
-   **Submit:** Klik "Tambah".
-   **Ekspektasi:** Toast "Item galeri baru berhasil ditambahkan".

### 6.2 Update
-   **Aksi:** Edit "Test Gallery". Ubah Judul.
-   **Submit:** Klik "Simpan".
-   **Ekspektasi:** Toast "Item galeri berhasil diperbarui".

### 6.3 Delete
-   **Aksi:** Hapus "Test Gallery".
-   **Ekspektasi:** Toast "Item galeri berhasil dihapus".

## Modul 7: Extracurriculars (`/admin/extracurriculars`)

### 7.1 Create
-   **Aksi:** Klik "Tambah Ekskul".
-   **Isi Form:** Nama "Test Ekskul", Kategori "Olahraga".
-   **Submit:** Klik "Tambah".
-   **Ekspektasi:** Toast "Ekskul baru berhasil ditambahkan".

### 7.2 Update
-   **Aksi:** Edit "Test Ekskul".
-   **Submit:** Klik "Simpan".
-   **Ekspektasi:** Toast "Ekskul berhasil diperbarui".

### 7.3 Delete
-   **Aksi:** Hapus "Test Ekskul".
-   **Ekspektasi:** Toast "Ekskul berhasil dihapus".

## Modul 8: FAQs (`/admin/faqs`)

### 8.1 Create
-   **Aksi:** Klik "Tambah FAQ".
-   **Isi Form:** Pertanyaan "Test Q?", Jawaban "Test A".
-   **Submit:** Klik "Tambah".
-   **Ekspektasi:** Toast "FAQ baru berhasil ditambahkan".

### 8.2 Update
-   **Aksi:** Edit "Test Q?".
-   **Submit:** Klik "Simpan".
-   **Ekspektasi:** Toast "FAQ berhasil diperbarui".

### 8.3 Delete
-   **Aksi:** Hapus "Test Q?".
-   **Ekspektasi:** Toast "FAQ berhasil dihapus".

## Modul 9: Programs (`/admin/programs`)

### 9.1 Create
-   **Aksi:** Klik "Tambah Program".
-   **Isi Form:** Judul "Test Program", Kategori "Akademik".
-   **Submit:** Klik "Tambah".
-   **Ekspektasi:** Toast "Program baru berhasil ditambahkan".

### 9.2 Update
-   **Aksi:** Edit "Test Program".
-   **Submit:** Klik "Simpan".
-   **Ekspektasi:** Toast "Program berhasil diperbarui".

### 9.3 Delete
-   **Aksi:** Hapus "Test Program".
-   **Ekspektasi:** Toast "Program berhasil dihapus".

## Modul 10: Content Management (SPMB & Landing Page)

### 10.1 SPMB (`/admin/spmb`)
-   **Aksi:** Ubah judul di tab "Pengaturan Umum".
-   **Submit:** Klik "Simpan Perubahan".
-   **Ekspektasi:** Toast "Perubahan berhasil disimpan".

### 10.2 Landing Page (`/admin/landingpage`)
-   **Aksi:** Ubah judul di tab "Hero".
-   **Submit:** Klik "Simpan Perubahan".
-   **Ekspektasi:** Toast "Perubahan berhasil disimpan".

## Checklist Verifikasi Toast
-   [ ] Toast muncul di pojok kanan atas.
-   [ ] Warna toast hijau untuk sukses.
-   [ ] Warna toast merah untuk error (jika ada).
-   [ ] Toast hilang otomatis setelah beberapa detik.
-   [ ] Toast bisa ditutup manual dengan tombol X.
-   [ ] Tidak ada banner sukses lama yang muncul bersamaan dengan toast.

## Catatan
-   Jika toast tidak muncul, cek Console browser (F12) untuk error JavaScript.
-   Pastikan `react-hot-toast` sudah terinstall (`npm list react-hot-toast`).
-   Pastikan `Toaster` component ada di `AdminLayout.jsx`.