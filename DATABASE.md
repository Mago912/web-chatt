# 🗄️ Base de Datos - Nexo Web Chat

## 📋 Resumen

El proyecto utiliza **MySQL 8.0+** como sistema de gestión de base de datos. La estructura está diseñada para soportar un sistema completo de atención al cliente con chat en tiempo real.

## 📁 Archivos de Base de Datos

- **`backend/database/schema.sql`** - Estructura completa de todas las tablas
- **`backend/database/seed.sql`** - Datos de prueba para desarrollo

## 🏗️ Estructura de la Base de Datos

### Diagrama de Relaciones

```
users (1) ──────< (N) conversations (N) >────── (1) customers
   │                        │                        │
   │                        │                        │
   │                        └──────< (N) messages    └──────< (N) orders
   │
   └──────< (N) quality_reviews
   └──────< (N) escalations
```

### Tablas Principales

#### 1. **users** - Usuarios del Sistema
Almacena agentes, supervisores y administradores.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| name | VARCHAR(100) | Nombre completo |
| email | VARCHAR(150) | Email único |
| password | VARCHAR(255) | Contraseña hasheada |
| rol | ENUM | 'admin', 'supervisor', 'agent' |
| status | ENUM | 'available', 'busy', 'break', 'offline' |
| active | BOOLEAN | Usuario activo/inactivo |
| last_login | DATETIME | Último inicio de sesión |

#### 2. **customers** - Clientes
Información de los clientes de Frávega.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| name | VARCHAR(150) | Nombre completo |
| dni | VARCHAR(20) | DNI único |
| email | VARCHAR(150) | Email |
| phone | VARCHAR(30) | Teléfono |

#### 3. **orders** - Pedidos
Registro de pedidos de los clientes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| order_number | VARCHAR(30) | Número de pedido único |
| customer_id | INT (FK) | Referencia a customers |
| product | VARCHAR(255) | Descripción del producto |
| amount | DECIMAL(10,2) | Monto del pedido |
| payment_method | VARCHAR(50) | Método de pago |
| delivery_method | VARCHAR(50) | Método de entrega |
| estimated_delivery | DATE | Fecha estimada de entrega |
| status | ENUM | 'preparing', 'shipping', 'delivered', 'delayed', 'cancelled' |

#### 4. **conversations** - Conversaciones de Chat
Almacena todas las conversaciones entre clientes y agentes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| customer_id | INT (FK) | Cliente que inicia el chat |
| agent_id | INT (FK) | Agente asignado (puede ser NULL) |
| order_id | INT (FK) | Pedido relacionado (opcional) |
| subject | VARCHAR(255) | Asunto de la conversación |
| reason | VARCHAR(255) | Motivo del contacto |
| status | ENUM | 'waiting', 'active', 'on_hold', 'closed' |
| priority | ENUM | 'low', 'medium', 'high', 'critical' |
| csat_score | TINYINT | Puntuación CSAT (1-5) |
| started_at | DATETIME | Inicio de la conversación |
| closed_at | DATETIME | Cierre de la conversación |

#### 5. **messages** - Mensajes
Todos los mensajes de las conversaciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| conversation_id | INT (FK) | Conversación a la que pertenece |
| sender_type | ENUM | 'customer', 'agent', 'system', 'bot' |
| sender_id | INT | ID del usuario (si es agent) |
| message | TEXT | Contenido del mensaje |
| created_at | DATETIME | Fecha y hora del mensaje |
| read_at | DATETIME | Fecha y hora de lectura |

#### 6. **quick_replies** - Respuestas Rápidas
Plantillas de respuestas predefinidas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| title | VARCHAR(100) | Título de la respuesta |
| shortcut | VARCHAR(30) | Atajo (ej: /saludo) |
| content | TEXT | Contenido de la respuesta |
| category | VARCHAR(50) | Categoría |
| active | BOOLEAN | Si está activa |

#### 7. **knowledge_base** - Base de Conocimiento
Artículos de ayuda y procedimientos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| title | VARCHAR(200) | Título del artículo |
| content | TEXT | Contenido completo |
| category | VARCHAR(50) | Categoría |
| keywords | VARCHAR(500) | Palabras clave para búsqueda |
| active | BOOLEAN | Si está activo |

#### 8. **escalations** - Escalaciones
Casos escalados a supervisores o especialistas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| conversation_id | INT (FK) | Conversación relacionada |
| created_by | INT (FK) | Usuario que creó la escalación |
| assigned_to | INT (FK) | Usuario asignado |
| reason | TEXT | Razón de la escalación |
| notes | TEXT | Notas adicionales |
| priority | ENUM | 'low', 'medium', 'high', 'critical' |
| status | ENUM | 'pending', 'in_progress', 'resolved', 'cancelled' |
| resolved_at | DATETIME | Fecha de resolución |

#### 9. **quality_reviews** - Evaluaciones de Calidad
Revisiones de calidad de conversaciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| conversation_id | INT (FK) | Conversación evaluada |
| reviewer_id | INT (FK) | Usuario que evaluó |
| score | TINYINT | Puntuación (1-10) |
| comments | TEXT | Comentarios de la evaluación |

