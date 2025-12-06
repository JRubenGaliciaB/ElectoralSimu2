import React, { createContext, useContext, useState, ReactNode } from 'react';

// Asumimos un tipo para GeoLocation (Asegúrate de que este tipo coincida con la definición real de tu proyecto)
type GeoLocation = { 
  lat: number; 
  lng: number; 
  name?: string; 
};

// 1. Define the Context's interface
interface MapContextType {
 mapCenter: [number, number];
 setMapCenter: (center: [number, number]) => void;
 mapZoom: number;
 setMapZoom: (zoom: number) => void;
 userLocation: { lat: number; lng: number } | null;
 setUserLocation: (location: { lat: number; lng: number } | null) => void;
 handleLocateMe: () => void;
 isAutoRecenterEnabled: boolean;
 setIsAutoRecenterEnabled: (enabled: boolean) => void;
  // AÑADIDO: Estado para los resultados de búsqueda
 searchResults: GeoLocation[];
 setSearchResults: (results: GeoLocation[]) => void;
}

// 2. Create the Context
const MapContext = createContext<MapContextType | undefined>(undefined);

// 3. Create the Provider component
interface MapProviderProps {
 children: ReactNode;
 initialCenter: [number, number];
 initialZoom: number;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children, initialCenter, initialZoom }) => {
 const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);
 const [mapZoom, setMapZoom] = useState<number>(initialZoom);
 const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
 const [isAutoRecenterEnabled, setIsAutoRecenterEnabled] = useState(true);
  // AÑADIDO: Estado para los resultados de búsqueda
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);

 const handleLocateMe = () => {
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(
 (position) => {
 const { latitude, longitude } = position.coords;
 setUserLocation({ lat: latitude, lng: longitude });
 setMapCenter([latitude, longitude]);
 setMapZoom(15);
 },
 (error) => {
 console.error("Error getting location", error);
 console.warn("Could not retrieve your location. Please check permissions.");
 }
 );
 }
 };

 const contextValue: MapContextType = {
 mapCenter,
 setMapCenter,
 mapZoom,
 setMapZoom,
 userLocation,
 setUserLocation,
 handleLocateMe,
 isAutoRecenterEnabled,
 setIsAutoRecenterEnabled,
    // AÑADIDO: Propiedades de búsqueda
    searchResults,
    setSearchResults,
 };

 return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>;
};

// 4. Create a custom hook for consuming the context
export const useAppContext = () => {
 const context = useContext(MapContext);
 if (context === undefined) {
 throw new Error('useAppContext must be used within a MapProvider');
 }
 return context;
};
