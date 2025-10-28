"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PetCard from "./PetCard";
import { Get_Own_Sighting } from "@/lib/types";
import { ContactOwnerButton } from "../publicacion/[id]/components/message-button";
import { useAuth } from "./SessionAuth";

export function RecentPets({ pets }: { pets: Get_Own_Sighting[] }) {
  const { user } = useAuth();
  console.log(user);
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Reportes recientes
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Mascotas reportadas recientemente en la comunidad
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.length &&
            pets.map((pet) => (
              <PetCard pet={pet} key={pet.id}>
                {user?.id ? <ContactOwnerButton sightingId={pet.id} /> : <></>}
              </PetCard>
            ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link className="cursor-pointer" href={"/mascotas"}>
            <Button className="cursor-pointer" size="lg" variant="outline">
              Ver todos los reportes
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
