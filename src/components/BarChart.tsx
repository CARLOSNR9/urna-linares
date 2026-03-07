"use client";

import { BarChart as BarChartRecharts, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { PartidoSenado, PARTIDOS_SENADO, PartidoCamara, PARTIDOS_CAMARA } from "@/lib/models";

const COLORS: Record<string, string> = {
    "Frente Amplio #1 - Gustavo Garcia": "#F97316", // Orange
    "Partido Conservador #12 - Liliana Benavides": "#0033A0",
    "Alianza Verde #13 - Eduardo Enriquez": "#00A859",
    "Pacto Histórico (Lista Cerrada)": "#8B1B62",
    "Voto en Blanco": "#E5E7EB",
    "Votos Nulos": "#9CA3AF", // Gray
    "Tarjetas No Marcadas": "#D1D5DB", // Light Gray

    // Camara Colors (Recycling some institutional ones)
    "Partido Verde #101 - Alejandra Abasolo": "#00A859",
    "Partido Conservador #101 - Juan Daniel Peñuela": "#0033A0",
    "Partido MIRA #105 - Jhon Rojas": "#38BDF8", // Light Blue
    "Cámara Afro #301 - Benildo": "#000000",   // Black
    "Pacto Histórico (Cámara)": "#8B1B62",
};

interface BarChartProps {
    data: { name: string; value: number }[];
    puestosUnicos: string[];
    selectedPuesto: string;
    onPuestoChange: (puesto: string) => void;
}

export function BarChart({ data, puestosUnicos, selectedPuesto, onPuestoChange }: BarChartProps) {
    // Sort data descending to show winner at top
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 h-[350px] flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide shrink-0">
                Votos por Candidato
            </h3>

            {puestosUnicos.length > 0 && (
                <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-2 shrink-0 px-1 border-b border-gray-50">
                    <button
                        onClick={() => onPuestoChange("Todos")}
                        className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-all ${selectedPuesto === 'Todos' ? 'bg-brand-blue text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Total Linares
                    </button>
                    {puestosUnicos.map((puesto) => (
                        <button
                            key={puesto}
                            onClick={() => onPuestoChange(puesto)}
                            className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-all ${selectedPuesto === puesto ? 'bg-brand-blue text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {puesto}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChartRecharts data={sortedData} layout="vertical" margin={{ top: 0, right: 50, left: 40, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={220} // Increased width for full names
                            tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500 }}
                            tickFormatter={(value) => value} // No truncation
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                            {sortedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                            ))}
                            <LabelList dataKey="value" position="right" fill="#6B7280" fontSize={12} fontWeight={600} />
                        </Bar>
                    </BarChartRecharts>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
