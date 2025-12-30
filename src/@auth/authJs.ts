import NextAuth from "next-auth";
import { User } from "@auth/user";
import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import vercelKVDriver from "unstorage/drivers/vercel-kv";
import { UnstorageAdapter } from "@auth/unstorage-adapter";
import type { JWT, NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { authGetDbUserByEmail, authCreateDbUser } from "./authApi";

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
});

export const providers: Provider[] = [
  Credentials({
    async authorize(formInput) {
      if (!formInput) return null;

      /** SIGN IN */
      if (formInput.formType === "signin") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: formInput.email,
                password: formInput.password,
              }),
            }
          );

          if (!res.ok) {
            const message = await res.text();
            console.error("LOGIN FAILED", message);
            throw new Error(
              JSON.stringify({
                code: "LOGIN_FAILED",
                message,
              })
            );
          }

          const user = await res.json();

          if (!user?.user._id) return null;

          return {
            id: user.user._id,
            email: user.user.email,
            name: user.user.fullName,
            accessToken: user.token,
            role: user.user.role,
          };
        } catch (error) {
          console.error("LOGIN ERROR", error);
          return null;
        }
      }

      return null;
    },
  }),

  Google,
  Facebook,
];

const config = {
  theme: { logo: "/assets/images/logo/logo.svg" },
  pages: {
    signIn: "/sign-in",
  },
  providers,
  basePath: "/auth",
  trustHost: true,
  callbacks: {
    authorized() {
      /** Checkout information to how to use middleware for authorization
       * https://next-auth.js.org/configuration/nextjs#middleware
       */
      return true;
    },
    jwt({ token, trigger, account, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
        token.role = (user as any).role;
      }

      if (trigger === "update") {
        token.name = user.name;
      }

      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }

      return token;
    },
    async session({ session, token }) {
      if (token.accessToken && typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig;

export type AuthJsProvider = {
  id: string;
  name: string;
  style?: {
    text?: string;
    bg?: string;
  };
};

export const authJsProviderMap: AuthJsProvider[] = providers
  .map((provider) => {
    const providerData = typeof provider === "function" ? provider() : provider;

    return {
      id: providerData.id,
      name: providerData.name,
      style: {
        text: (providerData as { style?: { text: string } }).style?.text,
        bg: (providerData as { style?: { bg: string } }).style?.bg,
      },
    };
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, auth, signIn, signOut } = NextAuth(config);
