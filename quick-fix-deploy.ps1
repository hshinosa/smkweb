# Optimization Fix Deployment
# Updates Dockerfile on VM and rebuilds using cached files

param(
    [string]$VpsHost = "azure-vm",
    [string]$RemotePath = "/var/www/sman1-baleendah"
)

$ErrorActionPreference = "Stop"

function Write-Status { param([string]$Message) Write-Host "[INFO] $Message" -ForegroundColor Green }

Write-Status "🚀 Starting Optimized Re-deployment..."

# 1. Update Dockerfile only
Write-Status "Updating Dockerfile on VM..."
scp Dockerfile "$VpsHost`:$RemotePath/Dockerfile"
scp package.json "$VpsHost`:$RemotePath/package.json"
scp package-lock.json "$VpsHost`:$RemotePath/package-lock.json"

# 2. Rebuild on VM
Write-Status "Triggering remote build..."
$remoteScript = @"
cd $RemotePath

echo 'Building with updated configurations...'
# Using --no-cache for the build stages to ensure new base images are pulled
docker-compose build app

echo 'Restarting containers...'
docker-compose up -d --remove-orphans

echo 'Optimizing...'
docker-compose exec -T app php artisan optimize:clear
docker-compose exec -T app php artisan config:cache
docker-compose exec -T app php artisan view:cache

echo 'Done!'
"@.Replace("`r`n", "`n")

ssh $VpsHost $remoteScript
Write-Status "✅ Deployment updated!"
