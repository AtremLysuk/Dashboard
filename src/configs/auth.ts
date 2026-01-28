// configs/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");
        if (!user.passwordHash) throw new Error("Password not set");

        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!passwordMatch) throw new Error("Invalid password");

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt", // JWT стратегія працює краще з Google OAuth
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "ADMIN";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Если это callback после OAuth
      if (url.includes("/api/auth/callback")) {
        return `${baseUrl}/dashboard`;
      }

      // Если URL относительный
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Если URL с того же домена
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // По умолчанию - dashboard
      return `${baseUrl}/dashboard`;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true },
          });

          if (!existingUser) {
            // Створюємо нового користувача
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || profile?.name || user.email!.split("@")[0],
                role: "ADMIN",
                emailVerified: new Date(),
              },
            });

            // Створюємо account для Google
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type!,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });

            console.log("✅ New user created:", newUser.id);
          } else {
            // Перевіряємо чи існує account для цього провайдера
            const existingAccount = existingUser.accounts.find(
              (acc) =>
                acc.provider === account.provider &&
                acc.providerAccountId === account.providerAccountId,
            );

            if (!existingAccount) {
              // Створюємо account якщо його немає
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type!,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });
              console.log("✅ Account linked to existing user:", existingUser.id);
            } else {
              console.log("✅ Existing user with account found:", existingUser.id);
            }
          }

          return true;
        } catch (error) {
          console.error("❌ Error in Google signIn callback:", error);
          return false;
        }
      }

      return true;
    },
  },

  pages: {
    signIn: "/signin",
    signOut: "/signin",
    error: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
};
