import { useState } from 'react';

export default function AdminOrderCard({ order, onUpdateStatus, onEdit }) {
  const [discountPercent, setDiscountPercent] = useState(order.remise || 0);
  
  const items = order.items || order.panier || [];

  const subtotal = items.reduce((acc, item) => acc + ((item.prixUnitaire || item.price || 0) * item.qty), 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  const statusStyles = {
    "en_attente": "bg-amber-50 text-amber-600 border-amber-100",
    "paye": "bg-emerald-50 text-emerald-600 border-emerald-100",
    // "livre": "bg-blue-50 text-blue-600 border-blue-100"
  };

  const statusLabels = {
    "en_attente": "En attente",
    "paye": "Payé",
    // "livre": "Livré"
  };

  // Formatage de la date de paiement si elle existe
  const formatPaidDate = (date) => {
    if (!date) return null;
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all overflow-hidden text-left">
      
      {/* ---------------------------------------------------------
          HEADER (Commun mais adapté)
      --------------------------------------------------------- */}
      <div className="bg-slate-50/50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-4">
          <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg">
            #{order.id.slice(-6)}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800 leading-none">
              {order.nomClient || order.client?.nom || "Client"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              {order.dateFormatted}
            </span>
            {order.statut === 'paye' && order.paidAt && (
              <span className="text-[10px] text-emerald-500 font-black uppercase flex items-center gap-1">
                • Payée le {formatPaidDate(order.paidAt)}
              </span>
            )}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyles[order.statut] || "bg-slate-50"}`}>
          {statusLabels[order.statut] || order.statut}
        </span>
      </div>

      {/* ---------------------------------------------------------
          BODY : LISTE DES PRODUITS (Version Desktop)
      --------------------------------------------------------- */}
      <div className="hidden md:block p-8">
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center group">
              <div className="flex items-center gap-4 flex-1">
                <span className="w-8 h-8 flex-shrink-0 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-[10px] font-black">
                  {item.qty}x
                </span>
                <div className="flex items-center gap-3">
                  {item.category && (
                    <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                      {item.category}
                    </span>
                  )}
                  <span className="text-sm font-bold text-slate-700">{item.nom}</span>
                  {item.weight > 0 && <span className="text-[10px] text-slate-300 italic">({item.weight}g)</span>}
                </div>
              </div>
              <span className="text-sm font-black text-slate-900 tabular-nums">
                {((item.prixUnitaire || item.price || 0) * item.qty).toLocaleString()} Ar
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------
          BODY : LISTE DES PRODUITS (Version Mobile)
      --------------------------------------------------------- */}
      <div className="md:hidden p-5">
        <div className="bg-slate-50/50 rounded-2xl p-4 space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded">
                  {item.qty}x
                </span>
                <div className="flex flex-col min-w-0">
                  {item.category && (
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                      {item.category}
                    </span>
                  )}
                  <span className="text-slate-700 font-bold text-xs leading-tight line-clamp-3">
                    {item.nom || item.name}
                  </span>
                  {item.weight > 0 && <span className="text-[10px] text-slate-300 italic">({item.weight}g)</span>}
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                {(item.prixUnitaire || item.price || 0).toLocaleString()} Ar
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------
          FOOTER : ACTIONS & TOTAL
      --------------------------------------------------------- */}
      <div className="px-6 md:px-8 py-6 bg-slate-50/30 border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Section Remise & Total */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">

            <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border shadow-sm transition-all ${order.statut === 'paye' ? 'bg-slate-100 border-transparent' : 'bg-white border-slate-200'}`}>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Remise</span>
              <input 
                type="number"
                value={discountPercent}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                  setDiscountPercent(val);
                }}
                disabled={order.statut !== 'en_attente'}
                className={`w-10 text-xs font-black outline-none text-center bg-transparent ${order.statut === 'paye' ? 'text-slate-500' : 'text-primary'}`}
              />
              <span className="text-[10px] font-bold text-slate-300">%</span>
            </div>
            
            <div className="text-center md:text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                {order.statut === 'paye' ? 'Montant encaissé' : 'Total Final'}
              </p>
              <p className={`text-xl md:text-2xl font-black tracking-tighter ${order.statut === 'paye' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {finalTotal.toLocaleString()} <span className="text-sm">Ar</span>
              </p>
            </div>
          </div>

          {/* Boutons d'actions (Desktop: Taille fixe | Mobile: Full width) */}
          <div className="flex gap-2 w-full md:w-auto">
            {onUpdateStatus && order.statut === 'en_attente' && (
              <button 
                onClick={() => {
                  // FORCE la conversion en nombre juste avant l'envoi
                  const valueToSend = Number(discountPercent);
                  onUpdateStatus(order, valueToSend);
                }}
                className="flex-1 md:flex-none md:min-w-[160px] bg-primary text-white py-3 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-primary/10"
              >
                💳 Valider Paiement
              </button>
            )}
            <button 
              onClick={() => onEdit(order)}
              className="flex-1 md:flex-none p-3 bg-slate-900 md:bg-white border border-slate-900 md:border-slate-200 text-white md:text-slate-400 rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95"
              title="Modifier"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}