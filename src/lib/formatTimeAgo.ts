// Helper para formatear la fecha
export function formatTimeAgo(dateString: string | null) {
  if (!dateString) return "";
  // (Aquí tu lógica de getTimeAgo)
  return new Date(dateString).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
