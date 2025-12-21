import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, MessageSquare, Info, ChevronLeft, X, ChevronRight, Loader, BookOpen, Network, Cpu, Menu } from 'lucide-react';
import { ChatMessage, GeoLocation } from '../types'; 
import { useLayerControls } from '../context/LayerControlContext'; 

const PRIMARY_COLOR_HEX = '#1976D2'; // Material Design Blue 700

// --- Tipos ---
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar2: () => void;
  // Props de Búsqueda
  searchResults: GeoLocation[];
  onLocationSelect: (loc: GeoLocation) => void;
  isSearching: boolean;
  onSearch: (query: string) => void;
  // Props de Chat
  chatHistory: ChatMessage[];
  onChatSend: (msg: string) => void;
}

interface Tab {
  id: 'info' | 'search' | 'chat';
  icon: React.ElementType;
  label: string;
}

const tabs: Tab[] = [
  { id: 'info', icon: Info, label: 'Info' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'chat', icon: MessageSquare, label: 'Assistant' },
];

// --- Componentes Modulares de los Tabs ( Search, Chat, Info) ---

/**
 * Componente para el Tab de Búsqueda (Geocodificación).
 * Recibe props directamente de Sidebar2.
 */
interface SearchTabProps {
  searchResults: GeoLocation[];
  onLocationSelect: (loc: GeoLocation) => void;
  isSearching: boolean;
  onSearch: (query: string) => void;
}

