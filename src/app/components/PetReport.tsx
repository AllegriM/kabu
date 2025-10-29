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
import { X, Upload, Check } from "lucide-react";
import { EstadoSighting, PetType, ReportData, UserData } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PetReportFormProps {
  location: { lat: number; lng: number };
  onClose: () => void;
  userData: UserData;
}

export function PetReportForm({
  location,
  onClose,
  userData,
}: PetReportFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    raza: "",
    color: "",
    descripcion: "",
    estado: "",
    contactName: userData?.nombre || "",
    contactPhone: userData?.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reportData: ReportData = {
      lat: location.lat,
      lng: location.lng,
      descripcion: formData.descripcion,
      tipo: formData.tipo as PetType,
      raza: formData.raza,
      color: formData.color,
      // foto_url: formData.photo, // Handle photo upload separately
      created_at: new Date(),
      expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dias
      created_by: userData.id,
      estado: formData.estado as EstadoSighting,
    };

    if (!userData?.phone || userData?.phone !== formData.contactPhone) {
      try {
        const res = await fetch("/api/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.contactPhone }),
        });

        if (!res.ok) throw new Error("Error al actualizar el telefono");
      } catch (err: unknown) {
        console.error("Update phone error:", err);
        if (err instanceof Error) {
          toast.error("No se pudo actualizar el telefono: " + err.message);
        }
      }
    }

    try {
      const res = await fetch("/api/sightings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      const { data } = await res.json();

      if (!res.ok) {
        console.error("Server error:", data);
        toast.error(data?.error?.message || "Error al crear el reporte");
        return;
      }
      if (!data.ok) {
        if (data.retry_after) {
          const horas = Math.ceil(data.retry_after / 3600);
          toast.error(
            `🚫 Límite alcanzado. Podés crear otro reporte en ${horas} hora${
              horas > 1 ? "s" : ""
            }.`
          );
        } else {
          toast.error(data.message || "No se pudo crear el reporte");
        }
        return;
      }

      toast.success("🐾 ¡Publicación creada con éxito!");
      router.refresh();
      return data;
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión con el servidor");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="h-full">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle>Reportar mascota encontrada</CardTitle>
        <CardDescription>
          Ubicación: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
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
                <SelectItem value="rescatado">Rescatado</SelectItem>
                <SelectItem value="transito">En transito</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="photo">Foto (opcional)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 bg-transparent"
              >
                <Upload className="h-4 w-4" />
                Subir foto
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Información de contacto
            </h4>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="contactName">Tu nombre *</Label>
                <Input
                  id="contactName"
                  placeholder="Nombre completo"
                  value={formData.contactName}
                  onChange={(e) => handleChange("contactName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Teléfono *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+54 9 11 1234-5678"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
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
                Enviando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Publicar reporte
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
