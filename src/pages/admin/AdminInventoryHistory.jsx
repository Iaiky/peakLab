import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminInventoryHistory() {

  const [movements] = useState([
    { id: "MOV-001", date: "26/01/2026 10:15", product: "Whey Gold Standard", qty: 24, type: "Entrée", reason: "Arrivage fournisseur" },
    { id: "MOV-002", date: "25/01/2026 16:40", product: "BCAA Amino", qty: -2, type: "Sortie", reason: "Commande ORD-8812" },
    { id: "MOV-003", date: "24/01/2026 11:00", product: "Creatine 300g", qty: 50, type: "Entrée", reason: "Réapprovisionnement" },
  ]);

  // 1. État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7; // Nombre de commandes par page

  // 2. Logique de calcul de la pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = movements.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(movements.length / ordersPerPage);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen pt-12 md:pt-8">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">

        <Link to="/admin/inventory" className="inline-flex items-center text-secondary font-bold text-xs md:text-sm hover:text-primary transition-colors gap-2">
          ← <span className="hidden sm:inline">Retour à la liste des clients</span><span className="sm:hidden">Retour</span>
        </Link>
        
        {/* HEADER ADAPTATIF */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                Mouvement<span className="text-primary"> des stock</span>
              </h1>
              <p className="text-[10px] md:text-sm text-secondary font-medium uppercase tracking-widest md:normal-case md:tracking-normal">Flux des stocks</p>
            </div>
          </div>
          
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="relative flex-1 sm:w-64 md:w-80">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-white border border-slate-200 rounded-2xl px-10 py-3 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            onChange={(e) => {/* Ta fonction de recherche ici */}}
          />
        </div>

        {/* TABLEAU AVEC SCROLLING ET COLONNES PRIORITAIRES */}
        <div className="bg-transparent md:bg-white md:rounded-[2.5rem] md:overflow-hidden md:shadow-sm md:border md:border-slate-100">
  
          {/* --- VUE MOBILE : CARDS --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {movements.map((mov) => (
              <div key={mov.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                
                {/* En-tête : Date & Type */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${mov.type === 'Entrée' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <p className="font-bold text-slate-700 text-xs">{mov.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                    mov.type === 'Entrée' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {mov.type}
                  </span>
                </div>

                {/* Produit & Quantité */}
                <div className="flex justify-between items-end bg-slate-50/50 p-3 rounded-2xl">
                  <div className="min-w-0">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Produit</p>
                    <p className="font-black text-slate-900 text-sm truncate">{mov.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Quantité</p>
                    <p className={`text-lg font-black ${mov.qty > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {mov.qty > 0 ? `+${mov.qty}` : mov.qty}
                    </p>
                  </div>
                </div>

                {/* Raison / Commentaire */}
                <div className="px-1">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Motif du mouvement</p>
                  <p className="text-xs text-slate-600 italic font-medium leading-relaxed">
                    "{mov.reason}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* --- VUE DESKTOP : TABLEAU --- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-full">
              <thead className="bg-slate-50 text-secondary text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="p-6">Date & ID</th>
                  <th className="p-6">Produit</th>
                  <th className="p-6 text-center">Type</th>
                  <th className="p-6 text-center">Quantité</th>
                  <th className="p-6">Raison</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {movements.map((mov) => (
                  <tr key={mov.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 whitespace-nowrap">
                      <p className="font-bold text-slate-700 text-xs">{mov.date}</p>
                      <p className="text-[9px] text-slate-400 font-mono tracking-tighter">{mov.id}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-slate-900">{mov.product}</p>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${
                        mov.type === 'Entrée' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {mov.type}
                      </span>
                    </td>
                    <td className="p-6 text-center font-black">
                      <span className={mov.qty > 0 ? 'text-emerald-500' : 'text-amber-500'}>
                        {mov.qty > 0 ? `+${mov.qty}` : mov.qty}
                      </span>
                    </td>
                    <td className="p-6 text-slate-500 italic text-xs">
                      <span className="line-clamp-2 italic">"{mov.reason}"</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BARRE DE PAGINATION (Adaptée) */}
        {totalPages > 1 && (
          <div className="mt-6 md:mt-0 p-6 md:bg-slate-50/50 border-t border-slate-100 flex justify-center items-center gap-2">
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:text-primary disabled:opacity-30 transition"
              >
                ←
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                    currentPage === i + 1 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' 
                    : 'bg-white text-slate-400 border border-slate-200 hover:border-primary/30'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-400 hover:text-primary disabled:opacity-30 transition"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}