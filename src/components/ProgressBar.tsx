interface ProgressBarProps {
    total: number;
    current: number;
    label?: string;
}

export function ProgressBar({ total, current, label }: ProgressBarProps) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
            <div className="flex justify-between items-end mb-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {label || "Mesas Reportadas"}
                </h3>
                <span className="text-2xl font-bold text-brand-blue leading-none">
                    {current} <span className="text-base font-normal text-gray-400">/ {total}</span>
                </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3.5 mb-2 overflow-hidden">
                <div
                    className="bg-brand-accent h-3.5 rounded-full transition-all duration-1000 ease-in-out relative"
                    style={{ width: `${percentage}%` }}
                >
                    {percentage > 10 && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    )}
                </div>
            </div>

            <p className="text-xs text-right text-gray-500 font-medium">
                {percentage}% completado
            </p>
        </div>
    );
}
