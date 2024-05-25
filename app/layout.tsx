import Navbar from "@/components/Navbar";
import Auth from "@/components/auth/Auth";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import ConfigureAmplifyClientSide from "./ConfigureAmplifyClientSide";
import { ImageProvider } from "./ImageContext";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tryoutfit.app/"),
  title: "Tryoutfit",
  description: "Tryoutfit is a platform to try out outfits virtually.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ConfigureAmplifyClientSide />
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <NextTopLoader showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Auth>
            <ImageProvider>
              <Navbar />
              <main>{children}</main>
              <Toaster />
            </ImageProvider>
          </Auth>
        </ThemeProvider>
      </body>
    </html>
  );
}
