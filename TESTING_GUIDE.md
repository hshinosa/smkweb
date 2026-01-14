# Panduan Testing

## Masalah Umum

### 1. Class "Redis" not found

**Penyebab:** Ekstensi PHP Redis tidak terinstall di environment lokal.

### 2. Redis Connection Error (getaddrinfo for redis failed)

**Error:**
```
php_network_getaddresses: getaddrinfo for redis failed: No such host is known.
```

**Penyebab:** Aplikasi mencoba connect ke hostname `redis` yang hanya ada di Docker network.

**Solusi untuk Local Development:**

Edit file `.env` Anda:

```env
# Gunakan 'file' untuk cache agar tidak perlu Redis
CACHE_STORE=file
SESSION_DRIVER=file

# Jika tetap ingin pakai Redis (dengan Docker berjalan):
# CACHE_STORE=redis
# SESSION_DRIVER=redis
# REDIS_HOST=127.0.0.1
# REDIS_PORT=32768  # Sesuaikan dengan port mapping Docker Anda
```

**Cek Port Mapping Redis:**
```bash
docker ps | grep redis
# Output: 0.0.0.0:32768->6379/tcp
# Gunakan port 32768 di REDIS_PORT
```

---

## Class "Redis" not found (Extension)

Error ini terjadi karena ekstensi PHP Redis tidak terinstall di environment lokal Anda (di luar Docker).

## Solusi 1: Jalankan Test di Dalam Docker (RECOMMENDED)

### Cara 1: Menggunakan docker-compose

```bash
# Jalankan test di dalam container
docker-compose exec app php artisan test

# Atau jalankan test spesifik
docker-compose exec app php artisan test --filter=RagDocumentCrudTest
```

### Cara 2: Menggunakan docker run

```bash
# Build image terlebih dahulu jika belum
docker-compose build app

# Jalankan test
docker-compose run --rm app php artisan test
```

## Solusi 2: Install PHP Redis Extension di Windows

### Menggunakan XAMPP/WAMP

1. Download PHP Redis DLL yang sesuai dengan versi PHP Anda dari: https://pecl.php.net/package/redis
2. Extract file `php_redis.dll` ke folder `ext` di direktori PHP Anda
3. Edit `php.ini` dan tambahkan:
   ```ini
   extension=php_redis.dll
   ```
4. Restart web server
5. Verifikasi dengan `php -m | findstr redis`

### Menggunakan Laravel Herd (Windows)

Laravel Herd sudah include Redis extension secara default.

## Solusi 3: Disable Redis Completely untuk Testing

Jika Anda tidak ingin install Redis extension, Anda bisa memastikan aplikasi tidak menggunakan Redis saat testing.

### Pastikan .env.testing sudah benar

File `.env.testing` sudah dikonfigurasi dengan benar:

```env
CACHE_DRIVER=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync
```

### Verifikasi phpunit.xml

File `phpunit.xml` sudah benar:

```xml
<env name="CACHE_STORE" value="array"/>
<env name="SESSION_DRIVER" value="array"/>
<env name="QUEUE_CONNECTION" value="sync"/>
```

## Rekomendasi

**Gunakan Solusi 1 (Run tests di Docker)** karena:
1. Environment konsisten dengan production
2. Tidak perlu install extension tambahan di lokal
3. Lebih mudah untuk CI/CD

## Menjalankan Semua Test Suite

```bash
# Di dalam Docker
docker-compose exec app php artisan test

# Test spesifik
docker-compose exec app php artisan test --filter=RagDocumentCrudTest
docker-compose exec app php artisan test --filter=AiSettingTest
docker-compose exec app php artisan test --filter=SpmbContentTest
docker-compose exec app php artisan test --filter=ActivityLogTest

# Test dengan coverage
docker-compose exec app php artisan test --coverage
```

## Troubleshooting

### Container tidak running

```bash
# Start semua services
docker-compose up -d

# Cek status
docker-compose ps
```

### Permission issues

```bash
# Fix permissions
docker-compose exec app chown -R www-data:www-data /var/www/storage
docker-compose exec app chmod -R 775 /var/www/storage
```

### Cache issues

```bash
# Clear cache
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan view:clear