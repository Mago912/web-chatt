import { useEffect, useRef, useState } from 'react';
import './index.css';

// ==========================================
// DATOS (simulan la base de datos MySQL)
// ==========================================
const clientes = [
  { id: 1, nombre: 'María González', email: 'maria.gonzalez@gmail.com', telefono: '+54 11 5542-8891', dni: '32.456.789', clienteDesde: 2021, pedidosTotales: 7, casosTotales: 2, avatar: 'MG' },
  { id: 2, nombre: 'Carlos Rodríguez', email: 'c.rodriguez@outlook.com', telefono: '+54 11 4421-3356', dni: '28.901.234', clienteDesde: 2019, pedidosTotales: 12, casosTotales: 1, avatar: 'CR' },
  { id: 3, nombre: 'Lucía Fernández', email: 'lucia.fernandez@yahoo.com', telefono: '+54 11 6678-1122', dni: '35.678.432', clienteDesde: 2023, pedidosTotales: 3, casosTotales: 0, avatar: 'LF' },
  { id: 4, nombre: 'Roberto Martínez', email: 'r.martinez@gmail.com', telefono: '+54 11 3345-7788', dni: '24.112.567', clienteDesde: 2020, pedidosTotales: 9, casosTotales: 3, avatar: 'RM' },
  { id: 5, nombre: 'Ana López', email: 'ana.lopez@hotmail.com', telefono: '+54 11 5567-9900', dni: '30.234.890', clienteDesde: 2022, pedidosTotales: 5, casosTotales: 1, avatar: 'AL' }
];

const pedidos = [
  { id: 1, numeroPedido: '#10452', producto: 'Smart TV Samsung 50" UHD 4K', monto: 489999, entrega: 'Entrega a domicilio', fecha: '15-17 Ene 2025', estado: 'en_distribucion' },
  { id: 2, numeroPedido: '#10389', producto: 'Notebook Lenovo IdeaPad 3 15"', monto: 749999, entrega: 'Retiro sucursal Caballito', fecha: '12 Ene 2025', estado: 'en_preparacion' },
  { id: 3, numeroPedido: '#10501', producto: 'Heladera Whirlpool WRM45A 396L', monto: 1299000, entrega: 'Entrega a domicilio', fecha: '20-22 Ene 2025', estado: 'en_preparacion' },
  { id: 4, numeroPedido: '#10298', producto: 'Aire Acond. Samsung WindFree 3200F', monto: 899999, entrega: 'Entrega + Instalación', fecha: '10 Ene 2025', estado: 'entregado' },
  { id: 5, numeroPedido: '#10445', producto: 'Lavarropas Drean Next 8.15', monto: 599999, entrega: 'Entrega a domicilio', fecha: '14 Ene 2025', estado: 'demorado' }
];

