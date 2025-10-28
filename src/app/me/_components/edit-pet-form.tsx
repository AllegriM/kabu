"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Check, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Sighting, Update_Sighting } from "@/lib/types";

const EditLocationMap = dynamic(() => import("./edit-location-map"), {
  ssr: false,
});

interface EditPetFormProps {
  pet: Sighting;
  onSave: (pet: Update_Sighting) => void;
  onCancel: () => void;
}

export function EditPetForm({ pet, onSave, onCancel }: EditPetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState({
    tipo: pet.tipo,
    raza: pet.raza,
    color: pet.color,
    descripcion: pet.descripcion,
    estado: pet.estado,
    foto_url: pet.foto_url,
    location: pet.location_geojson,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 2);

    const updatedPet: Update_Sighting = {
      ...pet,
      tipo: formData.tipo,
      raza: formData.raza,
      color: formData.color,
      descripcion: formData.descripcion,
      estado: formData.estado,
      foto_url: formData.foto_url,
      lat: formData.location.coordinates[1],
      lng: formData.location.coordinates[0],
      created_at: now,
      expires_at: expiresAt,
    };

    onSave(updatedPet);

    toast.success(
      "Los cambios se han guardado correctamente. Las fechas se actualizaron automáticamente."
    );

    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    console.log(lat, lng);
    setFormData((prev) => ({
      ...prev,
      lat,
      lng,
      location: {
        ...prev.location,
        coordinates: [lng, lat],
      },
    }));
  };

  return (
    <Card className="h-full">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle>Editar publicación</CardTitle>
        <CardDescription>
          Actualiza la información de la mascota encontrada. Las fechas se
          actualizarán automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de mascota *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => handleChange("tipo", value)}
              required
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perro">Perro</SelectItem>
                <SelectItem value="gato">Gato</SelectItem>
                <SelectItem value="ave">Ave</SelectItem>
                <SelectItem value="otros">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="raza">Raza (aproximada)</Label>
            <Input
              id="raza"
              placeholder="Ej: Labrador, Siamés..."
              value={formData.raza}
              onChange={(e) => handleChange("raza", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color principal *</Label>
            <Input
              id="color"
              placeholder="Ej: Negro, Blanco, Marrón..."
              value={formData.color}
              onChange={(e) => handleChange("color", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe características distintivas, comportamiento, etc."
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado *</Label>
            <Select
              value={formData.estado}
              onValueChange={(value) => handleChange("estado", value)}
              required
            >
              <SelectTrigger id="estado">
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perdido">Perdido</SelectItem>
                <SelectItem value="encontrado">Encontrado</SelectItem>
                <SelectItem value="transito">En transito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="foto_url">URL de la foto</Label>
            <Input
              id="foto_url"
              type="url"
              placeholder="https://ejemplo.com/foto.jpg"
              value={formData.foto_url}
              onChange={(e) => handleChange("foto_url", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Ubicación en el mapa *</Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>
                Lat: {formData.location.coordinates[1]}, Lng:{" "}
                {formData.location.coordinates[0]}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 bg-transparent"
              onClick={() => setShowMap(!showMap)}
            >
              <MapPin className="h-4 w-4" />
              {showMap ? "Ocultar mapa" : "Cambiar ubicación en el mapa"}
            </Button>
            {showMap && (
              <div className="mt-2 rounded-lg overflow-hidden border">
                <EditLocationMap
                  initialPosition={{
                    lat: formData.location.coordinates[1],
                    lng: formData.location.coordinates[0],
                  }}
                  onLocationChange={handleLocationChange}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
