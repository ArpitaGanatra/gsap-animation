import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

interface TwitterProfile {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  image?: string;
}

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.NEXT_TWITTER_CLIENT_ID!,
      clientSecret: process.env.NEXT_TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      console.log("NextAuth session callback:", { session, token });
      // Add Twitter username and profile image to session
      if (token) {
        session.user = {
          ...session.user,
          name: token.username as string,
          image: token.picture as string,
        };
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      console.log("NextAuth JWT callback:", { token, account, profile });
      if (account && profile) {
        const twitterProfile = profile as TwitterProfile;
        token.username = twitterProfile.username || twitterProfile.name;
        token.picture =
          twitterProfile.profile_image_url || twitterProfile.image;
      }
      return token;
    },
  },
  pages: {
    signIn: "/rsdnts",
    error: "/rsdnts",
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
