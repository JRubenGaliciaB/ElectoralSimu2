import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap as useLeafletMap, GeoJSON } from 'react-leaflet';
import { LayerType, GeoLocation } from '../types'; 
import { getIconByCategory, Icons } from './MapIcons';
import { ELECTION_RESULTS_2024 } from '../data/electionData';
import { ELECTION_RESULTS_2021 } from '../data/electionData21';
import { ELECTION_RESULTS_2018 } from '../data/electionData18';
import { ConevalData } from '../data/Coneval';
import { useLayerControls } from '../context/LayerControlContext'; 
import { useAppContext } from '../context/MapContext';
import { useChatContext } from '../context/ChatContext';
import { getPartyColor, generatePopupHtml, getPovertyColor, getPovertyLabel, pobrezaColorStops  } from './mapUtils';
import { Layers } from 'lucide-react';
import LegendPob from './LegendPob';



// Component to update view
const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
 const map = useLeafletMap();
 useEffect(() => { map.setView(center, zoom); }, [center, zoom, map]);
 return null;
}; 

// Event handler
const MapEventsHandler: React.FC<{ onMoveEnd: (center: { lat: number; lng: number }, zoom: number) => void }> = ({ onMoveEnd }) => {
 const map = useLeafletMap();
 useEffect(() => {
 const handleMoveEnd = () => {
 const center = map.getCenter();
 onMoveEnd({ lat: center.lat, lng: center.lng }, map.getZoom());
 };
  map.on('moveend', handleMoveEnd);
 return () => { map.off('moveend', handleMoveEnd); };
}, [map, onMoveEnd]);
 return null;
};

const MapSizeInvalidator: React.FC = () => {
 const map = useLeafletMap();

 useEffect(() => {
 // Utilizamos setTimeout para asegurar que el contenedor ha finalizado su renderizado
 // y ha tomado sus dimensiones CSS finales (h-screen, w-full, etc.)
 const timer = setTimeout(() => {
 map.invalidateSize();
 }, 50);

 return () => clearTimeout(timer); // Limpieza
 }, [map]);

 return null;
};

// --- MAIN COMPONENT ---

interface MapViewerProps {
 onMapMoveEnd: (center: { lat: number; lng: number }, zoom: number, locations: GeoLocation[]) => void;
 districtsData?: any;
}

