# PROMPT MAESTRO — NEXO WEB CHAT
## Para trabajar con IAs (Antigravity IDE, Codex, Claude, GPT, etc.)

---

## 📋 CONTEXTO DEL PROYECTO

**Nombre:** Nexo Web Chat  
**Cliente:** Frávega (retail argentino de electrónica)  
**Propósito:** Sistema de atención al cliente mediante chat web omnicanal  
**Estado actual:** MVP funcional con frontend completo + backend PHP/MySQL  

---

## 🎯 OBJETIVO DEL SISTEMA

Construir una plataforma de atención al cliente que permita:
1. Que un cliente inicie conversación desde un widget de chat en la tienda online
2. Que el mensaje llegue a una cola de conversaciones
3. Que un operador tome la conversación y responda en tiempo real
4. Que el operador pueda consultar datos del cliente y pedido
5. Que pueda usar respuestas rápidas y base de conocimiento
6. Que pueda escalar casos a otros sectores
7. Que se almacene todo el historial en MySQL
8. Que supervisores puedan consultar métricas en tiempo real

---

## 🏗️ ARQUITECTURA TÉCNICA

### Stack Tecnológico (OBLIGATORIO - NO usar frameworks)
- **Backend:** PHP 8+ (sin Laravel, sin frameworks)
- **Base de datos:** MySQL 8+
- **Frontend:** HTML5 + CSS3 puro + JavaScript ES6+ (sin React, Vue, Angular)
- **Comunicación:** Fetch API + JSON
- **Seguridad:** PDO con prepared statements, password_hash(), tokens CSRF
- **Servidor:** Apache/XAMPP

### Estructura de Carpetas
```
/nexo-web-chat/
├── /config/
│   ├── config.php          → Constantes globales
│   └── database.php        → Conexión PDO (Singleton)
├── /includes/
│   ├── auth.php            → Sesiones y autenticación
│   ├── permissions.php     → Control de roles
│   └── csrf.php            → Protección CSRF
├── /api/                   → Endpoints REST (JSON)
│   ├── auth.php
│   ├── conversations.php   → CRUD completo
│   ├── messages.php        → CRUD + polling
│   ├── customers.php       → CRUD completo
│   ├── orders.php          → CRUD completo
│   ├── quick_replies.php   → CRUD completo
│   ├── knowledge_base.php  → CRUD completo
│   ├── escalations.php     → CRUD completo
│   ├── metrics.php         → Solo lectura
│   ├── users.php           → CRUD completo
│   └── quality.php         → CRUD completo
├── /public/                → Frontend HTML/CSS/JS
│   ├── index.php           → Login
│   ├── dashboard.php
│   ├── conversations.php
│   ├── customers.php
│   ├── orders.php
│   ├── users.php
│   └── /assets/
│       ├── /css/
│       │   ├── variables.css
│       │   ├── base.css
│       │   ├── layout.css
│       │   ├── components.css
│       │   ├── chat.css
│       │   └── responsive.css
│       └── /js/
│           ├── app.js
│           ├── api.js
│           ├── auth.js
│           ├── conversations.js
│           ├── messages.js
│           ├── customers.js
│           ├── orders.js
│           ├── quick-replies.js
│           ├── knowledge.js
│           └── metrics.js
├── /chat/
│   └── widget.php          → Widget embebible del cliente
└── /database/
    ├── schema.sql          → Estructura de tablas
    └── seed.sql            → Datos de prueba
```

---

## 🗄️ BASE DE DATOS (10 tablas)

### Tablas Principales
1. **users** → Agentes, supervisores, admins
2. **customers** → Clientes de Frávega
3. **orders** → Pedidos de clientes
4. **conversations** → Chats entre cliente y agente
5. **messages** → Mensajes de cada conversación
6. **quick_replies** → Plantillas de respuestas
7. **knowledge_base** → Artículos de procedimientos
8. **escalations** → Casos escalados
9. **quality_reviews** → Evaluaciones de calidad
10. **agent_status** → Estado en tiempo real del agente

