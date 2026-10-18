# Comprehensive diagnostic script

Write-Host "🔍 Running diagnostics..." -ForegroundColor Cyan
Write-Host ""

# 1. Check Docker
Write-Host "1️⃣  Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running or not installed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Check database container
Write-Host "2️⃣  Checking database container..." -ForegroundColor Yellow
$container = docker ps -a --filter "name=calc-creator-db" --format "{{.Names}}"
if ($container) {
    Write-Host "✅ Container found: $container" -ForegroundColor Green
    
    $running = docker ps --filter "name=calc-creator-db" --format "{{.Names}}"
    if ($running) {
        Write-Host "✅ Container is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Container exists but is stopped" -ForegroundColor Yellow
        Write-Host "Starting container..." -ForegroundColor Yellow
        docker start calc-creator-db
        Start-Sleep -Seconds 5
    }
} else {
    Write-Host "❌ Container not found" -ForegroundColor Red
    Write-Host "Creating container..." -ForegroundColor Yellow
    docker-compose -f docker-compose.simple.yml up -d
    Start-Sleep -Seconds 5
}
Write-Host ""

# 3. Check container health
Write-Host "3️⃣  Checking container health..." -ForegroundColor Yellow
$health = docker inspect calc-creator-db --format "{{.State.Health.Status}}" 2>&1
if ($health -eq "healthy") {
    Write-Host "✅ Container is healthy" -ForegroundColor Green
} else {
    Write-Host "⚠️  Health status: $health" -ForegroundColor Yellow
    Write-Host "Checking logs..." -ForegroundColor Yellow
    docker logs calc-creator-db --tail 20
}
Write-Host ""

# 4. Test database connection
Write-Host "4️⃣  Testing database connection..." -ForegroundColor Yellow
$ready = docker exec calc-creator-db pg_isready -U postgres 2>&1
if ($ready -match "accepting connections") {
    Write-Host "✅ Database is accepting connections" -ForegroundColor Green
} else {
    Write-Host "❌ Database not ready: $ready" -ForegroundColor Red
}
Write-Host ""

# 5. Check port
Write-Host "5️⃣  Checking port 5432..." -ForegroundColor Yellow
try {
    $portCheck = Test-NetConnection -ComputerName 127.0.0.1 -Port 5432 -WarningAction SilentlyContinue -InformationLevel Quiet
    if ($portCheck) {
        Write-Host "✅ Port 5432 is accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Port 5432 is not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️  Could not test port" -ForegroundColor Yellow
}
Write-Host ""

# 6. Check .env file
Write-Host "6️⃣  Checking .env file..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot ".." "services" "api" ".env"
if (Test-Path $envPath) {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "✅ DATABASE_URL is configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  DATABASE_URL not found in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env file not found at: $envPath" -ForegroundColor Red
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    $envDir = Split-Path $envPath
    if (-not (Test-Path $envDir)) {
        New-Item -ItemType Directory -Path $envDir -Force | Out-Null
    }
    
    $envContent = @"
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-key-min-32-characters-long-change-in-production"
"@
    $envContent | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
}
Write-Host ""

# 7. Check pnpm
Write-Host "7️⃣  Checking pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version 2>&1
    Write-Host "✅ pnpm installed: v$pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm not found" -ForegroundColor Red
    Write-Host "Install with: npm install -g pnpm" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  Database: " -NoNewline
if ($health -eq "healthy") {
    Write-Host "✅ Running" -ForegroundColor Green
} else {
    Write-Host "⚠️  Check needed" -ForegroundColor Yellow
}

Write-Host "  Connection: " -NoNewline
if ($ready -match "accepting") {
    Write-Host "✅ Ready" -ForegroundColor Green
} else {
    Write-Host "❌ Not ready" -ForegroundColor Red
}

Write-Host "  .env file: " -NoNewline
if (Test-Path $envPath) {
    Write-Host "✅ Exists" -ForegroundColor Green
} else {
    Write-Host "❌ Missing" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Diagnostics complete!" -ForegroundColor Green




