"use client";
import { Sighting } from "@/lib/types";
import dynamic from "next/dynamic";

interface FullScreenMapProps {
  onMapClick: (lat: number, lng: number) => void;
  activeFilters: string[];
  sightings: Sighting[];
  searchParams?: number[];
}

const Map = dynamic(() => import("./Map"), { ssr: false });

export function FullScreenMap({ sightings, searchParams }: FullScreenMapProps) {
  return <Map sightings={sightings} searchParams={searchParams} />;
}
