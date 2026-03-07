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

            <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3 px-1">
                    <span className="font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Censo Electoral (Aptos)</span>
                    <span className="font-bold text-gray-800 text-sm">8.624</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 bg-pink-50/70 border border-pink-100 text-pink-700 rounded-lg p-2 flex flex-col items-center justify-center transition-all hover:bg-pink-50">
                        <span className="font-medium text-[10px] uppercase tracking-wide mb-0.5">Mujeres👩</span>
                        <span className="font-bold text-sm">4.226</span>
                    </div>
                    <div className="flex-1 bg-blue-50/70 border border-blue-100 text-blue-700 rounded-lg p-2 flex flex-col items-center justify-center transition-all hover:bg-blue-50">
                        <span className="font-medium text-[10px] uppercase tracking-wide mb-0.5">Hombres👨</span>
                        <span className="font-bold text-sm">4.398</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
