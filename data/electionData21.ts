import { ElectionResult21 } from '../types';

// PASTE YOUR RAW EXCEL DATA HERE
// Format: MUNICIPIO	SECCION	PAN	PRI	PRD	MC	PVEM	MORENA	PT	QI	ci_1...	NO_REGISTRADAS	NULOS	TOTAL_VOTOS	LISTA_NOMINAL
const RAW_ELECTION_DATA21 = `
COLON	76	223	393	1	3	35	15	0	90	10	0	154	0	104	0	0	0	0	0	0	0	0	0	0	0	0	24	0	0	0	0	0	0	0	31	1083	1685
COLON	77	181	412	1	22	21	31	0	95	15	2	231	0	183	0	0	0	0	0	0	0	0	0	0	0	0	26	0	0	0	0	0	0	1	24	1245	1896
COLON	78	211	302	3	10	16	33	0	85	7	5	146	0	76	0	0	0	0	0	0	0	0	0	0	0	0	11	0	0	0	0	0	0	0	25	930	1409
COLON	79	367	715	4	14	32	58	0	134	54	3	204	0	242	0	0	0	0	0	0	0	0	0	0	0	0	21	0	0	0	0	0	0	1	49	1898	3868
COLON	80	65	136	1	4	3	10	0	11	2	1	3	0	23	0	0	0	0	0	0	0	0	0	0	0	0	4	0	0	0	0	0	0	0	16	279	493
COLON	81	207	493	2	1	6	9	0	58	5	0	3	0	44	0	0	0	0	0	0	0	0	0	0	0	0	23	0	0	0	0	0	0	0	29	880	1496
COLON	82	119	177	1	0	7	4	0	31	2	2	11	0	13	0	0	0	0	0	0	0	0	0	0	0	0	3	0	0	0	0	0	0	0	21	391	1229
COLON	83	714	1010	5	7	15	48	0	75	28	2	144	0	122	0	0	0	0	0	0	0	0	0	0	0	0	56	0	0	0	0	0	0	1	56	2283	3436
COLON	84	221	344	4	6	13	29	0	41	15	2	71	0	68	0	0	0	0	0	0	0	0	0	0	0	0	15	0	0	0	0	0	0	0	41	870	1554
COLON	85	137	130	1	9	15	96	0	97	12	5	23	0	91	0	0	0	0	0	0	0	0	0	0	0	0	14	0	0	0	0	0	0	0	30	660	1122
COLON	86	184	355	0	1	11	44	0	36	15	6	38	0	80	0	0	0	0	0	0	0	0	0	0	0	0	18	0	0	0	0	0	0	0	23	811	1534
COLON	87	193	350	13	6	13	59	0	61	30	6	158	0	220	0	0	0	0	0	0	0	0	0	0	0	0	11	0	0	0	0	0	0	0	28	1148	2139
COLON	88	228	225	21	7	16	40	0	103	29	2	155	0	222	0	0	0	0	0	0	0	0	0	0	0	0	15	0	0	0	0	0	0	0	19	1082	2680
COLON	90	207	338	3	6	16	36	0	91	17	16	38	0	240	0	0	0	0	0	0	0	0	0	0	0	0	10	0	0	0	0	0	0	0	39	1057	1687
COLON	91	199	339	6	4	13	35	0	111	15	1	35	0	261	0	0	0	0	0	0	0	0	0	0	0	0	15	0	0	0	0	0	0	0	38	1072	1714
COLON	92	477	619	10	9	31	231	0	231	30	26	160	0	567	0	0	0	0	0	0	0	0	0	0	0	0	65	0	0	0	0	0	0	0	65	2521	4312
COLON	94	464	323	7	6	21	43	0	107	21	19	47	0	328	0	0	0	0	0	0	0	0	0	0	0	0	66	0	0	0	0	0	0	0	61	1513	3104
COLON	95	274	434	12	4	17	68	0	64	15	3	108	0	214	0	0	0	0	0	0	0	0	0	0	0	0	22	0	0	0	0	0	0	0	35	1270	2371
COLON	96	377	454	5	6	16	143	0	61	6	9	65	0	389	0	0	0	0	0	0	0	0	0	0	0	0	49	0	0	0	0	0	0	0	50	1630	3079
COLON	894	265	314	3	6	8	30	0	82	17	11	57	0	108	0	0	0	0	0	0	0	0	0	0	0	0	27	0	0	0	0	0	0	0	35	963	2082
COLON	895	169	208	1	7	14	36	0	63	26	1	14	0	116	0	0	0	0	0	0	0	0	0	0	0	0	6	0	0	0	0	0	0	0	30	691	1286
COLON	896	295	330	1	6	8	134	0	58	9	29	268	0	282	0	0	0	0	0	0	0	0	0	0	0	0	19	0	0	0	0	0	0	1	41	1481	2442
COLON	897	112	152	2	4	3	67	0	24	7	3	94	0	119	0	0	0	0	0	0	0	0	0	0	0	0	12	0	0	0	0	0	0	0	17	616	945
`;

