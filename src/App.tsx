import { useState, useRef, useEffect } from 'react';
import './index.css';

// ==========================================
// TIPOS
// ==========================================
type View = 'dashboard' | 'chat' | 'customers' | 'orders' | 'users' | 'escalations' | 'knowledge' | 'quick-replies' | 'metrics' | 'quality';
type MsgType = 'cliente' | 'agente' | 'sistema' | 'bot';
type Theme = 'light' | 'dark';
type UserRole = 'admin' | 'supervisor' | 'agent' | 'client';

// ==========================================
// SISTEMA DE PERMISOS POR ROL
// ==========================================
interface RolePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewAllChats: boolean;
  canViewMetrics: boolean;
  canViewUsers: boolean;
  canManageUsers: boolean;
  canResolveEscalations: boolean;
  canAccessViews: View[];
}

const PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canViewAllChats: true,
    canViewMetrics: true,
    canViewUsers: true,
    canManageUsers: true,
    canResolveEscalations: true,
    canAccessViews: ['dashboard', 'chat', 'customers', 'orders', 'users', 'escalations', 'knowledge', 'quick-replies', 'metrics', 'quality']
  },
  supervisor: {
    canCreate: true,
    canEdit: true,
    canDelete: false, // Supervisor NO puede eliminar
    canViewAllChats: true,
    canViewMetrics: true,
    canViewUsers: true,
    canManageUsers: false, // Supervisor NO puede gestionar usuarios
    canResolveEscalations: true,
    canAccessViews: ['dashboard', 'chat', 'customers', 'orders', 'users', 'escalations', 'knowledge', 'quick-replies', 'metrics', 'quality']
  },
  agent: {
    canCreate: false, // Agente NO puede crear
    canEdit: false, // Agente NO puede editar
    canDelete: false, // Agente NO puede eliminar
    canViewAllChats: false, // Solo ve sus propios chats
    canViewMetrics: false, // Agente NO ve métricas
    canViewUsers: false, // Agente NO ve usuarios
    canManageUsers: false,
    canResolveEscalations: false, // Agente NO resuelve escalaciones
    canAccessViews: ['dashboard', 'chat', 'knowledge', 'quick-replies']
  },
  client: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canViewAllChats: false,
    canViewMetrics: false,
    canViewUsers: false,
    canManageUsers: false,
    canResolveEscalations: false,
    canAccessViews: []
  }
};

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
  password: string;
  codigo: string;
}

interface Orden {
  id: number;
  numero: string;
  clienteId: number;
  clienteNombre: string;
  producto: string;
  monto: number;
  estado: string;
  fecha: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  dni: string;
  password: string;
  codigo: string;
  rol: string;
  estado: string;
  breakEndsAt: number | null;
}

interface RespuestaRapida {
  id: number;
  atajo: string;
  titulo: string;
  contenido: string;
  categoria: string;
}

interface ArticuloKB {
  id: number;
  titulo: string;
  categoria: string;
  contenido: string;
}

interface Escalacion {
  id: number;
  cliente: string;
  motivo: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_proceso' | 'resuelto';
  asignadoA: string;
  fecha: string;
  descripcion: string;
}

// ==========================================
// DATA
// ==========================================
const respuestasRapidasData: RespuestaRapida[] = [
  { id: 1, atajo: '/saludo', titulo: 'Saludo inicial', contenido: '¡Hola {{customer_name}}! 👋 Mi nombre es {{agent_name}} y soy tu asesor/a de Frávega. ¿En qué puedo ayudarte el día de hoy?', categoria: 'General' },
  { id: 2, atajo: '/despedida', titulo: 'Cierre de chat', contenido: '¡Fue un placer atenderte, {{customer_name}}! 😊 Si tenés otra consulta, no dudes en contactarnos nuevamente. ¡Que tengas un excelente día!', categoria: 'General' },
  { id: 3, atajo: '/espera', titulo: 'Poner en espera', contenido: 'Un momento por favor, {{customer_name}}. Estoy revisando tu consulta y te respondo en breve. ¡Gracias por tu paciencia!', categoria: 'General' },
  { id: 4, atajo: '/transfer', titulo: 'Transferir a supervisor', contenido: '{{customer_name}}, voy a transferirte con un supervisor que podrá ayudarte mejor con tu caso. Un momento por favor.', categoria: 'General' },
  { id: 5, atajo: '/estado', titulo: 'Consultar estado del pedido', contenido: 'Estoy consultando el estado de tu pedido {{order_number}} en nuestro sistema logístico, {{customer_name}}. Te pido un momento mientras verifico la información actualizada.', categoria: 'Logística' },
  { id: 6, atajo: '/demora', titulo: 'Demora en entrega', contenido: 'Comprendo tu frustración por la demora, {{customer_name}}. Voy a escalaral tu caso al área de logística para priorizar tu entrega del pedido {{order_number}}. Te mantendré informado/a.', categoria: 'Logística' },
  { id: 7, atajo: '/reprogramar', titulo: 'Reprogramar entrega', contenido: 'Sin problema, {{customer_name}}. Puedo reprogramar la entrega de tu pedido {{order_number}}. ¿Qué fecha te quedaría mejor? Tené en cuenta que tenemos disponibilidad a partir de 48hs hábiles.', categoria: 'Logística' },
  { id: 8, atajo: '/tracking', titulo: 'Código de seguimiento', contenido: 'Tu código de seguimiento para el pedido {{order_number}} es: [TRACKING_CODE]. Podés consultar el estado en cualquier momento en fravega.com/seguimiento', categoria: 'Logística' },
  { id: 9, atajo: '/promos', titulo: 'Promociones bancarias', contenido: '¡Excelente pregunta, {{customer_name}}! Estas son las promos vigentes:\n\n🏦 Santander: 3, 6 y 12 cuotas SI\n🏦 Galicia: 3 y 6 cuotas SI + 10% extra\n🏦 BBVA: 12 y 18 cuotas SI\n🏦 Macro: 6 cuotas SI\n🏦 Naranja: 12 cuotas SI\n\n💳 También aceptamos Mercado Pago. ¿Sobre qué producto te gustaría consultar?', categoria: 'Preventa' },
  { id: 10, atajo: '/stock', titulo: 'Consulta de stock', contenido: 'Déjame verificar el stock disponible en nuestras sucursales, {{customer_name}}. ¿Podrías indicarme en qué zona estás o qué sucursal te queda más cómoda?', categoria: 'Preventa' },
  { id: 11, atajo: '/retiro', titulo: 'Retiro en sucursal', contenido: '¡Perfecto, {{customer_name}}! Tu pedido {{order_number}} ya está disponible para retiro en la sucursal que elegiste. Recordá traer tu DNI y el código de compra que te enviamos por email.', categoria: 'Preventa' },
  { id: 12, atajo: '/retiro-tercero', titulo: 'Retiro por tercero', contenido: 'Para que otra persona retire tu pedido, {{customer_name}}, necesitás:\n\n📋 Autorización firmada por el titular\n📋 Copia del DNI del titular\n📋 Código de compra (enviado por email)\n📋 DNI original de quien retira\n\n¿Necesitás que te envíe el modelo de autorización?', categoria: 'Preventa' },
  { id: 13, atajo: '/cambio', titulo: 'Cambio/Devolución', contenido: 'Dentro de los 10 días corridos desde la recepción, podés ejercer tu derecho de cambio o devolución sin costo, {{customer_name}}. Para iniciar el trámite necesito:\n\n1. Número de pedido\n2. Motivo del cambio/devolución\n3. Fotos del producto (si hay daño)\n\n¿Iniciamos el trámite?', categoria: 'Postventa' },
  { id: 14, atajo: '/garantia', titulo: 'Consulta de garantía', contenido: 'Tu producto cuenta con garantía oficial del fabricante, {{customer_name}}. Para gestionar el servicio técnico necesito:\n\n1. Número de pedido\n2. Descripción de la falla\n3. Fotos o video del problema\n\nEl plazo de respuesta es de 48hs hábiles.', categoria: 'Postventa' },
  { id: 15, atajo: '/producto-dañado', titulo: 'Producto dañado al recibir', contenido: 'Lamento mucho lo sucedido, {{customer_name}}. Voy a generar un reclamo inmediatamente. ¿Podrías enviarme fotos del daño por este chat? Necesito documentar el caso para resolverlo a la brevedad.', categoria: 'Postventa' },
  { id: 16, atajo: '/factura', titulo: 'Consulta de facturación', contenido: 'Para ayudarte con la facturación, {{customer_name}}, necesito:\n\n📄 CUIT/CUIL\n📄 Datos de facturación actualizados\n📄 Número de pedido\n\nSi necesitás cambiar de Factura B a A, voy a derivar tu caso al área de facturación. Plazo: 48hs hábiles.', categoria: 'Facturación' },
];

