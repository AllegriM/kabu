"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface MapFiltersProps {
  onFilterChange: (filters: string[]) => void;
}

const filterOptions = [
  { id: "perro", label: "Perros", emoji: "🐕", color: "bg-amber-500" },
  { id: "gato", label: "Gatos", emoji: "🐈", color: "bg-purple-500" },
  { id: "ave", label: "Aves", emoji: "🦜", color: "bg-sky-500" },
  { id: "otros", label: "Otros", emoji: "🐾", color: "bg-emerald-500" },
];

export function MapFilters({ onFilterChange }: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((f) => f !== filterId)
      : [...activeFilters, filterId];

    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="sm"
        className="gap-2 shadow-lg"
      >
        <Filter className="h-4 w-4" />
        Filtros
        {activeFilters.length > 0 && (
          <Badge
            variant="default"
            className="ml-1 h-5 min-w-5 rounded-full px-1.5"
          >
            {activeFilters.length}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-64"
          >
            <Card className="p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Filtrar por tipo</h3>
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto gap-1 px-2 py-1 text-xs"
                  >
                    <X className="h-3 w-3" />
                    Limpiar
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleFilter(option.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 transition-all hover:bg-accent ${
                      activeFilters.includes(option.id)
                        ? "border-primary bg-primary/5"
                        : "border-transparent"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${option.color}`}
                    >
                      <span className="text-lg">{option.emoji}</span>
                    </div>
                    <span className="text-sm font-medium">{option.label}</span>
                    {activeFilters.includes(option.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
