#!/bin/bash
# Setup database script

echo "🗄️  Setting up database..."

# Navigate to API directory
cd "$(dirname "$0")/../services/api"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-key-min-32-characters-long-change-in-production"
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm db:generate || {
    echo "❌ Failed to generate Prisma client"
    echo "Make sure pnpm is installed: npm install -g pnpm"
    exit 1
}

# Push schema to database
echo "📤 Pushing schema to database..."
pnpm db:push || {
    echo "❌ Failed to push schema"
    echo "Make sure database is running: ./scripts/start-db.sh"
    exit 1
}

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. (Optional) Seed database: pnpm db:seed"
echo "  2. Start API: pnpm dev"
echo "  3. Open Prisma Studio: pnpm db:studio"




