import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

interface TwitterProfile {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  image?: string;
}

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
    async jwt({ token, account, profile }) {
      console.log("NextAuth JWT callback BEFORE:", token);

      if (account && profile) {
        const twitterProfile = profile as TwitterProfile;

        // Robust spread to ensure token retains fields on refresh
        token = {
          ...token,
          username: twitterProfile.username || twitterProfile.name,
          picture: twitterProfile.profile_image_url || twitterProfile.image,
        };
      }

      console.log("NextAuth JWT callback AFTER:", token);
      return token;
    },

    async session({ session, token }) {
      console.log("NextAuth session callback:", { session, token });

      // Map token fields to session user consistently
      session.user = {
        ...session.user,
        name: token.username as string,
        image: token.picture as string,
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
