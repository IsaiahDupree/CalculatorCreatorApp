# PowerShell script to stop local Supabase instance

Write-Host "🛑 Stopping local Supabase instance..." -ForegroundColor Yellow

docker-compose down

Write-Host "✅ Supabase stopped!" -ForegroundColor Green




