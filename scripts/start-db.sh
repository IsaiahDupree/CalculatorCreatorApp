#!/bin/bash
# Start simple Postgres database

echo "🚀 Starting local database..."

# Check if container already exists and is running
if docker ps --filter "name=calc-creator-db" --format "{{.Names}}" | grep -q calc-creator-db; then
    echo "✅ Database is already running"
    docker ps --filter "name=calc-creator-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    exit 0
fi

# Check if container exists but is stopped
if docker ps -a --filter "name=calc-creator-db" --format "{{.Names}}" | grep -q calc-creator-db; then
    echo "Starting existing container..."
    docker start calc-creator-db
    sleep 3
else
    # Start new container
    docker-compose -f docker-compose.simple.yml up -d
    echo "⏳ Waiting for database to be ready..."
    sleep 5
fi

# Check service health
echo "📊 Checking service status..."
docker ps --filter "name=calc-creator-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "✅ Database is running!"
echo ""
echo "📍 Connection:"
echo "  postgresql://postgres:postgres@127.0.0.1:54321/postgres"
echo ""
echo "🔧 Update your .env:"
echo "  DATABASE_URL=\"postgresql://postgres:postgres@127.0.0.1:54321/postgres\""
