
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1, "Razorpay Key ID is required"),
  RAZORPAY_KEY_SECRET: z.string().min(1, "Razorpay Key Secret is required"),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1, "Razorpay Webhook Secret is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
  NEXTAUTH_URL: z.string().url("NextAuth URL must be a valid URL"),
  NEXTAUTH_SECRET: z.string().min(1, "NextAuth Secret is required"),
  MONGODB_URL: z.string().min(1, "MongoDB URL is required"),
});

export const env = envSchema.parse(process.env);
