"use client";
// src/components/Map.tsx
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useEffect } from "react";

function ClickCapture({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Recenter({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center?.[0], center?.[1], zoom, map]);
  return null;
}

export default function MyMap(props: {
  selectedPosition?: [number, number];
  initialPosition: [number, number];
  zoom: number;
  onMapClick?: (lat: number, lng: number) => void;
  userPosition?: number[] | undefined;
}) {
  const { selectedPosition, initialPosition, zoom, onMapClick } = props;

  // ancho/alto responsivo
  const style = { height: "600px", width: "100%", zIndex: 20 };
  return (
    <MapContainer
      center={initialPosition}
      zoom={zoom}
      style={style}
      scrollWheelZoom={true}
    >
      {/* Recenter se ocupa de mover la vista cuando initialPosition cambie */}
      <Recenter center={initialPosition as [number, number]} zoom={zoom} />

      <ClickCapture
        onClick={(lat, lng) => onMapClick && onMapClick(lat, lng)}
      />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcador de la ubicacion seleccionada (si existe) */}
      {selectedPosition && (
        <Marker position={selectedPosition}>
          <Popup>Ubicación seleccionada</Popup>
          <Tooltip>Seleccionado</Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
}
