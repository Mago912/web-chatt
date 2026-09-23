// ==========================================
// DATOS MOCK - SISTEMA NEXO WEBCHAT FRÁVEGA
// ==========================================

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  dni: string;
  clienteDesde: number;
  pedidosTotales: number;
  casosTotales: number;
  avatar: string;
}

export interface Pedido {
  id: number;
  numeroPedido: string;
  productoResumen: string;
  monto: number;
  metodoEntrega: string;
  fechaEstimada: string;
  estadoLogistico: 'en_preparacion' | 'en_distribucion' | 'entregado' | 'demorado';
  imagen?: string;
}

export interface Mensaje {
  id: number;
  conversacionId: number;
  tipoEmisor: 'cliente' | 'agente' | 'sistema' | 'bot';
  emisorNombre: string;
  mensaje: string;
  timestamp: string;
}

export interface Conversacion {
  id: number;
  cliente: Cliente;
  pedido: Pedido | null;
  motivo: string;
  estado: 'esperando' | 'activo' | 'resuelto' | 'cerrado';
  tiempoEspera: string;
  ultimoMensaje: string;
  mensajes: Mensaje[];
  asignadoA: string | null;
  inicioConversacion: string;
}

export interface RespuestaRapida {
  id: number;
  atajo: string;
  titulo: string;
  contenido: string;
  categoria: string;
}

export interface ArticuloKB {
  id: number;
  titulo: string;
  categoria: string;
  procedimiento: string;
  enlaceDocumento?: string;
}

export interface Agente {
  id: number;
  nombre: string;
  rol: 'agente' | 'supervisor' | 'admin';
  estado: 'disponible' | 'ocupado' | 'pausa' | 'desconectado';
  chatsActivos: number;
  csatPromedio: number;
  avatar: string;
}

// ==========================================
// CLIENTES
// ==========================================
export const clientes: Cliente[] = [
  {
    id: 1,
    nombre: 'María González',
    email: 'maria.gonzalez@gmail.com',
    telefono: '+54 11 5542-8891',
    dni: '32.456.789',
    clienteDesde: 2021,
    pedidosTotales: 7,
    casosTotales: 2,
    avatar: 'MG'
  },
  {
    id: 2,
    nombre: 'Carlos Rodríguez',
    email: 'c.rodriguez@outlook.com',
    telefono: '+54 11 4421-3356',
    dni: '28.901.234',
    clienteDesde: 2019,
    pedidosTotales: 12,
    casosTotales: 1,
    avatar: 'CR'
  },
  {
    id: 3,
    nombre: 'Lucía Fernández',
    email: 'lucia.fernandez@yahoo.com',
    telefono: '+54 11 6678-1122',
    dni: '35.678.432',
    clienteDesde: 2023,
    pedidosTotales: 3,
    casosTotales: 0,
    avatar: 'LF'
  },
  {
    id: 4,
    nombre: 'Roberto Martínez',
    email: 'r.martinez@gmail.com',
    telefono: '+54 11 3345-7788',
    dni: '24.112.567',
    clienteDesde: 2020,
    pedidosTotales: 9,
    casosTotales: 3,
    avatar: 'RM'
  },
  {
    id: 5,
    nombre: 'Ana López',
    email: 'ana.lopez@hotmail.com',
    telefono: '+54 11 5567-9900',
    dni: '30.234.890',
    clienteDesde: 2022,
    pedidosTotales: 5,
    casosTotales: 1,
    avatar: 'AL'
  }
];

