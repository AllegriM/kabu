"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Get_Own_Sighting } from "@/lib/types";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import React, { ReactElement } from "react";
import noImage from "@/images/no-image-pet.png";

interface PetCardProps {
  pet: Get_Own_Sighting;
  children?: ReactElement;
}

export default function PetCard({ pet, children }: PetCardProps) {
  const formatDate = new Date(pet.created_at).toLocaleString();

  return (
    <motion.div
      key={pet.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      //   transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="h-full group overflow-hidden transition-all hover:shadow-lg">
        <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20">
          <Image
            width={400}
            height={200}
            src={noImage}
            alt={pet.descripcion}
            className="h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
          />
        </div>
        <CardContent className="p-6">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {pet.tipo.toLocaleUpperCase()} - {pet.raza}
              </h3>
              <p className="text-sm text-muted-foreground">{pet.color}</p>
            </div>
            <Badge
              variant={
                pet.estado === "perdido"
                  ? "destructive"
                  : pet.estado === "encontrado"
                  ? "default"
                  : "secondary"
              }
            >
              {pet.estado.toUpperCase()}
            </Badge>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {pet.descripcion}
          </p>

          <div className="mb-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {pet.location_geojson.coordinates || "N/A"}
              </span>
            </div>
            <div
              className="flex items-center gap-2 text-muted-foreground"
              suppressHydrationWarning
            >
              <Clock className="h-4 w-4 flex-shrink-0" />
              {formatDate}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{pet.user_nombre}</span>
            </div>
            {/* <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{pet.user_phone}</span>
            </div> */}
          </div>

          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
