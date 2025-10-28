"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function MapDisplay({
  onMapClick,
  selectedLocation,
  geoLocation,
  fallbackLocation,
}: {
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  geoLocation?: { lat: number; lng: number } | null;
  fallbackLocation: { lat: number; lng: number };
}) {
  const initialPosition = geoLocation
    ? [geoLocation.lat, geoLocation.lng]
    : [fallbackLocation.lat, fallbackLocation.lng];

  const selectedPosition = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : undefined;

  return (
    <Card className="relative overflow-hidden">
      <Map
        onMapClick={onMapClick}
        selectedPosition={selectedPosition}
        initialPosition={initialPosition}
        zoom={13}
        userPosition={
          geoLocation ? [geoLocation.lat, geoLocation.lng] : undefined
        }
      />
    </Card>
  );
}
