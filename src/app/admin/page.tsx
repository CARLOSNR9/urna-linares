"use client";

import { useState } from "react";
import { useFirebase } from "@/lib/firebase";
import { Header } from "@/components/Header";
import { PartidoSenado, PARTIDOS_SENADO, PartidoCamara, PARTIDOS_CAMARA } from "@/lib/models";
import { Save, LogIn, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const { mesas, updateMesaVotos, resetMesas } = useFirebase();
    const router = useRouter();

    // Basic Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Form State
    const [selectedMesaId, setSelectedMesaId] = useState<string>("");

    // Initialize empty votes for all parties
    const initialVotosSenado = PARTIDOS_SENADO.reduce((acc, partido) => {
        acc[partido] = "";
        return acc;
    }, {} as Record<PartidoSenado, number | "">);

    const initialVotosCamara = PARTIDOS_CAMARA.reduce((acc, partido) => {
        acc[partido] = "";
        return acc;
    }, {} as Record<PartidoCamara, number | "">);

    const [votosSenado, setVotosSenado] = useState<Record<PartidoSenado, number | "">>(initialVotosSenado);
    const [votosCamara, setVotosCamara] = useState<Record<PartidoCamara, number | "">>(initialVotosCamara);
    const [activeTab, setActiveTab] = useState<"senado" | "camara">("senado");
    const [isSaving, setIsSaving] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "linares2026") {
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Contraseña incorrecta. Contacte soporte.");
        }
    };

    const handleMesaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mesaId = e.target.value;
        setSelectedMesaId(mesaId);

        // Auto-fill existing votes if any
        const mesa = mesas.find((m) => m.id === mesaId);
        if (mesa && mesa.reportada) {
            setVotosSenado({ ...mesa.votosSenado });
            if (mesa.votosCamara) {
                setVotosCamara({ ...mesa.votosCamara });
            } else {
                setVotosCamara(initialVotosCamara);
            }
        } else {
            setVotosSenado(initialVotosSenado);
            setVotosCamara(initialVotosCamara);
        }
    };

    const handleVotoSenadoChange = (partido: PartidoSenado, value: string) => {
        const val = value === "" ? "" : Number(value);
        setVotosSenado((prev) => ({ ...prev, [partido]: val }));
    };

    const handleVotoCamaraChange = (partido: PartidoCamara, value: string) => {
        const val = value === "" ? "" : Number(value);
        setVotosCamara((prev) => ({ ...prev, [partido]: val }));
    };

    const currentMesa = mesas.find(m => m.id === selectedMesaId);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMesaId) return;

        setIsSaving(true);

        const votosNumericosSenado = PARTIDOS_SENADO.reduce((acc, partido) => {
            acc[partido] = Number(votosSenado[partido]) || 0;
            return acc;
        }, {} as Record<PartidoSenado, number>);

        const votosNumericosCamara = PARTIDOS_CAMARA.reduce((acc, partido) => {
            acc[partido] = Number(votosCamara[partido]) || 0;
            return acc;
        }, {} as Record<PartidoCamara, number>);

        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 600));
        await updateMesaVotos(selectedMesaId, votosNumericosSenado, votosNumericosCamara);

        setIsSaving(false);

        alert(`Mesa ${currentMesa?.numero} guardada exitosamente.`);
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-brand-blue relative overflow-hidden">
                {/* Decorative BG element */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm z-10 relative border border-white/20">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-brand-blue tracking-tight">URNA LINARES</h1>
                        <p className="text-sm text-gray-500">Acceso Restringido</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm justify-between text-gray-700 font-medium mb-1">
                                Contraseña Administrativa
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all outline-none bg-gray-50"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                <AlertCircle size={16} />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-brand-blue hover:bg-brand-accent text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <LogIn size={18} />
                            Ingresar al Sistema
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                            Este panel es de uso exclusivo para el digitador oficial de la jornada.
                        </p>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-brand-light min-h-screen pb-10">
            <Header />

            <div className="container mx-auto p-4 max-w-md mt-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-brand-blue">
                                Ingreso de Datos
                            </h2>
                            <p className="text-sm text-gray-500">Seleccione la mesa y digite los votos.</p>
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="text-xs text-brand-accent hover:underline bg-blue-50 px-3 py-1.5 rounded-full font-medium"
                        >
                            Ver Dashboard
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6 flex flex-col h-full">
                        <div>
                            <label className="block text-sm text-gray-700 font-semibold mb-2 uppercase tracking-wide">
                                1. Seleccionar Mesa
                            </label>
                            <select
                                value={selectedMesaId}
                                onChange={handleMesaChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all outline-none bg-gray-50 font-medium text-gray-800"
                                required
                            >
                                <option value="" disabled>-- Escoja una mesa --</option>
                                {mesas.map((mesa) => (
                                    <option key={mesa.id} value={mesa.id}>
                                        Mesa {mesa.numero} — {mesa.puesto} {mesa.reportada ? "✅" : ""}
                                    </option>
                                ))}
                            </select>

                            {currentMesa && currentMesa.reportada && (
                                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-medium bg-amber-50 p-2 rounded-lg">
                                    <AlertCircle size={14} />
                                    Esta mesa ya fue reportada. Podrá sobrescribir los datos.
                                </p>
                            )}
                        </div>

                        <div className={`space-y-4 transition-opacity duration-300 ${!selectedMesaId ? 'opacity-50 pointer-events-none grayscale-[0.5]' : 'opacity-100'}`}>

                            {/* Tabs Switcher */}
                            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("senado")}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'senado' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Tarjetón de Senado
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("camara")}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'camara' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Tarjetón de Cámara
                                </button>
                            </div>

                            {activeTab === "senado" && (
                                <>
                                    <label className="block text-sm text-gray-700 font-semibold mb-1 uppercase tracking-wide border-b border-gray-100 pb-2">
                                        2. Votos Senado (Lista y Preferentes Sumados)
                                    </label>

                                    {PARTIDOS_SENADO.map((partido) => (
                                        <div key={partido} className="flex justify-between items-center group relative p-1">
                                            <span className="text-sm font-medium text-gray-800 tracking-tight flex-1 pr-4">
                                                {partido}
                                            </span>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={votosSenado[partido]}
                                                    onChange={(e) => handleVotoSenadoChange(partido, e.target.value)}
                                                    className="w-24 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-accent text-right font-bold text-brand-blue outline-none transition-all shadow-inner bg-gray-50 focus:bg-white"
                                                    placeholder="0"
                                                    disabled={!selectedMesaId}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {activeTab === "camara" && (
                                <>
                                    <label className="block text-sm text-gray-700 font-semibold mb-1 uppercase tracking-wide border-b border-gray-100 pb-2">
                                        3. Votos Cámara (Lista y Preferentes Sumados)
                                    </label>

                                    {PARTIDOS_CAMARA.map((partido) => (
                                        <div key={partido} className="flex justify-between items-center group relative p-1">
                                            <span className="text-sm font-medium text-gray-800 tracking-tight flex-1 pr-4">
                                                {partido}
                                            </span>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={votosCamara[partido]}
                                                    onChange={(e) => handleVotoCamaraChange(partido, e.target.value)}
                                                    className="w-24 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-accent text-right font-bold text-brand-blue outline-none transition-all shadow-inner bg-gray-50 focus:bg-white"
                                                    placeholder="0"
                                                    disabled={!selectedMesaId}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!selectedMesaId || isSaving}
                            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-8 
                ${!selectedMesaId || isSaving ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-500 hover:shadow-green-500/25'}`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    GUARDAR RESULTADO
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-6 border-t border-gray-100 text-center">
                        <button
                            onClick={resetMesas}
                            className="text-xs text-red-500 hover:text-red-700 font-medium underline opacity-80"
                        >
                            Reiniciar Todos los Datos (Peligro)
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
