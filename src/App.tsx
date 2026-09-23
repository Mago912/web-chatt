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
      { id: 4, tipo: 'bot', emisor: 'Bot Nexo', texto: 'Entiendo tu consulta. Voy a conectarte con un asesor. Un momento por favor...', hora: '14:33' },
      { id: 5, tipo: 'sistema', texto: '⚡ Transferido a agente: Sofía Ríos', hora: '14:34' },
      { id: 6, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola María! Buenas tardes. Soy Sofía, estoy revisando tu pedido.', hora: '14:34' },
      { id: 7, tipo: 'cliente', emisor: 'María González', texto: 'Sí, es el #10452. Es el Smart TV Samsung de 50 pulgadas.', hora: '14:35' },
      { id: 8, tipo: 'agente', emisor: 'Sofía Ríos', texto: 'Perfecto, ya lo ubiqué. Veo que está "En distribución". Déjame consultar con el centro logístico.', hora: '14:36' },
    ]
  },
  {
    id: 2, cliente: 'Carlos Rodríguez', avatar: 'CR', color: 'green', dni: '28.901.234', email: 'c.rodriguez@outlook.com', tel: '+54 11 4421-3356', clienteDesde: 2019, pedidos: 12, casos: 1,
    pedido: { num: '#10389', producto: 'Notebook Lenovo IdeaPad 3 15" Ryzen 5', monto: 749999, entrega: 'Retiro sucursal Caballito', fecha: '12 Ene 2025', estado: 'preparing', estadoLabel: 'En preparación' },
    motivo: 'Preventa · Consulta de stock', estado: 'esperando', tiempo: '4m 02s', unread: true,
    ultimoMsg: 'Buenas, quiero saber si tienen la notebook en Caballito.',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:28' },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 ¿En qué puedo ayudarte?', hora: '14:28' },
      { id: 3, tipo: 'cliente', emisor: 'Carlos Rodríguez', texto: 'Hola, quiero comprar la notebook Lenovo IdeaPad 3 pero necesito retirarla hoy de Caballito. ¿Tienen stock?', hora: '14:29' },
    ]
  },
  {
    id: 3, cliente: 'Lucía Fernández', avatar: 'LF', color: 'purple', dni: '35.678.432', email: 'lucia.fernandez@yahoo.com', tel: '+54 11 6678-1122', clienteDesde: 2023, pedidos: 3, casos: 0,
    pedido: null, motivo: 'Preventa · Promociones bancarias', estado: 'esperando', tiempo: '1m 48s', unread: true,
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
      { id: 2, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Me llegó el lavarropas pero está dañado. La caja vino golpeada.', hora: '14:21' },
      { id: 3, tipo: 'sistema', texto: '⚡ Transferido a agente: Martín Pereyra', hora: '14:22' },
      { id: 4, tipo: 'agente', emisor: 'Martín Pereyra', texto: 'Roberto, lamento mucho lo sucedido. Voy a generar un reclamo.', hora: '14:22' },
      { id: 5, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Es el #10445', hora: '14:23' },
      { id: 6, tipo: 'agente', emisor: 'Martín Pereyra', texto: 'Necesito fotos del daño. ¿Podés adjuntarlas aquí?', hora: '14:24' },
    ]
  },
  {
    id: 5, cliente: 'Ana López', avatar: 'AL', color: 'pink', dni: '30.234.890', email: 'ana.lopez@hotmail.com', tel: '+54 11 5567-9900', clienteDesde: 2022, pedidos: 5, casos: 1,
    pedido: { num: '#10298', producto: 'Aire Acond. Samsung WindFree 3200F', monto: 899999, entrega: 'Entrega + Instalación', fecha: '10 Ene 2025', estado: 'delivered', estadoLabel: 'Entregado' },
    motivo: 'Postventa · Instalación pendiente', estado: 'resuelto', tiempo: '-', unread: false,
    ultimoMsg: '¡Muchas gracias! Quedo atenta.',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado', hora: '13:45' },
      { id: 2, tipo: 'cliente', emisor: 'Ana López', texto: 'Hola, me entregaron el aire pero no vino el técnico.', hora: '13:46' },
      { id: 3, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola Ana! Voy a reagendar la instalación.', hora: '13:47' },
      { id: 4, tipo: 'agente', emisor: 'Sofía Ríos', texto: 'Listo, el técnico pasará entre el 16 y 17 de enero.', hora: '13:50' },
      { id: 5, tipo: 'sistema', texto: '✅ Caso resuelto · CSAT: 5/5 ⭐', hora: '13:52' },
    ]
  },
];

