import Navbar from "@/components/Navbar";
import Auth from "@/components/auth/Auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import ConfigureAmplifyClientSide from "./ConfigureAmplifyClientSide";
import { ImageProvider } from "./ImageContext";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
            </ImageProvider>
          </Auth>
        </ThemeProvider>
      </body>
    </html>
  );
}
