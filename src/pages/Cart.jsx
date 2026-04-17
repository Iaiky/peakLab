// src/pages/Cart.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useOrder } from '../hooks/useOrder';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { createOrder, loading } = useOrder();
  const { user } = useAuth();

  const handleConfirmOrder = () => {
    if (!user) {
      alert("Veuillez vous connecter pour valider votre commande.");
      // Optionnel : rediriger vers /login ici
      return;
    }
    
    // On appelle la logique du hook
    createOrder(user);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto relative">
        
        {/* BOUTON RETOUR */}
        <Link 
          to="/" 
          className="absolute -top-10 left-0 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-bold tracking-widest">Continuer les achats</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-10">
          Mon Panier 🛒
        </h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="text-5xl mb-6">🛒</div>
            <p className="text-slate-500 font-medium mb-8 text-lg">Votre panier est encore vide...</p>
            <Link to="/" className="bg-primary text-white px-10 py-4 rounded-full font-bold inline-block hover:scale-105 transition-all shadow-lg shadow-primary/20">
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Liste des produits */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={clearCart}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Tout vider
                </button>
              </div>
              {cartItems.map(item => (
                <div key={item.id} className="group bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 md:gap-6 animate-in slide-in-from-left duration-300 hover:border-slate-200 transition-all">
  
                  {/* Image avec badge poids discret */}
                  <div className="relative w-24 h-24 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                    {item.weight > 0 && (
                      <span className="absolute bottom-1 right-1 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-lg text-[8px] font-black text-slate-500 border border-slate-100">
                        {item.weight}g
                      </span>
                    )}
                  </div>

                  {/* Infos du produit */}
                  <div className="flex-1 min-w-0"> {/* min-w-0 évite que le texte casse le flex */}
                    <div className="flex flex-col">
                      {/* GROUPE (Marque) : Priorité visuelle haute */}
                      {item.group && (
                        <div className="flex"> {/* Flex container pour que le badge ne prenne que la largeur du texte */}
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                            {item.group}
                          </span>
                        </div>
                      )}

                      {/* NOM DU PRODUIT */}
                      <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight line-clamp-2">
                        {item.name}
                      </h3>

                      {/* INFOS SECONDAIRES : Catégorie et Poids */}
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {item.category}
                        </p>
                        
                        {item.weight > 0 && (
                          <>
                            <span className="text-slate-300 text-[10px]">•</span>
                            <span className="text-[10px] text-slate-400 font-medium">{item.weight}g</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Contrôleur de quantité simplifié */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)} 
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-400 hover:text-primary transition active:scale-90"
                        > - </button>
                        <span className="font-black text-xs w-6 text-center text-slate-700">{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.qty >= item.stockDisponible}
                          className={`w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold transition active:scale-90 ${
                            item.qty >= item.stockDisponible
                              ? 'text-slate-200 cursor-not-allowed'
                              : 'text-slate-400 hover:text-primary'
                          }`}
                        > + </button>
                      </div>
                    </div>
                  </div>

                  {/* Prix et Action Supprimer */}
                  <div className="flex flex-col items-end justify-between self-stretch py-1">
                    <p className="font-black text-slate-900 text-base md:text-lg tracking-tighter">
                      {Math.round(item.price * item.qty).toLocaleString()} <span className="text-[10px] text-primary">Ar</span>
                    </p>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="group/btn flex items-center gap-1.5 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full text-red-500 transition-all active:scale-95"
                      title="Retirer du panier"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-[9px] font-black uppercase tracking-tighter hidden md:inline">Retirer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé du Paiement */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 h-fit sticky top-28">
              
              {/* Header du résumé */}
              <div className="flex flex-col gap-1 mb-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total</h2>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">{cartItems.length} articles</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    {Math.round(totalPrice).toLocaleString()}
                  </span>
                  <span className="text-lg font-extrabold text-primary">Ar</span>
                </div>
              </div>

              {/* BOUTON ÉPURÉ */}
              <button 
                onClick={handleConfirmOrder}
                disabled={loading}
                className={`w-full relative py-5 rounded-[1.2rem] transition-all duration-300 active:scale-[0.98] overflow-hidden ${
                  loading 
                    ? 'bg-slate-50 text-slate-300 cursor-wait' 
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      {/* Loader discret adapté au fond primary */}
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                        Validation...
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                      Valider la commande
                    </span>
                  )}
                </div>
              </button>

              {/* Footer du résumé */}
              <div className="mt-8 space-y-4">
                <div className="h-[1px] w-full bg-slate-50" />
                
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {user ? user.email.split('@')[0] : 'Mode invité'}
                    </span>
                  </div>
                  <div className="w-[1px] h-3 bg-slate-100" />
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                    Sécurisé
                  </span>
                </div>
                
                <p className="text-[8px] text-slate-300 font-medium uppercase text-center leading-relaxed tracking-tight px-4 italic">
                  Expédition sous 24h • Confirmation par email
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}