### Relaciones Clave
- `conversations.customer_id` → `customers.id`
- `conversations.agent_id` → `users.id`
- `conversations.order_id` → `orders.id`
- `messages.conversation_id` → `conversations.id`
- `escalations.conversation_id` → `conversations.id`

---

## 👥 ROLES Y PERMISOS

### ADMIN
- Gestión total del sistema
- CRUD de usuarios
- Configuración global
- Ver todas las métricas

### SUPERVISOR
- Ver todas las conversaciones
- Gestionar escalaciones
- Revisar calidad
- Ver métricas

### AGENTE
- Atender conversaciones
- Consultar clientes/pedidos
- Usar respuestas rápidas
- Crear escalaciones

---

## 🔌 APIs CRUD COMPLETAS

### Formato de Respuesta (OBLIGATORIO)
```json
// Éxito
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
}
```

### Endpoints Principales

#### 1. Conversaciones (`/api/conversations.php`)
- `GET ?action=list` → Listar conversaciones
- `GET ?action=get&id=X` → Obtener conversación con mensajes
- `POST ?action=create` → Crear conversación
- `POST ?action=update` → Actualizar conversación
- `POST ?action=delete` → Eliminar conversación
- `POST ?action=take&id=X` → Agente toma conversación
- `POST ?action=close&id=X` → Cerrar conversación
- `POST ?action=hold&id=X` → Poner en espera
- `POST ?action=rate` → Calificar CSAT

#### 2. Mensajes (`/api/messages.php`)
- `GET ?conversation_id=X&since=Y` → Polling (solo mensajes nuevos)
- `POST ?action=send` → Enviar mensaje
- `POST ?action=update` → Editar mensaje
- `POST ?action=delete` → Eliminar mensaje

#### 3. Clientes (`/api/customers.php`)
- `GET ?action=list` → Listar clientes (paginado)
- `GET ?action=get&id=X` → Obtener cliente
- `POST ?action=create` → Crear cliente
- `POST ?action=update` → Actualizar cliente
- `POST ?action=delete` → Eliminar cliente
- `GET ?action=search&q=X` → Buscar clientes

#### 4. Pedidos (`/api/orders.php`)
- `GET ?action=list` → Listar pedidos
- `GET ?action=get&id=X` → Obtener pedido
- `POST ?action=create` → Crear pedido
- `POST ?action=update` → Actualizar pedido
- `POST ?action=delete` → Eliminar pedido
- `GET ?action=by_customer&customer_id=X` → Pedidos de un cliente

#### 5. Respuestas Rápidas (`/api/quick_replies.php`)
- CRUD completo + búsqueda

#### 6. Base de Conocimiento (`/api/knowledge_base.php`)
- CRUD completo + búsqueda full-text

#### 7. Escalaciones (`/api/escalations.php`)
- CRUD completo + resolver

#### 8. Métricas (`/api/metrics.php`)
- `GET ?action=dashboard` → KPIs (FCR, CSAT, TMR, AHT)
- `GET ?action=agents` → Estado de agentes
- `GET ?action=detailed` → Métricas detalladas

#### 9. Usuarios (`/api/users.php`)
- CRUD completo (solo admin)

#### 10. Calidad (`/api/quality.php`)
- CRUD completo + estadísticas

---

## 🔄 TIEMPO REAL (Polling)