const articulosKB: ArticuloKB[] = [
  { id: 1, titulo: 'Retiro por tercero en sucursal', categoria: 'Sucursal', contenido: '1. Verificar identidad del titular\n2. Confirmar pedido disponible\n3. Indicar requisitos: autorización, DNI, código\n4. Enviar modelo si se solicita\n5. Confirmar sucursal y horario' },
  { id: 2, titulo: 'Escalamiento demora logística', categoria: 'Logística', contenido: '1. Validar datos del pedido\n2. Contactar centro de distribución\n3. Generar orden de destrabe\n4. Informar nueva fecha al cliente\n5. Si >72hs: escalar a Supervisor' },
  { id: 3, titulo: 'Proceso cambio/devolución', categoria: 'Postventa', contenido: '1. Verificar fecha (máx 10 días)\n2. Solicitar motivo\n3. Si hay daño: solicitar fotos\n4. Generar logística inversa\n5. Coordinar retiro\n6. Emitir nota de crédito' },
  { id: 4, titulo: 'Derivación servicio técnico', categoria: 'Postventa', contenido: '1. Verificar período de garantía\n2. Recopilar datos y fotos\n3. Identificar centro oficial\n4. Generar ticket\n5. Informar plazo: 48hs hábiles' },
  { id: 5, titulo: 'Validación de identidad', categoria: 'Seguridad', contenido: '1. Solicitar nombre y DNI\n2. Cruzar con CRM\n3. Confirmar email/teléfono\n4. Si hay pedido: N° o últimos 4 dígitos\n5. Si no coincide: NO brindar info' },
];

const escalacionesData: Escalacion[] = [
  { id: 1, cliente: 'Roberto Martínez', motivo: 'Producto dañado en entrega', prioridad: 'alta', estado: 'en_proceso', asignadoA: 'Martín Pereyra', fecha: '15 Ene 2025', descripcion: 'Lavarropas recibido con caja dañada y golpe en tambor.' },
  { id: 2, cliente: 'María González', motivo: 'Demora superior a 72hs', prioridad: 'media', estado: 'en_proceso', asignadoA: 'Sofía Ríos', fecha: '15 Ene 2025', descripcion: 'Smart TV con demora en centro de distribución.' },
  { id: 3, cliente: 'Pedro Sánchez', motivo: 'Reclamo Defensa del Consumidor', prioridad: 'alta', estado: 'pendiente', asignadoA: 'Sin asignar', fecha: '14 Ene 2025', descripcion: 'Reclamo formal COPREC por producto no entregado.' },
];

const conversacionesIniciales: Conversacion[] = [
  {
    id: 1, cliente: 'María González', avatar: 'MG', color: 'blue', dni: '32.456.789', email: 'maria.gonzalez@gmail.com', tel: '+54 11 5542-8891', clienteDesde: 2021, pedidos: 7, casos: 2,
    pedido: { num: '#10452', producto: 'Smart TV Samsung 50"', monto: 489999, entrega: 'Entrega a domicilio', fecha: '15-17 Ene 2025', estado: 'distributing', estadoLabel: 'En distribución' },
    motivo: 'Pedido · Demora en entrega', estado: 'activo', tiempo: '2m 15s', unread: false,
    ultimoMsg: '¿Me pueden decir dónde está mi pedido?',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:32', leido: true },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte?', hora: '14:32', leido: true },
      { id: 3, tipo: 'cliente', emisor: 'María González', texto: 'Hola, compré un Smart TV y no me llegó. Ya pasó la fecha de entrega.', hora: '14:33', leido: true },
      { id: 4, tipo: 'sistema', texto: '⚡ Transferido a agente: Sofía Ríos', hora: '14:34', leido: true },
      { id: 5, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola María! Soy Sofía. Estoy revisando tu pedido ahora mismo.', hora: '14:34', leido: true },
    ]
  },
];

const clientesIniciales: Cliente[] = [
  { id: 1, nombre: 'María González', dni: '32456789', email: 'maria.gonzalez@gmail.com', telefono: '+54 11 5542-8891', password: 'maria123', codigo: '1111' },
  { id: 2, nombre: 'Carlos Rodríguez', dni: '28901234', email: 'c.rodriguez@outlook.com', telefono: '+54 11 4421-3356', password: 'carlos123', codigo: '2222' },
  { id: 3, nombre: 'Lucía Fernández', dni: '35678432', email: 'lucia.fernandez@yahoo.com', telefono: '+54 11 6678-1122', password: 'lucia123', codigo: '3333' },
  { id: 4, nombre: 'Roberto Martínez', dni: '24112567', email: 'r.martinez@gmail.com', telefono: '+54 11 3345-7788', password: 'roberto123', codigo: '4444' },
  { id: 5, nombre: 'Ana López', dni: '30234890', email: 'ana.lopez@hotmail.com', telefono: '+54 11 5567-9900', password: 'ana123', codigo: '5555' },
  { id: 6, nombre: 'Pedro Sánchez', dni: '27890123', email: 'pedro.sanchez@gmail.com', telefono: '+54 11 4456-7788', password: 'pedro123', codigo: '6666' },
  { id: 7, nombre: 'Juan Pérez', dni: '99999999', email: 'juan.perez@gmail.com', telefono: '+54 11 6677-8899', password: 'cliente123', codigo: '9999' },
];

const ordenesIniciales: Orden[] = [
  { id: 1, numero: '#10452', clienteId: 1, clienteNombre: 'María González', producto: 'Smart TV Samsung 50"', monto: 489999, estado: 'shipping', fecha: '15-17 Ene 2025' },
  { id: 2, numero: '#10389', clienteId: 2, clienteNombre: 'Carlos Rodríguez', producto: 'Notebook Lenovo IdeaPad 3', monto: 749999, estado: 'preparing', fecha: '12 Ene 2025' },
  { id: 3, numero: '#10501', clienteId: 3, clienteNombre: 'Lucía Fernández', producto: 'Heladera Whirlpool 396L', monto: 1299000, estado: 'preparing', fecha: '20-22 Ene 2025' },
  { id: 4, numero: '#10298', clienteId: 5, clienteNombre: 'Ana López', producto: 'Aire Acond. Samsung WindFree', monto: 899999, estado: 'delivered', fecha: '10 Ene 2025' },
  { id: 5, numero: '#10445', clienteId: 4, clienteNombre: 'Roberto Martínez', producto: 'Lavarropas Drean Next 8.15', monto: 599999, estado: 'delayed', fecha: '14 Ene 2025' },
  { id: 6, numero: '#10567', clienteId: 6, clienteNombre: 'Pedro Sánchez', producto: 'Cafetera Nespresso Vertuo', monto: 189999, estado: 'preparing', fecha: '20 Ene 2025' },
  { id: 7, numero: '#10789', clienteId: 7, clienteNombre: 'Juan Pérez', producto: 'Smart TV LG 55" OLED', monto: 1299999, estado: 'shipping', fecha: '18-20 Ene 2025' },
  { id: 8, numero: '#10823', clienteId: 7, clienteNombre: 'Juan Pérez', producto: 'Notebook HP Pavilion 15"', monto: 849999, estado: 'preparing', fecha: '22-24 Ene 2025' },
  { id: 9, numero: '#10856', clienteId: 7, clienteNombre: 'Juan Pérez', producto: 'Auriculares Sony WH-1000XM5', monto: 299999, estado: 'delivered', fecha: '10 Ene 2025' },
];

