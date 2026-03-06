"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Mesa, generarMesasIniciales, PartidoSenado, PartidoCamara } from "./models";

// This is a minimal mock of Firebase functionality so the app works immediately
// without needing real Firebase credentials.

interface FirebaseContextType {
    mesas: Mesa[];
    loading: boolean;
    updateMesaVotos: (id: string, votosSenado: Record<PartidoSenado, number>, votosCamara?: Record<PartidoCamara, number>) => Promise<void>;
    resetMesas: () => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseMockProvider({ children }: { children: React.ReactNode }) {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [loading, setLoading] = useState(true);

    // Initialize from LocalStorage or generate fresh
    useEffect(() => {
        const saved = localStorage.getItem("urna_linares_mock_db");
        if (saved) {
            try {
                setMesas(JSON.parse(saved));
            } catch (e) {
                setMesas(generarMesasIniciales());
            }
        } else {
            setMesas(generarMesasIniciales());
        }
        setLoading(false);
    }, []);

    // Save to LocalStorage whenever mesas change (Simulating real-time sync)
    useEffect(() => {
        if (!loading) {
            localStorage.setItem("urna_linares_mock_db", JSON.stringify(mesas));
        }
    }, [mesas, loading]);

    // Simulates updateDoc() in Firebase
    const updateMesaVotos = async (id: string, votosSenado: Record<PartidoSenado, number>, votosCamara?: Record<PartidoCamara, number>) => {
        setMesas((prev) =>
            prev.map((mesa) => {
                if (mesa.id === id) {
                    const totalMesaSenado = Object.values(votosSenado).reduce((sum, curr) => Number(sum) + Number(curr), 0);

                    let totalMesaCamara = 0;
                    if (votosCamara) {
                        totalMesaCamara = Object.values(votosCamara).reduce((sum, curr) => Number(sum) + Number(curr), 0);
                    } else if (mesa.votosCamara) {
                        totalMesaCamara = Object.values(mesa.votosCamara).reduce((sum, curr) => Number(sum) + Number(curr), 0);
                    }

                    return {
                        ...mesa,
                        votosSenado,
                        ...(votosCamara && { votosCamara }),
                        reportada: true,
                        totalVotosSenado: totalMesaSenado,
                        totalVotosCamara: totalMesaCamara,
                    };
                }
                return mesa;
            })
        );
    };

    const resetMesas = () => {
        if (confirm("¿Estás seguro de reiniciar todo el conteo?")) {
            setMesas(generarMesasIniciales());
        }
    };

    return (
        <FirebaseContext.Provider value={{ mesas, loading, updateMesaVotos, resetMesas }}>
            {children}
        </FirebaseContext.Provider>
    );
}

export function useFirebase() {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error("useFirebase must be used within a FirebaseMockProvider");
    }
    return context;
}
