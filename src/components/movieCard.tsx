import React from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const MovieCardSkeleton = () => {
  return (
    <Card className="inline-block border-none">
      <CardContent className="p-1">
        <Skeleton className="rounded-sm w-28 h-44" />
      </CardContent>
      <CardHeader className="px-1 py-0">
        <Skeleton className="h-6 w-full mb-2" />
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
    <Card className="inline-block border-none">
      <CardContent className="p-1">
        {poster_url ? (
          <Image
            className="rounded-sm"
            src={poster_url}
            alt={name}
            width={200}
            height={300}
            // layout="responsive" // Make sure Image component is responsive
          />
        ) : (
          <div className="bg-gray-400 flex items-center justify-center">
            <ImageIcon
              className="rounded-sm"
            />
          </div>
        )}
      </CardContent>
      <CardHeader className="p-0">
        <CardTitle className="truncate-multiline-2 font-medium text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>">
          {name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="p-0">
        <p className="text-gray-500">{release}</p>
      </CardFooter>
    </Card>
  );
};
