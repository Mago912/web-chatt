export default function Escalations() {
  const escalations = [
    {
      id: 1,
      cliente: 'Roberto Martínez',
      pedido: '#10445',
      motivo: 'Producto dañado en entrega',
      estado: 'en_proceso',
      prioridad: 'alta',
      derivadoA: 'Postventa y Reclamos',
      fecha: '15 Ene 2025',
      agente: 'Martín Pereyra',
      descripcion: 'Lavarropas Drean Next recibido con caja dañada y golpe en tambor. Fotos adjuntadas por el cliente.'
    },
    {
      id: 2,
      cliente: 'María González',
      pedido: '#10452',
      motivo: 'Demora superior a 72hs',
      estado: 'en_proceso',
      prioridad: 'media',
      derivadoA: 'Back Office Logística',
      fecha: '15 Ene 2025',
      agente: 'Sofía Ríos',
      descripcion: 'Smart TV Samsung 50" con demora en centro de distribución Monte Grande. Fecha estimada vencida.'
    },
    {
      id: 3,
      cliente: 'Pedro Sánchez',
      pedido: '#10312',
      motivo: 'Reclamo Defensa del Consumidor',
      estado: 'pendiente',
      prioridad: 'critica',
      derivadoA: 'Escalaciones Complejas',
      fecha: '14 Ene 2025',
      agente: 'Valentina Torres',
      descripcion: 'Cliente presenta reclamo formal COPREC por producto no entregado en 30 días. Requiere mediación legal.'
    },
    {
      id: 4,
      cliente: 'Lucía Fernández',
      pedido: '#10488',
      motivo: 'Error en facturación CUIT',
      estado: 'resuelto',
      prioridad: 'baja',
      derivadoA: 'Back Office Facturación',
      fecha: '13 Ene 2025',
      agente: 'Diego Álvarez',
      descripcion: 'Factura emitida con CUIT incorrecto. Se generó nota de crédito y refacturación.'
    }
  ];

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critica': return 'bg-red-100 text-red-700 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'en_proceso': return 'bg-blue-100 text-blue-700';
      case 'pendiente': return 'bg-orange-100 text-orange-700';
      case 'resuelto': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'en_proceso': return 'En proceso';
      case 'pendiente': return 'Pendiente';
      case 'resuelto': return 'Resuelto';
      default: return s;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#142e4f]">Escalaciones</h1>
        <p className="text-sm text-gray-500 mt-1">Casos derivados a sectores de 2do nivel y escalaciones complejas</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <i className="fas fa-exclamation-circle text-red-500"></i>
            <span className="text-xs text-gray-500">Críticas</span>
          </div>
          <p className="text-2xl font-bold text-red-600">1</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <i className="fas fa-arrow-up text-orange-500"></i>
            <span className="text-xs text-gray-500">En proceso</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">2</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-yellow-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <i className="fas fa-clock text-yellow-500"></i>
            <span className="text-xs text-gray-500">Pendientes</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">1</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <i className="fas fa-check-circle text-green-500"></i>
            <span className="text-xs text-gray-500">Resueltos (semana)</span>
          </div>
          <p className="text-2xl font-bold text-green-600">5</p>
        </div>
      </div>

      {/* Escalations List */}
      <div className="space-y-4">
        {escalations.map(esc => (
          <div key={esc.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Left: Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getPriorityBadge(esc.prioridad)}`}>
                    {esc.prioridad.toUpperCase()}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusBadge(esc.estado)}`}>
                    {getStatusLabel(esc.estado)}
                  </span>
                  <span className="text-[10px] text-gray-400">{esc.fecha}</span>
                </div>
                <h3 className="text-sm font-bold text-[#142e4f] mb-1">
                  {esc.cliente} · Pedido {esc.pedido}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{esc.motivo}</p>
                <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2">{esc.descripcion}</p>
              </div>

              {/* Right: Derivation info */}
              <div className="md:w-56 flex-shrink-0">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-[10px] text-blue-500 uppercase font-medium mb-1">Derivado a</p>
                  <p className="text-xs font-semibold text-[#142e4f] mb-2">{esc.derivadoA}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <i className="fas fa-user"></i>
                    <span>Agente: {esc.agente}</span>
                  </div>
                </div>
                {esc.estado !== 'resuelto' && (
                  <button className="mt-2 w-full py-2 text-xs font-medium text-[#2064d8] border border-[#2064d8] rounded-lg hover:bg-blue-50 transition-colors">
                    <i className="fas fa-eye mr-1"></i>Ver seguimiento
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
