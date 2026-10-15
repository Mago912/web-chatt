import { useState, useRef, useEffect } from 'react';
import './index.css';

// ==========================================
// TIPOS
// ==========================================
type View = 'dashboard' | 'chat' | 'customers' | 'orders' | 'users' | 'escalations' | 'knowledge' | 'quick-replies' | 'metrics' | 'quality';
type MsgType = 'cliente' | 'agente' | 'sistema' | 'bot';
type Theme = 'light' | 'dark';

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

interface Cliente {
  id: number;
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
}

interface Orden {
  id: number;
  numero: string;
  clienteId: number;
  clienteNombre: string;
  producto: string;
  monto: number;
  estado: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
}

// ==========================================
// DATA
// ==========================================
const conversacionesIniciales: Conversacion[] = [
  {
    id: 1, cliente: 'María González', avatar: 'MG', color: 'blue', dni: '32.456.789', email: 'maria.gonzalez@gmail.com', tel: '+54 11 5542-8891', clienteDesde: 2021, pedidos: 7, casos: 2,
    pedido: { num: '#10452', producto: 'Smart TV Samsung 50"', monto: 489999, entrega: 'Entrega a domicilio', fecha: '15-17 Ene 2025', estado: 'distributing', estadoLabel: 'En distribución' },
    motivo: 'Pedido · Demora en entrega', estado: 'activo', tiempo: '2m 15s', unread: false,
    ultimoMsg: '¿Me pueden decir dónde está mi pedido?',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado', hora: '14:32', leido: true },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega.', hora: '14:32', leido: true },
      { id: 3, tipo: 'cliente', emisor: 'María González', texto: 'Hola, compré un Smart TV y no me llegó.', hora: '14:33', leido: true },
      { id: 4, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola María! Soy Sofía. Estoy revisando tu pedido.', hora: '14:34', leido: true },
    ]
  },
  {
    id: 2, cliente: 'Carlos Rodríguez', avatar: 'CR', color: 'green', dni: '28.901.234', email: 'c.rodriguez@outlook.com', tel: '+54 11 4421-3356', clienteDesde: 2019, pedidos: 12, casos: 1,
    pedido: { num: '#10389', producto: 'Notebook Lenovo IdeaPad 3', monto: 749999, entrega: 'Retiro sucursal', fecha: '12 Ene 2025', estado: 'preparing', estadoLabel: 'En preparación' },
    motivo: 'Preventa · Consulta de stock', estado: 'esperando', tiempo: '4m 02s', unread: true,
    ultimoMsg: '¿Tienen stock de la notebook?',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado', hora: '14:28', leido: true },
      { id: 2, tipo: 'cliente', emisor: 'Carlos Rodríguez', texto: 'Hola, ¿tienen stock de la notebook?', hora: '14:29', leido: true },
    ]
  },
];

const clientesIniciales: Cliente[] = [
  { id: 1, nombre: 'María González', dni: '32.456.789', email: 'maria.gonzalez@gmail.com', telefono: '+54 11 5542-8891' },
  { id: 2, nombre: 'Carlos Rodríguez', dni: '28.901.234', email: 'c.rodriguez@outlook.com', telefono: '+54 11 4421-3356' },
  { id: 3, nombre: 'Lucía Fernández', dni: '35.678.432', email: 'lucia.fernandez@yahoo.com', telefono: '+54 11 6678-1122' },
];

const ordenesIniciales: Orden[] = [
  { id: 1, numero: '#10452', clienteId: 1, clienteNombre: 'María González', producto: 'Smart TV Samsung 50"', monto: 489999, estado: 'shipping' },
  { id: 2, numero: '#10389', clienteId: 2, clienteNombre: 'Carlos Rodríguez', producto: 'Notebook Lenovo', monto: 749999, estado: 'preparing' },
];

const usuariosIniciales: Usuario[] = [
  { id: 1, nombre: 'Sofía Ríos', email: 'sofia@fravega.com', rol: 'agent', estado: 'available' },
  { id: 2, nombre: 'Martín Pereyra', email: 'martin@fravega.com', rol: 'agent', estado: 'busy' },
  { id: 3, nombre: 'Nicolás Romero', email: 'nicolas@fravega.com', rol: 'supervisor', estado: 'available' },
];

