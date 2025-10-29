import { createClient } from "@/utils/supabase/server";
import React from "react";
import MapDisplay from "./MapDisplay";

export default async function MapDisplayServer(props: {
  initialCenter?: { lat: number; lng: number };
}) {
  return (
    <MapDisplay
      onMapClick={(lat, lng) => {
        console.log("Map clicked at:", lat, lng);
      }}
      selectedLocation={props.initialCenter || null}
    />
  );
}
