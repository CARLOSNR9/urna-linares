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
}

export function BarChart({ data }: BarChartProps) {
    // Sort data descending to show winner at top
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 h-72">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Votos por Candidato
            </h3>
            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChartRecharts data={sortedData} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={160}
                            tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500 }}
                            tickFormatter={(value) => {
                                // Simple truncation for very long names if needed, though width=160 + left=40 should fit most
                                const limit = 28;
                                if (value.length > limit) return `${value.substring(0, limit)}...`;
                                return value;
                            }}
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
