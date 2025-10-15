import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/lib/database/models/user.model";
import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }: { session: any }) {
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
          
          // Type assertion for Google profile
          const googleProfile = profile as {
            email?: string;
            name?: string;
            sub?: string;
            picture?: string;
          };
          
          let user = await User.findOne({ email: googleProfile?.email });
          if (!user) {
            await User.create({
              email: googleProfile?.email,
              username: googleProfile?.name?.replace(" ", "").toLowerCase(),
              googleId: googleProfile?.sub,
              photo: googleProfile?.picture,
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