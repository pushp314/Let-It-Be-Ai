
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./lib/database/mongoose";
import User from "./lib/database/models/user.model";
import { env } from "./lib/env";

export const authOptions = {
    secret: env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: { 
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user }: { user: any }) {
            await connectToDatabase();

            const existingUser = await User.findOne({ email: user.email });

            if (!existingUser) {
                await User.create({
                    googleId: user.id,
                    email: user.email,
                    username: user.name,
                    photo: user.image,
                });
            }

            return true;
        },
        async session({ session }: { session: any }) {
            const user = await User.findOne({ email: session.user.email });

            session.user.id = user.googleId;
            session.user.role = user.role;
            session.user.creditBalance = user.creditBalance;

            return session;
        },
    },
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions);
