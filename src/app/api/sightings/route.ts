// app/api/sightings/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function prefixKeysWithP(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const plainKey = key.startsWith("p_") ? key.slice(2) : key;
      return [`p_${plainKey}`, value];
    })
  );
}

function sanitizePayloadForRPC(prefixed: Record<string, any>) {
  const allowed = new Set([
    "p_lat",
    "p_lng",
    "p_descripcion",
    "p_foto_url",
    "p_tipo",
    "p_raza",
    "p_color",
    "p_estado",
    "p_expires_at",
    "p_location",
    "p_user",
    "p_limit",
    "p_window",
  ]);

  const out: Record<string, any> = {};

  for (const [k, v] of Object.entries(prefixed)) {
    if (!allowed.has(k)) continue;

    if (k === "p_expires_at" && v != null) {
      const d = v instanceof Date ? v : new Date(v);
      if (!isNaN(d.getTime())) out[k] = d.toISOString();
    } else if ((k === "p_lat" || k === "p_lng") && v != null) {
      const n = Number(v);
      out[k] = Number.isFinite(n) ? n : v;
    } else if (v !== undefined && v !== null && v !== "") {
      out[k] = v;
    } else if (
      v !== undefined &&
      (k === "p_foto_url" || k === "p_descripcion")
    ) {
      out[k] = v ?? "";
    }
  }

  return out;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body)
      return NextResponse.json({ error: "body vacío" }, { status: 400 });

    const latRaw = body.lat ?? body.p_lat;
    const lngRaw = body.lng ?? body.p_lng;
    if (latRaw == null || lngRaw == null) {
      return NextResponse.json(
        { error: "lat y lng son requeridos" },
        { status: 400 }
      );
    }

    const prefixed = prefixKeysWithP({ ...body, lat: latRaw, lng: lngRaw });

    const payload = sanitizePayloadForRPC(prefixed);

    const supabase = await createClient();
    const { data, error } = await supabase.rpc(
      "insert_sighting_if_allowed",
      payload
    );
    console.log(data, error, prefixed);

    if (error) {
      console.error("RPC error", error);
      return NextResponse.json({ ok: false, error }, { status: 500 });
    }

    return NextResponse.json({ ok: data.ok, data }, { status: 200 });
  } catch (err: any) {
    console.error("POST error", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
