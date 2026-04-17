import { useParams, Link } from 'react-router-dom';
import { useCustomerDetail } from '../../hooks/useCustomerDetail'; 
import { useState } from 'react';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import PaginationHistory from '../../components/history/PaginationsHistory';

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const { 
    customer, 
    orders, 
    loading, 
    page, 
    hasNext, 
    setPage,
    searchInput, setSearchInput,
    startDate, setStartDate,
    endDate, setEndDate,
    handleSearch,
    handleReset,
    activeSearch
  } = useCustomerDetail(id);
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400">Chargement du profil...</div>;
  if (!customer) return <div className="p-20 text-center">Client introuvable.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-6">
      {/* Bouton Retour */}
      <Link to="/admin/customers" 
        className="mb-6 inline-flex items-center text-secondary font-bold text-xs md:text-sm hover:text-primary transition-colors gap-2"
      >
        ← <span className="hidden sm:inline">Retour à la liste des clients</span>
        <span className="sm:hidden">Liste des clients</span>
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* COLONNE GAUCHE : INFOS CLIENT */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center sticky top-28">
            <div className="w-24 h-24 mx-auto mb-4 bg-primary rounded-full border-4 border-slate-50 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-inner uppercase">
              {customer.photoURL ? (
                <img src={customer.photoURL} className="w-full h-full object-cover" alt="" />
              ) : customer.displayName?.charAt(0)}
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">{customer.displayName}</h2>
            <p className="text-xs text-secondary mb-4">{customer.email}</p>
            
            <div className="space-y-2 py-4 border-t border-slate-50 text-left">
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase">Téléphone</p>
                <p className="text-xs font-bold text-slate-700">{customer.phone || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase">Total Dépensé</p>
                <p className="text-lg font-black text-primary">{(customer.totalSpent || 0).toLocaleString()} Ar</p>
              </div>
            </div>

            <button className="w-full mt-4 py-3 rounded-xl bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
              Désactiver le compte
            </button>
          </div>
        </div>

        {/* COLONNE DROITE : HISTORIQUE DES COMMANDES */}
        <div className="md:col-span-3 space-y-6">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            Historique des <span className="text-primary">Commandes</span>
          </h3>

          <div className="w-full max-w-4xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              {/* 🔍 Search */}
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  placeholder="Rechercher une commande..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-white border-none rounded-2xl py-4 pl-11 pr-4 text-xs shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 transition-all font-medium"
                />
              </div>

              {/* 📅 Dates + Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full items-end">
                {/* Date début */}
                <div className="flex-1 w-full relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
                      Du
                    </span>
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    // Ajout de min-h et correction de l'apparence iOS
                    className="w-full bg-white border-none rounded-2xl py-3.5 pl-12 pr-4 text-xs shadow-sm focus:ring-2 focus:ring-primary/20 text-slate-700 font-bold cursor-pointer transition-all min-h-[50px] appearance-none"
                    style={{ WebkitAppearance: 'none' }} 
                  />
                </div>

                {/* Date fin */}
                <div className="flex-1 w-full relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
                      Au
                    </span>
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white border-none rounded-2xl py-3.5 pl-12 pr-4 text-xs shadow-sm focus:ring-2 focus:ring-primary/20 text-slate-700 font-bold cursor-pointer transition-all min-h-[50px] appearance-none"
                    style={{ WebkitAppearance: 'none' }}
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-row gap-2 w-full sm:w-auto">
                    {(activeSearch || startDate || endDate) && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex-1 sm:w-[46px] h-[46px] bg-slate-100 text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all flex items-center justify-center border border-slate-200"
                        title="Effacer les filtres"
                      >
                        ✕
                      </button>
                    )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`${
                      (activeSearch || startDate || endDate) ? "flex-[2]" : "w-full"
                    } sm:w-auto h-[46px] px-8 bg-secondary text-white rounded-2xl shadow-lg shadow-secondary/20 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50`}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="font-bold text-xs uppercase tracking-widest">
                        Filtrer
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-[2.5rem] md:overflow-hidden md:shadow-sm md:border md:border-slate-100">
    
            {/* VERSION DESKTOP */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse table-fixed"> 
                <thead className="bg-slate-50 text-secondary text-[10px] uppercase font-black tracking-widest">
                  <tr>
                    <th className="p-6 w-[15%]">Commande</th>
                    <th className="p-6 w-[50%]">Articles achetés</th> 
                    <th className="p-6 w-[20%]">Total</th>
                    <th className="p-6 w-[15%] text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)} 
                      className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      {/* ID & DATE */}
                      <td className="p-6">
                        <div className="flex flex-col">
                          <p className="font-bold text-primary truncate">#{order.id.slice(-8)}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                            {order.dateFormatted}
                          </p>
                        </div>
                      </td>

                      {/* ARTICLES */}
                      <td className="p-6">
                        <div className="flex flex-col gap-4">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-4 group/item">
                              <div className="flex items-center gap-3 min-w-0"> 
                                <span className="shrink-0 text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-sm">
                                  {item.qty}x
                                </span>
                                <div className="flex flex-col min-w-0">
                                  {item.group && (
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                      {item.group}
                                    </span>
                                  )}
                                  <span className="text-slate-700 font-bold text-xs truncate leading-tight">
                                    {item.nom}
                                  </span>
                                </div>
                              </div>
                              <span className="shrink-0 text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                {item.prixUnitaire?.toLocaleString()}Ar/u
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* TOTAL AVEC CONDITION DE PRIX FINAL */}
                      <td className="p-6">
                        <div className="flex flex-col">
                          <p className={`font-black text-lg leading-none ${
                            order.statut === 'paye' 
                              ? 'text-emerald-600' 
                              : order.statut === 'annule' 
                                ? 'text-red-400 line-through' 
                                : 'text-slate-900'
                          }`}>
                            {(order.statut === 'paye' && order.totalFinal ? order.totalFinal : order.total)?.toLocaleString()}Ar
                          </p>
                          <p className="text-[9px] text-secondary font-bold uppercase tracking-widest mt-1">
                            {order.statut === 'paye' ? 'Montant Encaissé' : order.statut === 'annule' ? 'Annulée' : 'Total TTC'}
                          </p>
                          {/* Affichage de la remise si elle existe */}
                          {order.statut === 'paye' && order.remise > 0 && (
                            <span className="text-[8px] text-emerald-500 font-black mt-1 uppercase">
                              Remise {order.remise}% incluse
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STATUT AVEC CONDITION DE COULEUR ET TEXTE */}
                      <td className="p-6 text-right">
                        <div className="flex justify-end">
                          <span className={`inline-flex items-center justify-center min-w-[100px] px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border whitespace-nowrap ${
                            order.statut === 'paye' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : order.statut === 'annule'
                                ? 'bg-red-50 text-red-500 border-red-100'
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {order.statut === 'paye' ? 'Payé' : order.statut === 'annule' ? 'Annulée' : 'En attente'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VERSION MOBILE */}
            <div className="md:hidden space-y-4 p-4 bg-slate-50/30">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)} 
                  className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-md active:scale-[0.98] transition-all cursor-pointer"
                >
                  {/* HEADER : ID & STATUT */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-primary text-base">#{order.id.slice(-8)}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{order.dateFormatted}</p>
                    </div>
                    
                    <span className={`flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      order.statut === 'paye' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : order.statut === 'annule'
                          ? 'bg-red-50 text-red-500 border-red-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {order.statut === 'paye' ? 'Payé' : order.statut === 'annule' ? 'Annulée' : 'En attente'}
                    </span>
                  </div>

                  {/* ARTICLES */}
                  <div className="space-y-3 mb-4 bg-slate-50/50 rounded-2xl p-3">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shrink-0 text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded">
                            {item.qty}x
                          </span>
                          <div className="flex flex-col min-w-0">
                            {item.group && (
                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                {item.group}
                              </span>
                            )}
                            <span className="text-slate-700 font-bold leading-tight truncate">
                              {item.nom}
                            </span>
                          </div>
                        </div>
                        <span className="text-slate-500 font-medium text-[10px] shrink-0 ml-2">
                          {item.prixUnitaire?.toLocaleString()}Ar
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER : TOTAL DYNAMIQUE */}
                  <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                    <div className="flex flex-col">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                        {order.statut === 'paye' ? 'Montant encaissé' : order.statut === 'annule' ? 'Annulée' : 'Total TTC'}
                      </p>
                      {order.statut === 'paye' && order.remise > 0 && (
                        <span className="text-[9px] text-emerald-500 font-black uppercase mt-0.5">
                          Remise -{order.remise}%
                        </span>
                      )}
                    </div>
                    
                    <p className={`font-black text-xl leading-none tracking-tighter ${
                      order.statut === 'paye' 
                        ? 'text-emerald-600' 
                        : order.statut === 'annule' 
                          ? 'text-red-400 line-through' 
                          : 'text-slate-900'
                    }`}>
                      {(order.statut === 'paye' && order.totalFinal ? order.totalFinal : order.total)?.toLocaleString()}
                      <span className="text-sm ml-0.5 font-bold">Ar</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="p-4 border-t border-slate-50">
                <PaginationHistory 
                page={page} 
                hasNext={hasNext} 
                loading={loading}
                show={orders.length > 0}
                onPrev={() => setPage(page - 1)}
                onNext={() => setPage(page + 1)}
                />
            </div>
          </div>

        </div>
      </div>

      <OrderDetailsModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
      />
    </div>
  );
}