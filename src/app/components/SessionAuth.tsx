"use client";
import { SupabaseUserData } from "@/lib/types";
import { createContext, useContext, ReactNode } from "react";

const AuthContext = createContext<{ user: SupabaseUserData | null }>({
  user: null,
});

export const AuthProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: SupabaseUserData;
}) => {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
