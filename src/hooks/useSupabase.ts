import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Mesa } from '@/lib/models';

export function useSupabase() {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Fetch initial data
        const fetchMesas = async () => {
            try {
                const { data, error } = await supabase
                    .from('mesas')
                    .select('*')
                    .order('numero', { ascending: true });

                if (error) throw error;
                if (data) setMesas(data as Mesa[]);
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
                        const index = currentMesas.findIndex((m) => m.id === (payload.new as Mesa).id);
                        if (index !== -1) {
                            const updatedMesas = [...currentMesas];
                            updatedMesas[index] = payload.new as Mesa;
                            return updatedMesas.sort((a, b) => a.numero - b.numero);
                        } else {
                            // If it's a new row entirely
                            return [...currentMesas, payload.new as Mesa].sort((a, b) => a.numero - b.numero);
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
                    votosCamara: votosCamara
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
