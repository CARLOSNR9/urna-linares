"use client";

import { PieChart as PieChartRecharts, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PieChartProps {
    participacion: number;
}

export function PieChart({ participacion }: PieChartProps) {
    const data = [
        { name: "Votaron", value: participacion },
        { name: "Faltan", value: 100 - participacion },
    ];

    const COLORS = ["#1D5B96", "#E5E7EB"];

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide w-full text-left">
                Participación Estimada
            </h3>
            <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChartRecharts>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number | string | undefined) => `${value}%`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </PieChartRecharts>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-2xl font-bold text-brand-blue">{participacion}%</span>
                </div>
            </div>
        </div>
    );
}
