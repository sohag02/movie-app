import { getSeries } from "@/lib/tmdb";
import MediaDetails from "@/components/MediaDetails";

export default async function TVPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const series = await getSeries(parseInt(id));
  const providers = series["watch/providers"]?.results?.IN?.flatrate ?? [];

  return (
    <div>
      <MediaDetails media={series} providers={providers} />
    </div>
  );
}