const SearchTab: React.FC<SearchTabProps> = ({ searchResults = [], onLocationSelect, isSearching, onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearch(searchInput);
  }, [searchInput, onSearch]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    onSearch('');
  }, [onSearch]);

  const showClearButton = searchInput.length > 0 && !isSearching;
  
  // Safety: Ensure we have an array to work with
  const resultsCount = searchResults?.length || 0;

  return (
    <div className="space-y-4 text-white">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for an address or point of interest..."
          className="w-full p-3 pr-10 border border-slate-600 bg-slate-700 text-white rounded-lg shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-400"
          disabled={isSearching}
        />
        {isSearching && (
          <Loader size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 animate-spin" />
        )}
        {showClearButton && (
          <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white" title="Clear Search">
            <X size={20} />
          </button>
        )}
      </form>
      
      {isSearching && <p className="text-sm text-blue-400">Searching...</p>}
      
      {!isSearching && resultsCount > 0 ? ( 
        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <h4 className="text-xs font-semibold uppercase text-slate-400">
            Resultados ({resultsCount})
          </h4>
          {searchResults.map((result: GeoLocation, index) => (
            <div 
              key={result.id || `${result.lat}-${result.lng}-${index}`} 
              onClick={() => onLocationSelect(result)}
              className="p-3 bg-slate-700 border border-slate-600 rounded-lg shadow-md hover:bg-slate-600 hover:border-blue-500 cursor-pointer transition-colors"
            >
              <p className="font-medium text-sm text-white">{result.name}</p>
              {result.description && result.description !== result.name && (
                <p className="text-xs text-slate-400 mt-1">{result.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : searchInput.length > 0 && !isSearching && resultsCount === 0 ? (
        <p className="text-sm text-slate-400">No results found for "{searchInput}".</p>
      ) : (
        !isSearching && <p className="text-sm text-slate-400">Enter a term to search for addresses or places.</p>
      )}
    </div>
  );
};

/**
 * Componente para el Tab del Chat (Asistente de IA).
 * Recibe props directamente de Sidebar2.
 */
interface ChatTabProps {
  chatHistory: ChatMessage[];
  onChatSend: (msg: string) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ chatHistory, onChatSend }) => {
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onChatSend(chatInput); // Usa onChatSend de las props
    setChatInput('');
  }, [chatInput, onChatSend]);

  return (
    <div className="flex flex-col h-full min-h-[500px] text-white"> 
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-4 p-1 pb-4 pr-2 custom-scrollbar">
        {chatHistory.length === 0 && (
          <div className="p-4 text-center text-slate-400 text-sm">
            <MessageSquare size={24} className="mx-auto mb-2 text-slate-500" />
            <p>Start a conversation with the Assistant. You can ask about map data or the application.</p>
          </div>
        )}
        {chatHistory.map((msg: ChatMessage, index) => (
          <div 
            // Usa index como fallback, o mejor un ID único si no está garantizado
            key={msg.id || index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${
                msg.role === 'user'
                ? `bg-[${PRIMARY_COLOR_HEX}] text-white rounded-br-none` 
                : 'bg-slate-700 text-white rounded-tl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <span className="text-[10px] opacity-70 mt-1 block text-right">
                {/* Aseguramos que la conversión sea segura */}
                {new Date(isNaN(parseInt(msg.id)) ? Date.now() : parseInt(msg.id)).toLocaleTimeString()} 
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Chat Form */}
      <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!chatInput.trim()}
          className={`p-3 rounded-lg text-white transition-colors ${!chatInput.trim() ? 'bg-slate-500 cursor-not-allowed' : `bg-[${PRIMARY_COLOR_HEX}] hover:bg-blue-600`}`}
          title="Send Message"
        >
          <ChevronRight size={20} />
        </button>
      </form>
    </div>
  );
};

/**
 * Componente para el Tab de Información.
 */
// El InfoTab no necesita props, por lo que se mantiene simple
const InfoTab: React.FC = () => {
  // LaTeX para los bloques de texto:
  const markovChainText = `Voter migration is modeled not as a static preference but as a probability matrix. Each simulation step calculates transition probabilities ($P_{ij}$) representing voters moving from Party $i$ to Party $j$ based on debate performance and economic indicators.`;
  const gameTheoryText = `Candidates are treated as rational agents maximizing a payoff function (Votes). Adjusting "Ideology" changes the Nash Equilibrium of the map, penalizing candidates who stray too far from the median voter theorem of specific hex clusters.`;
  
  return (
    <div className="space-y-6 text-white h-full text-justify p-4"> 
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tighter bg-clip-text bg-gradient-to-r from-white to-gray-600 mb-2 text-transparent">
            SIMULADOR ELECTORAL
          </h1>
          <div className="text-[10px] font-mono text-slate-500">V.1.0_BETA // DATA_FOX </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-green-400" /> 
              MARKOV CHAINS
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed text-justify p-4">
              {markovChainText}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-pink-400" />
              GAME THEORY
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed text-justify p-4">
              {gameTheoryText}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              SPATIAL MODELING
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed text-justify p-4">
              The map uses a Voronoi-adjacent hexagonal grid to simulate neighborhood effects. High turnout in Section A exerts a slight "gravity" pull on adjacent Section B's turnout, mimicking real-world social contagion behavior.
            </p>
          </section>
        </div>

        <div className="mt-auto pt-6 border-t border-white/50 p-4">
          <div className="p-3 rounded bg-gray-500/10 border border-gray-500/45">
            <p className="text-[10px] text-white/45 font-mono">
              NOTE: Historical data is currently simulated. Integrate "queretaro_2024.json" into <code>constants.ts</code> for production accuracy.
            </p>
          </div>
        </div>
      </div>
  );
};


// --- Componente Principal Sidebar2 ---

const Sidebar2: React.FC<SidebarProps> = (props) => {
  const { isOpen, toggleSidebar2, searchResults, onLocationSelect, isSearching, onSearch, chatHistory, onChatSend } = props;
  
  const [activeTab, setActiveTab] = useState<Tab['id']>('info'); 

  const [width, setWidth] = useState(320); // Ancho inicial (equivalente a w-80)
  const isResizing = useRef(false);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    isResizing.current = true;
    // Evita que se seleccione texto mientras arrastras
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing.current) {
      // Calculamos el nuevo ancho. 
      // Si el panel está a la izquierda, es directamente el clientX del mouse.
      const newWidth = mouseMoveEvent.clientX;
      if (newWidth > 250 && newWidth < 600) { // Límites mínimo y máximo
        setWidth(newWidth);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);
  
  const TabContent: React.FC | undefined = useMemo(() => {
    switch (activeTab) {
      case 'search':
        return () => <SearchTab 
          searchResults={searchResults} 
          onLocationSelect={onLocationSelect} 
          isSearching={isSearching} 
          onSearch={onSearch} 
        />;
      case 'chat':
        return () => <ChatTab 
          chatHistory={chatHistory} 
          onChatSend={onChatSend} 
        />;
      case 'info':
        return InfoTab;
      default:
        return undefined;
    }
  }, [activeTab, searchResults, onLocationSelect, isSearching, onSearch, chatHistory, onChatSend]);

  if (!isOpen) {
    return (
      <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
        <button
          onClick={toggleSidebar2}
          className="bg-slate-800 p-3 rounded-lg shadow-xl hover:bg-slate-700 transition-colors text-white border border-slate-700"
          title="Abrir Menú"
        >
          <Menu size={24} />
        </button>
      </div>
    );
  }

  return (
<div 
      style={{ width: `${width}px` }} // Aplicamos el ancho dinámico
      className={`h-full shadow-2xl z-[500] flex-shrink-0 flex flex-col border-r border-slate-700 bg-black fixed top-0 left-0 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* BARRA DE ARRASTRE (RESIZER) */}
      <div
        onMouseDown={startResizing}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-[501]"
        title="Arrastra para ajustar tamaño"
      />
            
      {/* 1. TOP BAR (Close Button) - Dark mode style */}
      <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white">IA Tools</h2>
        <button
          onClick={toggleSidebar2}
          className="p-2 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
          title="Close Menu"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* 2. MAIN MENU (Tabs) */}
      <div className="flex justify-around border-b border-slate-700 bg-black/85 shadow-lg"> 
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-3 text-center transition-all duration-200 relative group
                  ${isActive 
                      ? `text-white font-semibold bg-black after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-white` 
                      : 'text-white/70 hover:bg-black/50'
                  }`}
              title={tab.label}
            >
              <tab.icon size={20} className="mx-auto mb-1" />
              <span className="text-xs hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. CONTENT AREA */}
      {/* Añadimos p-4 al contenido solo si la pestaña no lo incluye, InfoTab ya lo tiene. */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black backdrop-blur-sm">
        <div className={`h-full ${activeTab !== 'info' ? 'p-4' : 'p-0'}`}>
          {TabContent ? <TabContent /> : <div className="text-white p-4">Select a tab.</div>}
        </div>
      </div>
    </div> 
  );
};

export default Sidebar2;