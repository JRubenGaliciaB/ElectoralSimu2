import React from 'react';
import { Trash2 } from 'lucide-react';
import { StatSlider } from './StatSlider';

interface Candidate {
  id: number;
  name: string;
  party: string;
  charisma: number;
  budget: number;
}

interface Props {
  candidate: Candidate;
  onUpdate: (id: number, field: string, value: any) => void;
  onRemove: (id: number) => void;
  themeColor: string;
}

export const CandidateCard: React.FC<Props> = ({ candidate, onUpdate, onRemove, themeColor }) => {
  return (
    <div className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 transition-all hover:bg-slate-800/50 border-l-4 ${themeColor} animate-in fade-in zoom-in duration-300`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 mr-4">
          <input 
            type="text" 
            value={candidate.name}
            onChange={(e) => onUpdate(candidate.id, 'name', e.target.value)}
            className="bg-transparent border-none text-xl font-bold focus:ring-0 w-full p-0 text-white placeholder-slate-600"
            placeholder="Nombre del Candidato"
          />
          <input 
            type="text" 
            value={candidate.party}
            onChange={(e) => onUpdate(candidate.id, 'party', e.target.value)}
            className="bg-transparent border-none text-xs font-mono text-slate-500 focus:ring-0 w-full p-0 uppercase tracking-widest"
            placeholder="Partido / Coalición"
          />
        </div>
        <button onClick={() => onRemove(candidate.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <StatSlider 
          label="Carisma_Index" 
          value={candidate.charisma} 
          onChange={(val) => onUpdate(candidate.id, 'charisma', val)}
        />
        <StatSlider 
          label="Budget_Power" 
          value={candidate.budget} 
          onChange={(val) => onUpdate(candidate.id, 'budget', val)}
        />
      </div>
    </div>
  );
};