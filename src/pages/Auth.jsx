// src/pages/Auth.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_peak_lab.jpg'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate(); // Le crochet pour changer de page
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth()

  const handleAuth = (e) => {
    e.preventDefault();
    
    // On simule les données reçues
    login({ name: "Jean Dupont", role: "Client Premium", initiales: "JD" });
    
    // Redirection fluide
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      
      {/* Bouton retour discret en haut à gauche */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">Boutique</span>
      </Link>

      <div className="w-full max-w-md">
        {/* LOGO ET TITRE HORS DE LA CARTE */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2">
            <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
              PEAKLAB <span className="text-blue-600">PERFORMANCE</span>
            </span>
          </div>
          <div className="h-1 w-12 bg-slate-200 rounded-full"></div>
        </div>

        {/* CARTE DE FORMULAIRE */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              {isLogin ? "Heureux de vous revoir" : "Rejoignez l'aventure"}
            </h1>
            <p className="text-[--color-secondary] text-sm mt-1">Gérez vos stocks avec précision.</p>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase px-1">Nom complet</label>
                <input 
                  type="text" 
                  placeholder="Jean Dupont"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase px-1">Email</label>
              <input 
                type="email" 
                placeholder="votre@email.com"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase px-1 flex justify-between">
                Mot de passe
                {isLogin && <span className="text-blue-600 lowercase font-medium cursor-pointer">Oublié ?</span>}
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-blue-900/20 mt-4">
              {isLogin ? "Se connecter" : "S'inscrire"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Nouveau ici ? Créer un compte" : "Déjà membre ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}