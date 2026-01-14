# 📘 RUNBOOK - SMAN 1 Baleendah Website

Dokumen ini berisi panduan operasional untuk deployment, monitoring, troubleshooting, dan incident response.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Deployment Procedures](#deployment-procedures)
4. [Monitoring & Alerts](#monitoring--alerts)
5. [Logging](#logging)
6. [Troubleshooting](#troubleshooting)
7. [Incident Response](#incident-response)
8. [Backup & Recovery](#backup--recovery)
9. [Security](#security)
10. [Maintenance](#maintenance)

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- PHP 8.2+
- Composer
- Node.js 18+
- Git

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd smkweb

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Build and start
docker-compose up -d --build
```

### Verify Installation
```bash
# Health check
curl http://localhost/health

# Check containers
docker-compose ps

# Check logs
docker-compose logs -f app
```

---

## ⚙️ Environment Setup

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Application
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
DB_PASSWORD=your-secure-password

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=your-redis-password
CACHE_STORE=redis
SESSION_DRIVER=redis

# AI Services (RAG Chatbot)
AI_MODEL_BASE_URL=https://your-ai-api.com/v1
AI_MODEL_API_KEY=your-api-key

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=info
LOG_DAILY_DAYS=30
```

### Production Environment
```bash
# Set production values
APP_ENV=production
APP_DEBUG=false
CACHE_STORE=redis
SESSION_DRIVER=redis
LOG_LEVEL=info
```

---

## 📦 Deployment Procedures

### Automated Deployment (Production)
```bash
# Using deploy script
./deploy.sh

# Or manually
git pull origin main
docker-compose down
docker-compose up -d --build
php artisan migrate --force
php artisan cache:clear
php artisan config:cache
```

### Manual Deployment Steps
```bash
# 1. Backup database
docker-compose exec db pg_dump -U sman1_user sman1_baleendah > backup_$(date +%Y%m%d).sql

# 2. Pull latest code
git pull origin main

# 3. Update dependencies
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# 4. Run migrations
php artisan migrate --force

# 5. Warm cache
php artisan cache:warmup

# 6. Restart containers
docker-compose restart app

# 7. Verify
curl https://sman1baleendah.sch.id/health
```

### Rollback Procedure
```bash
# If deployment fails
git checkout <previous-commit>
docker-compose up -d --build
php artisan config:clear
```

---

## 📊 Monitoring & Alerts

### Health Check Endpoints
```bash
# Application health
GET /health

# Response format
{
  "status": "healthy",
  "timestamp": "2026-01-12T01:00:00Z",
  "version": "12.0.0",
  "environment": "production",
  "checks": {
    "database": { "status": "healthy", "latency_ms": 5.2 },
    "cache": { "status": "healthy", "latency_ms": 1.1 },
    "redis": { "status": "healthy", "latency_ms": 0.8 },
    "storage": { "status": "healthy" }
  }
}
```

### Prometheus Metrics
```bash
# HAProxy exporter at port 9100
curl http://localhost:9100/metrics

# Key metrics to monitor:
# - http_request_duration_seconds
# - http_requests_total
# - php_processes_running
# - database_connections_active
# - cache_hit_rate
```

### Key Metrics to Monitor

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Response Time | > 2s | > 5s | Check database & cache |
| Error Rate | > 1% | > 5% | Check logs |
| CPU Usage | > 70% | > 90% | Scale up |
| Memory Usage | > 80% | > 95% | Check for leaks |
| Disk Usage | > 70% | > 90% | Clean logs |
| Cache Hit Rate | < 80% | < 60% | Check cache config |
| Database Connections | > 80% | > 95% | Check queries |

### Alerting Setup
```yaml
# Alertmanager config example
groups:
  - name: sman1-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 5%"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "P95 response time above 5s"
```

---

## 📝 Logging

### Log Locations
```bash
# Application logs
storage/logs/laravel.log

# Docker container logs
docker-compose logs -f app
docker-compose logs -f nginx

# Database logs
docker-compose logs db

# Redis logs
docker-compose logs redis
```

### Log Configuration
```php
// config/logging.php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'info',
        'days' => 30,  // Keep 30 days of logs
    ],
    'slack' => [
        'driver' => 'slack',
        'level' => 'critical',
        // Critical errors sent to Slack
    ],
]
```

### Log Rotation (Docker)
```yaml
# docker-compose.yml - Add to app service
logging:
  driver: "json-file"
  options:
    max-size: "100m"
    max-file: "10"
```

### Querying Logs
```bash
# View recent errors
tail -f storage/logs/laravel.log | grep ERROR

# Search for specific error
grep "Connection refused" storage/logs/laravel.log

# View last 100 lines
tail -n 100 storage/logs/laravel.log
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Application Not Responding
```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats

# Check application logs
docker-compose logs app --tail=100

# Restart services
docker-compose restart app
```

#### 2. Database Connection Failed
```bash
# Check database connectivity
docker-compose exec app php artisan tinker
DB::connection()->getPdo();

# Check database health
docker-compose exec db pg_isready -U sman1_user

# Check connection pool
docker-compose exec db psql -U sman1_user -c "SELECT count(*) FROM pg_stat_activity;"
```

#### 3. Cache Issues
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Check Redis
docker-compose exec redis redis-cli ping

# Check cache stats
docker-compose exec redis redis-cli info stats | grep keyspace
```

#### 4. Session Problems
```bash
# Check session driver
php artisan tinker
config('session.driver'); // Should be 'redis'

# Clear sessions
php artisan session:clear
```

#### 5. AI/Chatbot Not Working
```bash
# Check AI service health
curl http://localhost/api/chat/history

# Check Ollama availability
docker-compose exec app curl http://ollama:11434/api/tags

# Check logs
grep -i "ai\|ollama\|openai" storage/logs/laravel.log
```

### Performance Issues
```bash
# Check slow queries
docker-compose exec db psql -U sman1_user -c "
  SELECT query, calls, mean_time, total_time
  FROM pg_stat_statements
  ORDER BY mean_time DESC
  LIMIT 10;
"

# Check cache hit ratio
docker-compose exec redis redis-cli info stats | grep keyspace

# Check memory usage
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

---

## 🚨 Incident Response

### Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|-----------|
| P1 - Critical | Complete outage | 15 min | Site down, DB unavailable |
| P2 - High | Major feature broken | 1 hour | Chatbot down, can't login |
| P3 - Medium | Minor issue | 4 hours | Slow page loads |
| P4 - Low | Minor bug | 24 hours | UI glitch |

### Incident Response Steps

#### 1. Detection & Alert
- Monitor receives alert
- On-call engineer acknowledges
- Initial assessment within 15 minutes

#### 2. Diagnosis
```bash
# Check system status
./scripts/system-status.sh

# Check recent deployments
git log --oneline -10

# Check error logs
tail -500 storage/logs/laravel.log | grep -i error
```

#### 3. Containment
```bash
# If issue is deployment-related
git checkout <previous-stable>

# If DB issue
docker-compose restart db

# If cache issue
docker-compose restart redis
```

#### 4. Resolution
```bash
# Apply fix
git checkout <fix-branch>
git merge <main>

# Deploy fix
./deploy.sh

# Verify fix
curl https://sman1baleendah.sch.id/health
```

#### 5. Post-Incident
- Document incident in INCIDENT_LOG.md
- Schedule post-mortem meeting
- Update runbook if needed

---

## 💾 Backup & Recovery

### Automated Backups
```bash
# Docker Compose includes backup service
docker-compose ps | grep backup

# Backup runs daily at 2 AM
# Keeps 7 days of backups
# Location: ./backups/
```

### Manual Backup
```bash
# Database backup
docker-compose exec db pg_dump -U sman1_user sman1_baleendah > backup_db_$(date +%Y%m%d_%H%M%S).sql

# Uploaded files backup
docker cp sman1-baleendah-app:/var/www/storage/app/public ./storage-backup/

# Full backup script
./scripts/backup.sh
```

### Recovery
```bash
# Restore database
docker-compose exec -T db psql -U sman1_user sman1_baleendah < backup_db_20260112.sql

# Restore files
docker cp ./storage-backup/. sman1-baleendah-app:/var/www/storage/app/public/
```

### Backup Schedule
| Data | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| Database | Daily 2 AM | 7 days | ./backups/ |
| Logs | Weekly | 30 days | storage/logs/ |
| Uploads | Real-time sync | 30 days | S3/Cloud |

---

## 🔒 Security

### Security Checklist
- [ ] SSL certificate valid
- [ ] APP_DEBUG=false in production
- [ ] Strong DB password
- [ ] API keys in .env (not git)
- [ ] Regular security updates
- [ ] Log monitoring enabled
- [ ] Rate limiting enabled
- [ ] CSP headers enabled

### Security Commands
```bash
# Check for vulnerabilities
composer audit
npm audit

# Check permissions
chmod 640 .env
chmod 640 storage/logs/*.log

# Generate new APP_KEY
php artisan key:generate
```

---

## 🛠️ Maintenance

### Daily Tasks
- Check health endpoint
- Review error logs
- Monitor disk usage

### Weekly Tasks
- Review performance metrics
- Check backup success
- Review security logs
- Clean up old log files

### Monthly Tasks
- Security updates
- Dependency updates
- Performance audit
- Disaster recovery test

### Commands
```bash
# Clear old logs
php artisan log:clear

# Optimize database
php artisan db:monitor

# Check for updates
composer outdated
npm outdated

# Run scheduled tasks manually
php artisan schedule:run
```

---

## 📞 Contacts

| Role | Contact | Responsibility |
|------|---------|----------------|
| On-Call Engineer | [Phone] | Initial response |
| DevOps Lead | [Email] | Infrastructure |
| Tech Lead | [Email] | Technical decisions |
| Security Team | [Email] | Security incidents |

---

## 🔗 Useful Links

- **Production URL**: https://sman1baleendah.sch.id
- **Health Check**: https://sman1baleendah.sch.id/health
- **Repository**: https://github.com/your-org/smkweb
- **Monitoring Dashboard**: https://grafana.your-org.com
- **Error Tracking**: https://sentry.your-org.com

---

**Last Updated:** 2026-01-12  
**Version:** 1.0.0  
**Maintained By:** Development Team