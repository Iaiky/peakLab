// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-0 md:ml-64 transition-all duration-300">
        {/* On ajoute p-6 ou p-8 ici pour décoller le contenu du bord de la sidebar */}
        <div className="p-6 md:p-10"> 
          <Outlet />
        </div>
      </main>
    </div>
  );
}