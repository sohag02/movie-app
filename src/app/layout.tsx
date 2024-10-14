import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes'

import { WatchlistProvider } from "@/components/WatchlistProvider";

import NextTopLoader from 'nextjs-toploader';
import Head from "next/head";

import { Navbar } from "@/components/navbar";
import BottomNavbar from "@/components/bottomNavbar";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Buddy",
  description: "A movie watchlist app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        baseTheme: dark,
      }}
    >
      <html lang="en" className={`${GeistSans.variable}`}>
        <WatchlistProvider>
          <Head>
            <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <meta name="apple-mobile-web-app-title" content="Watch Buddy" />
            <link rel="manifest" href="/manifest.json" />
          </Head>
          <body className="dark mb-24 md:mb-0 pb-20 md:pb-0">
            <NextTopLoader 
              showSpinner={false} 
            />
            <Navbar />
            {children}
          <BottomNavbar />
          </body>
        </WatchlistProvider>
      </html>
    </ClerkProvider>
  );
}
