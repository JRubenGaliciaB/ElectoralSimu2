import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GeoLocation, ChatMessage } from '../types';
import { searchLocations, askAssistant } from '../services/geminiService';
import { useAppContext } from './MapContext';

// 1. Define the Context's interface
interface ChatContextType {
  searchResults: GeoLocation[];
  isSearching: boolean;
  chatHistory: ChatMessage[];
  handleSearch: (query: string) => Promise<void>;
  handleChatSend: (msgText: string) => Promise<void>;
  onLocationSelect: (loc: GeoLocation) => void;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

// 2. Create the Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// 3. Create the Provider component
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { mapCenter, setMapCenter, setMapZoom, isAutoRecenterEnabled } = useAppContext();
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const center = { lat: mapCenter[0], lng: mapCenter[1] };
      const results = await searchLocations(query, center);
      setSearchResults(results);

      if (isAutoRecenterEnabled && results.length > 0) {
        setMapCenter([results[0].lat, results[0].lng]);
        setMapZoom(14);
      }

      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: `I found ${results.length} locations for "${query}". They have been plotted on the map.`,
      };
      setChatHistory((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChatSend = async (msgText: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: msgText,
    };
    setChatHistory((prev) => [...prev, userMsg]);

    const thinkingMsgId = Date.now().toString() + '-thinking';
    const thinkingMsg: ChatMessage = {
      id: thinkingMsgId,
      role: 'model',
      text: 'Thinking...',
      isThinking: true,
    };
    setChatHistory((prev) => [...prev, thinkingMsg]);

    const response = await askAssistant(msgText, mapCenter[0], mapCenter[1]);
    
    setChatHistory((prev) => 
      prev.map((msg) => (msg.id === thinkingMsgId ? { ...response, id: thinkingMsgId, isThinking: false } : msg))
    );
  };

  const onLocationSelect = (loc: GeoLocation) => {
    if (isAutoRecenterEnabled) {
      setMapCenter([loc.lat, loc.lng]);
      setMapZoom(16);
    }
  };

  const contextValue: ChatContextType = {
    searchResults,
    isSearching,
    chatHistory,
    handleSearch,
    handleChatSend,
    onLocationSelect,
    setChatHistory,
  };

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

// 4. Create a custom hook for consuming the context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
