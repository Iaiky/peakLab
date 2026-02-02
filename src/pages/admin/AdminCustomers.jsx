import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminCustomers() {
  const [customers] = useState([
    { id: 1, name: "Jean Dupont", email: "jean@mail.com", totalOrders: 5, totalSpent: 150000, joinDate: "12/01/2026" },
    { id: 2, name: "Mamy Rakoto", email: "mamy@mail.com", totalOrders: 2, totalSpent: 45000, joinDate: "20/01/2026" },
  ]);

  return (
    <div className="p-4 md:p-8 pt-12 md:pt-8">
      {/* TITRE ADAPTATIF */}
      <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mb-6 md:mb-8">
        Gestion <span className="text-primary">de Clients</span>
      </h1>

      {/* CONTENEUR DE TABLEAU RESPONSIVE */}
      <div className="bg-transparent md:bg-white md:rounded-[2.5rem] md:shadow-sm md:border md:border-slate-100 overflow-hidden">
  
        {/* --- VUE MOBILE : CARDS CLIQUABLES --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {customers.map((customer) => (
            <Link 
              key={customer.id} 
              to={`/admin/customers/${customer.id}`}
              className="block bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm active:scale-[0.98] active:bg-slate-50 transition-all"
            >
              {/* Header : Avatar + Nom (L'icône a été supprimée) */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xl flex-shrink-0">
                  {customer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-900 text-lg truncate leading-tight">{customer.name}</p>
                  <p className="text-[11px] text-slate-400 font-medium truncate">{customer.email}</p>
                </div>
              </div>

              {/* Info Grid interne */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Inscrit le</p>
                  <p className="text-xs font-bold text-slate-600">{customer.joinDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Commandes</p>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-black text-xs text-slate-600">
                    {customer.totalOrders}
                  </span>
                </div>
                <div className="col-span-2 mt-2 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Dépensé</p>
                    <p className="text-xl font-black text-primary">
                      {customer.totalSpent.toLocaleString()} <span className="text-[10px]">Ar</span>
                    </p>
                  </div>
                  {/* Petit indicateur discret pour suggérer le clic */}
                  <span className="text-slate-300 text-xs font-bold">Détails →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- VUE DESKTOP : TABLEAU --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-secondary text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="p-6">Client</th>
                <th className="p-6">Date Inscription</th>
                <th className="p-6 text-center">Commandes</th>
                <th className="p-6">Total Dépensé</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.map(customer => (
                <tr key={customer.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{customer.name}</p>
                        <p className="text-xs text-slate-400 truncate">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-slate-500 font-medium">{customer.joinDate}</td>
                  <td className="p-6 text-center">
                    <span className="bg-slate-100 px-3 py-1 rounded-lg font-black text-xs text-slate-600">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="p-6 font-bold text-slate-900">
                    {customer.totalSpent.toLocaleString()} Ar
                  </td>
                  <td className="p-6 text-right">
                    <Link 
                      to={`/admin/customers/${customer.id}`}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
                    >
                      <span>Voir Profil</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}