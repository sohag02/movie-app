"use client";
import { useState, useEffect } from "react";
import { useWatchlist } from "@/components/WatchlistProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { ListFilter, X } from "lucide-react";

import { MediaType } from "@/lib/interfaces";


export const Filters = () => {
  const { setMediaTypeFilter } = useWatchlist();

  const [position, setPosition] = useState<MediaType | "all">("all");

	useEffect(() => {
		if (position === "all") {
			setMediaTypeFilter(null);
		} else {
			setMediaTypeFilter(position);
		}
	}, [position, setMediaTypeFilter]);

	if (position !=="all") {
		return (
			<div className="mx-2 md:w-auto md:h-auto">
				<Badge>
						<X className="h-6 w-6 rounded-full p-1 bg-black" stroke="white" strokeWidth={3} fill="white" onClick={() => setPosition("all")} /> 
					<span className="ml-2 text-lg font-normal">
						{position === MediaType.Movie ? "Movies" : "TV Series"}
					</span>
				</Badge>
			</div>
		)
	}
 
  return (
    <div className="mx-2 md:w-auto md:h-auto"> {/* Adjusted classes to remove full width and height */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline"> 
            <ListFilter className="h-5 w-5" /> Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup value={position} onValueChange={(value: string) => setPosition(value as MediaType | "all")}>
            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={MediaType.Movie}>Movie</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={MediaType.TV}>TV</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
