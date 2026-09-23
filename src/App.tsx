import { useState, useRef, useEffect } from 'react';
import './index.css';

// ==========================================
// DATA (Simula la base de datos MySQL)
// ==========================================
const conversacionesData = [
  {
    id: 1, cliente: 'María González', avatar: 'MG', color: 'blue', dni: '32.456.789', email: 'maria.gonzalez@gmail.com', tel: '+54 11 5542-8891', clienteDesde: 2021, pedidos: 7, casos: 2,
    pedido: { num: '#10452', producto: 'Smart TV Samsung 50" UHD 4K UN50AU7000', monto: 489999, entrega: 'Entrega a domicilio', fecha: '15-17 Ene 2025', estado: 'distributing', estadoLabel: 'En distribución' },
    motivo: 'Pedido · Demora en entrega', estado: 'activo', tiempo: '2m 15s', unread: false,
    ultimoMsg: '¿Me pueden decir dónde está mi pedido?',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com · Chrome/Windows', hora: '14:32' },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte hoy?', hora: '14:32' },
      { id: 3, tipo: 'cliente', emisor: 'María González', texto: 'Hola, compré un Smart TV y no me llegó. Ya pasó la fecha de entrega.', hora: '14:33' },
      { id: 4, tipo: 'bot', emisor: 'Bot Nexo', texto: 'Entiendo tu consulta sobre el estado de tu pedido. Voy a conectarte con un asesor que podrá ayudarte. Un momento por favor...', hora: '14:33' },
      { id: 5, tipo: 'sistema', texto: '⚡ Transferido a agente: Sofía Ríos', hora: '14:34' },
      { id: 6, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola María! Buenas tardes. Soy Sofía, estoy revisando tu pedido en este momento. ¿Podrías confirmarme tu número de pedido?', hora: '14:34' },
      { id: 7, tipo: 'cliente', emisor: 'María González', texto: 'Sí, es el #10452. Es el Smart TV Samsung de 50 pulgadas.', hora: '14:35' },
      { id: 8, tipo: 'agente', emisor: 'Sofía Ríos', texto: 'Perfecto, ya lo ubiqué. Veo que tu pedido está en estado "En distribución". Déjame consultar con el centro logístico de Monte Grande para darte una actualización precisa.', hora: '14:36' },
      { id: 9, tipo: 'cliente', emisor: 'María González', texto: '¿Me pueden decir dónde está mi pedido? Ya pasó la fecha estimada.', hora: '14:37' },
    ]
  },
  {
    id: 2, cliente: 'Carlos Rodríguez', avatar: 'CR', color: 'green', dni: '28.901.234', email: 'c.rodriguez@outlook.com', tel: '+54 11 4421-3356', clienteDesde: 2019, pedidos: 12, casos: 1,
    pedido: { num: '#10389', producto: 'Notebook Lenovo IdeaPad 3 15" Ryzen 5', monto: 749999, entrega: 'Retiro sucursal Caballito', fecha: '12 Ene 2025', estado: 'preparing', estadoLabel: 'En preparación' },
    motivo: 'Preventa · Consulta de stock', estado: 'esperando', tiempo: '4m 02s', unread: true,
    ultimoMsg: 'Buenas, quiero saber si tienen la notebook en Caballito.',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com · Página: /notebook-lenovo', hora: '14:28' },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte?', hora: '14:28' },
      { id: 3, tipo: 'cliente', emisor: 'Carlos Rodríguez', texto: 'Hola, quiero comprar la notebook Lenovo IdeaPad 3 pero necesito retirarla hoy de la sucursal de Caballito. ¿Tienen stock?', hora: '14:29' },
      { id: 4, tipo: 'cliente', emisor: 'Carlos Rodríguez', texto: 'Buenas, quiero saber si tienen la notebook en la sucursal de Caballito para retirar hoy.', hora: '14:30' },
    ]
  },
  {
    id: 3, cliente: 'Lucía Fernández', avatar: 'LF', color: 'purple', dni: '35.678.432', email: 'lucia.fernandez@yahoo.com', tel: '+54 11 6678-1122', clienteDesde: 2023, pedidos: 3, casos: 0,
    pedido: null,
    motivo: 'Preventa · Promociones bancarias', estado: 'esperando', tiempo: '1m 48s', unread: true,
    ultimoMsg: '¿Qué promos hay con tarjeta de crédito?',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:30' },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 ¿En qué puedo ayudarte?', hora: '14:30' },
      { id: 3, tipo: 'cliente', emisor: 'Lucía Fernández', texto: '¿Qué promos hay con tarjeta de crédito? Busco un aire acondicionado.', hora: '14:31' },
    ]
  },
  {
    id: 4, cliente: 'Roberto Martínez', avatar: 'RM', color: 'orange', dni: '24.112.567', email: 'r.martinez@gmail.com', tel: '+54 11 3345-7788', clienteDesde: 2020, pedidos: 9, casos: 3,
    pedido: { num: '#10445', producto: 'Lavarropas Automático Drean Next 8.15', monto: 599999, entrega: 'Entrega a domicilio', fecha: '14 Ene 2025', estado: 'delayed', estadoLabel: 'Demorado' },
    motivo: 'Postventa · Producto dañado', estado: 'activo', tiempo: '0m 45s', unread: false,
    ultimoMsg: 'La caja llegó toda abollada y el tambor tiene un golpe.',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:20' },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega.', hora: '14:20' },
      { id: 3, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Me llegó el lavarropas pero está dañado. La caja vino golpeada.', hora: '14:21' },
      { id: 4, tipo: 'sistema', texto: '⚡ Transferido a agente: Martín Pereyra', hora: '14:22' },
      { id: 5, tipo: 'agente', emisor: 'Martín Pereyra', texto: 'Roberto, lamento mucho lo sucedido. Voy a generar un reclamo inmediatamente. ¿Podrías confirmarme el número de pedido?', hora: '14:22' },
      { id: 6, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Es el #10445', hora: '14:23' },
      { id: 7, tipo: 'agente', emisor: 'Martín Pereyra', texto: 'Gracias Roberto. Necesito que me envíes fotos del daño para documentar el reclamo. ¿Podés adjuntarlas aquí en el chat?', hora: '14:24' },
      { id: 8, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Sí, la caja llegó toda abollada y el tambor tiene un golpe. Adjunto fotos.', hora: '14:25' },
    ]
  },
  {
    id: 5, cliente: 'Ana López', avatar: 'AL', color: 'pink', dni: '30.234.890', email: 'ana.lopez@hotmail.com', tel: '+54 11 5567-9900', clienteDesde: 2022, pedidos: 5, casos: 1,
    pedido: { num: '#10298', producto: 'Aire Acond. Samsung WindFree 3200F', monto: 899999, entrega: 'Entrega + Instalación', fecha: '10 Ene 2025', estado: 'delivered', estadoLabel: 'Entregado' },
    motivo: 'Postventa · Instalación pendiente', estado: 'resuelto', tiempo: '-', unread: false,
    ultimoMsg: '¡Muchas gracias! Quedo atenta a la confirmación.',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '13:45' },
      { id: 2, tipo: 'cliente', emisor: 'Ana López', texto: 'Hola, me entregaron el aire pero no vino el técnico a instalarlo.', hora: '13:46' },
      { id: 3, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola Ana! Revisando tu pedido #10298, veo que la instalación estaba programada. Voy a reagendarla con el equipo técnico.', hora: '13:47' },
      { id: 4, tipo: 'agente', emisor: 'Sofía Ríos', texto: 'Listo Ana, ya generé la orden de instalación. El técnico pasará entre el 16 y 17 de enero. Te llegará un SMS de confirmación.', hora: '13:50' },
      { id: 5, tipo: 'cliente', emisor: 'Ana López', texto: '¡Muchas gracias! Quedo atenta a la confirmación de la visita.', hora: '13:51' },
      { id: 6, tipo: 'sistema', texto: '✅ Caso resuelto · CSAT: 5/5 ⭐', hora: '13:52' },
    ]
  },
];

