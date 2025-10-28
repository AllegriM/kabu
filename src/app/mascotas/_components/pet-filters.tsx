"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dog, Cat, Bird, Rabbit } from "lucide-react";
import { PetsGrid } from "@/app/mascotas/_components/pet-grid";
import { EstadoSighting, Get_Own_Sighting, PetType } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface PetsFiltersProps {
  pets: Get_Own_Sighting[];
  count: number;
  totalPages: number;
  pageNum: number;
}

const estados = [
  { id: "todos", label: "Todos" },
  { id: "perdido", label: "Perdido" },
  { id: "encontrado", label: "Encontrado" },
  { id: "transito", label: "En Transito" },
];

const filters = [
  { id: "todos", label: "Todos", icon: null, color: "bg-primary" },
  { id: "perro", label: "Perros", icon: Dog, color: "bg-blue-500" },
  { id: "gato", label: "Gatos", icon: Cat, color: "bg-purple-500" },
  { id: "ave", label: "Aves", icon: Bird, color: "bg-green-500" },
  { id: "otros", label: "Otros", icon: Rabbit, color: "bg-orange-500" },
];

export function PetsFilters({
  pets,
  count,
  totalPages,
  pageNum,
}: PetsFiltersProps) {
  const [selectedFilter, setSelectedFilter] = useState<PetType>("todos");
  const [estadoFilter, setEstadoFilter] = useState<EstadoSighting>("todos");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const filteredPets =
    selectedFilter === "todos"
      ? pets
      : pets.filter((pet) => pet.tipo === selectedFilter);

  const getCount = (tipo: PetType) => {
    if (tipo === "todos") return pets.length;
    return pets.filter((pet) => pet.tipo === tipo).length;
  };

  const handleEstadoChange = (value: EstadoSighting) => {
    setEstadoFilter(value);
    const params = createQueryString("estado", value);
    router.push(pathname + "?" + params);
  };

  const makeHref = (page: number) => {
    const qp = new URLSearchParams();
    if (estadoFilter) qp.set("estado", estadoFilter);
    qp.set("page", String(page));
    return `/mascotas?${qp.toString()}`;
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedFilter === filter.id;
          const count = getCount(filter.id as PetType);

          return (
            <motion.div
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={isActive ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedFilter(filter.id as PetType)}
                className="gap-2 relative"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {filter.label}
                <Badge
                  variant="secondary"
                  className={`ml-1 ${
                    isActive ? "bg-primary-foreground/20" : ""
                  }`}
                >
                  {count}
                </Badge>
              </Button>
            </motion.div>
          );
        })}

        <Select
          value={estadoFilter}
          onValueChange={(value) => handleEstadoChange(value as EstadoSighting)}
        >
          <SelectTrigger className="w-[180px] ml-auto">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {estados.map((estado) => (
              <SelectItem key={estado.id} value={estado.id}>
                {estado.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedFilter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <PetsGrid pets={filteredPets} />
        </motion.div>
      </AnimatePresence>

      {/* PAGINADO */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <div>
          <span className="mr-2 text-sm text-muted-foreground">
            Mostrando página {pageNum + 1} de {totalPages} ({count} resultados)
          </span>
        </div>

        <nav aria-label="Paginación" className="flex items-center gap-2">
          {/* Prev */}
          <Link
            href={makeHref(Math.max(0, pageNum - 1))}
            className={`px-3 py-1 rounded-md border ${
              pageNum <= 0 ? "opacity-50 pointer-events-none" : ""
            }`}
            aria-disabled={pageNum <= 0}
          >
            Prev
          </Link>

          {Array.from({ length: totalPages }).map((_, i) => {
            const show =
              totalPages <= 7 ||
              i === 0 ||
              i === totalPages - 1 ||
              Math.abs(i - pageNum) <= 2;

            if (!show) {
              return null;
            }

            return (
              <Link
                key={i}
                href={makeHref(i)}
                className={`px-3 py-1 rounded-md border ${
                  i === pageNum ? "bg-muted text-white font-semibold" : ""
                }`}
                aria-current={i === pageNum ? "page" : undefined}
              >
                {i + 1}
              </Link>
            );
          })}

          {/* Next */}
          <Link
            href={makeHref(Math.min(totalPages - 1, pageNum + 1))}
            className={`px-3 py-1 rounded-md border ${
              pageNum + 1 >= totalPages ? "opacity-50 pointer-events-none" : ""
            }`}
            aria-disabled={pageNum + 1 >= totalPages}
          >
            Next
          </Link>
        </nav>
      </div>
    </div>
  );
}
