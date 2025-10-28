"use client";
import { urlBase64ToUint8Array } from "@/lib/urlConversion";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotificationButton() {
  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subscribeUser = async () => {
    const supabase = createClient();

    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones");
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.error("Push messaging is not supported");
      return;
    }

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registrado");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Permiso de notificación denegado");
        return;
      }
      setIsSubscribed(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });

      console.log("PushSubscription obtenida:", subscription);

      const { data: userResponse } = await supabase.auth.getUser();
      if (!userResponse.user) {
        console.error("Usuario no autenticado");
        return;
      }

      const { error } = await supabase.from("push_subscriptions").insert({
        user_id: userResponse.user.id,
        subscription: subscription,
      });

      if (error) {
        console.error("Error guardando suscripción:", error);
      } else {
        console.log("Suscripción guardada en Supabase");
      }
    } catch (error) {
      console.error("Error al suscribir:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const successful = await subscription.unsubscribe();

        if (successful) {
          console.log("Desuscripción del navegador exitosa.");

          const { error: dbError } = await supabase
            .from("push_subscriptions")
            .delete()
            .eq("subscription->>endpoint", subscription.endpoint);

          if (dbError) {
            console.error(
              "Error al eliminar la suscripción de Supabase:",
              dbError
            );
          } else {
            console.log("Suscripción eliminada de Supabase.");
          }

          setIsSubscribed(false);
        } else {
          console.error("Fallo al desuscribir del navegador.");
        }
      } else {
        console.log("No se encontró ninguna suscripción para eliminar.");
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Error durante la desuscripción:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return;
    }

    if (Notification.permission !== "granted") {
      setIsSubscribed(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error("Error al chequear suscripción:", error);
      setIsSubscribed(false);
    }
  };

  const handleClick = () => {
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return (
    <div
      className={`${
        isSubscribed && "border-amber-500"
      } relative flex items-center gap-2 border rounded-xl transition-all`}
    >
      <Button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`relative h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{
          backgroundColor: isSubscribed
            ? "hsl(var(--primary))"
            : "hsl(var(--muted))",
        }}
        aria-label={
          isSubscribed ? "Desactivar notificaciones" : "Activar notificaciones"
        }
      >
        <motion.div
          className="absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-md"
          animate={{
            x: isSubscribed ? 15 : -15,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          ) : isSubscribed ? (
            <Bell className="h-3.5 w-3.5 text-amber-500" />
          ) : (
            <BellOff className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </motion.div>
      </Button>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-lg"
          >
            Notificaciones activadas
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
