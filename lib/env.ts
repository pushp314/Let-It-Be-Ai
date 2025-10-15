 
// The 'dotenv' package is not needed in Next.js as it handles .env files automatically.
// This file was causing a client-side crash because 'dotenv' was being bundled for the browser.

export const env = {
  // Public variables are prefixed with NEXT_PUBLIC_ and are available on the client.
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,

  // Server-side variables. These will be 'undefined' on the client.
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  MONGODB_URL: process.env.MONGODB_URL!,
  // Ensure you have a MONGODB_URL in your .env.local file
};
