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
  fecha: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
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
  // General
  { id: 1, atajo: '/saludo', titulo: 'Saludo inicial', contenido: '¡Hola {{customer_name}}! 👋 Mi nombre es {{agent_name}} y soy tu asesor/a de Frávega. ¿En qué puedo ayudarte el día de hoy?', categoria: 'General' },
  { id: 2, atajo: '/despedida', titulo: 'Cierre de chat', contenido: '¡Fue un placer atenderte, {{customer_name}}! 😊 Si tenés otra consulta, no dudes en contactarnos nuevamente. ¡Que tengas un excelente día!', categoria: 'General' },
  { id: 3, atajo: '/espera', titulo: 'Poner en espera', contenido: 'Un momento por favor, {{customer_name}}. Estoy revisando tu consulta y te respondo en breve. ¡Gracias por tu paciencia!', categoria: 'General' },
  { id: 4, atajo: '/transfer', titulo: 'Transferir a supervisor', contenido: '{{customer_name}}, voy a transferirte con un supervisor que podrá ayudarte mejor con tu caso. Un momento por favor.', categoria: 'General' },
  // Logística
  { id: 5, atajo: '/estado', titulo: 'Consultar estado del pedido', contenido: 'Estoy consultando el estado de tu pedido {{order_number}} en nuestro sistema logístico, {{customer_name}}. Te pido un momento mientras verifico la información actualizada.', categoria: 'Logística' },
  { id: 6, atajo: '/demora', titulo: 'Demora en entrega', contenido: 'Comprendo tu frustración por la demora, {{customer_name}}. Voy a escalar tu caso al área de logística para priorizar tu entrega del pedido {{order_number}}. Te mantendré informado/a.', categoria: 'Logística' },
  { id: 7, atajo: '/reprogramar', titulo: 'Reprogramar entrega', contenido: 'Sin problema, {{customer_name}}. Puedo reprogramar la entrega de tu pedido {{order_number}}. ¿Qué fecha te quedaría mejor? Tené en cuenta que tenemos disponibilidad a partir de 48hs hábiles.', categoria: 'Logística' },
  { id: 8, atajo: '/tracking', titulo: 'Código de seguimiento', contenido: 'Tu código de seguimiento para el pedido {{order_number}} es: [TRACKING_CODE]. Podés consultar el estado en cualquier momento en fravega.com/seguimiento', categoria: 'Logística' },
  // Preventa
  { id: 9, atajo: '/promos', titulo: 'Promociones bancarias', contenido: '¡Excelente pregunta, {{customer_name}}! Estas son las promos vigentes:\n\n🏦 Santander: 3, 6 y 12 cuotas SI\n🏦 Galicia: 3 y 6 cuotas SI + 10% extra\n🏦 BBVA: 12 y 18 cuotas SI\n🏦 Macro: 6 cuotas SI\n🏦 Naranja: 12 cuotas SI\n\n💳 También aceptamos Mercado Pago. ¿Sobre qué producto te gustaría consultar?', categoria: 'Preventa' },
  { id: 10, atajo: '/stock', titulo: 'Consulta de stock', contenido: 'Déjame verificar el stock disponible en nuestras sucursales, {{customer_name}}. ¿Podrías indicarme en qué zona estás o qué sucursal te queda más cómoda?', categoria: 'Preventa' },
  { id: 11, atajo: '/retiro', titulo: 'Retiro en sucursal', contenido: '¡Perfecto, {{customer_name}}! Tu pedido {{order_number}} ya está disponible para retiro en la sucursal que elegiste. Recordá traer tu DNI y el código de compra que te enviamos por email.', categoria: 'Preventa' },
  { id: 12, atajo: '/retiro-tercero', titulo: 'Retiro por tercero', contenido: 'Para que otra persona retire tu pedido, {{customer_name}}, necesitás:\n\n📋 Autorización firmada por el titular\n📋 Copia del DNI del titular\n📋 Código de compra (enviado por email)\n📋 DNI original de quien retira\n\n¿Necesitás que te envíe el modelo de autorización?', categoria: 'Preventa' },
  // Postventa
  { id: 13, atajo: '/cambio', titulo: 'Cambio/Devolución', contenido: 'Dentro de los 10 días corridos desde la recepción, podés ejercer tu derecho de cambio o devolución sin costo, {{customer_name}}. Para iniciar el trámite necesito:\n\n1. Número de pedido\n2. Motivo del cambio/devolución\n3. Fotos del producto (si hay daño)\n\n¿Iniciamos el trámite?', categoria: 'Postventa' },
  { id: 14, atajo: '/garantia', titulo: 'Consulta de garantía', contenido: 'Tu producto cuenta con garantía oficial del fabricante, {{customer_name}}. Para gestionar el servicio técnico necesito:\n\n1. Número de pedido\n2. Descripción de la falla\n3. Fotos o video del problema\n\nEl plazo de respuesta es de 48hs hábiles.', categoria: 'Postventa' },
  { id: 15, atajo: '/producto-dañado', titulo: 'Producto dañado al recibir', contenido: 'Lamento mucho lo sucedido, {{customer_name}}. Voy a generar un reclamo inmediatamente. ¿Podrías enviarme fotos del daño por este chat? Necesito documentar el caso para resolverlo a la brevedad.', categoria: 'Postventa' },
  // Facturación
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
      { id: 6, tipo: 'cliente', emisor: 'María González', texto: 'Sí, es el #10452. Es el Smart TV Samsung de 50 pulgadas.', hora: '14:35', leido: true },
      { id: 7, tipo: 'agente', emisor: 'Sofía Ríos', texto: 'Perfecto, ya lo ubiqué. Veo que está "En distribución". Déjame consultar con el centro logístico.', hora: '14:36', leido: true },
    ]
  },
  {
    id: 2, cliente: 'Carlos Rodríguez', avatar: 'CR', color: 'green', dni: '28.901.234', email: 'c.rodriguez@outlook.com', tel: '+54 11 4421-3356', clienteDesde: 2019, pedidos: 12, casos: 1,
    pedido: { num: '#10389', producto: 'Notebook Lenovo IdeaPad 3', monto: 749999, entrega: 'Retiro sucursal Caballito', fecha: '12 Ene 2025', estado: 'preparing', estadoLabel: 'En preparación' },
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
  {
    id: 6, cliente: 'Pedro Sánchez', avatar: 'PS', color: 'blue', dni: '27.890.123', email: 'pedro.sanchez@gmail.com', tel: '+54 11 4456-7788', clienteDesde: 2018, pedidos: 15, casos: 4,
    pedido: { num: '#10567', producto: 'Cafetera Nespresso Vertuo', monto: 189999, entrega: 'Entrega a domicilio', fecha: '20 Ene 2025', estado: 'preparing', estadoLabel: 'En preparación' },
    motivo: 'Preventa · Consulta de producto', estado: 'esperando', tiempo: '3m 22s', unread: true,
    ultimoMsg: '¿Tienen la cafetera en color rojo?',
    mensajes: [
      { id: 1, tipo: 'sistema', texto: 'Chat iniciado · Canal: Web fravega.com', hora: '14:35', leido: true },
      { id: 2, tipo: 'cliente', emisor: 'Pedro Sánchez', texto: 'Hola, estoy interesado en la cafetera Nespresso Vertuo. ¿Tienen en color rojo?', hora: '14:35', leido: true },
    ]
  },
];

