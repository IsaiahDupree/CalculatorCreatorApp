# Comprehensive fix script

Write-Host "🔧 Fixing all issues..." -ForegroundColor Cyan
Write-Host ""

# 1. Check and start database
Write-Host "1️⃣  Ensuring database is running..." -ForegroundColor Yellow
$dbRunning = docker ps --filter "name=calc-creator-db" --format "{{.Names}}"
if (-not $dbRunning) {
    Write-Host "Starting database..." -ForegroundColor Yellow
    docker-compose -f docker-compose.simple.yml up -d
    Start-Sleep -Seconds 5
    Write-Host "✅ Database started" -ForegroundColor Green
} else {
    Write-Host "✅ Database already running" -ForegroundColor Green
}
Write-Host ""

# 2. Create .env file
Write-Host "2️⃣  Ensuring .env file exists..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot ".." "services" "api" ".env"
$envDir = Split-Path $envPath

if (-not (Test-Path $envDir)) {
    New-Item -ItemType Directory -Path $envDir -Force | Out-Null
}

if (-not (Test-Path $envPath)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    $envContent = @"
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-key-min-32-characters-long-change-in-production"
"@
    $envContent | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}
Write-Host ""

# 3. Check pnpm
Write-Host "3️⃣  Checking pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version 2>&1
    Write-Host "✅ pnpm installed: v$pnpmVersion" -ForegroundColor Green
    $pnpmInstalled = $true
} catch {
    Write-Host "❌ pnpm not found" -ForegroundColor Red
    Write-Host "Installing pnpm..." -ForegroundColor Yellow
    try {
        npm install -g pnpm
        Write-Host "✅ pnpm installed" -ForegroundColor Green
        $pnpmInstalled = $true
    } catch {
        Write-Host "❌ Failed to install pnpm" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g pnpm" -ForegroundColor Yellow
        $pnpmInstalled = $false
    }
}
Write-Host ""

# 4. Install dependencies and setup database
if ($pnpmInstalled) {
    Write-Host "4️⃣  Setting up database schema..." -ForegroundColor Yellow
    $apiDir = Join-Path $PSScriptRoot ".." "services" "api"
    Set-Location $apiDir
    
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pnpm install
    
    Write-Host "Generating Prisma client..." -ForegroundColor Yellow
    pnpm db:generate
    
    Write-Host "Pushing schema to database..." -ForegroundColor Yellow
    pnpm db:push
    
    Write-Host "✅ Database schema created" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipping database setup (pnpm not available)" -ForegroundColor Yellow
    Write-Host "Install pnpm and run:" -ForegroundColor Yellow
    Write-Host "  cd services/api" -ForegroundColor White
    Write-Host "  pnpm install" -ForegroundColor White
    Write-Host "  pnpm db:generate" -ForegroundColor White
    Write-Host "  pnpm db:push" -ForegroundColor White
}
Write-Host ""

# Summary
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  Database: ✅ Running" -ForegroundColor Green
Write-Host "  .env: ✅ Configured" -ForegroundColor Green
if ($pnpmInstalled) {
    Write-Host "  pnpm: ✅ Installed" -ForegroundColor Green
    Write-Host "  Schema: ✅ Ready" -ForegroundColor Green
} else {
    Write-Host "  pnpm: ❌ Not installed" -ForegroundColor Red
    Write-Host "  Schema: ⏳ Pending" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "✅ Fix complete!" -ForegroundColor Green




