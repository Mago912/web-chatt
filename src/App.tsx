import { useState, useRef, useEffect } from 'react';
import './index.css';

// ==========================================
// TIPOS
// ==========================================
type View = 'dashboard' | 'chat' | 'customers' | 'orders' | 'users' | 'escalations' | 'knowledge' | 'quick-replies' | 'metrics' | 'quality' | 'organigrama';
type MsgType = 'cliente' | 'agente' | 'sistema' | 'bot';

interface Mensaje {
  id: number;
  tipo: MsgType;
  emisor?: string;
  texto: string;
  hora: string;
  leido?: boolean;
}

interface Pedido {
  num: string;
  producto: string;
  monto: number;
  entrega: string;
  fecha: string;
  estado: string;
  estadoLabel: string;
}

interface Conversacion {
  id: number;
  cliente: string;
  avatar: string;
  color: string;
  dni: string;
  email: string;
  tel: string;
  clienteDesde: number;
  pedidos: number;
  casos: number;
  pedido: Pedido | null;
  motivo: string;
  estado: 'esperando' | 'activo' | 'resuelto';
  tiempo: string;
  unread: boolean;
  ultimoMsg: string;
  mensajes: Mensaje[];
  clienteEscribiendo?: boolean;
}

// ==========================================
// RESPUESTAS AUTOMÁTICAS DEL CLIENTE
// ==========================================
const respuestasCliente: Record<string, string[]> = {
  'Pedido · Demora en entrega': [
    '¿Y cuánto tiempo más va a demorar?',
    'Necesito el TV para el finde, ¿pueden acelerar el envío?',
    '¿Me pueden dar un número de seguimiento?',
    'Estoy muy preocupado/a, ya pasó la fecha.',
  ],
  'Preventa · Consulta de stock': [
    '¿Y cuál es el precio final con las promos?',
    '¿Aceptan tarjeta de crédito en cuotas?',
    '¿Tienen en color negro?',
    'Perfecto, voy a comprarlo ahora.',
  ],
  'Preventa · Promociones bancarias': [
    '¿Y con qué banco tengo más cuotas?',
    '¿Aceptan Mercado Pago?',
    '¿Hay algún descuento pagando en efectivo?',
    'Gracias, voy a consultar con mi banco.',
  ],
  'Postventa · Producto dañado': [
    '¿Y cuánto tarda el cambio?',
    '¿Tengo que pagar algo por el envío?',
    '¿Me pueden dar un número de reclamo?',
    'Necesito una solución urgente, es para mi casa.',
  ],
  'Postventa · Instalación pendiente': [
    '¿En qué horario pasa el técnico?',
    '¿Tengo que estar en casa sí o sí?',
    '¿La instalación tiene costo adicional?',
    'Ok, quedo atenta al SMS.',
  ],
  default: [
    'Ok, gracias por la información.',
    '¿Y eso cuánto tarda?',
    'Perfecto, entendido.',
    '¿Algo más que necesite saber?',
    'Muchas gracias por tu ayuda.',
  ]
};

