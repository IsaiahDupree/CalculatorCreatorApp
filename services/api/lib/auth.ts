import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './db';
import { supabaseAdmin } from './supabase';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Authenticate with Supabase (if configured)
          if (!supabaseAdmin) {
            // For local development without Supabase, just check if user exists in DB
            const user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });
            if (!user) {
              return null;
            }
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.avatar,
            };
          }

          const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            return null;
          }

          // Get or create user in our database
          let user = await prisma.user.findUnique({
            where: { email: data.user.email! },
          });

          if (!user) {
            // Create user if doesn't exist
            user = await prisma.user.create({
              data: {
                email: data.user.email!,
                username: data.user.email!.split('@')[0],
                name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
                avatar: data.user.user_metadata?.avatar_url,
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

