import { Coneval } from '../types'; // Asumiendo que 'Coneval' es el tipo de dato para cada registro.

// PASTE YOUR RAW EXCEL DATA HERE
// Format: Municipio    Seccion Nivel Pobreza
const RAW_ELECTION_DATA = `
Colón	76	4
Colón	77	4
Colón	78	4
Colón	79	4
Colón	80	4
Colón	81	4
Colón	82	4
Colón	83	4
Colón	84	4
Colón	85	4
Colón	86	4
Colón	87	4
Colón	88	4
Colón	89	4
Colón	90	4
Colón	91	4
Colón	92	4
Colón	93	4
Colón	94	6
Colón	95	6
Colón	96	4
Colón	894	4
Colón	895	4
Colón	896	4
Colón	971	4
Colón	972	4
Colón	973	4
Colón	974	4
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