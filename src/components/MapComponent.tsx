"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Mesa, PUESTOS_VOTACION } from "@/lib/models";

// Coordinates are approximate center of Linares Nariño for demonstration
// In a real scenario, we'd have precise GPS coords per "puesto"
const LINARES_CENTER: [number, number] = [1.3811, -77.5026];

// Mock locations for the Puestos around Linares
const PUESTOS_COORDS: Record<string, [number, number]> = {
    "Puesto Cabecera Municipal": [1.3811, -77.5026], // Center
    "San Francisco": [1.3900, -77.5100],
    "Bellavista": [1.3700, -77.4950],
    "Bella Florida": [1.3650, -77.5150],
    "Llano Grande": [1.3950, -77.4900],
    "Tabiles": [1.3850, -77.5200],
    "Tambillo de Bravos": [1.3750, -77.4850],
    "Motilón": [1.4000, -77.5050],
    "Laguna del Pueblo": [1.3600, -77.5000],
};

interface MapComponentProps {
    mesas: Mesa[];
}

export default function MapComponent({ mesas }: MapComponentProps) {
    // Fix Leaflet icon issue in Next.js
    useEffect(() => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
    }, []);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Mapa Electoral: Linares
            </h3>
            <div className="h-64 rounded-lg overflow-hidden border border-gray-200 z-0 relative">
                <MapContainer center={LINARES_CENTER} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {PUESTOS_VOTACION.map((puesto) => {
                        const coords = PUESTOS_COORDS[puesto.nombre];
                        if (!coords) return null;

                        // Calculate progress for this puesto
                        const mesasPuesto = mesas.filter((m) => m.puesto === puesto.nombre);
                        const reportadas = mesasPuesto.filter((m) => m.reportada).length;
                        const total = mesasPuesto.length;
                        const percentage = (reportadas / total) * 100;

                        // Color based on progress
                        let color = "#E5E7EB"; // Gray
                        let fillColor = "#9CA3AF";
                        if (percentage === 100) {
                            color = "#10B981"; // Green
                            fillColor = "#34D399";
                        } else if (percentage > 0) {
                            color = "#F59E0B"; // Yellow
                            fillColor = "#FBBF24";
                        } else {
                            color = "#EF4444"; // Red
                        }

                        return (
                            <CircleMarker
                                key={puesto.nombre}
                                center={coords}
                                radius={10 + (total * 1.5)} // Size proportional to mesas
                                pathOptions={{
                                    color,
                                    fillColor,
                                    fillOpacity: 0.7,
                                    weight: 2
                                }}
                            >
                                <Popup className="font-sans">
                                    <div className="p-1">
                                        <p className="font-bold text-sm text-gray-900 border-b pb-1 mb-1">{puesto.nombre}</p>
                                        <p className="text-xs text-gray-600">{puesto.direccion}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs font-medium">Mesas Reportadas:</span>
                                            <span className="text-sm font-bold ml-2 text-brand-blue">{reportadas}/{total}</span>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}
                </MapContainer>
            </div>
            <div className="flex justify-between items-center mt-3 text-[10px] text-gray-500 font-medium">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Pendiente</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Parcial</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Completo</div>
            </div>
        </div>
    );
}
