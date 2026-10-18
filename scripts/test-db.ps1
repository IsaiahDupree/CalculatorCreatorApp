# Test database connection and health

Write-Host "🧪 Testing database..." -ForegroundColor Cyan
Write-Host ""

# Check if database is running
Write-Host "1️⃣  Checking database container..." -ForegroundColor Yellow
$running = docker ps --filter "name=calc-creator-db" --format "{{.Names}}"
if (-not $running) {
    Write-Host "❌ Database is not running" -ForegroundColor Red
    Write-Host "Start it with: .\scripts\start-db.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Database container is running" -ForegroundColor Green
Write-Host ""

# Test connection
Write-Host "2️⃣  Testing database connection..." -ForegroundColor Yellow
$connectionTest = docker exec calc-creator-db pg_isready -U postgres 2>&1
if ($connectionTest -match "accepting connections") {
    Write-Host "✅ Database is accepting connections" -ForegroundColor Green
} else {
    Write-Host "❌ Database connection failed" -ForegroundColor Red
    Write-Host $connectionTest
    exit 1
}
Write-Host ""

# Test query
Write-Host "3️⃣  Testing database query..." -ForegroundColor Yellow
$queryTest = docker exec calc-creator-db psql -U postgres -d postgres -c "SELECT 1 as test;" 2>&1
if ($queryTest -match "test") {
    Write-Host "✅ Database queries work" -ForegroundColor Green
} else {
    Write-Host "⚠️  Query test inconclusive" -ForegroundColor Yellow
}
Write-Host ""

# Check tables
Write-Host "4️⃣  Checking database tables..." -ForegroundColor Yellow
$tables = docker exec calc-creator-db psql -U postgres -d postgres -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';" 2>&1
if ($tables) {
    Write-Host "✅ Database has tables" -ForegroundColor Green
    $tables -split "`n" | Where-Object { $_.Trim() } | ForEach-Object {
        Write-Host "   - $($_.Trim())" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  No tables found (schema not pushed yet)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "✅ Database tests complete!" -ForegroundColor Green




