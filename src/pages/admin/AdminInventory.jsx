import { useState } from 'react';
import productsData from "../../assets/products";
import { Link } from 'react-router-dom';

export default function AdminInventory() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movementType, setMovementType] = useState('IN'); 
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");

  // 1. État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5; // Nombre de commandes par page

  // 2. Logique de calcul de la pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = productsData.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(productsData.length / ordersPerPage);

  const openMovementModal = (product, type) => {
    setSelectedProduct(product);
    setMovementType(type);
    setQuantity(1);
    setComment("");
    setIsModalOpen(true);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Commentaire obligatoire !");
    console.log(`Action: ${movementType}, Qté: ${quantity}, Produit: ${selectedProduct.name}`);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 pt-12 md:pt-8">
      {/* HEADER ADAPTATIF */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Etats<span className="text-primary"> des Stocks</span>
          </h1>
          <p className="text-xs md:text-sm text-secondary font-medium">Contrôle des flux et inventaire</p>
        </div>
        
        {/* ZONE ACTIONS : RECHERCHE + BOUTON */}
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          
          {/* BARRE DE RECHERCHE */}
          <div className="relative flex-1 sm:w-64 md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder="Rechercher..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-10 py-3 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              onChange={(e) => {/* Ta fonction de recherche ici */}}
            />
          </div>

          {/* BOUTON HISTORIQUE */}
          <Link 
            to="/admin/inventory/history"
            className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
          >
            <span>📜</span> Historique
          </Link>
        </div>
      </div>

      {/* TABLEAU AVEC SCROLL HORIZONTAL MOBILE */}
      <div className="bg-transparent md:bg-white md:rounded-[2.5rem] md:shadow-sm md:border md:border-slate-100 overflow-hidden">
  
        {/* --- VUE MOBILE : CARDS (Affiche toutes les colonnes) --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {productsData.map((product) => (
            <div key={product.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              
              {/* Ligne 1 : Référence / Produit */}
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Référence</p>
                  <p className="font-black text-slate-900 text-base truncate">{product.name}</p>
                  <p className="text-[10px] text-primary font-bold uppercase">{product.category}</p>
                </div>
                
                {/* Ligne 2 : Stock (Intégré en haut à droite) */}
                <div className="text-right whitespace-nowrap">
                  <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Stock</p>
                  <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-black ${
                    product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {product.stock} pcs
                  </span>
                </div>
              </div>

              {/* Ligne 3 : Actions (Boutons larges pour mobile) */}
              <div className="pt-4 border-t border-slate-50 flex gap-3">
                <button 
                  onClick={() => openMovementModal(product, 'IN')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-[11px] font-black uppercase py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>+</span> Arrivage
                </button>
                <button 
                  onClick={() => openMovementModal(product, 'OUT')}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase py-3 rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>-</span> Retrait
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- VUE DESKTOP : TABLEAU (Inchangé) --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[11px] uppercase tracking-widest text-secondary font-black">
                <th className="px-8 py-5">Référence</th>
                <th className="px-6 py-5">Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {productsData.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                    <p className="text-[10px] text-secondary font-medium uppercase">{product.category}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black ${
                      product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {product.stock} en stock
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openMovementModal(product, 'IN')}
                        className="bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl transition active:scale-95"
                      >
                        + Arrivage
                      </button>
                      <button 
                        onClick={() => openMovementModal(product, 'OUT')}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-4 py-2 rounded-xl transition active:scale-95"
                      >
                        - Retrait
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* MODAL RESPONSIVE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">
              {movementType === 'IN' ? '📈 Arrivage' : '📉 Sortie'}
            </h2>
            <p className="text-secondary text-xs md:text-sm font-medium mb-6">{selectedProduct?.name}</p>

            <form onSubmit={handleConfirm} className="space-y-4 md:space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-secondary tracking-widest px-1">Quantité</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 focus:ring-2 focus:ring-primary font-bold text-base md:text-lg" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-secondary tracking-widest px-1">Raison / Commentaire</label>
                <textarea 
                  required
                  placeholder="Ex: Facture #FR-2026..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 focus:ring-2 focus:ring-primary h-20 md:h-24 text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 text-secondary py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className={`py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm text-white shadow-lg transition transform active:scale-95 ${
                    movementType === 'IN' ? 'bg-green-500 shadow-green-200' : 'bg-slate-900 shadow-slate-200'
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}