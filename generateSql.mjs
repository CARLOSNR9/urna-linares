import { PUESTOS_VOTACION, generarMesasIniciales, PARTIDOS_SENADO, PARTIDOS_CAMARA } from './src/lib/models.js';

// Node can't run the TS file directly, so we need a standalone script to generate the SQL
const PUESTOS = [
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

let sql = ``;

let contadorMesaGlobal = 1;

for (const puesto of PUESTOS) {
  let contadorMesaPuesto = 1;
  for (let i = 0; i < puesto.totalMesas; i++) {
    const id = `mesa_${contadorMesaGlobal}`;
    const numero = contadorMesaPuesto;
    const orden = contadorMesaGlobal;
    const puestoNombre = puesto.nombre.replace(/'/g, "''");
    
    sql += `UPDATE public.mesas SET numero = ${numero}, orden = ${orden}, puesto = '${puestoNombre}' WHERE id = '${id}';\n`;
    
    contadorMesaPuesto++;
    contadorMesaGlobal++;
  }
}

console.log(sql);
