import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.NEXT_TWITTER_CLIENT_ID!,
      clientSecret: process.env.NEXT_TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("NextAuth session callback:", { session, token });
      // Add Twitter username and profile image to session
      if (token) {
        session.user!.name = token.username as string;
        session.user!.image = token.picture as string;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      console.log("NextAuth JWT callback:", { token, account, profile });
      if (account && profile) {
        token.username = profile.name;
        token.picture = profile.image;
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