// ==========================================
// PEDIDOS
// ==========================================
export const pedidos: Pedido[] = [
  {
    id: 1,
    numeroPedido: '#10452',
    productoResumen: 'Smart TV Samsung 50" UHD 4K UN50AU7000',
    monto: 489999,
    metodoEntrega: 'Entrega a domicilio',
    fechaEstimada: '15-17 Ene 2025',
    estadoLogistico: 'en_distribucion'
  },
  {
    id: 2,
    numeroPedido: '#10389',
    productoResumen: 'Notebook Lenovo IdeaPad 3 15" Ryzen 5 8GB 512GB SSD',
    monto: 749999,
    metodoEntrega: 'Retiro en sucursal Caballito',
    fechaEstimada: '12 Ene 2025',
    estadoLogistico: 'en_preparacion'
  },
  {
    id: 3,
    numeroPedido: '#10501',
    productoResumen: 'Heladera Whirlpool WRM45A Inverse 396L',
    monto: 1299000,
    metodoEntrega: 'Entrega a domicilio',
    fechaEstimada: '20-22 Ene 2025',
    estadoLogistico: 'en_preparacion'
  },
  {
    id: 4,
    numeroPedido: '#10298',
    productoResumen: 'Aire Acondicionado Samsung WindFree 3200F',
    monto: 899999,
    metodoEntrega: 'Entrega + Instalación',
    fechaEstimada: '10 Ene 2025',
    estadoLogistico: 'entregado'
  },
  {
    id: 5,
    numeroPedido: '#10445',
    productoResumen: 'Lavarropas Automático Drean Next 8.15',
    monto: 599999,
    metodoEntrega: 'Entrega a domicilio',
    fechaEstimada: '14 Ene 2025',
    estadoLogistico: 'demorado'
  }
];

