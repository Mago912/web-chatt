-- ============================================
-- BASE DE DATOS: NEXO WEBCHAT FRÁVEGA
-- Esquema completo + Datos semilla
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS nexo_webchat_fravega 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE nexo_webchat_fravega;

-- ============================================
-- 1. TABLA: usuarios (Agentes, Supervisores, Admins)
-- ============================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('agente', 'supervisor', 'admin') DEFAULT 'agente',
    estado ENUM('disponible', 'ocupado', 'pausa', 'desconectado') DEFAULT 'disponible',
    avatar_color VARCHAR(20) DEFAULT 'azul',
    max_chats_simultaneos INT DEFAULT 4,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rol (rol),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- 2. TABLA: clientes (Compradores de Frávega)
-- ============================================
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefono VARCHAR(30),
    dni VARCHAR(20) NOT NULL UNIQUE,
    cliente_desde INT DEFAULT 2024,
    pedidos_totales INT DEFAULT 1,
    casos_totales INT DEFAULT 0,
    avatar VARCHAR(10) DEFAULT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dni (dni),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- ============================================
-- 3. TABLA: pedidos (Compras en Frávega)
-- ============================================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    numero_pedido VARCHAR(30) NOT NULL UNIQUE,
    producto_resumen VARCHAR(200) NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    metodo_entrega VARCHAR(50) DEFAULT 'Entrega a domicilio',
    fecha_estimada VARCHAR(50),
    estado_logistico ENUM('en_preparacion', 'en_distribucion', 'entregado', 'demorado') DEFAULT 'en_distribucion',
    centro_distribucion VARCHAR(100),
    tracking_code VARCHAR(50),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_numero_pedido (numero_pedido),
    INDEX idx_estado_logistico (estado_logistico)
) ENGINE=InnoDB;

-- ============================================
-- 4. TABLA: conversaciones (Chats)
-- ============================================
CREATE TABLE conversaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    agente_id INT NULL,
    pedido_id INT NULL,
    motivo VARCHAR(100) DEFAULT 'Consulta general',
    estado ENUM('esperando', 'activo', 'resuelto', 'cerrado') DEFAULT 'esperando',
    calificacion_csat INT NULL CHECK (calificacion_csat BETWEEN 1 AND 5),
    canal VARCHAR(30) DEFAULT 'web',
    navegador VARCHAR(100),
    pagina_origen VARCHAR(255),
    inicio_conversacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fin_conversacion TIMESTAMP NULL,
    primera_respuesta_en INT NULL COMMENT 'Segundos hasta primera respuesta',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (agente_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
    INDEX idx_estado (estado),
    INDEX idx_agente (agente_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_inicio (inicio_conversacion)
) ENGINE=InnoDB;

-- ============================================
-- 5. TABLA: mensajes
-- ============================================
CREATE TABLE mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversacion_id INT NOT NULL,
    tipo_emisor ENUM('cliente', 'agente', 'sistema', 'bot') NOT NULL,
    emisor_id INT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE CASCADE,
    INDEX idx_conversacion (conversacion_id),
    INDEX idx_tipo_emisor (tipo_emisor),
    INDEX idx_creado (creado_en)
) ENGINE=InnoDB;

-- ============================================
-- 6. TABLA: respuestas_rapidas (Canned Responses)
-- ============================================
CREATE TABLE respuestas_rapidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    atajo VARCHAR(30) NOT NULL UNIQUE,
    titulo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    categoria VARCHAR(50) DEFAULT 'General',
    uso_count INT DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_atajo (atajo),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB;

-- ============================================
-- 7. TABLA: base_conocimiento (Knowledge Base)
-- ============================================
CREATE TABLE base_conocimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    procedimiento TEXT NOT NULL,
    enlace_documento VARCHAR(255) NULL,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_activo (activo)
) ENGINE=InnoDB;

