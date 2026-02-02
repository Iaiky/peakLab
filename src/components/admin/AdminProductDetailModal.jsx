import React from 'react';

const ProductDetailModal = ({ isOpen, product, onClose, onEdit }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] overflow-hidden w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header Image */}
        <div className="relative h-72 bg-slate-100">
          {product.image ? (
            <img src={product.image} alt={product.Nom} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">PAS D'IMAGE</div>
          )}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-6 left-6">
            <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              {product.Categorie || "Général"}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="max-w-[60%]">
              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-1 break-words">{product.Nom}</h2>
              <p className="text-slate-500 font-bold uppercase tracking-tighter">{product.Poids} KG / UNITÉ</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Prix unitaire</p>
              <p className="text-3xl font-black text-primary">{product.Prix?.toLocaleString()}Ar</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Description du produit</p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {product.Description || "Aucune description disponible pour ce produit."}
              </p>
            </div>
          </div>

          {/* Stock Section */}
          <div className="mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase">État du Stock</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.Stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                <span className="font-bold text-slate-700">{product.Stock} unités disponibles</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={() => onEdit(product)}
              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              ✏️ Modifier la fiche
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;