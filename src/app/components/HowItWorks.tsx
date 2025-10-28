"use client";

import { motion } from "framer-motion";
import { MapPin, FileText, Bell, Heart } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Encuentra una mascota",
    description: "Ves una mascota perdida en tu zona y quieres ayudar",
  },
  {
    icon: FileText,
    title: "Reporta en el mapa",
    description:
      "Haz clic en el mapa y completa el formulario con los detalles",
  },
  {
    icon: Bell,
    title: "Notificamos a la comunidad",
    description: "Tu reporte se publica y los dueños pueden verlo",
  },
  {
    icon: Heart,
    title: "¡Reunión exitosa!",
    description: "Ayudas a una mascota a volver a casa con su familia",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-secondary/30 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Cómo funciona?
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Ayudar es fácil y rápido. Solo sigue estos pasos
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-8 hidden h-0.5 w-8 bg-border lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
