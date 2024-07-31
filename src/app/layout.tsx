import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import { WatchlistProvider } from "@/components/WatchlistProvider";

import { Navbar } from "@/components/navbar";
import BottomNavbar from "@/components/bottomNavbar";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie Watchlist",
  description: "A movie watchlist app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <WatchlistProvider>
          <body className="dark">
            <Navbar />
            {children}
          <BottomNavbar />
          </body>
        </WatchlistProvider>
      </html>
    </ClerkProvider>
  );
}
