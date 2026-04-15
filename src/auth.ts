import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    role?: string;
    emailVerified?: Date | null;
  }
}

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) return null;

        // We allow login without verification, but track it in the session

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (isPasswordCorrect) {
          return user;
        }
        return null;
      },
    }),
  ],
  events: {
    async signIn({ user, account }) {
      // If the user signed in via Google, mark their email as verified automatically
      if (account?.provider === "google" && user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        });
      }
    }
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as any;
      }
      if (token.emailVerified && session.user) {
        (session.user as any).emailVerified = token.emailVerified;
      }
      
      // Safety: Never allow massive images in the session object to prevent RSC serialization crashes
      if (session.user.image && session.user.image.length > 300000) {
        session.user.image = null;
      }
      
      return session;
    },
    async jwt({ token, user, account }) {
      // On initial login, add the role and verification status to the token
      if (user) {
        token.role = user.role;
        // If they use Google/OAuth, they are verified by default
        token.emailVerified = (account?.type === "oauth") ? new Date() : user.emailVerified;
      }

      // ⚠️ CRITICAL: Scrub the image data out of the token to prevent 431 errors
      // Profile pictures are loaded directly from the DB on the Profile page instead.
      if (token.picture) delete token.picture;
      
      if (!token.sub) return token;
      
      // Fetch latest role and name, but avoid fetching the large image blob
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { role: true, name: true, emailVerified: true } 
      });
      
      if (dbUser) {
        token.role = dbUser.role;
        token.name = dbUser.name;
        token.emailVerified = dbUser.emailVerified;
      }
      return token;
    }
  }
});
