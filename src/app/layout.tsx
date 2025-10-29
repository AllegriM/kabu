import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "./components/SessionAuth";
import { createClient } from "@/utils/supabase/server";
import { Header } from "./components/Header";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseUserData } from "@/lib/types";
import { ThemeProvider } from "./components/theme-provider";
import { getZoneNotifications } from "@/utils/supabase/fetchs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mascotas Perdidas",
  description: "Encuentra y reporta mascotas perdidas en tu comunidad",
  icons: {
    icon: "/favicon.webp",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await getZoneNotifications();

  const plainUser: SupabaseUserData = {
    id: user?.id,
    app_metadata: user?.app_metadata,
    email: user?.email,
    user_metadata: user?.user_metadata,
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
            <AuthProvider user={plainUser || null}>
              <Header user={plainUser} notifications={data || []} />
              {children}
            </AuthProvider>
            <Toaster />
          </Suspense>{" "}
        </ThemeProvider>
      </body>
    </html>
  );
}
