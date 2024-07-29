import React from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const MovieCard = ({
  name,
  release,
  poster_url,
}: {
  name: string;
  release: string;
  poster_url: string;
}) => {
  return (
    <Card className="inline-block border-none">
      <CardContent className="p-1">
        <Image
          className="rounded-sm"
          src={poster_url}
          alt={name}
          width={200}
          height={300}
          // layout="responsive" // Make sure Image component is responsive
        />
      </CardContent>
      <CardHeader className="p-1">
        <CardTitle className="truncate-multiline-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>">
          {name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="p-1">
        <p className="text-gray-500">{release}</p>
      </CardFooter>
    </Card>
  );
};
