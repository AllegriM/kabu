import { createClient } from "@/utils/supabase/server";
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
  const supabase = await createClient();

  const { lng, lat, filter } = await searchParams;
  const centerData = !lng || !lat ? [-34.6037, -58.3816] : [+lat, +lng];
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { sightings } = await getSightings("perdido", filter);
  let userData = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    userData = data;
  }
  console.log(sightings);
  return (
    <MapClient
      userData={userData}
      sightings={sightings || []}
      searchParams={centerData}
    />
  );
}
