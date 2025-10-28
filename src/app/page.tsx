import { getLastSightings } from "@/utils/supabase/fetchs";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import MapSectionServer from "./components/MapSectionServer";
import { RecentPets } from "./components/RecentPets";

export default async function Home() {
  const { sightings } = await getLastSightings();
  return (
    <div className="min-h-screen">
      <Hero />
      <MapSectionServer />
      <HowItWorks />
      <RecentPets pets={sightings} />
    </div>
  );
}