// ==========================================
// DATA INICIAL
// ==========================================
const conversacionesIniciales: Conversacion[] = [
  {
    id: 1, cliente: 'María González', avatar: 'MG', color: 'blue', dni: '32.456.789', email: 'maria.gonzalez@gmail.com', tel: '+54 11 5542-8891', clienteDesde: 2021, pedidos: 7, casos: 2,
    pedido: { num: '#10452', producto: 'Smart TV Samsung 50" UHD 4K', monto: 489999, entrega: 'Entrega a domicilio', fecha: '15-17 Ene 2025', estado: 'distributing', estadoLabel: 'En distribución' },
    motivo: 'Pedido · Demora en entrega', estado: 'activo', tiempo: '2m 15s', unread: false,
    ultimoMsg: '¿Me pueden decir dónde está mi pedido?',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:32', leido: true },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte?', hora: '14:32', leido: true },
      { id: 3, tipo: 'cliente', emisor: 'María González', texto: 'Hola, compré un Smart TV y no me llegó. Ya pasó la fecha de entrega.', hora: '14:33', leido: true },
      { id: 4, tipo: 'sistema', texto: '⚡ Transferido a agente: Sofía Ríos', hora: '14:34', leido: true },
      { id: 5, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola María! Soy Sofía. Estoy revisando tu pedido ahora mismo.', hora: '14:34', leido: true },
      { id: 6, tipo: 'cliente', emisor: 'María González', texto: 'Sí, es el #10452. Es el Smart TV Samsung de 50 pulgadas.', hora: '14:35', leido: true },
      { id: 7, tipo: 'agente', emisor: 'Sofía Ríos', texto: 'Perfecto, ya lo ubiqué. Veo que está "En distribución". Déjame consultar con el centro logístico.', hora: '14:36', leido: true },
    ]
  },
  {
    id: 2, cliente: 'Carlos Rodríguez', avatar: 'CR', color: 'green', dni: '28.901.234', email: 'c.rodriguez@outlook.com', tel: '+54 11 4421-3356', clienteDesde: 2019, pedidos: 12, casos: 1,
    pedido: { num: '#10389', producto: 'Notebook Lenovo IdeaPad 3 15"', monto: 749999, entrega: 'Retiro sucursal Caballito', fecha: '12 Ene 2025', estado: 'preparing', estadoLabel: 'En preparación' },
    motivo: 'Preventa · Consulta de stock', estado: 'esperando', tiempo: '4m 02s', unread: true,
    ultimoMsg: 'Buenas, quiero saber si tienen la notebook en Caballito.',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:28', leido: true },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 ¿En qué puedo ayudarte?', hora: '14:28', leido: true },
      { id: 3, tipo: 'cliente', emisor: 'Carlos Rodríguez', texto: 'Hola, quiero comprar la notebook Lenovo IdeaPad 3 pero necesito retirarla hoy de Caballito. ¿Tienen stock?', hora: '14:29', leido: true },
    ]
  },
  {
    id: 3, cliente: 'Lucía Fernández', avatar: 'LF', color: 'purple', dni: '35.678.432', email: 'lucia.fernandez@yahoo.com', tel: '+54 11 6678-1122', clienteDesde: 2023, pedidos: 3, casos: 0,
    pedido: null, motivo: 'Preventa · Promociones bancarias', estado: 'esperando', tiempo: '1m 48s', unread: true,
    ultimoMsg: '¿Qué promos hay con tarjeta de crédito?',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:30', leido: true },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 ¿En qué puedo ayudarte?', hora: '14:30', leido: true },
      { id: 3, tipo: 'cliente', emisor: 'Lucía Fernández', texto: '¿Qué promos hay con tarjeta de crédito? Busco un aire acondicionado.', hora: '14:31', leido: true },
    ]
  },
  {
    id: 4, cliente: 'Roberto Martínez', avatar: 'RM', color: 'orange', dni: '24.112.567', email: 'r.martinez@gmail.com', tel: '+54 11 3345-7788', clienteDesde: 2020, pedidos: 9, casos: 3,
    pedido: { num: '#10445', producto: 'Lavarropas Drean Next 8.15', monto: 599999, entrega: 'Entrega a domicilio', fecha: '14 Ene 2025', estado: 'delayed', estadoLabel: 'Demorado' },
    motivo: 'Postventa · Producto dañado', estado: 'activo', tiempo: '0m 45s', unread: false,
    ultimoMsg: 'La caja llegó toda abollada.',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:20', leido: true },
      { id: 2, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Me llegó el lavarropas pero está dañado. La caja vino golpeada.', hora: '14:21', leido: true },
      { id: 3, tipo: 'sistema', texto: '⚡ Transferido a agente: Martín Pereyra', hora: '14:22', leido: true },
      { id: 4, tipo: 'agente', emisor: 'Martín Pereyra', texto: 'Roberto, lamento lo sucedido. ¿Confirmás tu N° de pedido?', hora: '14:22', leido: true },
      { id: 5, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Es el #10445', hora: '14:23', leido: true },
    ]
  },
  {
    id: 5, cliente: 'Ana López', avatar: 'AL', color: 'pink', dni: '30.234.890', email: 'ana.lopez@hotmail.com', tel: '+54 11 5567-9900', clienteDesde: 2022, pedidos: 5, casos: 1,
    pedido: { num: '#10298', producto: 'Aire Acond. Samsung WindFree', monto: 899999, entrega: 'Entrega + Instalación', fecha: '10 Ene 2025', estado: 'delivered', estadoLabel: 'Entregado' },
    motivo: 'Postventa · Instalación pendiente', estado: 'resuelto', tiempo: '-', unread: false,
    ultimoMsg: '¡Muchas gracias!',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado', hora: '13:45', leido: true },
      { id: 2, tipo: 'cliente', emisor: 'Ana López', texto: 'Hola, me entregaron el aire pero no vino el técnico.', hora: '13:46', leido: true },
      { id: 3, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola Ana! Voy a reagendar la instalación.', hora: '13:47', leido: true },
      { id: 4, tipo: 'sistema', texto: '✅ Caso resuelto · CSAT: 5/5 ⭐', hora: '13:52', leido: true },
    ]
  },
];

