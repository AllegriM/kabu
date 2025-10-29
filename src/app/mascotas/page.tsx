import React, { Suspense } from "react";
import PetLoadingAnimation from "../components/PetLoadingAnimation";
import { PetsFilters } from "./_components/pet-filters";
import { getSightingsByPage } from "@/utils/supabase/fetchs";
import { EstadoSighting, PetType } from "@/lib/types";

type MascotasPageProps = {
  params: Promise<{}>;
  searchParams: Promise<{
    estado?: string;
    tipo?: string;
    query?: string;
    page?: string;
  }>;
};

export const generateMetadata = async () => {
  return {
    title: "Mascotas Reportadas - Kábu",
  };
};

export default async function Mascotas({
  params,
  searchParams,
}: MascotasPageProps) {
  await params;
  const resolvedSearchParams = await searchParams;

  const estado = (resolvedSearchParams.estado ?? "todos") as EstadoSighting;
  const tipo = (resolvedSearchParams.tipo ?? "todos") as PetType;
  const query = resolvedSearchParams.query ?? "";
  const pageNum = resolvedSearchParams.page
    ? Math.max(0, parseInt(resolvedSearchParams.page, 10) || 0)
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
        {/* ... (Título) ... */}
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight mb-2">
            Mascotas reportadas
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Explora todas las mascotas encontradas en la comunidad
          </p>
        </div>
        <PetsFilters
          initialEstado={estado}
          initialTipo={tipo}
          initialQuery={query}
          pets={[]}
          count={0}
          totalPages={1}
          pageNum={0}
        />
        <p className="text-center mt-10 text-muted-foreground">
          {noResultsMessage}
        </p>
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
