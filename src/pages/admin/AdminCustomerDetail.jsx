import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const customerInfo = {
    name: "Jean Dupont",
    email: "jean@mail.com",
    avatarInitial: "JD"
  };

  const history = [
    { id: "CMD-102", date: "2026-01-26", total: 45000, status: "Livré", items: [{ name: "Whey Gold Standard", qty: 1, price: 35000 }, { name: "Shaker Pro", qty: 1, price: 10000 }] },
    { id: "CMD-105", date: "2026-01-28", total: 105000, status: "En attente", items: [{ name: "Creatine 300g", qty: 2, price: 45000 }, { name: "BCAA", qty: 1, price: 15000 }] },
    { id: "CMD-106", date: "2026-01-26", total: 45000, status: "Livré", items: [{ name: "Whey Gold Standard", qty: 1, price: 35000 }] },
    // ... reste des données
  ];

  const filteredHistory = history.filter(order => 
    filterDate === "" ? true : order.date === filterDate
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredHistory.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredHistory.length / ordersPerPage);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen pt-14 md:pt-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        <Link to="/admin/customers" className="inline-flex items-center text-secondary font-bold text-xs md:text-sm hover:text-primary transition-colors gap-2">
          ← <span className="hidden sm:inline">Retour à la liste des clients</span><span className="sm:hidden">Retour</span>
        </Link>

        {/* GRID LAYOUT : 1 col sur mobile, 4 sur desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* CARTE INFO CLIENT (Sticky seulement sur Desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm lg:sticky lg:top-8 text-center">
              
              {/* Avatar */}
              <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl md:text-4xl font-black mx-auto mb-4 border-4 border-slate-50 shadow-lg">
                {customerInfo.avatarInitial}
              </div>
              
              {/* Nom & Email */}
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{customerInfo.name}</h2>
              <p className="text-secondary text-[10px] md:text-xs mb-8">{customerInfo.email}</p>
              
              {/* Section Montant Total - Nouveau Design */}
              <div className="pt-8 border-t border-slate-50">
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-center">
                  Valeur Totale des Achats
                </p>
                
                <div className="bg-slate-50 rounded-[2rem] py-6 px-4 border border-slate-100/50">
  
                  <div className="flex items-baseline justify-center gap-1">
                    <p className="text-4xl md:text-5xl font-black text-primary tracking-tighter">
                      {customerInfo.totalSpent?.toLocaleString()}
                    </p>
                    <span className="text-lg md:text-xl font-black text-primary uppercase">
                      195 000Ar
                    </span>
                  </div>
                </div>

                <p className="text-[9px] font-bold text-slate-400 mt-4 italic">
                  Client depuis le {customerInfo.joinDate}
                </p>
              </div>
            </div>
          </div>

          {/* HISTORIQUE DÉTAILLÉ */}
          <div className="lg:col-span-3 space-y-6">
            {/* HEADER & FILTRES */}
            <div className="flex flex-col gap-4 mb-2">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  Historique <span className="text-primary">Achats</span>
                </h2>
                <p className="text-xs md:text-sm text-secondary font-medium">Suivi détaillé des commandes</p>
              </div>

              {/* BARRE DE RECHERCHE + DATE */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text"
                    placeholder="Rechercher une commande..."
                    className="w-full bg-white border-none rounded-xl text-sm pl-10 pr-4 py-3 shadow-sm focus:ring-2 focus:ring-primary outline-none"
                    onChange={(e) => { /* Ta logique de filtre texte ici */ }}
                  />
                </div>
                <input 
                  type="date" 
                  className="w-full sm:w-auto bg-white border-none rounded-xl text-sm p-3 shadow-sm focus:ring-2 focus:ring-primary outline-none text-slate-500 font-bold"
                  onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            {/* CONTENU : CARDS (Mobile) & TABLEAU (Desktop) */}
            <div className="bg-transparent md:bg-white md:rounded-[2.5rem] md:overflow-hidden md:shadow-sm md:border md:border-slate-100">
              
              {/* --- VUE MOBILE : CARDS --- */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {currentOrders.map(order => (
                  <div key={order.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-primary text-sm">{order.id}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'Livré' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="bg-slate-50/50 rounded-2xl p-3 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded">
                            {item.qty}x
                          </span>
                          <span className="text-slate-700 font-bold text-[11px] truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Payé</p>
                      <p className="font-black text-lg text-slate-900">{order.total.toLocaleString()} Ar</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- VUE DESKTOP : TABLEAU --- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-secondary text-[10px] uppercase font-black tracking-widest">
                    <tr>
                      <th className="p-6">Commande</th>
                      <th className="p-6">Articles</th>
                      <th className="p-6">Total</th>
                      <th className="p-6 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {currentOrders.map(order => (
                      <tr key={order.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 align-top">
                          <p className="font-bold text-primary">{order.id}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase">{order.date}</p>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col gap-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 group">
                                <span className="text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-sm">
                                  {item.qty}x
                                </span>
                                <span className="text-slate-700 font-bold text-xs truncate max-w-[200px] group-hover:text-primary transition-colors">
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-6 align-top">
                          <p className="font-black text-base text-slate-900">{order.total.toLocaleString()} Ar</p>
                          <p className="text-[8px] text-secondary font-bold uppercase mt-1">Total TTC</p>
                        </td>
                        <td className="p-6 text-right align-top">
                          <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            order.status === 'Livré' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION (Adaptée) */}
              {totalPages > 1 && (
                <div className="mt-6 md:mt-0 p-4 md:p-6 bg-white md:bg-slate-50/50 border-t border-slate-100 rounded-[1.5rem] md:rounded-none flex justify-center items-center gap-2 shadow-sm md:shadow-none">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 text-slate-400 disabled:opacity-20 font-bold">←</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                        currentPage === i + 1 ? 'bg-primary text-white shadow-lg scale-110' : 'bg-white text-slate-400 border border-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 text-slate-400 disabled:opacity-20 font-bold">→</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}