const respuestasRapidas = [
  { id: 1, atajo: '/saludo', titulo: 'Saludo inicial', contenido: '¡Hola! 👋 Soy Sofía, asesora de Frávega. Estoy revisando tu consulta. ¿Podrías confirmarme tu número de pedido?', categoria: 'Saludo' },
  { id: 2, atajo: '/estado', titulo: 'Consulta estado pedido', contenido: 'Estoy consultando el estado de tu pedido en nuestro sistema logístico. Te pido un momento.', categoria: 'Pedido' },
  { id: 3, atajo: '/demora', titulo: 'Demora en entrega', contenido: 'Comprendo tu frustración. Voy a escalar tu caso al área de logística para priorizar tu entrega.', categoria: 'Envíos' },
  { id: 4, atajo: '/retiro', titulo: 'Retiro por tercero', contenido: 'Para retiro por tercero necesitás:\n• Autorización firmada\n• Copia DNI del titular\n• Código de compra\n• DNI original', categoria: 'Retiro' },
  { id: 5, atajo: '/promos', titulo: 'Promociones bancarias', contenido: 'Promociones vigentes:\n🏦 Santander: 3, 6 y 12 cuotas SI\n🏦 Galicia: 3 y 6 SI + 10%\n🏦 BBVA: 12 y 18 SI', categoria: 'Pagos' },
  { id: 6, atajo: '/cierre', titulo: 'Cierre de chat', contenido: '¡Fue un placer atenderte! 😊 Si tenés otra consulta, no dudes en contactarnos. ¡Excelente día!', categoria: 'Despedida' },
];

