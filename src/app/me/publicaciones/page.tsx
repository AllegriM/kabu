import PetLoadingAnimation from "@/app/components/PetLoadingAnimation";
import { getUserSightings } from "@/utils/supabase/fetchs";
import React, { Suspense } from "react";
import { MyPublicationsContent } from "../_components/MyPublicationsContent";

export default async function MisPublicaciones() {
  const { sightings } = await getUserSightings();
  console.log(sightings);
  return (
    <section>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight mb-2">
            Mis publicaciones
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Administra tus reportes de mascotas encontradas
          </p>
        </div>

        <Suspense fallback={<PetLoadingAnimation />}>
          <MyPublicationsContent pets={sightings || []} />
        </Suspense>
      </div>
    </section>
  );
}
