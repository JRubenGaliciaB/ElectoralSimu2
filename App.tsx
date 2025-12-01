import React, { useState, useCallback } from 'react'; 
import Sidebar from './components/Sidebar';
import Sidebar2 from './components/Sidebar2';
import MapViewer from './components/MapViewer';
import { Locate, Menu } from 'lucide-react';
import { FEDERAL_DISTRICTS_GEOJSON } from './data/geoData';
import { LayerControlProvider } from './context/LayerControlContext';
import { MapProvider, useAppContext } from './context/MapContext';
import { ChatProvider } from './context/ChatContext';
import WelcomeScreen from './components/WelcomeScreen';

//MAPA al Iniciar
const DEFAULT_CENTER: [number, number] = [20.7888, -99.6999]; 
const DEFAULT_ZOOM = 9.2; 

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); {/* Sidebar2 Derecho (main) */} 
  const [isSidebar2Open, setIsSidebar2Open] = useState(false); {/* Sidebar izquierdo info*/}
  const { handleLocateMe, setMapCenter, setMapZoom } = useAppContext();


  {/* Se mantiene el useCallback para la gestión del movimiento del mapa */}
  const handleMapMoveEnd = useCallback((center: { lat: number; lng: number }, zoom: number) => {
    setMapCenter([center.lat, center.lng]);
    setMapZoom(zoom);
  }, [setMapCenter, setMapZoom]);

  return (
    <div className="relative flex w-full h-screen overflow-hidden bg-gray-100">
      <LayerControlProvider>
        <ChatProvider>
          {/* 1. Sidebar2 Container (Izquierda) */}
          <Sidebar2
            isOpen={isSidebar2Open}
            toggleSidebar2={() => setIsSidebar2Open(!isSidebar2Open)}
          />

          {/* 2. Botón flotante para abrir la Sidebar2 (Izquierda) - visible SOLO si está cerrada */}
          {!isSidebar2Open && (
            <div className="absolute top-4 left-4 z-[500] flex flex-col gap-2"> {/* Posicionado arriba a la izquierda */}
              <button
                onClick={() => setIsSidebar2Open(true)}
                className="bg-white p-3 rounded-lg shadow-xl hover:bg-gray-50 transition-colors text-gray-700 border border-gray-200"
                title="IA Tools"
              >
                <Menu size={24} />
              </button>
            </div>
          )}

          {/* 3. Área Principal del Mapa */}
          <div className="flex-1 relative flex flex-col h-full w-full">
            <MapViewer
              onMapMoveEnd={handleMapMoveEnd}
              districtsData={FEDERAL_DISTRICTS_GEOJSON}
            />

            {/* Floating Action Buttons (Locate Me) */}
            {/* Se colocan en la esquina superior derecha del área del mapa */}
            <div className="absolute top-20 left-6 z-[450] flex flex-col gap-2">
              <button
                onClick={handleLocateMe}
                className="bg-white p-2 rounded-md shadow-md text-gray-600 hover:text-[#D32F2F] hover:bg-gray-50 border border-gray-200"
                title="Mi Ubicación"
              >
                <Locate size={20} />
              </button>
            </div>
          </div>
          
          {/* 4. Sidebar Container (Derecha)  */}
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* 5. Botón flotante para abrir la Sidebar (Derecha) - visible SOLO si está cerrada */}
          {!isSidebarOpen && (
            <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2"> 
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="bg-white p-3 rounded-lg shadow-xl hover:bg-gray-50 transition-colors text-gray-700 border border-gray-200"
                title="Historico&Simulador"
              >
                <Menu size={24} />
              </button>
            </div>
          )}

        </ChatProvider>
      </LayerControlProvider>
    </div>
  );
};

const App: React.FC = () => {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  const handleCloseWelcomeScreen = () => {
    setShowWelcomeScreen(false);
  };

  return (
    <>
      {/* 1. Pantalla de bienvenida se muestra de forma condicional */}
      {showWelcomeScreen && (
        <WelcomeScreen onClose={handleCloseWelcomeScreen} />
      )}

      {/* 2. El resto de la aplicación (el mapa) */}
      <MapProvider initialCenter={DEFAULT_CENTER} initialZoom={DEFAULT_ZOOM}>
        <AppContent />
      </MapProvider>
    </>
  );
};

export default App;