const respuestasRapidas = [
  { id: 1, atajo: '/saludo', titulo: 'Saludo inicial', contenido: '¡Hola! 👋 Soy [Nombre], asesor/a de Frávega. Estoy revisando tu consulta y te respondo en un momento. ¿Podrías confirmarme tu número de pedido?' },
  { id: 2, atajo: '/estado', titulo: 'Consulta estado pedido', contenido: 'Estoy consultando el estado de tu pedido en nuestro sistema logístico. Te pido un momento mientras verifico la información actualizada con el centro de distribución.' },
  { id: 3, atajo: '/demora', titulo: 'Demora en entrega', contenido: 'Comprendo tu frustración por la demora. Voy a escalar tu caso al área de logística para priorizar tu entrega. Te mantendré informado/a por este mismo chat.' },
  { id: 4, atajo: '/retiro', titulo: 'Retiro por tercero', contenido: 'Para que otra persona retire tu pedido en sucursal, necesitás:\n• Autorización firmada por el titular\n• Copia del DNI del titular\n• Código de compra\n• DNI original de quien retira\n\n¿Necesitás el modelo de autorización?' },
  { id: 5, atajo: '/promos', titulo: 'Promociones bancarias', contenido: 'Promociones vigentes:\n🏦 Santander: 3, 6 y 12 cuotas SI\n🏦 Galicia: 3 y 6 cuotas SI + 10%\n🏦 BBVA: 12 y 18 cuotas SI\n🏦 Macro: 6 cuotas SI\n\n¿Sobre qué producto consultás?' },
  { id: 6, atajo: '/cierre', titulo: 'Cierre de chat', contenido: '¡Fue un placer atenderte! 😊 Si tenés otra consulta, no dudes en contactarnos. Al finalizar recibirás una encuesta de satisfacción. ¡Excelente día!' },
];

