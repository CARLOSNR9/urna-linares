import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export function Header() {
    return (
        <header className="bg-brand-blue text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto max-w-lg">
                <h1 className="text-xl font-bold tracking-tight text-center">
                    URNA LINARES
                </h1>
                <p className="text-sm text-center text-blue-100 flex items-center justify-center gap-2 mt-1">
                    <Activity size={16} className="text-green-400 animate-pulse" />
                    <span>Sistema de Monitoreo Electoral</span>
                </p>
                <p className="text-xs text-center text-blue-200 mt-1 opacity-80">
                    Alcaldía Municipal de Linares – Nariño
                </p>
            </div>
        </header>
    );
}
