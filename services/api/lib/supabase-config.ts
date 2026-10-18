// Supabase OAuth configuration
// Configure these in Supabase Dashboard → Authentication → URL Configuration

export const SUPABASE_OAUTH_REDIRECT_URL = process.env.SUPABASE_OAUTH_REDIRECT_URL || 
  `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/auth/callback`;

// OAuth providers configuration
export const OAUTH_PROVIDERS = {
  google: {
    enabled: true,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  github: {
    enabled: true,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
};




