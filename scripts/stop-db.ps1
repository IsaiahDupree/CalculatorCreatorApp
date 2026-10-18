# PowerShell script to stop simple Postgres database

Write-Host "🛑 Stopping database..." -ForegroundColor Yellow

# Stop container
docker stop calc-creator-db 2>&1 | Out-Null

# Remove container (optional - comment out if you want to keep data)
# docker rm calc-creator-db 2>&1 | Out-Null

Write-Host "✅ Database stopped!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 To remove container and data, run:" -ForegroundColor Cyan
Write-Host "   docker rm calc-creator-db" -ForegroundColor White
Write-Host "   docker volume rm calculatorcreatorapp_postgres-data" -ForegroundColor White
