# 🔧 Fix AI - Jawaban Selalu Sama

## Masalah

AI chatbot selalu memberikan jawaban yang sama ("Pengumuman Libur Ramadhan") untuk semua pertanyaan.

## Root Causes

1. **Embedding Service unavailable** - Ollama port salah
2. **Chat history corrupted** - Old conversations dengan hardcoded responses
3. **Ollama Base URL tidak dikonfigurasi** di Admin Panel

---

## ✅ Solusi Lengkap (5 Menit)

### Step 1: Configure Ollama Base URL

**Go to:** http://localhost:8000/admin/ai-settings

**Add/Update field baru:**
```
Ollama Base URL: http://localhost:32771
Ollama Model: llama3.2
Ollama Embedding Model: nomic-embed-text
```

**IMPORTANT:** Field `Ollama Base URL` harus ada di AI Settings table!

### Step 2: Clear Corrupted Chat History

```bash
# Option 1: Via Artisan Tinker
php artisan tinker
>>> \App\Models\ChatHistory::truncate();
>>> exit

# Option 2: Via SQL
php artisan db
DELETE FROM chat_histories;
```

### Step 3: Clear Application Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Step 4: Restart Server

```bash
# Ctrl+C di terminal server, lalu:
php artisan serve
```

### Step 5: Test Chatbot

1. **Open:** http://localhost:8000
2. **Click** chat icon (bottom right)
3. **Test dengan pertanyaan berbeda:**
   - "Info PPDB?"
   - "Program studi apa saja?"
   - "Biaya sekolah berapa?"
   - "Bagaimana dengan sekolah ini?"

**Expected:** Jawaban harus berbeda sesuai pertanyaan, bukan selalu "Libur Ramadhan"

---

## 🔍 Verify Ollama Connection

### Test Embedding Service

```bash
# Test Ollama API
curl http://localhost:32771/api/tags

# Should return list of models:
# {
#   "models": [
#     {"name": "llama3.2", ...},
#     {"name": "nomic-embed-text", ...}
#   ]
# }
```

### Check Logs

```bash
tail -f storage/logs/laravel.log

# Good indicators:
✅ "EmbeddingService initialized" with correct base_url
✅ No "Embedding service unavailable"
✅ "[RagService] OpenAI Result" dengan jawaban bervariasi

# Bad indicators:
❌ "Embedding service unavailable, skipping vector search"
❌ "Connection refused" atau "timeout"
❌ Jawaban selalu sama
```

---

## 📊 Add Ollama Base URL to AI Settings Table

Jika field `ollama_base_url` belum ada di database:

### Option 1: Via Tinker (Quick)

```bash
php artisan tinker

>>> \App\Models\AiSetting::updateOrCreate(
...     ['key' => 'ollama_base_url'],
...     ['value' => 'http://localhost:32771']
... );

>>> \App\Models\AiSetting::updateOrCreate(
...     ['key' => 'ollama_model'],
...     ['value' => 'llama3.2']
... );

>>> \App\Models\AiSetting::updateOrCreate(
...     ['key' => 'ollama_embedding_model'],
...     ['value' => 'nomic-embed-text']
... );

>>> exit
```

### Option 2: Via Admin Panel

1. Go to: http://localhost:8000/admin/ai-settings
2. Look for fields:
   - **Ollama Base URL**
   - **Ollama Model**
   - **Ollama Embedding Model**
3. If not exists, add via tinker (Option 1)

---

## 🐛 Debug: Why Same Response?

### Check Chat History

```bash
php artisan tinker

>>> \App\Models\ChatHistory::latest()->take(5)->get(['message', 'sender']);

# If all responses are same → Clear history
>>> \App\Models\ChatHistory::truncate();
```

### Check AI Settings

```bash
php artisan tinker

>>> \App\Models\AiSetting::whereIn('key', [
...     'ai_model_base_url',
...     'ollama_base_url',
...     'ollama_model',
...     'ollama_embedding_model'
... ])->get(['key', 'value']);

# Verify:
# ollama_base_url = http://localhost:32771
# ollama_model = llama3.2
# ollama_embedding_model = nomic-embed-text
```

---

## 🚀 Expected Flow After Fix

### Before Fix:
```
User: "Info PPDB?"
→ Embedding service unavailable
→ No RAG data
→ Simple response fallback
→ AI returns: "Pengumuman Libur Ramadhan..." (STUCK)

User: "Program studi?"
→ Same stuck response (chat history corrupted)
```

### After Fix:
```
User: "Info PPDB?"
→ Embedding service available ✅
→ RAG search (jika ada documents)
→ AI returns: "Untuk info PPDB SMAN 1 Baleendah..." (relevant)

User: "Program studi?"
→ Fresh conversation
→ AI returns: "Kami memiliki 3 program studi..." (relevant)
```

---

## 📝 Preventive Measures

### 1. Monitor Chat History Size

```bash
# Check count
php artisan tinker
>>> \App\Models\ChatHistory::count();

# If > 10,000, consider cleanup old chats:
>>> \App\Models\ChatHistory::where('created_at', '<', now()->subDays(30))->delete();
```

### 2. Add Cleanup Job (Future)

Create scheduled job untuk cleanup old chat history (>30 days).

### 3. Limit Conversation History

Di `RagService::generateSimpleResponse()` sudah ada limit 10 messages. Good!

---

## ✅ Checklist

After following steps above:

- [ ] Ollama Base URL configured: `http://localhost:32771`
- [ ] Chat history cleared
- [ ] Cache cleared
- [ ] Server restarted
- [ ] Test: Different questions return different answers
- [ ] Check logs: No "Embedding service unavailable"
- [ ] Verify: `curl http://localhost:32771/api/tags` returns models

---

**If still stuck, check:** `QUICK_AI_SETUP.md` atau `AI_CONFIGURATION_GUIDE.md`