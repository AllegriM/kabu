import React from "react";
import { MapSection } from "./MapSection";
import { createClient } from "@/utils/supabase/server";
import { isLogin } from "@/utils/supabase/fetchs";

export default async function MapSectionServer() {
  const supabase = await createClient();

  const user = await isLogin();

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  return <MapSection user={user} userData={userData} />;
}
