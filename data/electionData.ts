
import { ElectionResult } from '../types';

// PASTE YOUR RAW EXCEL DATA HERE
// Format: MUNICIPIO	SECCION	PAN	PRI	PRD	MC	PVEM	MORENA	PT	QS	EMC	JBLL	RHR	LDBG	ATV	SSP	MRGH	SMG	PVEM-MORENA-PT	PVEM-MORENA	PVEM-PT	MORENA-PT	PAN-PRI-PRD	PAN-PRI	PAN-PRD	PRI-PRD	NO_REGISTRADAS	NULOS	TOTAL_VOTOS	LISTA_NOMINAL
const RAW_ELECTION_DATA = `
Colon	76	108	256	8	331	68	111	81	46	12	69	0	0	0	0	0	0	0	0	0	0	32	15	0	0	0	31	1168	1752
Colon	77	111	233	5	519	86	153	77	33	19	70	0	0	0	0	0	0	0	0	0	0	33	13	0	0	0	48	1400	2015
Colon	78	98	243	5	290	41	134	56	56	11	53	0	0	0	0	0	0	0	0	0	0	31	16	1	2	0	34	1071	1482
Colon	79	250	434	16	804	107	390	199	72	32	130	0	0	0	0	0	0	0	0	0	0	48	21	2	1	3	111	2620	4219
Colon	80	33	60	4	88	11	24	13	8	0	7	0	0	0	0	0	0	0	0	0	0	4	6	0	0	0	26	284	505
Colon	81	129	218	8	312	20	75	57	11	8	14	0	0	0	0	0	0	0	0	0	0	17	16	1	2	0	62	950	1537
Colon	82	70	144	2	334	26	99	94	12	3	18	0	0	0	0	0	0	0	0	0	0	15	7	0	1	0	58	883	1308
Colon	84	84	75	8	277	118	114	87	20	32	19	0	0	0	0	0	0	0	0	0	0	14	10	0	0	0	72	930	1704
Colon	85	82	35	3	259	55	261	21	9	3	13	0	0	0	0	0	0	0	0	0	0	4	3	0	0	0	41	789	1226
Colon	86	49	91	2	410	15	116	50	49	78	23	0	0	0	0	0	0	0	0	0	0	12	11	0	0	1	74	981	1625
Colon	87	128	183	9	404	116	430	28	14	2	75	0	0	0	0	0	0	0	0	0	0	10	8	2	0	4	60	1473	2308
Colon	88	154	227	10	444	119	526	61	8	12	113	0	0	0	0	0	0	0	0	0	0	33	17	1	1	3	74	1803	2880
Colon	90	78	74	2	239	43	262	339	33	19	16	0	0	0	0	0	0	0	0	0	0	9	9	1	0	0	62	1186	1813
Colon	91	79	76	4	277	56	153	349	13	7	17	0	0	0	0	0	0	0	0	0	0	9	8	1	1	1	78	1129	1809
Colon	94	136	189	17	679	34	202	170	20	107	66	0	0	0	0	0	0	0	0	0	0	42	13	0	0	2	96	1773	3381
Colon	95	137	132	7	411	40	187	343	55	93	24	0	0	0	0	0	0	0	0	0	0	19	8	0	0	0	54	1510	2685
Colon	96	177	192	6	524	90	382	467	16	20	33	0	0	0	0	0	0	0	0	0	0	10	9	0	0	0	75	2001	3274
Colon	894	133	130	17	296	104	140	92	29	95	53	0	0	0	0	0	0	0	0	0	0	36	12	0	0	0	86	1223	2290
Colon	895	83	63	4	230	38	126	152	6	20	21	0	0	0	0	0	0	0	0	0	0	9	5	0	0	0	38	795	1428
Colon	896	281	239	11	615	39	385	158	18	17	15	0	0	0	0	0	0	0	0	0	0	37	19	0	0	0	77	1911	2624
Colon	897	36	42	1	313	22	117	73	12	30	24	0	0	0	0	0	0	0	0	0	0	5	2	3	0	0	28	708	1024
Colon	971	111	135	4	220	54	106	96	49	6	38	0	0	0	0	0	0	0	0	0	0	26	15	1	2	1	56	920	1750
Colon	972	147	236	6	564	29	125	24	14	7	39	0	0	0	0	0	0	0	0	0	0	34	15	2	0	0	69	1311	1972
Colon	973	123	86	12	518	34	151	164	22	201	39	0	0	0	0	0	0	0	0	0	0	19	8	0	0	1	46	1424	2387
Colon	974	114	109	7	345	38	341	119	52	102	21	0	0	0	0	0	0	0	0	0	0	18	11	1	0	0	75	1353	2271
`;

