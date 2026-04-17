// src/pages/Profile.jsx
import { useState } from 'react';
import EditProfileModal from '../components/EditProfileModal';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useAuth } from '../context/AuthContext';
import { useUserOrders } from '../hooks/useUserOrder';
import PaginationHistory from '../components/history/PaginationsHistory';
import OrderDetailsModal from '../components/OrderDetailsModal';

export default function Profile() {

  const { user, loading: authLoading } = useAuth();
  const { updateUserData, loading: updateLoading } = useUpdateProfile();

  const { 
    orders, loading, page, hasNext, setPage,
    searchInput, setSearchInput,
    startDate, setStartDate,
    endDate, setEndDate,
    handleSearch, handleReset
  } = useUserOrders(user?.uid, 5);
 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const hasFilters = searchInput || startDate || endDate;  

  // Si le contexte charge encore
  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  // Sécurité si l'utilisateur accède à la page sans être connecté
  if (!user) return <div className="min-h-screen flex items-center justify-center">Veuillez vous connecter.</div>;

  const getInitials = () => {
    if (user?.initiales) return user.initiales;
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return "??";
  };

  const handleSaveProfile = async (newData, imageFile) => {
    // Le hook va mettre à jour Firebase (Auth + Firestore)
    await updateUserData(user.uid, newData, imageFile);
    setIsEditModalOpen(false);
    // Note: Le AuthContext se mettra à jour automatiquement grâce à onAuthStateChanged
  };


  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* BLOC INFOS PROFIL */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center sticky top-28">
            <div className="relative w-24 h-24 mx-auto mb-4 group">
                <div className="w-full h-full bg-primary rounded-full border-4 border-slate-50 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-inner uppercase">
                  {user?.photoURL || user?.avatar ? (
                    <img 
                      src={user?.photoURL || user?.avatar} 
                      alt="Profil" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    /* Sécurité : on prend la 1ère lettre du displayName ou 'U' par défaut */
                    <>{getInitials()}</>
                  )}
                </div>
                {/* Petit badge d'édition sur la photo */}
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full border-2 border-white hover:bg-primary transition-colors"
                >
                  📸
                </button>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">{user.displayName}</h2>
            <p className="text-xs text-secondary mb-1">{user?.email}</p>
            <div className="mt-2 min-h-[20px]"> {/* min-h évite le saut de mise en page */}
              {user?.phone ? (
                <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                  <span>📞</span> {user.phone}
                </p>
              ) : (
                <p className="text-[10px] italic text-slate-300">Aucun numéro enregistré</p>
              )}
            </div>
            
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-3 rounded-xl border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
            >
              Modifier le Profil
            </button>
          </div>
        </div>

        {/* Historique d'achat */}
        <div className="md:col-span-3 space-y-6">
          {/* En-tête : Vertical sur mobile, Horizontal sur desktop */}
          <div className="flex flex-col gap-6 mb-2">
            
            {/* Titre et Sous-titre */}
            <div>
              <h2 className="text-2xl font-black text-slate-900">Historique</h2>
              <p className="text-sm text-secondary">Liste détaillée de vos achats</p>
            </div>

            {/* Zone d'actions : Recherche + Date */}
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
                      {hasFilters && (
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
                        hasFilters ? "flex-[2]" : "w-full"
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
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4 group/item">
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
                                {item.prixUnitaire.toLocaleString()}Ar/u
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* TOTAL DYNAMIQUE */}
                      <td className="p-6">
                        <div className="flex flex-col">
                          {/* Si payé, on affiche le totalFinal en vert, sinon le total normal */}
                          <p className={`font-black text-lg leading-none 
                          ${order.statut === 'paye' 
                              ? 'text-emerald-600' 
                              : order.statut === 'annule'
                                ? 'text-red-400 line-through'
                                : 'text-slate-900'
                          }`}>
                            {(order.statut === 'paye' && order.totalFinal ? order.totalFinal : order.total).toLocaleString()}Ar
                          </p>
                          <p className="text-[9px] text-secondary font-bold uppercase tracking-widest mt-1">
                            {order.statut === 'paye' ? 'Montant Encaissé' : order.statut === 'annule' ? 'Annulée' : 'Total TTC'}
                          </p>
                          {/* Petit badge indiquant la remise si elle existe */}
                          {order.statut === 'paye' && order.remise > 0 && (
                            <span className="text-[8px] text-emerald-500 font-bold mt-1 uppercase">
                              Remise de {order.remise}% incluse
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STATUT AVEC COULEURS MISES À JOUR */}
                      <td className="p-6">
                        <div className="flex justify-end items-center h-full">
                          <span className={`
                            /* Structure du badge */
                            inline-flex items-center justify-center 
                            min-w-[100px] px-3 py-1.5 rounded-xl
                            
                            /* Typographie */
                            text-[9px] font-black uppercase tracking-widest whitespace-nowrap
                            
                            /* Style visuel */
                            shadow-sm border transition-all
                            
                            ${order.statut === 'paye' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : order.statut === 'annule'
                                ? 'bg-red-50 text-red-500 border-red-100'
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                            }
                          `}>      
                            {order.statut === 'paye' ? 'Payé' : order.statut === 'annule' ? 'Annulée' : 'En attente'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VERSION MOBILE (Mise à jour avec le poids) */}
            <div className="md:hidden space-y-4 p-4 bg-slate-50/30">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)} 
                  className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-md active:scale-[0.98] transition-all cursor-pointer"
                >
                  {/* HEADER MOBILE : ID & STATUT */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-primary text-base">#{order.id.slice(-8)}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                        {order.dateFormatted}
                      </p>
                    </div>
                    
                    {/* Badge de statut harmonisé avec le bureau */}
                    <span className={`flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm 
                    ${order.statut === 'paye' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : order.statut === 'annule'
                        ? 'bg-red-50 text-red-500 border-red-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }
                    `}>
                      {order.statut === 'paye' ? 'Payé' : order.statut === 'annule' ? 'Annulée' : 'En attente'}
                    </span>
                  </div>

                  {/* LISTE DES ARTICLES */}
                  <div className="space-y-3 mb-4 bg-slate-50/50 rounded-2xl p-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
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
                          {item.prixUnitaire.toLocaleString()}Ar
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER MOBILE : TOTAL DYNAMIQUE */}
                  <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                    <div className="flex flex-col">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                        {order.statut === 'paye' ? 'Montant encaissé' : 'Total réglé'}
                      </p>
                      {order.statut === 'paye' && order.remise > 0 && (
                        <span className="text-[9px] text-emerald-500 font-black uppercase mt-0.5">
                          -{order.remise}% de remise
                        </span>
                      )}
                    </div>
                    
                    <p className={`font-black text-xl leading-none tracking-tighter 
                    ${
                      order.statut === 'paye' 
                        ? 'text-emerald-600' 
                        : order.statut === 'annule'
                          ? 'text-red-400 line-through'
                          : 'text-slate-900'
                    }`}>
                      {(order.statut === 'paye' && order.totalFinal ? order.totalFinal : order.total).toLocaleString()}
                      <span className="text-sm ml-0.5">Ar</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <PaginationHistory 
              page={page} 
              hasNext={hasNext} 
              loading={loading}
              show={orders.length > 0}
              onPrev={() => setPage(page - 1)}
              onNext={() => setPage(page + 1)}
            />
          </div>

          <EditProfileModal 
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={user} // Données venant de ton context ou firestore
            onSave={handleSaveProfile}
            loading={updateLoading}
          />
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