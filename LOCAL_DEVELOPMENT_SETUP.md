# 🚀 Local Development Setup Guide

Panduan lengkap untuk menjalankan aplikasi SMAN 1 Baleendah di environment lokal (Windows/Mac/Linux).

---

## 📋 Prerequisites

- PHP 8.2 atau 8.3
- Composer 2.x
- Node.js 18+
- Docker Desktop (untuk database & services)
- Git

---

## 🔧 Setup Step-by-Step

### 1. Clone Repository

```bash
git clone <repository-url>
cd smkweb
```

### 2. Install Dependencies

```bash
# Backend dependencies
composer install

# Frontend dependencies
npm install
```

### 3. Environment Configuration

#### A. Copy Environment File

```bash
cp .env.example .env
```

#### B. Edit `.env` untuk Local Development

Berikut konfigurasi yang **HARUS** diubah:

```env
# ========================================
# APP CONFIGURATION
# ========================================
APP_NAME="SMAN 1 Baleendah"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# ========================================
# DATABASE CONFIGURATION
# ========================================
# Option 1: SQLite (Simple, for development)
DB_CONNECTION=sqlite
# DB_DATABASE akan otomatis ke database/database.sqlite

# Option 2: PostgreSQL via Docker (Recommended)
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432  # Default PostgreSQL port
# DB_DATABASE=sman1_baleendah
# DB_USERNAME=sman1_user
# DB_PASSWORD=sman1_password_2024

# ========================================
# CACHE & SESSION CONFIGURATION
# ========================================
# IMPORTANT: Use 'file' driver for local development
# Redis hanya untuk production atau jika Anda paham setup-nya
CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

# ========================================
# REDIS CONFIGURATION (Optional)
# ========================================
# Jika Anda ingin menggunakan Redis di lokal:
# 1. Pastikan Redis container berjalan (docker-compose up -d redis)
# 2. Cek port mapping: docker ps | grep redis
# 3. Update konfigurasi di bawah

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=32768  # ⚠️ SESUAIKAN dengan port mapping Docker Anda!
REDIS_DB=0
REDIS_CACHE_DB=1

# Jika Redis tidak digunakan, biarkan konfigurasi ini (tidak akan error)

# ========================================
# QDRANT CONFIGURATION (Vector Database)
# ========================================
# Jika Anda menjalankan Qdrant di Docker:
QDRANT_HOST=127.0.0.1
QDRANT_PORT=6333  # Default Qdrant port
QDRANT_API_KEY=

# ========================================
# AI CONFIGURATION (Optional)
# ========================================
# Konfigurasi ini akan disimpan di database via Admin Panel
# Biarkan kosong untuk sekarang, bisa diatur nanti via UI

# ========================================
# MAIL CONFIGURATION
# ========================================
MAIL_MAILER=log  # Email akan ditulis ke log, tidak dikirim
MAIL_FROM_ADDRESS="info@sman1baleendah.sch.id"
MAIL_FROM_NAME="${APP_NAME}"
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Database Setup

#### Option 1: SQLite (Simple)

```bash
# Create database file
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed data (optional)
php artisan db:seed
```

#### Option 2: PostgreSQL via Docker

```bash
# Start PostgreSQL container
docker-compose up -d db

# Wait for database to be ready (5-10 seconds)
sleep 10

# Run migrations
php artisan migrate

# Seed data (optional)
php artisan db:seed
```

### 6. Start Development Servers

#### Terminal 1: Laravel Development Server

```bash
php artisan serve
# Server running at: http://localhost:8000
```

#### Terminal 2: Vite Dev Server (Frontend Hot Reload)

```bash
npm run dev
# Vite server running at: http://localhost:5173
```

### 7. Access Application

- **Frontend:** http://localhost:8000
- **Admin Login:** http://localhost:8000/admin/login
  - Username: `admin@sman1baleendah.sch.id`
  - Password: (sesuai seeder, default: `password`)

---

## 🐳 Using Docker Services (Optional)

Jika Anda ingin menjalankan services via Docker sambil develop di lokal:

### Start Specific Services

```bash
# PostgreSQL only
docker-compose up -d db

# Redis only
docker-compose up -d redis

# Qdrant only
docker-compose up -d qdrant

# All services
docker-compose up -d
```

### Check Running Containers

```bash
docker ps
```

Output akan menampilkan port mapping, contoh:

```
CONTAINER ID   IMAGE              PORTS                     NAMES
abc123def456   postgres:15-alpine 0.0.0.0:5432->5432/tcp   sman1-baleendah-db
def456ghi789   redis:7-alpine     0.0.0.0:32768->6379/tcp  sman1-baleendah-redis
```

Gunakan port yang di-map (32768 di contoh) untuk `REDIS_PORT` di `.env`.

### Stop Services

```bash
# Stop all
docker-compose down

# Stop specific service
docker-compose stop redis
```

---

## 🔍 Troubleshooting

### 1. Redis Connection Error

**Error:**
```
php_network_getaddresses: getaddrinfo for redis failed: No such host is known.
```

**Solusi:**
1. Gunakan `CACHE_STORE=file` di `.env` (recommended untuk local)
2. Atau pastikan Redis berjalan dan port mapping benar

```bash
# Cek Redis container
docker ps | grep redis

# Output: 0.0.0.0:32768->6379/tcp
# Update REDIS_PORT=32768 di .env
```

### 2. Class "Redis" not found

**Solusi:**
Gunakan `CACHE_STORE=file` di `.env`. Tidak perlu install PHP Redis extension untuk development.

### 3. Database Migration Error

```bash
# Reset database
php artisan migrate:fresh

# With seeder
php artisan migrate:fresh --seed
```

### 4. Vite/NPM Build Error

```bash
# Clear cache & reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 5. Storage Permission Error (Linux/Mac)

```bash
chmod -R 775 storage bootstrap/cache
```

### 6. Qdrant Not Available

Jika chatbot error karena Qdrant tidak tersedia:

**Option 1:** Disable RAG via Admin Panel
- Login → AI Settings → Set `RAG Enabled` = false

**Option 2:** Start Qdrant
```bash
docker-compose up -d qdrant
```

---

## 🧪 Running Tests

### Run All Tests

```bash
php artisan test
```

### Run Specific Test

```bash
php artisan test --filter=RagDocumentCrudTest
```

### With Coverage

```bash
php artisan test --coverage
```

---

## 🎨 Frontend Development

### Build for Production

```bash
npm run build
```

### Lint & Format

```bash
npm run lint  # (jika configured)
```

---

## 📚 Common Commands

```bash
# Clear all cache
php artisan optimize:clear

# Clear specific cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate IDE helper (if installed)
php artisan ide-helper:generate

# Check Laravel version
php artisan --version

# List all routes
php artisan route:list
```

---

## 🚨 Before Committing

```bash
# Format code (if Pint is configured)
./vendor/bin/pint

# Run tests
php artisan test

# Build frontend
npm run build

# Check for errors
php artisan config:cache
php artisan route:cache
```

---

## 📞 Need Help?

- Check `TESTING_GUIDE.md` untuk masalah Redis & testing
- Check `DEVELOPMENT_GUIDELINES.md` untuk coding standards
- Check `README.md` untuk dokumentasi umum

---

**Happy Coding! 🚀**