# 🤖 AI Chatbot Configuration Guide

Panduan lengkap untuk mengkonfigurasi AI Chatbot dengan RAG (Retrieval-Augmented Generation).

---

## 📋 Overview

Chatbot menggunakan arsitektur 3-tier fallback:
1. **Primary:** OpenAI-compatible API (atau provider lain seperti OpenRouter, Gemini)
2. **Fallback 1:** Ollama (Local AI)
3. **Fallback 2:** Hardcoded responses (jika semua gagal)

---

## 🔧 Konfigurasi via Admin Panel (RECOMMENDED)

### Step 1: Login Admin

```
URL: http://localhost:8000/admin/login
Username: admin@sman1baleendah.sch.id
Password: (sesuai database seeder)
```

### Step 2: Navigate ke AI Settings

```
Menu: Admin Dashboard → AI Settings
URL: http://localhost:8000/admin/ai-settings
```

### Step 3: Konfigurasi AI Provider

#### Option A: OpenRouter (RECOMMENDED untuk Development)

OpenRouter menyediakan akses ke berbagai model AI dengan harga murah.

**Konfigurasi:**
```
AI Model Base URL: https://openrouter.ai/api/v1
AI Model API Key: sk-or-v1-xxx (dapatkan dari https://openrouter.ai)
AI Model Name: google/gemini-2.0-flash-thinking-exp:free
AI Embedding Model: text-embedding-3-small
AI Max Tokens: 2000
AI Temperature: 0.7
RAG Enabled: ✅ Yes
RAG Top K: 5
```

**Mendapatkan API Key:**
1. Daftar di https://openrouter.ai
2. Generate API key
3. Copy dan paste ke AI Settings

**Model Gratis (Free Tier):**
- `google/gemini-2.0-flash-thinking-exp:free`
- `meta-llama/llama-3.2-3b-instruct:free`
- `qwen/qwen-2-7b-instruct:free`

#### Option B: Google AI Studio (Gemini)

**Konfigurasi:**
```
AI Model Base URL: https://generativelanguage.googleapis.com/v1beta/openai
AI Model API Key: AIzaxxx (dapatkan dari https://aistudio.google.com)
AI Model Name: gemini-1.5-flash
AI Embedding Model: text-embedding-004
AI Max Tokens: 2000
AI Temperature: 0.7
RAG Enabled: ✅ Yes
RAG Top K: 5
```

#### Option C: Ollama (Local AI - No API Key Needed)

**Prasyarat:** Ollama harus running di Docker atau lokal

**Port Mapping:** Docker 32771:11434 (sesuaikan dengan `docker ps`)

**Konfigurasi untuk Local Development:**
```
AI Model Base URL: http://localhost:32771/v1
AI Model API Key: ollama (dummy, tidak digunakan)
AI Model Name: llama3.2
AI Embedding Model: nomic-embed-text
AI Max Tokens: 2000
AI Temperature: 0.7
RAG Enabled: ✅ Yes
RAG Top K: 5
Use Ollama Fallback: ✅ Yes
```

**⚠️ IMPORTANT:** Port `32771` adalah contoh dari Docker mapping. Cek port Anda dengan:
```bash
docker ps | grep ollama
# Output: 0.0.0.0:32771->11434/tcp
# Gunakan port 32771 (atau yang muncul) di Base URL
```

**Install Ollama Models:**
```bash
# Start Ollama container
docker-compose up -d ollama

# Verify running
docker ps | grep ollama

# Pull models (pakai container name atau ID)
docker exec -it sman1-baleendah-ollama ollama pull llama3.2
docker exec -it sman1-baleendah-ollama ollama pull nomic-embed-text

# Test via API
curl http://localhost:32771/api/tags
```

---

## 🗄️ Konfigurasi Qdrant (Vector Database)

### Start Qdrant Container

```bash
docker-compose up -d qdrant
```

### Verifikasi Qdrant Running

```bash
# Check container status
docker ps | grep qdrant

# Test API
curl http://localhost:6333/collections
```

### Update .env untuk Qdrant

```env
QDRANT_HOST=127.0.0.1
QDRANT_PORT=6333
QDRANT_API_KEY=  # kosongkan jika tidak pakai authentication
```

---

## 📚 Upload RAG Documents

### Via Admin Panel

1. Navigate ke: **Admin → RAG Documents**
2. Click **"Create Document"**
3. Fill form:
   - Title: "Panduan PPDB 2026"
   - Category: "PPDB"
   - Content: (paste informasi lengkap tentang PPDB)
4. Click **Save**

**Auto-processing:**
- Document akan otomatis di-chunk (512 tokens per chunk)
- Embeddings akan di-generate
- Disimpan ke Qdrant vector database

### Document Categories (Recommended)

