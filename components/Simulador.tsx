 {/*import React from 'react';

export const Simulador: React.FC = () => {
  return (
    <div className="p-4 text-white">
      <h3 className="text-xl font-bold text-blue-400 mb-4">Simulador Electoral</h3>
      <p className="text-slate-400">
        Próximamente: Controles y lógica para la simulación de escenarios electorales.
      </p>
      //{/* Aquí irá toda la interfaz y la lógica del simulador //
    </div>
  );
};*/}

import React, { useState } from 'react';
import { Users, Cpu, Settings2, Plus, Zap } from 'lucide-react';
import { CandidateCard } from './CandidateCard';

export const Simulador: React.FC = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Candidato A', party: 'Partido Alpha', charisma: 70, budget: 50 }
  ]);
  const [isAutoMode, setIsAutoMode] = useState(false);

  const addCandidate = () => {
    const newCand = { id: Date.now(), name: '', party: '', charisma: 50, budget: 50 };
    setCandidates([...candidates, newCand]);
  };

  const updateCandidate = (id: number, field: string, value: any) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCandidate = (id: number) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase italic">
            Simulador de Escenarios
          </h3>
          <p className="text-slate-500 font-mono text-[10px] tracking-[0.3em]">MARKOV_ENGINE_V1.0</p>
        </div>

        {/* Toggle de Modo */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
          <button 
            onClick={() => setIsAutoMode(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-mono ${!isAutoMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Settings2 size={14} /> MANUAL
          </button>
          <button 
            onClick={() => setIsAutoMode(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-mono ${isAutoMode ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Cpu size={14} /> AUTO_GEN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-mono text-[11px] text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Users size={16} /> Configuración de Candidatos
            </h4>
            <button 
              onClick={addCandidate}
              className="px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/50 rounded-full text-blue-400 text-xs transition-all flex items-center gap-2"
            >
              <Plus size={14} /> Agregar Perfil
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map(cand => (
              <CandidateCard 
                key={cand.id} 
                candidate={cand} 
                onUpdate={updateCandidate} 
                onRemove={removeCandidate}
                themeColor={isAutoMode ? 'border-l-purple-500' : 'border-l-blue-500'}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
            {/* Aquí iría el ControlPanel que definimos antes */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 border-t-4 border-t-yellow-500/50">
                <h4 className="font-mono text-[11px] text-yellow-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={16} /> Motor de Simulación
                </h4>
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform active:scale-95">
                    Ejecutar Análisis
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};