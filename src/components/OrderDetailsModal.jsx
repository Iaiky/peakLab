import React from 'react';

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  // Déterminer si on affiche le prix avec remise
  const isPaye = order.statut === 'paye';
  const isAnnule = order.statut === 'annule';
  const displayTotal = isPaye && order.totalFinal ? order.totalFinal : order.total;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-black text-slate-900">Détails Commande</h2>
                {/* Badge Statut Dynamique */}
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  isPaye 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : isAnnule
                      ? 'bg-red-50 text-red-500 border-red-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {isPaye ? 'Payé' : isAnnule ? 'Annulée' : 'En attente'}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-medium">Référence : <span className="text-primary font-bold">#{order.id.slice(-8)}</span></p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          
          {/* Section: Articles */}
          <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Articles commandés</h3>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white text-xs font-black rounded-xl">
                      {item.qty}x
                    </span>
                    <div className="flex flex-col">
                      {item.group && (
                        <span className="text-[9px] font-black uppercase text-primary tracking-widest">{item.group}</span>
                      )}
                      <span className="text-slate-800 font-bold text-sm">{item.nom}</span>
                      {item.weight > 0 && <span className="text-[10px] text-slate-400">{item.weight}g</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{(item.qty * item.prixUnitaire).toLocaleString()} Ar</p>
                    <p className="text-[10px] text-slate-400">{item.prixUnitaire.toLocaleString()} Ar / u</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Infos complémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-[2rem]">
            <div>
              <h4 className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Date de commande</h4>
              <p className="text-xs font-bold text-slate-700">{order.dateFormatted}</p>
            </div>
            <div>
              <h4 className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Statut du paiement</h4>
              <p className={`text-xs font-bold ${
                isPaye ? 'text-emerald-600' : isAnnule ? 'text-red-500' : 'text-amber-600'
              }`}>
                {isPaye ? 'Transaction terminée' : isAnnule ? 'Commande annulée' : 'Paiement à la livraison'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer: Total avec calcul de remise */}
        <div className={`p-8 transition-colors duration-500 ${isAnnule ? 'bg-red-500' : 'bg-slate-900'} text-white`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                {isPaye ? 'Montant Encaissé' : isAnnule ? 'Commande Annulée' : 'Total de la commande'}
              </p>
              {isPaye && order.remise > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-white/20 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                    Remise -{order.remise}%
                  </span>
                  <span className="text-[10px] text-white/40 line-through">
                    {order.total.toLocaleString()} Ar
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className={`text-4xl font-black ${isAnnule ? 'line-through opacity-60' : ''}`}>
                {displayTotal.toLocaleString()} <span className="text-sm font-medium opacity-60">Ar</span>
              </p>
              <p className="text-[10px] text-white/40 italic">Toutes taxes incluses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}