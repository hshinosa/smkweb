# 🤖 Panduan Model Ollama

Cara mengecek, menginstall, dan mengelola model AI di Ollama.

---

## 📋 Cek Model yang Sudah Terinstall

### Option 1: Via API (Recommended)

```bash
curl http://localhost:32771/api/tags
```

**Output (jika ada models):**
```json
{
  "models": [
    {
      "name": "llama3.2:latest",
      "model": "llama3.2:latest",
      "modified_at": "2026-01-12T03:00:00.000Z",
      "size": 2019393792,
      "digest": "abc123...",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "llama",
        "families": ["llama"],
        "parameter_size": "3.2B",
        "quantization_level": "Q4_0"
      }
    },
    {
      "name": "nomic-embed-text:latest",
      "model": "nomic-embed-text:latest",
      ...
    }
  ]
}
```

**Output (jika kosong):**
```json
{
  "models": []
}
```

### Option 2: Via Docker Exec

```bash
# List semua models
docker exec -it sman1-baleendah-ollama ollama list

# Output contoh:
# NAME                    ID              SIZE    MODIFIED
# llama3.2:latest        abc123def456    2.0 GB  2 hours ago
# nomic-embed-text:latest xyz789ghi012   274 MB  2 hours ago
```

### Option 3: Via Ollama CLI (jika install lokal)

```bash
ollama list
```

---

## 📥 Install Model yang Diperlukan

### Model untuk Chat (llama3.2)

```bash
# Option 1: Via Docker (Recommended untuk Anda)
docker exec -it sman1-baleendah-ollama ollama pull llama3.2

# Option 2: Via Ollama CLI lokal
ollama pull llama3.2

# Progress akan terlihat:
# pulling manifest
# pulling 6a0746a1ec1a... 100% ▕████████████████▏ 2.0 GB
# pulling 4fa551d4f938... 100% ▕████████████████▏  11 KB
# pulling 8ab4849b038c... 100% ▕████████████████▏  254 B
# pulling 577073ffcc6c... 100% ▕████████████████▏  110 B
# pulling ad1518640c43... 100% ▕████████████████▏  483 B
# verifying sha256 digest
# writing manifest
# removing any unused layers
# success
```

### Model untuk Embedding (nomic-embed-text)

```bash
# Via Docker
docker exec -it sman1-baleendah-ollama ollama pull nomic-embed-text

# Via CLI lokal
ollama pull nomic-embed-text

# Ukuran: ~274 MB
# Waktu download: 2-5 menit (tergantung koneksi)
```

---

## 🔍 Verify Model Terinstall

### Test Chat Model

```bash
# Test llama3.2 via API
curl http://localhost:32771/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Hello, how are you?",
  "stream": false
}'

# Jika berhasil, akan return response JSON dengan "response" key
```

### Test Embedding Model

```bash
# Test nomic-embed-text
curl http://localhost:32771/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "Test embedding"
}'

# Jika berhasil, akan return array of numbers (embedding vector)
```

---

## 📊 Model yang Direkomendasikan

### Untuk Chat

| Model | Size | RAM | Speed | Quality |
|-------|------|-----|-------|---------|
| **llama3.2** | 2.0 GB | 4GB | Fast | Good ✅ |
| llama3.2:1b | 1.3 GB | 2GB | Very Fast | OK |
| llama3.1:8b | 4.7 GB | 8GB | Medium | Excellent |
| gemma2:2b | 1.6 GB | 3GB | Fast | Good |

**Recommended:** `llama3.2` (balance antara size, speed, quality)

### Untuk Embedding

| Model | Size | Dimensions | Use Case |
|-------|------|------------|----------|
| **nomic-embed-text** | 274 MB | 768 | General ✅ |
| mxbai-embed-large | 669 MB | 1024 | High quality |
| all-minilm | 45 MB | 384 | Fast, small |

**Recommended:** `nomic-embed-text` (standar, good quality)

---

## 🗑️ Manage Models

### Delete Model (Free Space)

