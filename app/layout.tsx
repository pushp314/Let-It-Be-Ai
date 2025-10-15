import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils"; 
import "./globals.css";
import Providers from "./Providers";

const IBMPlex = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight:['400', '500', '600', '700'],
  variable:'--font-ibm-plex'
 });

export const metadata: Metadata = {
  title: "Developers Dynasty",
  description: "AI Powered Image Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
          <Providers>{children}</Providers>
        </body>
      </html>
  );
}
