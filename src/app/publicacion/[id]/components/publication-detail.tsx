"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  Phone,
  User,
  Calendar,
  Share2,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Comment, Get_Own_Sighting } from "@/lib/types";
import Image from "next/image";
import noImage from "@/images/no-image-pet.png";
import { CommentsSection } from "./comments-section";
import { useAuth } from "@/app/components/SessionAuth";
import { ContactOwnerButton } from "./message-button";

const petTypeLabels: Record<string, string> = {
  perro: "Perro",
  gato: "Gato",
  ave: "Ave",
  otros: "Otro",
};

const estadoLabels: Record<string, string> = {
  perdido: "Perdido",
  reunido: "Reunido",
  transito: "En transito",
};

const estadoColors: Record<string, "default" | "secondary" | "destructive"> = {
  perdido: "destructive",
  reunido: "secondary",
  transito: "default",
};

export function PublicationDetail({
  sighting,
  comments,
}: {
  sighting: Get_Own_Sighting;
  comments: Comment[];
}) {
  const { user } = useAuth();

  const [timeAgo, setTimeAgo] = useState("");
  const [expiresIn, setExpiresIn] = useState("");

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const created = new Date(sighting.created_at);
      const expires = new Date(sighting.expires_at);

      // Calculate time ago
      const diffMs = now.getTime() - created.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        setTimeAgo(`Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`);
      } else if (diffHours > 0) {
        setTimeAgo(`Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`);
      } else {
        setTimeAgo("Hace menos de 1 hora");
      }

      const expiresMs = expires.getTime() - now.getTime();
      const expiresHours = Math.floor(expiresMs / (1000 * 60 * 60));
      const expiresDays = Math.floor(expiresHours / 24);

      if (expiresMs < 0) {
        setExpiresIn("Expirado");
      } else if (expiresDays > 0) {
        setExpiresIn(
          `Expira en ${expiresDays} día${expiresDays > 1 ? "s" : ""}`
        );
      } else if (expiresHours > 0) {
        setExpiresIn(
          `Expira en ${expiresHours} hora${expiresHours > 1 ? "s" : ""}`
        );
      } else {
        setExpiresIn("Expira pronto");
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);

    return () => clearInterval(interval);
  }, [sighting.created_at, sighting.expires_at]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${petTypeLabels[sighting.tipo]} encontrado - ${
            sighting.raza
          }`,
          text: sighting.descripcion,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  const handleContact = () => {
    window.location.href = `tel:${sighting.user_phone}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button variant="ghost" asChild className="mb-6 gap-2">
            <Link href="/mascotas">
              <ArrowLeft className="h-4 w-4" />
              Volver a mascotas
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <div className="relative h-96 overflow-hidden rounded-t-lg">
                <Image
                  height={400}
                  width={300}
                  src={sighting.foto_url || noImage}
                  alt={sighting.raza}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge
                    variant={estadoColors[sighting.estado]}
                    className="text-sm"
                  >
                    {estadoLabels[sighting.estado]}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {petTypeLabels[sighting.tipo]} - {sighting.raza}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {sighting.color}
                  </p>
                </div>

                <Separator className="my-4" />

                <div>
                  <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {sighting.descripcion}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalles de la publicación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Ubicación</p>
                      <p className="text-sm text-muted-foreground">
                        {sighting.location_geojson.coordinates}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {sighting.lat}, {sighting.lng}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Publicado</p>
                      <p className="text-sm text-muted-foreground">{timeAgo}</p>
                      <p
                        className="text-xs text-muted-foreground mt-1"
                        suppressHydrationWarning
                      >
                        {new Date(sighting.created_at).toLocaleDateString(
                          "es-AR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Vigencia</p>
                      <p className="text-sm text-muted-foreground">
                        {expiresIn}
                      </p>
                      <p
                        className="text-xs text-muted-foreground mt-1"
                        suppressHydrationWarning
                      >
                        {new Date(sighting.expires_at).toLocaleDateString(
                          "es-AR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Estado</p>
                      <p className="text-sm text-muted-foreground">
                        {estadoLabels[sighting.estado]}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ubicación en el mapa</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full mt-4 gap-2 bg-transparent"
                  asChild
                >
                  <Link
                    href={`/map?lat=${sighting.location_geojson.coordinates[1]}&lng=${sighting.location_geojson.coordinates[0]}`}
                  >
                    <MapPin className="h-4 w-4" />
                    Ver en mapa completo
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <CommentsSection
              sightingId={sighting.id}
              comments={comments}
              user={user}
            />
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">
                      {sighting.user_nombre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Reportó esta mascota
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{sighting.user_phone}</span>
                </div>

                <Separator />

                {sighting.estado === "perdido" && (
                  <div className="space-y-2">
                    <Button
                      onClick={handleContact}
                      className="w-full gap-2 bg-primary hover:bg-primary/90"
                    >
                      <Phone className="h-4 w-4" />
                      Llamar
                    </Button>
                    {user ? (
                      <ContactOwnerButton sightingId={sighting.id} />
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-2 bg-transparent"
                        disabled
                      >
                        <MessageCircle className="h-4 w-4" />
                        Inicia sesión para chatear
                      </Button>
                    )}
                  </div>
                )}

                {sighting.estado === "encontrado" && (
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Esta mascota ya fue reunida con su dueño
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compartir publicación</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Ayuda a difundir esta publicación para reunir a esta mascota
                  con su familia
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consejos de seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <p>Reúnete en lugares públicos y seguros</p>
                </div>
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <p>
                    Verifica la identidad del dueño antes de entregar la mascota
                  </p>
                </div>
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <p>No compartas información personal sensible</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