const conversacionesData = [
  {
    id: 1, cliente: clientes[0], pedido: pedidos[0], motivo: 'Pedido · Demora en entrega', estado: 'activo', tiempoEspera: '2m 15s',
    ultimoMensaje: '¿Me pueden decir dónde está mi pedido? Ya pasó la fecha estimada.', asignadoA: 'Sofía Ríos', inicio: '14:32',
    mensajes: [
      { id: 1, tipo: 'sistema', emisor: 'Sistema', texto: 'Chat iniciado · Canal: Web fravega.com · Chrome/Windows', hora: '14:32' },
      { id: 2, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte hoy?', hora: '14:32' },
      { id: 3, tipo: 'cliente', emisor: 'María González', texto: 'Hola, compré un Smart TV y no me llegó. Ya pasó la fecha de entrega.', hora: '14:33' },
      { id: 4, tipo: 'bot', emisor: 'Bot Nexo', texto: 'Entiendo tu consulta. Voy a conectarte con un asesor. Un momento por favor...', hora: '14:33' },
      { id: 5, tipo: 'sistema', emisor: 'Sistema', texto: '⚡ Transferido a agente: Sofía Ríos', hora: '14:34' },
      { id: 6, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola María! Buenas tardes. Soy Sofía. Estoy revisando tu pedido en este momento. ¿Podrías confirmarme tu número de pedido?', hora: '14:34' },
      { id: 7, tipo: 'cliente', emisor: 'María González', texto: 'Sí, es el #10452. Es el Smart TV Samsung de 50 pulgadas.', hora: '14:35' },
      { id: 8, tipo: 'agente', emisor: 'Sofía Ríos', texto: 'Perfecto, ya lo ubiqué. Veo que está "En distribución". Déjame consultar con el centro logístico de Monte Grande.', hora: '14:36' },
      { id: 9, tipo: 'cliente', emisor: 'María González', texto: '¿Me pueden decir dónde está mi pedido? Ya pasó la fecha estimada.', hora: '14:37' }
    ]
  },
  {
    id: 2, cliente: clientes[1], pedido: pedidos[1], motivo: 'Preventa · Consulta de stock', estado: 'esperando', tiempoEspera: '4m 02s',
    ultimoMensaje: 'Buenas, quiero saber si tienen la notebook en la sucursal de Caballito.', asignadoA: null, inicio: '14:28',
    mensajes: [
      { id: 10, tipo: 'sistema', emisor: 'Sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:28' },
      { id: 11, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 ¿En qué puedo ayudarte?', hora: '14:28' },
      { id: 12, tipo: 'cliente', emisor: 'Carlos Rodríguez', texto: 'Hola, quiero comprar la notebook Lenovo IdeaPad 3 pero necesito retirarla hoy de Caballito. ¿Tienen stock?', hora: '14:29' },
      { id: 13, tipo: 'cliente', emisor: 'Carlos Rodríguez', texto: 'Buenas, quiero saber si tienen la notebook en la sucursal de Caballito para retirar hoy.', hora: '14:30' }
    ]
  },
  {
    id: 3, cliente: clientes[2], pedido: null, motivo: 'Preventa · Promociones bancarias', estado: 'esperando', tiempoEspera: '1m 48s',
    ultimoMensaje: '¿Qué promos hay con tarjeta de crédito? Busco un aire acondicionado.', asignadoA: null, inicio: '14:30',
    mensajes: [
      { id: 14, tipo: 'sistema', emisor: 'Sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:30' },
      { id: 15, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 ¿En qué puedo ayudarte?', hora: '14:30' },
      { id: 16, tipo: 'cliente', emisor: 'Lucía Fernández', texto: '¿Qué promos hay con tarjeta de crédito? Busco un aire acondicionado.', hora: '14:31' }
    ]
  },
  {
    id: 4, cliente: clientes[3], pedido: pedidos[4], motivo: 'Postventa · Producto dañado', estado: 'activo', tiempoEspera: '0m 45s',
    ultimoMensaje: 'Sí, la caja llegó toda abollada y el tambor tiene un golpe.', asignadoA: 'Martín Pereyra', inicio: '14:20',
    mensajes: [
      { id: 17, tipo: 'sistema', emisor: 'Sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:20' },
      { id: 18, tipo: 'bot', emisor: 'Bot Nexo', texto: '¡Hola! 👋 Soy el asistente virtual de Frávega.', hora: '14:20' },
      { id: 19, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Me llegó el lavarropas pero está dañado. La caja vino golpeada.', hora: '14:21' },
      { id: 20, tipo: 'sistema', emisor: 'Sistema', texto: '⚡ Transferido a agente: Martín Pereyra', hora: '14:22' },
      { id: 21, tipo: 'agente', emisor: 'Martín Pereyra', texto: 'Roberto, lamento lo sucedido. Voy a generar un reclamo. ¿Confirmás tu N° de pedido?', hora: '14:22' },
      { id: 22, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Es el #10445', hora: '14:23' },
      { id: 23, tipo: 'agente', emisor: 'Martín Pereyra', texto: 'Necesito que me envíes fotos del daño. ¿Podés adjuntarlas aquí?', hora: '14:24' },
      { id: 24, tipo: 'cliente', emisor: 'Roberto Martínez', texto: 'Sí, la caja llegó toda abollada y el tambor tiene un golpe.', hora: '14:25' }
    ]
  },
  {
    id: 5, cliente: clientes[4], pedido: pedidos[3], motivo: 'Postventa · Instalación pendiente', estado: 'resuelto', tiempoEspera: '-',
    ultimoMensaje: '¡Muchas gracias! Quedo atenta a la confirmación.', asignadoA: 'Sofía Ríos', inicio: '13:45',
    mensajes: [
      { id: 25, tipo: 'sistema', emisor: 'Sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '13:45' },
      { id: 26, tipo: 'cliente', emisor: 'Ana López', texto: 'Hola, me entregaron el aire pero no vino el técnico a instalarlo.', hora: '13:46' },
      { id: 27, tipo: 'agente', emisor: 'Sofía Ríos', texto: '¡Hola Ana! Revisando tu pedido #10298, veo que la instalación estaba programada. Voy a reagendarla.', hora: '13:47' },
      { id: 28, tipo: 'agente', emisor: 'Sofía Ríos', texto: 'Listo Ana, generé la orden. El técnico pasará entre el 16 y 17 de enero. Te llegará un SMS.', hora: '13:50' },
      { id: 29, tipo: 'cliente', emisor: 'Ana López', texto: '¡Muchas gracias! Quedo atenta a la confirmación.', hora: '13:51' },
      { id: 30, tipo: 'sistema', emisor: 'Sistema', texto: '✅ Caso resuelto · CSAT: 5/5 ⭐', hora: '13:52' }
    ]
  }
];

const respuestasRapidas = [
  { id: 1, atajo: '/saludo', titulo: 'Saludo inicial', contenido: '¡Hola! 👋 Soy [Nombre], asesor/a de Frávega. Estoy revisando tu consulta. ¿Podrías confirmarme tu número de pedido?', categoria: 'General' },
  { id: 2, atajo: '/estado', titulo: 'Consulta estado pedido', contenido: 'Estoy consultando el estado de tu pedido en nuestro sistema logístico. Te pido un momento mientras verifico la información.', categoria: 'Logística' },
  { id: 3, atajo: '/demora', titulo: 'Demora en entrega', contenido: 'Comprendo tu frustración. Voy a escalar tu caso al área de logística para priorizar tu entrega. Te mantendré informado/a.', categoria: 'Logística' },
  { id: 4, atajo: '/retiro', titulo: 'Retiro por tercero', contenido: 'Para retiro por tercero necesitás:\n• Autorización firmada\n• Copia DNI del titular\n• Código de compra\n• DNI original del tercero\n¿Necesitás el modelo de autorización?', categoria: 'Sucursal' },
  { id: 5, atajo: '/cambio', titulo: 'Cambio/Devolución', contenido: 'Dentro de los 10 días podés ejercer tu derecho de cambio/devolución sin costo. Necesito: N° pedido, motivo y fotos si hay daño. ¿Iniciamos?', categoria: 'Postventa' },
  { id: 6, atajo: '/garantia', titulo: 'Consulta garantía', contenido: 'Tu producto tiene garantía oficial del fabricante. Necesito: N° pedido, descripción de falla y fotos. Derivamos al servicio técnico oficial.', categoria: 'Postventa' },
  { id: 7, atajo: '/promos', titulo: 'Promociones bancarias', contenido: 'Promos vigentes:\n🏦 Santander: 3, 6 y 12 cuotas SI\n🏦 Galicia: 3 y 6 cuotas SI + 10%\n🏦 BBVA: 12 y 18 cuotas SI\n🏦 Macro: 6 cuotas SI\n¿Sobre qué producto consultás?', categoria: 'Preventa' },
  { id: 8, atajo: '/cierre', titulo: 'Cierre de chat', contenido: '¡Fue un placer atenderte! 😊 Si tenés otra consulta, no dudes en contactarnos. Al cerrar recibirás una encuesta de satisfacción. ¡Excelente día!', categoria: 'General' }
];

const baseConocimiento = [
  { id: 1, titulo: 'Retiro por tercero en sucursal', categoria: 'Sucursal', procedimiento: '1. Verificar identidad del titular en CRM\n2. Confirmar pedido disponible para retiro\n3. Indicar requisitos: autorización, DNI, código\n4. Enviar modelo de autorización si se solicita\n5. Confirmar sucursal y horario' },
  { id: 2, titulo: 'Escalamiento demora logística (>48hs)', categoria: 'Logística', procedimiento: '1. Validar datos del pedido en TMS\n2. Contactar centro de distribución\n3. Generar orden de destrabe\n4. Informar nueva fecha al cliente\n5. Si >72hs: escalar a Supervisor Postventa' },
  { id: 3, titulo: 'Proceso cambio/devolución (10 días)', categoria: 'Postventa', procedimiento: '1. Verificar fecha de entrega (máx 10 días)\n2. Solicitar motivo\n3. Si hay daño: solicitar fotos\n4. Generar orden logística inversa\n5. Coordinar retiro con transporte\n6. Emitir nota de crédito o reemplazo' },
  { id: 4, titulo: 'Derivación servicio técnico (Garantía)', categoria: 'Postventa', procedimiento: '1. Verificar período de garantía\n2. Recopilar datos y fotos del problema\n3. Identificar centro de servicio oficial\n4. Generar ticket de derivación\n5. Informar plazo: 48hs hábiles\n6. Seguimiento a las 48hs' },
  { id: 5, titulo: 'Validación de identidad', categoria: 'Seguridad', procedimiento: '1. Solicitar nombre completo y DNI\n2. Cruzar con datos en CRM\n3. Confirmar email o teléfono\n4. Si hay pedido: N° o últimos 4 dígitos tarjeta\n5. Si no coincide: NO brindar información\n6. Derivar a Supervisor si hay sospecha' },
  { id: 6, titulo: 'Promociones bancarias vigentes', categoria: 'Preventa', procedimiento: 'Santander: 3, 6, 12 SI en Samsung\nGalicia: 3, 6 SI + 10% extra\nBBVA: 12, 18 SI en LG\nMacro: 6 SI en Whirlpool\nNaranja: 12 SI\nMercado Pago: hasta 12 cuotas\n\nActualizar cada lunes desde intranet.' },
  { id: 7, titulo: 'Manejo de cliente enojado', categoria: 'Calidad', procedimiento: '1. Mantener calma y tono empático\n2. Validar frustración: "Entiendo su molestia"\n3. No usar lenguaje defensivo\n4. Ofrecer solución con plazos\n5. Si pide superior: escalar a Supervisor\n6. Si insultos: advertir y registrar\n7. Documentar todo en ficha' },
  { id: 8, titulo: 'Procedimiento facturación', categoria: 'Administrativo', procedimiento: '1. Solicitar CUIT/CUIL y datos\n2. Verificar si ya fue facturado\n3. Cambio B a A: derivar a Back Office\n4. Duplicado: reenviar por email\n5. Error en datos: nota de crédito + refacturar\n6. Plazo: 48hs hábiles' }
];

const agentes = [
  { id: 1, nombre: 'Sofía Ríos', rol: 'agente', estado: 'ocupado', chats: 3, csat: 4.8, avatar: 'SR' },
  { id: 2, nombre: 'Martín Pereyra', rol: 'agente', estado: 'ocupado', chats: 2, csat: 4.6, avatar: 'MP' },
  { id: 3, nombre: 'Valentina Torres', rol: 'agente', estado: 'disponible', chats: 1, csat: 4.9, avatar: 'VT' },
  { id: 4, nombre: 'Diego Álvarez', rol: 'agente', estado: 'disponible', chats: 2, csat: 4.5, avatar: 'DA' },
  { id: 5, nombre: 'Camila Sánchez', rol: 'agente', estado: 'pausa', chats: 0, csat: 4.7, avatar: 'CS' },
  { id: 6, nombre: 'Nicolás Romero', rol: 'supervisor', estado: 'disponible', chats: 0, csat: 4.8, avatar: 'NR' },
  { id: 7, nombre: 'Laura Gómez', rol: 'agente', estado: 'desconectado', chats: 0, csat: 4.4, avatar: 'LG' }
];

const escalaciones = [
  { id: 1, cliente: 'Roberto Martínez', pedido: '#10445', motivo: 'Producto dañado en entrega', estado: 'en_proceso', prioridad: 'alta', derivadoA: 'Postventa y Reclamos', fecha: '15 Ene 2025', agente: 'Martín Pereyra', desc: 'Lavarropas recibido con caja dañada y golpe en tambor. Fotos adjuntadas.' },
  { id: 2, cliente: 'María González', pedido: '#10452', motivo: 'Demora superior a 72hs', estado: 'en_proceso', prioridad: 'media', derivadoA: 'Back Office Logística', fecha: '15 Ene 2025', agente: 'Sofía Ríos', desc: 'Smart TV con demora en centro de distribución Monte Grande. Fecha vencida.' },
  { id: 3, cliente: 'Pedro Sánchez', pedido: '#10312', motivo: 'Reclamo Defensa del Consumidor', estado: 'pendiente', prioridad: 'critica', derivadoA: 'Escalaciones Complejas', fecha: '14 Ene 2025', agente: 'Valentina Torres', desc: 'Reclamo formal COPREC por producto no entregado en 30 días.' },
  { id: 4, cliente: 'Lucía Fernández', pedido: '#10488', motivo: 'Error en facturación CUIT', estado: 'resuelto', prioridad: 'baja', derivadoA: 'Back Office Facturación', fecha: '13 Ene 2025', agente: 'Diego Álvarez', desc: 'Factura con CUIT incorrecto. Nota de crédito y refacturación generada.' }
];

// ==========================================
// APP COMPONENT
// ==========================================
function App() {
  const [currentView, setCurrentView] = useState('inbox');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const [conversaciones, setConversaciones] = useState<any[]>(conversacionesData);
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [chatFilter, setChatFilter] = useState('todos');
  const [messageInput, setMessageInput] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [kbSearch, setKbSearch] = useState('');
  const [kbCategory, setKbCategory] = useState('Todas');
  const [selectedKB, setSelectedKB] = useState(1);
  const [qrCategory, setQrCategory] = useState('Todas');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = conversaciones.find(c => c.id === selectedChatId) || conversaciones[0];

  const filteredChats = conversaciones.filter(c => {
    if (chatFilter === 'todos') return true;
    if (chatFilter === 'esperando') return c.estado === 'esperando';
    if (chatFilter === 'activos') return c.estado === 'activo';
    if (chatFilter === 'resueltos') return c.estado === 'resuelto';
    return true;
  });

  const filteredKB = baseConocimiento.filter(a => {
    const matchSearch = a.titulo.toLowerCase().includes(kbSearch.toLowerCase()) || a.procedimiento.toLowerCase().includes(kbSearch.toLowerCase());
    const matchCat = kbCategory === 'Todas' || a.categoria === kbCategory;
    return matchSearch && matchCat;
  });

  const filteredQR = respuestasRapidas.filter(r => qrCategory === 'Todas' || r.categoria === qrCategory);
  const kbCategories = ['Todas', ...new Set(baseConocimiento.map(a => a.categoria))];
  const qrCategories = ['Todas', ...new Set(respuestasRapidas.map(r => r.categoria))];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.mensajes.length]);

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    const newMsg = { id: Date.now(), tipo: 'agente', emisor: 'Sofía Ríos', texto: messageInput, hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) };
    const updated = conversaciones.map(c => c.id === selectedChat.id ? { ...c, mensajes: [...c.mensajes, newMsg], ultimoMensaje: messageInput, estado: 'activo' as const } : c);
    setConversaciones(updated);
    setMessageInput('');
  };

  const takeChat = (chatId: number) => {
    const updated = conversaciones.map(c => c.id === chatId ? { ...c, estado: 'activo' as const, asignadoA: 'Sofía Ríos' } : c);
    setConversaciones(updated);
  };

  const resolveChat = () => {
    const updated = conversaciones.map(c => c.id === selectedChatId ? { ...c, estado: 'resuelto' as const } : c);
    setConversaciones(updated);
  };

  const insertQuickResponse = (content: string) => {
    setMessageInput(content);
    setShowQR(false);
  };

  const getEstadoBadge = (estado: string) => {
    const map: Record<string, string> = { esperando: 'badge-waiting', activo: 'badge-active', resuelto: 'badge-resolved', cerrado: 'badge-closed' };
    return map[estado] || 'badge-closed';
  };

  const getEstadoLabel = (estado: string) => {
    const map: Record<string, string> = { esperando: 'Esperando', activo: 'En atención', resuelto: 'Resuelto', cerrado: 'Cerrado' };
    return map[estado] || estado;
  };

  const getProgressClass = (estado: string) => {
    const map: Record<string, string> = { en_preparacion: 'preparing', en_distribucion: 'distributing', entregado: 'delivered', demorado: 'delayed' };
    return map[estado] || 'preparing';
  };

  const getEstadoLogLabel = (estado: string) => {
    const map: Record<string, string> = { en_preparacion: 'En preparación', en_distribucion: 'En distribución', entregado: 'Entregado', demorado: 'Demorado' };
    return map[estado] || estado;
  };

  const getLogBadgeClass = (estado: string) => {
    const map: Record<string, string> = { en_preparacion: 'badge-waiting', en_distribucion: 'badge-active', entregado: 'badge-resolved', demorado: 'badge-priority-critical' };
    return map[estado] || '';
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">N</div>
              <div className="sidebar-logo-text">
                <h1>Nexo WebChat</h1>
                <p>Frávega · Atención Digital</p>
              </div>
            </div>
          )}
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <i className={`fas ${sidebarCollapsed ? 'fa-angle-right' : 'fa-angle-left'}`}></i>
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="sidebar-agent">
            <div className="agent-avatar">SR<span className="status-dot online"></span></div>
            <div className="agent-info">
              <p>Sofía Ríos</p>
              <span>Agente · Disponible</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {[
            { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
            { id: 'inbox', icon: 'fa-inbox', label: 'Bandeja de Chats', badge: 4 },
            { id: 'escalations', icon: 'fa-arrow-up-right-from-square', label: 'Escalaciones', badge: 2 },
            { id: 'knowledge', icon: 'fa-book', label: 'Base de Conocimiento' },
            { id: 'quick-responses', icon: 'fa-bolt', label: 'Respuestas Rápidas' },
            { id: 'quality', icon: 'fa-clipboard-check', label: 'Calidad' },
            { id: 'metrics', icon: 'fa-chart-bar', label: 'Métricas' },
            { id: 'organigrama', icon: 'fa-sitemap', label: 'Organigrama' },
          ].map(item => (
            <button key={item.id} className={`nav-item ${currentView === item.id ? 'active' : ''}`} onClick={() => setCurrentView(item.id)}>
              <i className={`fas ${item.icon}`}></i>
              {!sidebarCollapsed && <span>{item.label}</span>}
              {item.badge && !sidebarCollapsed && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <p><i className="fas fa-clock"></i> Turno: 14:00 - 22:00</p>
            <p><i className="fas fa-headset"></i> Chats activos: 3/4</p>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* ========== DASHBOARD ========== */}
        {currentView === 'dashboard' && (
          <div className="view-container">
            <div className="page-header">
              <h1>Dashboard</h1>
              <p>Resumen en tiempo real · Atención Web/Chat Frávega</p>
            </div>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-card-header"><span>En Espera</span><div className="kpi-icon orange"><i className="fas fa-clock"></i></div></div>
                <div className="kpi-value">4</div>
                <div className="kpi-subtitle">Chats en cola</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-card-header"><span>En Atención</span><div className="kpi-icon blue"><i className="fas fa-comments"></i></div></div>
                <div className="kpi-value">5</div>
                <div className="kpi-subtitle">Chats activos</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-card-header"><span>1ra Respuesta</span><div className="kpi-icon green"><i className="fas fa-stopwatch"></i></div></div>
                <div className="kpi-value">1m 42s</div>
                <div className="kpi-subtitle">Tiempo medio</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-card-header"><span>Satisfacción</span><div className="kpi-icon yellow"><i className="fas fa-star"></i></div></div>
                <div className="kpi-value">4.7/5</div>
                <div className="kpi-subtitle">CSAT promedio</div>
              </div>
            </div>
            <div className="grid-3 mb-6">
              <div className="card">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-2">
                    <span style={{fontSize:'11px',color:'var(--texto-suave)',fontWeight:600,textTransform:'uppercase'}}>FCR</span>
                    <span className="badge badge-active">+3%</span>
                  </div>
                  <div style={{fontSize:'24px',fontWeight:700,color:'var(--azul-oscuro)'}}>78%</div>
                  <div className="metric-progress-bar mt-2"><div className="metric-progress-fill" style={{width:'78%',background:'var(--verde)'}}></div></div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-2">
                    <span style={{fontSize:'11px',color:'var(--texto-suave)',fontWeight:600,textTransform:'uppercase'}}>Chats Hoy</span>
                    <span className="badge badge-resolved">En curso</span>
                  </div>
                  <div style={{fontSize:'24px',fontWeight:700,color:'var(--azul-oscuro)'}}>47</div>
                  <div style={{fontSize:'11px',color:'var(--texto-suave)',marginTop:'4px'}}>38 resueltos · 9 pendientes</div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-2">
                    <span style={{fontSize:'11px',color:'var(--texto-suave)',fontWeight:600,textTransform:'uppercase'}}>NPS Score</span>
                    <span style={{fontSize:'10px',padding:'2px 8px',borderRadius:'10px',background:'var(--purple-claro)',color:'var(--purple)'}}>Bueno</span>
                  </div>
                  <div style={{fontSize:'24px',fontWeight:700,color:'var(--azul-oscuro)'}}>72</div>
                  <div style={{fontSize:'11px',color:'var(--texto-suave)',marginTop:'4px'}}>Net Promoter Score</div>
                </div>
              </div>
            </div>
            <div className="grid-3">
              <div className="card">
                <div className="card-header"><h3>Estado de Agentes</h3><p>2 disponibles de 7</p></div>
                <div className="card-body" style={{padding:'12px'}}>
                  {agentes.map(a => (
                    <div key={a.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px',borderRadius:'8px',marginBottom:'4px'}}>
                      <div className="agent-avatar" style={{width:'30px',height:'30px',fontSize:'10px'}}>
                        {a.avatar}
                        <span className={`status-dot ${a.estado === 'disponible' ? 'online' : a.estado === 'ocupado' ? 'busy' : 'offline'}`}></span>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'12px',fontWeight:500,color:'var(--azul-oscuro)'}}>{a.nombre}</div>
                        <div style={{fontSize:'10px',color:'var(--texto-suave)'}}>
                          {a.estado === 'disponible' ? 'Disponible' : a.estado === 'ocupado' ? `Ocupado (${a.chats})` : a.estado === 'pausa' ? 'En pausa' : 'Desconectado'}
                        </div>
                      </div>
                      <span style={{fontSize:'11px',fontWeight:600}}>⭐ {a.csat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h3>Actividad Reciente</h3></div>
                <div className="card-body" style={{padding:'12px'}}>
                  {[
                    {icon:'fa-circle-check',color:'var(--verde)',text:'Caso #10298 resuelto por Sofía Ríos',time:'Hace 5 min'},
                    {icon:'fa-arrow-up',color:'var(--naranja)',text:'Pedido #10445 escalado a Postventa',time:'Hace 12 min'},
                    {icon:'fa-user-plus',color:'var(--azul-corporativo)',text:'Nuevo chat asignado a Martín Pereyra',time:'Hace 15 min'},
                    {icon:'fa-star',color:'var(--amarillo)',text:'CSAT 5/5 recibido de Ana López',time:'Hace 20 min'},
                    {icon:'fa-robot',color:'var(--purple)',text:'Bot Nexo resolvió 3 consultas',time:'Hace 25 min'},
                  ].map((item,i) => (
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'8px',borderRadius:'8px',marginBottom:'4px'}}>
                      <div style={{width:'26px',height:'26px',borderRadius:'50%',background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <i className={`fas ${item.icon}`} style={{fontSize:'10px',color:item.color}}></i>
                      </div>
                      <div>
                        <div style={{fontSize:'12px',color:'var(--azul-oscuro)'}}>{item.text}</div>
                        <div style={{fontSize:'10px',color:'var(--texto-suave)'}}>{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h3>Acciones Rápidas</h3></div>
                <div className="card-body">
                  {[
                    {icon:'fa-inbox',color:'var(--azul-corporativo)',bg:'var(--azul-claro)',label:'Ir a Bandeja',sub:'4 en espera · 2 activos',view:'inbox'},
                    {icon:'fa-book',color:'var(--verde)',bg:'var(--verde-claro)',label:'Base de Conocimiento',sub:'8 artículos',view:'knowledge'},
                    {icon:'fa-chart-bar',color:'var(--purple)',bg:'var(--purple-claro)',label:'Ver Métricas',sub:'FCR, CSAT, NPS',view:'metrics'},
                    {icon:'fa-sitemap',color:'var(--naranja)',bg:'var(--naranja-claro)',label:'Organigrama',sub:'Estructura del área',view:'organigrama'},
                  ].map((item,i) => (
                    <button key={i} onClick={() => setCurrentView(item.view)} style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'12px',borderRadius:'10px',border:'1px solid var(--borde)',background:'white',cursor:'pointer',marginBottom:'8px',textAlign:'left',transition:'var(--transicion)'}}>
                      <div style={{width:'38px',height:'38px',borderRadius:'8px',background:item.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <i className={`fas ${item.icon}`} style={{color:item.color}}></i>
                      </div>
                      <div>
                        <div style={{fontSize:'13px',fontWeight:500,color:'var(--azul-oscuro)'}}>{item.label}</div>
                        <div style={{fontSize:'11px',color:'var(--texto-suave)'}}>{item.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== CHAT INBOX ========== */}
        {currentView === 'inbox' && (
          <div className="chat-layout">
            {/* Panel 1: Queue */}
            <div className="chat-queue">
              <div className="chat-queue-header">
                <h2>Bandeja de Chats</h2>
                <p>{filteredChats.length} conversaciones</p>
              </div>
              <div className="chat-filters">
                {['todos','esperando','activos','resueltos'].map(f => (
                  <button key={f} className={`filter-btn ${chatFilter === f ? 'active' : ''}`} onClick={() => setChatFilter(f)}>
                    {f === 'todos' ? 'Todos' : f === 'esperando' ? 'Esperando' : f === 'activos' ? 'Activos' : 'Resueltos'}
                  </button>
                ))}
              </div>
              <div className="chat-list">
                {filteredChats.map(chat => (
                  <button key={chat.id} className={`chat-item ${selectedChatId === chat.id ? 'active' : ''}`} onClick={() => setSelectedChatId(chat.id)}>
                    <div className="chat-avatar">{chat.cliente.avatar}</div>
                    <div className="chat-item-info">
                      <div className="chat-item-top">
                        <span className="chat-item-name">{chat.cliente.nombre}</span>
                        <span className="chat-item-time">{chat.inicio}</span>
                      </div>
                      <div className="chat-item-message">{chat.ultimoMensaje}</div>
                      <div className="chat-item-meta">
                        <span className={`badge ${getEstadoBadge(chat.estado)}`}>{getEstadoLabel(chat.estado)}</span>
                        {chat.estado === 'esperando' && <span className="wait-time"><i className="fas fa-clock"></i> {chat.tiempoEspera}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Panel 2: Chat Room */}
            <div className="chat-room">
              <div className="chat-room-header">
                <div className="chat-room-user">
                  <div className="chat-avatar">{selectedChat.cliente.avatar}</div>
                  <div className="chat-room-user-info">
                    <h3>{selectedChat.cliente.nombre}</h3>
                    <p>{selectedChat.motivo} · DNI: {selectedChat.cliente.dni}</p>
                  </div>
                </div>
                <div className="chat-room-actions">
                  <span className={`badge ${getEstadoBadge(selectedChat.estado)}`}>{getEstadoLabel(selectedChat.estado)}</span>
                  {selectedChat.estado === 'esperando' && (
                    <button className="btn btn-primary btn-sm" onClick={() => takeChat(selectedChat.id)}>
                      <i className="fas fa-hand"></i> Tomar chat
                    </button>
                  )}
                  {selectedChat.estado === 'activo' && (
                    <button className="btn btn-success btn-sm" onClick={resolveChat}>
                      <i className="fas fa-check"></i> Resolver
                    </button>
                  )}
                </div>
              </div>

              <div className="chat-messages">
                {selectedChat.mensajes.map((msg: any) => (
                  <div key={msg.id} className={`message ${msg.tipo === 'agente' ? 'sent' : msg.tipo === 'sistema' ? 'system' : 'received'} ${msg.tipo === 'bot' ? 'bot' : ''}`}>
                    {msg.tipo !== 'sistema' && (
                      <div className="message-meta">
                        {msg.tipo === 'bot' && <i className="fas fa-robot" style={{fontSize:'9px',color:'var(--purple)'}}></i>}
                        <span>{msg.emisor} · {msg.hora}</span>
                      </div>
                    )}
                    <div className="message-bubble">{msg.texto}</div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="chat-input-area">
                <div className="chat-toolbar">
                  <button className={`toolbar-btn ${showQR ? 'active' : ''}`} onClick={() => setShowQR(!showQR)}>
                    <i className="fas fa-bolt"></i> Respuestas rápidas
                  </button>
                  <button className="toolbar-btn"><i className="fas fa-paperclip"></i> Adjuntar</button>
                </div>
                {showQR && (
                  <div className="quick-responses-dropdown">
                    {respuestasRapidas.map(rr => (
                      <div key={rr.id} className="qr-item" onClick={() => insertQuickResponse(rr.contenido)}>
                        <div className="qr-item-header">
                          <span className="qr-atajo">{rr.atajo}</span>
                          <span className="qr-titulo">{rr.titulo}</span>
                        </div>
                        <div className="qr-contenido">{rr.contenido}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="chat-input-row">
                  <input type="text" className="chat-input" placeholder="Escribí tu respuesta..." value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                  <button className="send-btn" onClick={sendMessage} disabled={!messageInput.trim()}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Panel 3: Client Context */}
            <div className="client-context">
              <div className="context-section">
                <h4>Perfil del Cliente</h4>
                <div className="client-profile">
                  <div className="chat-avatar" style={{width:'48px',height:'48px',fontSize:'14px'}}>{selectedChat.cliente.avatar}</div>
                  <div className="client-profile-info">
                    <h3>{selectedChat.cliente.nombre}</h3>
                    <p>Cliente desde {selectedChat.cliente.clienteDesde}</p>
                  </div>
                </div>
                <div className="client-details">
                  <div className="client-detail"><i className="fas fa-envelope"></i><span>{selectedChat.cliente.email}</span></div>
                  <div className="client-detail"><i className="fas fa-phone"></i><span>{selectedChat.cliente.telefono}</span></div>
                  <div className="client-detail"><i className="fas fa-id-card"></i><span>DNI: {selectedChat.cliente.dni}</span></div>
                </div>
              </div>
              <div className="context-section">
                <div className="client-stats">
                  <div className="stat-box"><div className="stat-value">{selectedChat.cliente.pedidosTotales}</div><div className="stat-label">Pedidos</div></div>
                  <div className="stat-box orange"><div className="stat-value">{selectedChat.cliente.casosTotales}</div><div className="stat-label">Casos previos</div></div>
                </div>
              </div>
              {selectedChat.pedido && (
                <div className="context-section">
                  <h4>Pedido en consulta</h4>
                  <div className="order-card">
                    <div className="order-card-header">
                      <span className="order-number">{selectedChat.pedido.numeroPedido}</span>
                      <span className={`badge ${getLogBadgeClass(selectedChat.pedido.estado)}`}>{getEstadoLogLabel(selectedChat.pedido.estado)}</span>
                    </div>
                    <div className="order-product">{selectedChat.pedido.producto}</div>
                    <div className="order-details">
                      <div className="order-detail-row"><span>Monto:</span><span className="value">${selectedChat.pedido.monto.toLocaleString('es-AR')}</span></div>
                      <div className="order-detail-row"><span>Entrega:</span><span>{selectedChat.pedido.entrega}</span></div>
                      <div className="order-detail-row"><span>Fecha est.:</span><span>{selectedChat.pedido.fecha}</span></div>
                    </div>
                    <div className="progress-tracker">
                      <div className="progress-labels"><span>Preparando</span><span>En camino</span><span>Entregado</span></div>
                      <div className="progress-bar"><div className={`progress-fill ${getProgressClass(selectedChat.pedido.estado)}`}></div></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="context-section">
                <h4>Motivo de contacto</h4>
                <div className="client-detail"><i className="fas fa-tag" style={{color:'var(--azul-corporativo)'}}></i><span>{selectedChat.motivo}</span></div>
              </div>
              <div className="context-section">
                <h4>Artículos relacionados</h4>
                {baseConocimiento.slice(0, 3).map(art => (
                  <div key={art.id} style={{padding:'8px',borderRadius:'8px',border:'1px solid var(--borde)',marginBottom:'6px',cursor:'pointer',transition:'var(--transicion)'}} onClick={() => { setCurrentView('knowledge'); setSelectedKB(art.id); }}>
                    <div style={{fontSize:'12px',fontWeight:500,color:'var(--azul-oscuro)'}}>{art.titulo}</div>
                    <div style={{fontSize:'10px',color:'var(--texto-suave)',marginTop:'2px'}}>{art.categoria}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== KNOWLEDGE BASE ========== */}
        {currentView === 'knowledge' && (
          <div className="view-container">
            <div className="page-header">
              <h1>Base de Conocimiento</h1>
              <p>Artículos de procedimientos y guías internas</p>
            </div>
            <div className="kb-search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Buscar artículos..." value={kbSearch} onChange={e => setKbSearch(e.target.value)} />
            </div>
            <div className="kb-categories">
              {kbCategories.map(cat => (
                <button key={cat} className={`filter-btn ${kbCategory === cat ? 'active' : ''}`} onClick={() => setKbCategory(cat)}>{cat}</button>
              ))}
            </div>
            <div className="kb-layout">
              <div className="kb-article-list">
                {filteredKB.map(art => (
                  <button key={art.id} className={`kb-article-item ${selectedKB === art.id ? 'active' : ''}`} onClick={() => setSelectedKB(art.id)}>
                    <h4>{art.titulo}</h4>
                    <span className="kb-cat">{art.categoria}</span>
                  </button>
                ))}
              </div>
              <div className="kb-detail">
                {(() => {
                  const art = baseConocimiento.find(a => a.id === selectedKB);
                  if (!art) return <div className="empty-state"><i className="fas fa-book-open"></i><p>Seleccioná un artículo</p></div>;
                  return (
                    <>
                      <span className="badge badge-resolved" style={{marginBottom:'12px',display:'inline-block'}}>{art.categoria}</span>
                      <h2>{art.titulo}</h2>
                      <div className="kb-procedure">
                        <h3>Procedimiento</h3>
                        {art.procedimiento.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ========== QUICK RESPONSES ========== */}
        {currentView === 'quick-responses' && (
          <div className="view-container">
            <div className="page-header">
              <h1>Respuestas Rápidas</h1>
              <p>Plantillas predefinidas para agilizar la atención</p>
            </div>
            <div className="kb-categories mb-4">
              {qrCategories.map(cat => (
                <button key={cat} className={`filter-btn ${qrCategory === cat ? 'active' : ''}`} onClick={() => setQrCategory(cat)}>{cat}</button>
              ))}
            </div>
            <div className="grid-2">
              {filteredQR.map(rr => (
                <div key={rr.id} className="card" style={{padding:'16px'}}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{fontFamily:'monospace',fontSize:'11px',background:'var(--azul-oscuro)',color:'white',padding:'2px 8px',borderRadius:'4px'}}>{rr.atajo}</span>
                      <span className="badge badge-resolved">{rr.categoria}</span>
                    </div>
                    <button className="toolbar-btn"><i className="fas fa-copy"></i></button>
                  </div>
                  <h3 style={{fontSize:'14px',fontWeight:600,color:'var(--azul-oscuro)',marginBottom:'8px'}}>{rr.titulo}</h3>
                  <p style={{fontSize:'12px',color:'var(--texto-claro)',lineHeight:'1.6',whiteSpace:'pre-line'}}>{rr.contenido}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== METRICS ========== */}
        {currentView === 'metrics' && (
          <div className="view-container">
            <div className="page-header">
              <h1>Métricas y Experiencia del Cliente</h1>
              <p>Indicadores de atención, satisfacción y mejora continua</p>
            </div>
            <div className="kpi-grid">
              <div className="kpi-card" style={{borderColor:'#bbf7d0',background:'#f0fdf4'}}>
                <div className="kpi-card-header"><span>FCR</span><span className="badge badge-active">+3%</span></div>
                <div className="kpi-value">78%</div>
                <div className="kpi-subtitle">First Contact Resolution</div>
              </div>
              <div className="kpi-card" style={{borderColor:'#fde68a',background:'#fffbeb'}}>
                <div className="kpi-card-header"><span>CSAT</span><span className="badge badge-active">+0.2</span></div>
                <div className="kpi-value">4.7/5</div>
                <div className="kpi-subtitle">Satisfacción del Cliente</div>
              </div>
              <div className="kpi-card" style={{borderColor:'#c7d8f5',background:'#eff6ff'}}>
                <div className="kpi-card-header"><span>TMR</span><span className="badge badge-active">-12s</span></div>
                <div className="kpi-value">2m 15s</div>
                <div className="kpi-subtitle">Tiempo Medio de Respuesta</div>
              </div>
              <div className="kpi-card" style={{borderColor:'#e9d5ff',background:'#faf5ff'}}>
                <div className="kpi-card-header"><span>AHT</span><span className="badge badge-active">-45s</span></div>
                <div className="kpi-value">8m 32s</div>
                <div className="kpi-subtitle">Average Handle Time</div>
              </div>
            </div>
            <div className="grid-2 mb-6">
              <div className="card">
                <div className="card-header"><h3>Distribución CSAT (30 días)</h3></div>
                <div className="card-body">
                  {[{stars:5,pct:62,color:'var(--verde)'},{stars:4,pct:24,color:'var(--azul-corporativo)'},{stars:3,pct:9,color:'var(--amarillo)'},{stars:2,pct:3,color:'var(--naranja)'},{stars:1,pct:2,color:'var(--rojo)'}].map(item => (
                    <div key={item.stars} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                      <span style={{fontSize:'12px',color:'var(--texto-suave)',width:'30px'}}>{item.stars} ★</span>
                      <div style={{flex:1,height:'22px',background:'#f1f5f9',borderRadius:'11px',overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${item.pct}%`,background:item.color,borderRadius:'11px',display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:'8px'}}>
                          <span style={{fontSize:'10px',color:'white',fontWeight:600}}>{item.pct}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h3>Volumen de Chats (7 días)</h3></div>
                <div className="card-body">
                  <div className="metric-chart">
                    {[{d:'Lun',v:42},{d:'Mar',v:55},{d:'Mié',v:48},{d:'Jue',v:61},{d:'Vie',v:53},{d:'Sáb',v:38},{d:'Dom',v:22}].map((item,i) => (
                      <div key={i} className="chart-bar">
                        <span className="chart-value">{item.v}</span>
                        <div className="chart-bar-fill" style={{height:`${(item.v/65)*100}%`}}></div>
                        <span>{item.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-3">
              <div className="card">
                <div className="card-header"><h3>Net Promoter Score</h3></div>
                <div className="card-body text-center">
                  <div style={{fontSize:'36px',fontWeight:700,color:'var(--azul-corporativo)',marginBottom:'8px'}}>72</div>
                  <div style={{display:'flex',justifyContent:'center',gap:'16px',fontSize:'11px',color:'var(--texto-suave)'}}>
                    <span><span style={{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',background:'var(--verde)',marginRight:'4px'}}></span>Promotores: 68%</span>
                    <span><span style={{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',background:'var(--amarillo)',marginRight:'4px'}}></span>Pasivos: 18%</span>
                    <span><span style={{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',background:'var(--rojo)',marginRight:'4px'}}></span>Detractores: 14%</span>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h3>Motivos de Contacto</h3></div>
                <div className="card-body">
                  {[{m:'Seguimiento de pedido',p:35},{m:'Consulta de stock',p:22},{m:'Promociones / Cuotas',p:18},{m:'Reclamo / Postventa',p:15},{m:'Retiro en sucursal',p:10}].map((item,i) => (
                    <div key={i} className="metric-progress">
                      <div className="metric-progress-header"><span className="label">{item.m}</span><span className="value">{item.p}%</span></div>
                      <div className="metric-progress-bar"><div className="metric-progress-fill" style={{width:`${item.p}%`,background:'var(--azul-corporativo)'}}></div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h3>Cumplimiento SLA</h3></div>
                <div className="card-body">
                  {[{l:'1ra respuesta < 2min',v:92,c:'var(--verde)'},{l:'Resolución < 15min',v:78,c:'var(--azul-corporativo)'},{l:'Encuesta completada',v:85,c:'var(--purple)'},{l:'Chats sin abandono',v:94,c:'var(--naranja)'}].map((item,i) => (
                    <div key={i} className="metric-progress">
                      <div className="metric-progress-header"><span className="label">{item.l}</span><span className="value" style={{color:item.c}}>{item.v}%</span></div>
                      <div className="metric-progress-bar"><div className="metric-progress-fill" style={{width:`${item.v}%`,background:item.c}}></div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== QUALITY ========== */}
        {currentView === 'quality' && (
          <div className="view-container">
            <div className="page-header">
              <h1>Calidad y Capacitación</h1>
              <p>Monitoreo de atención, control de calidad y coaching</p>
            </div>
            <div className="kpi-grid">
              <div className="card" style={{textAlign:'center',padding:'20px'}}>
                <div className="quality-score-circle green"><span>92</span></div>
                <div style={{fontSize:'12px',color:'var(--texto-suave)'}}>Score Calidad Promedio</div>
                <div style={{fontSize:'10px',color:'var(--verde)',marginTop:'4px'}}>+2 vs mes anterior</div>
              </div>
              <div className="card" style={{textAlign:'center',padding:'20px'}}>
                <div className="quality-score-circle blue"><span>24</span></div>
                <div style={{fontSize:'12px',color:'var(--texto-suave)'}}>Chats Monitoreados</div>
                <div style={{fontSize:'10px',color:'var(--texto-suave)',marginTop:'4px'}}>Esta semana</div>
              </div>
              <div className="card" style={{textAlign:'center',padding:'20px'}}>
                <div className="quality-score-circle purple"><span>3</span></div>
                <div style={{fontSize:'12px',color:'var(--texto-suave)'}}>Capacitaciones</div>
                <div style={{fontSize:'10px',color:'var(--texto-suave)',marginTop:'4px'}}>Programadas este mes</div>
              </div>
              <div className="card" style={{textAlign:'center',padding:'20px'}}>
                <div className="quality-score-circle orange"><span>5</span></div>
                <div style={{fontSize:'12px',color:'var(--texto-suave)'}}>Coaching 1:1</div>
                <div style={{fontSize:'10px',color:'var(--texto-suave)',marginTop:'4px'}}>Pendientes</div>
              </div>
            </div>
            <div className="card mb-6">
              <div className="card-header"><h3>Matriz de Evaluación por Agente</h3><p>Último período de evaluación</p></div>
              <div style={{overflowX:'auto'}}>
                <table className="data-table">
                  <thead>
                    <tr><th>Agente</th><th style={{textAlign:'center'}}>Tono/Empatía</th><th style={{textAlign:'center'}}>Precisión Técnica</th><th style={{textAlign:'center'}}>Resp. Rápidas</th><th style={{textAlign:'center'}}>Tiempos</th><th style={{textAlign:'center'}}>Score</th></tr>
                  </thead>
                  <tbody>
                    {agentes.filter(a => a.rol === 'agente').map((agente, idx) => (
                      <tr key={agente.id}>
                        <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="agent-avatar" style={{width:'28px',height:'28px',fontSize:'10px'}}>{agente.avatar}</div><span style={{fontSize:'12px',fontWeight:500}}>{agente.nombre}</span></div></td>
                        <td style={{textAlign:'center'}}><span className={`score-badge ${[9,8,9,7,8][idx] >= 9 ? 'high' : [9,8,9,7,8][idx] >= 7 ? 'medium' : 'low'}`}>{[9,8,9,7,8][idx]}/10</span></td>
                        <td style={{textAlign:'center'}}><span className={`score-badge ${[8,7,9,8,7][idx] >= 9 ? 'high' : [8,7,9,8,7][idx] >= 7 ? 'medium' : 'low'}`}>{[8,7,9,8,7][idx]}/10</span></td>
                        <td style={{textAlign:'center'}}><span className={`score-badge ${[9,8,7,9,8][idx] >= 9 ? 'high' : [9,8,7,9,8][idx] >= 7 ? 'medium' : 'low'}`}>{[9,8,7,9,8][idx]}/10</span></td>
                        <td style={{textAlign:'center'}}><span className={`score-badge ${[8,9,8,7,9][idx] >= 9 ? 'high' : [8,9,8,7,9][idx] >= 7 ? 'medium' : 'low'}`}>{[8,9,8,7,9][idx]}/10</span></td>
                        <td style={{textAlign:'center',fontWeight:700,color:'var(--azul-oscuro)'}}>{agente.csat}/5</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid-2">
              <div className="card">
                <div className="card-header"><h3>Capacitaciones Programadas</h3></div>
                <div className="card-body">
                  {[{t:'Nuevo procedimiento garantías Samsung',d:'22 Ene · 10:00',tipo:'Técnica',n:7},{t:'Manejo de clientes conflictivos',d:'24 Ene · 14:00',tipo:'Habilidades blandas',n:5},{t:'Actualización promos Febrero',d:'28 Ene · 09:00',tipo:'Producto',n:7}].map((item,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px',borderRadius:'8px',border:'1px solid var(--borde)',marginBottom:'8px'}}>
                      <div style={{width:'38px',height:'38px',borderRadius:'8px',background:'var(--purple-claro)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><i className="fas fa-graduation-cap" style={{color:'var(--purple)'}}></i></div>
                      <div style={{flex:1}}><div style={{fontSize:'12px',fontWeight:500,color:'var(--azul-oscuro)'}}>{item.t}</div><div style={{fontSize:'10px',color:'var(--texto-suave)'}}>{item.d}</div></div>
                      <div style={{textAlign:'right'}}><span className="badge badge-resolved">{item.tipo}</span><div style={{fontSize:'10px',color:'var(--texto-suave)',marginTop:'4px'}}>{item.n} agentes</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h3>Coaching 1:1 Pendientes</h3></div>
                <div className="card-body">
                  {[{a:'Camila Sánchez',t:'Mejora en tiempos de respuesta',p:'Media',d:'20 Ene'},{a:'Diego Álvarez',t:'Uso correcto de respuestas rápidas',p:'Alta',d:'21 Ene'},{a:'Laura Gómez',t:'Tono empático en reclamos',p:'Media',d:'23 Ene'}].map((item,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px',borderRadius:'8px',border:'1px solid var(--borde)',marginBottom:'8px'}}>
                      <div style={{width:'38px',height:'38px',borderRadius:'8px',background:'var(--naranja-claro)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><i className="fas fa-user-edit" style={{color:'var(--naranja)'}}></i></div>
                      <div style={{flex:1}}><div style={{fontSize:'12px',fontWeight:500,color:'var(--azul-oscuro)'}}>{item.a}</div><div style={{fontSize:'10px',color:'var(--texto-suave)'}}>{item.t}</div></div>
                      <div style={{textAlign:'right'}}><span className={`badge ${item.p === 'Alta' ? 'badge-priority-critical' : 'badge-waiting'}`}>{item.p}</span><div style={{fontSize:'10px',color:'var(--texto-suave)',marginTop:'4px'}}>{item.d}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== ORGANIGRAMA ========== */}
        {currentView === 'organigrama' && (
          <div className="view-container">
            <div className="page-header">
              <h1>Organigrama del Área</h1>
              <p>Estructura de Atención al Cliente · Frávega</p>
            </div>
            <div className="card" style={{padding:'24px'}}>
              <div className="org-chart">
                <div className="org-level"><div className="org-box level-1"><i className="fas fa-crown" style={{marginBottom:'4px'}}></i><h3>Gerencia de Atención al Cliente</h3><p>Dirección estratégica</p></div></div>
                <div className="org-connector"></div>
                <div className="org-level"><div className="org-box level-2"><i className="fas fa-users-cog" style={{marginBottom:'4px'}}></i><h3>Coordinación General de Atención al Cliente</h3><p>Gestión operativa integral</p></div></div>
                <div className="org-connector"></div>
                <div className="org-branches">
                  {[
                    {icon:'fa-folder-open',title:'Back Office de Atención',items:['Gestión Administrativa','Seguimiento de Casos','Validaciones','Derivaciones internas'],hl:false},
                    {icon:'fa-phone-alt',title:'Contact Center',items:['Agentes Telefónicos','Agentes de Chat','Agentes de WhatsApp'],hl:false},
                    {icon:'fa-laptop',title:'Atención Digital',items:['Redes Sociales','Atención por E-mail','★ Web/Chat'],hl:true},
                    {icon:'fa-exclamation-triangle',title:'Postventa y Reclamos',items:['Equipos de Reclamos','Cambios y Devoluciones','Garantías','Escalaciones Complejas'],hl:false},
                    {icon:'fa-clipboard-check',title:'Calidad y Capacitación',items:['Monitoreo de Atención','Control de Calidad','Capacitación de Agentes'],hl:false},
                    {icon:'fa-chart-line',title:'Experiencia del Cliente',items:['Indicadores de Atención','Satisfacción (CSAT)','Reportes','Mejora Continua'],hl:false},
                  ].map((branch,i) => (
                    <div key={i} className={`org-branch ${branch.hl ? 'highlight' : ''}`}>
                      <div className="org-branch-icon"><i className={`fas ${branch.icon}`}></i></div>
                      <h4>{branch.title}</h4>
                      <div className="org-branch-items">
                        {branch.items.map((item,j) => <span key={j} className={item.includes('★') ? 'star' : ''}>{item}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalle Atención Digital */}
              <div style={{marginTop:'32px',background:'linear-gradient(135deg, #f0fdf4, #ecfdf5)',borderRadius:'var(--radio)',border:'2px solid #86efac',padding:'24px',maxWidth:'800px',margin:'32px auto 0'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
                  <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'var(--verde)',color:'white',display:'flex',alignItems:'center',justifyContent:'center'}}><i className="fas fa-star"></i></div>
                  <div><h3 style={{fontWeight:700,color:'var(--azul-oscuro)',fontSize:'15px'}}>División: Atención Web/Chat</h3><p style={{fontSize:'11px',color:'var(--texto-suave)'}}>Nuestra división · Canal síncrono digital en fravega.com</p></div>
                </div>
                <div className="grid-2" style={{marginBottom:'16px'}}>
                  <div style={{background:'white',borderRadius:'8px',padding:'14px',border:'1px solid #bbf7d0'}}>
                    <h4 style={{fontSize:'11px',fontWeight:600,color:'#166534',textTransform:'uppercase',marginBottom:'8px'}}>Dependencia Jerárquica</h4>
                    <div style={{fontSize:'12px',color:'var(--texto-claro)',lineHeight:'1.8'}}>
                      <p>→ Gerencia de Atención al Cliente</p>
                      <p>→ Coordinación General</p>
                      <p>→ Supervisor de Atención Digital</p>
                      <p style={{fontWeight:700,color:'var(--azul-corporativo)'}}>→ Atención Web/Chat ★</p>
                    </div>
                  </div>
                  <div style={{background:'white',borderRadius:'8px',padding:'14px',border:'1px solid #bbf7d0'}}>
                    <h4 style={{fontSize:'11px',fontWeight:600,color:'#166534',textTransform:'uppercase',marginBottom:'8px'}}>Objetivos Estratégicos</h4>
                    <div style={{fontSize:'12px',color:'var(--texto-claro)',lineHeight:'1.8'}}>
                      <p>✓ Reducción de fricción de compra</p>
                      <p>✓ Resolución logística inmediata</p>
                      <p>✓ Contención ágil postventa</p>
                      <p>✓ 3-4 chats simultáneos por operador</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla interacciones */}
              <div style={{marginTop:'32px'}}>
                <h3 style={{fontWeight:700,color:'var(--azul-oscuro)',fontSize:'14px',marginBottom:'12px'}}>Interacción con otras Ramas</h3>
                <div style={{overflowX:'auto'}}>
                  <table className="data-table" style={{border:'1px solid var(--borde)',borderRadius:'8px',overflow:'hidden'}}>
                    <thead><tr style={{background:'var(--azul-oscuro)',color:'white'}}><th style={{color:'white'}}>Rama</th><th style={{color:'white'}}>Sector de Enlace</th><th style={{color:'white'}}>Mecanismo de Interacción</th></tr></thead>
                    <tbody>
                      <tr><td style={{fontWeight:600}}>Back Office</td><td>Validaciones, Derivaciones</td><td>Órdenes de destrabe, notas de crédito</td></tr>
                      <tr style={{background:'#f8fafc'}}><td style={{fontWeight:600}}>Contact Center</td><td>Agentes de Chat</td><td>Balanceo de carga en eventos masivos</td></tr>
                      <tr><td style={{fontWeight:600}}>Postventa y Reclamos</td><td>Cambios, Garantías</td><td>Derivación tickets, logística inversa</td></tr>
                      <tr style={{background:'#f8fafc'}}><td style={{fontWeight:600}}>Calidad y Capacitación</td><td>Monitoreo, QA</td><td>Transcripciones para auditoría</td></tr>
                      <tr><td style={{fontWeight:600}}>Experiencia del Cliente</td><td>CSAT, Métricas</td><td>Encuestas post-chat, análisis motivos</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== ESCALATIONS ========== */}
        {currentView === 'escalations' && (
          <div className="view-container">
            <div className="page-header">
              <h1>Escalaciones</h1>
              <p>Casos derivados a sectores de 2do nivel y escalaciones complejas</p>
            </div>
            <div className="kpi-grid">
              <div className="card" style={{padding:'16px',borderColor:'#fecdd3'}}><div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}><i className="fas fa-exclamation-circle" style={{color:'var(--rojo)'}}></i><span style={{fontSize:'11px',color:'var(--texto-suave)'}}>Críticas</span></div><div style={{fontSize:'24px',fontWeight:700,color:'var(--rojo)'}}>1</div></div>
              <div className="card" style={{padding:'16px',borderColor:'#fed7aa'}}><div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}><i className="fas fa-arrow-up" style={{color:'var(--naranja)'}}></i><span style={{fontSize:'11px',color:'var(--texto-suave)'}}>En proceso</span></div><div style={{fontSize:'24px',fontWeight:700,color:'var(--naranja)'}}>2</div></div>
              <div className="card" style={{padding:'16px',borderColor:'#fde68a'}}><div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}><i className="fas fa-clock" style={{color:'#b45309'}}></i><span style={{fontSize:'11px',color:'var(--texto-suave)'}}>Pendientes</span></div><div style={{fontSize:'24px',fontWeight:700,color:'#b45309'}}>1</div></div>
              <div className="card" style={{padding:'16px',borderColor:'#bbf7d0'}}><div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}><i className="fas fa-check-circle" style={{color:'var(--verde)'}}></i><span style={{fontSize:'11px',color:'var(--texto-suave)'}}>Resueltos (semana)</span></div><div style={{fontSize:'24px',fontWeight:700,color:'var(--verde)'}}>5</div></div>
            </div>
            <div style={{marginTop:'24px'}}>
              {escalaciones.map(esc => (
                <div key={esc.id} className="escalation-card">
                  <div className="escalation-header">
                    <span className={`badge badge-priority-${esc.prioridad}`}>{esc.prioridad.toUpperCase()}</span>
                    <span className={`badge ${esc.estado === 'en_proceso' ? 'badge-active' : esc.estado === 'pendiente' ? 'badge-waiting' : 'badge-resolved'}`}>
                      {esc.estado === 'en_proceso' ? 'En proceso' : esc.estado === 'pendiente' ? 'Pendiente' : 'Resuelto'}
                    </span>
                    <span style={{fontSize:'10px',color:'var(--texto-suave)'}}>{esc.fecha}</span>
                  </div>
                  <div className="escalation-title">{esc.cliente} · Pedido {esc.pedido}</div>
                  <div className="escalation-motivo">{esc.motivo}</div>
                  <div className="escalation-desc">{esc.desc}</div>
                  <div className="escalation-footer">
                    <div className="escalation-derivado">
                      <p>Derivado a</p>
                      <p>{esc.derivadoA}</p>
                    </div>
                    <div style={{fontSize:'11px',color:'var(--texto-suave)'}}>
                      <i className="fas fa-user" style={{marginRight:'4px'}}></i>Agente: {esc.agente}
                    </div>
                    {esc.estado !== 'resuelto' && <button className="btn btn-outline btn-sm"><i className="fas fa-eye"></i> Ver seguimiento</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
