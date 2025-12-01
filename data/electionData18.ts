import { ElectionResult18 } from '../types';

// PASTE YOUR RAW EXCEL DATA HERE
// Format: MUNICIPIO	SECCION	PAN	PRI	PRD	MC	PVEM	MORENA	PT	QI	ci_1...	NO_REGISTRADAS	NULOS	TOTAL_VOTOS	LISTA_NOMINAL
const RAW_ELECTION_DATA18 = `
COLÓN	76	178	297	0	7	8	7	16	25	1	117	2	0	0	0	0	3	0	0	0	0	0	0	0	0	0	329	0	0	0	0	112	0	0	0	0	0	0	0	0	0	55	0	0	0	0	0	0	31	1188	1591
COLÓN	77	168	205	5	5	10	9	24	27	1	127	5	0	0	0	0	0	0	0	0	0	0	0	0	0	0	376	0	0	0	0	198	0	0	0	0	0	0	0	0	0	80	0	0	0	0	0	1	29	1270	1731
COLÓN	78	117	236	4	6	5	10	13	32	2	68	2	0	0	0	0	2	0	0	0	0	0	0	0	0	0	238	0	0	0	0	130	0	0	0	0	0	0	0	0	0	64	0	0	0	0	0	0	31	960	1321
COLÓN	79	409	442	24	23	16	32	20	92	4	314	7	0	0	0	0	15	0	0	0	0	0	0	0	0	0	528	0	0	0	0	133	0	0	0	0	0	0	0	0	0	154	0	0	0	0	0	1	80	2294	3493
COLÓN	80	69	84	1	8	1	5	4	8	0	23	0	0	0	0	0	4	0	0	0	0	0	0	0	0	0	22	0	0	0	0	8	0	0	0	0	0	0	0	0	0	17	0	0	0	0	0	0	18	272	468
COLÓN	81	269	266	17	16	15	6	2	34	3	38	3	0	0	0	0	15	0	0	0	0	0	0	0	0	0	148	0	0	0	0	8	0	0	0	0	0	0	0	0	0	9	0	0	0	0	0	0	75	924	1417
COLÓN	82	226	235	3	13	12	5	2	33	1	67	1	0	0	0	0	16	0	0	0	0	0	0	0	0	0	177	0	0	0	0	29	0	0	0	0	0	0	0	0	0	19	0	0	0	0	0	0	38	877	1116
COLÓN	83	671	405	15	27	16	26	16	54	3	93	15	0	0	0	0	13	0	0	0	0	0	0	0	0	0	461	0	0	0	0	38	0	0	0	0	0	0	0	0	0	67	0	0	0	0	0	0	110	2030	3123
COLÓN	84	292	151	16	9	13	15	7	70	5	16	6	0	0	0	0	2	0	0	0	0	0	0	0	0	0	113	0	0	0	0	9	0	0	0	0	0	0	0	0	0	24	0	0	0	0	0	0	65	813	1405
COLÓN	85	51	121	16	11	17	50	6	128	4	25	2	0	0	0	0	1	0	0	0	0	0	0	0	0	0	40	0	0	0	0	62	0	0	0	0	0	0	0	0	0	139	0	0	0	0	0	1	49	723	1073
COLÓN	86	255	163	42	11	4	15	5	35	3	73	4	0	0	0	0	6	0	0	0	0	0	0	0	0	0	141	0	0	0	0	6	0	0	0	0	0	0	0	0	0	20	0	0	0	0	0	0	54	837	1407
COLÓN	87	295	219	8	8	9	16	9	86	6	61	1	0	0	0	0	6	0	0	0	0	0	0	0	0	0	300	0	0	0	0	75	0	0	0	0	0	0	0	0	0	41	0	0	0	0	0	1	57	1198	1891
COLÓN	88	344	319	8	22	28	13	11	80	4	100	2	0	0	0	0	11	0	0	0	0	0	0	0	0	0	375	0	0	0	0	74	0	0	0	0	0	0	0	0	0	80	0	0	0	0	0	0	75	1546	2455
COLÓN	89	482	294	29	32	10	46	12	73	12	137	2	0	0	0	0	18	0	0	0	0	0	0	0	0	0	420	0	0	0	0	51	0	0	0	0	0	0	0	0	0	45	0	0	0	0	0	0	104	1767	3067
COLÓN	90	257	208	8	18	14	21	10	81	5	250	2	0	0	0	0	5	0	0	0	0	0	0	0	0	0	56	0	0	0	0	109	0	0	0	0	0	0	0	0	0	43	0	0	0	0	0	0	52	1139	1563
COLÓN	91	335	230	19	21	12	30	8	38	2	136	3	0	0	0	0	13	0	0	0	0	0	0	0	0	0	97	0	0	0	0	36	0	0	0	0	0	0	0	0	0	22	0	0	0	0	0	0	66	1068	1579
COLÓN	92	832	188	24	45	27	44	14	189	13	175	3	0	0	0	0	4	0	0	0	0	0	0	0	0	0	660	0	0	0	0	45	0	0	0	0	0	0	0	0	0	57	0	0	0	0	0	0	89	2409	3900
COLÓN	93	769	201	25	37	21	72	10	129	15	229	4	0	0	0	0	2	0	0	0	0	0	0	0	0	0	307	0	0	0	0	87	0	0	0	0	0	0	0	0	0	32	0	0	0	0	0	0	87	2027	3165
COLÓN	94	525	258	4	33	14	65	17	76	8	72	1	0	0	0	0	8	0	0	0	0	0	0	0	0	0	353	0	0	0	0	30	0	0	0	0	0	0	0	0	0	54	0	0	0	0	0	0	87	1605	2853
COLÓN	95	683	151	14	21	17	57	2	51	2	50	2	0	0	0	0	2	0	0	0	0	0	0	0	0	0	207	0	0	0	0	20	0	0	0	0	0	0	0	0	0	29	0	0	0	0	0	0	56	1364	2201
COLÓN	96	816	129	12	21	29	403	6	93	7	53	2	0	0	0	0	5	0	0	0	0	0	0	0	0	0	147	0	0	0	0	69	0	0	0	0	0	0	0	0	0	5	0	0	0	0	0	0	72	1869	2920
`;

