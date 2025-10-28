"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface EditLocationMapProps {
  initialPosition: { lat: number; lng: number };
  onLocationChange: (lat: number, lng: number) => void;
}

export default function EditLocationMap({
  initialPosition,
  onLocationChange,
}: EditLocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    const map = L.map("edit-location-map").setView(
      [initialPosition.lat, initialPosition.lng],
      15
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background: hsl(var(--primary));
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: 16px;
          ">📍</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker([initialPosition.lat, initialPosition.lng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    marker.on("dragend", () => {
      const position = marker.getLatLng();
      onLocationChange(position.lat, position.lng);
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [onLocationChange, initialPosition.lat, initialPosition.lng]);

  return (
    <div className="relative">
      <div
        id="edit-location-map"
        style={{ height: "300px", width: "100%" }}
        className="rounded-lg"
      />{" "}
      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs z-[1000]">
        <p className="font-medium mb-1">Cambiar ubicación:</p>
        <p className="text-muted-foreground">
          Haz clic en el mapa o arrastra el marcador
        </p>
      </div>
    </div>
  );
}
