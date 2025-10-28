import MapClient from "./components/MapClient";
import { getSightings } from "@/utils/supabase/fetchs";

export function generateMetadata() {
  return {
    title: "Mapa mascotas - Rescate Mascotas",
    descripcion: "Encuentra a las mascotas en un mapa 100% interactivo",
  };
}

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ lat: string; lng: string; filter?: string }>;
}) {
  const { lng, lat, filter } = await searchParams;
  const centerData = !lng || !lat ? [-34.6037, -58.3816] : [+lat, +lng];

  const { sightings } = await getSightings("perdido", filter);

  return <MapClient sightings={sightings || []} searchParams={centerData} />;
}