const MapViewer: React.FC<MapViewerProps> = ({
  onMapMoveEnd, districtsData,
}) => {
  const [layerOpacity, setLayerOpacity] = useState(0.45);
  const { 
    activeLayer, 
    showDistricts, 
    showElectionResults, 
    showElectionResults21, 
    showElectionResults18,
    showConeval 
  } = useLayerControls();

  const { mapCenter, mapZoom, userLocation } = useAppContext();
  const { searchResults } = useChatContext();


  // 1. Tile layer selection logic
  const getTileUrl = () => {
    switch (activeLayer) { // Now activeLayer comes from the Context
      case LayerType.SATELLITE: return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case LayerType.DARK: return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
      case LayerType.TERRAIN: return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}";
      default: return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  // 2. Determine which electoral data is active (Centralized logic)
  const activeElectionData = useMemo(() => {
    // These variables now come from the Context
    if (showElectionResults) return { year: '2024', data: ELECTION_RESULTS_2024 };
    if (showElectionResults21) return { year: '2021', data: ELECTION_RESULTS_2021 };
    if (showElectionResults18) return { year: '2018', data: ELECTION_RESULTS_2018 };

    return null; 
  }, [showElectionResults, showElectionResults21, showElectionResults18]);

  const activeConevalData = useMemo(() => {
      if (showConeval) return ConevalData;
      return null;
  }, [showConeval]);

  // 3. Unified GeoJSON style
  const geoJsonStyle = (feature: any) => {
    const sectionId = feature?.properties?.SECCION?.toString();
    
    // 1. Capa Electoral ( Prioridad Alta)
    if (activeElectionData) {
        const result = activeElectionData.data[sectionId];
        const color = result ? getPartyColor(result.winner) : '#ccc'; 
        
        // Retorna el estilo electoral. Esto se aplicará si hay datos electorales activos.
        return {
            color: '#ccc', weight: 2, opacity: 1, fillColor: color, fillOpacity: layerOpacity
        };
    }

    // 2. Capa de CONEVAL (Prioridad Media)
    if (activeConevalData) {
        const result = activeConevalData[sectionId];
        if (result && result.nivelPobreza) {
            const color = getPovertyColor(result.nivelPobreza);
            
            // Retorna el estilo de Coneval SOLAMENTE si no se aplicó el estilo electoral.
            return {
                color: '#fff', weight: 1, opacity: 1, fillColor: color, fillOpacity: layerOpacity
            };
        }
    }
    
    // 3. Estilo por defecto (solo distritos - Prioridad Baja)
    // Se aplica si NINGUNA de las capas anteriores (Electoral o Coneval) está activa o tiene datos.
    return {
        color: '#ccc', weight: 2, opacity:layerOpacity, fillColor: '#fff', fillOpacity:layerOpacity
    };
}

  // 4. Unified GeoJSON Popup
  const onEachFeature = (feature: any, layer: any) => {
    const section = feature.properties?.SECCION || 'N/A';
    const municipality = feature.properties?.MUNICIPIO || 'N/A';
    const distF = feature.properties?.DISTRITO_F || 'N/A';
    const distL = feature.properties?.DISTRITO_L || 'N/A';
    let htmlContent = '';
    const sectionStr = section.toString();

    if (activeElectionData) {
        const result = activeElectionData.data[sectionStr];
        htmlContent = generatePopupHtml(section, municipality, result);
    } 
    
    // Prioridad 2: Coneval (si solo está activa, o añade su info a htmlContent)
    if (activeConevalData) {
        const result = activeConevalData[sectionStr];
        if (result && result.nivelPobreza !== undefined) {
             const label = getPovertyLabel(result.nivelPobreza);
             const povertyHtml = `<p class="mt-2"><b>Nivel de Pobreza:</b> ${label} (${result.nivelPobreza})</p>`;
             
             // Si ya existe contenido electoral, lo concatenamos. Si no, lo creamos.
             if (htmlContent) {
                 htmlContent = htmlContent.replace('</div>', `${povertyHtml}</div>`); // Asume un div de cierre
             } else {
                 htmlContent = `<div class="font-sans text-black"><h4 class="font-bold">Sección ${section}</h4>${povertyHtml}</div>`;
             }
        }
    }
    // Prioridad 3: Distrito Simple
    if (htmlContent) {
        layer.bindPopup(htmlContent);

    } else {
        // Simple districts popup
        layer.bindPopup(`
            <div class="font-sans text-black">
                <h4 class="font-bold text-[#D32F2F] border-b border-gray-200 pb-1 mb-1">Section ${section}</h4>
                <div class="text-xs text-gray-700 space-y-1">
                    <div><b>Mun:</b> ${municipality}</div>
                    <div><b>Dist F:</b> ${distF}</div>
                    <div><b>Dist L:</b> ${distL}</div>
                </div>
            </div>
        `);
    }
  };

  // Unique key to force re-rendering of GeoJSON when data or mode changes
const geoJsonKey = `geo-layer-${activeElectionData ? activeElectionData.year : 'districts'}-${showConeval ? 'coneval' : 'no-coneval'}`;
  return (
    <MapContainer 
      center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', zIndex: 450 }} zoomControl={false}
    >
      <TileLayer url={getTileUrl()} attribution="&copy; Contributors" />
      <ZoomControl position="bottomright" />
      {/* } <MapUpdater center={mapCenter} zoom={mapZoom} />*/}

      <MapSizeInvalidator /> 

 {(showDistricts || activeElectionData ||showConeval ) && districtsData && (
 <GeoJSON 
 key={geoJsonKey} 
 data={districtsData} 
 style={geoJsonStyle}
 onEachFeature={onEachFeature}
 />
 )}

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={Icons.UserLocation}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {searchResults.map((loc, idx) => (
          <Marker 
            key={loc.id || `${loc.lat}-${loc.lng}-${idx}`} 
            position={[loc.lat, loc.lng]} 
            icon={getIconByCategory(loc.category)}
          >
            <Popup>
              <div className="p-1 text-black">
                <h3 className="font-bold text-sm">{loc.name}</h3>
                {loc.description && <p className="text-xs mt-1">{loc.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Bottom Center: Opacity Slider */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-2 animate-slideUp w-72">
         <div className="glass-panel p-3 rounded-full flex items-center gap-3 shadow-xl border-white/10 bg-slate-950/80">
            <Layers className="text-neon-blue w-4 h-4 shrink-0 ml-1" />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono uppercase mb-1 px-1">
                 <span>Overlay Opacity</span>
                 <span className="text-white">{Math.round(layerOpacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="1" step="0.05" 
                value={layerOpacity}
                onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                onMouseDown={(e) => e.stopPropagation()} // Stop drag propagation to map
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
              />
            </div>
         </div>
      </div>

             {/* Leyenda de Pobreza */}
      {showConeval && (
        <LegendPob 
          title="Grado de Pobreza Urbana (2020)"
          colorStops={pobrezaColorStops}
          minLabel="Bajo"
          maxLabel="Alto"
        />
      )}
      
      <MapEventsHandler onMoveEnd={onMapMoveEnd} />
    </MapContainer>
  );
};
export default MapViewer;