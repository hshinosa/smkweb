# Stage 1: Build Frontend Assets
FROM node:18-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: PHP Production Environment
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git curl libpng-dev libxml2-dev zip unzip \
    mysql-client nginx supervisor \
    oniguruma-dev freetype-dev libjpeg-turbo-dev \
    autoconf g++ make rsync

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del autoconf g++ make

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# 1. Copy hanya file composer dulu
COPY composer.json composer.lock ./

# 2. Install dependencies dengan --no-scripts
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# 3. Copy seluruh source code aplikasi
COPY . .

# 4. Copy hasil build frontend dari stage node-builder
COPY --from=node-builder /app/public/build ./public/build

# 5. Jalankan package discovery secara manual setelah semua file lengkap
RUN php artisan package:discover --ansi

# 6. Backup public directory untuk sync ke shared volume
RUN cp -r /var/www/public /var/www/public-source

# Set permissions and create necessary directories
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache \
    && mkdir -p /var/log/supervisor

# Copy supervisor config and entrypoint
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]