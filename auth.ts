
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/lib/env";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: { 
        strategy: "jwt",
    },
};

export const { auth, signIn, signOut } = NextAuth(authOptions);
