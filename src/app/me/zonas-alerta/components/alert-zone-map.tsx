"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Check } from "lucide-react";
import { AlertZone } from "@/lib/types";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Polygon,
  CircleMarker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import type { GeoJsonObject } from "geojson";

interface AlertZoneMapProps {
  zones: AlertZone[];
  isCreating: boolean;
  onZoneCreated: (polygon: [number, number][], name: string) => void;
  onCancelCreate: () => void;
}

function ExistingZones({ zones }: { zones: AlertZone[] }) {
  return (
    <>
      {zones.map((zone) =>
        zone.zone ? (
          <GeoJSON
            key={zone.id}
            data={zone.zone as GeoJsonObject}
            style={{
              color: "#8b5cf6",
              fillColor: "#8b5cf6",
              fillOpacity: 0.2,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <strong>{zone.name}</strong>
                <br />
                Estado: Activa
              </div>
            </Popup>
          </GeoJSON>
        ) : null
      )}
    </>
  );
}

function CreationLayer({
  isCreating,
  currentPolygon,
  setCurrentPolygon,
}: {
  isCreating: boolean;
  currentPolygon: [number, number][];
  setCurrentPolygon: React.Dispatch<React.SetStateAction<[number, number][]>>;
}) {
  useMapEvents({
    click(e) {
      if (!isCreating) return;

      const { lat, lng } = e.latlng;
      const newPoint: [number, number] = [lat, lng];

      setCurrentPolygon((prevPolygon) => [...prevPolygon, newPoint]);
    },
  });

  return (
    <>
      {currentPolygon.map((point, idx) => (
        <CircleMarker
          key={idx}
          center={point}
          radius={6}
          fillColor="#f59e0b"
          color="#fff"
          weight={2}
          fillOpacity={1}
        />
      ))}

      {currentPolygon.length >= 2 && (
        <Polygon
          positions={currentPolygon}
          pathOptions={{
            color: "#f59e0b",
            fillColor: "#f59e0b",
            fillOpacity: 0.2,
            weight: 2,
          }}
        />
      )}
    </>
  );
}

export function AlertZoneMap({
  zones,
  isCreating,
  onZoneCreated,
  onCancelCreate,
}: AlertZoneMapProps) {
  const [currentPolygon, setCurrentPolygon] = useState<[number, number][]>([]);
  const [zoneName, setZoneName] = useState("");

  useEffect(() => {
    if (!isCreating) {
      handleCancelCreate(false);
    }
  }, [isCreating]);

  const handleSaveZone = () => {
    if (zoneName.trim() && currentPolygon.length >= 3) {
      onZoneCreated(currentPolygon, zoneName);
      handleCancelCreate(true);
    }
  };

  const handleCancelCreate = (notifyParent = true) => {
    setCurrentPolygon((prev) => (prev.length === 0 ? prev : []));
    setZoneName((prev) => (prev === "" ? prev : ""));

    if (notifyParent) {
      onCancelCreate();
    }
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[-34.6037, -58.3816]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ExistingZones zones={zones} />

        <CreationLayer
          isCreating={isCreating}
          currentPolygon={currentPolygon}
          setCurrentPolygon={setCurrentPolygon}
        />
      </MapContainer>

      {isCreating && (
        <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2">
          {currentPolygon.length < 3 ? (
            <div className="rounded-lg bg-background p-4 shadow-lg">
              <p className="mb-2 text-sm font-medium">
                Puntos dibujados: {currentPolygon.length}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelCreate(true)}
                className="w-full gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="rounded-lg bg-background p-4 shadow-lg">
              <Label
                htmlFor="zone-name"
                className="mb-2 block text-sm font-medium"
              >
                Nombre de la zona
              </Label>
              <Input
                id="zone-name"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="Ej: Mi barrio"
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveZone}
                  disabled={!zoneName.trim()}
                  className="flex-1 gap-2"
                >
                  <Check className="h-4 w-4" />
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCancelCreate(true)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
