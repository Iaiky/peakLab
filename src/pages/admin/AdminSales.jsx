import { useState } from 'react';

export default function AdminSales() {
  const [allSales] = useState([
    { id: "CMD-101", customer: "Marc Riva", date: "2026-01-20", total: 89000, items: [{name: "Whey Gold", qty: 1, price: 59000}, {name: "BCAA", qty: 1, price: 30000}] },
    { id: "CMD-102", customer: "Jean Dupont", date: "2026-01-23", total: 143000, items: [{name: "Creatine", qty: 2, price: 25000}, {name: "Whey Gold", qty: 1, price: 93000}] },
    { id: "CMD-103", customer: "Marc Riva", date: "2026-01-20", total: 89000, items: [{name: "Whey Gold", qty: 1, price: 59000}, {name: "BCAA", qty: 1, price: 30000}] },
    { id: "CMD-104", customer: "Jean Dupont", date: "2026-01-23", total: 143000, items: [{name: "Creatine", qty: 2, price: 25000}, {name: "Whey Gold", qty: 1, price: 93000}] },
    { id: "CMD-105", customer: "Marc Riva", date: "2026-01-20", total: 89000, items: [{name: "Whey Gold", qty: 1, price: 59000}, {name: "BCAA", qty: 1, price: 30000}] },
    { id: "CMD-106", customer: "Jean Dupont", date: "2026-01-23", total: 143000, items: [{name: "Creatine", qty: 2, price: 25000}, {name: "Whey Gold", qty: 1, price: 93000}] },
    { id: "CMD-107", customer: "Marc Riva", date: "2026-01-20", total: 89000, items: [{name: "Whey Gold", qty: 1, price: 59000}, {name: "BCAA", qty: 1, price: 30000}] },
    { id: "CMD-108", customer: "Jean Dupont", date: "2026-01-23", total: 143000, items: [{name: "Creatine", qty: 2, price: 25000}, {name: "Whey Gold", qty: 1, price: 93000}] },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [itemFilter, setItemFilter] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredSales = allSales.filter(sale => {
    const matchesCustomer = sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesItem = itemFilter === "" || sale.items.some(item => item.name.toLowerCase().includes(itemFilter.toLowerCase()));
    return matchesCustomer && matchesItem;
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const currentSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 md:p-8 pt-12 md:pt-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mb-6 md:mb-8 text-center md:text-left">
          Historique des <span className="text-primary">Ventes</span>
        </h1>

        {/* FILTRES RESPONSIVES */}
        <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] mb-6 md:mb-8 shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-secondary tracking-widest px-1">Client</label>
            <input 
              type="text" 
              placeholder="Nom du client..."
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-secondary tracking-widest px-1">Article spécifique</label>
            <input 
              type="text" 
              placeholder="ex: Whey, Creatine..."
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
              onChange={(e) => {setItemFilter(e.target.value); setCurrentPage(1);}}
            />
          </div>
        </div>

        {/* TABLEAU (Desktop) & LISTE (Mobile) */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="hidden md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest text-secondary font-black">
                  <th className="px-8 py-5">Date</th>
                  <th className="px-6 py-5">Client</th>
                  <th className="px-6 py-5">Montant</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-5 text-sm text-slate-500">{sale.date}</td>
                    <td className="px-6 py-5 font-bold text-slate-900">{sale.customer}</td>
                    <td className="px-6 py-5 font-black text-primary">{sale.total.toLocaleString()} Ar</td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => setSelectedSale(sale)} className="bg-slate-900 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:bg-primary transition">
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Version Mobile (Cards) */}
          <div className="md:hidden divide-y divide-slate-100">
            {currentSales.map((sale) => (
              <div key={sale.id} className="p-5 flex justify-between items-center active:bg-slate-50" onClick={() => setSelectedSale(sale)}>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{sale.date} • {sale.id}</p>
                  <p className="font-black text-slate-900">{sale.customer}</p>
                  <p className="font-black text-primary text-sm">{sale.total.toLocaleString()} Ar</p>
                </div>
                <div className="text-slate-300">❯</div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="p-4 md:p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center flex-wrap gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 md:w-11 md:h-11 rounded-xl font-bold text-xs md:text-sm transition-all ${
                  currentPage === i + 1 ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110' : 'bg-white text-secondary border border-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* MODAL FICHE DE VENTE */}
        {selectedSale && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setSelectedSale(null)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-[2rem] p-6 md:p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Fiche de Vente</h2>
                  <p className="text-primary font-bold text-sm mt-1">{selectedSale.id}</p>
                </div>
                <button onClick={() => setSelectedSale(null)} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition">✕</button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Client</span>
                  <span className="font-bold text-slate-900">{selectedSale.customer}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3">Panier</p>
                  {selectedSale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-600"><b className="text-primary font-black">{item.qty}x</b> {item.name}</span>
                      <span className="font-black text-slate-900">{(item.price * item.qty).toLocaleString()} Ar</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t-2 border-dashed border-slate-100">
                <span className="font-black text-slate-900 uppercase tracking-widest text-xs md:text-sm">Total Payé</span>
                <span className="text-2xl md:text-3xl font-black text-primary">{selectedSale.total.toLocaleString()} Ar</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}