const usuariosIniciales: Usuario[] = [
  { id: 1, nombre: 'Sofía Ríos', email: 'sofia.rios@fravega.com', dni: '34567890', password: 'agent123', codigo: '3456', rol: 'agent', estado: 'available', breakEndsAt: null },
  { id: 2, nombre: 'Martín Pereyra', email: 'martin.pereyra@fravega.com', dni: '45678901', password: 'agent456', codigo: '4567', rol: 'agent', estado: 'busy', breakEndsAt: null },
  { id: 3, nombre: 'Valentina Torres', email: 'valentina.torres@fravega.com', dni: '56789012', password: 'agent789', codigo: '5678', rol: 'agent', estado: 'available', breakEndsAt: null },
  { id: 4, nombre: 'Diego Álvarez', email: 'diego.alvarez@fravega.com', dni: '67890123', password: 'agent012', codigo: '6789', rol: 'agent', estado: 'break', breakEndsAt: Date.now() + 15 * 60 * 1000 },
  { id: 5, nombre: 'Nicolás Romero', email: 'nicolas.romero@fravega.com', dni: '23456789', password: 'super123', codigo: '2345', rol: 'supervisor', estado: 'available', breakEndsAt: null },
  { id: 6, nombre: 'Camila Sánchez', email: 'camila.sanchez@fravega.com', dni: '78901234', password: 'agent345', codigo: '7890', rol: 'agent', estado: 'offline', breakEndsAt: null },
  { id: 7, nombre: 'Admin Sistema', email: 'admin@fravega.com', dni: '12345678', password: 'admin123', codigo: '1234', rol: 'admin', estado: 'available', breakEndsAt: null },
  { id: 8, nombre: 'Juan Pérez', email: 'juan.perez@gmail.com', dni: '99999999', password: 'cliente123', codigo: '9999', rol: 'client', estado: 'available', breakEndsAt: null },
];

const usuariosPrueba = usuariosIniciales.map(u => ({
  dni: u.dni,
  password: u.password,
  codigo: u.codigo,
  nombre: u.nombre,
  rol: u.rol
}));

