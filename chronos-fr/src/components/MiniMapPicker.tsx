import { useState, useEffect, useRef } from "react";
import {Button} from "@/components/ui/button.tsx";
import L from "leaflet";
import { IoSearch } from "react-icons/io5";
import "leaflet/dist/leaflet.css";

interface MiniMapPickerProps {
  value: string;                      // "lat,lng"
  onChange: (coords: string) => void; // "lat,lng"
}

export default function MiniMapPicker({ value, onChange }: MiniMapPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("mini-map", {
      center: [50.45, 30.52],
      zoom: 13,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const defaultCoords = parseValue(value);
    markerRef.current = L.marker(defaultCoords, { draggable: true }).addTo(map);

    markerRef.current.on("dragend", () => {
      const pos = markerRef.current!.getLatLng();
      onChange(`${pos.lat},${pos.lng}`);
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      markerRef.current!.setLatLng([lat, lng]);
      onChange(`${lat},${lng}`);
    });

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!markerRef.current || !mapRef.current) return;

    const coords = parseValue(value);
    markerRef.current.setLatLng(coords);
    mapRef.current.setView(coords);
  }, [value]);

  const handleSearch = async () => {
    if (!search.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      search
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.length) return;

    const { lat, lon } = data[0];
    const coords = [parseFloat(lat), parseFloat(lon)] as [number, number];

    markerRef.current!.setLatLng(coords);
    mapRef.current!.setView(coords, 15);

    onChange(`${coords[0]},${coords[1]}`);
  };

  const openInGoogleMaps = () => {
    const [lat, lng] = parseValue(value);
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Search address..."
        />
        <Button type="button" onClick={(e) => {
          e.stopPropagation();
          handleSearch()
        }} className="border px-3 rounded"><IoSearch /></Button>
      </div>

      <div id="mini-map" style={{ height: 300, borderRadius: 8 }} />

      <button
        onClick={openInGoogleMaps}
        className="mt-2 bg-blue-600 text-white py-2 rounded"
      >
        Open in Google Maps
      </button>
    </div>
  );
}

function parseValue(value: string): [number, number] {
  if (!value) return [50.45, 30.52];
  const [lat, lng] = value.split(",").map(Number);
  return [
    isFinite(lat) ? lat : 50.45,
    isFinite(lng) ? lng : 30.52,
  ];
}
