import { cn } from "@/lib/utils";
import { Activity, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (
        <header className="bg-brand-blue text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto max-w-lg flex flex-col items-center relative">
                <Link
                    href="/admin"
                    className="absolute right-0 top-0 p-2 text-blue-300 hover:text-white transition-colors"
                    title="Panel de Administración"
                >
                    <Settings size={20} />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                        <Image src="/logo.png" alt="Urna Linares Logo" fill className="object-cover" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        URNA LINARES
                    </h1>
                </div>
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
