import { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems: { id: ViewType; icon: string; label: string; badge?: number }[] = [
  { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
  { id: 'inbox', icon: 'fa-inbox', label: 'Bandeja de Chats', badge: 4 },
  { id: 'escalations', icon: 'fa-arrow-up-right-from-square', label: 'Escalaciones', badge: 2 },
  { id: 'knowledge', icon: 'fa-book', label: 'Base de Conocimiento' },
  { id: 'quick-responses', icon: 'fa-bolt', label: 'Respuestas Rápidas' },
  { id: 'quality', icon: 'fa-clipboard-check', label: 'Calidad' },
  { id: 'metrics', icon: 'fa-chart-bar', label: 'Métricas' },
  { id: 'organigrama', icon: 'fa-sitemap', label: 'Organigrama' },
];

export default function Sidebar({ currentView, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-[#142e4f] text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2064d8] rounded-lg flex items-center justify-center font-bold text-sm">
              N
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Nexo WebChat</h1>
              <p className="text-[10px] text-blue-300">Frávega · Atención Digital</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Toggle sidebar"
        >
          <i className={`fas ${collapsed ? 'fa-angles-right' : 'fa-angles-left'} text-xs`}></i>
        </button>
      </div>

      {/* Agente actual */}
      {!collapsed && (
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2064d8] flex items-center justify-center text-xs font-bold relative">
              SR
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#142e4f]"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Sofía Ríos</p>
              <p className="text-[10px] text-blue-300">Agente · Disponible</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative ${
              currentView === item.id
                ? 'bg-[#2064d8] text-white'
                : 'text-blue-200 hover:bg-white/5 hover:text-white'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <i className={`fas ${item.icon} w-5 text-center text-sm`}></i>
            {!collapsed && <span className="truncate">{item.label}</span>}
            {item.badge && !collapsed && (
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
            {item.badge && collapsed && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-[10px] text-blue-300">
            <i className="fas fa-clock"></i>
            <span>Turno: 14:00 - 22:00</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-blue-300 mt-1">
            <i className="fas fa-headset"></i>
            <span>Chats activos: 3/4</span>
          </div>
        </div>
      )}
    </aside>
  );
}
