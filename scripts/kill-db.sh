#!/bin/bash
# Force kill database container and free port

echo "💀 Force killing database..."

# Stop and remove container
echo "Stopping container..."
docker stop calc-creator-db 2>/dev/null
docker rm -f calc-creator-db 2>/dev/null

# Remove any orphaned containers
docker ps -a --filter "name=calc-creator-db" --format "{{.ID}}" | while read id; do
    if [ -n "$id" ]; then
        docker rm -f "$id" 2>/dev/null
    fi
done

# Kill process on port 54321
echo "Freeing port 54321..."
if lsof -Pi :54321 -sTCP:LISTEN -t >/dev/null 2>&1; then
    lsof -ti:54321 | xargs kill -9 2>/dev/null
    echo "Killed process on port 54321"
fi

echo "✅ Database killed and port freed"




