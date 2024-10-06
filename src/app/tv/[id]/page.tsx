import { getSeries } from "@/lib/tmdb";
import MediaDetails from "@/components/MediaDetails";
import { getSimilarSeries } from "@/lib/tmdb";

export default async function TVPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const series = await getSeries(parseInt(id));
  const providers = series["watch/providers"]?.results?.IN?.flatrate ?? [];

  const similarSeries = await getSimilarSeries(parseInt(id));

  return (
    <div>
      <MediaDetails media={series} providers={providers} similar={similarSeries.results!} />
    </div>
  );
}
