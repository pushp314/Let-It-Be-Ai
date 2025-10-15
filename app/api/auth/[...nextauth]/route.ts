import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/lib/database/models/user.model";
import { env } from "@/lib/env";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDatabase();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectToDatabase();
          let user = await User.findOne({ email: profile.email });
          if (!user) {
            await User.create({
              email: profile.email,
              username: profile.name?.replace(" ", "").toLowerCase(),
              googleId: profile.sub,
              photo: profile.picture,
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return false; // Only allow google sign in
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }