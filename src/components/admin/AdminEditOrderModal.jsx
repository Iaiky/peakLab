import { useState } from 'react';

export default function AdminEditOrderModal({ order, onClose, onSave }) {
  // On initialise avec les items existants
  const [editedItems, setEditedItems] = useState([...(order.items || order.panier || [])]);

  // --- LOGIQUE ACTIONS ---
  
  const updateQty = (id, delta) => {
    setEditedItems(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setEditedItems(prev => prev.filter(item => item.id !== id));
  };

  const total = editedItems.reduce((acc, item) => acc + (item.prixUnitaire * item.qty), 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-4">
      {/* Overlay de clic pour fermer si on clique à côté (optionnel) */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[85vh] animate-in slide-in-from-bottom duration-300">
        
        {/* PETITE BARRE DE DRAG (Mobile uniquement) */}
        <div className="md:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-1 shrink-0" />

        {/* HEADER */}
        <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="text-left">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Ajuster la commande</h2>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">ID: #{order.id.slice(-6)}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* LISTE DES ARTICLES - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-3">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 block px-1 text-left">Articles commandés</label>
          
          {editedItems.length > 0 ? editedItems.map((item) => (
            <div key={item.id} className="flex flex-col bg-slate-50/50 rounded-2xl p-4 border border-slate-50">
              <div className="flex justify-between items-start text-left">
                <div className="flex flex-col min-w-0 pr-4">
                  {item.category && <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">{item.category}</span>}
                  <span className="text-sm font-bold text-slate-700 leading-tight">{item.nom}</span>
                </div>
                <button onClick={() => removeItem(item.id)} className="shrink-0 text-slate-300 hover:text-red-500 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-slate-600 font-black">-</button>
                  <span className="text-sm font-black text-slate-900 min-w-[20px] text-center tabular-nums">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-slate-600 font-black">+</button>
                </div>
                <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-300 block leading-none mb-1">{(item.prixUnitaire).toLocaleString()} Ar</span>
                    <span className="text-sm font-black text-slate-900 italic">{(item.prixUnitaire * item.qty).toLocaleString()} Ar</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-10 text-center text-slate-400 font-bold text-xs uppercase italic tracking-widest">La commande est vide</div>
          )}
        </div>

        {/* FOOTER - Fixe en bas */}
        <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md shrink-0 pb-10 md:pb-8">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total ajusté</span>
            <span className="text-xl md:text-2xl font-black text-slate-900 tabular-nums">{total.toLocaleString()} Ar</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Annuler</button>
            <button 
              disabled={editedItems.length === 0}
              onClick={() => onSave(order.id, editedItems)}
              className="flex-[3] bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-30"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}