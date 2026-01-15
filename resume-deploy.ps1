# Resume Deployment on VM
# This script runs the build and deploy steps on the VM, assuming files are already there.

$VpsHost = "azure-vm"
$RemotePath = "/var/www/sman1-baleendah"

$remoteScript = @"
set -e
cd $RemotePath

echo 'Building Docker images on VM (with Node 20)...'
# Build app service.
docker-compose build --no-cache app

echo 'Starting containers...'
docker-compose up -d --remove-orphans

echo 'Ensuring container permissions...'
docker-compose exec -T app chmod -R 777 /var/www/storage /var/www/bootstrap/cache

echo 'Running post-deployment tasks...'
docker-compose exec -T app php artisan optimize:clear
docker-compose exec -T app php artisan migrate --force
docker-compose exec -T app php artisan view:cache
docker-compose exec -T app php artisan config:cache

echo 'Deployment complete!'
"@.Replace("`r`n", "`n")

Write-Host "[INFO] Resuming deployment on VM..."
ssh $VpsHost $remoteScript
