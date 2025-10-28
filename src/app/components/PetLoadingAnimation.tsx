"use client";
import { motion } from "framer-motion";

export default function PetLoadingAnimation() {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-32 w-64">
          <motion.div
            className="absolute bottom-8 h-0.5 w-full bg-muted"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />

          <motion.div
            className="absolute bottom-8 text-6xl"
            animate={{
              x: [0, 200, 0],
              scaleX: [1, 1, -1, -1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              times: [0, 0.48, 0.5, 0.98, 1],
            }}
          >
            🐕
          </motion.div>

          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute bottom-6 text-2xl opacity-30"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0, 1, 1],
                x: i * 40,
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.15,
              }}
            >
              🐾
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.h2
            className="mb-2 text-2xl font-bold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Cargando mapa
          </motion.h2>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Preparando la búsqueda de mascotas...
          </motion.p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
