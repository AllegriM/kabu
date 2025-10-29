import { Comment, Create_Comment } from "@/lib/types";
import { createClient } from "./client";

export const createOwnZone = async (
  currentPolygon: [number, number][],
  zoneName: string
) => {
  const supabase = createClient();

  const geoJsonCoords = currentPolygon.map((point) => [point[1], point[0]]);

  if (geoJsonCoords.length > 2) {
    geoJsonCoords.push(geoJsonCoords[0]);
  } else {
    return { data: null, error: new Error("Polígono no válido") };
  }

  const geoJsonObject = {
    type: "Polygon",
    coordinates: [geoJsonCoords],
  };

  const { data, error } = await supabase.rpc("create_alert_zone", {
    p_name: zoneName,
    p_zone_geojson: geoJsonObject,
  });

  if (error) {
    console.error("Error llamando a RPC:", error.message);
  }

  return { data, error };
};

export const deleteOwnZone = async (id_zone: string) => {
  const supabase = createClient();

  if (!id_zone) {
    return { data: null, error: new Error("ID no válido") };
  }

  const { data, error } = await supabase
    .from("alert_zones")
    .delete()
    .eq("id", id_zone);

  if (error) {
    console.error("Error llamando a RPC:", error.message);
  }

  return { data, error };
};

export const viewNotification = async (id: number) => {
  const supabase = createClient();

  // GET USER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error("No hay un usuario valido") };
  }

  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error:", error.message);
  }

  if (!data) return { data: [], error };
  return { data, error };
};

export const viewNotifications = async (notifications: Notification[]) => {
  const supabase = createClient();

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

export const createPublicationComment = async (comment: Create_Comment) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("comments")
    .insert([comment])
    .select();

  if (error) {
    console.error("Error en get comments:", error.message);
  }

  return { data, error };
};
