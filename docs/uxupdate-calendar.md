# Perencanaan Update UX Modul Kalender Akademik

Dokumen ini berisi rencana peningkatan User Experience (Basic/Must Have) untuk fitur Kalender Akademik.

## 1. Visual Kalender Bulanan (Public)
**Masalah:**
Daftar agenda berbentuk *list* teks panjang membosankan dan sulit dibayangkan secara waktu ("Minggu depan ada apa?").

**Solusi:**
Tampilan Grid Kalender (Monthly View).
- **Library:** FullCalendar atau react-calendar.
- **Indikator:** Titik warna pada tanggal yang ada kegiatannya.

## 2. Filter Kategori Agenda (Public)
**Masalah:**
Agenda rapat guru tercampur dengan agenda libur siswa.

**Solusi:**
Filter Kategori (Checkbox/Tabs).
- **Kategori:** "Libur Nasional", "Ujian/Asesmen", "Kegiatan Kesiswaan", "Rapat Dinas".

## 3. "Add to Calendar" (Public)
**Masalah:**
Orang tua sering lupa tanggal penting (pembagian rapor, libur awal puasa).

**Solusi:**
Tombol Ekspor Jadwal.
- **Fitur:** Link `.ics` atau "Add to Google Calendar" untuk menyimpan agenda spesifik ke HP pengguna.