const agentes = [
  { nombre: 'Sofía Ríos', avatar: 'SR', estado: 'online', chats: 3, csat: 4.8 },
  { nombre: 'Martín Pereyra', avatar: 'MP', estado: 'online', chats: 2, csat: 4.6 },
  { nombre: 'Valentina Torres', avatar: 'VT', estado: 'online', chats: 1, csat: 4.9 },
  { nombre: 'Diego Álvarez', avatar: 'DA', estado: 'busy', chats: 4, csat: 4.5 },
  { nombre: 'Camila Sánchez', avatar: 'CS', estado: 'offline', chats: 0, csat: 4.7 },
];

// ==========================================
// APP COMPONENT
// ==========================================
function App() {
  const [currentView, setCurrentView] = useState('chat');
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [conversaciones, setConversaciones] = useState(conversacionesData);
  const [messageInput, setMessageInput] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetStep, setWidgetStep] = useState<'form' | 'chat'>('form');
  const [widgetMessages, setWidgetMessages] = useState<any[]>([]);
  const [widgetInput, setWidgetInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = conversaciones.find(c => c.id === selectedChatId) || conversaciones[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.mensajes.length, widgetMessages.length]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    const newMsg = { id: Date.now(), tipo: 'agente', emisor: 'Sofía Ríos', texto: messageInput, hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) };
    setConversaciones(prev => prev.map(c => c.id === selectedChatId ? { ...c, mensajes: [...c.mensajes, newMsg], ultimoMsg: messageInput } : c));
    setMessageInput('');
    setShowQR(false);
  };

  const takeChat = (id: number) => {
    setConversaciones(prev => prev.map(c => c.id === id ? { ...c, estado: 'activo', unread: false } : c));
  };

  const resolveChat = () => {
    setConversaciones(prev => prev.map(c => c.id === selectedChatId ? { ...c, estado: 'resuelto' } : c));
  };

  const insertQR = (content: string) => {
    setMessageInput(content);
    setShowQR(false);
  };

  const sendWidgetMessage = () => {
    if (!widgetInput.trim()) return;
    const userMsg = { id: Date.now(), tipo: 'cliente', texto: widgetInput, hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) };
    setWidgetMessages(prev => [...prev, userMsg]);
    setWidgetInput('');
    // Simular respuesta del bot
    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, tipo: 'bot', texto: 'Gracias por tu mensaje. Un asesor se conectará contigo en breves momentos. ¿Podrías indicarme tu número de pedido?', hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) };
      setWidgetMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  const startWidgetChat = () => {
    setWidgetStep('chat');
    setWidgetMessages([
      { id: 1, tipo: 'bot', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte hoy?', hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) }
    ]);
  };

  const getEstadoBadge = (estado: string) => {
    const map: Record<string, string> = { esperando: 'waiting', activo: 'active', resuelto: 'closed' };
    return map[estado] || 'closed';
  };

  const getEstadoLabel = (estado: string) => {
    const map: Record<string, string> = { esperando: 'Esperando', activo: 'En atención', resuelto: 'Resuelto' };
    return map[estado] || estado;
  };

  return (
    <div className="app">
      {/* ============ SIDEBAR ============ */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">N</div>
            <div className="brand-text">
              <h1>Nexo Web Chat</h1>
              <p>Frávega · Atención Digital</p>
            </div>
          </div>
        </div>

        <div className="sidebar-agent">
          <div className="agent-avatar">SR<span className="status-dot online"></span></div>
          <div className="agent-info">
            <div className="name">Sofía Ríos</div>
            <div className="role">Agente · En línea</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Principal</div>
            <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>
              <span className="nav-icon">📊</span><span>Dashboard</span>
            </button>
            <button className={`nav-item ${currentView === 'chat' ? 'active' : ''}`} onClick={() => setCurrentView('chat')}>
              <span className="nav-icon">💬</span><span>Bandeja de Chats</span>
              <span className="nav-badge">4</span>
            </button>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Gestión</div>
            <button className="nav-item">
              <span className="nav-icon">📋</span><span>Escalaciones</span>
              <span className="nav-badge warning">2</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">📚</span><span>Base de Conocimiento</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">⚡</span><span>Respuestas Rápidas</span>
            </button>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Análisis</div>
            <button className="nav-item">
              <span className="nav-icon">📈</span><span>Métricas</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">✅</span><span>Calidad</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">🏢</span><span>Organigrama</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="stat">🕐 Turno: 14:00 - 22:00</div>
          <div className="stat">💬 Chats: 3/4 máx.</div>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <main className="main">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div>
              <div className="topbar-title">{currentView === 'dashboard' ? 'Dashboard' : 'Bandeja de Chats'}</div>
              <div className="topbar-breadcrumb">Atención Digital / <span>{currentView === 'dashboard' ? 'Resumen' : 'Conversaciones'}</span></div>
            </div>
          </div>
          <div className="topbar-right">
            <button className="topbar-btn" title="Buscar">🔍</button>
            <button className="topbar-btn" title="Notificaciones">
              🔔<span className="notif-dot"></span>
            </button>
            <button className="topbar-btn" title="Configuración">⚙️</button>
          </div>
        </div>

        {/* ============ DASHBOARD VIEW ============ */}
        {currentView === 'dashboard' && (
          <div className="content">
            <div className="explanation-banner">
              <div className="icon">📊</div>
              <div>
                <h3>Dashboard — Panel de Control en Tiempo Real</h3>
                <p>Esta vista muestra los KPIs críticos del canal Web/Chat. Los datos se actualizan vía polling cada 3 segundos desde la API PHP. El FCR, CSAT, TMR y AHT se calculan directamente desde MySQL.</p>
              </div>
            </div>

            <div className="dashboard-header">
              <h2>Resumen en Tiempo Real</h2>
              <p>Atención Web/Chat · Frávega · {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>

            {/* KPIs */}
            <div className="kpi-grid">
              <div className="kpi-card orange">
                <div className="kpi-top">
                  <span className="kpi-label">En Espera</span>
                  <div className="kpi-icon-wrap orange">⏳</div>
                </div>
                <div className="kpi-value">4</div>
                <div className="kpi-footer">
                  <span className="kpi-trend down">+2</span>
                  <span className="kpi-subtitle">Chats en cola</span>
                </div>
              </div>
              <div className="kpi-card blue">
                <div className="kpi-top">
                  <span className="kpi-label">En Atención</span>
                  <div className="kpi-icon-wrap blue">💬</div>
                </div>
                <div className="kpi-value">5</div>
                <div className="kpi-footer">
                  <span className="kpi-trend up">+1</span>
                  <span className="kpi-subtitle">Chats activos</span>
                </div>
              </div>
              <div className="kpi-card green">
                <div className="kpi-top">
                  <span className="kpi-label">1ra Respuesta</span>
                  <div className="kpi-icon-wrap green">⚡</div>
                </div>
                <div className="kpi-value">1m 42s</div>
                <div className="kpi-footer">
                  <span className="kpi-trend up">-12s</span>
                  <span className="kpi-subtitle">Tiempo medio</span>
                </div>
              </div>
              <div className="kpi-card purple">
                <div className="kpi-top">
                  <span className="kpi-label">Satisfacción</span>
                  <div className="kpi-icon-wrap purple">⭐</div>
                </div>
                <div className="kpi-value">4.7<span style={{fontSize:'16px',color:'var(--gray-400)'}}>/5</span></div>
                <div className="kpi-footer">
                  <span className="kpi-trend up">+0.2</span>
                  <span className="kpi-subtitle">CSAT promedio</span>
                </div>
              </div>
            </div>

            {/* Charts + Agents */}
            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Volumen de Chats · Últimos 7 días</h3>
                  <span className="card-action">Ver detalle →</span>
                </div>
                <div className="card-body">
                  <div className="chart-container">
                    {[
                      { day: 'Lun', recibidos: 42, resueltos: 38 },
                      { day: 'Mar', recibidos: 55, resueltos: 52 },
                      { day: 'Mié', recibidos: 48, resueltos: 44 },
                      { day: 'Jue', recibidos: 61, resueltos: 57 },
                      { day: 'Vie', recibidos: 53, resueltos: 49 },
                      { day: 'Sáb', recibidos: 38, resueltos: 35 },
                      { day: 'Dom', recibidos: 22, resueltos: 20 },
                    ].map((d, i) => (
                      <div key={i} className="chart-bar-group">
                        <div className="chart-bars">
                          <div className="chart-bar primary" style={{ height: `${(d.recibidos / 65) * 100}%` }} title={`Recibidos: ${d.recibidos}`}></div>
                          <div className="chart-bar success" style={{ height: `${(d.resueltos / 65) * 100}%` }} title={`Resueltos: ${d.resueltos}`}></div>
                        </div>
                        <span className="chart-label">{d.day}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gray-500)' }}>
                      <span style={{ width: 10, height: 10, background: 'var(--primary-500)', borderRadius: 2 }}></span> Recibidos
                    </span>
                    <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gray-500)' }}>
                      <span style={{ width: 10, height: 10, background: 'var(--success-600)', borderRadius: 2 }}></span> Resueltos
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Estado de Agentes</h3>
                  <span className="card-action">Ver todos →</span>
                </div>
                <div className="card-body">
                  <div className="agent-list">
                    {agentes.map((a, i) => (
                      <div key={i} className="agent-row">
                        <div className="agent-avatar" style={{ background: `linear-gradient(135deg, ${['#3b82f6','#10b981','#8b5cf6','#f59e0b','#6b7280'][i]}, ${['#2563eb','#059669','#7c3aed','#d97706','#4b5563'][i]})` }}>
                          {a.avatar}
                          <span className={`status-dot ${a.estado}`}></span>
                        </div>
                        <div className="agent-row-info">
                          <div className="name">{a.nombre}</div>
                          <div className="status">{a.estado === 'online' ? 'Disponible' : a.estado === 'busy' ? 'Ocupado' : 'Desconectado'}</div>
                        </div>
                        <div className="agent-metric">
                          <div className="value">{a.chats}</div>
                          <div className="label">chats</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards - Explicaciones */}
            <div className="info-cards">
              <div className="info-card blue">
                <div className="info-card-icon">🔄</div>
                <h4>Polling en Tiempo Real</h4>
                <p>Los datos se actualizan automáticamente cada 3 segundos mediante Fetch API. La arquitectura está preparada para migrar a Server-Sent Events (SSE).</p>
                <ul>
                  <li>GET /api/messages.php?since=TIMESTAMP</li>
                  <li>Solo trae mensajes nuevos</li>
                  <li>No recarga la página</li>
                </ul>
              </div>
              <div className="info-card green">
                <div className="info-card-icon">🗄️</div>
                <h4>Base de Datos MySQL</h4>
                <p>10 tablas normalizadas con relaciones, índices y constraints. PDO con prepared statements para prevenir SQL Injection.</p>
                <ul>
                  <li>users, customers, orders</li>
                  <li>conversations, messages</li>
                  <li>quick_replies, knowledge_base</li>
                </ul>
              </div>
              <div className="info-card purple">
                <div className="info-card-icon">🔐</div>
                <h4>Seguridad Implementada</h4>
                <p>Autenticación con password_hash(), sesiones PHP, tokens CSRF, validación de inputs y escape de output contra XSS.</p>
                <ul>
                  <li>password_hash() + password_verify()</li>
                  <li>Prepared Statements (PDO)</li>
                  <li>Control de acceso por roles</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ============ CHAT VIEW ============ */}
        {currentView === 'chat' && (
          <div className="chat-view">
            {/* PANEL 1: Queue */}
            <div className="panel-queue">
              <div className="panel-queue-header">
                <h2>Bandeja de Chats</h2>
                <p>{conversaciones.length} conversaciones</p>
              </div>
              <div className="queue-filters">
                <button className="queue-filter active">Todos</button>
                <button className="queue-filter">Esperando</button>
                <button className="queue-filter">Activos</button>
                <button className="queue-filter">Resueltos</button>
              </div>
              <div className="queue-list">
                {conversaciones.map(chat => (
                  <button key={chat.id} className={`queue-item ${selectedChatId === chat.id ? 'active' : ''} ${chat.unread ? 'unread' : ''}`} onClick={() => setSelectedChatId(chat.id)}>
                    <div className={`queue-avatar ${chat.color}`}>{chat.avatar}</div>
                    <div className="queue-info">
                      <div className="queue-info-top">
                        <span className="queue-name">{chat.cliente}</span>
                        <span className="queue-time">{chat.mensajes[0]?.hora}</span>
                      </div>
                      <div className="queue-message">{chat.ultimoMsg}</div>
                      <div className="queue-meta">
                        <span className={`status-badge ${getEstadoBadge(chat.estado)}`}>{getEstadoLabel(chat.estado)}</span>
                        {chat.estado === 'esperando' && (
                          <span className="wait-timer"><span className="dot"></span>{chat.tiempo}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PANEL 2: Chat Room */}
            <div className="panel-chat">
              <div className="chat-header">
                <div className="chat-header-left">
                  <div className={`queue-avatar ${selectedChat.color}`}>{selectedChat.avatar}</div>
                  <div className="chat-header-info">
                    <h3>{selectedChat.cliente}</h3>
                    <p>{selectedChat.motivo} · DNI: {selectedChat.dni}</p>
                  </div>
                </div>
                <div className="chat-header-actions">
                  <span className={`status-badge ${getEstadoBadge(selectedChat.estado)}`}>{getEstadoLabel(selectedChat.estado)}</span>
                  {selectedChat.estado === 'esperando' && (
                    <button className="chat-action-btn primary" onClick={() => takeChat(selectedChat.id)}>
                      ✋ Tomar chat
                    </button>
                  )}
                  {selectedChat.estado === 'activo' && (
                    <button className="chat-action-btn success" onClick={resolveChat}>
                      ✓ Resolver
                    </button>
                  )}
                </div>
              </div>

              <div className="chat-messages">
                {selectedChat.mensajes.map(msg => (
                  <div key={msg.id} className={`msg ${msg.tipo === 'agente' ? 'sent' : msg.tipo === 'sistema' ? 'system' : 'received'} ${msg.tipo === 'bot' ? 'bot' : ''}`}>
                    {msg.tipo !== 'sistema' && (
                      <div className="msg-header">
                        <span className="msg-sender">{msg.emisor}</span>
                        <span className="msg-time">{msg.hora}</span>
                      </div>
                    )}
                    <div className="msg-bubble">{msg.texto}</div>
                  </div>
                ))}
                {/* Typing indicator */}
                {selectedChat.estado === 'activo' && (
                  <div className="msg received">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="chat-input-area">
                <div className="chat-toolbar">
                  <button className={`toolbar-btn ${showQR ? 'active' : ''}`} onClick={() => setShowQR(!showQR)}>
                    ⚡ Respuestas rápidas
                  </button>
                  <button className="toolbar-btn">📎 Adjuntar</button>
                  <button className="toolbar-btn">📚 KB</button>
                  <button className="toolbar-btn" style={{ marginLeft: 'auto' }}>⋯</button>
                </div>
                {showQR && (
                  <div className="quick-replies-panel">
                    {respuestasRapidas.map(qr => (
                      <div key={qr.id} className="qr-item" onClick={() => insertQR(qr.contenido)}>
                        <div className="qr-item-header">
                          <span className="qr-shortcut">{qr.atajo}</span>
                          <span className="qr-title">{qr.titulo}</span>
                        </div>
                        <div className="qr-preview">{qr.contenido}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="chat-input-row">
                  <textarea className="chat-textarea" placeholder="Escribí tu respuesta..." value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} rows={1}></textarea>
                  <button className="send-btn" onClick={sendMessage} disabled={!messageInput.trim()}>➤</button>
                </div>
              </div>
            </div>

            {/* PANEL 3: Context */}
            <div className="panel-context">
              <div className="context-section">
                <div className="context-section-title">Perfil del Cliente</div>
                <div className="context-profile">
                  <div className={`queue-avatar ${selectedChat.color}`}>{selectedChat.avatar}</div>
                  <div className="context-profile-info">
                    <h4>{selectedChat.cliente}</h4>
                    <p>Cliente desde {selectedChat.clienteDesde}</p>
                  </div>
                </div>
                <div className="context-details">
                  <div className="context-detail"><i>✉️</i><span>{selectedChat.email}</span></div>
                  <div className="context-detail"><i>📱</i><span>{selectedChat.tel}</span></div>
                  <div className="context-detail"><i>🪪</i><span>DNI: {selectedChat.dni}</span></div>
                </div>
              </div>

              <div className="context-section">
                <div className="context-stats">
                  <div className="context-stat blue">
                    <div className="value">{selectedChat.pedidos}</div>
                    <div className="label">Pedidos</div>
                  </div>
                  <div className="context-stat orange">
                    <div className="value">{selectedChat.casos}</div>
                    <div className="label">Casos previos</div>
                  </div>
                </div>
              </div>

              {selectedChat.pedido && (
                <div className="context-section">
                  <div className="context-section-title">Pedido en Consulta</div>
                  <div className="order-card">
                    <div className="order-card-top">
                      <span className="order-number">{selectedChat.pedido.num}</span>
                      <span className={`order-status ${selectedChat.pedido.estado}`}>{selectedChat.pedido.estadoLabel}</span>
                    </div>
                    <div className="order-product">{selectedChat.pedido.producto}</div>
                    <div className="order-details">
                      <div className="order-row"><span className="label">Monto:</span><span className="value">${selectedChat.pedido.monto.toLocaleString('es-AR')}</span></div>
                      <div className="order-row"><span className="label">Entrega:</span><span className="value">{selectedChat.pedido.entrega}</span></div>
                      <div className="order-row"><span className="label">Fecha est.:</span><span className="value">{selectedChat.pedido.fecha}</span></div>
                    </div>
                    <div className="progress-tracker">
                      <div className="progress-labels">
                        <span>Preparando</span>
                        <span>En camino</span>
                        <span>Entregado</span>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-fill ${selectedChat.pedido.estado}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="context-section">
                <div className="context-section-title">Motivo de Contacto</div>
                <div className="context-detail"><i>🏷️</i><span>{selectedChat.motivo}</span></div>
              </div>

              <div className="context-section">
                <div className="context-section-title">Artículos Relacionados</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {['Retiro por tercero en sucursal', 'Escalamiento demora logística', 'Proceso cambio/devolución'].map((art, i) => (
                    <div key={i} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--gray-200)', fontSize: '11px', cursor: 'pointer', transition: 'var(--transition)' }} onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary-300)')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')}>
                      {art}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============ WIDGET FLOTANTE (Cliente) ============ */}
      <div className="widget-float">
        {widgetOpen && (
          <div className="widget-window">
            <div className="widget-header">
              <div className="widget-header-info">
                <h3>💬 Chat Frávega</h3>
                <p>Te respondemos en minutos</p>
              </div>
              <button className="widget-close" onClick={() => setWidgetOpen(false)}>✕</button>
            </div>
            {widgetStep === 'form' ? (
              <div className="widget-body">
                <div className="widget-form">
                  <div>
                    <label>Nombre completo</label>
                    <input type="text" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div>
                    <label>DNI</label>
                    <input type="text" placeholder="Ej: 30.123.456" />
                  </div>
                  <div>
                    <label>N° de pedido (opcional)</label>
                    <input type="text" placeholder="Ej: #10452" />
                  </div>
                  <div>
                    <label>Motivo de consulta</label>
                    <select>
                      <option>Estado de mi pedido</option>
                      <option>Consulta de stock</option>
                      <option>Promociones</option>
                      <option>Reclamo / Postventa</option>
                      <option>Retiro en sucursal</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <button className="widget-submit" onClick={startWidgetChat}>Iniciar conversación</button>
                </div>
              </div>
            ) : (
              <>
                <div className="widget-body">
                  {widgetMessages.map(msg => (
                    <div key={msg.id} className={`msg ${msg.tipo === 'cliente' ? 'sent' : 'received'} ${msg.tipo === 'bot' ? 'bot' : ''}`} style={{ marginBottom: '12px' }}>
                      <div className="msg-bubble">{msg.texto}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '10px 12px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: '8px' }}>
                  <input type="text" value={widgetInput} onChange={e => setWidgetInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendWidgetMessage()} placeholder="Escribí tu mensaje..." style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--gray-200)', borderRadius: '20px', fontSize: '12px', outline: 'none' }} />
                  <button onClick={sendWidgetMessage} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary-500)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
                </div>
              </>
            )}
            <div className="widget-footer">
              Powered by Nexo Web Chat · Frávega
            </div>
          </div>
        )}
        <button className="widget-toggle" onClick={() => setWidgetOpen(!widgetOpen)}>
          {widgetOpen ? '✕' : '💬'}
          {!widgetOpen && <span className="badge-count">1</span>}
        </button>
      </div>
    </div>
  );
}

export default App;
