export default function Organigrama() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#142e4f]">Organigrama del Área</h1>
        <p className="text-sm text-gray-500 mt-1">Estructura de Atención al Cliente · Frávega</p>
      </div>

      {/* Organigrama Visual */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-x-auto">
        {/* Level 1: Gerencia */}
        <div className="flex justify-center mb-8">
          <OrgBox
            title="Gerencia de Atención al Cliente"
            subtitle="Dirección estratégica"
            color="bg-[#142e4f] text-white"
            icon="fa-crown"
          />
        </div>

        {/* Connector */}
        <div className="flex justify-center mb-4">
          <div className="w-px h-8 bg-gray-300"></div>
        </div>

        {/* Level 2: Coordinación */}
        <div className="flex justify-center mb-8">
          <OrgBox
            title="Coordinación General de Atención al Cliente"
            subtitle="Gestión operativa integral"
            color="bg-[#2064d8] text-white"
            icon="fa-users-cog"
          />
        </div>

        {/* Connector */}
        <div className="flex justify-center mb-4">
          <div className="w-px h-8 bg-gray-300"></div>
        </div>

        {/* Level 3: Divisiones */}
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-5xl h-px bg-gray-300 relative">
            <div className="absolute left-[8.3%] top-0 w-px h-6 bg-gray-300"></div>
            <div className="absolute left-[25%] top-0 w-px h-6 bg-gray-300"></div>
            <div className="absolute left-[41.6%] top-0 w-px h-6 bg-gray-300"></div>
            <div className="absolute left-[58.3%] top-0 w-px h-6 bg-gray-300"></div>
            <div className="absolute left-[75%] top-0 w-px h-6 bg-gray-300"></div>
            <div className="absolute left-[91.6%] top-0 w-px h-6 bg-gray-300"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto mb-8">
          <OrgBoxSmall
            title="Back Office de Atención"
            icon="fa-folder-open"
            items={['Gestión Administrativa', 'Seguimiento de Casos', 'Validaciones', 'Derivaciones internas']}
            highlight={false}
          />
          <OrgBoxSmall
            title="Contact Center"
            icon="fa-phone-alt"
            items={['Agentes Telefónicos', 'Agentes de Chat', 'Agentes de WhatsApp']}
            highlight={false}
          />
          <OrgBoxSmall
            title="Atención Digital"
            icon="fa-laptop"
            items={['Redes Sociales', 'Atención por E-mail', '★ Web/Chat']}
            highlight={true}
          />
          <OrgBoxSmall
            title="Postventa y Reclamos"
            icon="fa-exclamation-triangle"
            items={['Equipos de Reclamos', 'Cambios y Devoluciones', 'Garantías', 'Escalaciones Complejas']}
            highlight={false}
          />
          <OrgBoxSmall
            title="Calidad y Capacitación"
            icon="fa-clipboard-check"
            items={['Monitoreo de Atención', 'Control de Calidad', 'Capacitación de Agentes']}
            highlight={false}
          />
          <OrgBoxSmall
            title="Experiencia del Cliente"
            icon="fa-chart-line"
            items={['Indicadores de Atención', 'Satisfacción (CSAT)', 'Reportes', 'Mejora Continua']}
            highlight={false}
          />
        </div>

        {/* Detail: Atención Digital expanded */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center">
              <i className="fas fa-star text-sm"></i>
            </span>
            <div>
              <h3 className="font-bold text-[#142e4f]">División: Atención Web/Chat</h3>
              <p className="text-xs text-gray-500">Nuestra división · Canal síncrono digital en fravega.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="text-xs font-semibold text-green-700 uppercase mb-2">Dependencia Jerárquica</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>→ Gerencia de Atención al Cliente</p>
                <p>→ Coordinación General</p>
                <p>→ Supervisor de Atención Digital</p>
                <p className="font-bold text-[#2064d8]">→ Atención Web/Chat ★</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="text-xs font-semibold text-green-700 uppercase mb-2">Canales Hermanos</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>🔗 Redes Sociales</p>
                <p>🔗 Atención por E-mail</p>
                <p className="text-gray-400 italic text-[10px]">Transferencias bidireccionales</p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg p-4 border border-green-200">
            <h4 className="text-xs font-semibold text-green-700 uppercase mb-3">Objetivos Estratégicos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>Reducción de fricción de compra (Preventa)</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>Resolución inmediata de consultas logísticas</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>Contención ágil de postventa inicial</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>3-4 conversaciones simultáneas por operador</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactions Table */}
        <div className="mt-8 max-w-6xl mx-auto">
          <h3 className="font-bold text-[#142e4f] text-sm mb-4">Interacción con otras Ramas del Organigrama</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#142e4f] text-white">
                  <th className="p-3 text-left font-medium">Rama</th>
                  <th className="p-3 text-left font-medium">Sector de Enlace</th>
                  <th className="p-3 text-left font-medium">Mecanismo de Interacción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="p-3 font-medium text-[#142e4f]">Back Office</td>
                  <td className="p-3 text-gray-600">Validaciones, Derivaciones</td>
                  <td className="p-3 text-gray-600">Órdenes de destrabe logístico, notas de crédito</td>
                </tr>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td className="p-3 font-medium text-[#142e4f]">Contact Center</td>
                  <td className="p-3 text-gray-600">Agentes de Chat</td>
                  <td className="p-3 text-gray-600">Balanceo de carga en eventos masivos</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-3 font-medium text-[#142e4f]">Postventa y Reclamos</td>
                  <td className="p-3 text-gray-600">Cambios, Garantías</td>
                  <td className="p-3 text-gray-600">Derivación de tickets, logística inversa</td>
                </tr>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td className="p-3 font-medium text-[#142e4f]">Calidad y Capacitación</td>
                  <td className="p-3 text-gray-600">Monitoreo, QA</td>
                  <td className="p-3 text-gray-600">Transcripciones para auditoría, coaching</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-3 font-medium text-[#142e4f]">Experiencia del Cliente</td>
                  <td className="p-3 text-gray-600">CSAT, Métricas</td>
                  <td className="p-3 text-gray-600">Encuestas post-chat, análisis de motivos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgBox({ title, subtitle, color, icon }: { title: string; subtitle: string; color: string; icon: string }) {
  return (
    <div className={`${color} rounded-xl px-6 py-3 text-center shadow-lg`}>
      <i className={`fas ${icon} mb-1 text-lg`}></i>
      <p className="text-sm font-bold">{title}</p>
      <p className="text-[10px] opacity-80">{subtitle}</p>
    </div>
  );
}

function OrgBoxSmall({ title, icon, items, highlight }: { title: string; icon: string; items: string[]; highlight: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center border-2 transition-all ${
      highlight
        ? 'bg-green-50 border-green-400 shadow-md ring-2 ring-green-200'
        : 'bg-white border-gray-200 hover:border-[#2064d8] hover:shadow-sm'
    }`}>
      <div className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-2 ${
        highlight ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
      }`}>
        <i className={`fas ${icon} text-xs`}></i>
      </div>
      <p className={`text-[11px] font-bold mb-1.5 ${highlight ? 'text-green-700' : 'text-[#142e4f]'}`}>{title}</p>
      <div className="space-y-0.5">
        {items.map((item, i) => (
          <p key={i} className={`text-[9px] ${
            item.includes('★') ? 'font-bold text-green-600' : 'text-gray-400'
          }`}>{item}</p>
        ))}
      </div>
    </div>
  );
}