## 🔗 Relaciones entre Tablas

### Relaciones Principales

1. **customers → orders** (1:N)
   - Un cliente puede tener múltiples pedidos
   - `ON DELETE CASCADE`: Si se elimina un cliente, se eliminan sus pedidos

2. **customers → conversations** (1:N)
   - Un cliente puede tener múltiples conversaciones
   - `ON DELETE CASCADE`: Si se elimina un cliente, se eliminan sus conversaciones

3. **users → conversations** (1:N)
   - Un agente puede atender múltiples conversaciones
   - `ON DELETE SET NULL`: Si se elimina un agente, las conversaciones quedan sin agente

4. **orders → conversations** (1:N)
   - Un pedido puede estar relacionado con múltiples conversaciones
   - `ON DELETE SET NULL`: Si se elimina un pedido, las conversaciones quedan sin pedido

5. **conversations → messages** (1:N)
   - Una conversación tiene múltiples mensajes
   - `ON DELETE CASCADE`: Si se elimina una conversación, se eliminan sus mensajes

6. **conversations → escalations** (1:N)
   - Una conversación puede tener múltiples escalaciones
   - `ON DELETE SET NULL`: Si se elimina una conversación, las escalaciones quedan sin conversación

## 📊 Índices

Los índices mejoran el rendimiento de las consultas:

- **users**: idx_rol, idx_status, idx_active
- **customers**: idx_dni, idx_name
- **orders**: idx_order_number, idx_customer, idx_status
- **conversations**: idx_status, idx_agent, idx_customer, idx_created
- **messages**: idx_conversation, idx_created

## 🔐 Seguridad

### Contraseñas
- Las contraseñas se almacenan usando `password_hash()` de PHP
- Nunca se guardan en texto plano
- Se verifican con `password_verify()`

### Tokens CSRF
- Todas las operaciones POST/PUT/DELETE requieren token CSRF
- Los tokens se generan con `bin2hex(random_bytes(32))`
- Se validan con `hash_equals()`

### SQL Injection
- Todas las consultas usan **PDO con prepared statements**
- Nunca se concatenan variables directamente en SQL
- Ejemplo seguro:
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
```

## 🚀 Cómo Instalar la Base de Datos

### Paso 1: Crear la Base de Datos
```bash
mysql -u root -p
```

```sql
CREATE DATABASE nexo_webchat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Paso 2: Importar el Schema
```bash
mysql -u root -p nexo_webchat < backend/database/schema.sql
```

### Paso 3: Importar Datos de Prueba
```bash
mysql -u root -p nexo_webchat < backend/database/seed.sql
```

### Paso 4: Configurar Credenciales
Editar `backend/config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'nexo_webchat');
define('DB_USER', 'root');
define('DB_PASS', 'tu_contraseña');
```

## 📝 Consultas Ejemplo

### Obtener conversaciones activas con datos del cliente
```sql
SELECT c.*, cu.name as customer_name, cu.email, u.name as agent_name
FROM conversations c
LEFT JOIN customers cu ON c.customer_id = cu.id
LEFT JOIN users u ON c.agent_id = u.id
WHERE c.status = 'active'
ORDER BY c.created_at DESC;
```

### Obtener mensajes de una conversación
```sql
SELECT m.*, u.name as sender_name
FROM messages m
LEFT JOIN users u ON m.sender_id = u.id
WHERE m.conversation_id = ?
ORDER BY m.created_at ASC;
```

### Contar conversaciones por estado
```sql
SELECT status, COUNT(*) as total
FROM conversations
GROUP BY status;
```

### Calcular métricas CSAT
```sql
SELECT 
    AVG(csat_score) as promedio_csat,
    COUNT(*) as total_conversaciones
FROM conversations
WHERE csat_score IS NOT NULL
AND DATE(created_at) = CURDATE();
```

## 🔄 Actualización Automática (Polling)

El frontend implementa polling cada 3 segundos para actualizar:
- Nuevos mensajes en conversaciones activas
- Cambios de estado en pedidos
- Estado de agentes

```javascript
setInterval(() => {
    fetch('/api/messages.php?conversation_id=' + id + '&since=' + lastTimestamp)
        .then(res => res.json())
        .then(data => updateMessages(data));
}, 3000);
```

## 📈 Próximas Mejoras

1. **Migrar a Server-Sent Events (SSE)** para actualizaciones en tiempo real
2. **Implementar caché** con Redis para consultas frecuentes
3. **Agregar particionado** de tablas para mejor rendimiento
4. **Implementar backup automático** diario
5. **Agregar auditoría** de cambios en tablas críticas

## 📞 Soporte

Para más información sobre la base de datos:
- Documentación MySQL: https://dev.mysql.com/doc/
- PDO PHP: https://www.php.net/manual/es/book.pdo.php
- Issues del proyecto: https://github.com/TU_USUARIO/nexo-web-chat/issues
