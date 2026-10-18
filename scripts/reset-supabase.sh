#!/bin/bash

# Reset local Supabase instance (removes all data)
echo "⚠️  Resetting local Supabase instance..."
echo "This will remove all data. Are you sure? (y/N)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🗑️  Removing volumes and containers..."
    docker-compose down -v
    echo "✅ Supabase reset complete!"
    echo "Run ./scripts/start-supabase.sh to start fresh"
else
    echo "❌ Reset cancelled"
fi




