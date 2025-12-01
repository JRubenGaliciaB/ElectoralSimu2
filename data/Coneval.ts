import { Coneval } from '../types'; // Asumiendo que 'Coneval' es el tipo de dato para cada registro.

// PASTE YOUR RAW EXCEL DATA HERE
// Format: Municipio    Seccion Nivel Pobreza
const RAW_ELECTION_DATA = `
Amealco de Bonfil	1	4
Amealco de Bonfil	2	4
Amealco de Bonfil	3	4
Amealco de Bonfil	4	4
Amealco de Bonfil	5	4
Amealco de Bonfil	6	4
Amealco de Bonfil	7	4
Amealco de Bonfil	8	4
Amealco de Bonfil	9	4
Amealco de Bonfil	10	4
Amealco de Bonfil	11	4
Amealco de Bonfil	12	4
Amealco de Bonfil	13	4
Amealco de Bonfil	14	4
Amealco de Bonfil	15	4
Amealco de Bonfil	16	4
Amealco de Bonfil	17	4
Amealco de Bonfil	18	4
Amealco de Bonfil	19	4
Amealco de Bonfil	20	8
Amealco de Bonfil	21	8
Amealco de Bonfil	22	4
Amealco de Bonfil	23	8
Amealco de Bonfil	24	4
Amealco de Bonfil	25	8
Amealco de Bonfil	26	8
Amealco de Bonfil	27	8
Amealco de Bonfil	28	8
Amealco de Bonfil	29	4
Amealco de Bonfil	30	4
Amealco de Bonfil	31	4
Amealco de Bonfil	32	4
Amealco de Bonfil	33	4
Amealco de Bonfil	34	4

`;

const parseConeval = (rawData: string): Record<string, Coneval> => {
 const resultsPobreza: Record<string, Coneval> = {};
 const lines = rawData.trim().split('\n').filter(line => line.trim().length > 0);

 lines.forEach((line, index) => { // Añadí 'index' para mejor manejo de errores si se desea
 const parts = line.trim().split(/\s+/);
 
 if (parts.length < 3) {
 return; 
 }

 const nivelPobrezaStr = parts.pop()!;
 const seccionBrutaStr = parts.pop()!; // Obtenemos la sección tal cual (ej: '001', '2')
 const municipio = parts.join(' ');  

 // --- 1. NORMALIZACIÓN DE LA CLAVE DE SECCIÓN ---.
 const seccionNormalizadaNum = parseInt(seccionBrutaStr, 10);
 
 // La clave (string) que usaremos para el GeoJSON y el diccionario.
 // Asumimos que tu GeoJSON usa claves sin padding (ej: '1', '2', '10').
 const seccionKey = seccionNormalizadaNum.toString(); 

 // --- 2. CONVERSIÓN FINAL Y VALIDACIÓN ---
 // Usamos la sección normalizada (number) para la propiedad 'seccion' del objeto 'Coneval'.
 const nivelPobreza = parseInt(nivelPobrezaStr, 10);
 
 if (isNaN(seccionNormalizadaNum) || isNaN(nivelPobreza)) { 
 // Validación de que son números válidos
 return; 
 }

 // --- 3. ASIGNACIÓN AL RESULTADO ---
 resultsPobreza[seccionKey] = { // Usamos la clave normalizada (string, sin padding)
 municipio,
 seccion: seccionNormalizadaNum, // Asumimos que el tipo Coneval espera un número aquí
 nivelPobreza, 
 };
 });

 return resultsPobreza;
};

// Se ejecuta la función de parseo para generar el objeto de datos
export const ConevalData: Record<string, Coneval> = parseConeval(RAW_ELECTION_DATA);