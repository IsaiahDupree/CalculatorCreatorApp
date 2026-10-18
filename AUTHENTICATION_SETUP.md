# Authentication Setup Guide

## ✅ What's Been Implemented

### Backend
- ✅ Supabase Auth integration
- ✅ NextAuth configuration with Supabase
- ✅ Signup endpoint (`/api/auth/signup`)
- ✅ Login endpoint (`/api/auth/login`)
- ✅ User profile endpoint (`/api/users/me`)
- ✅ Session management

### Mobile App
- ✅ Sign in screen
- ✅ Sign up screen
- ✅ Auth navigation
- ✅ User profile display
- ✅ Sign out functionality
- ✅ Session persistence with AsyncStorage

## 🔧 Setup Instructions

### 1. Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Enable **Email** provider
4. Configure email templates (optional)
5. Set up email confirmation (optional for development)

### 2. Environment Variables

#### Backend (`services/api/.env`)
```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_KEY="your_service_role_key"
SUPABASE_ANON_KEY="your_anon_key"
```

#### Mobile App (`apps/mobile/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
EXPO_PUBLIC_API_URL="http://localhost:3001"
```

**Important**: 
- Service key is for backend only (never expose to client)
- Anon key is safe for client-side use
- Get these from Supabase project settings → API

### 3. Install Dependencies

```bash
# Backend
cd services/api
pnpm install

# Mobile app
cd apps/mobile
pnpm install
```

### 4. Test Authentication

#### Sign Up Flow
1. Open mobile app
2. Navigate to Sign Up screen
3. Enter email, password, username (optional), name (optional)
4. Submit form
5. User is created and automatically signed in

#### Sign In Flow
1. Open mobile app
2. Navigate to Sign In screen
3. Enter email and password
4. Submit form
5. User is signed in and redirected to tabs

#### Profile
1. Go to Profile tab
2. See user information
3. Sign out button available

## 🔐 Security Notes

1. **Password Requirements**: Minimum 6 characters (configurable in Supabase)
2. **Email Verification**: Currently auto-confirmed for development
3. **Session Storage**: Uses AsyncStorage (secure on device)
4. **API Protection**: Use middleware to protect routes

## 📝 API Endpoints

### POST `/api/auth/signup`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "optional",
  "name": "Optional Name"
}
```

### POST `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET `/api/users/me`
Requires authentication (Bearer token)

## 🚀 Next Steps

1. **Email Verification**: Enable email confirmation in Supabase
2. **Password Reset**: Add forgot password flow
3. **Social Auth**: Add Google/GitHub providers
4. **Protected Routes**: Add auth guards to mobile app
5. **Token Refresh**: Implement automatic token refresh

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` files exist
- Verify variable names match exactly
- Restart dev server after adding env vars

### "User not found in database"
- User was created in Supabase Auth but not in Prisma
- Signup endpoint should handle this automatically
- Check Prisma connection

### "Invalid email or password"
- Verify user exists in Supabase Auth
- Check password is correct
- Verify Supabase Auth is enabled

### Session not persisting
- Check AsyncStorage is installed
- Verify Supabase client configuration
- Check for storage permissions (Android)

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Expo AsyncStorage](https://docs.expo.dev/versions/latest/sdk/async-storage/)

---

**Status**: Authentication system ready! Users can sign up, sign in, and manage their profiles. 🎉




