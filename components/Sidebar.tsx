import React, { useState } from 'react';
import { Layers, ScanEye, CircleDollarSign, ChevronDown, ChevronUp, Vote, ChevronRight } from 'lucide-react';
import { LayerType } from '../types';
import { useLayerControls } from '../context/LayerControlContext';
import { Simulador } from './Simulador'; 

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface Tab {
  id: 'Layer' | 'Simulador';
  icon: React.ElementType;
  label: string;
}

const tabs: Tab[] = [
  { id: 'Layer', icon: Layers, label: 'Layer' },
  { id: 'Simulador', icon: ScanEye, label: 'Simulador' },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  const {
    activeLayer,
    onLayerChange,
    isBaseMapsOpen,
    setIsBaseMapsOpen,
    showDistricts,
    toggleDistricts,
    showElectionResults,
    toggleElectionResults,
    showElectionResults21,
    toggleElectionResults21,
    showElectionResults18,
    toggleElectionResults18,
    showConeval,
    toggleConeval,
  } = useLayerControls();

  
  const [activeTab, setActiveTab] = useState<Tab['id']>('Layer');
  const [isElectoralDataOpen, setIsElectoralDataOpen] = useState(true); // false, si quieres que inicie plegado // menu electoral
  const [isSocioDOpen, setIsSocioDOpen] = useState(false); // menu sociodemografico


  return (
<div className={`h-full bg-black shadow-2xl z-[500] flex-shrink-0 flex flex-col border-l border-gray-200 fixed top-0 right-0 transition-transform duration-300 ${isOpen ? 'translate-x-0 w-80 pointer-events-auto' : 'translate-x-full w-80 pointer-events-none'}`}> 	 	
  {/* 1. TOP BAR (Close Button) - Dark mode style */}
<div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
  <button // Botón  cerrar Sidebar
  onClick={toggleSidebar}
  className="p-2 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
  title="Close Menu"
  >
  <ChevronRight size={24} />
  </button>
  <h2 className="text-xl font-bold text-white text-center">Simulador Electoral</h2> 
</div>

{/* 2. MAIN MENU  */}
<div className={`flex justify-around border-b border-slate-700 bg-black/85 shadow-lg`}> 
  {tabs.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
          <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-3 text-center transition-all duration-200 relative group
                  ${isActive 
                      ? `text-white font-semibold after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-white` 
                      : 'text-white hover:bg-white/20'
                  }`}
              title={tab.label}
          >
              <tab.icon size={20} className="mx-auto mb-1" />
              <span className="text-xs hidden sm:inline">{tab.label}</span>
          </button>
      );
  })}
</div>

{/* 3. CONTENT AREA: Expands and has scroll - Dark background */}
<div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-800/20 backdrop-blur-sm">
  
  {/* LAYERS TAB */}
  {activeTab === 'Layer' && (
    <div className="space-y-6">
      <div>
        
        <button
          onClick={() => setIsBaseMapsOpen(!isBaseMapsOpen)}
          className="w-full flex items-center justify-between group mb-3 focus:outline-none"
        >
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">Base Maps</h3>
          {isBaseMapsOpen 
            ? <ChevronUp size={16} className="text-slate-400 group-hover:text-white" /> 
            : <ChevronDown size={16} className="text-slate-400 group-hover:text-white" />}
        </button>
        
        {isBaseMapsOpen && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
            {[
              { id: LayerType.STREET, name: 'Standard Streets', desc: 'OpenStreetMap Default' },
              { id: LayerType.SATELLITE, name: 'Satellite Imagery', desc: 'Esri World Imagery' },
              { id: LayerType.DARK, name: 'Night Mode', desc: 'CartoDB Dark Matter' }
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => onLayerChange(layer.id)} 
                className={`w-full text-left p-3 rounded-lg border transition-all bg-slate-900/50 hover:bg-slate-700/50 
                  ${activeLayer === layer.id 
                      ? 'border-blue-500 shadow-lg shadow-blue-900/50' // Active base map style
                      : 'border-slate-500'}`} // Inactive base map style
              >
                <div className="flex items-center gap-3">
                  
                  {/* Active layer indicator */}
                  <div className={`w-4 h-4 rounded-full border-2 
                      ${activeLayer === layer.id ? `border-blue-500 bg-blue-800` : 'border-slate-500'}`}>
                  </div>
                  <div>
                    <p className={`font-medium ${activeLayer === layer.id ? 'text-white' : 'text-slate-200'}`}>{layer.name}</p>
                    <p className="text-xs text-slate-400">{layer.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="pt-4 border-t border-slate-700">
  {/* Botón de control para Resultados Electorales */}
  <button
    onClick={() => setIsElectoralDataOpen(!isElectoralDataOpen)}
    className="w-full flex items-center justify-between group mb-3 focus:outline-none"
  >
    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
      Resultados Electorales (Data)
    </h3>
    {/* Icono de flecha */}
    {isElectoralDataOpen 
      ? <ChevronUp size={16} className="text-slate-400 group-hover:text-white" /> 
      : <ChevronDown size={16} className="text-slate-400 group-hover:text-white" />}
  </button>
  
  {/* La lista de overlays solo se muestra si isElectoralDataOpen es true */}
  {isElectoralDataOpen && (
    <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
      {[
        // ... Lista de objetos de datos electorales ...
        {
              id: 'districts',
              label: 'Electoral Sections',
              description: 'Internal GeoJSON Database',
              icon: null,
              show: showDistricts,
              toggle: toggleDistricts,
            },
            {
              id: 'election2024',
              label: '2024 Results',
              description: 'Presidencias Municipales',
              icon: Vote,
              show: showElectionResults,
              toggle: toggleElectionResults,
            },
            {
              id: 'election2021',
              label: '2021 Results',
              description: 'Presidencias Municipales',
              icon: Vote,
              show: showElectionResults21,
              toggle: toggleElectionResults21,
            },
            {
              id: 'election2018',
              label: '2018 Results',
              description: 'Presidencias Municipales',
              icon: Vote,
              show: showElectionResults18,
              toggle: toggleElectionResults18,
            }


      ].map((overlay) => (
        <div
          // ... Overlay ...
          key={overlay.id}
    className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-colors ${
    overlay.show 
      ? 'border border-blue-500 shadow-lg shadow-blue-900/50 bg-slate-800' // Estilo para seleccionado
      : 'hover:bg-slate-700/50' // Estilo para no seleccionado/hover
  }`}              onClick={overlay.toggle}
            >
              <div className={`w-5 h-5 flex items-center justify-center rounded border transition-all ${overlay.show ? 'border-blue-500 bg-blue-600' : 'border-slate-600 bg-slate-800'}`}>
                {overlay.show && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              {overlay.icon && <overlay.icon size={16} className="text-slate-300" />}
              <div>
                <span className="text-sm font-medium text-white">{overlay.label}</span>
                <p className="text-[10px] text-slate-400">{overlay.description}</p>
              </div>
            </div>
      ))}
    </div>
  )}      
          
        </div>


      <div className="pt-4 border-t border-slate-700">
  {/* Botón de control para SocioD */}
  <button
    onClick={() => setIsSocioDOpen(!isSocioDOpen)}
    className="w-full flex items-center justify-between group mb-3 focus:outline-none"
  >
    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
      Perfil Sociodemográfico 
    </h3>
    {/* Icono de flecha */}
    {isSocioDOpen 
      ? <ChevronUp size={16} className="text-slate-400 group-hover:text-white" /> 
      : <ChevronDown size={16} className="text-slate-400 group-hover:text-white" />}
  </button>

      {/* La lista de overlays solo se muestra si isSocioDOpen es true */}
  {isSocioDOpen && (
    <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
      {[
        // ... Lista de objetos de datos SocioD  ...
            {
              id: 'pobrezaconeval',
              label: 'Pobreza Urbana 2020',
              description: 'CONEVAL',
              icon: CircleDollarSign,
              show: showConeval,
              toggle: toggleConeval,
            },


      ].map((overlay) => (
        <div
          // ... Overlay ...
          key={overlay.id}
    className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-colors ${
    overlay.show 
      ? 'border border-blue-500 shadow-lg shadow-blue-900/50 bg-slate-800' // Estilo para seleccionado
      : 'hover:bg-slate-700/50' // Estilo para no seleccionado/hover
  }`}              onClick={overlay.toggle}
            >
              <div className={`w-5 h-5 flex items-center justify-center rounded border transition-all ${overlay.show ? 'border-blue-500 bg-blue-600' : 'border-slate-600 bg-slate-800'}`}>
                {overlay.show && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              {overlay.icon && <overlay.icon size={16} className="text-slate-300" />}
              <div>
                <span className="text-sm font-medium text-white">{overlay.label}</span>
                <p className="text-[10px] text-slate-400">{overlay.description}</p>
              </div>
            </div>
      ))}
    </div>
  )}

  </div>
</div>

  )}
  
  {/* SIMULADOR TAB */}
  {activeTab === 'Simulador' && <Simulador />}
</div>

  	 	</div> 	 	
  );
};

export default Sidebar;