"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PetReportForm } from "@/app/components/PetReport";
import { LoginPrompt } from "@/app/components/LoginPrompt";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import MapDisplay from "./MapDisplay";
import { SupabaseUserData, UserData } from "@/lib/types";

export function MapSection({
  user,
  userData,
}: {
  user: SupabaseUserData;
  userData: UserData;
}) {
  const [geoLocation, setGeoLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  // User selected location
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const FALLBACK = { lat: -34.6112, lng: -58.3867 }; // Buenos Aires
  // Cargar pendingSighting desde sessionStorage al montar
  useEffect(() => {
    const pendingSighting = sessionStorage.getItem("pendingSighting");
    if (pendingSighting) {
      setSelectedLocation(JSON.parse(pendingSighting));
      setShowForm(true);
    }
  }, []);

  // Obtener geolocalización del navegador
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation no soportada por el navegador");
      return;
    }

    let mounted = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mounted) return;
        setGeoLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        if (!mounted) return;
        setError(err.message || "No se pudo obtener la ubicación");
        setGeoLocation(null); // dejamos null para que MapDisplay use fallback
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );

    return () => {
      mounted = false;
    };
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    sessionStorage.setItem("pendingSighting", JSON.stringify({ lat, lng }));
    setSelectedLocation({ lat, lng });
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedLocation(null);
    sessionStorage.removeItem("pendingSighting");
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <section id="map-section" className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Mapa interactivo de mascotas
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Haz clic en cualquier lugar del mapa para reportar una mascota
            encontrada
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="mb-4 border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="text-sm leading-relaxed text-foreground">
                <strong>Cómo usar:</strong> Haz clic en el mapa donde viste la
                mascota. Se abrirá un formulario para que agregues los detalles.
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
              <MapDisplay
                onMapClick={handleMapClick}
                geoLocation={geoLocation ?? undefined}
                fallbackLocation={FALLBACK}
                selectedLocation={selectedLocation}
              />
            </div>

            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {showForm && selectedLocation ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {user ? (
                      <PetReportForm
                        location={selectedLocation}
                        onClose={handleFormClose}
                        user={{
                          id: user.id,
                          nombre: user.user_metadata?.name,
                        }}
                        userData={userData}
                      />
                    ) : (
                      <LoginPrompt onClose={handleFormClose} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
                      <div className="mb-4 rounded-full bg-primary/10 p-6">
                        <svg
                          className="h-16 w-16 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        Selecciona una ubicación
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Haz clic en el mapa para comenzar a reportar una mascota
                        encontrada
                      </p>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
