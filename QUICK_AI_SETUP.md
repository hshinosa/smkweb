# ⚡ Quick AI Setup Reference

Panduan cepat untuk setup AI Chatbot.

---

## 🎯 Your Docker Port Mappings

Berdasarkan `docker ps`, port mapping Anda:

```
Redis:   127.0.0.1:32768 → 6379
Ollama:  127.0.0.1:32771 → 11434
Qdrant:  127.0.0.1:6333  → 6333 (langsung)
```

---

## 🤖 AI Configuration via Admin Panel

**URL:** http://localhost:8000/admin/ai-settings

### Option 1: Ollama (Local - RECOMMENDED untuk Anda)

Karena Ollama sudah running di Docker, gunakan konfigurasi ini:

```
✅ AI Model Base URL: http://localhost:32771/v1
✅ AI Model API Key: ollama
✅ AI Model Name: llama3.2
✅ AI Embedding Model: nomic-embed-text
✅ AI Max Tokens: 2000
✅ AI Temperature: 0.7
✅ RAG Enabled: Yes
✅ RAG Top K: 5
✅ Use Ollama Fallback: Yes
```

**Verify Ollama Running:**
```bash
curl http://localhost:32771/api/tags

# Should return list of models
# If empty, pull models first
```

**Pull Models (if not yet):**
```bash
docker exec -it sman1-baleendah-ollama ollama pull llama3.2
docker exec -it sman1-baleendah-ollama ollama pull nomic-embed-text
```

### Option 2: OpenRouter (Cloud - FREE Tier)

Jika Ollama terlalu lambat atau Anda ingin kualitas lebih baik:

1. **Get API Key:** https://openrouter.ai (gratis)

2. **Configure:**
```
AI Model Base URL: https://openrouter.ai/api/v1
AI Model API Key: sk-or-v1-[your-key]
AI Model Name: google/gemini-2.0-flash-thinking-exp:free
AI Embedding Model: text-embedding-3-small
AI Max Tokens: 2000
AI Temperature: 0.7
RAG Enabled: Yes
RAG Top K: 5
Use Ollama Fallback: Yes (keep this for safety)
```

---

## 🗄️ Qdrant Setup

**Already Running?** Check:
```bash
curl http://localhost:6333/collections
```

**Not Running?** Start:
```bash
docker-compose up -d qdrant
```

**Update .env:**
```env
QDRANT_HOST=127.0.0.1
QDRANT_PORT=6333
QDRANT_API_KEY=
```

---

## 📚 Upload RAG Documents

1. **Go to:** http://localhost:8000/admin/rag-documents
2. **Click:** Create Document
3. **Fill:**
   - Title: "Informasi PPDB 2026"
   - Category: "PPDB"
   - Content: [Paste lengkap info PPDB]
4. **Save** → Auto-process embeddings

**Recommended Documents:**
- PPDB (Penerimaan Peserta Didik Baru)
- Biaya Sekolah (GRATIS untuk SMA Negeri)
- Program Studi (MIPA, IPS, Bahasa)
- Ekstrakurikuler
- Fasilitas
- Kontak & Alamat

---

## ✅ Testing Checklist

1. **Clear Cache:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

2. **Restart Server:**
   ```bash
   php artisan serve
   ```

3. **Test Chatbot:**
   - Open: http://localhost:8000
   - Click chat icon (bottom right)
   - Ask: "Info PPDB?"
   - Should get natural answer (not hardcoded)

4. **Check Logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

   **Success indicators:**
   - `[RagService] OpenAI Result {"success":true...}`
   - No "403" or "Ollama unavailable"
   - Natural responses

---

## 🔍 Troubleshooting

### Chatbot Still Returns Hardcoded Response

**Check logs for:**
```
[OpenAIService] API Error, attempting Ollama fallback {"status":403}
```
→ **Fix:** Periksa AI Model Base URL di Admin Panel (harus `http://localhost:32771/v1`)

```
[OpenAIService] Ollama unavailable
```
→ **Fix:** 
```bash
docker ps | grep ollama  # Pastikan running
curl http://localhost:32771/api/tags  # Test API
```

### Empty Responses

```bash
# Check Ollama models
docker exec -it sman1-baleendah-ollama ollama list

# Should show llama3.2 and nomic-embed-text
# If not, pull them
```

### Slow Responses

**Normal:** Ollama lokal biasanya 3-5 detik
**Too Slow (>10s):** Consider switching to OpenRouter (cloud)

---

## 💡 Pro Tips

1. **Development:** Gunakan Ollama (gratis, privacy)
2. **Production:** Gunakan OpenRouter/OpenAI (lebih cepat, better quality)
3. **Best Setup:** Primary = OpenRouter, Fallback = Ollama
4. **Upload 10-20 RAG docs** untuk jawaban lebih akurat

---

## 📖 Full Documentation

- **AI Setup:** `AI_CONFIGURATION_GUIDE.md`
- **Local Dev:** `LOCAL_DEVELOPMENT_SETUP.md`
- **Testing:** `TESTING_GUIDE.md`
- **Audit:** `LAPORAN_AUDIT_PROYEK_KOMPREHENSIF.md`

---

**Last Updated:** 2026-01-12  
**Your Setup:** Ollama @ localhost:32771, Redis @ localhost:32768