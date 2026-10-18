#!/bin/bash
# Robust database restart script
# Kills existing container and starts fresh

echo "🔄 Restarting database..."

# Step 1: Stop and remove existing container
echo "1️⃣  Stopping existing container..."
if docker ps -a --filter "name=calc-creator-db" --format "{{.Names}}" | grep -q calc-creator-db; then
    echo "Found existing container, stopping..."
    docker stop calc-creator-db 2>/dev/null
    docker rm calc-creator-db 2>/dev/null
    echo "✅ Container stopped and removed"
else
    echo "✅ No existing container found"
fi
echo ""

# Step 2: Check port availability
echo "2️⃣  Checking port 54321..."
if lsof -Pi :54321 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 54321 is in use"
    echo "Killing process using port 54321..."
    lsof -ti:54321 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Port freed"
else
    echo "✅ Port 54321 is available"
fi
echo ""

# Step 3: Start fresh container
echo "3️⃣  Starting database container..."
docker-compose -f docker-compose.simple.yml up -d

# Step 4: Wait for health check
echo "4️⃣  Waiting for database to be ready..."
max_attempts=30
attempt=0
ready=false

while [ $attempt -lt $max_attempts ] && [ "$ready" = false ]; do
    sleep 1
    health=$(docker inspect calc-creator-db --format '{{.State.Health.Status}}' 2>/dev/null)
    pg_ready=$(docker exec calc-creator-db pg_isready -U postgres 2>/dev/null)
    
    if [ "$health" = "healthy" ] || echo "$pg_ready" | grep -q "accepting connections"; then
        ready=true
    fi
    attempt=$((attempt + 1))
    echo -n "."
done

echo ""
if [ "$ready" = true ]; then
    echo "✅ Database is ready!"
else
    echo "⚠️  Database may still be starting..."
fi
echo ""

# Step 5: Display status
echo "📊 Final Status:"
docker ps --filter "name=calc-creator-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "📍 Connection String:"
echo "  postgresql://postgres:postgres@127.0.0.1:54321/postgres"
echo ""

echo "✅ Database restart complete!"




