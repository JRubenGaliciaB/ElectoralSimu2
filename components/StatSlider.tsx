import React from 'react';

interface StatSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export const StatSlider: React.FC<StatSliderProps> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between font-mono text-[10px] tracking-tighter text-slate-400 uppercase">
      <span>{label}</span>
      <span className="text-blue-400">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
    />
  </div>
);