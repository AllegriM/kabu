"use client";
import { Sighting } from "@/lib/types";
import L from "leaflet";
import { MapContainer, TileLayer, Tooltip, Marker, Popup } from "react-leaflet";
import { PopUpContent } from "./PopUpContent";

const DogIcon = new L.DivIcon({
  html: '<div style="background-color: red; width: 30px; height: 30px; border-radius: 50%;"><div style="padding-left: 7px; padding-top: 6px;">🐶</div></div>',
  className: "my-custom-div-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
const CatIcon = new L.DivIcon({
  html: '<div style="background-color: red; width: 30px; height: 30px; border-radius: 50%;"><div style="padding-left: 7px; padding-top: 6px;">🐱</div></div>',
  className: "my-custom-div-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
const BirdIcon = new L.DivIcon({
  html: '<div style="background-color: red; width: 30px; height: 30px; border-radius: 50%;"><div style="padding-left: 7px; padding-top: 6px;">🐦</div></div>',
  className: "my-custom-div-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
const NoIcon = new L.DivIcon({
  html: '<div style="background-color: red; width: 30px; height: 30px; border-radius: 50%;"><div style="padding-left: 7px; padding-top: 6px;">❓</div></div>',
  className: "my-custom-div-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function Map({
  sightings,
  searchParams,
}: {
  sightings: Sighting[];
  searchParams?: number[];
}) {
  const center: [number, number] =
    Array.isArray(searchParams) && searchParams.length >= 2
      ? [searchParams[0], searchParams[1]]
      : [-34.6037, -58.3816];

  return (
    <MapContainer
      className="z-40"
      style={{ height: "100%", width: "100%" }}
      zoom={13}
      center={center}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Tooltip />
      {sightings.map((s) => {
        const icon =
          s.tipo === "perro"
            ? DogIcon
            : s.tipo === "gato"
            ? CatIcon
            : s.tipo === "ave"
            ? BirdIcon
            : NoIcon;

        if (!s.location_geojson || !s.location_geojson.coordinates) {
          return null;
        }

        const estadoBadge =
          s.estado === "perdido" ? (
            <span
              style={{
                background: "#ef4444",
                color: "white",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              PERDIDO
            </span>
          ) : (
            <span
              style={{
                background: "#10b981",
                color: "white",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              ENCONTRADO
            </span>
          );

        const tipoEmoji =
          s.tipo === "perro"
            ? "🐕"
            : s.tipo === "gato"
            ? "🐈"
            : s.tipo === "ave"
            ? "🦜"
            : "🐾";

        const [lng, lat] = s.location_geojson.coordinates;
        const position: [number, number] = [lat, lng];

        return (
          <Marker key={s.id} position={position} icon={icon}>
            <Popup>
              <PopUpContent
                s={s}
                estadoBadge={estadoBadge}
                tipoEmoji={tipoEmoji}
              />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
