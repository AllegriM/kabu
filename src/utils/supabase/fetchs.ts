import { Comment, EstadoSighting, ReportData } from "@/lib/types";
import { createClient } from "./server";

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

export const getSightingsByPage = async (
  estado: EstadoSighting = "todos",
  filter?: string,
  page: number = 0
) => {
  // FILTROS
  const filtroEstados =
    estado === "todos"
      ? ["perdido", "encontrado", "transito"]
      : estado.split(",");

  const tipos = filter ? filter.split(",") : ["perro", "gato", "ave", "otros"];

  const supabase = await createClient();

  // Query de COUNT (contra la VISTA)
  const { count, error: countError } = await supabase
    .from("sightings_with_details") // <-- 1. USAR LA VISTA
    .select("*", { count: "exact", head: true })
    .in("estado", filtroEstados)
    .in("tipo", tipos);

  if (countError) {
    console.error("Error al obtener count:", countError);
  }

  const limit = 10;
  const rangeStart = page * limit;
  const rangeEnd = rangeStart + limit - 1;

  // Query de DATOS (contra la VISTA)
  const { data: sightings, error } = await supabase
    .from("sightings_with_details") // <-- 1. USAR LA VISTA
    .select(
      // <-- 2. SELECCIONAR CAMPOS DE LA VISTA
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
    .in("estado", filtroEstados)
    .in("tipo", tipos)
    .order("created_at", { ascending: false })
    .range(rangeStart, rangeEnd);

  const totalPages = count ? Math.max(Math.ceil(count / limit), 1) : 1;

  return { sightings, error, count: count ?? 0, totalPages };
};

export const getSightingByID = async (id: string) => {
  const supabase = await createClient();
  const { data: sighting, error } = await supabase
    .from("sightings_with_details") // <-- 1. USAR LA VISTA
    .select(
      // <-- 2. SELECCIONAR CAMPOS DE LA VISTA
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

export const getLastSightings = async () => {
  const supabase = await createClient();

  const { data: sightings, error } = await supabase
    .from("sightings_with_details") // <-- 1. USAR LA VISTA
    .select(
      // <-- 2. SELECCIONAR CAMPOS DE LA VISTA
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

export const getPublicationComments = async (id: string) => {
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("sighting_id", id);

  if (error) {
    console.error("Error en get comments:", error.message);
  }

  console.log(comments);
  // 'sightings' ahora tendrá la columna extra 'relevance'
  // que puedes usar para mostrar qué tan buena fue la coincidencia
  return { comments, error };
};
