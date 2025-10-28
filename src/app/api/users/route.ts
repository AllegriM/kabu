import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No logueado" }, { status: 401 });
    }

    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "El telefono es requerido" },
        { status: 400 }
      );
    }
    const { data, error } = await supabase
      .from("users")
      .update({ phone })
      .eq("id", user.id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error in /api/sightings:", err);
    return NextResponse.json(
      { error: err.message || "server error" },
      { status: 500 }
    );
  }
}