const parseElectionData21 = (rawData: string): Record<string, ElectionResult21> => {
  const results: Record<string, ElectionResult21> = {};

  const lines = rawData.trim().split('\n').filter(line => line.trim().length > 0);

  lines.forEach(line => {
    const parts = line.trim().split(/\t/);
    if (parts.length < 10) return;

    const municipio = parts[0].trim();
    const seccion = parts[1].trim();
    
    const parseNum = (val: string) => {
      const cleaned = val ? val.replace(/,/g, '').trim() : '0';
      return parseInt(cleaned, 10) || 0;
    };

    // PARTIDOS
    const pan = parseNum(parts[2]);
    const pri = parseNum(parts[3]);
    const prd = parseNum(parts[4]);
    const mc = parseNum(parts[5]);
    const pvem = parseNum(parts[6]);
    const morena = parseNum(parts[7]);
    const pt = parseNum(parts[8]);
    const qi = parseNum(parts[9]);     // Queretaro Independiente
    const pes = parseNum(parts[10]);
    const rsp = parseNum(parts[11]);
    const fm = parseNum(parts[12]);

    // CI_1 ... CI_14
    const ci = {};
    for (let i = 1; i <= 14; i++) {
      ci[`ci_${i}`] = parseNum(parts[12 + i]);
    }

    // COALICIONES NUEVAS
    const pan_qi = parseNum(parts[27]);
    const pri_pvem = parseNum(parts[28]);
    const pvem_pt = parseNum(parts[29]);
    const pan_prd_qi = parseNum(parts[30]);
    const pan_prd = parseNum(parts[31]);
    const prd_qi = parseNum(parts[32]);
    const pt_qi = parseNum(parts[33]);

    // NÚMEROS
    const num_noreg = parseNum(parts[34]);
    const nulos = parseNum(parts[35]);
    const total_votos = parseNum(parts[36]);
    const lista_nominal = parseNum(parts[37]);

    // PARA GANADOR
    const allCandidates = [
      { name: 'PAN', votes: pan },
      { name: 'PRI', votes: pri },
      { name: 'PRD', votes: prd },
      { name: 'MC', votes: mc },
      { name: 'PVEM', votes: pvem },
      { name: 'MORENA', votes: morena },
      { name: 'PT', votes: pt },
      { name: 'QI', votes: qi },
      { name: 'PES', votes: pes },
      { name: 'RSP', votes: rsp },
      { name: 'FM', votes: fm },

      // Coaliciones 
      { name: 'PAN-QI', votes: pan_qi },
      { name: 'PRI-PVEM', votes: pri_pvem },
      { name: 'PVEM-PT', votes: pvem_pt },
      { name: 'PAN-PRD-QI', votes: pan_prd_qi },
      { name: 'PAN-PRD', votes: pan_prd },
      { name: 'PRD-QI', votes: prd_qi },
      { name: 'PT-QI', votes: pt_qi },
    ];

    allCandidates.sort((a, b) => b.votes - a.votes);
    const winner = allCandidates[0].votes > 0 ? allCandidates[0].name : 'N/A';

    results[seccion] = {
      seccion,
      municipio,

      pan, pri, prd, mc, pvem, morena, pt, qi,

      ...ci,

      pan_qi, pri_pvem, pvem_pt, pan_prd_qi, pan_prd, prd_qi, pt_qi,

    
      num_noreg,
      nulos,
      total_votos,
      lista_nominal,

      winner
    };
  });

  return results;
};

export const ELECTION_RESULTS_2021 = parseElectionData21(RAW_ELECTION_DATA21);