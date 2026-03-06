"use client";

import React, { useState } from "react";
import { Mesa } from "@/lib/models";
import { CheckCircle2, Circle } from "lucide-react";

interface TableMesasProps {
    mesas: Mesa[];
    activeTab: "senado" | "camara";
}

export function TableMesas({ mesas, activeTab }: TableMesasProps) {
    const [expandedMesa, setExpandedMesa] = useState<string | null>(null);

    const toggleRow = (id: string) => {
        setExpandedMesa(expandedMesa === id ? null : id);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Detalle por Puesto / Mesa
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 bg-gray-50/50">
                        <tr>
                            <th className="px-4 py-3 font-medium">Mesa</th>
                            <th className="px-4 py-3 font-medium">Puesto</th>
                            <th className="px-4 py-3 font-medium text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mesas.map((mesa) => (
                            <React.Fragment key={mesa.id}>
                                <tr
                                    onClick={() => mesa.reportada && toggleRow(mesa.id)}
                                    className={`transition-colors ${mesa.reportada ? 'cursor-pointer hover:bg-blue-50/50' : 'opacity-70'} ${expandedMesa === mesa.id ? 'bg-blue-50/30' : ''}`}
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-50">
                                        Mesa {mesa.numero}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">
                                        {mesa.puesto}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {mesa.reportada ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle2 size={14} />
                                                <span>Reportada</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                <Circle size={14} />
                                                <span>Pendiente</span>
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                {expandedMesa === mesa.id && mesa.reportada && (
                                    <tr className="bg-slate-50 border-b border-gray-200">
                                        <td colSpan={3} className="px-4 py-3">
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                    Resultados de la Mesa ({activeTab === 'senado' ? 'Senado' : 'Cámara'})
                                                </p>
                                                {Object.entries(activeTab === 'senado' ? mesa.votosSenado : (mesa.votosCamara || {}))
                                                    .sort((a, b) => Number(b[1]) - Number(a[1]))
                                                    .map(([partido, votos]) => (
                                                        <div key={partido} className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-600 truncate mr-2">{partido}</span>
                                                            <span className="font-semibold text-gray-900 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100 min-w-[32px] text-center">
                                                                {Number(votos).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