-- ============================================
-- 8. TABLA: escalaciones
-- ============================================
CREATE TABLE escalaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversacion_id INT NULL,
    cliente_id INT NOT NULL,
    pedido_id INT NULL,
    motivo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    prioridad ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
    estado ENUM('pendiente', 'en_proceso', 'resuelto', 'cancelado') DEFAULT 'pendiente',
    derivado_a VARCHAR(100),
    agente_origen_id INT,
    resuelto_por INT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (agente_origen_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_prioridad (prioridad),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- 9. TABLA: metricas_diarias (para reportes)
-- ============================================
CREATE TABLE metricas_diarias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    total_chats INT DEFAULT 0,
    chats_resueltos INT DEFAULT 0,
    chats_abandonados INT DEFAULT 0,
    tiempo_promedio_respuesta INT DEFAULT 0 COMMENT 'En segundos',
    tiempo_promedio_atencion INT DEFAULT 0 COMMENT 'En segundos',
    csat_promedio DECIMAL(3,2) DEFAULT 0,
    fcr_porcentaje DECIMAL(5,2) DEFAULT 0,
    UNIQUE KEY uk_fecha (fecha)
) ENGINE=InnoDB;

-- ============================================
-- DATOS SEMILLA
-- ============================================

-- Usuarios (contraseña: "fravega2025" hasheada con password_hash)
INSERT INTO usuarios (nombre, email, password_hash, rol, estado, avatar_color) VALUES
('Sofía Ríos', 'sofia.rios@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agente', 'ocupado', 'azul'),
('Martín Pereyra', 'martin.pereyra@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agente', 'ocupado', 'verde'),
('Valentina Torres', 'valentina.torres@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agente', 'disponible', 'rosa'),
('Diego Álvarez', 'diego.alvarez@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agente', 'disponible', 'naranja'),
('Camila Sánchez', 'camila.sanchez@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agente', 'pausa', 'purple'),
('Nicolás Romero', 'nicolas.romero@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'supervisor', 'disponible', 'azul'),
('Laura Gómez', 'laura.gomez@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agente', 'desconectado', 'verde');

-- Clientes
INSERT INTO clientes (nombre, email, telefono, dni, cliente_desde, pedidos_totales, casos_totales, avatar) VALUES
('María González', 'maria.gonzalez@gmail.com', '+54 11 5542-8891', '32456789', 2021, 7, 2, 'MG'),
('Carlos Rodríguez', 'c.rodriguez@outlook.com', '+54 11 4421-3356', '28901234', 2019, 12, 1, 'CR'),
('Lucía Fernández', 'lucia.fernandez@yahoo.com', '+54 11 6678-1122', '35678432', 2023, 3, 0, 'LF'),
('Roberto Martínez', 'r.martinez@gmail.com', '+54 11 3345-7788', '24112567', 2020, 9, 3, 'RM'),
('Ana López', 'ana.lopez@hotmail.com', '+54 11 5567-9900', '30234890', 2022, 5, 1, 'AL');

-- Pedidos
INSERT INTO pedidos (cliente_id, numero_pedido, producto_resumen, monto, metodo_entrega, fecha_estimada, estado_logistico, centro_distribucion) VALUES
(1, '10452', 'Smart TV Samsung 50" UHD 4K UN50AU7000', 489999.00, 'Entrega a domicilio', '15-17 Ene 2025', 'en_distribucion', 'Monte Grande'),
(2, '10389', 'Notebook Lenovo IdeaPad 3 15" Ryzen 5 8GB 512GB SSD', 749999.00, 'Retiro en sucursal Caballito', '12 Ene 2025', 'en_preparacion', 'Caballito'),
(3, '10501', 'Heladera Whirlpool WRM45A Inverse 396L', 1299000.00, 'Entrega a domicilio', '20-22 Ene 2025', 'en_preparacion', 'Tigre'),
(5, '10298', 'Aire Acondicionado Samsung WindFree 3200F', 899999.00, 'Entrega + Instalación', '10 Ene 2025', 'entregado', 'Lomas de Zamora'),
(4, '10445', 'Lavarropas Automático Drean Next 8.15', 599999.00, 'Entrega a domicilio', '14 Ene 2025', 'demorado', 'Monte Grande');

-- Conversaciones
INSERT INTO conversaciones (cliente_id, agente_id, pedido_id, motivo, estado, inicio_conversacion) VALUES
(1, 1, 1, 'Pedido · Demora en entrega', 'activo', '2025-01-15 14:32:00'),
(2, NULL, 2, 'Preventa · Consulta de stock', 'esperando', '2025-01-15 14:28:00'),
(3, NULL, NULL, 'Preventa · Promociones bancarias', 'esperando', '2025-01-15 14:30:00'),
(4, 2, 5, 'Postventa · Producto dañado', 'activo', '2025-01-15 14:20:00'),
(5, 1, 4, 'Postventa · Instalación pendiente', 'resuelto', '2025-01-15 13:45:00');

-- Mensajes (Conversación 1 - María González)
INSERT INTO mensajes (conversacion_id, tipo_emisor, emisor_id, mensaje, creado_en) VALUES
(1, 'sistema', NULL, 'Chat iniciado · Canal: Web fravega.com · Chrome/Windows', '2025-01-15 14:32:00'),
(1, 'bot', NULL, '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte hoy?', '2025-01-15 14:32:05'),
(1, 'cliente', NULL, 'Hola, compré un Smart TV y no me llegó. Ya pasó la fecha de entrega.', '2025-01-15 14:33:00'),
(1, 'bot', NULL, 'Entiendo tu consulta. Voy a conectarte con un asesor. Un momento por favor...', '2025-01-15 14:33:10'),
(1, 'sistema', NULL, '⚡ Transferido a agente: Sofía Ríos', '2025-01-15 14:34:00'),
(1, 'agente', 1, '¡Hola María! Buenas tardes. Soy Sofía. Estoy revisando tu pedido en este momento. ¿Podrías confirmarme tu número de pedido?', '2025-01-15 14:34:15'),
(1, 'cliente', NULL, 'Sí, es el #10452. Es el Smart TV Samsung de 50 pulgadas.', '2025-01-15 14:35:00'),
(1, 'agente', 1, 'Perfecto, ya lo ubiqué. Veo que está "En distribución". Déjame consultar con el centro logístico de Monte Grande.', '2025-01-15 14:36:00'),
(1, 'cliente', NULL, '¿Me pueden decir dónde está mi pedido? Ya pasó la fecha estimada.', '2025-01-15 14:37:00');

-- Mensajes (Conversación 2 - Carlos Rodríguez)
INSERT INTO mensajes (conversacion_id, tipo_emisor, emisor_id, mensaje, creado_en) VALUES
(2, 'sistema', NULL, 'Chat iniciado · Canal: Web fravega.com', '2025-01-15 14:28:00'),
(2, 'bot', NULL, '¡Hola! 👋 ¿En qué puedo ayudarte?', '2025-01-15 14:28:05'),
(2, 'cliente', NULL, 'Hola, quiero comprar la notebook Lenovo IdeaPad 3 pero necesito retirarla hoy de Caballito. ¿Tienen stock?', '2025-01-15 14:29:00'),
(2, 'cliente', NULL, 'Buenas, quiero saber si tienen la notebook en la sucursal de Caballito para retirar hoy.', '2025-01-15 14:30:00');

-- Mensajes (Conversación 3 - Lucía Fernández)
INSERT INTO mensajes (conversacion_id, tipo_emisor, emisor_id, mensaje, creado_en) VALUES
(3, 'sistema', NULL, 'Chat iniciado · Canal: Web fravega.com', '2025-01-15 14:30:00'),
(3, 'bot', NULL, '¡Hola! 👋 ¿En qué puedo ayudarte?', '2025-01-15 14:30:05'),
(3, 'cliente', NULL, '¿Qué promos hay con tarjeta de crédito? Busco un aire acondicionado.', '2025-01-15 14:31:00');

-- Mensajes (Conversación 4 - Roberto Martínez)
INSERT INTO mensajes (conversacion_id, tipo_emisor, emisor_id, mensaje, creado_en) VALUES
(4, 'sistema', NULL, 'Chat iniciado · Canal: Web fravega.com', '2025-01-15 14:20:00'),
(4, 'bot', NULL, '¡Hola! 👋 Soy el asistente virtual de Frávega.', '2025-01-15 14:20:05'),
(4, 'cliente', NULL, 'Me llegó el lavarropas pero está dañado. La caja vino golpeada.', '2025-01-15 14:21:00'),
(4, 'sistema', NULL, '⚡ Transferido a agente: Martín Pereyra', '2025-01-15 14:22:00'),
(4, 'agente', 2, 'Roberto, lamento lo sucedido. Voy a generar un reclamo. ¿Confirmás tu N° de pedido?', '2025-01-15 14:22:15'),
(4, 'cliente', NULL, 'Es el #10445', '2025-01-15 14:23:00'),
(4, 'agente', 2, 'Necesito que me envíes fotos del daño. ¿Podés adjuntarlas aquí?', '2025-01-15 14:24:00'),
(4, 'cliente', NULL, 'Sí, la caja llegó toda abollada y el tambor tiene un golpe.', '2025-01-15 14:25:00');

-- Mensajes (Conversación 5 - Ana López)
INSERT INTO mensajes (conversacion_id, tipo_emisor, emisor_id, mensaje, creado_en) VALUES
(5, 'sistema', NULL, 'Chat iniciado · Canal: Web fravega.com', '2025-01-15 13:45:00'),
(5, 'cliente', NULL, 'Hola, me entregaron el aire pero no vino el técnico a instalarlo.', '2025-01-15 13:46:00'),
(5, 'agente', 1, '¡Hola Ana! Revisando tu pedido #10298, veo que la instalación estaba programada. Voy a reagendarla.', '2025-01-15 13:47:00'),
(5, 'agente', 1, 'Listo Ana, generé la orden. El técnico pasará entre el 16 y 17 de enero. Te llegará un SMS.', '2025-01-15 13:50:00'),
(5, 'cliente', NULL, '¡Muchas gracias! Quedo atenta a la confirmación.', '2025-01-15 13:51:00'),
(5, 'sistema', NULL, '✅ Caso resuelto · CSAT: 5/5 ⭐', '2025-01-15 13:52:00');

-- Respuestas Rápidas
INSERT INTO respuestas_rapidas (atajo, titulo, contenido, categoria) VALUES
('/saludo', 'Saludo inicial', '¡Hola! 👋 Soy [Nombre], asesor/a de Frávega. Estoy revisando tu consulta y te respondo en un momento. ¿Podrías confirmarme tu número de pedido?', 'General'),
('/estado', 'Consulta estado pedido', 'Estoy consultando el estado de tu pedido en nuestro sistema logístico. Te pido un momento mientras verifico la información actualizada con el centro de distribución.', 'Logística'),
('/demora', 'Demora en entrega', 'Comprendo tu frustración por la demora. Estamos trabajando para resolverlo a la brevedad. Voy a escalar tu caso al área de logística para priorizar tu entrega. Te mantendré informado/a por este mismo chat.', 'Logística'),
('/retiro', 'Retiro por tercero', 'Para que otra persona retire tu pedido en sucursal, necesitás:\n\n📋 Autorización firmada por el titular\n📋 Copia del DNI del titular\n📋 Código de compra (lo recibiste por email)\n📋 DNI original de la persona que retira\n\n¿Necesitás que te envíe el modelo de autorización por email?', 'Sucursal'),
('/cambio', 'Cambio/Devolución', 'Dentro de los 10 días corridos desde la recepción, podés ejercer tu derecho de cambio o devolución sin costo.\n\nPara iniciar necesito:\n1. Número de pedido\n2. Motivo del cambio/devolución\n3. Si hay daño, fotos del mismo\n\n¿Querés que iniciemos el trámite?', 'Postventa'),
('/garantia', 'Consulta garantía', 'Tu producto cuenta con garantía oficial del fabricante. Para gestionar el servicio técnico necesito:\n\n1. Número de pedido\n2. Descripción de la falla\n3. Fotos o video del problema\n\nPlazo de respuesta: 48hs hábiles.', 'Postventa'),
('/promos', 'Promociones bancarias', 'Promociones vigentes con tarjetas de crédito:\n\n🏦 Santander: 3, 6 y 12 cuotas sin interés\n🏦 Galicia: 3 y 6 cuotas SI + 10% extra\n🏦 BBVA: 12 y 18 cuotas SI\n🏦 Macro: 6 cuotas SI\n🏦 Naranja: 12 cuotas SI\n\n💳 También aceptamos Mercado Pago.\n\n¿Sobre qué producto consultás?', 'Preventa'),
('/cierre', 'Cierre de chat', '¡Fue un placer atenderte! 😊 Si tenés alguna otra consulta, no dudes en volver a contactarnos. Al finalizar este chat vas a recibir una breve encuesta de satisfacción. ¡Que tengas un excelente día!', 'General');

-- Base de Conocimiento
INSERT INTO base_conocimiento (titulo, categoria, procedimiento) VALUES
('Procedimiento de retiro por tercero en sucursal', 'Sucursal', '1. Verificar identidad del titular en CRM\n2. Confirmar que el pedido esté disponible para retiro\n3. Indicar requisitos: autorización firmada, copia DNI, código de compra, DNI original del tercero\n4. Enviar modelo de autorización por email si el cliente lo solicita\n5. Confirmar sucursal y horario de atención'),
('Escalamiento de demora logística (>48hs)', 'Logística', '1. Validar datos del pedido en TMS\n2. Contactar centro de distribución correspondiente\n3. Generar orden de destrabe en sistema\n4. Informar al cliente nueva fecha estimada\n5. Si supera 72hs sin resolución, escalar a Supervisor de Postventa\n6. Registrar en ficha del cliente para seguimiento'),
('Proceso de cambio/devolución (10 días)', 'Postventa', '1. Verificar fecha de entrega (máx 10 días corridos)\n2. Solicitar motivo del cambio/devolución\n3. Si hay daño: solicitar fotos\n4. Generar orden de logística inversa\n5. Coordinar retiro con transporte (Andreani/OCASA)\n6. Emitir nota de crédito o enviar producto de reemplazo\n7. Confirmar al cliente plazos de acreditación'),
('Derivación a servicio técnico oficial (Garantía)', 'Postventa', '1. Verificar que el producto esté dentro del período de garantía\n2. Recopilar datos: N° pedido, descripción falla, fotos/video\n3. Identificar marca y centro de servicio oficial correspondiente\n4. Generar ticket de derivación en sistema\n5. Informar al cliente plazo de respuesta (48hs hábiles)\n6. Hacer seguimiento a las 48hs si no hay respuesta del ST'),
('Validación de identidad del cliente', 'Seguridad', '1. Solicitar nombre completo y DNI\n2. Cruzar con datos registrados en CRM\n3. Confirmar email o teléfono registrado\n4. Si hay pedido involucrado: solicitar N° de pedido o últimos 4 dígitos de tarjeta\n5. Si no coincide: NO brindar información sensible\n6. Derivar a Supervisor si hay sospecha de fraude'),
('Tabla de promociones bancarias (actualizada)', 'Preventa', 'Consultar tabla actualizada en: intranet.fravega.com/promos\n\nSamsung: 12 cuotas SI con Santander y Galicia\nLG: 18 cuotas SI con BBVA\nPhilips: 6 cuotas SI con todas las tarjetas\nWhirlpool: 12 cuotas SI con Macro y Naranja\n\nNota: Las promociones se actualizan los lunes.'),
('Manejo de cliente enojado / situación conflictiva', 'Calidad', '1. Mantener calma y tono empático\n2. Validar la frustración: "Entiendo perfectamente su molestia"\n3. No usar lenguaje defensivo\n4. Ofrecer solución concreta con plazos\n5. Si solicita superior: escalar a Supervisor\n6. Si insultos/threats: advertir con respeto y cerrar si persiste\n7. Documentar todo en la ficha del caso'),
('Procedimiento de facturación (Factura A / B)', 'Administrativo', '1. Solicitar CUIT/CUIL y datos de facturación\n2. Verificar si el pedido ya fue facturado\n3. Si necesita cambio B a A: derivar a Back Office de Facturación\n4. Si necesita duplicado: reenviar por email desde sistema\n5. Si hay error en datos: generar nota de crédito y refacturar\n6. Plazo de resolución: 48hs hábiles');

-- Escalaciones semilla
INSERT INTO escalaciones (cliente_id, pedido_id, motivo, descripcion, prioridad, estado, derivado_a, agente_origen_id) VALUES
(4, 5, 'Producto dañado en entrega', 'Lavarropas recibido con caja dañada y golpe en tambor. Fotos adjuntadas por el cliente.', 'alta', 'en_proceso', 'Postventa y Reclamos', 2),
(1, 1, 'Demora superior a 72hs', 'Smart TV con demora en centro de distribución Monte Grande. Fecha estimada vencida.', 'media', 'en_proceso', 'Back Office Logística', 1),
(4, NULL, 'Reclamo Defensa del Consumidor', 'Cliente presenta reclamo formal COPREC por producto no entregado en 30 días.', 'critica', 'pendiente', 'Escalaciones Complejas', 3),
(3, NULL, 'Error en facturación CUIT', 'Factura emitida con CUIT incorrecto. Nota de crédito y refacturación generada.', 'baja', 'resuelto', 'Back Office Facturación', 4);
