-- ============================================
-- NEXO WEB CHAT - DATOS DE PRUEBA
-- ============================================

USE nexo_webchat;

-- ============================================
-- USUARIOS
-- Contraseña para todos: "password123"
-- ============================================
INSERT INTO users (name, email, password, rol, status) VALUES
('Admin Sistema', 'admin@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'admin', 'available'),
('Nicolás Romero', 'nicolas.romero@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'supervisor', 'available'),
('Sofía Ríos', 'sofia.rios@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agent', 'available'),
('Martín Pereyra', 'martin.pereyra@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agent', 'busy'),
('Valentina Torres', 'valentina.torres@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agent', 'available'),
('Diego Álvarez', 'diego.alvarez@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agent', 'break'),
('Camila Sánchez', 'camila.sanchez@fravega.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2u', 'agent', 'offline');

-- ============================================
-- CLIENTES
-- ============================================
INSERT INTO customers (name, dni, email, phone) VALUES
('María González', '32456789', 'maria.gonzalez@gmail.com', '+54 11 5542-8891'),
('Carlos Rodríguez', '28901234', 'c.rodriguez@outlook.com', '+54 11 4421-3356'),
('Lucía Fernández', '35678432', 'lucia.fernandez@yahoo.com', '+54 11 6678-1122'),
('Roberto Martínez', '24112567', 'r.martinez@gmail.com', '+54 11 3345-7788'),
('Ana López', '30234890', 'ana.lopez@hotmail.com', '+54 11 5567-9900'),
('Pedro Sánchez', '27890123', 'pedro.sanchez@gmail.com', '+54 11 4456-7788'),
('Laura García', '31567890', 'laura.garcia@outlook.com', '+54 11 6678-9900'),
('Juan Pérez', '29345678', 'juan.perez@yahoo.com', '+54 11 3345-6677'),
('Sofía Díaz', '33789012', 'sofia.diaz@gmail.com', '+54 11 5567-8899'),
('Miguel Torres', '26234567', 'miguel.torres@hotmail.com', '+54 11 4456-9900');

-- ============================================
-- PEDIDOS
-- ============================================
INSERT INTO orders (order_number, customer_id, product, amount, payment_method, delivery_method, estimated_delivery, status) VALUES
('10452', 1, 'Smart TV Samsung 50" UHD 4K UN50AU7000', 489999.00, 'Tarjeta Crédito', 'Entrega a domicilio', '2025-01-17', 'shipping'),
('10389', 2, 'Notebook Lenovo IdeaPad 3 15" Ryzen 5', 749999.00, 'Mercado Pago', 'Retiro en sucursal', '2025-01-12', 'preparing'),
('10501', 3, 'Heladera Whirlpool WRM45A Inverse 396L', 1299000.00, 'Tarjeta Débito', 'Entrega a domicilio', '2025-01-22', 'preparing'),
('10298', 5, 'Aire Acondicionado Samsung WindFree 3200F', 899999.00, 'Tarjeta Crédito', 'Entrega + Instalación', '2025-01-10', 'delivered'),
('10445', 4, 'Lavarropas Automático Drean Next 8.15', 599999.00, 'Mercado Pago', 'Entrega a domicilio', '2025-01-14', 'delayed'),
('10567', 6, 'Cafetera Nespresso Vertuo Next', 189999.00, 'Tarjeta Crédito', 'Entrega a domicilio', '2025-01-20', 'preparing'),
('10623', 7, 'Parlante JBL Charge 5', 89999.00, 'Mercado Pago', 'Retiro en sucursal', '2025-01-15', 'shipping'),
('10701', 8, 'Monitor LG 27" 4K UHD', 349999.00, 'Tarjeta Crédito', 'Entrega a domicilio', '2025-01-25', 'preparing'),
('10789', 9, 'Auriculares Sony WH-1000XM5', 299999.00, 'Tarjeta Débito', 'Entrega a domicilio', '2025-01-18', 'shipping'),
('10834', 10, 'Tablet Samsung Galaxy Tab S9', 599999.00, 'Tarjeta Crédito', 'Entrega a domicilio', '2025-01-23', 'preparing');

-- ============================================
-- CONVERSACIONES
-- ============================================
INSERT INTO conversations (customer_id, agent_id, order_id, subject, reason, status, priority, csat_score, started_at, closed_at) VALUES
(1, 3, 1, 'Demora en entrega de Smart TV', 'Pedido · Demora en entrega', 'active', 'medium', NULL, '2025-01-15 14:32:00', NULL),
(2, NULL, 2, 'Consulta de stock Notebook', 'Preventa · Consulta de stock', 'waiting', 'low', NULL, '2025-01-15 14:28:00', NULL),
(3, NULL, NULL, 'Consulta promociones bancarias', 'Preventa · Promociones bancarias', 'waiting', 'low', NULL, '2025-01-15 14:30:00', NULL),
(4, 4, 5, 'Producto dañado al recibir', 'Postventa · Producto dañado', 'active', 'high', NULL, '2025-01-15 14:20:00', NULL),
(5, 3, 4, 'Instalación pendiente', 'Postventa · Instalación pendiente', 'closed', 'medium', 5, '2025-01-15 13:45:00', '2025-01-15 13:52:00'),
(6, NULL, 6, 'Consulta sobre cafetera', 'Preventa · Consulta de producto', 'waiting', 'low', NULL, '2025-01-15 14:35:00', NULL),
(7, 5, 7, 'Estado de mi pedido', 'Pedido · Seguimiento', 'active', 'medium', NULL, '2025-01-15 14:10:00', NULL),
(8, NULL, 8, 'Consulta de financiación', 'Preventa · Financiación', 'waiting', 'low', NULL, '2025-01-15 14:38:00', NULL),
(9, 3, 9, 'Auriculares no funcionan', 'Postventa · Producto defectuoso', 'on_hold', 'high', NULL, '2025-01-15 13:30:00', NULL),
(10, NULL, 10, 'Consulta sobre tablet', 'Preventa · Consulta de producto', 'closed', 'low', 4, '2025-01-15 12:00:00', '2025-01-15 12:15:00');

-- ============================================
-- MENSAJES
-- ============================================
-- Conversación 1 (María González - Demora TV)
INSERT INTO messages (conversation_id, sender_type, sender_id, message, created_at) VALUES
(1, 'system', NULL, 'Chat iniciado · Canal: Web fravega.com', '2025-01-15 14:32:00'),
(1, 'bot', NULL, '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte hoy?', '2025-01-15 14:32:05'),
(1, 'customer', NULL, 'Hola, compré un Smart TV y no me llegó. Ya pasó la fecha de entrega.', '2025-01-15 14:33:00'),
(1, 'system', NULL, '⚡ Transferido a agente: Sofía Ríos', '2025-01-15 14:34:00'),
(1, 'agent', 3, '¡Hola María! Buenas tardes. Soy Sofía, estoy revisando tu pedido en este momento.', '2025-01-15 14:34:15'),
(1, 'customer', NULL, 'Sí, es el #10452. Es el Smart TV Samsung de 50 pulgadas.', '2025-01-15 14:35:00'),
(1, 'agent', 3, 'Perfecto, ya lo ubiqué. Veo que tu pedido está en estado "En distribución". Déjame consultar con el centro logístico.', '2025-01-15 14:36:00');

-- Conversación 2 (Carlos Rodríguez - Stock)
INSERT INTO messages (conversation_id, sender_type, sender_id, message, created_at) VALUES
(2, 'system', NULL, 'Chat iniciado · Canal: Web fravega.com', '2025-01-15 14:28:00'),
(2, 'bot', NULL, '¡Hola! 👋 ¿En qué puedo ayudarte?', '2025-01-15 14:28:05'),
(2, 'customer', NULL, 'Hola, quiero comprar la notebook Lenovo IdeaPad 3 pero necesito retirarla hoy de la sucursal de Caballito. ¿Tienen stock?', '2025-01-15 14:29:00');

-- Conversación 4 (Roberto Martínez - Producto dañado)
INSERT INTO messages (conversation_id, sender_type, sender_id, message, created_at) VALUES
(4, 'system', NULL, 'Chat iniciado · Canal: Web fravega.com', '2025-01-15 14:20:00'),
(4, 'customer', NULL, 'Me llegó el lavarropas pero está dañado. La caja vino golpeada.', '2025-01-15 14:21:00'),
(4, 'system', NULL, '⚡ Transferido a agente: Martín Pereyra', '2025-01-15 14:22:00'),
(4, 'agent', 4, 'Roberto, lamento mucho lo sucedido. Voy a generar un reclamo inmediatamente.', '2025-01-15 14:22:15'),
(4, 'customer', NULL, 'Es el #10445', '2025-01-15 14:23:00'),
(4, 'agent', 4, 'Necesito que me envíes fotos del daño para documentar el reclamo. ¿Podés adjuntarlas aquí?', '2025-01-15 14:24:00');

-- ============================================
-- RESPUESTAS RÁPIDAS
-- ============================================
INSERT INTO quick_replies (title, shortcut, content, category) VALUES
('Saludo inicial', '/saludo', '¡Hola! 👋 Soy [Nombre], asesor/a de Frávega. Estoy revisando tu consulta y te respondo en un momento. ¿Podrías confirmarme tu número de pedido?', 'Saludo'),
('Consulta estado pedido', '/estado', 'Estoy consultando el estado de tu pedido en nuestro sistema logístico. Te pido un momento mientras verifico la información actualizada con el centro de distribución.', 'Pedido'),
('Demora en entrega', '/demora', 'Comprendo tu frustración por la demora. Voy a escalar tu caso al área de logística para priorizar tu entrega. Te mantendré informado/a por este mismo chat.', 'Envíos'),
('Retiro por tercero', '/retiro', 'Para que otra persona retire tu pedido en sucursal, necesitás:\n• Autorización firmada por el titular\n• Copia del DNI del titular\n• Código de compra\n• DNI original de quien retira\n\n¿Necesitás el modelo de autorización?', 'Retiro'),
('Promociones bancarias', '/promos', 'Promociones vigentes:\n🏦 Santander: 3, 6 y 12 cuotas SI\n🏦 Galicia: 3 y 6 cuotas SI + 10%\n🏦 BBVA: 12 y 18 cuotas SI\n🏦 Macro: 6 cuotas SI\n\n¿Sobre qué producto consultás?', 'Pagos'),
('Cambio/Devolución', '/cambio', 'Dentro de los 10 días corridos desde la recepción, podés ejercer tu derecho de cambio o devolución sin costo. Necesito: N° de pedido, motivo y fotos si hay daño. ¿Iniciamos el trámite?', 'Postventa'),
('Consulta garantía', '/garantia', 'Tu producto cuenta con garantía oficial del fabricante. Para gestionar el servicio técnico necesito: N° de pedido, descripción de la falla y fotos. Plazo de respuesta: 48hs hábiles.', 'Postventa'),
('Cierre de chat', '/cierre', '¡Fue un placer atenderte! 😊 Si tenés alguna otra consulta, no dudes en volver a contactarnos. Al finalizar este chat vas a recibir una breve encuesta de satisfacción. ¡Que tengas un excelente día!', 'Despedida'),
('Facturación', '/factura', 'Para emitir tu factura necesito: CUIT/CUIL, razón social (si corresponde), y datos de facturación. ¿Ya realizaste la compra o es para una nueva compra?', 'Facturación'),
('Horarios sucursal', '/horarios', 'Nuestros horarios de atención en sucursales son:\n📍 Lunes a Viernes: 9:00 a 20:00\n📍 Sábados: 10:00 a 18:00\n📍 Domingos: 12:00 a 18:00\n\n¿Necesitás la dirección de alguna sucursal en particular?', 'General');

-- ============================================
-- BASE DE CONOCIMIENTO
-- ============================================
INSERT INTO knowledge_base (title, content, category, keywords) VALUES
('Procedimiento de retiro por tercero en sucursal', '1. Verificar identidad del titular en CRM\n2. Confirmar que el pedido esté disponible para retiro\n3. Indicar requisitos: autorización firmada, copia DNI, código de compra, DNI original del tercero\n4. Enviar modelo de autorización por email si el cliente lo solicita\n5. Confirmar sucursal y horario de atención', 'Sucursal', 'retiro, tercero, sucursal, autorización, DNI'),
('Escalamiento de demora logística (>48hs)', '1. Validar datos del pedido en TMS\n2. Contactar centro de distribución correspondiente\n3. Generar orden de destrabe en sistema\n4. Informar al cliente nueva fecha estimada\n5. Si supera 72hs sin resolución, escalar a Supervisor de Postventa\n6. Registrar en ficha del cliente para seguimiento', 'Logística', 'demora, logística, distribución, destrabe, escalamiento'),
('Proceso de cambio/devolución (10 días)', '1. Verificar fecha de entrega (máx 10 días corridos)\n2. Solicitar motivo del cambio/devolución\n3. Si hay daño: solicitar fotos\n4. Generar orden de logística inversa\n5. Coordinar retiro con transporte\n6. Emitir nota de crédito o enviar producto de reemplazo\n7. Confirmar al cliente plazos de acreditación', 'Postventa', 'cambio, devolución, 10 días, logística inversa, nota de crédito'),
('Derivación a servicio técnico oficial (Garantía)', '1. Verificar que el producto esté dentro del período de garantía\n2. Recopilar datos: N° pedido, descripción falla, fotos/video\n3. Identificar marca y centro de servicio oficial correspondiente\n4. Generar ticket de derivación en sistema\n5. Informar al cliente plazo de respuesta (48hs hábiles)\n6. Hacer seguimiento a las 48hs si no hay respuesta del ST', 'Postventa', 'garantía, servicio técnico, derivación, peritaje, marca'),
('Validación de identidad del cliente', '1. Solicitar nombre completo y DNI\n2. Cruzar con datos registrados en CRM\n3. Confirmar email o teléfono registrado\n4. Si hay pedido involucrado: solicitar N° de pedido o últimos 4 dígitos de tarjeta\n5. Si no coincide: NO brindar información sensible\n6. Derivar a Supervisor si hay sospecha de fraude', 'Seguridad', 'identidad, validación, DNI, seguridad, fraude'),
('Tabla de promociones bancarias (actualizada)', 'Consultar tabla actualizada en: intranet.fravega.com/promos\n\nSamsung: 12 cuotas SI con Santander y Galicia\nLG: 18 cuotas SI con BBVA\nPhilips: 6 cuotas SI con todas las tarjetas\nWhirlpool: 12 cuotas SI con Macro y Naranja\n\nNota: Las promociones se actualizan los lunes. Verificar siempre antes de informar.', 'Preventa', 'promociones, cuotas, bancos, tarjetas, financiación'),
('Manejo de cliente enojado / situación conflictiva', '1. Mantener calma y tono empático\n2. Validar la frustración: "Entiendo perfectamente su molestia"\n3. No usar lenguaje defensivo\n4. Ofrecer solución concreta con plazos\n5. Si solicita superior: escalar a Supervisor\n6. Si insultos/threats: advertir con respeto y cerrar si persiste\n7. Documentar todo en la ficha del caso', 'Calidad', 'cliente enojado, conflicto, empatía, escalamiento, manejo'),
('Procedimiento de facturación (Factura A / B)', '1. Solicitar CUIT/CUIL y datos de facturación\n2. Verificar si el pedido ya fue facturado\n3. Si necesita cambio B a A: derivar a Back Office de Facturación\n4. Si necesita duplicado: reenviar por email desde sistema\n5. Si hay error en datos: generar nota de crédito y refacturar\n6. Plazo de resolución: 48hs hábiles', 'Administrativo', 'facturación, factura A, factura B, CUIT, duplicado'),
('Reprogramación de entrega', '1. Verificar estado actual del pedido\n2. Consultar disponibilidad de nuevas fechas\n3. Confirmar con cliente nueva fecha y franja horaria\n4. Actualizar sistema con nueva fecha\n5. Informar al cliente por email y chat\n6. Si hay costo adicional por reprogramación, informar antes de confirmar', 'Logística', 'reprogramación, entrega, fecha, franja horaria'),
('Consulta de stock en sucursales', '1. Acceder al sistema de inventario\n2. Consultar por SKU del producto\n3. Verificar stock por sucursal\n4. Si hay stock: confirmar disponibilidad y reservar\n5. Si no hay stock: ofrecer alternativas o plazo de reposición\n6. Informar al cliente opciones disponibles', 'Preventa', 'stock, sucursal, inventario, disponibilidad, SKU');

-- ============================================
-- ESCALACIONES
-- ============================================
INSERT INTO escalations (conversation_id, created_by, assigned_to, reason, notes, priority, status) VALUES
(4, 4, 2, 'Producto dañado en entrega', 'Lavarropas recibido con caja dañada y golpe en tambor. Fotos adjuntadas por el cliente.', 'high', 'in_progress'),
(1, 3, 2, 'Demora superior a 72hs', 'Smart TV con demora en centro de distribución Monte Grande. Fecha estimada vencida.', 'medium', 'in_progress'),
(NULL, 5, 2, 'Reclamo Defensa del Consumidor', 'Cliente presenta reclamo formal COPREC por producto no entregado en 30 días.', 'critical', 'pending'),
(NULL, 3, 2, 'Error en facturación CUIT', 'Factura emitida con CUIT incorrecto. Nota de crédito y refacturación generada.', 'low', 'resolved');

-- ============================================
-- EVALUACIONES DE CALIDAD
-- ============================================
INSERT INTO quality_reviews (conversation_id, reviewer_id, score, comments) VALUES
(5, 2, 9, 'Excelente atención. Resolvió el problema de instalación de manera rápida y eficiente.'),
(10, 2, 7, 'Buena atención, pero podría haber ofrecido más alternativas de productos.'),
(4, 2, 8, 'Manejo adecuado de situación conflictiva. Empático y profesional.'),
(1, 2, 8, 'Buena gestión de la demora. Mantuvo al cliente informado en todo momento.');
