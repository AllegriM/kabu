"use client";

import { LoginPrompt } from "@/app/components/LoginPrompt";
import { PetReportForm } from "@/app/components/PetReport";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MapFilters } from "@/app/map/components/MapFilters";
import { FullScreenMap } from "./FullScreenMap";
import { Sighting } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/SessionAuth";

export default function MapClient({
  sightings,
  searchParams,
}: {
  sightings: Sighting[];
  searchParams?: number[];
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedLocation(null);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    const params = new URLSearchParams();
    if (searchParams) {
      params.append("lat", searchParams[0].toString());
      params.append("lng", searchParams[1].toString());
    }
    if (filters.length > 0) {
      params.append("filter", filters.join(","));
    }
    router.push(`/map?${params.toString()}`);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Header with back button */}
      <div className="absolute left-4 top-4 z-[1000]">
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="gap-2 shadow-lg"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="absolute right-4 top-4 z-[1000]">
        <MapFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Full screen map */}
      <FullScreenMap
        searchParams={searchParams}
        sightings={sightings}
        onMapClick={handleMapClick}
        activeFilters={activeFilters}
      />

      {/* Form sidebar */}
      <AnimatePresence>
        {showForm && selectedLocation && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 z-[1001] h-full w-full overflow-y-auto bg-background shadow-2xl sm:w-[400px]"
          >
            {!user ? (
              <LoginPrompt onClose={handleFormClose} />
            ) : (
              <PetReportForm
                userData={user}
                location={selectedLocation}
                onClose={handleFormClose}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
