"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Check } from "lucide-react";
import Link from "next/link";
import { EditPetForm } from "@/app/me/_components/edit-pet-form";
import { Get_Own_Sighting } from "@/lib/types";
import PetCard from "@/app/components/PetCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MyPublicationsContentProps {
  pets: Get_Own_Sighting[];
}

const deletePet = async (id: string) => {
  const response = await fetch("/api/mascotas", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return response;
};

const editPet = async (data: Omit<Get_Own_Sighting, "users">) => {
  const response = await fetch("/api/mascotas", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response;
};

export function MyPublicationsContent({
  pets: initialPets,
}: MyPublicationsContentProps) {
  const router = useRouter();

  const [editingPet, setEditingPet] = useState<Get_Own_Sighting | null>(null);

  const handleDelete = async (petId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      await deletePet(petId);
    }
  };

  const handleEdit = (pet: Get_Own_Sighting) => {
    setEditingPet(pet);
  };

  const handleSaveEdit = async (
    updatedPet: Omit<Get_Own_Sighting, "users">
  ) => {
    const response = await editPet(updatedPet);
    if (response.ok) {
      toast.success("Mascota editada con exito!");
      router.refresh();
    }
    setEditingPet(null);
  };

  const handleCancelEdit = () => {
    setEditingPet(null);
  };

  const handleMarkAsReunited = async (updatedPet: Get_Own_Sighting) => {
    const response = await editPet({ ...updatedPet, estado: "encontrado" });
    if (response.ok) {
      toast.success("Mascota marcada como ENCONTRADO con exito!");
      router.refresh();
    }
  };

  if (initialPets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-6xl">🐾</div>
        <p className="text-lg text-muted-foreground mb-4">
          Aún no tienes publicaciones
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Comienza reportando una mascota encontrada
        </p>
        <Button asChild>
          <Link href="/map">Ir al mapa</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialPets.map((pet, index) => (
          <PetCard pet={pet} key={index}>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2 bg-transparent"
                size="sm"
                onClick={() => handleEdit(pet)}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              {pet.estado === "perdido" && (
                <Button
                  variant="outline"
                  className="flex-1 gap-2 cursor-pointer"
                  size="sm"
                  onClick={() => handleMarkAsReunited(pet)}
                >
                  <Check className="h-4 w-4" />
                  Reunido
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => handleDelete(pet.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </PetCard>
        ))}
      </div>

      <AnimatePresence>
        {editingPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <EditPetForm
                pet={editingPet}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
