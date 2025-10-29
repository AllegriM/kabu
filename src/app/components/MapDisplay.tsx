"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";

const Map = dynamic(() => import("./Map"), { ssr: false });

interface Location {
  lat: number;
  lng: number;
}

export default function MapDisplay({
  onMapClick,
  selectedLocation,
  geoLocation,
  fallbackLocation,
}: {
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: Location | null;
  geoLocation?: Location | null;
  fallbackLocation?: Location;
}) {
  const initialPosition = geoLocation
    ? ([geoLocation.lat, geoLocation.lng] as [number, number])
    : ([fallbackLocation?.lat, fallbackLocation?.lng] as [number, number]);

  const selectedPosition = selectedLocation
    ? ([selectedLocation.lat, selectedLocation.lng] as [number, number])
    : undefined;

  return (
    <Card className="relative overflow-hidden">
      <Map
        onMapClick={onMapClick}
        selectedPosition={selectedPosition}
        initialPosition={initialPosition}
        zoom={13}
        userPosition={
          geoLocation
            ? ([geoLocation.lat, geoLocation.lng] as [number, number])
            : undefined
        }
      />
    </Card>
  );
}
