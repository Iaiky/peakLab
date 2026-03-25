import { useState } from 'react';
import { useCart } from "../context/CartContext";
import { useCategories } from '../hooks/useCategorie';
import { useGroups } from '../hooks/useGroup';

export default function ProductModal({ product, isOpen, onClose }) {
  const { categories: allCategoriesDocs } = useCategories();
  const { groups: allGroupsDocs } = useGroups();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // 1. On place le "Early Return" AVANT toute manipulation de l'objet product
  if (!isOpen || !product) return null;

  const getCategoryName = (idCategorie) => {
    if (!idCategorie) return "Général";
    const cat = allCategoriesDocs.find(c => c.id === idCategorie);
    return cat ? cat.Nom : "Général";
  };
  
  const getGroupName = (idGroup) => {
    if (!idGroup) return "Général";
    const group = allGroupsDocs.find(c => c.id === idGroup);
    return group ? group.Nom : "Général";
  };

  // 2. On définit l'objet à ajouter au panier ici, après avoir vérifié que product existe
  const handleFinalAdd = () => {
    const productToCart = { 
      id: product.id, 
      name: product.Nom, 
      price: product.Prix, 
      category: getCategoryName(product.IdCategorie), 
      group: getGroupName(product.IdGroupe), 
      weight: product.Poids || 0, // Correction : Poids ici
      stock: product.Stock || 0,   // Correction : Stock ici
      image: product.image, 
    };

    addToCart(productToCart, quantity);
    onClose(); 
    setQuantity(1); // Reset de la quantité pour la prochaine ouverture
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Contenu de la Modal - Réduit à max-w-2xl */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] animate-in zoom-in-95 duration-300">
        
        {/* BOUTON FERMER - Plus petit */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 shadow-sm transition-all active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Partie Gauche : Image - Moins de padding */}
        <div className="md:w-[45%] bg-slate-50 flex items-center justify-center p-8">
          <img 
            src={product.image || "https://via.placeholder.com/400"} 
            alt={product.Nom}
            className="w-full h-auto max-h-[250px] md:max-h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Partie Droite : Infos - Espacements réduits */}
        <div className="md:w-[55%] p-6 md:p-8 flex flex-col">
          <div className="mb-4"> 
            <div className="flex gap-2 mb-3">
              {/* MARQUE : En noir ou couleur forte */}
              <span className="text-[9px] font-black uppercase tracking-widest text-white bg-slate-900 px-2.5 py-1 rounded-md">
                {getGroupName(product.IdGroupe)}
              </span>
              
              {/* CATÉGORIE : Plus soft */}
              <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                {getCategoryName(product.IdCategorie)}
              </span>
            </div>
            
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{product.Nom}</h2>
              {/* Affiche le poids uniquement s'il est > 0 */}
              {product.Poids > 0 && (
                <span className="text-slate-400 font-bold text-xs">
                  {product.Poids}g
                </span>
              )}
            </div>

            <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-3">
              {product.Description || "Nutrition de haute performance."}
            </p>
          </div>

          <div className="mb-4 ml-1">
            <span className={`text-[10px] font-black uppercase tracking-wider ${
              product.Stock > 5 ? 'text-emerald-500' : product.Stock > 0 ? 'text-orange-500' : 'text-red-500'
            }`}>
              ● {product.Stock > 0 ? `${product.Stock} en stock` : 'Rupture'}
            </span>
          </div>

          <div className="h-[1px] w-full bg-slate-100 mb-6" />

          {/* Prix et Quantité plus compacts */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl md:text-3xl font-black text-slate-900">
              {(product.Prix || 0).toLocaleString()}Ar
            </span>
            
            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-600 hover:text-primary transition-colors"
              > - </button>
              <span className="font-black text-base w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-600 hover:text-primary transition-colors"
              > + </button>
            </div>
          </div>

          <button 
            onClick={handleFinalAdd}
            className="w-full bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Ajouter au panier
          </button>
          
        </div>
      </div>
    </div>
  );
}