const clientesIniciales: Cliente[] = [
  { id: 1, nombre: 'María González', dni: '32.456.789', email: 'maria.gonzalez@gmail.com', telefono: '+54 11 5542-8891' },
  { id: 2, nombre: 'Carlos Rodríguez', dni: '28.901.234', email: 'c.rodriguez@outlook.com', telefono: '+54 11 4421-3356' },
  { id: 3, nombre: 'Lucía Fernández', dni: '35.678.432', email: 'lucia.fernandez@yahoo.com', telefono: '+54 11 6678-1122' },
  { id: 4, nombre: 'Roberto Martínez', dni: '24.112.567', email: 'r.martinez@gmail.com', telefono: '+54 11 3345-7788' },
  { id: 5, nombre: 'Ana López', dni: '30.234.890', email: 'ana.lopez@hotmail.com', telefono: '+54 11 5567-9900' },
  { id: 6, nombre: 'Pedro Sánchez', dni: '27.890.123', email: 'pedro.sanchez@gmail.com', telefono: '+54 11 4456-7788' },
];

const ordenesIniciales: Orden[] = [
  { id: 1, numero: '#10452', clienteId: 1, clienteNombre: 'María González', producto: 'Smart TV Samsung 50"', monto: 489999, estado: 'shipping', fecha: '15-17 Ene 2025' },
  { id: 2, numero: '#10389', clienteId: 2, clienteNombre: 'Carlos Rodríguez', producto: 'Notebook Lenovo IdeaPad 3', monto: 749999, estado: 'preparing', fecha: '12 Ene 2025' },
  { id: 3, numero: '#10501', clienteId: 3, clienteNombre: 'Lucía Fernández', producto: 'Heladera Whirlpool 396L', monto: 1299000, estado: 'preparing', fecha: '20-22 Ene 2025' },
  { id: 4, numero: '#10298', clienteId: 5, clienteNombre: 'Ana López', producto: 'Aire Acond. Samsung WindFree', monto: 899999, estado: 'delivered', fecha: '10 Ene 2025' },
  { id: 5, numero: '#10445', clienteId: 4, clienteNombre: 'Roberto Martínez', producto: 'Lavarropas Drean Next 8.15', monto: 599999, estado: 'delayed', fecha: '14 Ene 2025' },
  { id: 6, numero: '#10567', clienteId: 6, clienteNombre: 'Pedro Sánchez', producto: 'Cafetera Nespresso Vertuo', monto: 189999, estado: 'preparing', fecha: '20 Ene 2025' },
];

