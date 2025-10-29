import { getLastSightings } from "@/utils/supabase/fetchs";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { RecentPets } from "./components/RecentPets";
import { createClient } from "@/utils/supabase/server";
import { MapSection } from "./components/MapSection";

export default async function Home() {
  const supabase = await createClient();

  const { sightings } = await getLastSightings();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userData = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    userData = data;
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <MapSection user={user} userData={userData} />
      <HowItWorks />
      <RecentPets pets={sightings || []} />
    </div>
  );
}
