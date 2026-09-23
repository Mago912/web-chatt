import { ViewType } from '../App';
import { kpis, agentes, conversaciones } from '../data/mockData';

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const chatsActivos = conversaciones.filter(c => c.estado === 'activo').length;
  const chatsEspera = conversaciones.filter(c => c.estado === 'esperando').length;
  const agentesDisponibles = agentes.filter(a => a.estado === 'disponible').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#142e4f]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen en tiempo real · Atención Web/Chat Frávega</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="En Espera"
          value={kpis.enEspera}
          icon="fa-clock"
          color="orange"
          subtitle="Chats en cola"
        />
        <KPICard
          title="En Atención"
          value={kpis.enAtencion}
          icon="fa-comments"
          color="blue"
          subtitle="Chats activos"
        />
        <KPICard
          title="1ra Respuesta"
          value={kpis.primeraRespuesta}
          icon="fa-stopwatch"
          color="green"
          subtitle="Tiempo medio"
        />
        <KPICard
          title="Satisfacción"
          value={`${kpis.satisfaccion}/5`}
          icon="fa-star"
          color="yellow"
          subtitle="CSAT promedio"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">FCR (Resolución 1er contacto)</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">+3%</span>
          </div>
          <p className="text-2xl font-bold text-[#142e4f]">{kpis.fcr}%</p>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${kpis.fcr}%` }}></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Chats Hoy</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">En curso</span>
          </div>
          <p className="text-2xl font-bold text-[#142e4f]">{kpis.chatsHoy}</p>
          <p className="text-xs text-gray-400 mt-1">{kpis.resueltosHoy} resueltos · {kpis.chatsHoy - kpis.resueltosHoy} pendientes</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">NPS Score</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Bueno</span>
          </div>
          <p className="text-2xl font-bold text-[#142e4f]">{kpis.nps}</p>
          <p className="text-xs text-gray-400 mt-1">Net Promoter Score</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#142e4f] text-sm">Estado de Agentes</h3>
            <p className="text-xs text-gray-400 mt-0.5">{agentesDisponibles} disponibles de {agentes.length}</p>
          </div>
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
            {agentes.map(agente => (
              <div key={agente.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-[#2064d8] flex items-center justify-center text-white text-xs font-bold relative">
                  {agente.avatar}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    agente.estado === 'disponible' ? 'bg-green-400' :
                    agente.estado === 'ocupado' ? 'bg-orange-400' :
                    agente.estado === 'pausa' ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#142e4f] truncate">{agente.nombre}</p>
                  <p className="text-[10px] text-gray-400">
                    {agente.estado === 'disponible' ? 'Disponible' :
                     agente.estado === 'ocupado' ? `Ocupado (${agente.chatsActivos} chats)` :
                     agente.estado === 'pausa' ? 'En pausa' : 'Desconectado'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#142e4f]">⭐ {agente.csatPromedio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#142e4f] text-sm">Actividad Reciente</h3>
          </div>
          <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
            <ActivityItem
              icon="fa-circle-check"
              iconColor="text-green-500"
              text="Caso #10298 resuelto por Sofía Ríos"
              time="Hace 5 min"
            />
            <ActivityItem
              icon="fa-arrow-up-right-from-square"
              iconColor="text-orange-500"
              text="Pedido #10445 escalado a Postventa"
              time="Hace 12 min"
            />
            <ActivityItem
              icon="fa-user-plus"
              iconColor="text-blue-500"
              text="Nuevo chat asignado a Martín Pereyra"
              time="Hace 15 min"
            />
            <ActivityItem
              icon="fa-star"
              iconColor="text-yellow-500"
              text="CSAT 5/5 recibido en chat de Ana López"
              time="Hace 20 min"
            />
            <ActivityItem
              icon="fa-robot"
              iconColor="text-purple-500"
              text="Bot Nexo resolvió 3 consultas automáticamente"
              time="Hace 25 min"
            />
            <ActivityItem
              icon="fa-circle-exclamation"
              iconColor="text-red-500"
              text="Alerta: Tiempo de espera supera SLA en 2 chats"
              time="Hace 30 min"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#142e4f] text-sm">Acciones Rápidas</h3>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={() => onNavigate('inbox')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#2064d8] hover:bg-blue-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <i className="fas fa-inbox text-[#2064d8]"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-[#142e4f]">Ir a Bandeja</p>
                <p className="text-xs text-gray-400">{chatsEspera} en espera · {chatsActivos} activos</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate('knowledge')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#2064d8] hover:bg-blue-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <i className="fas fa-book text-green-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-[#142e4f]">Base de Conocimiento</p>
                <p className="text-xs text-gray-400">8 artículos disponibles</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate('metrics')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#2064d8] hover:bg-blue-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <i className="fas fa-chart-bar text-purple-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-[#142e4f]">Ver Métricas</p>
                <p className="text-xs text-gray-400">FCR, CSAT, NPS y más</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate('organigrama')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#2064d8] hover:bg-blue-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <i className="fas fa-sitemap text-orange-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-[#142e4f]">Organigrama</p>
                <p className="text-xs text-gray-400">Estructura del área</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color, subtitle }: { title: string; value: string | number; icon: string; color: string; subtitle: string }) {
  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    orange: { bg: 'bg-orange-50', icon: 'text-orange-500', border: 'border-orange-200' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', icon: 'text-green-500', border: 'border-green-200' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-500', border: 'border-yellow-200' },
  };

  const c = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-xl p-4 border ${c.border} shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase">{title}</span>
        <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
          <i className={`fas ${icon} ${c.icon} text-sm`}></i>
        </div>
      </div>
      <p className="text-2xl font-bold text-[#142e4f]">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function ActivityItem({ icon, iconColor, text, time }: { icon: string; iconColor: string; text: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
      <div className={`w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
        <i className={`fas ${icon} ${iconColor} text-xs`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#142e4f]">{text}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}
