// src/pages/Cart.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto relative"> {/* Ajout de relative ici */}
        
        {/* BOUTON RETOUR DISCRET */}
        <Link 
          to="/" 
          className="absolute -top-10 left-0 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-bold uppercase tracking-widest">Continuer mes achats</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-10">
          Mon Panier <span className="text-primary"></span>
        </h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-sm border border-slate-100">
            <div className="text-5xl mb-6">🛒</div>
            <p className="text-slate-500 font-medium mb-8 text-lg">Votre panier est encore vide...</p>
            <Link to="/" className="bg-primary text-white px-10 py-4 rounded-full font-bold inline-block hover:scale-105 transition-all shadow-lg shadow-primary/20">
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des produits */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 md:gap-6">
                  {/* Image Produit */}
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">{item.name}</h3>
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-tighter opacity-70">{item.category}</p>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-slate-400 hover:text-primary hover:bg-white hover:shadow-sm transition"
                      >
                        -
                      </button>
                      <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-slate-400 hover:text-primary hover:bg-white hover:shadow-sm transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-slate-900 text-base">
                      {Math.round(item.price * item.qty).toLocaleString()} Ar
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] text-red-400 mt-2 font-bold hover:text-red-600 transition uppercase tracking-tighter"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé de la réservation */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 h-fit sticky top-28">
              <div className="flex flex-col gap-1 mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Montant Total Net
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    {Math.round(totalPrice).toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-primary">Ar</span>
                </div>
              </div>

              <button className="w-full group relative overflow-hidden bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-[0.1em] shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-[0.98]">
  <div className="flex items-center justify-center gap-2">
    <span className="text-sm">Passer à la caisse</span>
    
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </div>
</button>
              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.1em] opacity-60">
                  Paiement sécurisé • Expédition rapide
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}