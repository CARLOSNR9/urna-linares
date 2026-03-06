"use client";

import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { BarChart } from "@/components/BarChart";
import { PieChart } from "@/components/PieChart";
import { TableMesas } from "@/components/TableMesas";
import { PartidoSenado, PARTIDOS_SENADO, PartidoCamara, PARTIDOS_CAMARA } from "@/lib/models";
import dynamic from "next/dynamic";
import { Clock } from "lucide-react";

// Dynamically import map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function DashboardPage() {
  const { mesas, loading } = useSupabase();
  const [timeAgoString, setTimeAgoString] = useState<string>("Buscando actualizaciones...");
  const [activeTab, setActiveTab] = useState<"senado" | "camara">("senado");

  // Update logic for the "Time Ago" string based on the latest mesa report
  useEffect(() => {
    const updateTimer = () => {
      let latestTime = 0;
      
      // Find the absolute latest updated_at from all reported mesas
      mesas.forEach((mesa) => {
        if (mesa.reportada && mesa.updated_at) {
          const time = new Date(mesa.updated_at).getTime();
          if (time > latestTime) {
            latestTime = time;
          }
        }
      });

      if (latestTime === 0) {
        setTimeAgoString("Esperando reportes...");
        return;
      }

      const now = new Date();
      // Calculate diff between NOW and the latest update across all mesas
      const diffInSeconds = Math.floor((now.getTime() - latestTime) / 1000);

      // We add a safety check (max 0) in case client time slightly drifts before server time
      const diff = Math.max(0, diffInSeconds);

      if (diff < 60) {
        setTimeAgoString("Actualizado Ahora");
      } else if (diff < 120) {
        setTimeAgoString("Hace 1 minuto");
      } else {
        const minutes = Math.floor(diff / 60);
        setTimeAgoString(`Hace ${minutes} minutos`);
      }
    };

    // Run right away
    updateTimer();
    
    // Update the string exactly every 10 seconds (no need to spin every 1 second)
    const interval = setInterval(updateTimer, 10000); 

    return () => clearInterval(interval);
  }, [mesas]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-light text-brand-blue">Cargando Sistema...</div>;
  }

  // Calculate global metrics
  const totalMesas = mesas.length;
  const mesasReportadas = mesas.filter((m) => m.reportada).length;

  // Aggregate votes
  const totalVotosPorSenado = PARTIDOS_SENADO.reduce((acc, curr) => {
    acc[curr] = 0;
    return acc;
  }, {} as Record<PartidoSenado, number>);

  const totalVotosPorCamara = PARTIDOS_CAMARA.reduce((acc, curr) => {
    acc[curr] = 0;
    return acc;
  }, {} as Record<PartidoCamara, number>);

  let totalVotosEscrutadosSenado = 0;
  let totalVotosEscrutadosCamara = 0;

  mesas.forEach((mesa) => {
    if (mesa.reportada) {
      if (mesa.votosSenado) {
        Object.entries(mesa.votosSenado).forEach(([partido, votos]) => {
          const v = Number(votos) || 0;
          totalVotosPorSenado[partido as PartidoSenado] += v;
          totalVotosEscrutadosSenado += v;
        });
      }
      if (mesa.votosCamara) {
        Object.entries(mesa.votosCamara).forEach(([partido, votos]) => {
          const v = Number(votos) || 0;
          totalVotosPorCamara[partido as PartidoCamara] += v;
          totalVotosEscrutadosCamara += v;
        });
      }
    }
  });

  const chartDataSenado = Object.entries(totalVotosPorSenado)
    .map(([name, value]) => ({
      name: name as PartidoSenado,
      value,
    }))
    .filter(party => party.value > 0);

  const chartDataCamara = Object.entries(totalVotosPorCamara)
    .map(([name, value]) => ({
      name: name as PartidoCamara,
      value,
    }))
    .filter(party => party.value > 0);

  // Estimate a mock total base to calculate participation.
  const potencialElectores = 8000;

  const participacionSenado = totalVotosEscrutadosSenado > 0
    ? Math.min(100, Math.round((totalVotosEscrutadosSenado / potencialElectores) * 100))
    : 0;

  const participacionCamara = totalVotosEscrutadosCamara > 0
    ? Math.min(100, Math.round((totalVotosEscrutadosCamara / potencialElectores) * 100))
    : 0;

  return (
    <main>
      <Header />

      <div className="container mx-auto p-4 max-w-lg pb-10">
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Resultados Electorales
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-medium text-brand-blue bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
            <Clock size={12} />
            <span>{timeAgoString}</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("senado")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'senado' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Senado
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("camara")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'camara' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Cámara de Rep.
          </button>
        </div>

        {/* Módulo Progress */}
        <ProgressBar total={totalMesas} current={mesasReportadas} />

        {/* Total Votes Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Total Votos {activeTab === "senado" ? "Senado" : "Cámara"}
            </p>
            <p className="text-3xl font-bold text-brand-blue leading-none mt-1">
              {activeTab === "senado"
                ? totalVotosEscrutadosSenado.toLocaleString("es-CO")
                : totalVotosEscrutadosCamara.toLocaleString("es-CO")}
            </p>
          </div>
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-blue-500 text-2xl">🗳️</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <BarChart data={activeTab === "senado" ? chartDataSenado : chartDataCamara} />
          </div>
          <div className="col-span-2">
            <PieChart participacion={activeTab === "senado" ? participacionSenado : participacionCamara} />
          </div>
        </div>

        <MapComponent mesas={mesas} />

        <TableMesas mesas={mesas} activeTab={activeTab} />

        <div className="mt-8 text-center text-xs text-gray-400">
          Desarrollado para la Alcaldía de Linares
        </div>
      </div>
    </main>
  );
}
