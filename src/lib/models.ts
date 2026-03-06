export const PARTIDOS_SENADO = [
  "Frente Amplio #1 - Gustavo Garcia",
  "Partido Conservador #12 - Liliana Benavides",
  "Alianza Verde #13 - Eduardo Enriquez",
  "Pacto Histórico (Lista Cerrada)",
  "Voto en Blanco",
  "Votos Nulos",
  "Tarjetas No Marcadas"
] as const;

export type PartidoSenado = typeof PARTIDOS_SENADO[number];

// Placeholder for Chamber of representatives options
export const PARTIDOS_CAMARA = [
  "Partido Verde #101 - Alejandra Abasolo",
  "Partido Conservador #101 - Juan Daniel Peñuela",
  "Partido MIRA #105 - Jhon Rojas",
  "Cámara Afro #301 - Benildo",
  "Pacto Histórico (Cámara)",
  "Voto en Blanco",
  "Votos Nulos",
  "Tarjetas No Marcadas"
] as const;

export type PartidoCamara = typeof PARTIDOS_CAMARA[number];

export interface Mesa {
  id: string;
  numero: number;
  puesto: string;
  votosSenado: Record<PartidoSenado, number>;
  votosCamara?: Record<PartidoCamara, number>;
  reportada: boolean;
  totalVotosSenado?: number;
  totalVotosCamara?: number;
  updated_at?: string;
  orden?: number; // Used for global sorting
}

export const PUESTOS_VOTACION = [
  { nombre: "Puesto Cabecera Municipal", direccion: "I.E. Diego Luis Córdoba", totalMesas: 15 },
  { nombre: "San Francisco", direccion: "I.E. San Francisco de Asís", totalMesas: 2 },
  { nombre: "Bellavista", direccion: "Polideportivo Bellavista", totalMesas: 2 },
  { nombre: "Bella Florida", direccion: "Centro Educativo Cristo Rey", totalMesas: 2 },
  { nombre: "Llano Grande", direccion: "Centro Educativo Llano Grande Alto", totalMesas: 1 },
  { nombre: "Tabiles", direccion: "I.E. Luis Carlos Galán", totalMesas: 4 },
  { nombre: "Tambillo de Bravos", direccion: "Salón Comunal", totalMesas: 2 },
  { nombre: "Motilón", direccion: "Centro Educativo Motilón", totalMesas: 1 },
  { nombre: "Laguna del Pueblo", direccion: "Salón Comunal", totalMesas: 1 },
];

export function generarMesasIniciales(): Mesa[] {
  const mesas: Mesa[] = [];
  let contadorMesaGlobal = 1;

  for (const puesto of PUESTOS_VOTACION) {
    let contadorMesaPuesto = 1;
    for (let i = 0; i < puesto.totalMesas; i++) {

      const votosSenadoVacio = {} as Record<PartidoSenado, number>;
      PARTIDOS_SENADO.forEach(partido => {
        votosSenadoVacio[partido] = 0;
      });

      const votosCamaraVacio = {} as Record<PartidoCamara, number>;
      PARTIDOS_CAMARA.forEach(partido => {
        votosCamaraVacio[partido] = 0;
      });

      mesas.push({
        id: `mesa_${contadorMesaGlobal}`,
        numero: contadorMesaPuesto, // Local Number
        orden: contadorMesaGlobal,  // Global Index for sorting
        puesto: puesto.nombre,
        votosSenado: votosSenadoVacio,
        votosCamara: votosCamaraVacio,
        reportada: false,
      });
      contadorMesaPuesto++;
      contadorMesaGlobal++;
    }
  }

  return mesas;
}