// ==========================================
// CONVERSACIONES
// ==========================================
export const conversaciones: Conversacion[] = [
  {
    id: 1,
    cliente: clientes[0],
    pedido: pedidos[0],
    motivo: 'Pedido · Demora en entrega',
    estado: 'activo',
    tiempoEspera: '2m 15s',
    ultimoMensaje: '¿Me pueden decir dónde está mi pedido? Ya pasó la fecha estimada.',
    asignadoA: 'Sofía Ríos',
    inicioConversacion: '14:32',
    mensajes: [
      { id: 1, conversacionId: 1, tipoEmisor: 'sistema', emisorNombre: 'Sistema', mensaje: 'Chat iniciado · Canal: Web fravega.com · Navegador: Chrome/Windows', timestamp: '14:32' },
      { id: 2, conversacionId: 1, tipoEmisor: 'bot', emisorNombre: 'Bot Nexo', mensaje: '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte hoy?', timestamp: '14:32' },
      { id: 3, conversacionId: 1, tipoEmisor: 'cliente', emisorNombre: 'María González', mensaje: 'Hola, compré un Smart TV y no me llegó. Ya pasó la fecha de entrega.', timestamp: '14:33' },
      { id: 4, conversacionId: 1, tipoEmisor: 'bot', emisorNombre: 'Bot Nexo', mensaje: 'Entiendo tu consulta sobre el estado de tu pedido. Voy a conectarte con un asesor que podrá ayudarte. Un momento por favor...', timestamp: '14:33' },
      { id: 5, conversacionId: 1, tipoEmisor: 'sistema', emisorNombre: 'Sistema', mensaje: '⚡ Transferido a agente: Sofía Ríos', timestamp: '14:34' },
      { id: 6, conversacionId: 1, tipoEmisor: 'agente', emisorNombre: 'Sofía Ríos', mensaje: '¡Hola María! Buenas tardes. Soy Sofía, estoy revisando tu pedido en este momento. ¿Podrías confirmarme tu número de pedido?', timestamp: '14:34' },
      { id: 7, conversacionId: 1, tipoEmisor: 'cliente', emisorNombre: 'María González', mensaje: 'Sí, es el #10452. Es el Smart TV Samsung de 50 pulgadas.', timestamp: '14:35' },
      { id: 8, conversacionId: 1, tipoEmisor: 'agente', emisorNombre: 'Sofía Ríos', mensaje: 'Perfecto, ya lo ubiqué. Veo que tu pedido está en estado "En distribución". Déjame consultar con el centro logístico de Monte Grande para darte una actualización precisa.', timestamp: '14:36' },
      { id: 9, conversacionId: 1, tipoEmisor: 'cliente', emisorNombre: 'María González', mensaje: '¿Me pueden decir dónde está mi pedido? Ya pasó la fecha estimada.', timestamp: '14:37' }
    ]
  },
  {
    id: 2,
    cliente: clientes[1],
    pedido: pedidos[1],
    motivo: 'Preventa · Consulta de stock',
    estado: 'esperando',
    tiempoEspera: '4m 02s',
    ultimoMensaje: 'Buenas, quiero saber si tienen la notebook en la sucursal de Caballito para retirar hoy.',
    asignadoA: null,
    inicioConversacion: '14:28',
    mensajes: [
      { id: 10, conversacionId: 2, tipoEmisor: 'sistema', emisorNombre: 'Sistema', mensaje: 'Chat iniciado · Canal: Web fravega.com · Página origen: /notebook-lenovo-ideapad-3', timestamp: '14:28' },
      { id: 11, conversacionId: 2, tipoEmisor: 'bot', emisorNombre: 'Bot Nexo', mensaje: '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte?', timestamp: '14:28' },
      { id: 12, conversacionId: 2, tipoEmisor: 'cliente', emisorNombre: 'Carlos Rodríguez', mensaje: 'Hola, quiero comprar la notebook Lenovo IdeaPad 3 pero necesito retirarla hoy de la sucursal de Caballito. ¿Tienen stock?', timestamp: '14:29' },
      { id: 13, conversacionId: 2, tipoEmisor: 'bot', emisorNombre: 'Bot Nexo', mensaje: 'Voy a verificar la disponibilidad en sucursal. Te conecto con un asesor para confirmarte stock en tiempo real.', timestamp: '14:29' },
      { id: 14, conversacionId: 2, tipoEmisor: 'cliente', emisorNombre: 'Carlos Rodríguez', mensaje: 'Buenas, quiero saber si tienen la notebook en la sucursal de Caballito para retirar hoy.', timestamp: '14:30' }
    ]
  },
  {
    id: 3,
    cliente: clientes[2],
    pedido: null,
    motivo: 'Preventa · Promociones bancarias',
    estado: 'esperando',
    tiempoEspera: '1m 48s',
    ultimoMensaje: '¿Qué promos hay con tarjeta de crédito? Busco un aire acondicionado.',
    asignadoA: null,
    inicioConversacion: '14:30',
    mensajes: [
      { id: 15, conversacionId: 3, tipoEmisor: 'sistema', emisorNombre: 'Sistema', mensaje: 'Chat iniciado · Canal: Web fravega.com · Página origen: /aire-acondicionado', timestamp: '14:30' },
      { id: 16, conversacionId: 3, tipoEmisor: 'bot', emisorNombre: 'Bot Nexo', mensaje: '¡Hola! 👋 ¿En qué puedo ayudarte?', timestamp: '14:30' },
      { id: 17, conversacionId: 3, tipoEmisor: 'cliente', emisorNombre: 'Lucía Fernández', mensaje: '¿Qué promos hay con tarjeta de crédito? Busco un aire acondicionado.', timestamp: '14:31' }
    ]
  },
  {
    id: 4,
    cliente: clientes[3],
    pedido: pedidos[4],
    motivo: 'Postventa · Producto dañado',
    estado: 'activo',
    tiempoEspera: '0m 45s',
    ultimoMensaje: 'Sí, la caja llegó toda abollada y el tambor tiene un golpe. Adjunto fotos.',
    asignadoA: 'Martín Pereyra',
    inicioConversacion: '14:20',
    mensajes: [
      { id: 18, conversacionId: 4, tipoEmisor: 'sistema', emisorNombre: 'Sistema', mensaje: 'Chat iniciado · Canal: Web fravega.com', timestamp: '14:20' },
      { id: 19, conversacionId: 4, tipoEmisor: 'bot', emisorNombre: 'Bot Nexo', mensaje: '¡Hola! 👋 Soy el asistente virtual de Frávega.', timestamp: '14:20' },
      { id: 20, conversacionId: 4, tipoEmisor: 'cliente', emisorNombre: 'Roberto Martínez', mensaje: 'Me llegó el lavarropas pero está dañado. La caja vino golpeada.', timestamp: '14:21' },
      { id: 21, conversacionId: 4, tipoEmisor: 'sistema', emisorNombre: 'Sistema', mensaje: '⚡ Transferido a agente: Martín Pereyra', timestamp: '14:22' },
      { id: 22, conversacionId: 4, tipoEmisor: 'agente', emisorNombre: 'Martín Pereyra', mensaje: 'Roberto, lamento mucho lo sucedido. Voy a generar un reclamo inmediatamente. ¿Podrías confirmarme el número de pedido?', timestamp: '14:22' },
      { id: 23, conversacionId: 4, tipoEmisor: 'cliente', emisorNombre: 'Roberto Martínez', mensaje: 'Es el #10445', timestamp: '14:23' },
      { id: 24, conversacionId: 4, tipoEmisor: 'agente', emisorNombre: 'Martín Pereyra', mensaje: 'Gracias Roberto. Ya lo tengo. Necesito que me envíes fotos del daño para documentar el reclamo. ¿Podés adjuntarlas aquí en el chat?', timestamp: '14:24' },
      { id: 25, conversacionId: 4, tipoEmisor: 'cliente', emisorNombre: 'Roberto Martínez', mensaje: 'Sí, la caja llegó toda abollada y el tambor tiene un golpe. Adjunto fotos.', timestamp: '14:25' }
    ]
  },
  {
    id: 5,
    cliente: clientes[4],
    pedido: pedidos[3],
    motivo: 'Postventa · Instalación pendiente',
    estado: 'resuelto',
    tiempoEspera: '-',
    ultimoMensaje: '¡Muchas gracias! Quedo atenta a la confirmación de la visita.',
    asignadoA: 'Sofía Ríos',
    inicioConversacion: '13:45',
    mensajes: [
      { id: 26, conversacionId: 5, tipoEmisor: 'sistema', emisorNombre: 'Sistema', mensaje: 'Chat iniciado · Canal: Web fravega.com', timestamp: '13:45' },
      { id: 27, conversacionId: 5, tipoEmisor: 'cliente', emisorNombre: 'Ana López', mensaje: 'Hola, me entregaron el aire pero no vino el técnico a instalarlo.', timestamp: '13:46' },
      { id: 28, conversacionId: 5, tipoEmisor: 'agente', emisorNombre: 'Sofía Ríos', mensaje: '¡Hola Ana! Revisando tu pedido #10298, veo que la instalación estaba programada. Voy a reagendarla con el equipo técnico.', timestamp: '13:47' },
      { id: 29, conversacionId: 5, tipoEmisor: 'agente', emisorNombre: 'Sofía Ríos', mensaje: 'Listo Ana, ya generé la orden de instalación. El técnico pasará entre el 16 y 17 de enero. Te llegará un SMS de confirmación.', timestamp: '13:50' },
      { id: 30, conversacionId: 5, tipoEmisor: 'cliente', emisorNombre: 'Ana López', mensaje: '¡Muchas gracias! Quedo atenta a la confirmación de la visita.', timestamp: '13:51' },
      { id: 31, conversacionId: 5, tipoEmisor: 'sistema', emisorNombre: 'Sistema', mensaje: '✅ Caso resuelto · CSAT: 5/5 ⭐', timestamp: '13:52' }
    ]
  }
];