const parseElectionData = (rawData: string): Record<string, ElectionResult> => {
  const results: Record<string, ElectionResult> = {};
  // Split by new line, filtering out empty lines
  const lines = rawData.trim().split('\n').filter(line => line.trim().length > 0);

  lines.forEach(line => {
    // Split by tab (standard for Excel copy/paste)
    const parts = line.trim().split(/\t/);
    
    // Check if we have enough columns
    if (parts.length < 10) return; 

    const municipio = parts[0].trim();
    const seccion = parts[1].trim();
    
    const parseNum = (val: string) => {
        const cleaned = val ? val.replace(/,/g, '').trim() : '0';
        return parseInt(cleaned, 10) || 0;
    };

    // Mapping based on:
    // MUNICIPIO	SECCION	PAN	PRI	PRD	MC	PVEM	MORENA	PT	QS	EMC	JBLL	RHR	LDBG	ATV	SSP	MRGH	SMG	PVEM-MORENA-PT	PVEM-MORENA	PVEM-PT	MORENA-PT	PAN-PRI-PRD	PAN-PRI	PAN-PRD	PRI-PRD	NO_REGISTRADAS	NULOS	TOTAL_VOTOS	LISTA_NOMINAL
    
    const pan = parseNum(parts[2]);
    const pri = parseNum(parts[3]);
    const prd = parseNum(parts[4]);
    const mc = parseNum(parts[5]);
    const pvem = parseNum(parts[6]);
    const morena = parseNum(parts[7]);
    const pt = parseNum(parts[8]);
    const qs = parseNum(parts[9]); // Queretaro Seguro
    
    // Independents / Others
    const emc = parseNum(parts[10]);
    const jbll = parseNum(parts[11]);
    const rhr = parseNum(parts[12]);
    const ldbg = parseNum(parts[13]);
    const atv = parseNum(parts[14]);
    const ssp = parseNum(parts[15]);
    const mrgh = parseNum(parts[16]);
    const smg = parseNum(parts[17]);

    // Coalitions
    const pvem_morena_pt = parseNum(parts[18]);
    const pvem_morena = parseNum(parts[19]);
    const pvem_pt = parseNum(parts[20]);
    const morena_pt = parseNum(parts[21]);
    const pan_pri_prd = parseNum(parts[22]);
    const pan_pri = parseNum(parts[23]);
    const pan_prd = parseNum(parts[24]);
    const pri_prd = parseNum(parts[25]);

    const num_noreg = parseNum(parts[26]);
    const nulos = parseNum(parts[27]); 
    const total_votos = parseNum(parts[28]); 
    const lista_nominal = parseNum(parts[29]);

    // Determine Winner
    const allCandidates = [
        { name: 'PAN', votes: pan },
        { name: 'PRI', votes: pri },
        { name: 'PRD', votes: prd },
        { name: 'MC', votes: mc },
        { name: 'PVEM', votes: pvem },
        { name: 'MORENA', votes: morena },
        { name: 'PT', votes: pt },
        { name: 'QS', votes: qs },
        // Independents
        { name: 'EMC', votes: emc },
        { name: 'JBLL', votes: jbll },
        { name: 'RHR', votes: rhr },
        { name: 'LDBG', votes: ldbg },
        { name: 'ATV', votes: atv },
        { name: 'SSP', votes: ssp },
        { name: 'MRGH', votes: mrgh },
        { name: 'SMG', votes: smg },
        // Coalitions (Considered as entities for winning purposes in this context)
        { name: 'PVEM-MORENA-PT', votes: pvem_morena_pt },
        { name: 'PVEM-MORENA', votes: pvem_morena },
        { name: 'PVEM-PT', votes: pvem_pt },
        { name: 'MORENA-PT', votes: morena_pt },
        { name: 'PAN-PRI-PRD', votes: pan_pri_prd },
        { name: 'PAN-PRI', votes: pan_pri },
        { name: 'PAN-PRD', votes: pan_prd },
        { name: 'PRI-PRD', votes: pri_prd },
    ];
    
    // Sort by votes descending to find winner
    allCandidates.sort((a, b) => b.votes - a.votes);
    const winner = allCandidates[0].votes > 0 ? allCandidates[0].name : 'N/A';

    results[seccion] = {
        seccion,
        municipio,
        pan, pri, prd, mc, pvem, morena, pt, queretaro_seguro: qs,
        emc, jbll, rhr, ldbg, atv, ssp, mrgh, smg,
        pvem_morena_pt, pvem_morena, pvem_pt, morena_pt,
        pan_pri_prd, pan_pri, pan_prd, pri_prd,
        num_noreg, nulos, total_votos, lista_nominal,
        winner
    };
  });

  return results;
};

export const ELECTION_RESULTS_2024 = parseElectionData(RAW_ELECTION_DATA);
