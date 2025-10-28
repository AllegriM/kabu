import React, { Suspense } from "react";
import PetLoadingAnimation from "../components/PetLoadingAnimation";
import { PetsFilters } from "./_components/pet-filters";
import { getSightingsByPage } from "@/utils/supabase/fetchs";
import { EstadoSighting, PetType } from "@/lib/types";

export const generateMetadata = async () => {
  return {
    title: "Mascotas Reportadas - Mascotas Perdidas",
  };
};

export default async function Mascotas({
  searchParams,
}: {
  searchParams: {
    estado?: string;
    tipo?: string;
    query?: string;
    page?: string;
  };
}) {
  const estado = (searchParams.estado ?? "todos") as EstadoSighting;
  const tipo = (searchParams.tipo ?? "todos") as PetType;
  const query = searchParams.query ?? "";
  const pageNum = searchParams.page
    ? Math.max(0, parseInt(searchParams.page, 10) || 0)
    : 0;
  const limit = 10;

  const { sightings, count, totalPages, error } = await getSightingsByPage(
    estado,
    tipo,
    query,
    pageNum,
    limit
  );

  if (error || !sightings || sightings.length === 0) {
    const noResultsMessage =
      query || estado !== "todos" || tipo !== "todos"
        ? `No se encontraron mascotas con los filtros aplicados.`
        : `No hay reportes de mascotas registradas aún.`;
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
          {noResultsMessage}
        </h5>

        <PetsFilters
          initialEstado={estado}
          initialTipo={tipo}
          initialQuery={query}
          pets={[]}
          count={0}
          totalPages={1}
          pageNum={0}
        />
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
          initialEstado={estado}
          initialTipo={tipo}
          initialQuery={query}
          pets={sightings}
          count={count}
          totalPages={totalPages}
          pageNum={pageNum}
        />
      </Suspense>
    </div>
  );
}