// ==========================================
// RESPUESTAS RÁPIDAS
// ==========================================
export const respuestasRapidas: RespuestaRapida[] = [
  {
    id: 1,
    atajo: '/saludo',
    titulo: 'Saludo inicial',
    contenido: '¡Hola! 👋 Soy [Nombre], asesor/a de Frávega. Estoy revisando tu consulta y te respondo en un momento. ¿Podrías confirmarme tu número de pedido?',
    categoria: 'General'
  },
  {
    id: 2,
    atajo: '/estado-pedido',
    titulo: 'Consulta de estado de pedido',
    contenido: 'Estoy consultando el estado de tu pedido en nuestro sistema logístico. Te pido un momento mientras verifico la información actualizada con el centro de distribución.',
    categoria: 'Logística'
  },
  {
    id: 3,
    atajo: '/demora',
    titulo: 'Demora en entrega',
    contenido: 'Comprendo tu frustración por la demora. Estamos trabajando para resolverlo a la brevedad. Voy a escalar tu caso al área de logística para priorizar tu entrega. Te mantendré informado/a por este mismo chat.',
    categoria: 'Logística'
  },
  {
    id: 4,
    atajo: '/retiro-sucursal',
    titulo: 'Retiro por tercero en sucursal',
    contenido: 'Para que otra persona retire tu pedido en sucursal, necesitás:\n\n📋 Autorización firmada por el titular\n📋 Copia del DNI del titular\n📋 Código de compra (lo recibiste por email)\n📋 DNI original de la persona que retira\n\n¿Necesitás que te envíe el modelo de autorización por email?',
    categoria: 'Sucursal'
  },
  {
    id: 5,
    atajo: '/cambio-devolucion',
    titulo: 'Cambio / Devolución (10 días)',
    contenido: 'Dentro de los 10 días corridos desde la recepción, podés ejercer tu derecho de cambio o devolución sin costo.\n\nPara iniciar el proceso necesito:\n1. Número de pedido\n2. Motivo del cambio/devolución\n3. Si el producto tiene algún daño, fotos del mismo\n\n¿Querés que iniciemos el trámite ahora?',
    categoria: 'Postventa'
  },
  {
    id: 6,
    atajo: '/garantia',
    titulo: 'Consulta de garantía',
    contenido: 'Tu producto cuenta con garantía oficial del fabricante. Para gestionar el servicio técnico necesito:\n\n1. Número de pedido\n2. Descripción de la falla\n3. Fotos o video del problema\n\nUna vez recibida la información, derivamos al centro de servicio oficial de la marca. El plazo de respuesta es de 48hs hábiles.',
    categoria: 'Postventa'
  },
  {
    id: 7,
    atajo: '/promos',
    titulo: 'Promociones bancarias vigentes',
    contenido: 'Estas son las promociones vigentes con tarjetas de crédito:\n\n🏦 Santander: 3, 6 y 12 cuotas sin interés\n🏦 Galicia: 3 y 6 cuotas sin interés + 10% extra\n🏦 BBVA: 12 y 18 cuotas sin interés\n🏦 Macro: 6 cuotas sin interés\n🏦 Naranja: 12 cuotas sin interés\n\n💳 También aceptamos Mercado Pago en hasta 12 cuotas.\n\n¿Sobre qué producto te gustaría consultar?',
    categoria: 'Preventa'
  },
  {
    id: 8,
    atajo: '/despedida',
    titulo: 'Cierre de chat',
    contenido: '¡Fue un placer atenderte! 😊 Si tenés alguna otra consulta, no dudes en volver a contactarnos. Al finalizar este chat vas a recibir una breve encuesta de satisfacción. ¡Que tengas un excelente día!',
    categoria: 'General'
  }
];

