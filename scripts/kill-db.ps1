# Force kill database container and free port

Write-Host "💀 Force killing database..." -ForegroundColor Red
Write-Host ""

# Stop and remove container
Write-Host "Stopping container..." -ForegroundColor Yellow
docker stop calc-creator-db 2>&1 | Out-Null
docker rm -f calc-creator-db 2>&1 | Out-Null

# Remove any orphaned containers
docker ps -a --filter "name=calc-creator-db" --format "{{.ID}}" | ForEach-Object {
    if ($_) {
        docker rm -f $_ 2>&1 | Out-Null
    }
}

# Kill process on port 54321
Write-Host "Freeing port 54321..." -ForegroundColor Yellow
$connections = Get-NetTCPConnection -LocalPort 54321 -ErrorAction SilentlyContinue
if ($connections) {
    $connections | ForEach-Object {
        $pid = $_.OwningProcess
        if ($pid) {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "Killed process $pid on port 54321" -ForegroundColor Yellow
        }
    }
}

Write-Host "✅ Database killed and port freed" -ForegroundColor Green




