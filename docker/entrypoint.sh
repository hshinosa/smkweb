#!/bin/sh
set -e

echo "==> Starting SMAN1 Baleendah Application..."

# Sync public directory to shared volume (for nginx)
if [ -d "/var/www/public-source" ]; then
    echo "==> Syncing public assets to shared volume..."
    cp -r /var/www/public-source/* /var/www/public/ 2>/dev/null || true
    echo "==> Public assets synced successfully"
fi

# Set proper permissions
echo "==> Setting permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true
chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Create storage link if not exists
if [ ! -L "/var/www/public/storage" ]; then
    echo "==> Creating storage link..."
    php artisan storage:link 2>/dev/null || true
fi

# Clear and cache config in production
if [ "$APP_ENV" = "production" ]; then
    echo "==> Caching configuration..."
    php artisan config:cache 2>/dev/null || true
    php artisan route:cache 2>/dev/null || true
    php artisan view:cache 2>/dev/null || true
fi

# Run migrations if needed (optional - uncomment if you want auto-migration)
# echo "==> Running migrations..."
# php artisan migrate --force

echo "==> Application ready!"

# Execute the main command
exec "$@"
