"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface LoginPromptProps {
  onClose: () => void;
}

export function LoginPrompt({ onClose }: LoginPromptProps) {
  const supabase = createClient();
  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
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
        <CardTitle>Inicia sesión para continuar</CardTitle>
        <CardDescription>
          Necesitas una cuenta para reportar mascotas encontradas
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-full bg-primary/10 p-8"
        >
          <svg
            className="h-20 w-20 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </motion.div>

        <div className="space-y-3 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            ¿Por qué necesito iniciar sesión?
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">✓</span>
              <span className="text-left">
                Verificamos que los reportes sean de personas reales
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">✓</span>
              <span className="text-left">
                Podrás gestionar tus reportes y recibir notificaciones
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">✓</span>
              <span className="text-left">
                Ayudamos a mantener la comunidad segura y confiable
              </span>
            </li>
          </ul>
        </div>

        <Button onClick={handleGoogleSignIn} size="lg" className="w-full gap-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar con Google
        </Button>

        <p className="text-xs text-muted-foreground">
          Al continuar, aceptas nuestros términos de servicio y política de
          privacidad
        </p>
      </CardContent>
    </Card>
  );
}
