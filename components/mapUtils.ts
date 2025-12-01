// We unify the color logic in a pure function outside the component
export const getPartyColor = (partyName: string) => {
    if (!partyName) return '#999999';
    const name = partyName.toUpperCase();
    
    // Coalitions and special cases
    if (name.includes('PAN') && name.includes('PRI') && name.includes('PRD')) return '#00498E';
    if (name.includes('MORENA') && name.includes('PVEM') && name.includes('PT')) return '#890a23';
    
    // Simple color map
    const colors: Record<string, string> = {
    'PAN': '#00498E', 'PRI': '#E20713', 'PRD': '#FFD400',
    'MC': '#FF8200', 'PVEM': '#50AC42', 'MORENA': '#890a23',
   'PT': '#f9a9ba', 'QS': '#ffafff', 'EMC': '#607D8B',
   'QI': '#607D8B', 'PES': '#607D8B', 'RSP': '#607D8B',
   'FM': '#607D8B', 'NA': '#00A59C', 'ES': '#607D8B'
 };
   
    return colors[name] || '#999999';
   };
   
   // Function to generate the Popup HTML (extracted for cleanliness)
   export const generatePopupHtml = (section: string, municipality: string, result: any) => {
    if (!result) return `<div class="text-black">Section ${section}: No data available.</div>`;
   
    // Normalize candidate data to display it generically
    let candidates = [];
    
    // Claves a ignorar
    const explicitlyIgnoredKeys = new Set([
        'section', 'winner', 'total_votos', 'nulos', 'municipio',
        'lista_nominal', 'num_noreg', 'no_registradas', 'lista-nominal' 
    ]);
    
    Object.keys(result).forEach(key => {
        const lowerCaseKey = key.toLowerCase();
        // Si la clave es numérica y no está en nuestra lista de ignorados explícitos
        if (typeof result[key] === 'number' && !explicitlyIgnoredKeys.has(lowerCaseKey)) {
            const partyName = key.toUpperCase().replace(/_/g, '-');
            candidates.push({
                name: partyName,
                votes: result[key],
                color: getPartyColor(partyName)
            });
        }
    });
   
    // Sort and Top 3
    candidates.sort((a, b) => b.votes - a.votes);
    const top3 = candidates.slice(0, 3);
    
    // Calculate others
    const othersVotes = candidates.slice(3).reduce((acc, curr) => acc + curr.votes, 0);
    const totalOthers = othersVotes + (result.nulos || 0) + (result.no_registradas || 0);
    const totalVotes = result.total_votos || result.TOTAL_VOTOS || 0; // Handle inconsistency in capitalization in your data
   
    const rowsHtml = top3.map(item => `
      <tr>
        <td class="py-1 border-b border-gray-200">
          <span class="w-2 h-2 inline-block rounded-full mr-1" style="background:${item.color}"></span>
          <span class="text-black font-medium">${item.name}</span>
        </td>
        <td class="text-right border-b border-gray-200 font-mono text-black font-bold">${item.votes}</td>
      </tr>
    `).join('');
   
    const othersHtml = `
      <tr>
        <td class="py-1 border-b border-gray-200"><span class="w-2 h-2 inline-block rounded-full mr-1 bg-gray-400"></span><span class="text-gray-600 italic">Others</span></td>
        <td class="text-right border-b border-gray-200 font-mono text-gray-600">${totalOthers}</td>
      </tr>`;
   
    return `
      <div class="font-sans w-[240px] text-black">
        <h4 class="font-bold text-black border-b border-gray-300 pb-1 mb-2 text-sm">Section ${section} - ${municipality}</h4>
        <div class="mb-2 text-xs font-bold text-center p-1 bg-gray-100 rounded border border-gray-200 text-black">
          Winner: <span style="color:${getPartyColor(result.winner)}">${result.winner}</span>
        </div>
        <table class="w-full text-xs border-collapse">
            <tbody>${rowsHtml}${othersHtml}</tbody>
            <tfoot class="font-bold bg-gray-100 text-black">
              <tr><td class="py-1 px-1 border-t border-gray-300">Total</td><td class="text-right px-1 border-t border-gray-300">${totalVotes}</td></tr>
            </tfoot>
        </table>
      </div>
    `;
   };