### Implementación Actual
```javascript
// Cada 3 segundos consultar mensajes nuevos
setInterval(() => {
  fetch(`/api/messages.php?conversation_id=${id}&since=${lastTimestamp}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data.length > 0) {
        updateMessages(data.data);
      }
    });
}, 3000);
```

### Preparado para SSE (Server-Sent Events)
La arquitectura permite migrar a SSE sin cambiar el frontend:
- Endpoint futuro: `/api/messages.php?action=stream`
- Solo cambiar la función `pollMessages()` en `messages.js`

---

## 🎨 DISEÑO Y UX

### Paleta de Colores
```css
--primary-900: #0c2d4a;    /* Azul oscuro - sidebar */
--primary-500: #2563eb;    /* Azul corporativo */
--primary-100: #dbeafe;    /* Azul claro */
--success-600: #059669;    /* Verde - éxito */
--warning-600: #d97706;    /* Amarillo - espera */
--danger-600: #dc2626;     /* Rojo - error/crítico */
```

### Estados de Conversación
- **waiting** → Amarillo (en espera)
- **active** → Verde (en atención)
- **on_hold** → Púrpura (en pausa)
- **closed** → Gris (cerrado)

### Layout Principal (3 Paneles)
1. **Panel Izquierdo:** Cola de conversaciones (320px)
2. **Panel Central:** Sala de chat (flexible)
3. **Panel Derecho:** Contexto del cliente (300px)

---

## 🔐 SEGURIDAD (OBLIGATORIO)

### Implementar SIEMPRE
1. **PDO + Prepared Statements** → Prevenir SQL Injection
2. **password_hash() + password_verify()** → Nunca guardar contraseñas en texto plano
3. **Tokens CSRF** → Proteger operaciones POST/PUT/DELETE
4. **htmlspecialchars()** → Escape de output contra XSS
5. **Sesiones PHP** → `session_regenerate_id()` al login
6. **Control de acceso por roles** → Verificar permisos en cada endpoint
7. **Validación de inputs** → Sanitizar todos los datos
8. **Error handling** → Nunca mostrar errores internos al usuario

### Ejemplo de Endpoint Seguro
```php
<?php
require_once '../includes/auth.php';
require_once '../includes/permissions.php';
require_once '../includes/csrf.php';

header('Content-Type: application/json; charset=utf-8');

// 1. Verificar autenticación
requerirAutenticacion();

// 2. Verificar permiso
requerirPermiso('conversations.create');

// 3. Validar CSRF (para POST/PUT/DELETE)
requerirCSRF();

// 4. Validar y sanitizar inputs
$data = json_decode(file_get_contents('php://input'), true);
$name = trim($data['name'] ?? '');

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Nombre requerido']);
    exit;
}

// 5. Usar prepared statements
$pdo = getDB();
$stmt = $pdo->prepare("INSERT INTO customers (name) VALUES (?)");
$stmt->execute([$name]);

// 6. Respuesta consistente
echo json_encode([
    'success' => true,
    'message' => 'Cliente creado',
    'data' => ['id' => $pdo->lastInsertId()]
]);
?>
```

---

## 📊 MÉTRICAS A CALCULAR

### KPIs del Dashboard
1. **FCR (First Contact Resolution)** → % de conversaciones resueltas en primer contacto
2. **CSAT (Customer Satisfaction)** → Promedio de calificación (1-5)
3. **TMR (Tiempo Medio de Respuesta)** → Promedio de tiempo hasta primera respuesta
4. **AHT (Average Handle Time)** → Tiempo promedio total de atención
5. **NPS (Net Promoter Score)** → Promotores - Detractores

### Consultas SQL Ejemplo
```sql
-- FCR
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN agent_id IS NOT NULL AND closed_at IS NOT NULL THEN 1 ELSE 0 END) as resolved
FROM conversations
WHERE DATE(created_at) = CURDATE();

-- CSAT promedio
SELECT AVG(csat_score) as avg_csat 
FROM conversations 
WHERE csat_score IS NOT NULL;