// ==========================================
// BASE DE CONOCIMIENTO
// ==========================================
export const baseConocimiento: ArticuloKB[] = [
  {
    id: 1,
    titulo: 'Procedimiento de retiro por tercero en sucursal',
    categoria: 'Sucursal',
    procedimiento: '1. Verificar identidad del titular en CRM\n2. Confirmar que el pedido esté disponible para retiro\n3. Indicar requisitos: autorización firmada, copia DNI titular, código de compra, DNI original del tercero\n4. Enviar modelo de autorización por email si el cliente lo solicita\n5. Confirmar sucursal y horario de atención'
  },
  {
    id: 2,
    titulo: 'Escalamiento de demora logística (>48hs)',
    categoria: 'Logística',
    procedimiento: '1. Validar datos del pedido en TMS\n2. Contactar centro de distribución correspondiente\n3. Generar orden de destrabe en sistema\n4. Informar al cliente nueva fecha estimada\n5. Si supera 72hs sin resolución, escalar a Supervisor de Postventa\n6. Registrar en ficha del cliente para seguimiento'
  },
  {
    id: 3,
    titulo: 'Proceso de cambio/devolución (10 días)',
    categoria: 'Postventa',
    procedimiento: '1. Verificar fecha de entrega (máx 10 días corridos)\n2. Solicitar motivo del cambio/devolución\n3. Si hay daño: solicitar fotos\n4. Generar orden de logística inversa\n5. Coordinar retiro con transporte (Andreani/OCASA)\n6. Emitir nota de crédito o enviar producto de reemplazo\n7. Confirmar al cliente plazos de acreditación'
  },
  {
    id: 4,
    titulo: 'Derivación a servicio técnico oficial (Garantía)',
    categoria: 'Postventa',
    procedimiento: '1. Verificar que el producto esté dentro del período de garantía\n2. Recopilar datos: N° pedido, descripción falla, fotos/video\n3. Identificar marca y centro de servicio oficial correspondiente\n4. Generar ticket de derivación en sistema\n5. Informar al cliente plazo de respuesta (48hs hábiles)\n6. Hacer seguimiento a las 48hs si no hay respuesta del ST'
  },
  {
    id: 5,
    titulo: 'Validación de identidad del cliente',
    categoria: 'Seguridad',
    procedimiento: '1. Solicitar nombre completo y DNI\n2. Cruzar con datos registrados en CRM\n3. Confirmar email o teléfono registrado\n4. Si hay pedido involucrado: solicitar N° de pedido o últimos 4 dígitos de tarjeta\n5. Si no coincide: NO brindar información sensible\n6. Derivar a Supervisor si hay sospecha de fraude'
  },
  {
    id: 6,
    titulo: 'Tabla de promociones bancarias (actualizada)',
    categoria: 'Preventa',
    procedimiento: 'Consultar tabla actualizada en: intranet.fravega.com/promos\n\nMarcas principales:\n- Samsung: 12 cuotas SI con Santander y Galicia\n- LG: 18 cuotas SI con BBVA\n- Philips: 6 cuotas SI con todas las tarjetas\n- Whirlpool: 12 cuotas SI con Macro y Naranja\n\nNota: Las promociones se actualizan los lunes. Verificar siempre antes de informar.'
  },
  {
    id: 7,
    titulo: 'Manejo de cliente enojado / situación conflictiva',
    categoria: 'Calidad',
    procedimiento: '1. Mantener calma y tono empático\n2. Validar la frustración del cliente: "Entiendo perfectamente su molestia"\n3. No usar lenguaje defensivo\n4. Ofrecer solución concreta con plazos\n5. Si el cliente solicita hablar con un superior: escalar a Supervisor\n6. Si hay insultos o amenazas: advertir con respeto y, si persiste, cerrar chat con registro\n7. Documentar todo en la ficha del caso'
  },
  {
    id: 8,
    titulo: 'Procedimiento de facturación (Factura A / B)',
    categoria: 'Administrativo',
    procedimiento: '1. Solicitar CUIT/CUIL y datos de facturación\n2. Verificar si el pedido ya fue facturado\n3. Si necesita cambio de Factura B a A: derivar a Back Office de Facturación\n4. Si necesita duplicado: reenviar por email desde sistema\n5. Si hay error en datos: generar nota de crédito y refacturar\n6. Plazo de resolución: 48hs hábiles'
  }
];

