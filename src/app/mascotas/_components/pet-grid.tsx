"use client";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Get_Own_Sighting } from "@/lib/types";
import PetCard from "@/app/components/PetCard";
import { ContactOwnerButton } from "@/app/publicacion/[id]/components/message-button";
import { useAuth } from "@/app/components/SessionAuth";

export function PetsGrid({ pets }: { pets: Get_Own_Sighting[] }) {
  const { user } = useAuth();

  if (pets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground mb-4">
          No se encontraron mascotas con este filtro
        </p>
        <p className="text-sm text-muted-foreground">
          Intenta con otro tipo de mascota
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pets.map((pet, index) => (
        <PetCard pet={pet} key={index}>
          <div>
            {pet.estado !== "encontrado" && (
              <>
                <Button
                  variant="secondary"
                  className={`${
                    pet.estado === "transito" && "hidden"
                  } w-full mb-2`}
                  asChild
                >
                  <Link
                    href={`/map?lat=${pet.location_geojson.coordinates[1]}&lng=${pet.location_geojson.coordinates[0]}`}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Ver en mapa
                  </Link>
                </Button>
                {user.id && <ContactOwnerButton sightingId={pet.id} />}
              </>
            )}
          </div>
        </PetCard>
      ))}
    </div>
  );
}
