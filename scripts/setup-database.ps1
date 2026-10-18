# PowerShell script to set up the database

Write-Host "🗄️  Setting up database..." -ForegroundColor Cyan

# Navigate to API directory
$apiDir = Join-Path $PSScriptRoot ".." "services" "api"
Set-Location $apiDir

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    
    $envContent = @"
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-key-min-32-characters-long-change-in-production"
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
try {
    pnpm db:generate
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    Write-Host "Make sure pnpm is installed: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

# Push schema to database
Write-Host "📤 Pushing schema to database..." -ForegroundColor Yellow
try {
    pnpm db:push
    Write-Host "✅ Database schema created" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push schema" -ForegroundColor Red
    Write-Host "Make sure database is running: .\scripts\start-db.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. (Optional) Seed database: pnpm db:seed" -ForegroundColor White
Write-Host "  2. Start API: pnpm dev" -ForegroundColor White
Write-Host "  3. Open Prisma Studio: pnpm db:studio" -ForegroundColor White




