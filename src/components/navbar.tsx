"use client";
import React from "react";
import SearchBar from "./searchBar";
import { CameraIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="relative mx-2 my-2 flex flex-row items-center justify-between px-2">
      <Link href="/">
        <div className="flex flex-row items-center">
          <CameraIcon />
          <h1 className="px-2 text-2xl font-semibold">Movies</h1>
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
  );
};
