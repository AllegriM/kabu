import React, { Suspense } from "react";
import PetLoadingAnimation from "../components/PetLoadingAnimation";
import { PetsFilters } from "./_components/pet-filters";
import { getSightingsByPage } from "@/utils/supabase/fetchs";
import { EstadoSighting } from "@/lib/types";

export const generateMetadata = async () => {
  return {
    title: "Mascotas Reportadas - Mascotas Perdidas",
  };
};

export default async function Mascotas({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; page?: string }>;
}) {
  const params = await searchParams;
  const estado = (params.estado ?? "todos") as EstadoSighting;

  const pageNum = params.page ? Math.max(0, parseInt(params.page, 10) || 0) : 0;

  const { sightings, count, totalPages } = await getSightingsByPage(
    estado,
    "",
    pageNum
  );

  if (!sightings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight mb-2">
            Mascotas reportadas
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Explora todas las mascotas encontradas en la comunidad
          </p>
        </div>

        <h5 className="text-balance text-2xl font-bold tracking-tight mb-2">
          No hay reportes de mascotas registradas aún.
        </h5>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-balance text-4xl font-bold tracking-tight mb-2">
          Mascotas reportadas
        </h1>
        <p className="text-pretty text-lg text-muted-foreground">
          Explora todas las mascotas encontradas en la comunidad
        </p>
      </div>

      <Suspense fallback={<PetLoadingAnimation />}>
        <PetsFilters
          pets={sightings}
          count={count}
          totalPages={totalPages}
          pageNum={pageNum}
        />
      </Suspense>
    </div>
  );
}
