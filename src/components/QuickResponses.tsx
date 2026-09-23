import { useState } from 'react';
import { respuestasRapidas } from '../data/mockData';

export default function QuickResponses() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [search, setSearch] = useState('');

  const categories = ['Todas', ...new Set(respuestasRapidas.map(r => r.categoria))];

  const filtered = respuestasRapidas.filter(r => {
    const matchSearch = r.titulo.toLowerCase().includes(search.toLowerCase()) ||
      r.contenido.toLowerCase().includes(search.toLowerCase()) ||
      r.atajo.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'Todas' || r.categoria === selectedCategory;
    return matchSearch && matchCategory;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'General': return 'bg-gray-100 text-gray-600';
      case 'Logística': return 'bg-blue-100 text-blue-600';
      case 'Postventa': return 'bg-orange-100 text-orange-600';
      case 'Preventa': return 'bg-green-100 text-green-600';
      case 'Sucursal': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#142e4f]">Respuestas Rápidas</h1>
        <p className="text-sm text-gray-500 mt-1">Plantillas predefinidas para agilizar la atención</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Buscar por título, atajo o contenido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2064d8] focus:ring-1 focus:ring-[#2064d8]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#2064d8] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2064d8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(rr => (
          <div key={rr.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-[#142e4f] text-white px-2 py-0.5 rounded">{rr.atajo}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(rr.categoria)}`}>
                  {rr.categoria}
                </span>
              </div>
              <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-[#2064d8] transition-colors">
                <i className="fas fa-copy text-xs"></i>
              </button>
            </div>
            <h3 className="text-sm font-semibold text-[#142e4f] mb-2">{rr.titulo}</h3>
            <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line line-clamp-4">{rr.contenido}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <i className="fas fa-bolt text-3xl mb-2"></i>
          <p className="text-sm">No se encontraron respuestas rápidas</p>
        </div>
      )}
    </div>
  );
}
