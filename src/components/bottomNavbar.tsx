// components/MobileNavbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Clapperboard, Home, Search, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const MobileNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState("");

  const hideNavbar = ["/sign-in", "/sign-up"].includes(pathname);

  useEffect(() => {
    setActiveButton(pathname);
  }, [pathname]);

  const handleButtonClick = (path: string) => {
    setActiveButton(path);
    router.push(path);
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Search, label: "Explore" },
    { path: "/watchlist", icon: Bookmark, label: "Watchlist" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  if (hideNavbar) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-gray-800 bg-black/90 backdrop-blur-lg md:hidden">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path === "/" && pathname === "/") ||
            (pathname.startsWith(item.path) && item.path !== "/");

          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleButtonClick(item.path)}
              className="flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`flex flex-col items-center justify-center ${isActive ? "text-primary" : "text-gray-400"}`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-primary" : "text-gray-400"}`}
                />
                <span
                  className={`mt-1 text-xs ${isActive ? "font-medium" : "font-normal"}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 h-1 w-10 rounded-full bg-primary"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar;
