import { useState } from 'react';
import { baseConocimiento } from '../data/mockData';

export default function KnowledgeBase() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const categories = ['Todas', ...new Set(baseConocimiento.map(a => a.categoria))];

  const filtered = baseConocimiento.filter(a => {
    const matchSearch = a.titulo.toLowerCase().includes(search.toLowerCase()) ||
      a.procedimiento.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'Todas' || a.categoria === selectedCategory;
    return matchSearch && matchCategory;
  });

  const article = baseConocimiento.find(a => a.id === selectedArticle);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#142e4f]">Base de Conocimiento</h1>
        <p className="text-sm text-gray-500 mt-1">Artículos de procedimientos y guías internas</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Buscar artículos..."
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Articles List */}
        <div className="lg:col-span-1 space-y-2">
          {filtered.map(art => (
            <button
              key={art.id}
              onClick={() => setSelectedArticle(art.id)}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                selectedArticle === art.id
                  ? 'bg-[#2064d8] text-white shadow-lg'
                  : 'bg-white border border-gray-100 hover:border-[#2064d8] hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2">
                <i className={`fas fa-file-alt mt-0.5 ${selectedArticle === art.id ? 'text-blue-200' : 'text-[#2064d8]'}`}></i>
                <div>
                  <p className={`text-sm font-medium ${selectedArticle === art.id ? 'text-white' : 'text-[#142e4f]'}`}>
                    {art.titulo}
                  </p>
                  <span className={`text-[10px] mt-1 inline-block px-2 py-0.5 rounded-full ${
                    selectedArticle === art.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {art.categoria}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-search text-2xl mb-2"></i>
              <p className="text-sm">No se encontraron artículos</p>
            </div>
          )}
        </div>

        {/* Article Detail */}
        <div className="lg:col-span-2">
          {article ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                  {article.categoria}
                </span>
                <span className="text-[10px] text-gray-400">Artículo #{article.id}</span>
              </div>
              <h2 className="text-lg font-bold text-[#142e4f] mb-4">{article.titulo}</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Procedimiento</h3>
                <div className="space-y-2">
                  {article.procedimiento.split('\n').map((line, i) => (
                    <p key={i} className="text-sm text-gray-700">{line}</p>
                  ))}
                </div>
              </div>
              {article.enlaceDocumento && (
                <a href={article.enlaceDocumento} className="mt-4 inline-flex items-center gap-2 text-sm text-[#2064d8] hover:underline">
                  <i className="fas fa-external-link-alt"></i>
                  Ver documento completo
                </a>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <i className="fas fa-book-open text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-400">Seleccioná un artículo para ver su contenido</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
