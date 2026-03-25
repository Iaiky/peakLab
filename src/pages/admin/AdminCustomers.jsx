import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import  PaginationHistory  from '../../components/history/PaginationsHistory'

export default function AdminCustomers() {
  const { 
    customers, loading, page, hasNext, setPage, 
    searchInput, setSearchInput, handleSearch, handleReset, activeSearch 
  } = useCustomers(8);

  return (
    <div className="p-4 md:p-8 pt-12 md:pt-8 max-w-7xl mx-auto">
      
      {/* HEADER AVEC RECHERCHE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Gestion <span className="text-primary">de Clients</span>
          </h1>
          {activeSearch && (
            <p className="text-xs font-bold text-primary uppercase mt-1">
              Résultats pour : "{activeSearch}"
            </p>
          )}
        </div>

        {/* Formulaire de recherche */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto"
        >
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
              placeholder="Rechercher un client"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border-none rounded-2xl py-4 pl-11 pr-4 text-xs shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 transition-all font-medium"
            />
          </div>

          <div className="flex flex-row gap-2 w-full sm:w-auto">
            {activeSearch && (
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
                activeSearch ? "flex-[2]" : "w-full"
              } sm:w-auto h-[46px] px-8 bg-secondary text-white rounded-2xl shadow-lg shadow-secondary/20 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="font-bold text-xs uppercase tracking-widest">
                  Rechercher
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-transparent md:bg-white md:rounded-[2.5rem] md:shadow-sm md:border md:border-slate-100 overflow-hidden">

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
             <p className="text-[10px] font-black uppercase text-slate-400">Chargement...</p>
           </div>
        ) : (
          <>
  
        {/* --- VUE MOBILE --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {customers.map((customer) => (
            <Link 
              key={customer.id} 
              to={`/admin/customers/${customer.id}`}
              className="block bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg">
                  {customer.photoURL ? (
                    <img src={customer.photoURL} className="w-full h-full rounded-full object-cover" alt="" />
                  ) : customer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-900 text-lg truncate leading-tight">{customer.name}</p>
                  <p className="text-[11px] text-slate-400 font-medium truncate">{customer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Inscription</p>
                  <p className="text-xs font-bold text-slate-600">{customer.joinDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Commandes</p>
                  <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md font-black text-[10px]">
                    {customer.totalOrders}
                  </span>
                </div>
                <div className="col-span-2 mt-2 flex justify-between items-end bg-slate-50 p-3 rounded-2xl">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Total Dépensé</p>
                    <p className="text-lg font-black text-primary">
                      {customer.totalSpent.toLocaleString()} <span className="text-[10px]">Ar</span>
                    </p>
                  </div>
                  <span className="bg-white text-slate-900 px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-slate-100">
                    Détails
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- VUE DESKTOP --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-secondary text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="p-6">Client</th>
                <th className="p-6">Membre depuis</th>
                <th className="p-6 text-center">Achats</th>
                <th className="p-6">Valeur Client</th>
                <th className="p-6 text-right">Fiche</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.map(customer => (
                <tr key={customer.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {customer.photoURL ? <img src={customer.photoURL} className="w-full h-full rounded-full object-cover" alt="" /> : customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{customer.name}</p>
                        <p className="text-xs text-slate-400 truncate">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-slate-500 font-bold text-xs uppercase">{customer.joinDate}</td>
                  <td className="p-6 text-center">
                    <span className="bg-slate-100 px-3 py-1 rounded-lg font-black text-[10px] text-slate-600">
                      {customer.totalOrders} CMD
                    </span>
                  </td>
                  <td className="p-6 font-black text-slate-900">
                    {customer.totalSpent.toLocaleString()} Ar
                  </td>
                  <td className="p-6 text-right">
                    <Link 
                      to={`/admin/customers/${customer.id}`}
                      className="inline-block bg-white border-2 border-slate-100 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm"
                    >
                      Voir Profil
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
            <div className="p-6">
              <PaginationHistory 
                page={page} 
                hasNext={hasNext} 
                loading={loading}
                show={customers.length > 0}
                onPrev={() => setPage(page - 1)}
                onNext={() => setPage(page + 1)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}