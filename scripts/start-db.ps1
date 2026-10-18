# PowerShell script to start simple Postgres database

Write-Host "🚀 Starting local database..." -ForegroundColor Green

# Check if container already exists and is running
$existing = docker ps --filter "name=calc-creator-db" --format "{{.Names}}"
if ($existing) {
    Write-Host "✅ Database is already running" -ForegroundColor Green
    docker ps --filter "name=calc-creator-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    exit 0
}

# Check if container exists but is stopped
$stopped = docker ps -a --filter "name=calc-creator-db" --format "{{.Names}}"
if ($stopped) {
    Write-Host "Starting existing container..." -ForegroundColor Yellow
    docker start calc-creator-db
    Start-Sleep -Seconds 3
} else {
    # Start new container
    docker-compose -f docker-compose.simple.yml up -d
    Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

# Check service health
Write-Host "📊 Checking service status..." -ForegroundColor Cyan
docker ps --filter "name=calc-creator-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "✅ Database is running!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Connection:" -ForegroundColor Cyan
Write-Host "  postgresql://postgres:postgres@127.0.0.1:54321/postgres"
Write-Host ""
Write-Host "🔧 Update your .env:" -ForegroundColor Yellow
Write-Host "  DATABASE_URL=`"postgresql://postgres:postgres@127.0.0.1:54321/postgres`""
