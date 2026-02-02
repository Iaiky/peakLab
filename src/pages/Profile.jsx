// src/pages/Profile.jsx
import { useState } from 'react';

export default function Profile() {
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5; // Nombre de commandes par page

  const history = [
    { id: "ORD-9928", date: "2023-10-24", total: 120005, status: "Livré", items: [{ name: "Whey Gold Standard", qty: 1, price: 65000 }, { name: "BCAA Amino", qty: 2, price: 30000 }] },
    { id: "ORD-8812", date: "2023-09-12", total: 45000, status: "Confirmé", items: [{ name: "Creatine 300g", qty: 1, price: 45000 }] },
    { id: "ORD-7712", date: "2023-08-05", total: 80000, status: "Livré", items: [{ name: "Vitamines Max", qty: 2, price: 40000 }] },
    { id: "ORD-6610", date: "2023-07-20", total: 55000, status: "Livré", items: [{ name: "Shaker Pro", qty: 1, price: 55000 }] },
    { id: "ORD-9929", date: "2023-10-24", total: 120005, status: "Livré", items: [{ name: "Whey Gold Standard", qty: 1, price: 65000 }, { name: "BCAA Amino", qty: 2, price: 30000 }] },
    { id: "ORD-8852", date: "2023-09-12", total: 45000, status: "Confirmé", items: [{ name: "Creatine 300g", qty: 1, price: 45000 }] },
    { id: "ORD-8712", date: "2023-08-05", total: 80000, status: "Livré", items: [{ name: "Vitamines Max", qty: 2, price: 40000 }] },
    { id: "ORD-6640", date: "2023-07-20", total: 55000, status: "Livré", items: [{ name: "Shaker Pro", qty: 1, price: 55000 }] },
    // Ajoute d'autres objets ici pour tester la pagination...
  ];

  // 2. Logique de calcul de la pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = history.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(history.length / ordersPerPage);

  // États pour les infos profil (simulant une base de données)
  const [user, setUser] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
    avatar: null // On pourra ajouter une logique d'upload plus tard
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleSave = (e) => {
    e.preventDefault();
    setUser(formData);
    setIsEditModalOpen(false);
    // Ici, on ajoutera plus tard l'appel API pour sauvegarder en base de données
  };

  const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Crée une URL locale pour afficher l'image tout de suite
    const imageUrl = URL.createObjectURL(file);
    setFormData({ ...formData, avatar: imageUrl });
  }
};

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* BLOC INFOS PROFIL */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center sticky top-28">
            <div className="relative w-24 h-24 mx-auto mb-4 group">
                <div className="w-full h-full bg-primary rounded-full border-4 border-slate-50 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-inner">
                   {user.firstName[0]}{user.lastName[0]}
                </div>
                {/* Petit badge d'édition sur la photo */}
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full border-2 border-white hover:bg-primary transition-colors"
                >
                  📸
                </button>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">{user.firstName} {user.lastName}</h2>
            <p className="text-xs text-secondary mb-6">{user.email}</p>
            
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
            <div className="flex flex-col sm:flex-row gap-3">
              
              {/* BARRE DE RECHERCHE */}
              <div className="relative flex-[2] group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="N° commande, produit..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border-none rounded-2xl py-3.5 pl-11 pr-4 text-xs shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 transition-all font-medium"
                />
              </div>

              {/* FILTRE DATE */}
              <div className="flex-1">
                <input 
                  type="date" 
                  className="w-full bg-white border-none rounded-2xl py-3.5 px-4 text-xs shadow-sm focus:ring-2 focus:ring-primary/20 text-slate-500 font-medium"
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white md:bg-white rounded-[2.5rem] md:overflow-hidden md:shadow-sm md:border md:border-slate-100">
  
          {/* VERSION DESKTOP : Table classique (cachée sur mobile) */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-secondary text-[10px] uppercase font-black tracking-widest">
                  <tr>
                    <th className="p-6">Commande</th>
                    <th className="p-6">Articles achetés</th>
                    <th className="p-6">Total</th>
                    <th className="p-6 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {history.map(order => (
                    <tr key={order.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 align-top">
                        <p className="font-bold text-primary">{order.id}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{order.date}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center group max-w-[280px]">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-sm">{item.qty}x</span>
                                <span className="text-slate-700 font-bold text-xs truncate">{item.name}</span>
                              </div>
                              <span className="text-[10px] font-medium text-slate-400 border-l border-slate-200 pl-2 ml-2">{item.price.toLocaleString()}Ar/u</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-6 align-top">
                        <div className="flex flex-col">
                          <p className="font-black text-lg text-slate-900 leading-none">{order.total.toLocaleString()}Ar</p>
                          <p className="text-[9px] text-secondary font-bold uppercase tracking-widest mt-1">Total TTC</p>
                        </div>
                      </td>
                      <td className="p-6 text-right align-top">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                          order.status === 'Livré' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VERSION MOBILE : Liste de Cartes (cachée sur desktop) */}
            <div className="md:hidden space-y-4">
              {history.map(order => (
                <div key={order.id} className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm">
                  {/* Header de la carte : ID + Statut */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-primary text-base">{order.id}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      order.status === 'Livré' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>{order.status}</span>
                  </div>

                  {/* Liste des produits (plus compacte) */}
                  <div className="space-y-3 mb-4 bg-slate-50/50 rounded-2xl p-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-400">{item.qty}x</span>
                          <span className="text-slate-700 font-bold">{item.name}</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">{item.price.toLocaleString()}Ar/u</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer de la carte : Prix total */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <p className="text-[10px] text-secondary font-bold uppercase">Total réglé</p>
                    <p className="font-black text-lg text-slate-900">{order.total.toLocaleString()}Ar</p>
                  </div>
                </div>
              ))}
            </div>

            {/* BARRE DE PAGINATION (Adaptée) */}
            {totalPages > 1 && (
              <div className="mt-6 md:mt-0 p-6 md:bg-slate-50/50 border-t border-slate-100 flex justify-center items-center gap-2">
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-slate-400 hover:text-primary disabled:opacity-30 transition"
                  >
                    ←
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                        currentPage === i + 1 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' 
                        : 'bg-white text-slate-400 border border-slate-200 hover:border-primary/30'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-slate-400 hover:text-primary disabled:opacity-30 transition"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MODAL D'ÉDITION */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
              {/* Overlay flouté */}
              <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsEditModalOpen(false)}
              ></div>

              {/* Contenu Modal */}
              <form 
                onSubmit={handleSave}
                className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Éditer <span className="text-primary">Profil</span></h3>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-300 hover:text-slate-600">✕</button>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 group">
                    {/* Prévisualisation de la photo */}
                    <div className="w-full h-full bg-slate-100 rounded-full border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-black text-slate-300">
                          {formData.firstName[0]}{formData.lastName[0]}
                        </span>
                      )}
                    </div>
                    
                    {/* Input File caché */}
                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handlePhotoChange} 
                      />
                      📸
                    </label>
                  </div>
                  <p className="text-[10px] font-black uppercase text-secondary mt-2 tracking-widest">Changer la photo</p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Prénom</label>
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Nom</label>
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-slate-200"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}