-- TMR (tiempo hasta primera respuesta del agente)
SELECT AVG(TIMESTAMPDIFF(SECOND, started_at, 
  (SELECT MIN(created_at) FROM messages m 
   WHERE m.conversation_id = c.id AND m.sender_type = 'agent')
)) as avg_time
FROM conversations c
WHERE c.status IN ('active', 'closed');
```

---

## 🚀 FLUJO PRINCIPAL

### 1. Cliente inicia chat
```
Cliente → Widget → Formulario (nombre, DNI, pedido, motivo) → 
POST /api/conversations.php?action=create → 
Estado: WAITING → Aparece en cola
```

### 2. Agente toma conversación
```
Agente ve en cola → Click "Tomar" → 
POST /api/conversations.php?action=take&id=X → 
Estado: ACTIVE → Chat se asigna al agente
```

### 3. Conversación en tiempo real
```
Agente escribe → POST /api/messages.php?action=send → 
Cliente ve mensaje (polling 3s) → 
Cliente responde → POST /api/messages.php → 
Agente ve respuesta (polling 3s)
```

### 4. Cierre de conversación
```
Agente resuelve → POST /api/conversations.php?action=close&id=X → 
Estado: CLOSED → Cliente recibe encuesta CSAT → 
Se registra calificación → Disponible para métricas
```

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### Frontend
- [x] Login con roles
- [x] Dashboard con KPIs
- [x] Bandeja de chats (3 paneles)
- [x] Enviar/recibir mensajes
- [x] Polling en tiempo real
- [x] Respuestas rápidas
- [x] Base de conocimiento
- [x] Escalaciones
- [x] Widget del cliente
- [x] Responsive design

### Backend
- [x] Autenticación por sesiones
- [x] Control de permisos
- [x] CRUD conversaciones
- [x] CRUD mensajes
- [x] CRUD clientes
- [x] CRUD pedidos
- [x] CRUD respuestas rápidas
- [x] CRUD base de conocimiento
- [x] CRUD escalaciones
- [x] Métricas en tiempo real
- [x] Seguridad (CSRF, XSS, SQL Injection)

---

## 🐛 BUGS CONOCIDOS Y CORRECCIONES

### Bug 1: Mensajes no se marcan como leídos
**Problema:** Los mensajes del agente no muestran "✓✓" cuando el cliente los lee  
**Solución:** Implementar endpoint `POST /api/messages.php?action=read` que actualice `read_at`

### Bug 2: Tiempo de espera no se actualiza
**Problema:** El tiempo en cola no se actualiza en tiempo real  
**Solución:** Calcular en frontend: `Date.now() - conversation.started_at`

### Bug 3: Notificaciones de nuevos mensajes
**Problema:** No hay notificación cuando llega un mensaje nuevo  
**Solución:** Implementar `Notification API` del navegador

---

## 📝 INSTRUCCIONES PARA IAs

### Cuando trabajes en este proyecto:

1. **NO uses frameworks** (React, Vue, Angular, Laravel, Bootstrap, Tailwind)
2. **Usa PHP puro** con PDO y prepared statements
3. **Usa CSS puro** con variables CSS, Grid y Flexbox
4. **Usa JavaScript ES6+** con Fetch API
5. **Mantén la estructura de carpetas** definida
6. **Sigue el formato de respuesta JSON** consistente
7. **Implementa seguridad** en cada endpoint
8. **Prueba cada funcionalidad** antes de entregar

### Ejemplo de Prompt para Continuar Desarrollo

```
Continúa el desarrollo de Nexo Web Chat.

TAREA: Implementar [funcionalidad específica]

REQUISITOS:
1. Backend: PHP 8+ con PDO, prepared statements, validación
2. Frontend: HTML5 + CSS3 + JavaScript ES6+ (sin frameworks)
3. API REST con formato JSON consistente
4. Seguridad: CSRF, XSS, SQL Injection
5. Responsive design
6. Código comentado y mantenible

ENTREGABLES:
- Archivo PHP del endpoint
- Archivo JavaScript del frontend
- Actualización de schema.sql si es necesario
- Documentación de la funcionalidad

NO USAR: React, Vue, Angular, Laravel, Bootstrap, Tailwind
```

---

## 🔗 RECURSOS

### Documentación PHP
- https://www.php.net/manual/es/
- https://www.php.net/manual/es/book.pdo.php

### Documentación MySQL
- https://dev.mysql.com/doc/refman/8.0/en/

### Documentación JavaScript
- https://developer.mozilla.org/es/docs/Web/JavaScript

### CSS Grid y Flexbox
- https://css-tricks.com/snippets/css/complete-guide-grid/
- https://css-tricks.com/snippets/css/a-guide-to-flexbox/

---

## 📞 CONTACTO

Si necesitas ayuda o tienes preguntas sobre el proyecto, consulta:
1. README.md del repositorio
2. Documentación en `/docs/`
3. Issues en GitHub

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0  
**Estado:** MVP funcional
