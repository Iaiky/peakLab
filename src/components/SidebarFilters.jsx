// src/components/SidebarFilters.jsx
import { useState } from 'react';
import DualRangeSlider from './DualRangeSlider';

export default function SidebarFilters() {
  const [price, setPrice] = useState(100000);
  const [weight, setWeight] = useState(10);
  const [search, setSearch] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);


  return (
    <div className="flex flex-col gap-8">
      {/* RECHERCHE - Désormais visible PARTOUT (suppression de lg:hidden) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recherche</h3>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Nom, catégorie..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
          />

          {/* LE BADGE DE RACCOURCI (KBD) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none">
            <kbd className="min-w-[20px] h-5 flex items-center justify-center px-1.5 font-sans text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded">
              ⌘
            </kbd>
            <kbd className="min-w-[20px] h-5 flex items-center justify-center px-1.5 font-sans text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* SECTION CATÉGORIES */}
      <div>
        <h3 className="font-bold text-slate-900 mb-4">Catégories</h3>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {['Performance', 'Santé', 'Accessoires'].map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group bg-white lg:bg-transparent px-4 py-2 lg:p-0 rounded-xl border border-slate-100 lg:border-none shadow-sm lg:shadow-none">
              <input type="checkbox" className="w-5 h-5 lg:w-4 lg:h-4 rounded-md border-slate-300 text-primary focus:ring-primary-500" />
              <span className="text-slate-600 group-hover:text-primary-600 transition text-sm font-medium">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SLIDER PRIX */}
      <div className="bg-primary-50/50 p-4 rounded-2xl lg:p-0 lg:bg-transparent">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-900">Prix Max</h3>
          <span className="text-primary-600 font-bold bg-white px-2 py-1 rounded-lg text-xs shadow-sm">{price}Ar</span>
        </div>
        {/* Slider pour le PRIX */}
          <DualRangeSlider 
            label="Prix"
            min={0} 
            max={100000} 
            unit="Ar" 
            step={10000}
            onChange={(range) => console.log("Prix:", range)} 
          />
      </div>

      {/* SLIDER POIDS */}
      <div className="bg-slate-50 p-4 rounded-2xl lg:p-0 lg:bg-transparent">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-900">Poids Max</h3>
          <span className="text-slate-600 font-bold bg-white px-2 py-1 rounded-lg text-xs shadow-sm">{weight}kg</span>
        </div>
        {/* Slider pour le POIDS */}
          <DualRangeSlider 
            label="Poids"
            min={0} 
            max={10} 
            unit="kg" 
            step={0.5}
            onChange={(range) => console.log("Poids:", range)} 
          />
      </div>

      {/* BOUTON RÉINITIALISER (Mobile uniquement) */}
      <button 
        className="lg:hidden w-full py-4 text-slate-500 font-medium text-sm underline"
        onClick={() => setIsFilterOpen(false)}
      >
        Effacer tous les filtres
      </button>
    </div>
  );
}