const respuestasRapidas = [
  { id: 1, atajo: '/saludo', titulo: 'Saludo inicial', contenido: '¡Hola! 👋 Soy [Nombre], asesor/a de Frávega. Estoy revisando tu consulta. ¿Podrías confirmarme tu número de pedido?', categoria: 'Saludo' },
  { id: 2, atajo: '/estado', titulo: 'Consulta estado pedido', contenido: 'Estoy consultando el estado de tu pedido en nuestro sistema logístico. Te pido un momento.', categoria: 'Pedido' },
  { id: 3, atajo: '/demora', titulo: 'Demora en entrega', contenido: 'Comprendo tu frustración. Voy a escalar tu caso al área de logística para priorizar tu entrega.', categoria: 'Envíos' },
  { id: 4, atajo: '/retiro', titulo: 'Retiro por tercero', contenido: 'Para retiro por tercero necesitás:\n• Autorización firmada\n• Copia DNI del titular\n• Código de compra\n• DNI original de quien retira', categoria: 'Retiro' },
  { id: 5, atajo: '/promos', titulo: 'Promociones bancarias', contenido: 'Promociones vigentes:\n🏦 Santander: 3, 6 y 12 cuotas SI\n🏦 Galicia: 3 y 6 cuotas SI + 10%\n🏦 BBVA: 12 y 18 cuotas SI\n🏦 Macro: 6 cuotas SI', categoria: 'Pagos' },
  { id: 6, atajo: '/cierre', titulo: 'Cierre de chat', contenido: '¡Fue un placer atenderte! 😊 Si tenés otra consulta, no dudes en contactarnos. ¡Excelente día!', categoria: 'Despedida' },
];

const baseConocimiento = [
  { id: 1, titulo: 'Retiro por tercero en sucursal', categoria: 'Sucursal', contenido: '1. Verificar identidad del titular\n2. Confirmar pedido disponible\n3. Indicar requisitos: autorización, DNI, código\n4. Enviar modelo si se solicita\n5. Confirmar sucursal y horario' },
  { id: 2, titulo: 'Escalamiento demora logística', categoria: 'Logística', contenido: '1. Validar datos del pedido\n2. Contactar centro de distribución\n3. Generar orden de destrabe\n4. Informar nueva fecha al cliente\n5. Si >72hs: escalar a Supervisor' },
  { id: 3, titulo: 'Proceso cambio/devolución', categoria: 'Postventa', contenido: '1. Verificar fecha (máx 10 días)\n2. Solicitar motivo\n3. Si hay daño: solicitar fotos\n4. Generar logística inversa\n5. Coordinar retiro\n6. Emitir nota de crédito' },
  { id: 4, titulo: 'Derivación servicio técnico', categoria: 'Postventa', contenido: '1. Verificar período de garantía\n2. Recopilar datos y fotos\n3. Identificar centro oficial\n4. Generar ticket\n5. Informar plazo: 48hs hábiles' },
  { id: 5, titulo: 'Validación de identidad', categoria: 'Seguridad', contenido: '1. Solicitar nombre y DNI\n2. Cruzar con CRM\n3. Confirmar email/teléfono\n4. Si hay pedido: N° o últimos 4 dígitos\n5. Si no coincide: NO brindar info' },
  { id: 6, titulo: 'Promociones bancarias', categoria: 'Preventa', contenido: 'Santander: 3, 6, 12 SI\nGalicia: 3, 6 SI + 10%\nBBVA: 12, 18 SI\nMacro: 6 SI\nNaranja: 12 SI\n\nActualizar cada lunes.' },
  { id: 7, titulo: 'Manejo cliente enojado', categoria: 'Calidad', contenido: '1. Mantener calma\n2. Validar frustración\n3. No usar lenguaje defensivo\n4. Ofrecer solución con plazos\n5. Si pide superior: escalar\n6. Documentar todo' },
  { id: 8, titulo: 'Procedimiento facturación', categoria: 'Administrativo', contenido: '1. Solicitar CUIT/CUIL\n2. Verificar si fue facturado\n3. Cambio B a A: derivar a Back Office\n4. Duplicado: reenviar por email\n5. Error: nota de crédito + refacturar' },
];

