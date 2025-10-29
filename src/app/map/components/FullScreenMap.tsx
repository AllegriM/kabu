"use client";
import { Get_Own_Sighting } from "@/lib/types";
import dynamic from "next/dynamic";

interface FullScreenMapProps {
  onMapClick?: (lat: number, lng: number) => void;
  activeFilters: string[];
  sightings: Get_Own_Sighting[];
  searchParams?: number[];
}

const Map = dynamic(() => import("./Map"), { ssr: false });

export function FullScreenMap({
  sightings,
  searchParams,
  onMapClick,
}: FullScreenMapProps) {
  return (
    <Map
      sightings={sightings}
      searchParams={searchParams}
      onMapClick={onMapClick}
    />
  );
}
