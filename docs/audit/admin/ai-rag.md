# Audit Admin & Technical Debt: AI & Automation

## 1. Feedback Loop Processing
**Masalah:**
- Admin tidak tahu apakah dokumen PDF yang diupload berhasil di-*chunk* dengan benar atau gagal di tengah jalan.
- **QoL Upgrade:** Notifikasi Realtime (Pusher/Reverb) atau Polling status processing.

## 2. Token Usage Monitoring
**Masalah:**
- Penggunaan OpenAI API berbayar. Jika tidak dipantau, tagihan bisa membengkak karena spam atau error loop.
- **Teknis:** Dashboard sederhana "Estimasi Biaya Bulan Ini" atau "Total Token Terpakai".

## 3. Fallback Mechanism
**Masalah:**
- Jika API OpenAI down, chatbot di frontend akan error/diam.
- **Teknis:** *Graceful degradation* (Misal: Tampilkan pesan "Fitur sedang maintenance, silakan hubungi WA").
