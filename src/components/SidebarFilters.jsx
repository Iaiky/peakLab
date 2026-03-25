import { useState, useEffect } from 'react';

export default function SidebarFilters({ 
  categories, 
  activeGroup, 
  activeCategory, 
  activeSearch,
  onFilterChange 
}) {

  // États locaux pour les champs de saisie (pour ne pas déclencher Firebase à chaque lettre)
  const [localSearch, setLocalSearch] = useState(activeSearch || "");

  // On synchronise le localSearch si l'URL change (ex: bouton reset)
  useEffect(() => {
    setLocalSearch(activeSearch || "");
  }, [activeSearch]);

  // Filtrer les catégories pour n'afficher que celles du groupe actif
  const filteredCategories = categories.filter(cat => cat.IdGroupe === activeGroup);

  const handleApplyFilters = () => {
    onFilterChange(localSearch, activeCategory, activeGroup);
  };

  const handleReset = () => {
    // 1. On vide le champ de saisie visuel
    setLocalSearch("");

    // 2. On déclenche la mise à jour globale (URL + Firebase)
    // On garde activeGroup car on veut rester dans le même univers, 
    // mais on reset la recherche et la catégorie.
    onFilterChange("", "Toutes les catégories", activeGroup);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* SECTION RECHERCHE */}
      <div className="space-y-3">
        <div className="px-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Recherche
            </h3>
          </div>
        </div>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            placeholder="Nom du produit..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      {/* SECTION CATÉGORIES (Dépend du groupe) */}
      <div className="space-y-6">
        {/* TITRE CATÉGORIE - Propre et simple */}
        <div className="px-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Catégories
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {/* BOUTON TOUTES LES CATÉGORIES */}
          <button
            onClick={() => onFilterChange(localSearch, "Toutes les catégories", activeGroup)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeCategory === "Toutes les catégories" 
              ? 'bg-primary/10 text-primary' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            Toutes les catégories
          </button>

          {/* LISTE DES CATÉGORIES DYNAMIQUES */}
          {filteredCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange(localSearch, cat.id, activeGroup)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat.Nom}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION ACTIONS DANS TON JSX */}
  <div className="pt-8 space-y-4 border-t border-slate-100">
    <button 
      onClick={handleApplyFilters}
      className="w-full bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
    >
      Appliquer les filtres
    </button>

    <button 
      onClick={handleReset}
      className="group w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-red-500 transition-all duration-200"
    >
      <svg className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span className="font-bold text-[11px] uppercase tracking-wider">
        Réinitialiser tout
      </span>
    </button>
  </div>
    </div>
  );
}