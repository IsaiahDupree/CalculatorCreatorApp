# Robust database restart script
# Kills existing container and starts fresh

Write-Host "🔄 Restarting database..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop and remove existing container
Write-Host "1️⃣  Stopping existing container..." -ForegroundColor Yellow
$existing = docker ps -a --filter "name=calc-creator-db" --format "{{.Names}}"
if ($existing) {
    Write-Host "Found existing container, stopping..." -ForegroundColor Yellow
    docker stop calc-creator-db 2>&1 | Out-Null
    docker rm calc-creator-db 2>&1 | Out-Null
    Write-Host "✅ Container stopped and removed" -ForegroundColor Green
} else {
    Write-Host "✅ No existing container found" -ForegroundColor Green
}
Write-Host ""

# Step 2: Remove any orphaned containers
Write-Host "2️⃣  Cleaning up orphaned containers..." -ForegroundColor Yellow
docker ps -a --filter "name=calc-creator-db" --format "{{.Names}}" | ForEach-Object {
    if ($_) {
        docker stop $_ 2>&1 | Out-Null
        docker rm $_ 2>&1 | Out-Null
        Write-Host "Removed: $_" -ForegroundColor Yellow
    }
}
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Step 3: Check port availability
Write-Host "3️⃣  Checking port 54321..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 54321 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Port 54321 is in use" -ForegroundColor Yellow
    Write-Host "Killing process using port 54321..." -ForegroundColor Yellow
    $process = Get-NetTCPConnection -LocalPort 54321 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Port freed" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Port 54321 is available" -ForegroundColor Green
}
Write-Host ""

# Step 4: Start fresh container
Write-Host "4️⃣  Starting database container..." -ForegroundColor Yellow
docker-compose -f docker-compose.simple.yml up -d

# Step 5: Wait for health check
Write-Host "5️⃣  Waiting for database to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    Start-Sleep -Seconds 1
    $health = docker inspect calc-creator-db --format "{{.State.Health.Status}}" 2>&1
    $pgReady = docker exec calc-creator-db pg_isready -U postgres 2>&1
    
    if ($health -eq "healthy" -or $pgReady -match "accepting connections") {
        $ready = $true
    }
    $attempt++
    Write-Host "." -NoNewline -ForegroundColor Gray
}

Write-Host ""
if ($ready) {
    Write-Host "✅ Database is ready!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database may still be starting..." -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Display status
Write-Host "📊 Final Status:" -ForegroundColor Cyan
docker ps --filter "name=calc-creator-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Write-Host ""

Write-Host "📍 Connection String:" -ForegroundColor Cyan
Write-Host "  postgresql://postgres:postgres@127.0.0.1:54321/postgres" -ForegroundColor White
Write-Host ""

Write-Host "✅ Database restart complete!" -ForegroundColor Green




