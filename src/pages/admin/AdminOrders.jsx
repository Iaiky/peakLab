import { useState } from 'react';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import AdminOrderCard from '../../components/admin/AdminOrderCard';
import PaginationHistory from '../../components/history/PaginationsHistory';
import AdminEditOrderModal from '../../components/admin/AdminEditOrderModal';
import { db } from '../../firebase/config'; 
import { doc, updateDoc } from 'firebase/firestore'; 
import Swal from 'sweetalert2';

export default function AdminOrders() {
  const { 
    orders, 
    loading, 
    page, 
    hasNext, 
    setPage,
    activeStatus, 
    updateStatusFilter,
    searchInput, setSearchInput, 
    startDate, setStartDate,
    endDate, setEndDate,
    handleSearch,
    handleReset,
    markAsPaid,
    loadData
  } = useAdminOrders(5);

  // ÉTAT POUR LA MODALE
  const [orderToEdit, setOrderToEdit] = useState(null);

  // FONCTION DE SAUVEGARDE
  const handleUpdateOrder = async (orderId, newItems) => {
    try {
      const newTotal = newItems.reduce((acc, item) => acc + (item.prixUnitaire * item.qty), 0);
      
      const orderRef = doc(db, "Commandes", orderId);
      await updateDoc(orderRef, {
        items: newItems,
        total: newTotal,
        updatedAt: new Date()
      });

      // Notification de succès avec Swal
      Swal.fire({
        title: 'Mis à jour !',
        text: 'La commande a été modifiée avec succès.',
        icon: 'success',
        confirmButtonColor: '#0F172A',
        timer: 2000,
        showConfirmButton: false,
        // On utilise customClass pour injecter du style ou des classes Tailwind
        customClass: {
          popup: 'rounded-[2rem]' 
        }
      });
      setOrderToEdit(null);
      await loadData();
      // Optionnel : tu peux forcer un rafraîchissement si ton hook ne le fait pas auto
    } catch (error) {
      console.error(error);
      Swal.fire({
      title: 'Erreur',
      text: 'Impossible de mettre à jour la commande.',
      icon: 'error',
      confirmButtonColor: '#EF4444'
    });
    }
  };

  const stats = [
    { label: 'En attente', value: 'en_attente' },
    { label: 'Payées', value: 'paye' },
    // { label: 'Livrées', value: 'livre' }
  ];

  const hasFilters = searchInput || startDate || endDate; 

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pt-12 md:pt-8">
      <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8">
        Gestion des <span className="text-primary">Commandes</span>
      </h1>

      {/* TABS DE STATUT */}
      <div className="flex justify-center mb-6"> {/* Parent pour centrer le bloc */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit"> {/* w-fit : le gris s'arrête après le dernier bouton */}
          {stats.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateStatusFilter(tab.value)}
              className={`px-4 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                activeStatus === tab.value 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* BARRE DE FILTRES AVANCÉS */}
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

      {/* LISTE DES COMMANDES */}
      <div className="space-y-6 min-h-[400px]">
        {loading ? (
          <div className="py-20 text-center font-black text-slate-300 uppercase animate-pulse tracking-widest">
            Chargement des données...
          </div>
        ) : (
          <>
            {orders.length > 0 ? (
              <div className="grid gap-6">
                {orders.map(order => (
                  <AdminOrderCard 
                    key={order.id} 
                    order={order} 
                    onEdit={() => setOrderToEdit(order)}
                    onUpdateStatus={order.statut === 'en_attente' ? markAsPaid : null}
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                  Aucune commande trouvée pour ce filtre
                </p>
              </div>
            )}

            <div className="mt-10">
              <PaginationHistory 
                page={page} 
                hasNext={hasNext} 
                loading={loading}
                show={orders.length > 0}
                onPrev={() => setPage(page - 1)}
                onNext={() => setPage(page + 1)}
              />
            </div>
          </>
        )}
      </div>
      {/* MODALE D'ÉDITION */}
      {orderToEdit && (
        <AdminEditOrderModal 
          order={orderToEdit}
          onClose={() => setOrderToEdit(null)}
          onSave={handleUpdateOrder}
        />
      )}
    </div>
  );
}