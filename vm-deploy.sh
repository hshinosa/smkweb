#!/bin/bash

# SMAN 1 Baleendah - VM Deployment Script
# Run this script on the azure-vm after files are copied

set -e

echo "🚀 Starting Docker deployment on VM..."

PROJECT_DIR="$HOME/smkweb"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

cd "$PROJECT_DIR"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_warning "Docker installed. You may need to log out and back in for group changes to take effect."
    print_warning "After re-login, run this script again."
    exit 0
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_status "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Determine docker compose command
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

print_status "Using: $COMPOSE_CMD"

# Setup environment
print_status "Setting up production environment..."
if [ -f .env.production ]; then
    cp .env.production .env
    print_status "Copied .env.production to .env"
else
    print_error ".env.production not found!"
    exit 1
fi

# Create required directories
print_status "Creating required directories..."
mkdir -p storage/logs
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/app/public
mkdir -p bootstrap/cache
mkdir -p docker/nginx/ssl

# Set permissions
print_status "Setting permissions..."
chmod -R 775 storage bootstrap/cache

# Create empty SSL directory placeholder (for nginx config)
touch docker/nginx/ssl/.gitkeep 2>/dev/null || true

# Stop existing containers
print_status "Stopping existing containers..."
$COMPOSE_CMD down --remove-orphans 2>/dev/null || true

# Clean up old containers and images (optional - comment out if you want to keep cache)
print_status "Cleaning up old Docker resources..."
docker system prune -f 2>/dev/null || true

# Build and start containers
print_status "Building Docker images (this may take a while)..."
$COMPOSE_CMD build --no-cache

print_status "Starting containers..."
$COMPOSE_CMD up -d

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 15

# Check if database is healthy
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if $COMPOSE_CMD exec -T db pg_isready -U sman1_user -d sman1_baleendah > /dev/null 2>&1; then
        print_status "Database is ready!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Waiting for database... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    print_error "Database did not become ready in time"
    print_status "Checking logs..."
    $COMPOSE_CMD logs db
    exit 1
fi

# Generate application key if not exists
if ! grep -q 'APP_KEY=base64:' .env; then
    print_status "Generating application key..."
    $COMPOSE_CMD exec -T app php artisan key:generate --force
fi

# Run migrations
print_status "Running database migrations..."
$COMPOSE_CMD exec -T app php artisan migrate --force

# Seed database (optional - uncomment if needed for fresh deployment)
# print_status "Seeding database..."
# $COMPOSE_CMD exec -T app php artisan db:seed --force

# Create storage link
print_status "Creating storage link..."
$COMPOSE_CMD exec -T app php artisan storage:link 2>/dev/null || true

# Optimize application
print_status "Optimizing application..."
$COMPOSE_CMD exec -T app php artisan config:cache
$COMPOSE_CMD exec -T app php artisan route:cache
$COMPOSE_CMD exec -T app php artisan view:cache

# Set final permissions
print_status "Setting final permissions..."
$COMPOSE_CMD exec -T app chown -R www-data:www-data /var/www/storage 2>/dev/null || true
$COMPOSE_CMD exec -T app chown -R www-data:www-data /var/www/bootstrap/cache 2>/dev/null || true

# Health check
print_status "Performing health check..."
sleep 5

if $COMPOSE_CMD ps | grep -q 'Up'; then
    print_status "✅ All containers are running!"
    echo ""
    $COMPOSE_CMD ps
    echo ""
else
    print_error "Some containers are not running!"
    $COMPOSE_CMD ps
    exit 1
fi

# Test application response
sleep 5
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    print_status "✅ Application is responding!"
else
    print_warning "Application may not be responding yet. Check with: curl http://localhost"
    print_status "Checking nginx logs..."
    $COMPOSE_CMD logs --tail=20 nginx
fi

echo ""
print_status "🎉 Deployment completed!"
echo ""
print_status "Useful commands:"
echo "  View logs:        $COMPOSE_CMD logs -f"
echo "  View app logs:    $COMPOSE_CMD logs -f app"
echo "  Restart:          $COMPOSE_CMD restart"
echo "  Stop:             $COMPOSE_CMD down"
echo "  Shell access:     $COMPOSE_CMD exec app sh"
echo ""
print_warning "Next steps:"
echo "  1. Configure your domain DNS to point to this VM"
echo "  2. Set up SSL with Let's Encrypt (certbot)"
echo "  3. Update APP_URL in .env with your domain"
echo "  4. Consider running: $COMPOSE_CMD exec app php artisan db:seed --force (if fresh install)"