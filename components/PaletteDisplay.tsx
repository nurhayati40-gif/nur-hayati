
import React, { useState } from 'react';
import { Palette } from '../types';

interface PaletteDisplayProps {
  palette: Palette;
}

const CopyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);


export const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in">
       <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Visual Moodboard</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {palette.moodboardImages.map((base64Image, index) => (
            <div key={index} className="aspect-square bg-white/30 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl shadow-black/5 border border-white/40">
              <img 
                src={`data:image/png;base64,${base64Image}`} 
                alt={`Moodboard image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
        {palette.colors.map((color) => (
          <div key={color} className="flex-grow md:flex-grow-0 w-32 flex flex-col bg-white/30 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl shadow-black/5 transform hover:-translate-y-1 transition-all duration-300 border border-white/40">
            <div className="h-28" style={{ backgroundColor: color }} />
            <div className="p-3 text-center flex flex-col items-center flex-grow justify-between">
              <p className="font-mono text-gray-700 text-sm tracking-wider mb-2">{color.toUpperCase()}</p>
              <button
                onClick={() => handleCopy(color)}
                className="w-full mt-auto px-3 py-1.5 text-xs font-medium text-gray-700 bg-white/40 hover:bg-white/60 rounded-md transition-all duration-200 flex items-center justify-center border border-white/30"
                aria-label={`Copy hex code ${color}`}
              >
                {copiedColor === color ? 
                  <span className="flex items-center text-indigo-600"><CheckIcon className="h-4 w-4 mr-1.5" /> Copied!</span> : 
                  <span className="flex items-center"><CopyIcon className="h-4 w-4 mr-1.5" /> Copy Hex</span>
                }
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white/30 backdrop-blur-lg rounded-2xl border border-white/40 shadow-xl shadow-black/5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Aesthetic Justification</h3>
        <p className="text-gray-700 leading-relaxed">{palette.justification}</p>
      </div>
    </div>
  );
};