- **PPDB** - Informasi penerimaan peserta didik baru
- **Akademik** - Kurikulum, program studi, ekstrakurikuler
- **Fasilitas** - Laboratorium, perpustakaan, sarana
- **Biaya** - Informasi biaya sekolah (GRATIS untuk SMA Negeri)
- **Kontak** - Alamat, telepon, email, sosial media
- **Umum** - Informasi lain tentang sekolah

---

## 🧪 Testing Chatbot

### Via Frontend

1. Akses: http://localhost:8000
2. Click tombol chat di pojok kanan bawah
3. Test dengan pertanyaan:
   - "Info PPDB?"
   - "Program studi apa saja?"
   - "Biaya sekolah berapa?"
   - "Alamat sekolahnya dimana?"

### Expected Behavior

**Jika Configured Correctly:**
```
User: Info PPDB?
Bot: [Jawaban lengkap dari RAG documents atau database]
```

**Jika API Key Invalid (403 Error):**
```
User: Info PPDB?
Bot: 📌 Informasi PPDB SMAN 1 Baleendah
     Maaf, sistem AI sedang offline...
     [Hardcoded fallback response]
```

**Jika Ollama Running:**
```
User: Info PPDB?
Bot: [Jawaban dari Ollama local AI]
Provider: ollama
```

---

## 🔍 Troubleshooting

### 1. Chatbot Returns "Sistem AI sedang offline"

**Penyebab:**
- API key tidak valid (403 Forbidden)
- Base URL salah
- Ollama tidak running

**Solusi:**
```bash
# Check logs
tail -f storage/logs/laravel.log

# Look for:
# [OpenAIService] API Error, attempting Ollama fallback {"status":403}
# → API key invalid atau base URL salah

# [OpenAIService] Ollama unavailable, using hardcoded response
# → Ollama tidak running
```

**Fix:**
1. Periksa AI Settings di Admin Panel
2. Verifikasi API key valid
3. Test API key manual:
   ```bash
   curl https://openrouter.ai/api/v1/models \
     -H "Authorization: Bearer sk-or-v1-xxx"
   ```

### 2. Qdrant Connection Error

**Error:**
```
Connection refused to localhost:6333
```

**Solusi:**
```bash
# Start Qdrant
docker-compose up -d qdrant

# Verify
curl http://localhost:6333/collections

# Should return: {"result":{"collections":[]}}
```

### 3. Embedding Service Unavailable

**Log:**
```
Embedding service unavailable, skipping vector search
```

**Penyebab:**
- Ollama tidak running (untuk nomic-embed-text)
- OpenAI API key invalid (untuk text-embedding-3-small)

**Solusi:**
- Start Ollama: `docker-compose up -d ollama`
- Atau gunakan OpenAI embedding dengan valid API key

### 4. Empty or Generic Responses

**Penyebab:**
- No RAG documents uploaded
- Documents not processed (embeddings not generated)

**Solusi:**
1. Upload RAG documents via Admin Panel
2. Wait for processing (check logs)
3. Verify in Qdrant:
   ```bash
   curl http://localhost:6333/collections/school_kb/points/count
   ```

---

## 💰 Cost Estimation (Production)

### OpenRouter Pricing (per 1M tokens)

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| Gemini 2.0 Flash (free) | $0 | $0 | Development/Testing |
| GPT-4o Mini | $0.15 | $0.60 | Production (cheap) |
| GPT-4o | $2.50 | $10.00 | Production (high quality) |

**Estimated Monthly Cost (1000 users, 10 queries/user/month):**
- Gemini 2.0 Flash (free): **$0/month**
- GPT-4o Mini: **~$5-10/month**
- GPT-4o: **~$50-100/month**

### Ollama (Local AI)

**Cost:** FREE (self-hosted)

**Requirements:**
- CPU: 4+ cores
- RAM: 8GB+
- Disk: 10GB+ (for models)

**Trade-off:**
- ✅ Zero API costs
- ✅ Privacy (data tidak keluar server)
- ⚠️ Kualitas jawaban lebih rendah
- ⚠️ Latency lebih tinggi (2-5 detik)

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] AI API key configured dan tested
- [ ] RAG documents uploaded (minimal 10-20 documents)
- [ ] Qdrant running dan accessible
- [ ] Ollama installed sebagai fallback (optional tapi recommended)
- [ ] Rate limiting configured (sudah ada: 20 req/min)
- [ ] Monitoring setup (Sentry untuk track errors)
- [ ] Cost alerts setup (untuk API usage)

---

## 📖 References

- **OpenRouter:** https://openrouter.ai
- **Google AI Studio:** https://aistudio.google.com
- **Ollama:** https://ollama.ai
- **Qdrant:** https://qdrant.tech/documentation

---

**Need Help?** Check `TESTING_GUIDE.md` atau `LOCAL_DEVELOPMENT_SETUP.md`