import { UserAppMetadata, UserMetadata } from "@supabase/supabase-js";
import { GeoJsonObject } from "geojson";

export type PetType = "todos" | "perro" | "gato" | "ave" | "otros";

export interface Update_Sighting {
  id: string;
  lat: number;
  lng: number;
  descripcion: string;
  foto_url: string;
  created_at: Date;
  expires_at: Date;
  created_by: string;
  tipo: PetType;
  raza: string;
  color: string;
  estado: EstadoSighting;
}

export interface Get_Own_Sighting extends Sighting {
  user_nombre: string;
  user_phone: string;
}

export type SightingWithCount = Get_Own_Sighting & { total_count: number };

export type EstadoSighting = "todos" | "perdido" | "encontrado" | "transito";

export interface Sighting {
  id: string;
  descripcion: string;
  foto_url: string;
  created_at: Date;
  expires_at: Date;
  created_by: string;
  tipo: PetType;
  raza: string;
  color: string;
  estado: EstadoSighting;
  location_geojson: { type: "Point"; coordinates: [number, number] };
}

export interface ReportData {
  lat: number;
  lng: number;
  descripcion: string;
  foto_url?: string;
  created_at?: Date;
  expires_at?: Date;
  created_by?: string;
  tipo: PetType;
  raza: string;
  color: string;
  estado: EstadoSighting;
}

export interface UserData {
  id: string;
  phone: number | null;
  nombre: string;
  created_at: Date;
}

export interface SupabaseUserData {
  id?: string;
  email?: string | null;
  app_metadata?: UserAppMetadata;
  user_metadata?: UserMetadata;
}

export interface AlertZone {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  zone: GeoJsonObject | null;
}

export interface Notification {
  id: number;
  user_id: string;
  sighting_id: string;
  type: string;
  body: string;
  link_url: string;
  is_read: boolean;
  created_at: string;
}

export interface Create_Comment {
  user_id: string;
  sighting_id: string;
  parent_id: number | null;
  body: string;
}

export interface Comment {
  id: number;
  user_id: string;
  sighting_id: string;
  parent_id: number | null;
  body: string;
  created_at: string;
}
