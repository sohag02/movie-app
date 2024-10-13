"use client";
import { type MediaDetails } from "@/lib/interfaces";
import { useState, useEffect } from "react";
import { type Episode } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeasonViewProps {
  media: MediaDetails; // Define the media prop type
}

const SeasonView: React.FC<SeasonViewProps> = ({ media }) => {
	const [season, setSeason] = useState<number>(1);
	const [episodes, setEpisodes] = useState<Episode[]>([]);
	const [loading, setLoading] = useState<boolean>(true); // New loading state

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true); // Set loading to true before fetching
			try {
				const res = await fetch('/api/season?id=' + media.id + '&season=' + season);
				const data: Episode[] = await res.json() as Episode[];
				setEpisodes(data);
				console.log(data);
			} catch (error) {
				console.error('Error fetching season data:', error);
			} finally {
				setLoading(false); // Set loading to false after fetching
			}
		};

		void fetchData();
	}, [season, media.id]);

	return (
		<div>
			{/* Seasons Selector */}
			<Select defaultValue={season.toString()} onValueChange={(value) => setSeason(parseInt(value))}>
				<SelectTrigger className="w-[180px] border-b-4 border-blue-500">
					<SelectValue placeholder="Select a season" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{media.seasons
							?.filter((season) => season.season_number !== 0)
							?.map((season, index) => (
								<SelectItem key={index} value={season.season_number.toString()}>
									<SelectLabel>{season.name}</SelectLabel>
								</SelectItem>
							))}
					</SelectGroup>
				</SelectContent>
			</Select>

			{/* Episodes */}
      <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2 md:grid-cols-4 md:overflow-x-auto">
        {loading ? (
          <>
            {/* {LoadingSkeleton(10)} */}
            {[...Array(10).keys()].map((_, i) => <EpisodeSkeleton key={i} />)}
          </>
        ) : (
          episodes.map((episode) => (
          <div key={episode.episode_number} className="flex flex-col gap-2 md:h-20 md:bg-slate-300 md:rounded-sm md:p-2">
            <div className="flex flex-row items-center justify-between">
              <div>
                <span className="text-sm font-bold">E{episode.episode_number}</span>
                <span> {episode.name}</span>
              </div>
              <div>
                <Button className="rounded-full h-8 w-8 bg-gray-500 text-white px-2 py-1">
                  <Check />
                </Button>
              </div>
            </div>
            <hr className="md:hidden" />
          </div>
        ))
        )}
      </div>
        
		</div>
	);
};

function EpisodeSkeleton() {
  return (
    <div className="flex flex-col gap-2 md:h-20 md:bg-slate-300 md:rounded-sm md:p-2">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2">
          <Skeleton className="h-4 w-5" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full py-1" />
      </div>
      <Skeleton className="h-px w-full md:hidden" />
    </div>
  )
}



export default SeasonView;
