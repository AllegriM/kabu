import { Get_Own_Sighting } from "@/lib/types";
import Link from "next/link";
import { JSX } from "react";

export function PopUpContent({
  s,
  tipoEmoji,
  estadoBadge,
}: {
  s: Get_Own_Sighting;
  tipoEmoji: string;
  estadoBadge: JSX.Element;
}) {
  return (
    <div
      style={{
        minWidth: 250,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 24 }}>{tipoEmoji}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "#1f2937",
              textTransform: "capitalize",
            }}
          >
            {s.tipo} {s.estado}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>
            {new Date(s.created_at).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        {estadoBadge}
      </div>

      {/* Detalles */}
      <div
        style={{
          background: "#f9fafb",
          padding: 8,
          borderRadius: 6,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#374151",
            marginBottom: 4,
          }}
        >
          <strong>Raza:</strong> {s.raza}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#374151",
            marginBottom: 4,
          }}
        >
          <strong>Color:</strong> {s.color}
        </div>
        <div style={{ fontSize: 12, color: "#374151" }}>
          <strong>Reportado por:</strong> {s.user_nombre}
        </div>
      </div>

      {/* Descripción */}
      {s.descripcion && (
        <div
          style={{
            fontSize: 12,
            color: "#4b5563",
            marginBottom: 10,
            lineHeight: 1.4,
          }}
        >
          {s.descripcion}
        </div>
      )}

      {/* Botón */}
      <Link
        href={`/publicacion/${s.id}`}
        style={{
          display: "block",
          textAlign: "center",
          background: "#7c3aed",
          color: "white",
          padding: "8px 12px",
          borderRadius: 6,
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Ver detalles completos →
      </Link>
    </div>
  );
}