// ==========================================
// APP COMPONENT
// ==========================================
function App() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversaciones, setConversaciones] = useState<Conversacion[]>(conversacionesIniciales);
  const [selectedChatId, setSelectedChatId] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [theme, setTheme] = useState<Theme>('light');
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [ordenes, setOrdenes] = useState<Orden[]>(ordenesIniciales);
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [notification, setNotification] = useState<string | null>(null);

  const selectedChat = conversaciones.find(c => c.id === selectedChatId) || conversaciones[0];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // ==========================================
  // RENDER VIEWS
  // ==========================================
  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'chat': return <ChatView />;
      case 'customers': return <CustomersView />;
      case 'orders': return <OrdersView />;
      case 'users': return <UsersView />;
      case 'escalations': return <EscalationsView />;
      case 'knowledge': return <KnowledgeView />;
      case 'quick-replies': return <QuickRepliesView />;
      case 'metrics': return <MetricsView />;
      case 'quality': return <QualityView />;
      default: return <DashboardView />;
    }
  };

  // ==========================================
  // DASHBOARD VIEW
  // ==========================================
  function DashboardView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <h1>Dashboard</h1>
          <p>Resumen en tiempo real</p>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon blue">💬</div>
            <div className="kpi-content">
              <div className="kpi-value">{conversaciones.filter(c => c.estado === 'activo').length}</div>
              <div className="kpi-label">Chats Activos</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon orange">⏳</div>
            <div className="kpi-content">
              <div className="kpi-value">{conversaciones.filter(c => c.estado === 'esperando').length}</div>
              <div className="kpi-label">En Espera</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon green">✅</div>
            <div className="kpi-content">
              <div className="kpi-value">{conversaciones.filter(c => c.estado === 'resuelto').length}</div>
              <div className="kpi-label">Resueltos</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon purple">⭐</div>
            <div className="kpi-content">
              <div className="kpi-value">4.7</div>
              <div className="kpi-label">Satisfacción</div>
            </div>
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
      <div className="chat-layout">
        <div className="chat-queue">
          <div className="queue-header">
            <h2>Conversaciones</h2>
            <span className="queue-count">{conversaciones.length}</span>
          </div>
          <div className="queue-list">
            {conversaciones.map(chat => (
              <div
                key={chat.id}
                className={`queue-item ${selectedChatId === chat.id ? 'active' : ''}`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <div className={`queue-avatar ${chat.color}`}>{chat.avatar}</div>
                <div className="queue-info">
                  <div className="queue-name">{chat.cliente}</div>
                  <div className="queue-message">{chat.ultimoMsg}</div>
                </div>
                <div className={`queue-status ${chat.estado}`}></div>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-main">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className={`chat-avatar ${selectedChat.color}`}>{selectedChat.avatar}</div>
                  <div>
                    <h3>{selectedChat.cliente}</h3>
                    <p>{selectedChat.motivo}</p>
                  </div>
                </div>
                <div className="chat-actions">
                  <span className={`status-badge ${selectedChat.estado}`}>{selectedChat.estado}</span>
                </div>
              </div>
              <div className="chat-messages">
                {selectedChat.mensajes.map(msg => (
                  <div key={msg.id} className={`message ${msg.tipo}`}>
                    <div className="message-bubble">{msg.texto}</div>
                    <div className="message-time">{msg.hora}</div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && messageInput.trim()) {
                      const newMsg: Mensaje = {
                        id: Date.now(),
                        tipo: 'agente',
                        emisor: 'Sofía Ríos',
                        texto: messageInput,
                        hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                        leido: false
                      };
                      setConversaciones(prev => prev.map(c =>
                        c.id === selectedChatId
                          ? { ...c, mensajes: [...c.mensajes, newMsg], ultimoMsg: messageInput }
                          : c
                      ));
                      setMessageInput('');
                    }
                  }}
                />
                <button onClick={() => {
                  if (messageInput.trim()) {
                    const newMsg: Mensaje = {
                      id: Date.now(),
                      tipo: 'agente',
                      emisor: 'Sofía Ríos',
                      texto: messageInput,
                      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                      leido: false
                    };
                    setConversaciones(prev => prev.map(c =>
                      c.id === selectedChatId
                        ? { ...c, mensajes: [...c.mensajes, newMsg], ultimoMsg: messageInput }
                        : c
                    ));
                    setMessageInput('');
                  }
                }}>
                  ➤
                </button>
              </div>
            </>
          ) : (
            <div className="chat-empty">
              <p>Selecciona una conversación</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // CUSTOMERS VIEW
  // ==========================================
  function CustomersView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <h1>Clientes</h1>
          <button className="btn-primary" onClick={() => showNotification('Función en desarrollo')}>+ Nuevo Cliente</button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.dni}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>
                    <button className="btn-icon" onClick={() => showNotification('Editar cliente')}>✏️</button>
                    <button className="btn-icon" onClick={() => showNotification('Eliminar cliente')}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ==========================================
  // ORDERS VIEW
  // ==========================================
  function OrdersView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <h1>Pedidos</h1>
          <button className="btn-primary" onClick={() => showNotification('Función en desarrollo')}>+ Nuevo Pedido</button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map(orden => (
                <tr key={orden.id}>
                  <td>{orden.numero}</td>
                  <td>{orden.clienteNombre}</td>
                  <td>{orden.producto}</td>
                  <td>${orden.monto.toLocaleString()}</td>
                  <td><span className={`status-badge ${orden.estado}`}>{orden.estado}</span></td>
                  <td>
                    <button className="btn-icon" onClick={() => showNotification('Editar pedido')}>✏️</button>
                    <button className="btn-icon" onClick={() => showNotification('Eliminar pedido')}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ==========================================
  // USERS VIEW
  // ==========================================
  function UsersView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <h1>Usuarios</h1>
          <button className="btn-primary" onClick={() => showNotification('Función en desarrollo')}>+ Nuevo Usuario</button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td><span className="role-badge">{usuario.rol}</span></td>
                  <td><span className={`status-badge ${usuario.estado}`}>{usuario.estado}</span></td>
                  <td>
                    <button className="btn-icon" onClick={() => showNotification('Editar usuario')}>✏️</button>
                    <button className="btn-icon" onClick={() => showNotification('Eliminar usuario')}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ==========================================
  // OTHER VIEWS
  // ==========================================
  function EscalationsView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <h1>Escalaciones</h1>
        </div>
        <div className="empty-state">
          <p>📋 No hay escalaciones activas</p>
        </div>
      </div>
    );
  }

  function KnowledgeView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <h1>Base de Conocimiento</h1>
        </div>
        <div className="empty-state">
          <p>📚 Base de conocimiento en desarrollo</p>
        </div>
      </div>
    );
  }

  function QuickRepliesView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <h1>Respuestas Rápidas</h1>
        </div>
        <div className="empty-state">
          <p>⚡ Respuestas rápidas en desarrollo</p>
        </div>
      </div>
    );
  }

  function MetricsView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <h1>Métricas</h1>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-content">
              <div className="kpi-value">78%</div>
              <div className="kpi-label">FCR</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-content">
              <div className="kpi-value">4.7</div>
              <div className="kpi-label">CSAT</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-content">
              <div className="kpi-value">1m 42s</div>
              <div className="kpi-label">TMR</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-content">
              <div className="kpi-value">8m 32s</div>
              <div className="kpi-label">AHT</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function QualityView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <h1>Calidad</h1>
        </div>
        <div className="empty-state">
          <p>✅ Evaluaciones de calidad en desarrollo</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">N</div>
            {!sidebarCollapsed && (
              <div className="brand-text">
                <h1>Nexo Web Chat</h1>
                <p>Frávega</p>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>
            <span className="nav-icon">📊</span>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>
          <button className={`nav-item ${currentView === 'chat' ? 'active' : ''}`} onClick={() => setCurrentView('chat')}>
            <span className="nav-icon">💬</span>
            {!sidebarCollapsed && <span>Chats</span>}
            {conversaciones.filter(c => c.unread).length > 0 && !sidebarCollapsed && (
              <span className="nav-badge">{conversaciones.filter(c => c.unread).length}</span>
            )}
          </button>
          <button className={`nav-item ${currentView === 'customers' ? 'active' : ''}`} onClick={() => setCurrentView('customers')}>
            <span className="nav-icon">👥</span>
            {!sidebarCollapsed && <span>Clientes</span>}
          </button>
          <button className={`nav-item ${currentView === 'orders' ? 'active' : ''}`} onClick={() => setCurrentView('orders')}>
            <span className="nav-icon">📦</span>
            {!sidebarCollapsed && <span>Pedidos</span>}
          </button>
          <button className={`nav-item ${currentView === 'users' ? 'active' : ''}`} onClick={() => setCurrentView('users')}>
            <span className="nav-icon">👤</span>
            {!sidebarCollapsed && <span>Usuarios</span>}
          </button>
          <button className={`nav-item ${currentView === 'escalations' ? 'active' : ''}`} onClick={() => setCurrentView('escalations')}>
            <span className="nav-icon">📋</span>
            {!sidebarCollapsed && <span>Escalaciones</span>}
          </button>
          <button className={`nav-item ${currentView === 'knowledge' ? 'active' : ''}`} onClick={() => setCurrentView('knowledge')}>
            <span className="nav-icon">📚</span>
            {!sidebarCollapsed && <span>Conocimiento</span>}
          </button>
          <button className={`nav-item ${currentView === 'quick-replies' ? 'active' : ''}`} onClick={() => setCurrentView('quick-replies')}>
            <span className="nav-icon">⚡</span>
            {!sidebarCollapsed && <span>Rápidas</span>}
          </button>
          <button className={`nav-item ${currentView === 'metrics' ? 'active' : ''}`} onClick={() => setCurrentView('metrics')}>
            <span className="nav-icon">📈</span>
            {!sidebarCollapsed && <span>Métricas</span>}
          </button>
          <button className={`nav-item ${currentView === 'quality' ? 'active' : ''}`} onClick={() => setCurrentView('quality')}>
            <span className="nav-icon">✅</span>
            {!sidebarCollapsed && <span>Calidad</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
            {!sidebarCollapsed && <span>{theme === 'light' ? 'Oscuro' : 'Claro'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
