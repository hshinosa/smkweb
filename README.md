# 🏫 SMAN 1 Baleendah Website

Website resmi SMA Negeri 1 Baleendale - Sekolah Penggerak Prestasi dan Inovasi Masa Depan.

[![Laravel 12](https://img.shields.io/badge/Laravel-12.0-red.svg)](https://laravel.com)
[![React 18](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 Table of Contents

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi Development](#instalasi-development)
- [Deployment Production](#deployment-production)
- [Konfigurasi](#konfigurasi)
- [Logging & Monitoring](#logging--monitoring)
- [Maintenance](#maintenance)
- [Dokumentasi](#dokumentasi)

---

## ✨ Fitur

### 🎯 Fitur Publik
- **Landing Page** - Halaman utama dengan hero section, about, dan CTA
- **Profil Sekolah** - Sejarah, Visi Misi, Struktur Organisasi, Fasilitas
- **Program Akademik** - MIPA, IPS, Bahasa dengan detail kurikulum
- **Ekstrakurikuler** - Daftar kegiatan ekstrakurikuler dengan jadwal
- **Kalender Akademik** - Jadwal tahun ajaran dan semester
- **Berita & Pengumuman** - Sistem manajemen konten dengan kategori
- **Galeri** - Foto dan video kegiatan sekolah
- **Guru & Staff** - Profil tenaga pendidik
- **Alumni** - Testimoni dan profil alumni
- **FAQ** - Pertanyaan umum
- **Kontak** - Formulir kontak dengan validasi
- **Informasi SPMB** - Info penerimaan peserta didik baru
- **🤖 AI Chatbot** - Chatbot cerdas dengan RAG untuk konsultasi sekolah

### ⚙️ Fitur Admin
- **Dashboard** - Overview dengan statistik
- **Content Management** - CRUD untuk semua konten
- **Media Library** - Manajemen gambar dengan WebP conversion
- **Activity Logs** - Audit trail aktivitas admin
- **AI Settings** - Konfigurasi chatbot dan RAG
- **RAG Document Management** - Knowledge base untuk chatbot

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 12.0 (PHP 8.2+) |
| Frontend | React 18.2.0 + Inertia.js |
| Styling | Tailwind CSS 3.2 |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Media | Spatie Media Library |
| Container | Docker + Docker Compose |
| Web Server | Nginx |
| Search | PostgreSQL Full-Text Search |
| AI | OpenAI-compatible API + Ollama |

---

## 💻 Persyaratan Sistem

- Docker & Docker Compose v2.0+
- PHP 8.2+ dengan ekstensi: pdo_pgsql, gd, redis, intl
- Node.js 18+
- Composer 2.0+

---

## 🚀 Instalasi Development

### 1. Clone Repository
```bash
git clone <repository-url>
cd smkweb
```

### 2. Setup Environment
```bash
# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate
```

### 3. Start Development Server
```bash
# Menggunakan Docker Compose
docker-compose up -d

# Atau development script
./dev.sh
```

### 4. Akses Aplikasi
```
URL: http://localhost:8001
Admin: http://localhost:8001/admin
Health: http://localhost:8001/health
```

### 5. Database Migration
```bash
# Run migrations
php artisan migrate

# Seed data (optional)
php artisan db:seed
```

---

## 🏭 Deployment Production

### 1. Persiapan Server
```bash
# Install Docker di server
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Konfigurasi Production
```bash
# Clone repository
git clone <repository-url>
cd smkweb

# Setup environment production
cp .env.example .env
# Edit .env dengan konfigurasi production
```

### 3. Environment Variables Production
```env
APP_NAME="SMAN 1 Baleendah"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://sman1baleendah.sch.id

# Database
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=sman1_baleendah
DB_USERNAME=sman1_user
DB_PASSWORD=<strong-password>

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=<strong-password>
CACHE_STORE=redis
SESSION_DRIVER=redis

# AI Services
AI_MODEL_BASE_URL=https://your-ai-api.com/v1
AI_MODEL_API_KEY=<api-key>

# Logging
LOG_LEVEL=info
LOG_DAILY_DAYS=30
```

### 4. Deploy dengan Script
```bash
# Full deployment
chmod +x deploy.sh
./deploy.sh

# Atau manual
docker-compose down
docker-compose up -d --build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan cache:warmup
```

### 5. Verifikasi Deployment
```bash
# Health check
curl https://sman1baleendah.sch.id/health

# Check containers
docker-compose ps

# View logs
docker-compose logs -f app
```

---

## ⚙️ Konfigurasi

### File Konfigurasi Utama

| File | Deskripsi |
|------|-----------|
| `.env` | Environment variables |
| `docker-compose.yml` | Docker services configuration |
| `config/app.php` | Application config |
| `config/database.php` | Database config |
| `config/cache.php` | Cache config |
| `config/session.php` | Session config |
| `config/logging.php` | Logging config |
| `vite.config.js` | Build config |

### Konfigurasi Docker

```yaml
# Services
- app: PHP-FPM application
- nginx: Web server
- db: PostgreSQL database
- redis: Cache & session store
- backup: Automated backups
- scheduler: Cron jobs
- queue: Background workers
```

### AI/RAG Configuration
```php
// AI Settings di database atau .env
AI_MODEL_BASE_URL=https://api-ai.example.com/v1
AI_MODEL_API_KEY=sk-xxx
AI_MODEL_NAME=gemini-claude-sonnet
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=llama3.2
```

---

## 📊 Logging & Monitoring

### Log Locations
```bash
# Application logs
storage/logs/laravel.log

# Container logs
docker-compose logs -f app
docker-compose logs -f nginx
```

### Health Check Endpoint
```
GET /health
Response:
{
  "status": "healthy",
  "timestamp": "2026-01-12T01:00:00Z",
  "checks": {
    "database": {"status": "healthy", "latency_ms": 5},
    "cache": {"status": "healthy"},
    "redis": {"status": "healthy"},
    "storage": {"status": "healthy"}
  }
}
```

### Monitoring
- **Prometheus**: http://localhost:9100/metrics
- **Health**: http://localhost/health
- **Logs**: storage/logs/

---

## 🛠 Maintenance

### Backup
```bash
# Manual backup
docker-compose exec db pg_dump -U sman1_user sman1_baleendah > backup.sql

# Restore
docker-compose exec -T db psql -U sman1_user sman1_baleendah < backup.sql
```

### Cache Commands
```bash
# Clear all cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Warm cache
php artisan cache:warmup
```

### Update Dependencies
```bash
# PHP
composer install --no-dev --optimize-autoloader

# JS
npm ci
npm run build
```

### Database Maintenance
```bash
# Optimize tables
php artisan db:monitor

# Check connections
docker-compose exec db psql -U sman1_user -c "SELECT * FROM pg_stat_activity;"
```

---

## 📚 Dokumentasi

| Document | Location | Description |
|----------|----------|-------------|
| Development Guidelines | `DEVELOPMENT_GUIDELINES.md` | Coding standards & patterns |
| Audit Report | `AUDIT_REPORT.md` | Security & performance audit |
| Runbook | `RUNBOOK.md` | Operational procedures |
| Changelog | `CHANGELOG.md` | Version history |

---

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'feat: add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

---

## 📄 License

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

## 📞 Kontak

**SMAN 1 Baleendah**
- Alamat: Jl. R.A.A. Wiranatakoesoemah No.30, Baleendah, Kabupaten Bandung
- Email: info@sman1baleendah.sch.id
- Telepon: (022) 5940262

**Developer Support**
- Repository: https://github.com/your-org/smkweb
- Issues: https://github.com/your-org/smkweb/issues

---

**Version:** 1.2.0  
**Last Updated:** 2026-01-12  
**Maintained By:** Development Team
