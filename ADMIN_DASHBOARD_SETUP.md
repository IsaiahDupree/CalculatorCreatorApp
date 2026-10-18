# Admin Dashboard Setup Guide

## ✅ What's Implemented

### Admin Dashboard (Subdomain)
- ✅ **Next.js Admin App** - Separate admin application
- ✅ **Dashboard Overview** - Platform statistics
- ✅ **Analytics Charts** - User growth, revenue, calculator status
- ✅ **Admin API Endpoints** - Protected admin routes
- ✅ **Responsive Design** - Works on all devices

### Features
- Total users, calculators, runs
- Revenue tracking
- Subscription analytics
- User growth charts
- Calculator status distribution
- Recent activity feed

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd apps/admin
pnpm install
```

### 2. Configure Environment

Create `apps/admin/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_URL="http://admin.localhost:3002"
NEXTAUTH_SECRET="your_secret"
```

### 3. Set Admin Users

In `services/api/.env`:

```env
ADMIN_USER_IDS="user_id_1,user_id_2"
```

### 4. Run Admin Dashboard

```bash
cd apps/admin
pnpm dev
# Runs on http://localhost:3002
```

## 🌐 Subdomain Deployment

### Vercel Deployment

1. **Create New Project**:
   - Go to Vercel dashboard
   - Import `apps/admin` directory
   - Set as separate project

2. **Configure Domain**:
   - Add custom domain: `admin.yourdomain.com`
   - Vercel will automatically configure DNS

3. **Environment Variables**:
   - Set all required env vars in Vercel dashboard
   - `NEXT_PUBLIC_API_URL` should point to main API

### Alternative: Subdirectory

If you prefer subdirectory instead of subdomain:

```js
// next.config.js
const nextConfig = {
  basePath: '/admin',
  assetPrefix: '/admin',
};
```

Then access at: `https://yourdomain.com/admin`

## 📊 Admin API Endpoints

### Get Platform Stats

```bash
GET /api/admin/stats?days=30
Authorization: Bearer <admin_token>
```

Response includes:
- Total users, calculators, runs
- Active subscriptions
- Revenue data
- User growth
- Calculator status distribution

## 🔐 Security

1. **Admin Check**: Only users in `ADMIN_USER_IDS` can access
2. **Authentication**: Requires valid session
3. **API Protection**: All admin endpoints check admin status
4. **CORS**: Configure allowed origins

## 📱 Features

### Dashboard Overview
- Real-time statistics
- Key metrics at a glance
- Quick actions

### Analytics
- User growth charts
- Revenue trends
- Calculator status pie chart
- Activity timeline

### Management (Future)
- User management
- Calculator moderation
- Revenue share payouts
- System settings

## 🚀 Next Steps

1. **Add More Charts**:
   - Revenue by tier
   - Calculator categories
   - Geographic distribution

2. **User Management**:
   - View/edit users
   - Ban/suspend accounts
   - Manage subscriptions

3. **Content Moderation**:
   - Review pending calculators
   - Approve/reject submissions
   - Flag inappropriate content

4. **Financial Tools**:
   - Revenue share payouts
   - Payment history
   - Refund management

## 📚 Files Structure

```
apps/admin/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Dashboard home
│   └── globals.css     # Global styles
├── next.config.js      # Next.js config
└── package.json        # Dependencies
```

---

**Status**: Admin dashboard ready! Deploy to subdomain for full admin access. 🎯




