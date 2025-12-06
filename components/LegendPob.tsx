import React from 'react';

interface LegendPobProps {
  title: string;
  colorStops: { color: string; value: string }[];
  minLabel: string;
  maxLabel: string;
}

const LegendPob: React.FC<LegendPobProps> = ({ title, colorStops, minLabel, maxLabel }) => {
  const gradient = `linear-gradient(to right, ${colorStops.map(stop => stop.color).join(', ')})`;

  return (
    <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[450] bg-white/20 backdrop-blur-sm p-1 rounded-lg shadow-xl border border-gray-200 w-64">
      <h3 className="text-sm font-bold mb-2 text-white text-center">{title}</h3>
      <div className="w-full h-5 rounded-md border border-gray-300" style={{ background: gradient }}></div>
      <div className="flex justify-between mt-1 text-xs text-gray-700 font-medium">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

export default LegendPob;