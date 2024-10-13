import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes'

import { WatchlistProvider } from "@/components/WatchlistProvider";

import NextTopLoader from 'nextjs-toploader';

import { Navbar } from "@/components/navbar";
import BottomNavbar from "@/components/bottomNavbar";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Buddy",
  description: "A movie watchlist app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
          <body className="dark mb-24 md:mb-0 pb-20 md:pb-0">
            <NextTopLoader />
            <Navbar />
            {children}
          <BottomNavbar />
          </body>
        </WatchlistProvider>
      </html>
    </ClerkProvider>
  );
}
