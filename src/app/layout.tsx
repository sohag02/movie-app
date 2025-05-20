import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { WatchlistProvider } from "@/components/WatchlistProvider";

import NextTopLoader from "nextjs-toploader";
import Head from "next/head";

import { Navbar } from "@/components/navbar";
import BottomNavbar from "@/components/bottomNavbar";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Script from "next/script";
import { ViewTransitions } from "next-view-transitions";
import type { Viewport } from 'next'
 
export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "Watch Buddy",
  description: "A movie watchlist app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
  appleWebApp: {
    title: "Watch Buddy",
    statusBarStyle: "black-translucent",
    capable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <ClerkProvider
        appearance={{
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          baseTheme: dark,
        }}
      >
        <html lang="en" className={`${GeistSans.variable}`}>
          <WatchlistProvider>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
              />
              <meta name="theme-color" content="#000000" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta
                name="apple-mobile-web-app-status-bar-style"
                content="black-translucent"
              />
              <link
                rel="icon"
                type="image/png"
                href="/favicon-48x48.png"
                sizes="48x48"
              />
              <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
              <link rel="shortcut icon" href="/favicon.ico" />
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
              />
              <meta name="apple-mobile-web-app-title" content="Watch Buddy" />
              <link rel="manifest" href="/manifest.json" />
            </Head>
            <body className="dark mb-24 flex min-h-screen flex-col overscroll-none bg-black pb-20 text-white antialiased md:mb-0 md:pb-0">
              <NextTopLoader
                showSpinner={false}
                color="#3b82f6"
                shadow="0 0 10px #3b82f6"
              />
              <Navbar />
              <main className="flex-1">{children}</main>
              <BottomNavbar />
            </body>
          </WatchlistProvider>
        </html>
      </ClerkProvider>
    </ViewTransitions>
  );
}
