# Perencanaan Update UX Modul RAG & AI (Chatbot)

Dokumen ini berisi rencana peningkatan User Experience (Basic/Must Have) untuk modul AI Knowledge Base.

## 1. AI Testing Playground (Admin)
**Masalah:**
Admin tidak punya cara untuk memvalidasi apakah dokumen yang baru diupload sudah dipahami oleh AI sebelum fitur chat dipakai oleh publik.

**Solusi:**
Area "Coba Chat" di halaman Admin RAG.
- **Fitur:** Kotak chat yang terhubung ke *vector store* sekolah.
- **Debug Info:** Menampilkan dokumen mana (Source Chunks) yang dikutip oleh AI saat menjawab.

## 2. Realtime Processing Status (Admin)
**Masalah:**
Upload dokumen besar (PDF 100 hal) memakan waktu untuk *chunking* dan *embedding*. Admin sering mengira sistem hang/rusak karena tidak ada indikator progres.

**Solusi:**
Status Indikator yang Jelas.
- **Label:** "Mengantri", "Memproses (45%)", "Selesai", "Gagal".
- **Notifikasi:** Toast message saat proses selesai di background.

## 3. Analisis Riwayat Chat (Admin)
**Masalah:**
Sekolah tidak tahu informasi apa yang paling sering ditanyakan siswa/ortu.

**Solusi:**
Dashboard "Top Pertanyaan".
- **Data:** List pertanyaan yang paling sering diajukan.
- **Insight:** Menandai pertanyaan yang jawabannya "Saya tidak tahu" (AI gagal menjawab), sebagai sinyal bagi Admin untuk mengupload dokumen baru yang relevan.