const parseElectionData18 = (rawData: string): Record<string, ElectionResult18> => {
  const results: Record<string, ElectionResult18> = {};

  const lines = rawData.trim().split("\n").filter(line => line.trim().length > 0);

  lines.forEach(line => {
    const parts = line.trim().split(/\t/);
    if (parts.length < 10) return;

    const municipio = parts[0].trim();
    const seccion = parts[1].trim();

    const parseNum = (val: string) => {
      const cleaned = val ? val.replace(/,/g, "").trim() : "0";
      return parseInt(cleaned, 10) || 0;
    };

    // --------------------------------------
    // PARTIDOS base según el header REAL
    // --------------------------------------
    const pan = parseNum(parts[2]);
    const pri = parseNum(parts[3]);
    const prd = parseNum(parts[4]);
    const pvem = parseNum(parts[5]);
    const pt = parseNum(parts[6]);
    const mc = parseNum(parts[7]);
    const na = parseNum(parts[8]);
    const morena = parseNum(parts[9]);
    const es = parseNum(parts[10]);   // Encuentro Social (ES)
    const cq = parseNum(parts[11]);   // ¿Coalición Querétaro?
    const qi = parseNum(parts[12]);   // Queretaro Independiente

    // --------------------------------------
    // COALICIONES 2018 según header
    // --------------------------------------
    const morena_pt_pes = parseNum(parts[13]);
    const morena_pt  = parseNum(parts[14]);
    const morena_pes = parseNum(parts[15]);
    const pt_pes     = parseNum(parts[16]);
    const pri_pvem     = parseNum(parts[17]);
    const cc_pan_prd_mc = parseNum(parts[18]);
    const pan_prd     = parseNum(parts[19]);
    const pan_mc      = parseNum(parts[20]);
    const prd_mc      = parseNum(parts[21]);
    const cc2_pan_prd   = parseNum(parts[22]);
    const cc3_pan_mc    = parseNum(parts[23]);
    const cc4_pri_pvem  = parseNum(parts[24]);

    // --------------------------------------
    // CANDIDATOS INDEP 
    // --------------------------------------
    const jagrv = parseNum(parts[25]);
    const lgod = parseNum(parts[26]);
    const lbh = parseNum(parts[27]);
    const oelo = parseNum(parts[28]);
    const mgag = parseNum(parts[29]);
    const rmh = parseNum(parts[30]);
    const emb = parseNum(parts[31]);
    const janh = parseNum(parts[32]);
    const jnl = parseNum(parts[33]);
    const jmmm = parseNum(parts[34]);
    const jaml = parseNum(parts[35]);
    const pvm = parseNum(parts[36]);
    const acm = parseNum(parts[37]);
    const djd = parseNum(parts[38]);
    const jbll = parseNum(parts[39]);
    const hmv = parseNum(parts[40]);
    const rms = parseNum(parts[41]);
    const jlms = parseNum(parts[42]);
    const prcl = parseNum(parts[43]);
    const amg = parseNum(parts[44]);
    const rrt = parseNum(parts[45]);
    const agab = parseNum(parts[46]);
    const efm = parseNum(parts[47]);

    // --------------------------------------
    // RESULTADOS
    // --------------------------------------
    const num_noreg = parseNum(parts[48]);
    const nulos = parseNum(parts[49]);
    const total_votos = parseNum(parts[50]);
    const lista_nominal = parseNum(parts[51]);

    // --------------------------------------
    // Cálculo de ganador
    // --------------------------------------
    const allCandidates = [
      { name: "PAN", votes: pan },
      { name: "PRI", votes: pri },
      { name: "PRD", votes: prd },
      { name: "PVEM", votes: pvem },
      { name: "PT", votes: pt },
      { name: "MC", votes: mc },
      { name: "NA", votes: na },
      { name: "MORENA", votes: morena },
      { name: "ES", votes: es },
      { name: "CQ", votes: cq },
      { name: "QI", votes: qi },

      { name: "MORENA-PT-PES", votes: morena_pt_pes },
      { name: "MORENA-PT", votes: morena_pt },
      { name: "MORENA-PES", votes: morena_pes },
      { name: "PT-PES", votes: pt_pes },
      { name: "PRI-PVEM", votes: pri_pvem },
      { name: "CC_PAN-PRD-MC", votes: cc_pan_prd_mc },
      { name: "PAN-PRD", votes: pan_prd },
      { name: "PAN-MC", votes: pan_mc },
      { name: "PRD-MC", votes: prd_mc },
      { name: "CC2_PAN-PRD", votes: cc2_pan_prd },
      { name: "CC3_PAN-MC", votes: cc3_pan_mc },
      { name: "CC4_PRI-PVEM", votes: cc4_pri_pvem },
    ];

    allCandidates.sort((a, b) => b.votes - a.votes);
    const winner = allCandidates[0].votes > 0 ? allCandidates[0].name : "N/A";

    // --------------------------------------
    // Guardar resultado final
    // --------------------------------------
    results[seccion] = {
      municipio,
      seccion,

      pan, pri, prd, pvem, pt, mc, na, morena, es, cq, qi,

      morena_pt_pes,
      morena_pt,
      morena_pes,
      pt_pes,
      pri_pvem,
      cc_pan_prd_mc,
      pan_prd,
      pan_mc,
      prd_mc,
      cc2_pan_prd,
      cc3_pan_mc,
      cc4_pri_pvem,

      jagrv, lgod, lbh, oelo, mgag, rmh, emb, janh, jnl, jmmm, jaml,
      pvm, acm, djd, jbll, hmv, rms, jlms, prcl, amg, rrt, agab, efm,

      num_noreg,
      nulos,
      total_votos,
      lista_nominal,

      winner,
    };
  });

  return results;
};

export const ELECTION_RESULTS_2018 = parseElectionData18(RAW_ELECTION_DATA18);
