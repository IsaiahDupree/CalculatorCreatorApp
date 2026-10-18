# PowerShell script to check database status

Write-Host "🔍 Checking database status..." -ForegroundColor Cyan
Write-Host ""

# Check if container exists
$container = docker ps -a --filter "name=calc-creator-db" --format "{{.Names}}"
if (-not $container) {
    Write-Host "❌ Database container not found!" -ForegroundColor Red
    Write-Host "Start it with: .\scripts\start-db.ps1" -ForegroundColor Yellow
    exit 1
}

# Check if running
$running = docker ps --filter "name=calc-creator-db" --format "{{.Names}}"
if (-not $running) {
    Write-Host "⚠️  Database container exists but is not running" -ForegroundColor Yellow
    Write-Host "Starting container..." -ForegroundColor Yellow
    docker start calc-creator-db
    Start-Sleep -Seconds 3
}

# Get container status
Write-Host "📊 Container Status:" -ForegroundColor Cyan
docker ps --filter "name=calc-creator-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Write-Host ""

# Check health
Write-Host "🏥 Health Check:" -ForegroundColor Cyan
$health = docker inspect calc-creator-db --format "{{.State.Health.Status}}" 2>&1
if ($health -eq "healthy") {
    Write-Host "✅ Database is healthy" -ForegroundColor Green
} elseif ($health -eq "starting") {
    Write-Host "⏳ Database is starting up..." -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Health status: $health" -ForegroundColor Yellow
}
Write-Host ""

# Check logs for errors
Write-Host "📋 Recent Logs:" -ForegroundColor Cyan
docker logs calc-creator-db --tail 10
Write-Host ""

# Test connection (if psql is available)
Write-Host "🔌 Connection Test:" -ForegroundColor Cyan
$testResult = docker exec calc-creator-db pg_isready -U postgres 2>&1
if ($testResult -match "accepting connections") {
    Write-Host "✅ Database is accepting connections" -ForegroundColor Green
} else {
    Write-Host "❌ Database connection test failed" -ForegroundColor Red
    Write-Host $testResult
}
Write-Host ""

# Connection string
Write-Host "📍 Connection String:" -ForegroundColor Cyan
Write-Host "  postgresql://postgres:postgres@127.0.0.1:54321/postgres" -ForegroundColor White
Write-Host ""

# Check if port is accessible
Write-Host "🌐 Port Check:" -ForegroundColor Cyan
$portCheck = Test-NetConnection -ComputerName 127.0.0.1 -Port 54321 -WarningAction SilentlyContinue
if ($portCheck.TcpTestSucceeded) {
    Write-Host "✅ Port 54321 is accessible" -ForegroundColor Green
} else {
    Write-Host "❌ Port 54321 is not accessible" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Database check complete!" -ForegroundColor Green