const escalacionesData = [
  { id: 1, cliente: 'Roberto Martínez', pedido: '#10445', motivo: 'Producto dañado en entrega', estado: 'en_proceso', prioridad: 'alta', derivadoA: 'Postventa y Reclamos', fecha: '15 Ene 2025', agente: 'Martín Pereyra', desc: 'Lavarropas recibido con caja dañada y golpe en tambor.' },
  { id: 2, cliente: 'María González', pedido: '#10452', motivo: 'Demora superior a 72hs', estado: 'en_proceso', prioridad: 'media', derivadoA: 'Back Office Logística', fecha: '15 Ene 2025', agente: 'Sofía Ríos', desc: 'Smart TV con demora en centro de distribución.' },
  { id: 3, cliente: 'Pedro Sánchez', pedido: '#10312', motivo: 'Reclamo Defensa del Consumidor', estado: 'pendiente', prioridad: 'critica', derivadoA: 'Escalaciones Complejas', fecha: '14 Ene 2025', agente: 'Valentina Torres', desc: 'Reclamo formal COPREC por producto no entregado.' },
  { id: 4, cliente: 'Lucía Fernández', pedido: '#10488', motivo: 'Error en facturación', estado: 'resuelto', prioridad: 'baja', derivadoA: 'Back Office Facturación', fecha: '13 Ene 2025', agente: 'Diego Álvarez', desc: 'Factura con CUIT incorrecto. Refacturación generada.' },
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
  const [kbSearch, setKbSearch] = useState('');
  const [selectedKB, setSelectedKB] = useState(1);
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
    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, tipo: 'bot', texto: 'Gracias. Un asesor se conectará contigo.', hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) };
      setWidgetMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  const startWidgetChat = () => {
    setWidgetStep('chat');
    setWidgetMessages([{ id: 1, tipo: 'bot', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte?', hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const getEstadoBadge = (estado: string) => {
    const map: Record<string, string> = { esperando: 'waiting', activo: 'active', resuelto: 'closed' };
    return map[estado] || 'closed';
  };

  const getEstadoLabel = (estado: string) => {
    const map: Record<string, string> = { esperando: 'Esperando', activo: 'En atención', resuelto: 'Resuelto' };
    return map[estado] || estado;
  };

  const filteredKB = baseConocimiento.filter(a => 
    a.titulo.toLowerCase().includes(kbSearch.toLowerCase()) || 
    a.categoria.toLowerCase().includes(kbSearch.toLowerCase())
  );

  // ==========================================
  // RENDER VIEWS
  // ==========================================
  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'chat': return <ChatView />;
      case 'escalations': return <EscalationsView />;
      case 'knowledge': return <KnowledgeView />;
      case 'quick-replies': return <QuickRepliesView />;
      case 'metrics': return <MetricsView />;
      case 'quality': return <QualityView />;
      case 'organigrama': return <OrganigramaView />;
      default: return <DashboardView />;
    }
  };

  // ==========================================
  // DASHBOARD VIEW
  // ==========================================
  function DashboardView() {
    return (
      <div className="content">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <p>Resumen en tiempo real · {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card orange">
            <div className="kpi-top"><span className="kpi-label">En Espera</span><div className="kpi-icon-wrap orange">⏳</div></div>
            <div className="kpi-value">4</div>
            <div className="kpi-footer"><span className="kpi-trend down">+2</span><span className="kpi-subtitle">Chats en cola</span></div>
          </div>
          <div className="kpi-card blue">
            <div className="kpi-top"><span className="kpi-label">En Atención</span><div className="kpi-icon-wrap blue">💬</div></div>
            <div className="kpi-value">5</div>
            <div className="kpi-footer"><span className="kpi-trend up">+1</span><span className="kpi-subtitle">Chats activos</span></div>
          </div>
          <div className="kpi-card green">
            <div className="kpi-top"><span className="kpi-label">1ra Respuesta</span><div className="kpi-icon-wrap green">⚡</div></div>
            <div className="kpi-value">1m 42s</div>
            <div className="kpi-footer"><span className="kpi-trend up">-12s</span><span className="kpi-subtitle">Tiempo medio</span></div>
          </div>
          <div className="kpi-card purple">
            <div className="kpi-top"><span className="kpi-label">Satisfacción</span><div className="kpi-icon-wrap purple">⭐</div></div>
            <div className="kpi-value">4.7<span style={{fontSize:'16px',color:'var(--gray-400)'}}>/5</span></div>
            <div className="kpi-footer"><span className="kpi-trend up">+0.2</span><span className="kpi-subtitle">CSAT promedio</span></div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CHAT VIEW
  // ==========================================
  function ChatView() {
    return (
      <div className="chat-view">
        <div className="panel-queue">
          <div className="panel-queue-header">
            <h2>Bandeja de Chats</h2>
            <p>{conversaciones.length} conversaciones</p>
          </div>
          <div className="queue-filters">
            <button className="queue-filter active">Todos</button>
            <button className="queue-filter">Esperando</button>
            <button className="queue-filter">Activos</button>
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
                    {chat.estado === 'esperando' && <span className="wait-timer"><span className="dot"></span>{chat.tiempo}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

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
              {selectedChat.estado === 'esperando' && <button className="chat-action-btn primary" onClick={() => takeChat(selectedChat.id)}>✋ Tomar</button>}
              {selectedChat.estado === 'activo' && <button className="chat-action-btn success" onClick={resolveChat}>✓ Resolver</button>}
            </div>
          </div>

          <div className="chat-messages">
            {selectedChat.mensajes.map(msg => (
              <div key={msg.id} className={`msg ${msg.tipo === 'agente' ? 'sent' : msg.tipo === 'sistema' ? 'system' : 'received'} ${msg.tipo === 'bot' ? 'bot' : ''}`}>
                {msg.tipo !== 'sistema' && <div className="msg-header"><span className="msg-sender">{msg.emisor}</span><span className="msg-time">{msg.hora}</span></div>}
                <div className="msg-bubble">{msg.texto}</div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chat-input-area">
            <div className="chat-toolbar">
              <button className={`toolbar-btn ${showQR ? 'active' : ''}`} onClick={() => setShowQR(!showQR)}>⚡ Respuestas rápidas</button>
              <button className="toolbar-btn">📎 Adjuntar</button>
            </div>
            {showQR && (
              <div className="quick-replies-panel">
                {respuestasRapidas.map(qr => (
                  <div key={qr.id} className="qr-item" onClick={() => insertQR(qr.contenido)}>
                    <div className="qr-item-header"><span className="qr-shortcut">{qr.atajo}</span><span className="qr-title">{qr.titulo}</span></div>
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
              <div className="context-stat blue"><div className="value">{selectedChat.pedidos}</div><div className="label">Pedidos</div></div>
              <div className="context-stat orange"><div className="value">{selectedChat.casos}</div><div className="label">Casos</div></div>
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
                </div>
                <div className="progress-tracker">
                  <div className="progress-labels"><span>Preparando</span><span>En camino</span><span>Entregado</span></div>
                  <div className="progress-bar"><div className={`progress-fill ${selectedChat.pedido.estado}`}></div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // ESCALATIONS VIEW
  // ==========================================
  function EscalationsView() {
    return (
      <div className="content">
        <div className="dashboard-header">
          <h2>Escalaciones</h2>
          <p>Casos derivados a sectores de 2do nivel</p>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card" style={{borderTop: '3px solid var(--danger-500)'}}>
            <div className="kpi-top"><span className="kpi-label">Críticas</span></div>
            <div className="kpi-value" style={{color: 'var(--danger-600)'}}>1</div>
          </div>
          <div className="kpi-card" style={{borderTop: '3px solid var(--warning-500)'}}>
            <div className="kpi-top"><span className="kpi-label">En proceso</span></div>
            <div className="kpi-value" style={{color: 'var(--warning-600)'}}>2</div>
          </div>
          <div className="kpi-card" style={{borderTop: '3px solid var(--primary-500)'}}>
            <div className="kpi-top"><span className="kpi-label">Pendientes</span></div>
            <div className="kpi-value" style={{color: 'var(--primary-600)'}}>1</div>
          </div>
          <div className="kpi-card" style={{borderTop: '3px solid var(--success-500)'}}>
            <div className="kpi-top"><span className="kpi-label">Resueltos</span></div>
            <div className="kpi-value" style={{color: 'var(--success-600)'}}>5</div>
          </div>
        </div>
        <div style={{marginTop: '24px'}}>
          {escalacionesData.map(esc => (
            <div key={esc.id} className="card" style={{marginBottom: '12px', padding: '16px'}}>
              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                <span className={`status-badge ${esc.prioridad === 'critica' ? 'waiting' : esc.prioridad === 'alta' ? 'waiting' : 'active'}`}>{esc.prioridad.toUpperCase()}</span>
                <span className={`status-badge ${esc.estado === 'en_proceso' ? 'active' : esc.estado === 'pendiente' ? 'waiting' : 'closed'}`}>{esc.estado === 'en_proceso' ? 'En proceso' : esc.estado === 'pendiente' ? 'Pendiente' : 'Resuelto'}</span>
                <span style={{fontSize: '11px', color: 'var(--gray-500)', marginLeft: 'auto'}}>{esc.fecha}</span>
              </div>
              <h3 style={{fontSize: '14px', fontWeight: 700, marginBottom: '4px'}}>{esc.cliente} · Pedido {esc.pedido}</h3>
              <p style={{fontSize: '12px', color: 'var(--gray-600)', marginBottom: '8px'}}>{esc.motivo}</p>
              <p style={{fontSize: '12px', color: 'var(--gray-500)', background: 'var(--gray-50)', padding: '10px', borderRadius: '6px'}}>{esc.desc}</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px'}}>
                <div style={{background: 'var(--primary-50)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--primary-100)'}}>
                  <p style={{fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600}}>Derivado a</p>
                  <p style={{fontSize: '12px', fontWeight: 600}}>{esc.derivadoA}</p>
                </div>
                <span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Agente: {esc.agente}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // KNOWLEDGE VIEW
  // ==========================================
  function KnowledgeView() {
    return (
      <div className="content">
        <div className="dashboard-header">
          <h2>Base de Conocimiento</h2>
          <p>Artículos de procedimientos y guías internas</p>
        </div>
        <div style={{marginBottom: '20px'}}>
          <input type="text" placeholder="Buscar artículos..." value={kbSearch} onChange={e => setKbSearch(e.target.value)} style={{width: '100%', padding: '12px 16px', border: '1px solid var(--gray-200)', borderRadius: '8px', fontSize: '14px', outline: 'none'}} />
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {filteredKB.map(art => (
              <button key={art.id} onClick={() => setSelectedKB(art.id)} style={{padding: '12px', borderRadius: '8px', border: selectedKB === art.id ? '2px solid var(--primary-500)' : '1px solid var(--gray-200)', background: selectedKB === art.id ? 'var(--primary-50)' : 'white', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'}}>
                <h4 style={{fontSize: '13px', fontWeight: 600, marginBottom: '4px'}}>{art.titulo}</h4>
                <span style={{fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: 'var(--primary-100)', color: 'var(--primary-700)'}}>{art.categoria}</span>
              </button>
            ))}
          </div>
          <div className="card" style={{padding: '24px'}}>
            {(() => {
              const art = baseConocimiento.find(a => a.id === selectedKB);
              if (!art) return <p>Seleccioná un artículo</p>;
              return (
                <>
                  <span style={{fontSize: '11px', padding: '4px 10px', borderRadius: '10px', background: 'var(--primary-100)', color: 'var(--primary-700)', marginBottom: '12px', display: 'inline-block'}}>{art.categoria}</span>
                  <h2 style={{fontSize: '18px', fontWeight: 700, marginBottom: '16px'}}>{art.titulo}</h2>
                  <div style={{background: 'var(--gray-50)', padding: '16px', borderRadius: '8px'}}>
                    <h3 style={{fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '10px', textTransform: 'uppercase'}}>Procedimiento</h3>
                    {art.contenido.split('\n').map((line, i) => <p key={i} style={{fontSize: '13px', color: 'var(--gray-700)', marginBottom: '4px'}}>{line}</p>)}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // QUICK REPLIES VIEW
  // ==========================================
  function QuickRepliesView() {
    return (
      <div className="content">
        <div className="dashboard-header">
          <h2>Respuestas Rápidas</h2>
          <p>Plantillas predefinidas para agilizar la atención</p>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
          {respuestasRapidas.map(rr => (
            <div key={rr.id} className="card" style={{padding: '16px'}}>
              <div style={{display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center'}}>
                <span style={{fontFamily: 'monospace', fontSize: '11px', background: 'var(--gray-900)', color: 'white', padding: '3px 8px', borderRadius: '4px'}}>{rr.atajo}</span>
                <span style={{fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: 'var(--primary-100)', color: 'var(--primary-700)'}}>{rr.categoria}</span>
              </div>
              <h3 style={{fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>{rr.titulo}</h3>
              <p style={{fontSize: '12px', color: 'var(--gray-600)', lineHeight: '1.6', whiteSpace: 'pre-line'}}>{rr.contenido}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // METRICS VIEW
  // ==========================================
  function MetricsView() {
    return (
      <div className="content">
        <div className="dashboard-header">
          <h2>Métricas</h2>
          <p>Indicadores de atención y satisfacción</p>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card green">
            <div className="kpi-top"><span className="kpi-label">FCR</span></div>
            <div className="kpi-value">78%</div>
            <div className="kpi-subtitle">First Contact Resolution</div>
          </div>
          <div className="kpi-card purple">
            <div className="kpi-top"><span className="kpi-label">CSAT</span></div>
            <div className="kpi-value">4.7/5</div>
            <div className="kpi-subtitle">Satisfacción del Cliente</div>
          </div>
          <div className="kpi-card blue">
            <div className="kpi-top"><span className="kpi-label">TMR</span></div>
            <div className="kpi-value">2m 15s</div>
            <div className="kpi-subtitle">Tiempo Medio Respuesta</div>
          </div>
          <div className="kpi-card orange">
            <div className="kpi-top"><span className="kpi-label">NPS</span></div>
            <div className="kpi-value">72</div>
            <div className="kpi-subtitle">Net Promoter Score</div>
          </div>
        </div>
        <div className="card" style={{marginTop: '20px', padding: '20px'}}>
          <h3 style={{fontSize: '14px', fontWeight: 700, marginBottom: '16px'}}>Cumplimiento SLA</h3>
          {[{l: '1ra respuesta < 2min', v: 92, c: 'var(--success-500)'}, {l: 'Resolución < 15min', v: 78, c: 'var(--primary-500)'}, {l: 'Encuesta completada', v: 85, c: 'var(--purple-500)'}].map((item, i) => (
            <div key={i} style={{marginBottom: '12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px'}}>
                <span>{item.l}</span>
                <span style={{fontWeight: 600, color: item.c}}>{item.v}%</span>
              </div>
              <div style={{height: '6px', background: 'var(--gray-200)', borderRadius: '3px', overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${item.v}%`, background: item.c, borderRadius: '3px'}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // QUALITY VIEW
  // ==========================================
  function QualityView() {
    return (
      <div className="content">
        <div className="dashboard-header">
          <h2>Calidad</h2>
          <p>Monitoreo de atención y evaluaciones</p>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card green">
            <div className="kpi-top"><span className="kpi-label">Score Promedio</span></div>
            <div className="kpi-value">92</div>
            <div className="kpi-subtitle">+2 vs mes anterior</div>
          </div>
          <div className="kpi-card blue">
            <div className="kpi-top"><span className="kpi-label">Chats Monitoreados</span></div>
            <div className="kpi-value">24</div>
            <div className="kpi-subtitle">Esta semana</div>
          </div>
          <div className="kpi-card purple">
            <div className="kpi-top"><span className="kpi-label">Capacitaciones</span></div>
            <div className="kpi-value">3</div>
            <div className="kpi-subtitle">Programadas</div>
          </div>
          <div className="kpi-card orange">
            <div className="kpi-top"><span className="kpi-label">Coaching 1:1</span></div>
            <div className="kpi-value">5</div>
            <div className="kpi-subtitle">Pendientes</div>
          </div>
        </div>
        <div className="card" style={{marginTop: '20px', padding: '20px'}}>
          <h3 style={{fontSize: '14px', fontWeight: 700, marginBottom: '16px'}}>Evaluación por Agente</h3>
          <table style={{width: '100%', fontSize: '12px'}}>
            <thead>
              <tr style={{borderBottom: '2px solid var(--gray-200)'}}>
                <th style={{textAlign: 'left', padding: '8px'}}>Agente</th>
                <th style={{textAlign: 'center', padding: '8px'}}>Tono</th>
                <th style={{textAlign: 'center', padding: '8px'}}>Precisión</th>
                <th style={{textAlign: 'center', padding: '8px'}}>Score</th>
              </tr>
            </thead>
            <tbody>
              {agentes.filter(a => a.estado !== 'offline').map((a, i) => (
                <tr key={i} style={{borderBottom: '1px solid var(--gray-100)'}}>
                  <td style={{padding: '8px'}}>{a.nombre}</td>
                  <td style={{textAlign: 'center', padding: '8px'}}><span style={{padding: '2px 8px', borderRadius: '10px', background: 'var(--success-100)', color: 'var(--success-600)', fontSize: '11px'}}>{8 + i}/10</span></td>
                  <td style={{textAlign: 'center', padding: '8px'}}><span style={{padding: '2px 8px', borderRadius: '10px', background: 'var(--success-100)', color: 'var(--success-600)', fontSize: '11px'}}>{7 + i}/10</span></td>
                  <td style={{textAlign: 'center', padding: '8px', fontWeight: 700}}>{a.csat}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ==========================================
  // ORGANIGRAMA VIEW
  // ==========================================
  function OrganigramaView() {
    return (
      <div className="content">
        <div className="dashboard-header">
          <h2>Organigrama</h2>
          <p>Estructura del área de Atención al Cliente</p>
        </div>
        <div className="card" style={{padding: '32px', textAlign: 'center'}}>
          <div style={{background: 'var(--primary-900)', color: 'white', padding: '16px 24px', borderRadius: '8px', display: 'inline-block', marginBottom: '16px'}}>
            <h3 style={{fontSize: '14px', fontWeight: 700}}>Gerencia de Atención al Cliente</h3>
          </div>
          <div style={{width: '2px', height: '24px', background: 'var(--gray-300)', margin: '0 auto'}}></div>
          <div style={{background: 'var(--primary-500)', color: 'white', padding: '16px 24px', borderRadius: '8px', display: 'inline-block', marginBottom: '24px'}}>
            <h3 style={{fontSize: '14px', fontWeight: 700}}>Coordinación General</h3>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '900px', margin: '0 auto'}}>
            {['Back Office', 'Contact Center', 'Atención Digital ★', 'Postventa', 'Calidad', 'Métricas'].map((item, i) => (
              <div key={i} style={{background: item.includes('★') ? 'var(--success-50)' : 'white', border: item.includes('★') ? '2px solid var(--success-500)' : '1px solid var(--gray-200)', padding: '16px', borderRadius: '8px'}}>
                <h4 style={{fontSize: '13px', fontWeight: 700, color: item.includes('★') ? 'var(--success-600)' : 'var(--gray-800)'}}>{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className="app">
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
            <button className={`nav-item ${currentView === 'escalations' ? 'active' : ''}`} onClick={() => setCurrentView('escalations')}>
              <span className="nav-icon">📋</span><span>Escalaciones</span>
              <span className="nav-badge warning">2</span>
            </button>
            <button className={`nav-item ${currentView === 'knowledge' ? 'active' : ''}`} onClick={() => setCurrentView('knowledge')}>
              <span className="nav-icon">📚</span><span>Base de Conocimiento</span>
            </button>
            <button className={`nav-item ${currentView === 'quick-replies' ? 'active' : ''}`} onClick={() => setCurrentView('quick-replies')}>
              <span className="nav-icon">⚡</span><span>Respuestas Rápidas</span>
            </button>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Análisis</div>
            <button className={`nav-item ${currentView === 'metrics' ? 'active' : ''}`} onClick={() => setCurrentView('metrics')}>
              <span className="nav-icon">📈</span><span>Métricas</span>
            </button>
            <button className={`nav-item ${currentView === 'quality' ? 'active' : ''}`} onClick={() => setCurrentView('quality')}>
              <span className="nav-icon">✅</span><span>Calidad</span>
            </button>
            <button className={`nav-item ${currentView === 'organigrama' ? 'active' : ''}`} onClick={() => setCurrentView('organigrama')}>
              <span className="nav-icon">🏢</span><span>Organigrama</span>
            </button>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="stat">🕐 Turno: 14:00 - 22:00</div>
          <div className="stat">💬 Chats: 3/4 máx.</div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div>
              <div className="topbar-title">{currentView === 'dashboard' ? 'Dashboard' : currentView === 'chat' ? 'Bandeja de Chats' : currentView === 'escalations' ? 'Escalaciones' : currentView === 'knowledge' ? 'Base de Conocimiento' : currentView === 'quick-replies' ? 'Respuestas Rápidas' : currentView === 'metrics' ? 'Métricas' : currentView === 'quality' ? 'Calidad' : 'Organigrama'}</div>
              <div className="topbar-breadcrumb">Atención Digital / <span>{currentView}</span></div>
            </div>
          </div>
          <div className="topbar-right">
            <button className="topbar-btn">🔍</button>
            <button className="topbar-btn">🔔<span className="notif-dot"></span></button>
            <button className="topbar-btn">⚙️</button>
          </div>
        </div>
        {renderView()}
      </main>

      {/* Widget Flotante */}
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
                  <div><label>Nombre</label><input type="text" placeholder="Juan Pérez" /></div>
                  <div><label>DNI</label><input type="text" placeholder="30.123.456" /></div>
                  <div><label>N° pedido (opcional)</label><input type="text" placeholder="#10452" /></div>
                  <div><label>Motivo</label><select><option>Estado de pedido</option><option>Consulta stock</option><option>Promociones</option><option>Reclamo</option></select></div>
                  <button className="widget-submit" onClick={startWidgetChat}>Iniciar conversación</button>
                </div>
              </div>
            ) : (
              <>
                <div className="widget-body">
                  {widgetMessages.map(msg => (
                    <div key={msg.id} className={`msg ${msg.tipo === 'cliente' ? 'sent' : 'received'} ${msg.tipo === 'bot' ? 'bot' : ''}`} style={{marginBottom: '12px'}}>
                      <div className="msg-bubble">{msg.texto}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding: '10px 12px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: '8px'}}>
                  <input type="text" value={widgetInput} onChange={e => setWidgetInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendWidgetMessage()} placeholder="Escribí tu mensaje..." style={{flex: 1, padding: '8px 12px', border: '1px solid var(--gray-200)', borderRadius: '20px', fontSize: '12px', outline: 'none'}} />
                  <button onClick={sendWidgetMessage} style={{width: 34, height: 34, borderRadius: '50%', background: 'var(--primary-500)', color: 'white', border: 'none', cursor: 'pointer'}}>➤</button>
                </div>
              </>
            )}
            <div className="widget-footer">Powered by Nexo Web Chat</div>
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
