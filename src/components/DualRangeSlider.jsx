import { useState, useEffect } from 'react';

export default function DualRangeSlider({ min, max, unit, step = 1, label, onChange }) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  // Synchronisation si les props changent
  useEffect(() => {
    setMinVal(min);
    setMaxVal(max);
  }, [min, max]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - (step * 2));
    setMinVal(value);
    onChange({ min: value, max: maxVal });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + (step * 2));
    setMaxVal(value);
    onChange({ min: minVal, max: value });
  };

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-end mb-4">
        <label className="text-[10px] font-black uppercase text-secondary tracking-widest px-1">
          Filtrer par {label}
        </label>
        <div className="text-right">
          <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
            {minVal}{unit} — {maxVal}{unit}
          </span>
        </div>
      </div>

      <div className="relative h-1.5 w-full bg-slate-200 rounded-lg">
        {/* Barre de progression */}
        <div 
          className="absolute h-full bg-primary rounded-lg transition-all"
          style={{ 
            left: `${((minVal - min) / (max - min)) * 100}%`, 
            right: `${100 - ((maxVal - min) / (max - min)) * 100}%` 
          }}
        ></div>

        {/* Inputs superposés */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
    </div>
  );
}