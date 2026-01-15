#!/bin/sh
set -e

echo "==> Starting SMAN1 Baleendah Application..."

# Set proper permissions
echo "==> Setting permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true
chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Create storage link if not exists
if [ ! -e "/var/www/public/storage" ]; then
    echo "==> Creating storage directory..."
    cp -r /var/www/storage/app/public /var/www/public/storage 2>/dev/null || true
fi

# Clear and cache config in production
if [ "$APP_ENV" = "production" ]; then
    echo "==> Cleaning configuration cache..."
    php artisan config:clear 2>/dev/null || true
    php artisan route:clear 2>/dev/null || true
    php artisan view:clear 2>/dev/null || true
fi

# Run migrations if needed (optional - uncomment if you want auto-migration)
# echo "==> Running migrations..."
# php artisan migrate --force

echo "==> Application ready!"

# Let PHP-FPM handle user switching (www pool config already sets user=www-data)
# Don't switch user here as it causes permission issues with /proc/self/fd/2
exec "$@"
