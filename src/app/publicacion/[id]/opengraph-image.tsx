import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";

export const alt = "Ver reporte de mascota";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Función principal que genera la imagen
export default async function Image({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: sighting, error } = await supabase
    .from("sightings_with_details")
    .select(
      "foto_url, tipo, raza, color, estado, user_nombre, location_geojson"
    )
    .eq("id", params.id)
    .single();

  if (error || !sighting) {
    notFound();
  }

  // 2. OBTENER FUENTES
  const interRegular = await fetch(
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FfA9iE8KqYqsS-i-Q.ttf"
  ).then((res) => res.arrayBuffer());

  const interBold = await fetch(
    "https://fonts.gstatic.com/s/inter/v13/UcC73FfX3jEjsIg98K-1kQ.ttf"
  ).then((res) => res.arrayBuffer());

  // Lógica para el color y título
  const isPerdido = sighting.estado === "perdido";
  const title = isPerdido ? "SE BUSCA" : "ENCONTRADO";
  const borderColor = isPerdido ? "#ef4444" : "#22c55e";

  // 3. RENDERIZAR JSX
  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: '"Inter"',
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9fafb",
        }}
      >
        {/* Contenedor principal con borde de color */}
        <div
          style={{
            display: "flex",
            flex: 1,
            margin: 30,
            border: `15px solid ${borderColor}`,
            borderRadius: 20,
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          {/* Columna de la Imagen */}
          <div style={{ width: "55%", display: "flex" }}>
            <img
              src={sighting.foto_url}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Columna de Texto */}
          <div
            style={{
              width: "45%",
              display: "flex",
              flexDirection: "column",
              padding: "30px 40px",
            }}
          >
            {/* Título: SE BUSCA / ENCONTRADO */}
            <h1
              style={{
                fontSize: 90,
                fontWeight: 700,
                color: borderColor,
                lineHeight: 1,
                margin: 0,
              }}
            >
              {title}
            </h1>

            {/* Tipo de mascota (Perro / Gato) */}
            <p
              style={{
                fontSize: 50,
                textTransform: "capitalize",
                margin: 0,
                marginTop: 10,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {sighting.tipo}
            </p>

            {/* Detalles (Raza, Color) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 30,
                fontSize: 28,
                color: "#374151",
              }}
            >
              <div style={{ display: "flex", marginBottom: 10 }}>
                <span style={{ fontWeight: 700, width: 100 }}>Raza:</span>
                <span style={{ textTransform: "capitalize" }}>
                  {sighting.raza}
                </span>
              </div>
              <div style={{ display: "flex" }}>
                <span style={{ fontWeight: 700, width: 100 }}>Color:</span>
                <span style={{ textTransform: "capitalize" }}>
                  {sighting.color}
                </span>
              </div>
            </div>

            {/* Ubicación (Mock, idealmente harías geocoding inverso) */}
            <p style={{ marginTop: 30, fontSize: 28, color: "#374151" }}>
              <strong>Visto en:</strong> San Isidro (Ejemplo)
            </p>

            {/* Footer con el logo/nombre de tu app */}
            <p
              style={{
                marginTop: "auto",
                fontSize: 24,
                fontWeight: 700,
                color: "#6d28d9", // Color de tu app
              }}
            >
              BuscaPet.app
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
