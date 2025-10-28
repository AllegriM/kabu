import { createClient } from "@/utils/supabase/server";
import React from "react";
import MapDisplay from "./MapDisplay";

export default async function MapDisplayServer(props: {
  initialCenter?: { lat: number; lng: number };
}) {
  const supabase = await createClient();
  const { data: sightings } = await supabase.from("sightings").select("*");

  return (
    <MapDisplay
      onMapClick={(lat, lng) => {
        console.log("Map clicked at:", lat, lng);
      }}
      sightings={sightings || []}
      selectedLocation={props.initialCenter || null}
    />
  );
}
