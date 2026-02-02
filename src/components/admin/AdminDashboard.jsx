import { Link } from 'react-router-dom';
import productsData from "../../assets/products";

export default function AdminDashboard() {
  // 1. Simulation de données pour le Dashboard
  const stats = [
    { label: "Ventes du mois", value: "2450000Ar", icon: "💰", color: "text-green-600" },
    { label: "Commandes à traiter", value: "12", icon: "🕒", color: "text-orange-500" },
  ];

  // 2. Filtrer les produits en stock bas (< 10 unités)
  const lowStockProducts = productsData.filter(p => p.stock < 10).slice(0, 5);

  // 3. Dernières commandes (simulation)
  const recentOrders = [
    { id: "CMD-102", customer: "Jean Dupont", total: 143, status: "En attente" },
    { id: "CMD-101", customer: "Marc Riva", total: 89, status: "Payé" },
  ];

  return (
    
    <div className="space-y-6 md:space-y-10">
      {/* HEADER */}
      <div className="pt-12 md:pt-0">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
          Tableau de <span className="text-primary">Bord</span>
        </h1>
        <p className="text-secondary font-medium text-sm">Voici l'état actuel de votre boutique PeakLab Performance.</p>
      </div>

      {/* STATS QUICK VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
            <span className="text-3xl opacity-50">{stat.icon}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION : ALERTES STOCK BAS */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black text-slate-900 uppercase tracking-tight">Alertes Stock Bas ⚠️</h2>
            <Link to="/admin/inventory" className="text-xs font-bold text-primary hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Reste : {p.stock} unités</p>
                </div>
                <Link to="/admin/inventory" className="bg-white text-red-500 px-4 py-2 rounded-xl text-[10px] font-black shadow-sm border border-red-200">RÉAPPRO</Link>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION : DERNIÈRES COMMANDES */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black text-slate-900 uppercase tracking-tight">Dernières Activités 🛒</h2>
            <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline">Gérer</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{o.customer}</p>
                    <p className="text-[10px] text-secondary font-medium uppercase">{o.id} • {o.total}€</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${o.status === 'Payé' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}