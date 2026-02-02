// src/components/Sidebar.jsx
export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      <h1 className="text-2xl font-bold text-brand mb-8">StockMaster</h1>
      <nav className="space-y-2">
        <a href="#" className="block p-3 bg-blue-50 text-brand rounded-lg font-medium">Tableau de bord</a>
        <a href="#" className="block p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">Produits</a>
        <a href="#" className="block p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">Commandes</a>
        <a href="#" className="block p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">Paramètres</a>
      </nav>
    </div>
  );
}