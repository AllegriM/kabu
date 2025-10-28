"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  const scrollToMap = () => {
    document
      .getElementById("map-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          >
            <Heart className="h-4 w-4 animate-pulse-soft" />
            Ayudemos a reunir familias
          </motion.div>

          <h1 className="mb-6 text-balance font-sans text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Encuentra y reporta{" "}
            <span className="text-primary">mascotas perdidas</span> en tu zona
          </h1>

          <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Una plataforma comunitaria para ayudar a mascotas perdidas a volver
            a casa. Reporta avistamientos en el mapa y ayuda a reunir familias.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={scrollToMap}
              className="group w-full gap-2 sm:w-auto"
            >
              <MapPin className="h-5 w-5 transition-transform group-hover:scale-110" />
              Reportar mascota encontrada
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 sm:w-auto bg-transparent"
            >
              <Link href={"/map"} className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar en el mapa
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 text-3xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">
                Mascotas reportadas
              </div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 text-3xl font-bold text-accent">89</div>
              <div className="text-sm text-muted-foreground">
                Reuniones exitosas
              </div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">
                Usuarios activos
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
