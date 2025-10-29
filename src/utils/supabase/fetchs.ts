import {
  Comment,
  EstadoSighting,
  Get_Own_Sighting,
  PetType,
  ReportData,
  SightingWithCount,
} from "@/lib/types";
import { createClient } from "./server";
import { PostgrestError } from "@supabase/supabase-js";

export const createReport = async (reportData: ReportData) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sightings")
    .insert([reportData])
    .select();

  return { data, error };
};

export const isLogin = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const supabase = await createClient();
  return supabase.auth.signOut();
};

export const getUserSightings = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: sightings, error } = await supabase
    .from("sightings_with_details")
    .select(
      ` id,
        descripcion,
        foto_url,
        created_at,
        expires_at,
        tipo,
        raza,
        color,
        estado,
        location_geojson,
        created_by,
        user_nombre,
        user_phone
      `
    )
    .eq("created_by", user?.id);
  return { sightings, error };
};

export const getSightings = async (
  estado: EstadoSighting = "todos",
  filter?: string
) => {
  const filtroEstados =
    estado === "todos"
      ? ["perdido", "encontrado", "transito"]
      : estado.split(",");
  const tipos = filter ? filter.split(",") : ["perro", "gato", "ave", "otros"];

  const supabase = await createClient();
  const { data: sightings, error } = await supabase.rpc("get_all_sightings", {
    estados: filtroEstados,
    tipos: tipos,
  });

  return { sightings, error };
};

export const getSightingByID = async (id: string) => {
  const supabase = await createClient();
  const { data: sighting, error } = await supabase
    .from("sightings_with_details")
    .select(
      ` id,
        descripcion,
        foto_url,
        created_at,
        expires_at,
        created_by,
        tipo,
        raza,
        color,
        estado,
        location_geojson,
        user_nombre,
        user_phone
      `
    )
    .eq("id", id)
    .single();

  return { sighting, error };
};

export const getSightingsByPage = async (
  estado: EstadoSighting = "todos",
  tipo: PetType = "todos",
  query: string = "",
  page: number = 0,
  limit: number = 10
): Promise<{
  sightings: Get_Own_Sighting[];
  count: number;
  totalPages: number;
  error: PostgrestError | null;
}> => {
  const supabase = await createClient();

  const filtroEstados =
    estado === "todos"
      ? ["perdido", "encontrado", "transito"]
      : estado.split(",");

  const filtroTipos =
    tipo === "todos" ? ["perro", "gato", "ave", "otros"] : tipo.split(",");

  const { data, error } = await supabase.rpc("get_sightings_paginated", {
    p_estados: filtroEstados,
    p_tipos: filtroTipos,
    p_query_text: query || null,
    p_page: page,
    p_limit: limit,
  });

  if (error) {
    console.error("Error en RPC get_sightings_paginated:", error);
    return { sightings: [], count: 0, totalPages: 1, error };
  }

  const results = (data as SightingWithCount[]) || [];
  const totalCount = results.length > 0 ? results[0].total_count : 0;
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  const sightings = results.map(({ total_count, ...rest }) => rest);

  return {
    sightings,
    count: totalCount,
    totalPages: totalPages,
    error: null,
  };
};

export const getLastSightings = async () => {
  const supabase = await createClient();

  const { data: sightings, error } = await supabase
    .from("sightings_with_details")
    .select(
      ` id,
        descripcion,
        foto_url,
        created_at,
        expires_at,
        created_by,
        tipo,
        raza,
        color,
        estado,
        location_geojson,
        user_nombre,
        user_phone
      `
    )
    .order("created_at", { ascending: false })
    .limit(3);
  return { sightings, error };
};

export const getOwnZones = async () => {
  // 1. Asumo que createClient() es tu cliente de browser (client.ts)
  const supabase = await createClient();

  // 2. Ya no necesitas .from().select()...
  //    Simplemente llama a la nueva función RPC.
  const { data: zones, error } = await supabase.rpc("get_my_alert_zones");

  if (error) {
    console.error("Error en getOwnZones RPC:", error.message);
  }

  // 3. El RPC devolverá null si hay error, o un array (vacío o lleno)
  if (!zones) return { zones: [], error };

  return { zones, error };
};

export const getZoneNotifications = async () => {
  const supabase = await createClient();

  // GET USER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error("No hay un usuario valido") };
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error:", error.message);
  }

  if (!data) return { data: [], error };

  return { data, error };
};

export const searchSightings = async (
  query: string,
  userLat: number, // Latitud del usuario o centro del mapa
  userLong: number // Longitud del usuario o centro del mapa
) => {
  const supabase = await createClient();

  const { data: sightings, error } = await supabase.rpc(
    "search_sightings_advanced",
    {
      query_text: query,
      lat: userLat,
      long: userLong,
    }
  );

  if (error) {
    console.error("Error en searchSightings:", error.message);
  }

  // 'sightings' ahora tendrá la columna extra 'relevance'
  // que puedes usar para mostrar qué tan buena fue la coincidencia
  return { sightings, error };
};

export const getPublicationComments = async (
  id: string
): Promise<{ comments: Comment[]; error: PostgrestError | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*, user:users(id, nombre, avatar_url)")
    .eq("sighting_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error.message);
    return { comments: [], error };
  }

  const comments = (data as Comment[] | null) ?? [];

  return { comments, error: null };
};
