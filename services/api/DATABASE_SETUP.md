# Database Setup Guide

## Prerequisites

1. Supabase account (https://supabase.com)
2. Supabase project created
3. Database connection string

## Step 1: Configure Environment

Copy `.env.example` to `.env` and fill in your database URL:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

You can find this in your Supabase project settings under "Database" → "Connection string" → "URI".

## Step 2: Install Dependencies

```bash
cd services/api
pnpm install
```

## Step 3: Generate Prisma Client

```bash
npx prisma generate
```

This creates the Prisma Client based on your schema.

## Step 4: Push Schema to Database

```bash
npx prisma db push
```

This will create all tables in your Supabase database.

**Note**: For production, use migrations instead:
```bash
npx prisma migrate dev --name init
```

## Step 5: Seed Database (Optional)

Populate the database with example calculators:

```bash
npx tsx scripts/seed.ts
```

This creates:
- A test user (test@example.com)
- Ohm's Law calculator
- Kinetic Energy calculator
- Example data for both

## Step 6: Verify Setup

Check that tables were created:

```bash
npx prisma studio
```

This opens Prisma Studio in your browser where you can view and edit data.

## Database Schema Overview

### Core Tables

- **User** - User accounts, subscriptions, gamification
- **Calculator** - Calculator definitions with specs
- **CalculatorVersion** - Version history
- **CalculatorRun** - Usage analytics
- **Idea** - User-submitted calculator ideas
- **Feedback** - Ratings and comments
- **Earnings** - Revenue share tracking
- **TutoringSession** - AI tutoring sessions

### Indexes

The schema includes indexes for:
- Fast lookups by ID, slug, status
- Full-text search on title/summary
- Trending score sorting
- User-specific queries

## Common Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push

# Create migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Troubleshooting

### Connection Error
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure IP is whitelisted (if using IP restrictions)

### Migration Issues
- Use `db push` for development
- Use `migrate` for production
- Check Prisma version compatibility

### Type Errors
- Run `npx prisma generate` after schema changes
- Restart TypeScript server in your IDE

## Next Steps

1. Set up authentication (NextAuth + Supabase Auth)
2. Configure Row Level Security (RLS) in Supabase
3. Set up database backups
4. Configure connection pooling for production




