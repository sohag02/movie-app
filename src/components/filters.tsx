"use client";
import { useState, useEffect } from "react";
import { useWatchlist } from "@/components/WatchlistProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListFilter, Eye } from "lucide-react";
import { MediaType } from "@/lib/interfaces";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Filters = () => {
  const { setMediaTypeFilter, setWatchedFilter } =
    useWatchlist();
  const [position, setPosition] = useState<MediaType | "all">("all");
  const [watchedStatus, setWatchedStatus] = useState<
    "all" | "watched" | "unwatched"
  >("all");
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (position === "all") {
      setMediaTypeFilter(null);
    } else {
      setMediaTypeFilter(position);
    }
  }, [position, setMediaTypeFilter]);

  useEffect(() => {
    if (watchedStatus === "all") {
      setWatchedFilter(null);
    } else if (watchedStatus === "watched") {
      setWatchedFilter(true);
    } else {
      setWatchedFilter(false);
    }
  }, [watchedStatus, setWatchedFilter]);

  const renderFilterContent = () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h4 className="font-medium">Media Type</h4>
        <div className="flex flex-col gap-2">
          <Button
            variant={position === "all" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setPosition("all")}
          >
            All Types
          </Button>
          <Button
            variant={position === MediaType.Movie ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setPosition(MediaType.Movie)}
          >
            Movies
          </Button>
          <Button
            variant={position === MediaType.TV ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setPosition(MediaType.TV)}
          >
            TV Series
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-medium">Watch Status</h4>
        <div className="flex flex-col gap-2">
          <Button
            variant={watchedStatus === "all" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setWatchedStatus("all")}
          >
            All Status
          </Button>
          <Button
            variant={watchedStatus === "watched" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setWatchedStatus("watched")}
          >
            Watched
          </Button>
          <Button
            variant={watchedStatus === "unwatched" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setWatchedStatus("unwatched")}
          >
            Unwatched
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-2 flex flex-wrap items-center gap-2 md:h-auto md:w-auto">

      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <ListFilter className="h-4 w-4" />
              <span>Filters</span>
              {(position !== "all" || watchedStatus !== "all") && (
                <Badge variant="secondary" className="ml-1 h-5 px-1">
                  {(position !== "all" ? 1 : 0) +
                    (watchedStatus !== "all" ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            {renderFilterContent()}
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop Filters */
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                <span>Media Type</span>
                {position !== "all" && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {position === MediaType.Movie ? "Movies" : "TV"}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={(value: string) =>
                  setPosition(value as MediaType | "all")
                }
              >
                <DropdownMenuRadioItem value="all">
                  All Types
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={MediaType.Movie}>
                  Movies
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={MediaType.TV}>
                  TV Series
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>Watch Status</span>
                {watchedStatus !== "all" && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {watchedStatus === "watched" ? "Watched" : "Unwatched"}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuRadioGroup
                value={watchedStatus}
                onValueChange={(value: string) =>
                  setWatchedStatus(value as "all" | "watched" | "unwatched")
                }
              >
                <DropdownMenuRadioItem value="all">
                  All Status
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="watched">
                  Watched
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="unwatched">
                  Unwatched
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};
