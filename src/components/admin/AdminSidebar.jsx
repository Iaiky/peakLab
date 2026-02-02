// src/components/admin/AdminSidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Tableau de bord', path: '/admin', icon: '📊' },
    { name: 'Produits', path: '/admin/products', icon: '📦' },
    { name: 'Catégories', path: '/admin/categories', icon: '📁' },
    { name: 'Clients', path: '/admin/customers', icon: '👥' },
    { name: 'Stocks', path: '/admin/inventory', icon: '🔄' },
    { name: 'Commandes', path: '/admin/orders', icon: '🛒' },
    { name: 'Ventes', path: '/admin/sales', icon: '📜' },
  ];

  return (
    <>
      {/* 1. BOUTON BURGER (Visible seulement quand fermé) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-[200] p-3 bg-primary text-white rounded-2xl md:hidden shadow-lg border border-white/10"
        >
          ☰
        </button>
      )}

      {/* 2. OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[180] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. LA SIDEBAR */}
      <div className={`
        fixed left-0 top-0 h-full bg-primary text-white flex flex-col z-[190] transition-transform duration-300 w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:pointer-events-auto
        ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
      `}>
        
        {/* HEADER DE LA SIDEBAR : Contient le Logo + le bouton X alignés */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary font-bold">P</div>
            <span className="text-xl font-black tracking-tighter">PEAK<span className="opacity-70">ADMIN</span></span>
          </div>

          {/* Bouton X (Visible seulement sur mobile quand le menu est ouvert) */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                  ? 'bg-white/20 text-white shadow-inner' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}