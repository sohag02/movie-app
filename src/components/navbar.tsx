"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "./searchBar";
import { CameraIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  const pathname = usePathname();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Paths where navbar should be hidden
  const hideNavbar =
    ["/sign-up", "/settings", "/settings/security"].includes(pathname) ||
    pathname.startsWith("/movie/") ||
    pathname.startsWith("/tv/");

  // Hide navbar on scroll down for mobile devices
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        const isScrollingDown = prevScrollPos < currentScrollPos;

        // Only hide when scrolling down and past a threshold of 50px
        if (isScrollingDown && currentScrollPos > 50) {
          setVisible(false);
        } else {
          setVisible(true);
        }

        setPrevScrollPos(currentScrollPos);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [prevScrollPos]);

  if (hideNavbar) {
    return null;
  }

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-background/95 shadow-md backdrop-blur-sm"
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -80 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-2 my-2 flex flex-row items-center justify-between px-2">
        <Link href="/">
          <div className="flex flex-row items-center">
            <CameraIcon />
            <h1 className="px-2 text-2xl font-semibold">Watch Buddy</h1>
          </div>
        </Link>
        <div className="flex flex-row items-center justify-between">
          <SearchBar />

          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </motion.nav>
  );
};
