# Run all tests: database and backend

Write-Host "🧪 Running all tests..." -ForegroundColor Cyan
Write-Host ""

# Test database
Write-Host "📊 Testing Database..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
& "$PSScriptRoot\test-db.ps1"
Write-Host ""

# Test backend
Write-Host "📊 Testing Backend API..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
& "$PSScriptRoot\test-backend.ps1"
Write-Host ""

# Run unit tests (if API is set up)
Write-Host "📊 Running Unit Tests..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
$apiDir = Join-Path $PSScriptRoot ".." "services" "api"
if (Test-Path (Join-Path $apiDir "node_modules" ".bin" "vitest")) {
    Set-Location $apiDir
    pnpm test
} else {
    Write-Host "⚠️  Unit tests not available (dependencies not installed)" -ForegroundColor Yellow
    Write-Host "   Install with: cd services/api && pnpm install" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "✅ All tests complete!" -ForegroundColor Green




