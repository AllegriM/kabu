import { notFound } from "next/navigation";
import { PublicationDetail } from "./components/publication-detail";
import {
  getPublicationComments,
  getSightingByID,
} from "@/utils/supabase/fetchs";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { sighting } = await getSightingByID(id);

  if (!sighting) {
    return {
      title: "Reporte no encontrado",
    };
  }

  // 2. Generar metadatos dinámicos
  const title = `${
    sighting.estado === "perdido" ? "SE BUSCA" : "ENCONTRADO"
  }: ${sighting.tipo} ${sighting.raza}`;
  const description = `Se reportó un ${sighting.tipo} ${sighting.estado} de raza ${sighting.raza}. Ayuda a encontrarlo.`;

  return {
    title: title,
    description: description,
  };
}

export default async function PublicacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const { sighting } = await getSightingByID(id);
  const { comments } = await getPublicationComments(id);
  if (!sighting) {
    notFound();
  }
  console.log(comments);

  return <PublicationDetail sighting={sighting} comments={comments} />;
}