// ==========================================
// APP COMPONENT
// ==========================================
function App() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [conversaciones, setConversaciones] = useState<Conversacion[]>(conversacionesIniciales);
  const [selectedChatId, setSelectedChatId] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [chatFilter, setChatFilter] = useState<string>('todos');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoReplyTimeoutRef = useRef<number | null>(null);

  const selectedChat = conversaciones.find(c => c.id === selectedChatId) || conversaciones[0];

  // Auto-scroll al final del chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.mensajes.length, selectedChat?.clienteEscribiendo]);

  // Notificación temporal
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // ==========================================
  // ENVIAR MENSAJE DEL AGENTE
  // ==========================================
  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const newMsg: Mensaje = {
      id: Date.now(),
      tipo: 'agente',
      emisor: 'Sofía Ríos',
      texto: messageInput,
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      leido: false
    };

    // Actualizar conversación con el nuevo mensaje
    setConversaciones(prev => prev.map(c => 
      c.id === selectedChatId 
        ? { ...c, mensajes: [...c.mensajes, newMsg], ultimoMsg: messageInput, estado: 'activo' as const }
        : c
    ));
    setMessageInput('');
    setShowQR(false);

    // Simular que el cliente lee el mensaje después de 2 segundos
    setTimeout(() => {
      setConversaciones(prev => prev.map(c => 
        c.id === selectedChatId 
          ? { ...c, mensajes: c.mensajes.map(m => m.id === newMsg.id ? { ...m, leido: true } : m) }
          : c
      ));
    }, 2000);

    // Simular respuesta automática del cliente después de 3-6 segundos
    if (selectedChat.estado !== 'resuelto') {
      const delay = 3000 + Math.random() * 3000;
      
      // Mostrar indicador de "escribiendo"
      setTimeout(() => {
        setConversaciones(prev => prev.map(c => 
          c.id === selectedChatId ? { ...c, clienteEscribiendo: true } : c
        ));
      }, delay - 1500);

      autoReplyTimeoutRef.current = window.setTimeout(() => {
        // Obtener respuesta contextual
        const respuestas = respuestasCliente[selectedChat.motivo] || respuestasCliente.default;
        const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
        
        const clientMsg: Mensaje = {
          id: Date.now(),
          tipo: 'cliente',
          emisor: selectedChat.cliente,
          texto: respuestaAleatoria,
          hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
          leido: true
        };

        setConversaciones(prev => prev.map(c => 
          c.id === selectedChatId 
            ? { ...c, mensajes: [...c.mensajes, clientMsg], ultimoMsg: respuestaAleatoria, clienteEscribiendo: false }
            : c
        ));
      }, delay);
    }
  };

  // ==========================================
  // TOMAR CHAT
  // ==========================================
  const takeChat = (id: number) => {
    setConversaciones(prev => prev.map(c => 
      c.id === id ? { ...c, estado: 'activo' as const, unread: false, tiempo: '0m 00s' } : c
    ));
    showNotification('✅ Chat tomado correctamente');
  };

  // ==========================================
  // RESOLVER CHAT
  // ==========================================
  const resolveChat = () => {
    const systemMsg: Mensaje = {
      id: Date.now(),
      tipo: 'sistema',
      texto: '✅ Conversación resuelta · CSAT: 5/5 ⭐',
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      leido: true
    };

    setConversaciones(prev => prev.map(c => 
      c.id === selectedChatId 
        ? { ...c, estado: 'resuelto' as const, mensajes: [...c.mensajes, systemMsg], clienteEscribiendo: false }
        : c
    ));
    showNotification('✅ Chat resuelto');
  };

  // ==========================================
  // ELIMINAR CHAT
  // ==========================================
  const deleteChat = (id: number) => {
    setConversaciones(prev => prev.filter(c => c.id !== id));
    setShowDeleteConfirm(null);
    
    // Si eliminamos el chat seleccionado, ir al primero disponible
    if (id === selectedChatId) {
      const remaining = conversaciones.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setSelectedChatId(remaining[0].id);
      }
    }
    showNotification('🗑️ Chat eliminado');
  };

  // ==========================================
  // INSERTAR RESPUESTA RÁPIDA
  // ==========================================
  const insertQR = (content: string) => {
    setMessageInput(content);
    setShowQR(false);
  };

  // ==========================================
  // LIMPIAR TIMEOUT AL DESMONTAR
  // ==========================================
  useEffect(() => {
    return () => {
      if (autoReplyTimeoutRef.current) {
        clearTimeout(autoReplyTimeoutRef.current);
      }
    };
  }, []);

  // Filtrar chats
  const filteredChats = conversaciones.filter(c => {
    if (chatFilter === 'todos') return true;
    if (chatFilter === 'esperando') return c.estado === 'esperando';
    if (chatFilter === 'activos') return c.estado === 'activo';
    if (chatFilter === 'resueltos') return c.estado === 'resuelto';
    return true;
  });

  const getEstadoBadge = (estado: string) => {
    const map: Record<string, string> = { esperando: 'waiting', activo: 'active', resuelto: 'closed' };
    return map[estado] || 'closed';
  };

  const getEstadoLabel = (estado: string) => {
    const map: Record<string, string> = { esperando: 'Esperando', activo: 'En atención', resuelto: 'Resuelto' };
    return map[estado] || estado;
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="app">
      {/* Notification Toast */}
      {notification && (
        <div className="toast-notification">
          {notification}
        </div>
      )}

      {/* Sidebar */}
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
              {conversaciones.filter(c => c.unread).length > 0 && <span className="nav-badge">{conversaciones.filter(c => c.unread).length}</span>}
            </button>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Gestión</div>
            <button className={`nav-item ${currentView === 'escalations' ? 'active' : ''}`} onClick={() => setCurrentView('escalations')}>
              <span className="nav-icon">📋</span><span>Escalaciones</span>
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
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="stat">💬 Chats activos: {conversaciones.filter(c => c.estado === 'activo').length}</div>
          <div className="stat">⏳ En espera: {conversaciones.filter(c => c.estado === 'esperando').length}</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">Bandeja de Chats</div>
            <div className="topbar-breadcrumb">Atención Digital / <span>Conversaciones</span></div>
          </div>
          <div className="topbar-right">
            <div className="live-indicator">
              <span className="live-dot"></span>
              <span>En vivo</span>
            </div>
          </div>
        </div>

        {/* Chat Layout */}
        <div className="chat-view">
          {/* Panel 1: Queue */}
          <div className="panel-queue">
            <div className="panel-queue-header">
              <h2>Conversaciones</h2>
              <p>{conversaciones.length} en total</p>
            </div>
            <div className="queue-filters">
              {['todos', 'esperando', 'activos', 'resueltos'].map(f => (
                <button key={f} className={`queue-filter ${chatFilter === f ? 'active' : ''}`} onClick={() => setChatFilter(f)}>
                  {f === 'todos' ? 'Todos' : f === 'esperando' ? 'Esperando' : f === 'activos' ? 'Activos' : 'Resueltos'}
                </button>
              ))}
            </div>
            <div className="queue-list">
              {filteredChats.length === 0 ? (
                <div className="empty-queue">
                  <p>🎉 No hay conversaciones</p>
                </div>
              ) : (
                filteredChats.map(chat => (
                  <div key={chat.id} className={`queue-item-wrapper ${selectedChatId === chat.id ? 'active' : ''}`}>
                    <button className={`queue-item ${chat.unread ? 'unread' : ''}`} onClick={() => { setSelectedChatId(chat.id); if (chat.unread) { setConversaciones(prev => prev.map(c => c.id === chat.id ? { ...c, unread: false } : c)); } }}>
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
                    <button className="queue-delete-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(chat.id); }} title="Eliminar chat">
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel 2: Chat Room */}
          {selectedChat ? (
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
                    <button className="chat-action-btn primary" onClick={() => takeChat(selectedChat.id)}>✋ Tomar</button>
                  )}
                  {selectedChat.estado === 'activo' && (
                    <button className="chat-action-btn success" onClick={resolveChat}>✓ Resolver</button>
                  )}
                  <button className="chat-action-btn danger" onClick={() => setShowDeleteConfirm(selectedChat.id)} title="Eliminar chat">🗑️</button>
                </div>
              </div>

              <div className="chat-messages">
                {selectedChat.mensajes.map(msg => (
                  <div key={msg.id} className={`msg ${msg.tipo === 'agente' ? 'sent' : msg.tipo === 'sistema' ? 'system' : 'received'} ${msg.tipo === 'bot' ? 'bot' : ''}`}>
                    {msg.tipo !== 'sistema' && (
                      <div className="msg-header">
                        <span className="msg-sender">{msg.emisor}</span>
                        <span className="msg-time">{msg.hora}</span>
                        {msg.tipo === 'agente' && (
                          <span className="msg-status">{msg.leido ? '✓✓' : '✓'}</span>
                        )}
                      </div>
                    )}
                    <div className="msg-bubble">{msg.texto}</div>
                  </div>
                ))}
                {/* Typing indicator */}
                {selectedChat.clienteEscribiendo && (
                  <div className="msg received">
                    <div className="msg-header">
                      <span className="msg-sender">{selectedChat.cliente}</span>
                      <span className="msg-time" style={{ fontStyle: 'italic' }}>escribiendo...</span>
                    </div>
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
                  <button className={`toolbar-btn ${showQR ? 'active' : ''}`} onClick={() => setShowQR(!showQR)}>⚡ Respuestas rápidas</button>
                  <button className="toolbar-btn" disabled>📎 Adjuntar</button>
                  {selectedChat.estado === 'resuelto' && (
                    <span className="chat-closed-notice">💬 Chat resuelto - No se pueden enviar mensajes</span>
                  )}
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
                  <textarea 
                    className="chat-textarea" 
                    placeholder={selectedChat.estado === 'resuelto' ? 'Chat resuelto' : 'Escribí tu respuesta...'} 
                    value={messageInput} 
                    onChange={e => setMessageInput(e.target.value)} 
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (selectedChat.estado !== 'resuelto') sendMessage(); } }}
                    disabled={selectedChat.estado === 'resuelto'}
                    rows={1}
                  ></textarea>
                  <button className="send-btn" onClick={sendMessage} disabled={!messageInput.trim() || selectedChat.estado === 'resuelto'}>➤</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="panel-chat empty-chat">
              <div className="empty-state">
                <p>💬 Seleccioná un chat para comenzar</p>
              </div>
            </div>
          )}

          {/* Panel 3: Context */}
          {selectedChat && (
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
              <div className="context-section">
                <div className="context-section-title">Información del Sistema</div>
                <div className="system-info">
                  <div className="info-row">
                    <span className="info-label">Estado:</span>
                    <span className={`status-badge ${getEstadoBadge(selectedChat.estado)}`}>{getEstadoLabel(selectedChat.estado)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mensajes:</span>
                    <span>{selectedChat.mensajes.length}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Inicio:</span>
                    <span>{selectedChat.mensajes[0]?.hora}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🗑️ Eliminar conversación</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar esta conversación?</p>
              <p className="text-muted">Esta acción eliminará todos los mensajes y no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => deleteChat(showDeleteConfirm)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
