#!/bin/bash

# Start local Supabase instance
echo "🚀 Starting local Supabase instance..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start services
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "📊 Checking service status..."
docker-compose ps

echo ""
echo "✅ Supabase is running!"
echo ""
echo "📍 Services:"
echo "  - API URL: http://127.0.0.1:8000"
echo "  - Studio: http://127.0.0.1:54323"
echo "  - Database: postgresql://postgres:your-super-secret-jwt-token-with-at-least-32-characters-long@127.0.0.1:54322/postgres"
echo ""
echo "🔑 API Keys:"
echo "  - Anon Key: ${SUPABASE_TOKEN}"
echo "  - Service Role Key: ${SUPABASE_TOKEN}"
echo ""
echo "📝 Update your .env files with these values!"