```bash
# Via Docker
docker exec -it sman1-baleendah-ollama ollama rm llama3.2

# Via CLI lokal
ollama rm llama3.2
```

### Show Model Info

```bash
# Via Docker
docker exec -it sman1-baleendah-ollama ollama show llama3.2

# Via CLI lokal
ollama show llama3.2

# Output: Details tentang model, architecture, parameters, dll.
```

---

## 🚨 Troubleshooting

### 1. Container Not Running

**Error:**
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Fix:**
```bash
# Start Ollama container
docker-compose up -d ollama

# Verify
docker ps | grep ollama
```

### 2. Pull Gagal (Timeout)

**Error:**
```
Error: pulling manifest: Get "https://registry.ollama.ai/...": dial tcp: i/o timeout
```

**Fix:**
- Cek koneksi internet
- Coba lagi setelah beberapa menit
- Gunakan VPN jika registry blocked

### 3. Insufficient Disk Space

**Error:**
```
Error: insufficient disk space
```

**Fix:**
```bash
# Check disk usage
docker system df

# Clean unused images/containers
docker system prune -a

# Remove unused Ollama models
docker exec -it sman1-baleendah-ollama ollama list
docker exec -it sman1-baleendah-ollama ollama rm <unused-model>
```

### 4. Model Not Found After Pull

**Symptom:** Pull success tapi `ollama list` masih kosong

**Fix:**
```bash
# Restart Ollama container
docker-compose restart ollama

# Wait 10 seconds
sleep 10

# Check again
docker exec -it sman1-baleendah-ollama ollama list
```

---

## 📝 Quick Reference Commands

```bash
# ===== CEK MODELS =====
curl http://localhost:32771/api/tags
docker exec -it sman1-baleendah-ollama ollama list

# ===== INSTALL MODELS =====
docker exec -it sman1-baleendah-ollama ollama pull llama3.2
docker exec -it sman1-baleendah-ollama ollama pull nomic-embed-text

# ===== TEST MODELS =====
# Chat
curl http://localhost:32771/api/generate -d '{"model":"llama3.2","prompt":"Hello"}'

# Embedding
curl http://localhost:32771/api/embeddings -d '{"model":"nomic-embed-text","prompt":"Test"}'

# ===== DELETE MODEL =====
docker exec -it sman1-baleendah-ollama ollama rm llama3.2

# ===== SHOW INFO =====
docker exec -it sman1-baleendah-ollama ollama show llama3.2

# ===== RESTART OLLAMA =====
docker-compose restart ollama
```

---

## 🎯 Checklist Setup Ollama untuk Proyek

- [ ] Ollama container running (`docker ps | grep ollama`)
- [ ] Port 32771 accessible (`curl http://localhost:32771/api/tags`)
- [ ] Model `llama3.2` installed
- [ ] Model `nomic-embed-text` installed
- [ ] AI Settings configured di Admin Panel:
  - `ollama_base_url` = `http://localhost:32771`
  - `ollama_model` = `llama3.2`
  - `ollama_embedding_model` = `nomic-embed-text`
- [ ] Test chat berhasil (jawaban bervariasi)
- [ ] Check logs: No "Embedding service unavailable"

---

## 💡 Pro Tips

1. **Start Small:** Mulai dengan `llama3.2` (2GB). Jangan langsung download model besar.

2. **Embedding First:** Pull `nomic-embed-text` dulu (kecil, 274MB) untuk test embedding service.

3. **Monitor RAM:** `llama3.2` butuh ~4GB RAM. Jika RAM terbatas, gunakan `llama3.2:1b` (1.3GB).

4. **Test Incremental:** 
   - Test API → Test pull → Test chat → Test embedding
   - Jangan langsung integrate ke app sebelum verify works standalone.

5. **Cache Models:** Once pulled, models cached di Docker volume. Tidak perlu pull lagi kecuali update version.

---

**Updated:** 2026-01-12  
**For Project:** SMAN 1 Baleendah Website