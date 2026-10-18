# PowerShell script to start local Supabase instance

Write-Host "🚀 Starting local Supabase instance..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Start services
docker-compose up -d

Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service health
Write-Host "📊 Checking service status..." -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Supabase is running!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Services:" -ForegroundColor Cyan
Write-Host "  - API URL: http://127.0.0.1:8000"
Write-Host "  - Studio: http://127.0.0.1:54323"
Write-Host "  - Database: postgresql://postgres:your-super-secret-jwt-token-with-at-least-32-characters-long@127.0.0.1:54322/postgres"
Write-Host ""
Write-Host "🔑 API Keys:" -ForegroundColor Cyan
Write-Host $env:API_TOKEN
Write-Host $env:API_TOKEN
Write-Host ""
Write-Host "📝 Update your .env files with these values!" -ForegroundColor Yellow




