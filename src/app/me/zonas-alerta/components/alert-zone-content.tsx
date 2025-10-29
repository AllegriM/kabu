"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertZoneMap } from "./alert-zone-map";
import { Plus, Trash2, Bell, MapPin } from "lucide-react";
import { AlertZone } from "@/lib/types";
import { useRouter } from "next/navigation";
import { createOwnZone, deleteOwnZone } from "@/utils/supabase/fetchsClient";

export function AlertZonesContent({ zones }: { zones: AlertZone[] }) {
  const router = useRouter();
  //   const [zones, setZones] = useState<AlertZone[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateZone = async (
    currentPolygon: [number, number][],
    zoneName: string
  ) => {
    await createOwnZone(currentPolygon, zoneName);

    router.refresh();
  };

  const handleToggleZone = (id_zone: string) => {
    console.log("ID: ", id_zone);
  };

  const handleDeleteZone = async (id_zone: string) => {
    await deleteOwnZone(id_zone);

    router.refresh();
  };
  console.log(zones);
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-4xl font-bold">Zonas de Alerta</h1>
        <p className="text-muted-foreground">
          Crea zonas en el mapa para recibir notificaciones cuando se reporten
          mascotas en esas áreas
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {isCreating ? "Dibuja tu zona de alerta" : "Mapa de zonas"}
              </CardTitle>
              <CardDescription>
                {isCreating
                  ? "Haz clic en el mapa para crear los puntos del polígono. Haz doble clic para finalizar."
                  : "Visualiza tus zonas de alerta activas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] overflow-hidden rounded-lg border">
                <AlertZoneMap
                  zones={zones}
                  isCreating={isCreating}
                  onZoneCreated={handleCreateZone}
                  onCancelCreate={() => setIsCreating(false)}
                />
              </div>
              {!isCreating && (
                <Button
                  onClick={() => setIsCreating(true)}
                  className="mt-4 w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Crear nueva zona
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Zones List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Mis zonas ({zones.length})
              </CardTitle>
              <CardDescription>Gestiona tus zonas de alerta</CardDescription>
            </CardHeader>
            <CardContent>
              {zones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">
                    No tienes zonas de alerta
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Crea tu primera zona para empezar a recibir notificaciones
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {zones.map((zone, index) => (
                    <motion.div
                      key={zone.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-primary">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <h3 className="font-semibold">{zone.name}</h3>
                                <Badge variant={"default"}>Activa</Badge>
                              </div>
                              <p
                                className="text-sm text-muted-foreground"
                                suppressHydrationWarning
                              >
                                Creada el{" "}
                                {new Date(zone.created_at).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant={"outline"}
                                size="sm"
                                onClick={() => handleToggleZone(zone.id)}
                              >
                                Desactivar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteZone(zone.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
