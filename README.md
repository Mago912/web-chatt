# Nexo Web Chat - Sistema de Atención al Cliente

Sistema completo de atención al cliente mediante chat web, desarrollado con **PHP 8+**, **MySQL 8+**, **HTML5**, **CSS3** y **JavaScript ES6+**.

## 📋 Características

### Backend (PHP)
- ✅ **CRUD Completo** en todas las entidades
- ✅ Autenticación por sesiones
- ✅ Sistema de roles (Admin, Supervisor, Agente)
- ✅ Control de permisos granular
- ✅ Protección CSRF
- ✅ Prepared Statements (PDO)
- ✅ Validación de datos
- ✅ API RESTful con JSON

### Frontend
- ✅ Interfaz moderna y responsive
- ✅ Dashboard con métricas en tiempo real
- ✅ Bandeja de chats con 3 paneles
- ✅ Gestión CRUD de Clientes, Pedidos y Usuarios
- ✅ Base de conocimiento
- ✅ Respuestas rápidas
- ✅ Widget de chat para clientes
- ✅ Modales para crear/editar/eliminar

## 🗄️ Base de Datos

### Tablas
1. **users** - Usuarios del sistema (admin, supervisor, agent)
2. **customers** - Clientes
3. **orders** - Pedidos
4. **conversations** - Conversaciones de chat
5. **messages** - Mensajes
6. **quick_replies** - Respuestas rápidas
7. **knowledge_base** - Base de conocimiento
8. **escalations** - Escalaciones
9. **quality_reviews** - Evaluaciones de calidad

### Instalación
```bash
# 1. Crear base de datos
mysql -u root -p
CREATE DATABASE nexo_webchat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. Importar schema
mysql -u root -p nexo_webchat < backend/database/schema.sql

# 3. Importar datos de prueba
mysql -u root -p nexo_webchat < backend/database/seed.sql
```

## 🔌 APIs CRUD Completas

### 1. Autenticación (`/api/auth.php`)
| Acción | Método | Descripción |
|--------|--------|-------------|
| `login` | POST | Iniciar sesión |
| `logout` | POST | Cerrar sesión |
| `check` | GET | Verificar sesión activa |
| `csrf` | GET | Obtener token CSRF |

### 2. Clientes (`/api/customers.php`) ✅ CRUD
| Acción | Método | Descripción |
|--------|--------|-------------|
| `list` | GET | Listar clientes (paginado) |
| `get` | GET | Obtener cliente por ID |
| `create` | POST | Crear nuevo cliente |
| `update` | POST | Actualizar cliente |
| `delete` | POST | Eliminar cliente |
| `search` | GET | Buscar clientes |

**Ejemplo CREATE:**
```json
POST /api/customers.php?action=create
{
  "name": "Juan Pérez",
  "dni": "30123456",
  "email": "juan@email.com",
  "phone": "+54 11 4567-8900"
}
```

**Ejemplo UPDATE:**
```json
POST /api/customers.php?action=update
{
  "id": 1,
  "name": "Juan Carlos Pérez",
  "phone": "+54 11 9876-5432"
}
```

**Ejemplo DELETE:**
```json
POST /api/customers.php?action=delete
{
  "id": 1
}
```

### 3. Pedidos (`/api/orders.php`) ✅ CRUD
| Acción | Método | Descripción |
|--------|--------|-------------|
| `list` | GET | Listar pedidos (paginado) |
| `get` | GET | Obtener pedido por ID |
| `create` | POST | Crear nuevo pedido |
| `update` | POST | Actualizar pedido |
| `delete` | POST | Eliminar pedido |
| `by_customer` | GET | Pedidos de un cliente |

**Ejemplo CREATE:**
```json
POST /api/orders.php?action=create
{
  "order_number": "10999",
  "customer_id": 1,
  "product": "Smart TV 55\"",
  "amount": 599999,
  "payment_method": "Tarjeta Crédito",
  "delivery_method": "Entrega a domicilio",
  "estimated_delivery": "2025-01-25"
}
```

### 4. Conversaciones (`/api/conversations.php`) ✅ CRUD
| Acción | Método | Descripción |
|--------|--------|-------------|
| `list` | GET | Listar conversaciones |
| `get` | GET | Obtener conversación con mensajes |
| `create` | POST | Crear conversación |
| `update` | POST | Actualizar conversación |
| `delete` | POST | Eliminar conversación |
| `take` | POST | Tomar conversación (agente) |
| `close` | POST | Cerrar conversación |
| `hold` | POST | Poner en espera |
| `rate` | POST | Calificar CSAT |

### 5. Mensajes (`/api/messages.php`) ✅ CRUD
| Acción | Método | Descripción |
|--------|--------|-------------|
| `list` | GET | Listar mensajes (con polling) |
| `send` | POST | Enviar mensaje |
| `update` | POST | Editar mensaje |
| `delete` | POST | Eliminar mensaje |

**Ejemplo SEND:**
```json
POST /api/messages.php?action=send
{
  "conversation_id": 1,
  "message": "Hola, ¿en qué puedo ayudarte?",
  "sender_type": "agent"
}
```

### 6. Respuestas Rápidas (`/api/quick_replies.php`) ✅ CRUD
| Acción | Método | Descripción |
|--------|--------|-------------|
| `list` | GET | Listar respuestas |
| `search` | GET | Buscar respuestas |
| `create` | POST | Crear respuesta |
| `update` | POST | Actualizar respuesta |
| `delete` | POST | Eliminar respuesta |

