import L from 'leaflet';

// Helper to create SVG icon
const createIcon = (color: string) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>`;
  
  return new L.DivIcon({
    className: 'custom-marker',
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export const Icons = {
  Default: createIcon('#D32F2F'), // Red 
  Education: createIcon('#1976D2'), // Blue
  Health: createIcon('#388E3C'), // Green
  Government: createIcon('#7B1FA2'), // Purple
  Commercial: createIcon('#FBC02D'), // Yellow
  UserLocation: new L.DivIcon({
    className: 'user-location-marker',
    html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  })
};

export const getIconByCategory = (category?: string) => {
  if (!category) return Icons.Default;
  const lower = category.toLowerCase();
  if (lower.includes('edu') || lower.includes('school')) return Icons.Education;
  if (lower.includes('health') || lower.includes('hosp')) return Icons.Health;
  if (lower.includes('gov')) return Icons.Government;
  if (lower.includes('store') || lower.includes('shop') || lower.includes('comm')) return Icons.Commercial;
  return Icons.Default;
};