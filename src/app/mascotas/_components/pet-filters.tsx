"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dog, Cat, Bird, Rabbit, Search, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";

interface PetsFiltersProps {
  pets: Get_Own_Sighting[];
  count: number;
  totalPages: number;
  pageNum: number;
  initialEstado: EstadoSighting;
  initialTipo: PetType;
  initialQuery: string;
}

const estados = [
  { id: "todos", label: "Todos" },
  { id: "perdido", label: "Perdido" },
  { id: "encontrado", label: "Encontrado" },
  { id: "transito", label: "En Transito" },
];

const filters = [
  { id: "todos", label: "Todos", icon: null },
  { id: "perro", label: "Perros", icon: Dog },
  { id: "gato", label: "Gatos", icon: Cat },
  { id: "ave", label: "Aves", icon: Bird },
  { id: "otros", label: "Otros", icon: Rabbit },
];

export function PetsFilters({
  pets,
  count,
  totalPages,
  pageNum,
  initialEstado,
  initialTipo,
  initialQuery,
}: PetsFiltersProps) {
  const [selectedTipo, setSelectedTipo] = useState<PetType>(initialTipo);
  const [selectedEstado, setSelectedEstado] =
    useState<EstadoSighting>(initialEstado);
  const [searchInput, setSearchInput] = useState(initialQuery);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (updates: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      updates.forEach(({ name, value }) => {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      });
      if (!updates.some((u) => u.name === "page")) {
        params.set("page", "0");
      }
      return params.toString();
    },
    [searchParams]
  );

  // Handler para cambiar TIPO
  const handleTipoChange = (tipo: PetType) => {
    setSelectedTipo(tipo);
    const queryString = createQueryString([
      { name: "tipo", value: tipo === "todos" ? "" : tipo },
    ]);
    router.push(`${pathname}?${queryString}`);
  };

  // Handler para cambiar ESTADO
  const handleEstadoChange = (estado: EstadoSighting) => {
    setSelectedEstado(estado);
    const queryString = createQueryString([
      { name: "estado", value: estado === "todos" ? "" : estado },
    ]);
    router.push(`${pathname}?${queryString}`);
  };

  const handleSearchSubmit = () => {
    const queryString = createQueryString([
      { name: "query", value: searchInput.trim() },
    ]);
    router.push(`${pathname}?${queryString}`);
  };

  const clearSearch = () => {
    setSearchInput("");
    const queryString = createQueryString([{ name: "query", value: "" }]);
    router.push(`${pathname}?${queryString}`);
  };

  const makePageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  useEffect(() => {
    setSelectedTipo(initialTipo);
    setSelectedEstado(initialEstado);
    setSearchInput(initialQuery);
  }, [initialTipo, initialEstado, initialQuery]);

  return (
    <div>
      {/* --- Barra de Filtros --- */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Botones de TIPO */}
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedTipo === filter.id;
          return (
            <motion.div key={filter.id} whileTap={{ scale: 0.95 }}>
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleTipoChange(filter.id as PetType)}
                className="gap-2"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {filter.label}
              </Button>
            </motion.div>
          );
        })}

        {/* Separador (opcional) */}
        <div className="flex-grow"></div>

        {/* Select de ESTADO */}
        <Select value={selectedEstado} onValueChange={handleEstadoChange}>
          <SelectTrigger className="w-auto sm:w-[160px]">
            {" "}
            {/* Ancho adaptable */}
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

      {/* --- Barra de Búsqueda --- */}
      <div className="mb-8 flex gap-2">
        <Input
          placeholder="Buscar por raza, color, descripción..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
          }}
          className="flex-grow"
        />
        {searchInput && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button onClick={handleSearchSubmit} className="gap-2">
          <Search className="h-4 w-4" /> Buscar
        </Button>
      </div>

      {/* --- Grid de Mascotas (Usa los pets ya filtrados) --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pageNum + JSON.stringify(pets)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* PetsGrid recibe los 'pets' directamente */}
          <PetsGrid pets={pets} />
        </motion.div>
      </AnimatePresence>

      {/* --- Paginación --- */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Página {pageNum + 1} de {totalPages} ({count} resultados)
        </div>

        <nav aria-label="Paginación" className="flex items-center gap-2">
          {/* Prev */}
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={pageNum <= 0}
            aria-disabled={pageNum <= 0}
          >
            <Link href={makePageHref(pageNum - 1)}>Anterior</Link>
          </Button>

          {/* Números de página (simplificado) */}
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              asChild
              variant={i === pageNum ? "default" : "outline"}
              size="sm"
              aria-current={i === pageNum ? "page" : undefined}
            >
              <Link href={makePageHref(i)}>{i + 1}</Link>
            </Button>
          ))}

          {/* Next */}
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={pageNum + 1 >= totalPages}
            aria-disabled={pageNum + 1 >= totalPages}
          >
            <Link href={makePageHref(pageNum + 1)}>Siguiente</Link>
          </Button>
        </nav>
      </div>
    </div>
  );
}
