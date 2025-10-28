"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  message = "Cargando...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-16 h-8",
    md: "w-24 h-12",
    lg: "w-40 h-20",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const pawPrints = [
    { x: 0, y: 0, rotation: -15, delay: 0 },
    { x: 50, y: -45, rotation: 15, delay: 0.2 },
    { x: 0, y: -90, rotation: -15, delay: 0.4 },
    { x: 50, y: -125, rotation: 15, delay: 0.6 },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div
        className={`${sizeClasses[size]} relative flex items-center justify-between`}
      >
        {pawPrints.map((paw, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${paw.x}%`,
              top: `${paw.y}%`,
              transform: `rotate(${paw.rotation}deg)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.6,
              repeat: Number.POSITIVE_INFINITY,
              delay: paw.delay,
              ease: "easeInOut",
            }}
          >
            {/* Huella de perro SVG */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={
                size === "sm"
                  ? "w-8 h-8"
                  : size === "md"
                  ? "w-12 h-12"
                  : "w-16 h-16"
              }
            >
              {/* Almohadilla principal */}
              <ellipse
                cx="50"
                cy="60"
                rx="20"
                ry="25"
                className="fill-primary"
              />

              {/* Dedos */}
              <ellipse
                cx="30"
                cy="35"
                rx="10"
                ry="15"
                className="fill-primary"
              />
              <ellipse
                cx="45"
                cy="25"
                rx="10"
                ry="15"
                className="fill-primary"
              />
              <ellipse
                cx="60"
                cy="25"
                rx="10"
                ry="15"
                className="fill-primary"
              />
              <ellipse
                cx="75"
                cy="35"
                rx="10"
                ry="15"
                className="fill-primary"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      <motion.p
        className={`${textSizeClasses[size]} font-medium text-foreground`}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {message}
      </motion.p>
    </div>
  );
}

// Componente para pantalla completa
export function LoadingScreen({
  message = "Cargando...",
}: {
  message?: string;
}) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner message={message} size="lg" />
    </div>
  );
}
