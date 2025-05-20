"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <motion.button
      className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-lg backdrop-blur-sm"
      onClick={goBack}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <ArrowLeft className="h-5 w-5" />
    </motion.button>
  );
};
