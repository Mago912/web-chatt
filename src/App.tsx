import { useState } from 'react';
import './index.css';

function App() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Resumen', icon: '📋' },
    { id: 'structure', label: 'Estructura', icon: '📁' },
    { id: 'database', label: 'Base de Datos', icon: '🗄️' },
    { id: 'api', label: 'API Endpoints', icon: '🔌' },
    { id: 'auth', label: 'Autenticación', icon: '🔐' },
    { id: 'permissions', label: 'Permisos', icon: '👥' },
    { id: 'realtime', label: 'Tiempo Real', icon: '🔄' },
    { id: 'design', label: 'Diseño', icon: '🎨' },
    { id: 'responsive', label: 'Responsive', icon: '📱' },
    { id: 'flow', label: 'Flujo Principal', icon: '⚡' },
  ];

  return (
    <div className="arch-app">
      {/* Header */}
      <header className="arch-header">
        <div className="arch-header-content">
          <div className="arch-logo">
            <span className="arch-logo-icon">N</span>
            <div>
              <h1>Nexo Web Chat</h1>
              <p>Sistema de Atención Web/Chat · Frávega</p>
            </div>
          </div>
          <div className="arch-stage-badge">
            <span className="stage-number">ETAPA 1</span>
            <span className="stage-label">ARQUITECTURA</span>
          </div>
        </div>
      </header>

      <div className="arch-layout">
        {/* Sidebar Navigation */}
        <nav className="arch-nav">
          {sections.map(s => (
            <button
              key={s.id}
              className={`arch-nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="nav-icon">{s.icon}</span>
              <span className="nav-label">{s.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="arch-main">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'structure' && <StructureSection />}
          {activeSection === 'database' && <DatabaseSection />}
          {activeSection === 'api' && <APISection />}
          {activeSection === 'auth' && <AuthSection />}
          {activeSection === 'permissions' && <PermissionsSection />}
          {activeSection === 'realtime' && <RealtimeSection />}
          {activeSection === 'design' && <DesignSection />}
          {activeSection === 'responsive' && <ResponsiveSection />}
          {activeSection === 'flow' && <FlowSection />}
        </main>
      </div>

      {/* Footer */}
      <footer className="arch-footer">
        <p>Nexo Web Chat · Etapa 1 — Arquitectura · Esperando aprobación para continuar</p>
      </footer>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="section">
      <h2>📋 Resumen del Proyecto</h2>
      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-icon">🎯</div>
          <h3>Objetivo</h3>
          <p>Plataforma de atención al cliente mediante chat web que permite iniciar conversaciones, atenderlas en tiempo real, consultar datos del cliente/pedido y gestionar escalaciones.</p>
        </div>
        <div className="overview-card">
          <div className="overview-card-icon">🖥️</div>
          <h3>2 Interfaces</h3>
          <ul>
            <li><strong>Widget Cliente:</strong> Chat flotante en tienda online</li>
            <li><strong>Consola Operador:</strong> CRM/Help Desk con 3 paneles</li>
          </ul>
        </div>
        <div className="overview-card">
          <div className="overview-card-icon">👥</div>
          <h3>3 Roles</h3>
          <ul>
            <li><strong>Admin:</strong> Gestión total del sistema</li>
            <li><strong>Supervisor:</strong> Métricas, calidad, escalaciones</li>
            <li><strong>Agente:</strong> Atención de conversaciones</li>
          </ul>
        </div>
        <div className="overview-card">
          <div className="overview-card-icon">⚙️</div>
          <h3>Stack Tecnológico</h3>
          <div className="tech-stack">
            <span className="tech-badge">PHP 8+</span>
            <span className="tech-badge">MySQL 8+</span>
            <span className="tech-badge">HTML5</span>
            <span className="tech-badge">CSS3</span>
            <span className="tech-badge">JS ES6+</span>
            <span className="tech-badge">Fetch API</span>
            <span className="tech-badge">JSON</span>
            <span className="tech-badge">PDO</span>
          </div>
        </div>
      </div>

      <div className="checklist-box">
        <h3>✅ Checklist Etapa 1</h3>
        <div className="checklist-grid">
          {[
            'Análisis de requisitos',
            'Arquitectura propuesta',
            'Estructura de carpetas',
            'Tablas diseñadas',
            'Endpoints definidos',
            'Flujo de autenticación',
            'Permisos por rol',
            'Estrategia tiempo real',
            'Paleta de colores',
            'Estrategia responsive',
          ].map((item, i) => (
            <div key={i} className="checklist-item checked">
              <span className="check-icon">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StructureSection() {
  const folders = [
    { name: '/config', desc: 'Configuración y conexión PDO', files: ['database.php', 'config.php'] },
    { name: '/public', desc: 'Punto de entrada público', files: ['index.php', 'login.php', 'logout.php'] },
    { name: '/assets/css', desc: 'CSS puro modular', files: ['variables.css', 'base.css', 'layout.css', 'components.css', 'chat.css', 'dashboard.css', 'widget.css', 'responsive.css'] },
    { name: '/assets/js', desc: 'JavaScript modular ES6+', files: ['app.js', 'api.js', 'auth.js', 'conversations.js', 'messages.js', 'customers.js', 'orders.js', 'quick-replies.js', 'knowledge.js', 'escalations.js', 'metrics.js', 'dashboard.js', 'widget.js', 'utils.js'] },
    { name: '/api', desc: 'Endpoints REST JSON', files: ['auth.php', 'conversations.php', 'messages.php', 'customers.php', 'orders.php', 'quick_replies.php', 'knowledge_base.php', 'escalations.php', 'metrics.php', 'users.php', 'quality.php'] },
    { name: '/operator', desc: 'Vistas del operador', files: ['dashboard.php', 'conversations.php', 'customers.php', 'orders.php', 'knowledge.php', 'quick_replies.php', 'metrics.php'] },
    { name: '/admin', desc: 'Panel administrativo', files: ['users.php', 'settings.php'] },
    { name: '/includes', desc: 'Componentes compartidos', files: ['auth.php', 'permissions.php', 'csrf.php', 'header.php', 'sidebar.php', 'footer.php'] },
    { name: '/chat', desc: 'Widget del cliente', files: ['widget.php'] },
    { name: '/database', desc: 'Scripts SQL', files: ['schema.sql', 'seed.sql'] },
  ];

  return (
    <div className="section">
      <h2>📁 Estructura de Carpetas</h2>
      <p className="section-desc">Organización modular del proyecto con separación clara de responsabilidades.</p>
      <div className="folder-tree">
        {folders.map((f, i) => (
          <div key={i} className="folder-item">
            <div className="folder-header">
              <i className="folder-icon">📂</i>
              <strong>{f.name}</strong>
              <span className="folder-desc">{f.desc}</span>
            </div>
            <div className="folder-files">
              {f.files.map((file, j) => (
                <span key={j} className="file-tag">{file}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabaseSection() {
  const tables = [
    { name: 'users', desc: 'Agentes, supervisores y administradores', fields: ['id (PK)', 'name', 'email (UQ)', 'password_hash', 'role (ENUM)', 'status (ENUM)', 'created_at', 'updated_at'] },
    { name: 'customers', desc: 'Clientes de Frávega', fields: ['id (PK)', 'name', 'dni (UQ)', 'email', 'phone', 'created_at', 'updated_at'] },
    { name: 'orders', desc: 'Pedidos de clientes', fields: ['id (PK)', 'order_number (UQ)', 'customer_id (FK)', 'product', 'amount', 'payment_method', 'delivery_method', 'estimated_delivery', 'status (ENUM)', 'created_at'] },
    { name: 'conversations', desc: 'Conversaciones de chat', fields: ['id (PK)', 'customer_id (FK)', 'agent_id (FK)', 'order_id (FK)', 'subject', 'reason', 'status (ENUM)', 'priority (ENUM)', 'csat_score', 'started_at', 'closed_at', 'created_at', 'updated_at'] },
    { name: 'messages', desc: 'Mensajes de cada conversación', fields: ['id (PK)', 'conversation_id (FK)', 'sender_type (ENUM)', 'sender_id', 'message (TEXT)', 'created_at', 'read_at'] },
    { name: 'quick_replies', desc: 'Plantillas de respuestas', fields: ['id (PK)', 'title', 'content (TEXT)', 'category', 'active (BOOL)', 'created_at'] },
    { name: 'knowledge_base', desc: 'Artículos de procedimientos', fields: ['id (PK)', 'title', 'content (TEXT)', 'category', 'keywords', 'active (BOOL)', 'created_at', 'updated_at'] },
    { name: 'escalations', desc: 'Casos escalados', fields: ['id (PK)', 'conversation_id (FK)', 'created_by (FK)', 'assigned_to (FK)', 'reason', 'status (ENUM)', 'notes (TEXT)', 'created_at', 'resolved_at'] },
    { name: 'quality_reviews', desc: 'Evaluaciones de calidad', fields: ['id (PK)', 'conversation_id (FK)', 'reviewer_id (FK)', 'score', 'comments (TEXT)', 'created_at'] },
    { name: 'agent_status', desc: 'Estado en tiempo real del agente', fields: ['user_id (PK/FK)', 'status (ENUM)', 'max_chats', 'current_chats', 'updated_at'] },
  ];

  return (
    <div className="section">
      <h2>🗄️ Diseño de Base de Datos</h2>
      <p className="section-desc">10 tablas normalizadas con relaciones, índices y restricciones.</p>

      {/* ER Diagram */}
      <div className="er-diagram">
        <h3>Diagrama Entidad-Relación (simplificado)</h3>
        <div className="er-visual">
          <div className="er-entity highlight">
            <div className="er-entity-header">users</div>
            <div className="er-entity-fields">id, name, email, role, status</div>
          </div>
          <div className="er-connector">→ agent_id</div>
          <div className="er-entity main">
            <div className="er-entity-header">conversations</div>
            <div className="er-entity-fields">id, customer_id, agent_id, order_id, status, priority, csat_score</div>
          </div>
          <div className="er-connector">← customer_id</div>
          <div className="er-entity">
            <div className="er-entity-header">customers</div>
            <div className="er-entity-fields">id, name, dni, email, phone</div>
          </div>
        </div>
        <div className="er-visual" style={{marginTop: '12px'}}>
          <div className="er-entity">
            <div className="er-entity-header">orders</div>
            <div className="er-entity-fields">id, order_number, customer_id, product, amount, status</div>
          </div>
          <div className="er-connector">→ order_id</div>
          <div className="er-entity main">
            <div className="er-entity-header">conversations</div>
            <div className="er-entity-fields">id, customer_id, agent_id, order_id, status, priority</div>
          </div>
          <div className="er-connector">← conversation_id</div>
          <div className="er-entity">
            <div className="er-entity-header">messages</div>
            <div className="er-entity-fields">id, conversation_id, sender_type, message, created_at</div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="tables-grid">
        {tables.map((t, i) => (
          <div key={i} className={`table-card ${t.name === 'conversations' ? 'highlight' : ''}`}>
            <div className="table-card-header">
              <span className="table-name">{t.name}</span>
              <span className="table-count">{t.fields.length} campos</span>
            </div>
            <p className="table-desc">{t.desc}</p>
            <div className="table-fields">
              {t.fields.map((f, j) => (
                <span key={j} className={`field-tag ${f.includes('PK') ? 'pk' : f.includes('FK') ? 'fk' : f.includes('UQ') ? 'uq' : ''}`}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="info-box">
        <strong>📌 Tabla adicional: agent_status</strong>
        <p>Separar el estado en tiempo real del agente de sus datos de usuario permite actualizaciones frecuentes sin afectar la tabla principal. Prepara la arquitectura para escalar.</p>
      </div>
    </div>
  );
}

function APISection() {
  const endpoints = [
    { group: 'Auth', color: '#059669', items: [
      { method: 'POST', path: '/api/auth.php?action=login', desc: 'Iniciar sesión' },
      { method: 'POST', path: '/api/auth.php?action=logout', desc: 'Cerrar sesión' },
      { method: 'GET', path: '/api/auth.php?action=check', desc: 'Verificar sesión' },
    ]},
    { group: 'Conversaciones', color: '#2563eb', items: [
      { method: 'GET', path: '/api/conversations.php?action=list', desc: 'Listar conversaciones' },
      { method: 'GET', path: '/api/conversations.php?action=get&id=X', desc: 'Obtener conversación' },
      { method: 'POST', path: '/api/conversations.php?action=create', desc: 'Crear conversación' },
      { method: 'POST', path: '/api/conversations.php?action=take&id=X', desc: 'Tomar conversación' },
      { method: 'POST', path: '/api/conversations.php?action=close&id=X', desc: 'Cerrar conversación' },
      { method: 'POST', path: '/api/conversations.php?action=hold&id=X', desc: 'Poner en espera' },
      { method: 'POST', path: '/api/conversations.php?action=rate', desc: 'Calificar CSAT' },
    ]},
    { group: 'Mensajes', color: '#7c3aed', items: [
      { method: 'GET', path: '/api/messages.php?conversation_id=X&since=Y', desc: 'Polling mensajes nuevos' },
      { method: 'POST', path: '/api/messages.php', desc: 'Enviar mensaje' },
    ]},
    { group: 'Clientes', color: '#d97706', items: [
      { method: 'GET', path: '/api/customers.php?id=X', desc: 'Datos de un cliente' },
      { method: 'GET', path: '/api/customers.php?action=list', desc: 'Listar clientes' },
    ]},
    { group: 'Pedidos', color: '#dc2626', items: [
      { method: 'GET', path: '/api/orders.php?id=X', desc: 'Datos de un pedido' },
      { method: 'GET', path: '/api/orders.php?customer_id=X', desc: 'Pedidos de un cliente' },
    ]},
    { group: 'Respuestas Rápidas', color: '#0891b2', items: [
      { method: 'GET', path: '/api/quick_replies.php?action=list', desc: 'Listar respuestas' },
      { method: 'GET', path: '/api/quick_replies.php?action=search&q=X', desc: 'Buscar respuestas' },
    ]},
    { group: 'Base de Conocimiento', color: '#4f46e5', items: [
      { method: 'GET', path: '/api/knowledge_base.php?action=list', desc: 'Listar artículos' },
      { method: 'GET', path: '/api/knowledge_base.php?action=search&q=X', desc: 'Buscar artículos' },
    ]},
    { group: 'Escalaciones', color: '#be185d', items: [
      { method: 'GET', path: '/api/escalations.php?action=list', desc: 'Listar escalaciones' },
      { method: 'POST', path: '/api/escalations.php?action=create', desc: 'Crear escalación' },
      { method: 'POST', path: '/api/escalations.php?action=resolve&id=X', desc: 'Resolver escalación' },
    ]},
    { group: 'Métricas', color: '#16a34a', items: [
      { method: 'GET', path: '/api/metrics.php?action=dashboard', desc: 'KPIs del dashboard' },
      { method: 'GET', path: '/api/metrics.php?action=agents', desc: 'Estado de agentes' },
      { method: 'GET', path: '/api/metrics.php?action=detailed', desc: 'Métricas detalladas' },
    ]},
  ];

  return (
    <div className="section">
      <h2>🔌 Endpoints API</h2>
      <p className="section-desc">API RESTful con respuestas JSON consistentes. Todos los endpoints requieren autenticación (excepto widget del cliente).</p>

      <div className="response-format">
        <h3>Formato de Respuesta</h3>
        <div className="code-block">
          <code>{`// Éxito
{
  "success": true,
  "data": { ... },
  "message": "Operación realizada correctamente"
}

// Error
{
  "success": false,
  "data": null,
  "message": "Descripción del error"
}`}</code>
        </div>
      </div>

      <div className="endpoints-list">
        {endpoints.map((group, i) => (
          <div key={i} className="endpoint-group">
            <h3 style={{borderLeftColor: group.color}}>{group.group}</h3>
            <div className="endpoint-items">
              {group.items.map((ep, j) => (
                <div key={j} className="endpoint-item">
                  <span className={`method-badge ${ep.method === 'GET' ? 'get' : 'post'}`}>{ep.method}</span>
                  <code className="endpoint-path">{ep.path}</code>
                  <span className="endpoint-desc">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthSection() {
  return (
    <div className="section">
      <h2>🔐 Flujo de Autenticación</h2>

      <div className="flow-diagram">
        <div className="flow-step">
          <div className="flow-number">1</div>
          <div className="flow-content">
            <h4>Usuario envía credenciales</h4>
            <code>POST /api/auth.php?action=login</code>
            <p>{'{ email, password, csrf_token }'}</p>
          </div>
        </div>
        <div className="flow-arrow">↓</div>
        <div className="flow-step">
          <div className="flow-number">2</div>
          <div className="flow-content">
            <h4>Backend valida</h4>
            <ul>
              <li>Validar token CSRF</li>
              <li>Buscar usuario por email</li>
              <li>password_verify() contra hash</li>
            </ul>
          </div>
        </div>
        <div className="flow-arrow">↓</div>
        <div className="flow-step">
          <div className="flow-number">3</div>
          <div className="flow-content">
            <h4>Crear sesión</h4>
            <ul>
              <li>$_SESSION['user_id'] = ...</li>
              <li>$_SESSION['user_role'] = ...</li>
              <li>Actualizar status a 'disponible'</li>
            </ul>
          </div>
        </div>
        <div className="flow-arrow">↓</div>
        <div className="flow-step">
          <div className="flow-number">4</div>
          <div className="flow-content">
            <h4>Respuesta JSON</h4>
            <code>{'{ success: true, user: { id, name, role } }'}</code>
          </div>
        </div>
      </div>

      <div className="security-box">
        <h3>🛡️ Medidas de Seguridad</h3>
        <div className="security-grid">
          {[
            { icon: '🔒', title: 'PDO + Prepared Statements', desc: 'Protección contra SQL Injection' },
            { icon: '🔑', title: 'password_hash() / password_verify()', desc: 'Contraseñas nunca en texto plano' },
            { icon: '🛡️', title: 'Tokens CSRF', desc: 'Protección en operaciones sensibles' },
            { icon: '🧹', title: 'htmlspecialchars()', desc: 'Escape de output contra XSS' },
            { icon: '🔐', title: 'Sesiones PHP', desc: 'session_regenerate_id() al login' },
            { icon: '🚫', title: 'Error handling', desc: 'Nunca mostrar errores internos al usuario' },
          ].map((item, i) => (
            <div key={i} className="security-item">
              <span className="security-icon">{item.icon}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PermissionsSection() {
  const roles = [
    {
      name: 'Admin',
      color: '#dc2626',
      icon: '👑',
      permissions: ['Gestionar usuarios', 'Gestionar configuración', 'Ver métricas completas', 'Ver todas las conversaciones', 'Gestionar base de conocimiento', 'Gestionar respuestas rápidas', 'Resolver escalaciones']
    },
    {
      name: 'Supervisor',
      color: '#d97706',
      icon: '🎯',
      permissions: ['Ver todas las conversaciones', 'Ver estado de agentes', 'Consultar métricas', 'Consultar calidad', 'Gestionar escalaciones', 'Consultar clientes y pedidos', 'Revisar calidad de chats']
    },
    {
      name: 'Agente',
      color: '#2563eb',
      icon: '💬',
      permissions: ['Atender conversaciones', 'Consultar clientes', 'Consultar pedidos', 'Utilizar respuestas rápidas', 'Consultar base de conocimiento', 'Crear escalaciones', 'Cerrar conversaciones']
    }
  ];

  const matrix = [
    { module: 'Dashboard', admin: true, supervisor: true, agent: true },
    { module: 'Ver todas las conversaciones', admin: true, supervisor: true, agent: false },
    { module: 'Tomar conversación', admin: false, supervisor: false, agent: true },
    { module: 'Responder mensajes', admin: false, supervisor: false, agent: true },
    { module: 'Cerrar conversación', admin: false, supervisor: true, agent: true },
    { module: 'Clientes/Pedidos', admin: true, supervisor: true, agent: true },
    { module: 'KB (lectura)', admin: true, supervisor: true, agent: true },
    { module: 'KB (escritura)', admin: true, supervisor: false, agent: false },
    { module: 'Resp. Rápidas (lectura)', admin: true, supervisor: true, agent: true },
    { module: 'Resp. Rápidas (escritura)', admin: true, supervisor: false, agent: false },
    { module: 'Crear escalaciones', admin: false, supervisor: true, agent: true },
    { module: 'Resolver escalaciones', admin: true, supervisor: true, agent: false },
    { module: 'Métricas', admin: true, supervisor: true, agent: false },
    { module: 'Calidad (revisar)', admin: true, supervisor: true, agent: false },
    { module: 'Usuarios (CRUD)', admin: true, supervisor: false, agent: false },
    { module: 'Configuración', admin: true, supervisor: false, agent: false },
  ];

  return (
    <div className="section">
      <h2>👥 Roles y Permisos</h2>

      <div className="roles-grid">
        {roles.map((role, i) => (
          <div key={i} className="role-card" style={{borderTopColor: role.color}}>
            <div className="role-header">
              <span className="role-icon">{role.icon}</span>
              <h3 style={{color: role.color}}>{role.name}</h3>
            </div>
            <ul className="role-permissions">
              {role.permissions.map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 style={{marginTop: '32px'}}>Matriz de Permisos</h3>
      <div className="matrix-table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Admin</th>
              <th>Supervisor</th>
              <th>Agente</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td>{row.module}</td>
                <td className={row.admin ? 'allowed' : 'denied'}>{row.admin ? '✅' : '❌'}</td>
                <td className={row.supervisor ? 'allowed' : 'denied'}>{row.supervisor ? '✅' : '❌'}</td>
                <td className={row.agent ? 'allowed' : 'denied'}>{row.agent ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RealtimeSection() {
  return (
    <div className="section">
      <h2>🔄 Estrategia de Tiempo Real</h2>

      <div className="phase-box">
        <h3>Fase 1 (Actual): Polling con Fetch API</h3>
        <div className="polling-diagram">
          <div className="polling-client">
            <div className="polling-icon">🖥️</div>
            <p>Frontend JS</p>
          </div>
          <div className="polling-arrow">
            <div className="polling-request">
              <span>GET /api/messages.php</span>
              <span>?conversation_id=X&since=Y</span>
            </div>
            <div className="polling-interval">⏱️ Cada 3 segundos</div>
            <div className="polling-response">
              <span>{'{ messages: [...] }'}</span>
              <span>(solo mensajes nuevos)</span>
            </div>
          </div>
          <div className="polling-server">
            <div className="polling-icon">⚙️</div>
            <p>Backend PHP</p>
          </div>
        </div>
        <div className="optimizations">
          <h4>Optimizaciones:</h4>
          <ul>
            <li>Solo se consultan mensajes con <code>created_at &gt; since</code></li>
            <li>No se recarga la página, solo se actualiza el DOM del chat</li>
            <li>Si no hay mensajes nuevos, la respuesta es mínima</li>
            <li>Se actualizan indicadores de escritura y estado</li>
          </ul>
        </div>
      </div>

      <div className="phase-box future">
        <h3>Fase 2 (Futura): Server-Sent Events</h3>
        <p>La arquitectura queda preparada para migrar a SSE:</p>
        <ul>
          <li>El endpoint <code>/api/messages.php?action=stream</code> devolvería un stream continuo</li>
          <li>Solo se cambia la función <code>pollMessages()</code> en <code>messages.js</code></li>
          <li>La interfaz no necesita cambios</li>
        </ul>
      </div>
    </div>
  );
}

function DesignSection() {
  return (
    <div className="section">
      <h2>🎨 Paleta de Colores y Diseño</h2>

      <div className="color-palette">
        <div className="color-group">
          <h3>Primarios</h3>
          <div className="color-row">
            <div className="color-swatch" style={{background: '#0c2d4a'}}><span>--primary-900</span></div>
            <div className="color-swatch" style={{background: '#1a4b7a'}}><span>--primary-700</span></div>
            <div className="color-swatch" style={{background: '#2563eb'}}><span>--primary-500</span></div>
            <div className="color-swatch" style={{background: '#dbeafe'}}><span>--primary-100</span></div>
            <div className="color-swatch" style={{background: '#eff6ff'}}><span>--primary-50</span></div>
          </div>
        </div>
        <div className="color-group">
          <h3>Neutros</h3>
          <div className="color-row">
            <div className="color-swatch" style={{background: '#111827'}}><span>--gray-900</span></div>
            <div className="color-swatch" style={{background: '#374151'}}><span>--gray-700</span></div>
            <div className="color-swatch" style={{background: '#6b7280'}}><span>--gray-500</span></div>
            <div className="color-swatch" style={{background: '#d1d5db'}}><span>--gray-300</span></div>
            <div className="color-swatch" style={{background: '#f3f4f6'}}><span>--gray-100</span></div>
          </div>
        </div>
        <div className="color-group">
          <h3>Semánticos</h3>
          <div className="color-row">
            <div className="color-swatch" style={{background: '#059669'}}><span>--success</span></div>
            <div className="color-swatch" style={{background: '#d97706'}}><span>--warning</span></div>
            <div className="color-swatch" style={{background: '#dc2626'}}><span>--danger</span></div>
            <div className="color-swatch" style={{background: '#2563eb'}}><span>--info</span></div>
          </div>
        </div>
        <div className="color-group">
          <h3>Estados de Conversación</h3>
          <div className="color-row">
            <div className="color-swatch" style={{background: '#f59e0b'}}><span>waiting</span></div>
            <div className="color-swatch" style={{background: '#059669'}}><span>active</span></div>
            <div className="color-swatch" style={{background: '#8b5cf6'}}><span>hold</span></div>
            <div className="color-swatch" style={{background: '#6b7280'}}><span>closed</span></div>
          </div>
        </div>
      </div>

      <div className="design-principles">
        <h3>Principios de Diseño</h3>
        <div className="principles-grid">
          {[
            { icon: '🏢', title: 'Profesional', desc: 'Estética SaaS/CRM corporativa' },
            { icon: '✨', title: 'Limpio', desc: 'Fondo claro, sin ruido visual' },
            { icon: '🔵', title: 'Azul principal', desc: 'Color corporativo dominante' },
            { icon: '⚪', title: 'Blanco para tarjetas', desc: 'Contenedores con elevación sutil' },
            { icon: '🟢', title: 'Verde = positivo', desc: 'Estados exitosos y disponibles' },
            { icon: '🟡', title: 'Amarillo = espera', desc: 'Estados pendientes' },
            { icon: '🔴', title: 'Rojo = crítico', desc: 'Errores y situaciones urgentes' },
          ].map((p, i) => (
            <div key={i} className="principle-item">
              <span className="principle-icon">{p.icon}</span>
              <div>
                <strong>{p.title}</strong>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResponsiveSection() {
  return (
    <div className="section">
      <h2>📱 Estrategia Responsive</h2>

      <div className="breakpoints-grid">
        <div className="breakpoint-card desktop">
          <div className="breakpoint-icon">🖥️</div>
          <h3>Desktop</h3>
          <p className="breakpoint-range">&gt; 1200px</p>
          <ul>
            <li>Sidebar visible</li>
            <li>3 columnas: cola + chat + contexto</li>
            <li>Layout completo sin scroll horizontal</li>
          </ul>
          <div className="breakpoint-mockup">
            <div className="mock-sidebar"></div>
            <div className="mock-queue"></div>
            <div className="mock-chat"></div>
            <div className="mock-context"></div>
          </div>
        </div>
        <div className="breakpoint-card tablet">
          <div className="breakpoint-icon">📱</div>
          <h3>Tablet</h3>
          <p className="breakpoint-range">768 - 1200px</p>
          <ul>
            <li>Sidebar colapsable</li>
            <li>2 columnas: cola + chat</li>
            <li>Contexto en modal/drawer</li>
          </ul>
          <div className="breakpoint-mockup">
            <div className="mock-sidebar collapsed"></div>
            <div className="mock-queue"></div>
            <div className="mock-chat"></div>
          </div>
        </div>
        <div className="breakpoint-card mobile">
          <div className="breakpoint-icon">📲</div>
          <h3>Mobile</h3>
          <p className="breakpoint-range">&lt; 768px</p>
          <ul>
            <li>Sidebar como menú hamburguesa</li>
            <li>Vista alternable: cola ↔ chat</li>
            <li>Contexto como drawer lateral</li>
            <li>Widget optimizado para touch</li>
          </ul>
          <div className="breakpoint-mockup mobile-mock">
            <div className="mock-mobile-view"></div>
          </div>
        </div>
      </div>

      <div className="css-techniques">
        <h3>Técnicas CSS Utilizadas</h3>
        <div className="techniques-grid">
          <span className="tech-pill">CSS Grid</span>
          <span className="tech-pill">Flexbox</span>
          <span className="tech-pill">Variables CSS</span>
          <span className="tech-pill">Media Queries</span>
          <span className="tech-pill">clamp()</span>
          <span className="tech-pill">min()/max()</span>
          <span className="tech-pill">Container Queries</span>
          <span className="tech-pill">Transitions</span>
        </div>
      </div>
    </div>
  );
}

function FlowSection() {
  return (
    <div className="section">
      <h2>⚡ Flujo Principal del Sistema</h2>

      <div className="flow-main">
        <div className="flow-phase">
          <h3>🧑‍💻 Fase 1: Cliente</h3>
          <div className="flow-steps">
            {[
              'Ingresa a la tienda online',
              'Abre widget de chat',
              'Completa datos (nombre, DNI, pedido)',
              'Selecciona motivo de contacto',
              'Envía primer mensaje',
              'Se crea conversación (estado: WAITING)',
            ].map((step, i) => (
              <div key={i} className="flow-step-item">
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flow-connector-big">
          <i className="arrow-down">⬇️</i>
          <span>Conversación en cola</span>
        </div>

        <div className="flow-phase">
          <h3>👨‍💼 Fase 2: Operador</h3>
          <div className="flow-steps">
            {[
              'Visualiza conversación en cola',
              'Toma conversación → estado: ACTIVE',
              'Responde al cliente',
              'Consulta información del cliente (panel derecho)',
              'Consulta pedido relacionado',
              'Utiliza respuesta rápida si corresponde',
              'Consulta base de conocimiento si es necesario',
              'Puede escalar el caso',
              'Puede poner en espera',
              'Resuelve la conversación → estado: CLOSED',
            ].map((step, i) => (
              <div key={i} className="flow-step-item">
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flow-connector-big">
          <i className="arrow-down">⬇️</i>
          <span>Conversación cerrada</span>
        </div>

        <div className="flow-phase">
          <h3>📊 Fase 3: Finalización</h3>
          <div className="flow-steps">
            {[
              'Conversación pasa a estado CLOSED',
              'Cliente recibe encuesta CSAT (1-5 estrellas)',
              'Se registra la calificación en BD',
              'Conversación disponible para métricas',
              'Disponible para revisión de calidad',
            ].map((step, i) => (
              <div key={i} className="flow-step-item">
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
