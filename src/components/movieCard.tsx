import React from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const MovieCardSkeleton = () => {
  return (
    <Card className="inline-block rounded-lg border-none bg-transparent shadow-none">
      <CardContent className="p-1">
        <Skeleton className="aspect-[2/3] h-auto w-full rounded-lg" />
      </CardContent>
      <CardHeader className="px-1 py-2">
        <Skeleton className="h-5 w-full" />
      </CardHeader>
      <CardFooter className="px-1 py-0">
        <Skeleton className="h-4 w-1/2" />
      </CardFooter>
    </Card>
  );
};

export const MovieCard = ({
  name,
  release,
  poster_url,
}: {
  name: string;
  release: string;
  poster_url: string | null;
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="h-full w-full"
    >
      <Card className="h-full w-full rounded-lg border-none bg-transparent shadow-none">
        <CardContent className="p-1">
          {poster_url ? (
            <div className="overflow-hidden rounded-lg shadow-sm">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  className="aspect-[2/3] h-auto w-full rounded-lg object-cover"
                  src={poster_url}
                  alt={name}
                  width={200}
                  height={300}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
              </motion.div>
            </div>
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center rounded-lg bg-gray-800">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </CardContent>
        <CardHeader className="p-2 pt-3">
          <CardTitle className="line-clamp-2 text-sm font-medium md:text-base">
            {name}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-0 px-2 pb-2">
          <p className="text-xs text-gray-500 md:text-sm">{release}</p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
