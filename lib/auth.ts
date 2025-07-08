import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.NEXT_TWITTER_CLIENT_ID!,
      clientSecret: process.env.NEXT_TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  session: {
    strategy: "jwt", // Ensure this is declared explicitly
  },
  callbacks: {
    async session({ session, token }) {
      console.log("NextAuth session callback:", { session, token });

      // Map token fields to session user consistently
      session.user = {
        ...session.user,
        name: session.user?.name,
        image: session.user?.image,
      };

      console.log("NextAuth session returned:", session);
      return session;
    },
  },
  pages: {
    signIn: "/rsdnts",
    error: "/rsdnts",
  },
  debug: process.env.NODE_ENV === "development",
};
