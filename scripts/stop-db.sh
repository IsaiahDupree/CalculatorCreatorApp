#!/bin/bash
# Stop simple Postgres database

echo "🛑 Stopping database..."

# Stop container
docker stop calc-creator-db 2>/dev/null

# Remove container (optional - comment out if you want to keep data)
# docker rm calc-creator-db 2>/dev/null

echo "✅ Database stopped!"
echo ""
echo "💡 To remove container and data, run:"
echo "   docker rm calc-creator-db"
echo "   docker volume rm calculatorcreatorapp_postgres-data"
