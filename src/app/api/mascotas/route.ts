// app/api/mascotas/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "El ID es requerido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("sightings")
      .delete()
      .eq("id", body.id);

    if (error) {
      console.error("Supabase [DELETE] error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: unknown) {
    console.error("Unexpected error in /api/mascotas:", err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const {
      id,
      lat,
      lng,
      descripcion,
      foto_url,
      created_at,
      expires_at,
      tipo,
      raza,
      color,
      estado,
    } = await req.json();

    // --- Validación de Entradas ---
    if (!id) {
      return NextResponse.json(
        { error: "El ID es requerido" },
        { status: 400 }
      );
    }
    if (lat == null || lng == null) {
      return NextResponse.json(
        { error: "Latitud y Longitud son requeridas" },
        { status: 400 }
      );
    }

    // --- Llamada a Supabase  ---
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("update_sighting", {
      p_id: id,
      p_lat: lat,
      p_lng: lng,
      p_descripcion: descripcion,
      p_foto_url: foto_url,
      p_created_at: created_at,
      p_expires_at: expires_at,
      p_tipo: tipo,
      p_raza: raza,
      p_color: color,
      p_estado: estado,
    });

    if (error) {
      console.error("Supabase [PUT/RPC] error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ? data[0] : null }, { status: 200 });
  } catch (err: unknown) {
    console.error("Unexpected error in /api/mascotas:", err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