// ==========================================
// AGENTES
// ==========================================
export const agentes: Agente[] = [
  { id: 1, nombre: 'Sofía Ríos', rol: 'agente', estado: 'ocupado', chatsActivos: 3, csatPromedio: 4.8, avatar: 'SR' },
  { id: 2, nombre: 'Martín Pereyra', rol: 'agente', estado: 'ocupado', chatsActivos: 2, csatPromedio: 4.6, avatar: 'MP' },
  { id: 3, nombre: 'Valentina Torres', rol: 'agente', estado: 'disponible', chatsActivos: 1, csatPromedio: 4.9, avatar: 'VT' },
  { id: 4, nombre: 'Diego Álvarez', rol: 'agente', estado: 'disponible', chatsActivos: 2, csatPromedio: 4.5, avatar: 'DA' },
  { id: 5, nombre: 'Camila Sánchez', rol: 'agente', estado: 'pausa', chatsActivos: 0, csatPromedio: 4.7, avatar: 'CS' },
  { id: 6, nombre: 'Nicolás Romero', rol: 'supervisor', estado: 'disponible', chatsActivos: 0, csatPromedio: 4.8, avatar: 'NR' },
  { id: 7, nombre: 'Laura Gómez', rol: 'agente', estado: 'desconectado', chatsActivos: 0, csatPromedio: 4.4, avatar: 'LG' }
];

// ==========================================
// KPIs
// ==========================================
export const kpis = {
  enEspera: 4,
  enAtencion: 5,
  primeraRespuesta: '1m 42s',
  satisfaccion: 4.7,
  fcr: 78,
  tmr: '2m 15s',
  aht: '8m 32s',
  chatsHoy: 47,
  resueltosHoy: 38,
  nps: 72
};
