import { kpis } from '../data/mockData';

export default function Metrics() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#142e4f]">Métricas y Experiencia del Cliente</h1>
        <p className="text-sm text-gray-500 mt-1">Indicadores de atención, satisfacción y mejora continua</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="FCR" value={`${kpis.fcr}%`} subtitle="First Contact Resolution" trend="+3%" trendUp color="green" />
        <MetricCard title="CSAT" value={`${kpis.satisfaccion}/5`} subtitle="Satisfacción del Cliente" trend="+0.2" trendUp color="yellow" />
        <MetricCard title="TMR" value={kpis.tmr} subtitle="Tiempo Medio de Respuesta" trend="-12s" trendUp color="blue" />
        <MetricCard title="AHT" value={kpis.aht} subtitle="Average Handle Time" trend="-45s" trendUp color="purple" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* CSAT Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#142e4f] text-sm mb-4">Distribución CSAT (últimos 30 días)</h3>
          <div className="space-y-3">
            {[
              { stars: 5, pct: 62, color: 'bg-green-500' },
              { stars: 4, pct: 24, color: 'bg-blue-500' },
              { stars: 3, pct: 9, color: 'bg-yellow-500' },
              { stars: 2, pct: 3, color: 'bg-orange-500' },
              { stars: 1, pct: 2, color: 'bg-red-500' },
            ].map(item => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8">{item.stars} ★</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full flex items-center justify-end pr-2`} style={{ width: `${item.pct}%` }}>
                    <span className="text-[10px] text-white font-medium">{item.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chats per day */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#142e4f] text-sm mb-4">Volumen de Chats (últimos 7 días)</h3>
          <div className="flex items-end gap-2 h-40">
            {[
              { day: 'Lun', value: 42 },
              { day: 'Mar', value: 55 },
              { day: 'Mié', value: 48 },
              { day: 'Jue', value: 61 },
              { day: 'Vie', value: 53 },
              { day: 'Sáb', value: 38 },
              { day: 'Dom', value: 22 },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500">{item.value}</span>
                <div
                  className="w-full bg-[#2064d8] rounded-t-md transition-all hover:bg-[#1855b8]"
                  style={{ height: `${(item.value / 65) * 100}%` }}
                ></div>
                <span className="text-[10px] text-gray-400">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NPS and additional metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NPS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#142e4f] text-sm mb-4">Net Promoter Score</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2064d8] mb-2">{kpis.nps}</div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span> Promotores: 68%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Pasivos: 18%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> Detractores: 14%
              </span>
            </div>
          </div>
        </div>

        {/* Motivos de contacto */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#142e4f] text-sm mb-4">Motivos de Contacto</h3>
          <div className="space-y-2">
            {[
              { motivo: 'Seguimiento de pedido', pct: 35 },
              { motivo: 'Consulta de stock', pct: 22 },
              { motivo: 'Promociones / Cuotas', pct: 18 },
              { motivo: 'Reclamo / Postventa', pct: 15 },
              { motivo: 'Retiro en sucursal', pct: 10 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-600">{item.motivo}</span>
                    <span className="text-gray-400">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2064d8] rounded-full" style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#142e4f] text-sm mb-4">Cumplimiento SLA</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Primera respuesta &lt; 2 min</span>
                <span className="font-medium text-green-600">92%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Resolución &lt; 15 min</span>
                <span className="font-medium text-blue-600">78%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Encuesta completada</span>
                <span className="font-medium text-purple-600">85%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Chats sin abandono</span>
                <span className="font-medium text-orange-600">94%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, trend, trendUp, color }: { title: string; value: string; subtitle: string; trend: string; trendUp: boolean; color: string }) {
  const colorClasses: Record<string, string> = {
    green: 'border-green-200 bg-green-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
  };

  return (
    <div className={`rounded-xl p-4 border ${colorClasses[color] || 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase">{title}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend}
        </span>
      </div>
      <p className="text-2xl font-bold text-[#142e4f]">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
