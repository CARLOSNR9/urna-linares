import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Mesa, generarMesasIniciales } from '@/lib/models';

export function useSupabase() {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Fetch initial data
        const fetchMesas = async () => {
            try {
                const { data, error } = await supabase
                    .from('mesas')
                    .select('*');

                if (error) throw error;
                if (data) {
                    const templates = generarMesasIniciales();
                    const getT = (id: string) => templates.find(t => t.id === id);

                    const sortedData = (data as Mesa[]).map(m => {
                        const t = getT(m.id);
                        return t ? { ...m, numero: t.numero, puesto: t.puesto } : m;
                    }).sort((a, b) => {
                        const aNum = parseInt(a.id.replace('mesa_', '')) || 0;
                        const bNum = parseInt(b.id.replace('mesa_', '')) || 0;
                        return aNum - bNum;
                    });
                    setMesas(sortedData);
                }
            } catch (err) {
                console.error("Error fetching mesas:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMesas();

        // 2. Set up realtime subscription
        const subscription = supabase
            .channel('mesas_changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'mesas'
                },
                (payload) => {
                    setMesas((currentMesas) => {
                        const templates = generarMesasIniciales();
                        const getT = (id: string) => templates.find(t => t.id === id);

                        const newMesaRaw = payload.new as Mesa;
                        const t = getT(newMesaRaw.id);
                        const fixedMesa = t ? { ...newMesaRaw, numero: t.numero, puesto: t.puesto } : newMesaRaw;

                        const index = currentMesas.findIndex((m) => m.id === fixedMesa.id);
                        if (index !== -1) {
                            const updatedMesas = [...currentMesas];
                            updatedMesas[index] = fixedMesa;
                            return updatedMesas.sort((a, b) => {
                                const aNum = parseInt(a.id.replace('mesa_', '')) || 0;
                                const bNum = parseInt(b.id.replace('mesa_', '')) || 0;
                                return aNum - bNum;
                            });
                        } else {
                            // If it's a new row entirely
                            return [...currentMesas, fixedMesa].sort((a, b) => {
                                const aNum = parseInt(a.id.replace('mesa_', '')) || 0;
                                const bNum = parseInt(b.id.replace('mesa_', '')) || 0;
                                return aNum - bNum;
                            });
                        }
                    });
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // 3. Update Function
    const updateMesaVotos = async (
        mesaId: string,
        votosSenado: Record<string, number>,
        votosCamara: Record<string, number>
    ) => {
        try {
            const { error } = await supabase
                .from('mesas')
                .update({
                    reportada: true,
                    votosSenado: votosSenado,
                    votosCamara: votosCamara,
                    updated_at: new Date().toISOString()
                })
                .eq('id', mesaId);

            if (error) throw error;
        } catch (err) {
            console.error("Error updating mesa:", err);
            throw err;
        }
    };

    // 4. Reset Function (Admin Only)
    const resetMesas = async () => {
        if (confirm("¿Está seguro de reiniciar TODAS las mesas? Esto no se puede deshacer.")) {
            try {
                const { data: allMesas, error: fetchError } = await supabase.from('mesas').select('id');
                if (fetchError) throw fetchError;

                if (allMesas) {
                    const updates = allMesas.map(m => supabase
                        .from('mesas')
                        .update({
                            reportada: false,
                            votosSenado: {},
                            votosCamara: {}
                        })
                        .eq('id', m.id)
                    );
                    await Promise.all(updates);
                    alert("Mesas reiniciadas con éxito");
                }
            } catch (err) {
                console.error("Error resetting mesas:", err);
                alert("Hubo un error al reiniciar las mesas");
            }
        }
    };

    return { mesas, loading, updateMesaVotos, resetMesas };
}
