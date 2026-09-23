import { agentes } from '../data/mockData';

export default function Quality() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#142e4f]">Calidad y Capacitación</h1>
        <p className="text-sm text-gray-500 mt-1">Monitoreo de atención, control de calidad y coaching</p>
      </div>

      {/* Quality Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xl font-bold text-green-600">92</span>
          </div>
          <p className="text-xs text-gray-500">Score Calidad Promedio</p>
          <p className="text-[10px] text-green-600 mt-1">+2 vs mes anterior</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">24</span>
          </div>
          <p className="text-xs text-gray-500">Chats Monitoreados</p>
          <p className="text-[10px] text-gray-400 mt-1">Esta semana</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-xl font-bold text-purple-600">3</span>
          </div>
          <p className="text-xs text-gray-500">Capacitaciones</p>
          <p className="text-[10px] text-gray-400 mt-1">Programadas este mes</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-xl font-bold text-orange-600">5</span>
          </div>
          <p className="text-xs text-gray-500">Coaching 1:1</p>
          <p className="text-[10px] text-gray-400 mt-1">Pendientes</p>
        </div>
      </div>

      {/* Agent Quality Matrix */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#142e4f] text-sm">Matriz de Evaluación por Agente</h3>
          <p className="text-xs text-gray-400 mt-0.5">Último período de evaluación</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 text-xs font-medium text-gray-500">Agente</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500">Tono/Empatía</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500">Precisión Técnica</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500">Uso Resp. Rápidas</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500">Tiempos</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500">Score Total</th>
              </tr>
            </thead>
            <tbody>
              {agentes.filter(a => a.rol === 'agente').map(agente => (
                <tr key={agente.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#2064d8] flex items-center justify-center text-white text-[10px] font-bold">
                        {agente.avatar}
                      </div>
                      <span className="text-xs font-medium text-[#142e4f]">{agente.nombre}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <ScoreBadge score={Math.floor(Math.random() * 3) + 8} />
                  </td>
                  <td className="p-3 text-center">
                    <ScoreBadge score={Math.floor(Math.random() * 3) + 7} />
                  </td>
                  <td className="p-3 text-center">
                    <ScoreBadge score={Math.floor(Math.random() * 3) + 7} />
                  </td>
                  <td className="p-3 text-center">
                    <ScoreBadge score={Math.floor(Math.random() * 3) + 8} />
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-sm font-bold text-[#142e4f]">{agente.csatPromedio}/5</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Trainings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#142e4f] text-sm">Capacitaciones Programadas</h3>
          </div>
          <div className="p-4 space-y-3">
            <TrainingItem
              title="Nuevo procedimiento de garantías Samsung"
              date="22 Ene 2025 · 10:00"
              type="Técnica"
              attendees={7}
            />
            <TrainingItem
              title="Manejo de clientes conflictivos"
              date="24 Ene 2025 · 14:00"
              type="Habilidades blandas"
              attendees={5}
            />
            <TrainingItem
              title="Actualización promociones Febrero"
              date="28 Ene 2025 · 09:00"
              type="Producto"
              attendees={7}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#142e4f] text-sm">Coaching 1:1 Pendientes</h3>
          </div>
          <div className="p-4 space-y-3">
            <CoachingItem
              agent="Camila Sánchez"
              topic="Mejora en tiempos de respuesta"
              priority="Media"
              date="20 Ene"
            />
            <CoachingItem
              agent="Diego Álvarez"
              topic="Uso correcto de respuestas rápidas"
              priority="Alta"
              date="21 Ene"
            />
            <CoachingItem
              agent="Laura Gómez"
              topic="Tono empático en reclamos"
              priority="Media"
              date="23 Ene"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 9 ? 'bg-green-100 text-green-700' : score >= 7 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{score}/10</span>;
}

function TrainingItem({ title, date, type, attendees }: { title: string; date: string; type: string; attendees: number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-blue-50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
        <i className="fas fa-graduation-cap text-purple-600 text-sm"></i>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#142e4f] truncate">{title}</p>
        <p className="text-[10px] text-gray-400">{date}</p>
      </div>
      <div className="text-right">
        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{type}</span>
        <p className="text-[10px] text-gray-400 mt-1">{attendees} agentes</p>
      </div>
    </div>
  );
}

function CoachingItem({ agent, topic, priority, date }: { agent: string; topic: string; priority: string; date: string }) {
  const priorityColor = priority === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600';
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-blue-50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
        <i className="fas fa-user-coach text-orange-600 text-sm"></i>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#142e4f]">{agent}</p>
        <p className="text-[10px] text-gray-400 truncate">{topic}</p>
      </div>
      <div className="text-right">
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${priorityColor}`}>{priority}</span>
        <p className="text-[10px] text-gray-400 mt-1">{date}</p>
      </div>
    </div>
  );
}