// ==========================================
// LOGIN SCREEN COMPONENT
// ==========================================
function LoginScreen({ onLogin, error }: { onLogin: (dni: string, password: string, codigo: string) => void; error: string }) {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [codigo, setCodigo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(dni, password, codigo);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">N</div>
          <h1>Nexo Web Chat</h1>
          <p>Sistema de Atención al Cliente</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="dni">DNI</label>
            <input
              id="dni"
              type="text"
              placeholder="Ej: 12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="login-field">
            <label htmlFor="codigo">Código de Seguridad</label>
            <input
              id="codigo"
              type="text"
              placeholder="Ej: 1234"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              maxLength={4}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-footer">
          <p className="login-hint">💡 Usuarios disponibles:</p>
          <div className="login-credentials">
            <div className="credential-item">
              <strong>👑 Admin:</strong> DNI 12345678 / Pass admin123 / Código 1234
            </div>
            <div className="credential-item">
              <strong>🎯 Supervisor:</strong> DNI 23456789 / Pass super123 / Código 2345
            </div>
            <div className="credential-item">
              <strong>💬 Sofía Ríos:</strong> DNI 34567890 / Pass agent123 / Código 3456
            </div>
            <div className="credential-item">
              <strong>💬 Martín Pereyra:</strong> DNI 45678901 / Pass agent456 / Código 4567
            </div>
            <div className="credential-item">
              <strong>💬 Valentina Torres:</strong> DNI 56789012 / Pass agent789 / Código 5678
            </div>
            <div className="credential-item">
              <strong>💬 Diego Álvarez:</strong> DNI 67890123 / Pass agent012 / Código 6789
            </div>
            <div className="credential-item">
              <strong>💬 Camila Sánchez:</strong> DNI 78901234 / Pass agent345 / Código 7890
            </div>
            <div className="credential-item" style={{marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px'}}>
              <strong>👤 Clientes:</strong>
            </div>
            <div className="credential-item">
              <strong>María González:</strong> DNI 32456789 / Pass maria123 / Código 1111
            </div>
            <div className="credential-item">
              <strong>Carlos Rodríguez:</strong> DNI 28901234 / Pass carlos123 / Código 2222
            </div>
            <div className="credential-item">
              <strong>Lucía Fernández:</strong> DNI 35678432 / Pass lucia123 / Código 3333
            </div>
            <div className="credential-item">
              <strong>Roberto Martínez:</strong> DNI 24112567 / Pass roberto123 / Código 4444
            </div>
            <div className="credential-item">
              <strong>Ana López:</strong> DNI 30234890 / Pass ana123 / Código 5555
            </div>
            <div className="credential-item">
              <strong>Pedro Sánchez:</strong> DNI 27890123 / Pass pedro123 / Código 6666
            </div>
            <div className="credential-item">
              <strong>Juan Pérez:</strong> DNI 99999999 / Pass cliente123 / Código 9999
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// APP COMPONENT
// ==========================================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginError, setLoginError] = useState('');
  const [currentView, setCurrentView] = useState<View>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [conversaciones, setConversaciones] = useState<Conversacion[]>(() => {
    const stored = localStorage.getItem('nexo_conversaciones');
    return stored ? JSON.parse(stored) : conversacionesIniciales;
  });
  
  const [selectedChatId, setSelectedChatId] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [theme, setTheme] = useState<Theme>('light');
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  
  const [ordenes, setOrdenes] = useState<Orden[]>(() => {
    const stored = localStorage.getItem('nexo_ordenes');
    return stored ? JSON.parse(stored) : ordenesIniciales;
  });
  
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [notification, setNotification] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [modalResource, setModalResource] = useState<'cliente' | 'orden' | 'usuario'>('cliente');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [searchKB, setSearchKB] = useState('');
  const [selectedKB, setSelectedKB] = useState<number>(1);
  const [qrCategory, setQrCategory] = useState<string>('Todas');
  const [loadingResource, setLoadingResource] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  const selectedChat = conversaciones.find(c => c.id === selectedChatId) || conversaciones[0];

  // ==========================================
  // FUNCIONES DE PERMISOS
  // ==========================================
  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!currentUser) return false;
    const role = currentUser.rol as UserRole;
    const perms = PERMISSIONS[role];
    if (!perms) return false;
    return perms[permission] === true;
  };

  const canAccessView = (view: View): boolean => {
    if (!currentUser) return false;
    const role = currentUser.rol as UserRole;
    const perms = PERMISSIONS[role];
    if (!perms) return false;
    return perms.canAccessViews.includes(view);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('nexo_conversaciones');
    if (!stored || JSON.parse(stored).length === 0) {
      localStorage.setItem('nexo_conversaciones', JSON.stringify(conversacionesIniciales));
      setConversaciones(conversacionesIniciales);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nexo_conversaciones', JSON.stringify(conversaciones));
  }, [conversaciones]);

  useEffect(() => {
    localStorage.setItem('nexo_ordenes', JSON.stringify(ordenes));
  }, [ordenes]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nexo_conversaciones' && e.newValue) {
        try {
          setConversaciones(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Error:', err);
        }
      }
      if (e.key === 'nexo_ordenes' && e.newValue) {
        try {
          setOrdenes(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Error:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const pollingInterval = setInterval(() => {
      const stored = localStorage.getItem('nexo_conversaciones');
      if (stored) {
        try {
          const nuevas = JSON.parse(stored);
          setConversaciones(prev => {
            if (JSON.stringify(nuevas) !== JSON.stringify(prev)) {
              return nuevas;
            }
            return prev;
          });
        } catch (err) {
          console.error('Error:', err);
        }
      }
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollingInterval);
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const personalizeReply = (content: string, customerName?: string, orderNumber?: string): string => {
    let result = content;
    result = result.replace(/\{\{agent_name\}\}/g, currentUser?.nombre || 'Asesor/a');
    result = result.replace(/\{\{customer_name\}\}/g, customerName || 'cliente');
    result = result.replace(/\{\{order_number\}\}/g, orderNumber || '#XXXXX');
    return result;
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    showNotification(`🎨 Tema ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
  };

  const handleLogin = (dni: string, password: string, codigo: string) => {
    // Buscar en usuarios (admin, supervisor, agent)
    const user = usuarios.find(
      u => u.dni === dni && u.password === password && u.codigo === codigo
    );

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setLoginError('');
      showNotification(`✅ Bienvenido, ${user.nombre}`);
      return;
    }

    // Buscar en clientes
    const client = clientes.find(
      c => c.dni === dni && c.password === password && c.codigo === codigo
    );

    if (client) {
      setIsAuthenticated(true);
      setCurrentUser({ ...client, rol: 'client', estado: 'available', breakEndsAt: null });
      setLoginError('');
      showNotification(`✅ Bienvenido, ${client.nombre}`);
      return;
    }

    setLoginError('DNI, contraseña o código de seguridad incorrectos');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    if (currentUser?.rol === 'cliente') {
      localStorage.removeItem('nexo_cliente_session');
    }
    showNotification('👋 Sesión cerrada');
  };

  const getEstadoLabel = (estado: string): string => {
    const map: Record<string, string> = {
      'preparing': 'Preparando',
      'shipping': 'En envío',
      'delivered': 'Entregado',
      'delayed': 'Demorado',
      'available': 'Disponible',
      'busy': 'Ocupado',
      'break': 'En pausa',
      'offline': 'Desconectado'
    };
    return map[estado] || estado;
  };

  const formatTimeRemaining = (endsAt: number | null): string => {
    if (!endsAt) return '';
    const remaining = Math.max(0, endsAt - currentTime);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const openModal = (type: 'create' | 'edit' | 'delete', resource: 'cliente' | 'orden' | 'usuario', item?: any) => {
    setModalType(type);
    setModalResource(resource);
    setSelectedItem(item || null);
    setShowModal(true);
  };

  const handleSave = (data: any) => {
    if (modalType === 'create') {
      if (modalResource === 'cliente') {
        setLoadingResource('cliente');
        setTimeout(() => {
          const newId = Math.max(...clientes.map(c => c.id)) + 1;
          const newClient = {
            ...data,
            id: newId,
            password: data.password || '',
            codigo: data.codigo || ''
          };
          setClientes([...clientes, newClient]);
          showNotification('✅ Cliente creado exitosamente');
          setLoadingResource(null);
        }, 800);
      } else if (modalResource === 'orden') {
        setLoadingResource('orden');
        setTimeout(() => {
          const newId = Math.max(...ordenes.map(o => o.id)) + 1;
          const newOrder = { 
            ...data, 
            id: newId,
            estado: data.estado || 'preparing',
            fecha: data.fecha || new Date().toLocaleDateString('es-AR')
          };
          setOrdenes([newOrder, ...ordenes]);
          showNotification(`✅ Pedido ${data.numero} creado con estado: ${getEstadoLabel(data.estado || 'preparing')}`);
          setLoadingResource(null);
        }, 800);
      } else if (modalResource === 'usuario') {
        setLoadingResource('usuario');
        setTimeout(() => {
          const newId = Math.max(...usuarios.map(u => u.id)) + 1;
          const newUser = {
            ...data,
            id: newId,
            rol: data.rol || 'agent',
            estado: data.estado || 'available',
            breakEndsAt: null,
            dni: data.dni || '',
            password: data.password || '',
            codigo: data.codigo || ''
          };
          setUsuarios([newUser, ...usuarios]);
          showNotification(`✅ Usuario ${data.nombre} creado exitosamente`);
          setLoadingResource(null);
        }, 800);
      }
    } else if (modalType === 'edit') {
      if (modalResource === 'cliente') {
        setClientes(clientes.map(c => c.id === selectedItem.id ? { ...c, ...data } : c));
        showNotification('✅ Cliente actualizado');
      } else if (modalResource === 'orden') {
        setOrdenes(ordenes.map(o => o.id === selectedItem.id ? { ...o, ...data } : o));
        showNotification('✅ Pedido actualizado');
      } else if (modalResource === 'usuario') {
        setUsuarios(usuarios.map(u => u.id === selectedItem.id ? { 
          ...u, 
          ...data,
          dni: data.dni || u.dni,
          password: data.password || u.password,
          codigo: data.codigo || u.codigo
        } : u));
        showNotification('✅ Usuario actualizado');
      }
    } else if (modalType === 'delete') {
      if (modalResource === 'cliente') {
        setClientes(clientes.filter(c => c.id !== selectedItem.id));
        showNotification('🗑️ Cliente eliminado');
      } else if (modalResource === 'orden') {
        setOrdenes(ordenes.filter(o => o.id !== selectedItem.id));
        showNotification('🗑️ Pedido eliminado');
      } else if (modalResource === 'usuario') {
        setUsuarios(usuarios.filter(u => u.id !== selectedItem.id));
        showNotification('🗑️ Usuario eliminado');
      }
    }
    setShowModal(false);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    const newMsg: Mensaje = {
      id: Date.now(),
      tipo: 'agente',
      emisor: currentUser?.nombre || 'Sofía Ríos',
      texto: messageInput,
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      leido: false
    };
    const nuevasConversaciones = conversaciones.map(c =>
      c.id === selectedChatId
        ? { ...c, mensajes: [...c.mensajes, newMsg], ultimoMsg: messageInput, estado: 'activo' as const }
        : c
    );
    setConversaciones(nuevasConversaciones);
    localStorage.setItem('nexo_conversaciones', JSON.stringify(nuevasConversaciones));
    setMessageInput('');
    setShowQuickReplies(false);
  };

  const insertQuickReply = (content: string) => {
    const personalized = personalizeReply(
      content,
      selectedChat?.cliente,
      selectedChat?.pedido?.num
    );
    setMessageInput(personalized);
    setShowQuickReplies(false);
  };

  const takeChat = (id: number) => {
    const nuevasConversaciones = conversaciones.map(c =>
      c.id === id ? { ...c, estado: 'activo' as const, unread: false } : c
    );
    setConversaciones(nuevasConversaciones);
    localStorage.setItem('nexo_conversaciones', JSON.stringify(nuevasConversaciones));
    showNotification('✅ Chat tomado');
  };

  const resolveChat = () => {
    const systemMsg: Mensaje = {
      id: Date.now(),
      tipo: 'sistema',
      texto: '✅ Conversación resuelta · CSAT: 5/5 ⭐',
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      leido: true
    };
    const nuevasConversaciones = conversaciones.map(c =>
      c.id === selectedChatId
        ? { ...c, estado: 'resuelto' as const, mensajes: [...c.mensajes, systemMsg] }
        : c
    );
    setConversaciones(nuevasConversaciones);
    localStorage.setItem('nexo_conversaciones', JSON.stringify(nuevasConversaciones));
    showNotification('✅ Chat resuelto');
  };

  const deleteChat = (id: number) => {
    const nuevasConversaciones = conversaciones.filter(c => c.id !== id);
    setConversaciones(nuevasConversaciones);
    localStorage.setItem('nexo_conversaciones', JSON.stringify(nuevasConversaciones));
    
    if (id === selectedChatId && nuevasConversaciones.length > 0) {
      setSelectedChatId(nuevasConversaciones[0].id);
    }
    showNotification('🗑️ Chat eliminado');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  if (currentUser?.rol === 'client') {
    return <ClienteView currentUser={currentUser} conversaciones={conversaciones} setConversaciones={setConversaciones} ordenes={ordenes} setOrdenes={setOrdenes} usuarios={usuarios} onLogout={handleLogout} />;
  }

  const renderView = () => {
    // Verificar si el usuario tiene acceso a la vista actual
    if (!canAccessView(currentView)) {
      return (
        <div className="view-container">
          <div className="view-header">
            <div>
              <h1>Acceso Restringido</h1>
              <p>No tienes permisos para acceder a esta sección</p>
            </div>
          </div>
          <div style={{textAlign: 'center', padding: '60px 20px'}}>
            <div style={{fontSize: '64px', marginBottom: '20px'}}>🔒</div>
            <h2 style={{fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px'}}>
              Acceso Restringido
            </h2>
            <p style={{fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px'}}>
              No tienes permisos para acceder a esta sección.
            </p>
            <p style={{fontSize: '14px', color: 'var(--text-tertiary)'}}>
              Tu rol actual: <strong style={{color: 'var(--primary-color)', textTransform: 'capitalize'}}>{currentUser?.rol}</strong>
            </p>
            <button 
              className="btn-primary" 
              style={{marginTop: '24px'}}
              onClick={() => setCurrentView('dashboard')}
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        const chatsFiltrados = hasPermission('canViewAllChats') 
          ? conversaciones 
          : conversaciones.filter(c => c.estado !== 'resuelto');
        
        return (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1>Dashboard</h1>
                <p>Resumen en tiempo real</p>
              </div>
            </div>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon blue">💬</div>
                <div className="kpi-content">
                  <div className="kpi-value">{chatsFiltrados.filter(c => c.estado === 'activo').length}</div>
                  <div className="kpi-label">Chats Activos</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon orange">⏳</div>
                <div className="kpi-content">
                  <div className="kpi-value">{chatsFiltrados.filter(c => c.estado === 'esperando').length}</div>
                  <div className="kpi-label">En Espera</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon green">✅</div>
                <div className="kpi-content">
                  <div className="kpi-value">{chatsFiltrados.filter(c => c.estado === 'resuelto').length}</div>
                  <div className="kpi-label">Resueltos Hoy</div>
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
      case 'chat':
        // Filtrar chats según permisos
        const chatsVisibles = hasPermission('canViewAllChats')
          ? conversaciones
          : conversaciones.filter(c => c.estado !== 'resuelto'); // Agente solo ve chats activos/en espera
        
        return (
          <div className="chat-view-container">
            <div className="chat-layout">
              <div className="chat-queue">
                <div className="queue-header">
                  <h2>Conversaciones</h2>
                  <span className="queue-count">{chatsVisibles.length}</span>
                </div>
                <div className="queue-list">
                  {chatsVisibles.map(chat => (
                    <div key={chat.id} className={`queue-item ${selectedChatId === chat.id ? 'active' : ''}`} onClick={() => setSelectedChatId(chat.id)}>
                      <div className={`queue-avatar ${chat.color}`}>{chat.avatar}</div>
                      <div className="queue-info">
                        <div className="queue-name">{chat.cliente}</div>
                        <div className="queue-message">{chat.ultimoMsg}</div>
                      </div>
                      <div className={`queue-status ${chat.estado}`}></div>
                      {chat.estado === 'esperando' && (
                        <button className="queue-take-btn" onClick={(e) => { e.stopPropagation(); takeChat(chat.id); }}>✋</button>
                      )}
                      {hasPermission('canDelete') && (
                        <button className="queue-delete-btn" onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}>🗑️</button>
                      )}
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
                          <p>{selectedChat.motivo} · DNI: {selectedChat.dni}</p>
                        </div>
                      </div>
                      <div className="chat-actions">
                        <span className={`status-badge ${selectedChat.estado}`}>{selectedChat.estado}</span>
                        {selectedChat.estado === 'esperando' && (
                          <button className="btn-primary" onClick={() => takeChat(selectedChat.id)}>✋ Tomar</button>
                        )}
                        {selectedChat.estado === 'activo' && hasPermission('canEdit') && (
                          <button className="btn-success" onClick={resolveChat}>✓ Resolver</button>
                        )}
                        {hasPermission('canDelete') && (
                          <button className="btn-danger" onClick={() => deleteChat(selectedChat.id)}>🗑️</button>
                        )}
                      </div>
                    </div>
                    <div className="chat-messages">
                      {selectedChat.mensajes.map(msg => (
                        <div key={msg.id} className={`message ${msg.tipo}`}>
                          {msg.tipo !== 'sistema' && (
                            <div className="message-header">
                              <span className="message-sender">{msg.emisor}</span>
                              <span className="message-time">{msg.hora}</span>
                            </div>
                          )}
                          <div className="message-bubble">{msg.texto}</div>
                        </div>
                      ))}
                    </div>
                    <div className="chat-input-area">
                      <div className="chat-toolbar">
                        <button className={`toolbar-btn ${showQuickReplies ? 'active' : ''}`} onClick={() => setShowQuickReplies(!showQuickReplies)}>⚡ Respuestas rápidas</button>
                        {showQuickReplies && (
                          <div className="qr-filters">
                            {['Todas', 'General', 'Logística', 'Preventa', 'Postventa', 'Facturación'].map(cat => (
                              <button 
                                key={cat}
                                className={`qr-filter-btn ${qrCategory === cat ? 'active' : ''}`}
                                onClick={() => setQrCategory(cat)}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {showQuickReplies && (
                        <div className="quick-replies-panel expanded">
                          {respuestasRapidasData
                            .filter(qr => qrCategory === 'Todas' || qr.categoria === qrCategory)
                            .map(qr => (
                              <div key={qr.id} className="quick-reply-item" onClick={() => insertQuickReply(qr.contenido)}>
                                <div className="quick-reply-header">
                                  <span className="quick-reply-shortcut">{qr.atajo}</span>
                                  <span className="quick-reply-title">{qr.titulo}</span>
                                  <span className="quick-reply-category-tag">{qr.categoria}</span>
                                </div>
                                <div className="quick-reply-preview">{qr.contenido}</div>
                              </div>
                            ))}
                        </div>
                      )}
                      <div className="chat-input">
                        <input
                          type="text"
                          placeholder="Escribe un mensaje..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          disabled={selectedChat.estado === 'resuelto'}
                        />
                        <button onClick={sendMessage} disabled={!messageInput.trim() || selectedChat.estado === 'resuelto'}>➤</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="chat-empty">
                    <p>Selecciona una conversación</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1>Clientes</h1>
                <p>Gestión de clientes del sistema</p>
              </div>
              {hasPermission('canCreate') && (
                <button className="btn-primary" onClick={() => openModal('create', 'cliente')}>+ Nuevo Cliente</button>
              )}
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>DNI</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    {hasPermission('canManageUsers') && (
                      <>
                        <th>Contraseña</th>
                        <th>Código</th>
                      </>
                    )}
                    {(hasPermission('canEdit') || hasPermission('canDelete')) && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre}</td>
                      <td><code style={{background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px'}}>{cliente.dni}</code></td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefono}</td>
                      {hasPermission('canManageUsers') && (
                        <>
                          <td><code style={{background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px'}}>{cliente.password}</code></td>
                          <td><code style={{background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px'}}>{cliente.codigo}</code></td>
                        </>
                      )}
                      {(hasPermission('canEdit') || hasPermission('canDelete')) && (
                        <td>
                          {hasPermission('canEdit') && (
                            <button className="btn-icon" onClick={() => openModal('edit', 'cliente', cliente)}>✏️</button>
                          )}
                          {hasPermission('canDelete') && (
                            <button className="btn-icon" onClick={() => openModal('delete', 'cliente', cliente)}>🗑️</button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1>Pedidos</h1>
                <p>Gestión de pedidos y órdenes</p>
              </div>
              {hasPermission('canCreate') && (
                <button className="btn-primary" onClick={() => openModal('create', 'orden')} disabled={loadingResource === 'orden'}>
                  {loadingResource === 'orden' ? '⏳ Creando...' : '+ Nuevo Pedido'}
                </button>
              )}
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
                    <th>Fecha</th>
                    {(hasPermission('canEdit') || hasPermission('canDelete')) && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((orden) => (
                    <tr key={orden.id}>
                      <td><strong>{orden.numero}</strong></td>
                      <td>{orden.clienteNombre}</td>
                      <td>{orden.producto}</td>
                      <td>${orden.monto.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${orden.estado}`}>
                          {getEstadoLabel(orden.estado)}
                        </span>
                      </td>
                      <td>{orden.fecha}</td>
                      {(hasPermission('canEdit') || hasPermission('canDelete')) && (
                        <td>
                          {hasPermission('canEdit') && (
                            <button className="btn-icon" onClick={() => openModal('edit', 'orden', orden)}>✏️</button>
                          )}
                          {hasPermission('canDelete') && (
                            <button className="btn-icon" onClick={() => openModal('delete', 'orden', orden)}>🗑️</button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1>Equipo de Trabajo</h1>
                <p>Gestión de agentes y supervisores</p>
              </div>
              {hasPermission('canManageUsers') && (
                <button className="btn-primary" onClick={() => openModal('create', 'usuario')} disabled={loadingResource === 'usuario'}>
                  {loadingResource === 'usuario' ? '⏳ Creando...' : '+ Nuevo Usuario'}
                </button>
              )}
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>DNI</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Tiempo de Descanso</th>
                    {hasPermission('canManageUsers') && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => {
                    const breakTimeRemaining = usuario.estado === 'break' && usuario.breakEndsAt 
                      ? formatTimeRemaining(usuario.breakEndsAt)
                      : null;
                    
                    return (
                      <tr key={usuario.id}>
                        <td><strong>{usuario.nombre}</strong></td>
                        <td>{usuario.email}</td>
                        <td><code style={{background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px'}}>{usuario.dni}</code></td>
                        <td><span className="role-badge">{usuario.rol}</span></td>
                        <td>
                          <span className={`status-badge ${usuario.estado}`}>
                            {getEstadoLabel(usuario.estado)}
                          </span>
                        </td>
                        <td>
                          {breakTimeRemaining ? (
                            <div className="break-timer">
                              <span className="break-icon">☕</span>
                              <span className="break-time">{breakTimeRemaining}</span>
                              <span className="break-label">restante</span>
                            </div>
                          ) : usuario.estado === 'break' ? (
                            <span className="break-ended">Finalizado</span>
                          ) : (
                            <span className="no-break">-</span>
                          )}
                        </td>
                        {hasPermission('canManageUsers') && (
                          <td>
                            <button className="btn-icon" onClick={() => openModal('edit', 'usuario', usuario)} title="Editar">✏️</button>
                            <button className="btn-icon" onClick={() => openModal('delete', 'usuario', usuario)} title="Eliminar">🗑️</button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'escalations':
        return (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1>Escalaciones</h1>
                <p>Casos derivados a sectores de 2do nivel</p>
              </div>
            </div>
            <div className="escalations-list">
              {escalacionesData.map(esc => (
                <div key={esc.id} className="escalation-card">
                  <div className="escalation-header">
                    <span className={`priority-badge ${esc.prioridad}`}>{esc.prioridad}</span>
                    <span className={`status-badge ${esc.estado}`}>{esc.estado.replace('_', ' ')}</span>
                    <span className="escalation-date">{esc.fecha}</span>
                  </div>
                  <h3>{esc.cliente}</h3>
                  <p className="escalation-motivo">{esc.motivo}</p>
                  <p className="escalation-desc">{esc.descripcion}</p>
                  <div className="escalation-footer">
                    <span>Asignado a: <strong>{esc.asignadoA}</strong></span>
                    {hasPermission('canResolveEscalations') && esc.estado !== 'resuelto' && (
                      <button className="btn-success" style={{marginLeft: 'auto', padding: '8px 16px', fontSize: '13px'}} onClick={() => showNotification('✅ Escalación resuelta')}>
                        ✓ Resolver
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'knowledge':
        const filteredKB = articulosKB.filter(a =>
          a.titulo.toLowerCase().includes(searchKB.toLowerCase()) ||
          a.categoria.toLowerCase().includes(searchKB.toLowerCase())
        );
        const selectedKBItem = articulosKB.find(a => a.id === selectedKB);
        return (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1>Base de Conocimiento</h1>
                <p>Artículos de procedimientos y guías</p>
              </div>
            </div>
            <div className="kb-search">
              <input type="text" placeholder="Buscar artículos..." value={searchKB} onChange={(e) => setSearchKB(e.target.value)} />
            </div>
            <div className="kb-layout">
              <div className="kb-list">
                {filteredKB.map(art => (
                  <div key={art.id} className={`kb-item ${selectedKB === art.id ? 'active' : ''}`} onClick={() => setSelectedKB(art.id)}>
                    <h4>{art.titulo}</h4>
                    <span className="kb-category">{art.categoria}</span>
                  </div>
                ))}
              </div>
              <div className="kb-detail">
                {selectedKBItem ? (
                  <>
                    <span className="kb-category-badge">{selectedKBItem.categoria}</span>
                    <h2>{selectedKBItem.titulo}</h2>
                    <div className="kb-content">
                      {selectedKBItem.contenido.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>Selecciona un artículo</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'quick-replies':
        return (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1>Respuestas Rápidas</h1>
                <p>Plantillas predefinidas para agilizar la atención</p>
              </div>
            </div>
            <div className="quick-replies-grid">
              {respuestasRapidasData.map(qr => (
                <div key={qr.id} className="quick-reply-card">
                  <div className="quick-reply-card-header">
                    <span className="quick-reply-shortcut">{qr.atajo}</span>
                    <span className="quick-reply-category">{qr.categoria}</span>
                  </div>
                  <h3>{qr.titulo}</h3>
                  <p>{qr.contenido}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'metrics':
        return (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1>Métricas</h1>
                <p>Indicadores de atención y satisfacción</p>
              </div>
            </div>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-content">
                  <div className="kpi-value">78%</div>
                  <div className="kpi-label">FCR (First Contact Resolution)</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-content">
                  <div className="kpi-value">4.7/5</div>
                  <div className="kpi-label">CSAT (Satisfacción)</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-content">
                  <div className="kpi-value">1m 42s</div>
                  <div className="kpi-label">TMR (Tiempo Respuesta)</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-content">
                  <div className="kpi-value">8m 32s</div>
                  <div className="kpi-label">AHT (Tiempo Atención)</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'quality':
        return (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1>Calidad</h1>
                <p>Monitoreo de atención y evaluaciones</p>
              </div>
            </div>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-content">
                  <div className="kpi-value">92</div>
                  <div className="kpi-label">Score Promedio</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-content">
                  <div className="kpi-value">24</div>
                  <div className="kpi-label">Chats Monitoreados</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-content">
                  <div className="kpi-value">3</div>
                  <div className="kpi-label">Capacitaciones</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-content">
                  <div className="kpi-value">5</div>
                  <div className="kpi-label">Coaching Pendientes</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="view-container">
            <div className="view-header">
              <h1>Sección en desarrollo</h1>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {notification && <div className="notification">{notification}</div>}

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
          {canAccessView('dashboard') && (
            <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>
              <span className="nav-icon">📊</span>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>
          )}
          {canAccessView('chat') && (
            <button className={`nav-item ${currentView === 'chat' ? 'active' : ''}`} onClick={() => setCurrentView('chat')}>
              <span className="nav-icon">💬</span>
              {!sidebarCollapsed && <span>Chats</span>}
              {conversaciones.filter(c => c.unread).length > 0 && !sidebarCollapsed && (
                <span className="nav-badge">{conversaciones.filter(c => c.unread).length}</span>
              )}
            </button>
          )}
          {canAccessView('customers') && (
            <button className={`nav-item ${currentView === 'customers' ? 'active' : ''}`} onClick={() => setCurrentView('customers')}>
              <span className="nav-icon">👥</span>
              {!sidebarCollapsed && <span>Clientes</span>}
            </button>
          )}
          {canAccessView('orders') && (
            <button className={`nav-item ${currentView === 'orders' ? 'active' : ''}`} onClick={() => setCurrentView('orders')}>
              <span className="nav-icon">📦</span>
              {!sidebarCollapsed && <span>Pedidos</span>}
            </button>
          )}
          {canAccessView('users') && (
            <button className={`nav-item ${currentView === 'users' ? 'active' : ''}`} onClick={() => setCurrentView('users')}>
              <span className="nav-icon">👥</span>
              {!sidebarCollapsed && <span>Equipo de Trabajo</span>}
            </button>
          )}
          {canAccessView('escalations') && (
            <button className={`nav-item ${currentView === 'escalations' ? 'active' : ''}`} onClick={() => setCurrentView('escalations')}>
              <span className="nav-icon">📋</span>
              {!sidebarCollapsed && <span>Escalaciones</span>}
            </button>
          )}
          {canAccessView('knowledge') && (
            <button className={`nav-item ${currentView === 'knowledge' ? 'active' : ''}`} onClick={() => setCurrentView('knowledge')}>
              <span className="nav-icon">📚</span>
              {!sidebarCollapsed && <span>Conocimiento</span>}
            </button>
          )}
          {canAccessView('quick-replies') && (
            <button className={`nav-item ${currentView === 'quick-replies' ? 'active' : ''}`} onClick={() => setCurrentView('quick-replies')}>
              <span className="nav-icon">⚡</span>
              {!sidebarCollapsed && <span>Rápidas</span>}
            </button>
          )}
          {canAccessView('metrics') && (
            <button className={`nav-item ${currentView === 'metrics' ? 'active' : ''}`} onClick={() => setCurrentView('metrics')}>
              <span className="nav-icon">📈</span>
              {!sidebarCollapsed && <span>Métricas</span>}
            </button>
          )}
          {canAccessView('quality') && (
            <button className={`nav-item ${currentView === 'quality' ? 'active' : ''}`} onClick={() => setCurrentView('quality')}>
              <span className="nav-icon">✅</span>
              {!sidebarCollapsed && <span>Calidad</span>}
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          {currentUser && !sidebarCollapsed && (
            <div className="user-info">
              <div className="user-avatar">{currentUser.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}</div>
              <div className="user-details">
                <div className="user-name">{currentUser.nombre}</div>
                <div className="user-role">{currentUser.rol}</div>
              </div>
            </div>
          )}
          <div className="sidebar-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
              {!sidebarCollapsed && <span>{theme === 'light' ? 'Oscuro' : 'Claro'}</span>}
            </button>
            <button className="logout-button" onClick={handleLogout} title="Cerrar sesión">
              🚪
              {!sidebarCollapsed && <span>Salir</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {renderView()}
      </main>

      {showModal && (
        <Modal
          type={modalType}
          resource={modalResource}
          item={selectedItem}
          clientes={clientes}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ==========================================
// CLIENTE VIEW
// ==========================================
function ClienteView({ currentUser, conversaciones, setConversaciones, ordenes, setOrdenes, usuarios, onLogout }: any) {
  const [chatActivo, setChatActivo] = useState<any>(null);
  const [mensajeInput, setMensajeInput] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<string>('');
  const [motivo, setMotivo] = useState('');
  const [pedidosActualizados, setPedidosActualizados] = useState<Orden[]>([]);
  const [chatCargado, setChatCargado] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const misPedidos = pedidosActualizados.length > 0 
    ? pedidosActualizados.filter((o: Orden) => o.clienteNombre === currentUser.nombre)
    : ordenes.filter((o: Orden) => o.clienteNombre === currentUser.nombre);

  useEffect(() => {
    if (!chatCargado && currentUser) {
      const chatExistente = conversaciones.find((c: Conversacion) => 
        c.cliente === currentUser.nombre && 
        (c.estado === 'activo' || c.estado === 'esperando')
      );
      
      if (chatExistente) {
        setChatActivo(chatExistente);
      }
      setChatCargado(true);
    }
  }, [currentUser, conversaciones, chatCargado]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nexo_conversaciones' && e.newValue) {
        try {
          const conversacionesActualizadas = JSON.parse(e.newValue);
          setConversaciones(conversacionesActualizadas);
          
          if (chatActivo) {
            const chatActualizado = conversacionesActualizadas.find((c: Conversacion) => c.id === chatActivo.id);
            if (chatActualizado) {
              const nuevosMensajes = chatActualizado.mensajes.length > chatActivo.mensajes.length;
              if (nuevosMensajes || JSON.stringify(chatActualizado) !== JSON.stringify(chatActivo)) {
                setChatActivo(chatActualizado);
              }
            }
          }
        } catch (err) {
          console.error('Error:', err);
        }
      }
      if (e.key === 'nexo_ordenes' && e.newValue) {
        try {
          const ordenesActualizadas = JSON.parse(e.newValue);
          setOrdenes(ordenesActualizadas);
          setPedidosActualizados(ordenesActualizadas);
        } catch (err) {
          console.error('Error:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const pollingInterval = setInterval(() => {
      const stored = localStorage.getItem('nexo_conversaciones');
      if (stored) {
        try {
          const conversacionesActualizadas = JSON.parse(stored);
          
          setConversaciones((prev: Conversacion[]) => {
            if (JSON.stringify(conversacionesActualizadas) !== JSON.stringify(prev)) {
              return conversacionesActualizadas;
            }
            return prev;
          });
          
          if (chatActivo) {
            const chatActualizado = conversacionesActualizadas.find((c: Conversacion) => c.id === chatActivo.id);
            if (chatActualizado) {
              const tieneNuevosMensajes = chatActualizado.mensajes.length > chatActivo.mensajes.length;
              const cambioEstado = chatActualizado.estado !== chatActivo.estado;
              
              if (tieneNuevosMensajes || cambioEstado || JSON.stringify(chatActualizado) !== JSON.stringify(chatActivo)) {
                setChatActivo(chatActualizado);
              }
            }
          }
        } catch (err) {
          console.error('Error:', err);
        }
      }
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollingInterval);
    };
  }, [chatActivo, setConversaciones, setOrdenes]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatActivo?.mensajes.length]);

  const iniciarChat = () => {
    if (!pedidoSeleccionado || !motivo) {
      alert('Por favor selecciona un pedido y un motivo');
      return;
    }

    const pedido = misPedidos.find((p: Orden) => p.numero === pedidoSeleccionado);
    const nuevoChat: Conversacion = {
      id: Date.now(),
      cliente: currentUser.nombre,
      avatar: currentUser.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2),
      color: 'blue',
      dni: currentUser.dni,
      email: currentUser.email || '',
      tel: currentUser.telefono || '',
      clienteDesde: 2024,
      pedidos: misPedidos.length,
      casos: 0,
      pedido: pedido ? {
        num: pedido.numero,
        producto: pedido.producto,
        monto: pedido.monto,
        entrega: 'Entrega a domicilio',
        fecha: pedido.fecha,
        estado: pedido.estado,
        estadoLabel: getEstadoLabelPedido(pedido.estado)
      } : null,
      motivo: motivo,
      estado: 'esperando',
      tiempo: '0m 00s',
      unread: true,
      ultimoMsg: '',
      mensajes: [
        {
          id: Date.now(),
          tipo: 'sistema',
          texto: 'Chat iniciado · Canal: Web fravega.com',
          hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
          leido: true
        },
        {
          id: Date.now() + 1,
          tipo: 'bot',
          emisor: 'Bot Nexo',
          texto: '¡Hola! 👋 Soy el asistente virtual de Frávega. Un agente te atenderá en breves momentos.',
          hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
          leido: true
        }
      ]
    };

    const nuevasConversaciones = [...conversaciones, nuevoChat];
    setConversaciones(nuevasConversaciones);
    localStorage.setItem('nexo_conversaciones', JSON.stringify(nuevasConversaciones));
    setChatActivo(nuevoChat);
  };

  const enviarMensaje = () => {
    if (!mensajeInput.trim() || !chatActivo) return;

    const nuevoMensaje: Mensaje = {
      id: Date.now(),
      tipo: 'cliente',
      emisor: currentUser.nombre,
      texto: mensajeInput,
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      leido: false
    };

    const conversacionActualizada = {
      ...chatActivo,
      mensajes: [...chatActivo.mensajes, nuevoMensaje],
      ultimoMsg: mensajeInput
    };

    setChatActivo(conversacionActualizada);
    
    const nuevasConversaciones = conversaciones.map((c: Conversacion) => 
      c.id === chatActivo.id ? conversacionActualizada : c
    );
    setConversaciones(nuevasConversaciones);
    localStorage.setItem('nexo_conversaciones', JSON.stringify(nuevasConversaciones));
    
    setMensajeInput('');
  };

  const getAgenteInfo = () => {
    if (!chatActivo || chatActivo.estado === 'esperando') return null;
    const agente = usuarios.find((u: Usuario) => u.rol === 'agent' && u.estado === 'available');
    return agente || usuarios.find((u: Usuario) => u.rol === 'agent');
  };

  const agenteInfo = getAgenteInfo();

  const cerrarChatActual = () => {
    setChatActivo(null);
    setPedidoSeleccionado('');
    setMotivo('');
    setChatCargado(false);
  };

  const handleLogoutCliente = () => {
    localStorage.removeItem('nexo_cliente_session');
    onLogout();
  };

  return (
    <div className="cliente-view">
      <div className="cliente-header">
        <div className="cliente-brand">
          <div className="cliente-logo">N</div>
          <div>
            <h1>Nexo Web Chat</h1>
            <p>Atención al Cliente · Frávega</p>
          </div>
        </div>
        <div className="cliente-user-info">
          <span>👤 {currentUser.nombre}</span>
          {chatActivo && (
            <button className="btn-secondary" onClick={cerrarChatActual} style={{marginRight: '8px'}}>
              🔄 Nuevo Chat
            </button>
          )}
          <button className="btn-secondary" onClick={handleLogoutCliente}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="cliente-content">
        {!chatActivo ? (
          <div className="cliente-inicio">
            <div className="cliente-card">
              <h2>💬 Iniciar Conversación</h2>
              <p>Selecciona un pedido y el motivo de tu consulta</p>
              
              <div className="cliente-form">
                <div className="form-group">
                  <label>Mis Pedidos</label>
                  <select value={pedidoSeleccionado} onChange={(e) => setPedidoSeleccionado(e.target.value)}>
                    <option value="">Seleccionar pedido...</option>
                    {misPedidos.map((p: Orden) => (
                      <option key={p.id} value={p.numero}>
                        {p.numero} - {p.producto} (${p.monto.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Motivo de Consulta</label>
                  <select value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                    <option value="">Seleccionar motivo...</option>
                    <option value="Estado del pedido">Estado del pedido</option>
                    <option value="Demora en entrega">Demora en entrega</option>
                    <option value="Consulta de producto">Consulta de producto</option>
                    <option value="Cambio/Devolución">Cambio/Devolución</option>
                    <option value="Soporte técnico">Soporte técnico</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <button className="btn-primary btn-large" onClick={iniciarChat}>
                  💬 Iniciar Chat
                </button>
              </div>
            </div>

            <div className="cliente-card">
              <h2>📦 Estado de Mis Pedidos</h2>
              <div className="pedidos-list">
                {misPedidos.map((p: Orden) => (
                  <div key={p.id} className="pedido-item">
                    <div className="pedido-header">
                      <strong>{p.numero}</strong>
                      <span className={`status-badge ${p.estado}`}>
                        {getEstadoLabelPedido(p.estado)}
                      </span>
                    </div>
                    <div className="pedido-details">
                      <p>{p.producto}</p>
                      <p className="pedido-monto">${p.monto.toLocaleString()}</p>
                      <p className="pedido-fecha">Entrega: {p.fecha}</p>
                    </div>
                    <div className="pedido-progress">
                      <div className={`progress-bar ${p.estado}`}>
                        <div className={`progress-fill ${p.estado}`}></div>
                      </div>
                      <div className="progress-labels">
                        <span>Preparando</span>
                        <span>Enviando</span>
                        <span>Entregado</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="cliente-chat-container">
            <div className="cliente-chat-main">
              <div className="cliente-chat-header">
                <div className="chat-header-info">
                  <div className="chat-avatar blue">AT</div>
                  <div>
                    <h3>Atención al Cliente</h3>
                    <p>{chatActivo.motivo} · Pedido {chatActivo.pedido?.num}</p>
                  </div>
                </div>
                <div className="chat-status-indicator">
                  {chatActivo.estado === 'esperando' ? (
                    <span className="status-waiting">⏳ Esperando agente...</span>
                  ) : chatActivo.estado === 'activo' ? (
                    <span className="status-active">✅ En atención</span>
                  ) : (
                    <span className="status-resolved">✅ Resuelto</span>
                  )}
                </div>
              </div>

              <div className="cliente-chat-messages">
                {chatActivo.mensajes.map((msg: Mensaje) => (
                  <div key={msg.id} className={`message ${msg.tipo}`}>
                    {msg.tipo !== 'sistema' && (
                      <div className="message-header">
                        <span className="message-sender">{msg.emisor}</span>
                        <span className="message-time">{msg.hora}</span>
                      </div>
                    )}
                    <div className="message-bubble">{msg.texto}</div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="cliente-chat-input">
                <input
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  value={mensajeInput}
                  onChange={(e) => setMensajeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                  disabled={chatActivo.estado === 'resuelto'}
                />
                <button onClick={enviarMensaje} disabled={!mensajeInput.trim() || chatActivo.estado === 'resuelto'}>
                  ➤
                </button>
              </div>
            </div>

            <div className="cliente-chat-sidebar">
              {agenteInfo && chatActivo.estado !== 'esperando' ? (
                <div className="agente-info-card">
                  <h3>👨‍💼 Tu Agente</h3>
                  <div className="agente-details">
                    <div className="agente-avatar-large">
                      {agenteInfo.nombre.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="agente-info">
                      <strong>{agenteInfo.nombre}</strong>
                      <span className={`agente-status ${agenteInfo.estado}`}>
                        {agenteInfo.estado === 'available' ? '🟢 Disponible' :
                         agenteInfo.estado === 'busy' ? '🔴 Ocupado' :
                         agenteInfo.estado === 'break' ? '🟡 En pausa' : '⚫ Desconectado'}
                      </span>
                      <span className="agente-role">Agente de Atención</span>
                      <span className="agente-shift">Turno: 14:00 - 22:00</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="agente-info-card waiting">
                  <h3>⏳ Buscando Agente</h3>
                  <p>Un agente te atenderá en breves momentos...</p>
                </div>
              )}

              {chatActivo.pedido && (() => {
                const pedidosSource = pedidosActualizados.length > 0 ? pedidosActualizados : ordenes;
                const pedidoActualizado = pedidosSource.find((o: Orden) => o.numero === chatActivo.pedido?.num);
                const estadoActual = pedidoActualizado?.estado || chatActivo.pedido.estado;
                const estadoLabelActual = getEstadoLabelPedido(estadoActual);
                
                return (
                  <div className="pedido-info-card">
                    <h3>📦 Tu Pedido</h3>
                    <div className="pedido-details-compact">
                      <p><strong>{chatActivo.pedido.num}</strong></p>
                      <p>{chatActivo.pedido.producto}</p>
                      <p className={`status-badge ${estadoActual}`}>
                        {estadoLabelActual}
                      </p>
                      <p className="pedido-fecha">Entrega: {chatActivo.pedido.fecha}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getEstadoLabelPedido(estado: string): string {
  const map: Record<string, string> = {
    'preparing': 'Preparando',
    'shipping': 'En envío',
    'delivered': 'Entregado',
    'delayed': 'Demorado'
  };
  return map[estado] || estado;
}

// ==========================================
// MODAL COMPONENT
// ==========================================
function Modal({ type, resource, item, clientes, onSave, onClose }: any) {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const title = type === 'create' ? `Nuevo ${resource}` : type === 'edit' ? `Editar ${resource}` : `Eliminar ${resource}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {type === 'delete' ? (
          <>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar este {resource}?</p>
              <p className="text-muted">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn-danger" onClick={() => onSave(item)}>Eliminar</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {resource === 'cliente' && (
                <>
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input type="text" value={formData.nombre || ''} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>DNI *</label>
                    <input type="text" value={formData.dni || ''} onChange={e => setFormData({ ...formData, dni: e.target.value })} required placeholder="Ej: 12345678" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" value={formData.telefono || ''} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Contraseña *</label>
                    <input type="password" value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} required placeholder="Ej: cliente123" />
                  </div>
                  <div className="form-group">
                    <label>Código de Seguridad *</label>
                    <input type="text" value={formData.codigo || ''} onChange={e => setFormData({ ...formData, codigo: e.target.value })} required maxLength={4} placeholder="Ej: 1234" />
                  </div>
                </>
              )}
              {resource === 'orden' && (
                <>
                  <div className="form-group">
                    <label>Número de Pedido *</label>
                    <input type="text" value={formData.numero || ''} onChange={e => setFormData({ ...formData, numero: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Cliente *</label>
                    <select value={formData.clienteId || ''} onChange={e => setFormData({ ...formData, clienteId: parseInt(e.target.value), clienteNombre: clientes.find((c: Cliente) => c.id === parseInt(e.target.value))?.nombre })} required>
                      <option value="">Seleccionar cliente</option>
                      {clientes.map((c: Cliente) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Producto *</label>
                    <input type="text" value={formData.producto || ''} onChange={e => setFormData({ ...formData, producto: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Monto *</label>
                    <input type="number" value={formData.monto || ''} onChange={e => setFormData({ ...formData, monto: parseFloat(e.target.value) })} required />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select value={formData.estado || 'preparing'} onChange={e => setFormData({ ...formData, estado: e.target.value })}>
                      <option value="preparing">Preparando</option>
                      <option value="shipping">Enviando</option>
                      <option value="delivered">Entregado</option>
                      <option value="delayed">Demorado</option>
                    </select>
                  </div>
                </>
              )}
              {resource === 'usuario' && (
                <>
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input type="text" value={formData.nombre || ''} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>DNI *</label>
                    <input type="text" value={formData.dni || ''} onChange={e => setFormData({ ...formData, dni: e.target.value })} required placeholder="Ej: 12345678" />
                  </div>
                  <div className="form-group">
                    <label>Contraseña *</label>
                    <input type="password" value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} required placeholder="Ej: agent123" />
                  </div>
                  <div className="form-group">
                    <label>Código de Seguridad *</label>
                    <input type="text" value={formData.codigo || ''} onChange={e => setFormData({ ...formData, codigo: e.target.value })} required maxLength={4} placeholder="Ej: 1234" />
                  </div>
                  <div className="form-group">
                    <label>Rol *</label>
                    <select value={formData.rol || 'agent'} onChange={e => setFormData({ ...formData, rol: e.target.value })} required>
                      <option value="admin">Administrador</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="agent">Agente</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select value={formData.estado || 'available'} onChange={e => setFormData({ ...formData, estado: e.target.value })}>
                      <option value="available">Disponible</option>
                      <option value="busy">Ocupado</option>
                      <option value="break">En pausa</option>
                      <option value="offline">Desconectado</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primary">{type === 'create' ? 'Crear' : 'Guardar'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
