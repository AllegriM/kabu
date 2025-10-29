"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Map, MessageSquare, PawPrint, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Notification, SupabaseUserData } from "@/lib/types";
import { ModeToggle } from "./theme-toogle";
import { NotificationsDropdown } from "./NotificationsDropdown";
import NotificationButton from "./NotificationButton";

export function Header({
  user,
  notifications,
}: {
  user: SupabaseUserData;
  notifications: Notification[] | [];
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    const res = await fetch("/api/auth/signout", { method: "POST" });
    if (res.ok) {
      // opcional: invalidar cache, actualizar UI, redirigir
      if (res.ok) {
        window.location.href = "/";
      }
    } else {
      const body = await res.json();
      alert("Error al cerrar sesión: " + (body?.error ?? "unknown"));
    }
  };

  const handleSignIn = async () => {
    const res = await fetch("/api/auth/signin", { method: "POST" });
    if (res.ok) {
      router.push((await res.json()).url);
    } else {
      const body = await res.json();
      alert("Error al iniciar sesión: " + (body?.error ?? "unknown"));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Link href={"/"}>
            <span className="text-3xl font-bold text-foreground">Kábu</span>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/mascotas"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <PawPrint className="h-4 w-4" />
            Mascotas
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Map className="h-4 w-4" />
            Mapa
          </Link>
        </nav>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ModeToggle />
          {user.id ? (
            <>
              <NotificationsDropdown notifications={notifications} />
              <NotificationButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.user_metadata?.picture || ""}
                        alt={user.user_metadata?.name || ""}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.user_metadata?.name?.charAt(0).toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/chat"
                      className="flex items-center cursor-pointer"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Mensajes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href={"/me/publicaciones"}>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mis reportes</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/me/zonas-alerta"
                      className="flex items-center cursor-pointer"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Zonas de alerta</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={handleSignIn} className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
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
              Iniciar sesión
            </Button>
          )}
        </motion.div>
      </div>
    </header>
  );
}