### 7. Base de Conocimiento (`/api/knowledge_base.php`) ✅ CRUD
| Acción | Método | Descripción |
|--------|--------|-------------|
| `list` | GET | Listar artículos |
| `search` | GET | Buscar artículos |
| `get` | GET | Obtener artículo |
| `create` | POST | Crear artículo |
| `update` | POST | Actualizar artículo |
| `delete` | POST | Eliminar artículo |

### 8. Escalaciones (`/api/escalations.php`) ✅ CRUD
| Acción | Método | Descripción |
|--------|--------|-------------|
| `list` | GET | Listar escalaciones |
| `create` | POST | Crear escalación |
| `update` | POST | Actualizar escalación |
| `delete` | POST | Eliminar escalación |
| `resolve` | POST | Resolver escalación |

### 9. Métricas (`/api/metrics.php`) 📊
| Acción | Método | Descripción |
|--------|--------|-------------|
| `dashboard` | GET | KPIs del dashboard |
| `agents` | GET | Métricas de agentes |
| `detailed` | GET | Métricas detalladas |

### 10. Usuarios (`/api/users.php`) ✅ CRUD
| Acción | Método | Descripción |
|--------|--------|-------------|
| `list` | GET | Listar usuarios |
| `create` | POST | Crear usuario |
| `update` | POST | Actualizar usuario |
| `delete` | POST | Desactivar usuario |

### 11. Calidad (`/api/quality.php`) ✅ CRUD
| Acción | Método | Descripción |
|--------|--------|-------------|
| `list` | GET | Listar evaluaciones |
| `create` | POST | Crear evaluación |
| `update` | POST | Actualizar evaluación |
| `delete` | POST | Eliminar evaluación |
| `stats` | GET | Estadísticas de calidad |

## 🔐 Seguridad

- ✅ **password_hash()** y **password_verify()** para contraseñas
- ✅ **Prepared Statements** (PDO) contra SQL Injection
- ✅ **Tokens CSRF** para operaciones sensibles
- ✅ **htmlspecialchars()** contra XSS
- ✅ **Sesiones PHP** con regeneración de ID
- ✅ **Control de acceso** por roles
- ✅ **Validación** de todos los inputs
- ✅ **Soft delete** para datos críticos

## 👥 Roles y Permisos

### Admin
- Gestión total del sistema
- CRUD de usuarios
- Configuración global
- Ver todas las métricas

### Supervisor
- Ver todas las conversaciones
- Gestionar escalaciones
- Revisar calidad
- Ver métricas

### Agente
- Atender conversaciones
- Consultar clientes/pedidos
- Usar respuestas rápidas
- Crear escalaciones

## 🚀 Instalación

### Requisitos
- PHP 8.0+
- MySQL 8.0+
- Apache/Nginx
- XAMPP (recomendado para desarrollo)

### Pasos
1. Clonar repositorio en `htdocs/nexo-web-chat`
2. Importar base de datos (ver sección Base de Datos)
3. Configurar credenciales en `backend/config/database.php`
4. Acceder a `http://localhost/nexo-web-chat`

### Credenciales de prueba
- **Admin:** admin@fravega.com / password123
- **Supervisor:** nicolas.romero@fravega.com / password123
- **Agente:** sofia.rios@fravega.com / password123

## 📁 Estructura del Proyecto

```
nexo-web-chat/
├── backend/
│   ├── config/
│   │   ├── config.php          # Configuración general
│   │   └── database.php        # Conexión PDO
│   ├── includes/
│   │   ├── auth.php            # Autenticación
│   │   ├── permissions.php     # Control de permisos
│   │   └── csrf.php            # Protección CSRF
│   ├── api/
│   │   ├── auth.php            # API autenticación
│   │   ├── customers.php       # CRUD clientes
│   │   ├── orders.php          # CRUD pedidos
│   │   ├── conversations.php   # CRUD conversaciones
│   │   ├── messages.php        # CRUD mensajes
│   │   ├── quick_replies.php   # CRUD respuestas rápidas
│   │   ├── knowledge_base.php  # CRUD base conocimiento
│   │   ├── escalations.php     # CRUD escalaciones
│   │   ├── metrics.php         # Métricas
│   │   ├── users.php           # CRUD usuarios
│   │   └── quality.php         # CRUD calidad
│   └── database/
│       ├── schema.sql          # Estructura BD
│       └── seed.sql            # Datos de prueba
├── src/
│   ├── App.tsx                 # Frontend React
│   └── index.css               # Estilos CSS
└── README.md
```

## 📊 Funcionalidades del Frontend

### Dashboard
- KPIs en tiempo real (chats en espera, activos, tiempo respuesta, CSAT)
- Gráficos de volumen de chats
- Estado de agentes

### Bandeja de Chats
- 3 paneles: cola, chat, contexto
- Filtros por estado
- Respuestas rápidas
- Indicador de escritura
- Polling cada 3 segundos

### Gestión CRUD
- **Clientes:** Crear, editar, eliminar, buscar
- **Pedidos:** Crear, editar, eliminar, filtrar por estado
- **Usuarios:** Crear, editar, desactivar, asignar roles

### Herramientas
- Base de conocimiento con búsqueda
- Respuestas rápidas por categoría
- Escalaciones con prioridades
- Métricas y calidad

## 🔄 Tiempo Real

El sistema usa **polling** cada 3 segundos para actualizar mensajes:
```javascript
setInterval(() => {
  fetch(`/api/messages.php?conversation_id=${id}&since=${lastTimestamp}`)
    .then(res => res.json())
    .then(data => updateMessages(data));
}, 3000);
```

Preparado para migrar a **Server-Sent Events (SSE)** en el futuro.

## 📝 Licencia

Proyecto desarrollado para Frávega - Sistema de Atención Digital

---

**Desarrollado con:** PHP 8+, MySQL 8+, HTML5, CSS3, JavaScript ES6+, React