const usuariosIniciales: Usuario[] = [
  { id: 1, nombre: 'Sofía Ríos', email: 'sofia.rios@fravega.com', rol: 'agent', estado: 'available', breakEndsAt: null },
  { id: 2, nombre: 'Martín Pereyra', email: 'martin.pereyra@fravega.com', rol: 'agent', estado: 'busy', breakEndsAt: null },
  { id: 3, nombre: 'Valentina Torres', email: 'valentina.torres@fravega.com', rol: 'agent', estado: 'available', breakEndsAt: null },
  { id: 4, nombre: 'Diego Álvarez', email: 'diego.alvarez@fravega.com', rol: 'agent', estado: 'break', breakEndsAt: Date.now() + 15 * 60 * 1000 }, // 15 min
  { id: 5, nombre: 'Nicolás Romero', email: 'nicolas.romero@fravega.com', rol: 'supervisor', estado: 'available', breakEndsAt: null },
  { id: 6, nombre: 'Camila Sánchez', email: 'camila.sanchez@fravega.com', rol: 'agent', estado: 'offline', breakEndsAt: null },
];

// ==========================================
// USUARIOS DE PRUEBA PARA LOGIN
// ==========================================
const usuariosPrueba = [
  { dni: '12345678', password: 'admin123', codigo: '1234', nombre: 'Admin Sistema', rol: 'admin' },
  { dni: '23456789', password: 'super123', codigo: '2345', nombre: 'Nicolás Romero', rol: 'supervisor' },
  { dni: '34567890', password: 'agent123', codigo: '3456', nombre: 'Sofía Ríos', rol: 'agente' },
  { dni: '99999999', password: 'cliente123', codigo: '9999', nombre: 'Juan Pérez', rol: 'cliente' },
];

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
          <p className="login-hint">💡 Usuarios de prueba:</p>
          <div className="login-credentials">
            <div className="credential-item">
              <strong>Admin:</strong> 12345678 / admin123 / 1234
            </div>
            <div className="credential-item">
              <strong>Supervisor:</strong> 23456789 / super123 / 2345
            </div>
            <div className="credential-item">
              <strong>Agente:</strong> 34567890 / agent123 / 3456
            </div>
            <div className="credential-item">
              <strong>Cliente:</strong> 99999999 / cliente123 / 9999
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
  const [conversaciones, setConversaciones] = useState<Conversacion[]>(conversacionesIniciales);
  const [selectedChatId, setSelectedChatId] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [theme, setTheme] = useState<Theme>('light');
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [ordenes, setOrdenes] = useState<Orden[]>(ordenesIniciales);
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

  // Actualizar tiempo actual cada segundo para countdowns
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Función para personalizar respuestas rápidas con variables dinámicas
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

  // ==========================================
  // LOGIN HANDLER
  // ==========================================
  const handleLogin = (dni: string, password: string, codigo: string) => {
    const user = usuariosPrueba.find(
      u => u.dni === dni && u.password === password && u.codigo === codigo
    );

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setLoginError('');
      showNotification(`✅ Bienvenido, ${user.nombre}`);
    } else {
      setLoginError('DNI, contraseña o código de seguridad incorrectos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    // Limpiar datos de cliente en localStorage si es cliente
    if (currentUser?.rol === 'cliente') {
      localStorage.removeItem('nexo_cliente_session');
    }
    showNotification('👋 Sesión cerrada');
  };

  // ==========================================
  // SINCRONIZACIÓN EN TIEMPO REAL (localStorage)
  // ==========================================
  useEffect(() => {
    // Escuchar cambios de localStorage para sincronización entre pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nexo_conversaciones') {
        const nuevasConversaciones = JSON.parse(e.newValue || '[]');
        setConversaciones(nuevasConversaciones);
      }
      if (e.key === 'nexo_ordenes') {
        const nuevasOrdenes = JSON.parse(e.newValue || '[]');
        setOrdenes(nuevasOrdenes);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sincronizar conversaciones con localStorage
  useEffect(() => {
    localStorage.setItem('nexo_conversaciones', JSON.stringify(conversaciones));
  }, [conversaciones]);

  // Sincronizar órdenes con localStorage
  useEffect(() => {
    localStorage.setItem('nexo_ordenes', JSON.stringify(ordenes));
  }, [ordenes]);

  // Función helper para etiquetas de estado
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

  // Función para formatear tiempo restante
  const formatTimeRemaining = (endsAt: number | null): string => {
    if (!endsAt) return '';
    const remaining = Math.max(0, endsAt - currentTime);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // CRUD HANDLERS
  // ==========================================
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
          setClientes([...clientes, { ...data, id: newId }]);
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
            estado: data.estado || 'available',
            breakEndsAt: null
          };
          setUsuarios([newUser, ...usuarios]);
          showNotification(`✅ Usuario ${data.nombre} creado con estado: ${getEstadoLabel(data.estado || 'available')}`);
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
        setUsuarios(usuarios.map(u => u.id === selectedItem.id ? { ...u, ...data } : u));
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

  // ==========================================
  // CHAT HANDLERS
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
    setConversaciones(prev => prev.map(c =>
      c.id === selectedChatId
        ? { ...c, mensajes: [...c.mensajes, newMsg], ultimoMsg: messageInput, estado: 'activo' as const }
        : c
    ));
    setMessageInput('');
    setShowQuickReplies(false);
  };

  const insertQuickReply = (content: string) => {
    // Personalizar la respuesta con variables dinámicas
    const personalized = personalizeReply(
      content,
      selectedChat?.cliente,
      selectedChat?.pedido?.num
    );
    setMessageInput(personalized);
    setShowQuickReplies(false);
  };

  const takeChat = (id: number) => {
    setConversaciones(prev => prev.map(c =>
      c.id === id ? { ...c, estado: 'activo' as const, unread: false } : c
    ));
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
    setConversaciones(prev => prev.map(c =>
      c.id === selectedChatId
        ? { ...c, estado: 'resuelto' as const, mensajes: [...c.mensajes, systemMsg] }
        : c
    ));
    showNotification('✅ Chat resuelto');
  };

  const deleteChat = (id: number) => {
    setConversaciones(prev => prev.filter(c => c.id !== id));
    if (id === selectedChatId && conversaciones.length > 1) {
      const remaining = conversaciones.filter(c => c.id !== id);
      setSelectedChatId(remaining[0].id);
    }
    showNotification('🗑️ Chat eliminado');
  };

  // ==========================================
  // ACTUALIZACIÓN AUTOMÁTICA DE PEDIDOS (POLLING)
  // ==========================================
  useEffect(() => {
    const updateOrders = () => {
      // Simular cambios de estado automáticos
      setOrdenes(prev => prev.map(orden => {
        // Simular progreso de pedidos
        if (orden.estado === 'preparing' && Math.random() > 0.7) {
          showNotification(`📦 Pedido ${orden.numero} cambió a: En envío`);
          return { ...orden, estado: 'shipping' };
        }
        if (orden.estado === 'shipping' && Math.random() > 0.8) {
          showNotification(`✅ Pedido ${orden.numero} fue entregado`);
          return { ...orden, estado: 'delivered' };
        }
        return orden;
      }));
    };
    
    const interval = setInterval(updateOrders, 2000); // Cada 2 segundos (actualizado)
    return () => clearInterval(interval);
  }, []);

  // Si no está autenticado, mostrar pantalla de login
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  // Si es cliente, mostrar vista de cliente
  if (currentUser?.rol === 'cliente') {
    return <ClienteView currentUser={currentUser} conversaciones={conversaciones} setConversaciones={setConversaciones} ordenes={ordenes} usuarios={usuarios} />;
  }

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
          <div>
            <h1>Dashboard</h1>
            <p>Resumen en tiempo real · {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
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
        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h3>Actividad de Chats (7 días)</h3>
            </div>
            <div className="card-body">
              <div className="chart">
                {[42, 55, 48, 61, 53, 38, 22].map((val, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${(val / 65) * 100}%` }}>
                    <span className="chart-value">{val}</span>
                  </div>
                ))}
              </div>
              <div className="chart-labels">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, i) => (
                  <span key={i}>{day}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Estado de Agentes</h3>
            </div>
            <div className="card-body">
              <div className="agent-list">
                {usuarios.filter(u => u.rol === 'agent').map((agente, i) => (
                  <div key={i} className="agent-item">
                    <div className={`agent-avatar ${agente.estado}`}>
                      {agente.nombre.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="agent-info">
                      <div className="agent-name">{agente.nombre}</div>
                      <div className="agent-status">{agente.estado === 'available' ? 'Disponible' : agente.estado === 'busy' ? 'Ocupado' : agente.estado === 'break' ? 'En pausa' : 'Desconectado'}</div>
                    </div>
                  </div>
                ))}
              </div>
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
                <button className="queue-delete-btn" onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}>🗑️</button>
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
                  {selectedChat.estado === 'activo' && (
                    <button className="btn-success" onClick={resolveChat}>✓ Resolver</button>
                  )}
                  <button className="btn-danger" onClick={() => deleteChat(selectedChat.id)}>🗑️</button>
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
    );
  }

  // ==========================================
  // CUSTOMERS VIEW
  // ==========================================
  function CustomersView() {
    return (
      <div className="view-container">
        <div className="view-header">
          <div>
            <h1>Clientes</h1>
            <p>Gestión de clientes del sistema</p>
          </div>
          <button className="btn-primary" onClick={() => openModal('create', 'cliente')}>+ Nuevo Cliente</button>
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
                    <button className="btn-icon" onClick={() => openModal('edit', 'cliente', cliente)}>✏️</button>
                    <button className="btn-icon" onClick={() => openModal('delete', 'cliente', cliente)}>🗑️</button>
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
          <div>
            <h1>Pedidos</h1>
            <p>Gestión de pedidos y órdenes · Actualización cada 2 segundos</p>
          </div>
          <button className="btn-primary" onClick={() => openModal('create', 'orden')} disabled={loadingResource === 'orden'}>
            {loadingResource === 'orden' ? '⏳ Creando...' : '+ Nuevo Pedido'}
          </button>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden, index) => (
                <tr key={orden.id} className={index === 0 && loadingResource === 'orden' ? 'new-item-row' : ''}>
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
                  <td>
                    <button className="btn-icon" onClick={() => openModal('edit', 'orden', orden)}>✏️</button>
                    <button className="btn-icon" onClick={() => openModal('delete', 'orden', orden)}>🗑️</button>
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
          <div>
            <h1>Usuarios</h1>
            <p>Gestión de agentes y supervisores</p>
          </div>
          <button className="btn-primary" onClick={() => openModal('create', 'usuario')} disabled={loadingResource === 'usuario'}>
            {loadingResource === 'usuario' ? '⏳ Creando...' : '+ Nuevo Usuario'}
          </button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Tiempo de Descanso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => {
                const breakTimeRemaining = usuario.estado === 'break' && usuario.breakEndsAt 
                  ? formatTimeRemaining(usuario.breakEndsAt)
                  : null;
                
                return (
                  <tr key={usuario.id} className={loadingResource === 'usuario' ? 'loading-row' : ''}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
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
                    <td>
                      <button className="btn-icon" onClick={() => openModal('edit', 'usuario', usuario)}>✏️</button>
                      <button className="btn-icon" onClick={() => openModal('delete', 'usuario', usuario)}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ==========================================
  // ESCALATIONS VIEW
  // ==========================================
  function EscalationsView() {
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
    const filtered = articulosKB.filter(a =>
      a.titulo.toLowerCase().includes(searchKB.toLowerCase()) ||
      a.categoria.toLowerCase().includes(searchKB.toLowerCase())
    );
    const selected = articulosKB.find(a => a.id === selectedKB);

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
            {filtered.map(art => (
              <div key={art.id} className={`kb-item ${selectedKB === art.id ? 'active' : ''}`} onClick={() => setSelectedKB(art.id)}>
                <h4>{art.titulo}</h4>
                <span className="kb-category">{art.categoria}</span>
              </div>
            ))}
          </div>
          <div className="kb-detail">
            {selected ? (
              <>
                <span className="kb-category-badge">{selected.categoria}</span>
                <h2>{selected.titulo}</h2>
                <div className="kb-content">
                  {selected.contenido.split('\n').map((line, i) => (
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
  }

  // ==========================================
  // QUICK REPLIES VIEW
  // ==========================================
  function QuickRepliesView() {
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
  }

  // ==========================================
  // METRICS VIEW
  // ==========================================
  function MetricsView() {
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
        <div className="card">
          <div className="card-header">
            <h3>Cumplimiento SLA</h3>
          </div>
          <div className="card-body">
            {[
              { label: '1ra respuesta < 2min', value: 92, color: 'var(--success-color)' },
              { label: 'Resolución < 15min', value: 78, color: 'var(--primary-color)' },
              { label: 'Encuesta completada', value: 85, color: '#8b5cf6' },
            ].map((item, i) => (
              <div key={i} className="metric-progress">
                <div className="metric-progress-header">
                  <span>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 600 }}>{item.value}%</span>
                </div>
                <div className="metric-progress-bar">
                  <div className="metric-progress-fill" style={{ width: `${item.value}%`, background: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // QUALITY VIEW
  // ==========================================
  function QualityView() {
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
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {notification && <div className="notification">{notification}</div>}

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

      {/* Main Content */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* Modal */}
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
// CLIENTE VIEW (Widget de Chat en Tiempo Real)
// ==========================================
function ClienteView({ currentUser, conversaciones, setConversaciones, ordenes, usuarios }: any) {
  const [chatActivo, setChatActivo] = useState<any>(null);
  const [mensajeInput, setMensajeInput] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<string>('');
  const [motivo, setMotivo] = useState('');
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Obtener pedidos del cliente
  const misPedidos = ordenes.filter((o: Orden) => o.clienteNombre === currentUser.nombre);

  // Sincronizar con localStorage (tiempo real)
  useEffect(() => {
    const syncConversaciones = () => {
      const stored = localStorage.getItem('nexo_conversaciones');
      if (stored) {
        const conversacionesActualizadas = JSON.parse(stored);
        setConversaciones(conversacionesActualizadas);
        
        // Actualizar chat activo si existe
        if (chatActivo) {
          const chatActualizado = conversacionesActualizadas.find((c: Conversacion) => c.id === chatActivo.id);
          if (chatActualizado) {
            setChatActivo(chatActualizado);
          }
        }
      }
    };

    const interval = setInterval(syncConversaciones, 1000); // Sincronizar cada segundo
    return () => clearInterval(interval);
  }, [chatActivo]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatActivo?.mensajes.length]);

  // Iniciar nuevo chat
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

    setConversaciones([...conversaciones, nuevoChat]);
    setChatActivo(nuevoChat);
  };

  // Enviar mensaje
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
    setConversaciones(conversaciones.map((c: Conversacion) => 
      c.id === chatActivo.id ? conversacionActualizada : c
    ));
    setMensajeInput('');
  };

  // Obtener información del agente asignado
  const getAgenteInfo = () => {
    if (!chatActivo || chatActivo.estado === 'esperando') return null;
    
    // Buscar agente asignado (simulado - en producción vendría del backend)
    const agente = usuarios.find((u: Usuario) => u.rol === 'agent' && u.estado === 'available');
    return agente || usuarios.find((u: Usuario) => u.rol === 'agent');
  };

  const agenteInfo = getAgenteInfo();

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
          <button className="btn-secondary" onClick={() => {
            localStorage.removeItem('nexo_cliente_session');
            window.location.reload();
          }}>
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

              {chatActivo.pedido && (
                <div className="pedido-info-card">
                  <h3>📦 Tu Pedido</h3>
                  <div className="pedido-details-compact">
                    <p><strong>{chatActivo.pedido.num}</strong></p>
                    <p>{chatActivo.pedido.producto}</p>
                    <p className={`status-badge ${chatActivo.pedido.estado}`}>
                      {chatActivo.pedido.estadoLabel}
                    </p>
                    <p className="pedido-fecha">Entrega: {chatActivo.pedido.fecha}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function para etiquetas de estado de pedidos
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
                    <input type="text" value={formData.dni || ''} onChange={e => setFormData({ ...formData, dni: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" value={formData.telefono || ''} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
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
