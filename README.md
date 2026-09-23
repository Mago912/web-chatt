# Nexo WebChat - Frávega
## Sistema de Atención Web/Chat

### 🏗️ Arquitectura del Proyecto

```
┌────────────────────────────────────────────────────────┐
│                    FRONTEND (HTML + CSS + JS)           │
│                                                        │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │ Widget Chat Cliente   │   │ Consola Operador     │  │
│  │ (Flotante en tienda)  │   │ (Dashboard 3 paneles)│  │
│  └───────────┬───────────┘   └──────────┬───────────┘  │
└──────────────┼──────────────────────────┼──────────────┘
               │ Fetch API / JSON         │ Fetch API / JSON
               ▼                          ▼
┌────────────────────────────────────────────────────────┐
│                     BACKEND (PHP)                       │
│                                                        │
│  • api/auth.php          (Inicio de sesión y roles)    │
│  • api/conversaciones.php(Listar, tomar, cerrar chat)  │
│  • api/mensajes.php      (Enviar y polling de mensajes)│
│  • api/pedidos.php       (Consulta de pedidos Frávega) │
│  • api/canned.php        (Respuestas rápidas)          │
│  • config/db.php         (Conexión PDO MySQL)          │
└──────────────────────────┬─────────────────────────────┘
                           │ PDO / Prepared Statements
                           ▼
┌────────────────────────────────────────────────────────┐
│                   BASE DE DATOS (MySQL)                 │
│                                                        │
│  Tablas: usuarios, clientes, pedidos, conversaciones,  │
│          mensajes, respuestas_rapidas, base_conocimiento│
└────────────────────────────────────────────────────────┘
```

### 📁 Estructura de Archivos

```
├── index.html              → Frontend principal (HTML + CSS + JS)
├── src/
│   ├── App.tsx             → Aplicación React (wrapper del frontend)
│   ├── index.css           → CSS puro (sin frameworks)
│   └── main.tsx            → Entry point de Vite
├── backend/
│   ├── config/
│   │   └── db.php          → Configuración y conexión MySQL
│   └── api/
│       ├── auth.php        → Autenticación de agentes
│       ├── conversaciones.php → CRUD de conversaciones
│       ├── mensajes.php    → Envío y polling de mensajes
│       ├── pedidos.php     → Consulta de pedidos
│       └── canned.php      → Respuestas rápidas
├── database/
│   └── schema.sql          → Esquema completo + datos semilla
└── README.md               → Este archivo
```

### 🚀 Instalación y Despliegue

#### 1. Base de Datos MySQL

```bash
# Acceder a MySQL
mysql -u root -p

# Ejecutar el script de creación
source database/schema.sql;
```

#### 2. Configurar Backend PHP

Editar `backend/config/db.php` con las credenciales de tu servidor:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'nexo_webchat_fravega');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_password');
```

#### 3. Servidor Web

Colocar la carpeta `backend/` en un servidor con PHP 7.4+ y MySQL 5.7+.

Opciones recomendadas:
- **XAMPP** (desarrollo local)
- **Apache + PHP** (producción)
- **Nginx + PHP-FPM** (producción)

#### 4. Frontend

El frontend funciona de forma standalone con datos mock. Para conectarlo al backend PHP, modificar las URLs en el JavaScript:

```javascript
// Cambiar de datos mock a API real
const API_BASE = 'http://tu-servidor/backend/api';

// Ejemplo: Obtener conversaciones
fetch(`${API_BASE}/conversaciones.php`)
  .then(res => res.json())
  .then(data => renderChats(data));
```

### 📊 Módulos del Sistema

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | KPIs en vivo, estado de agentes, actividad reciente |
| **Bandeja de Chats** | 3 paneles: cola, sala de chat, contexto 360° del cliente |
| **Base de Conocimiento** | Artículos de procedimientos y guías |
| **Respuestas Rápidas** | Plantillas con atajos para agilizar respuestas |
| **Métricas** | FCR, CSAT, TMR, AHT, NPS, SLA |
| **Calidad** | Matriz de evaluación, coaching, capacitaciones |
| **Organigrama** | Estructura del área con interacciones |
| **Escalaciones** | Casos derivados con niveles de prioridad |

### 🔌 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth.php?action=login` | Iniciar sesión |
| GET | `/api/auth.php?action=check` | Verificar sesión |
| GET | `/api/conversaciones.php` | Listar conversaciones |
| GET | `/api/conversaciones.php?id=X` | Obtener conversación con mensajes |
| POST | `/api/conversaciones.php` | Crear nueva conversación |
| PUT | `/api/conversaciones.php` | Actualizar estado |
| GET | `/api/mensajes.php?conversacion_id=X` | Obtener mensajes |
| POST | `/api/mensajes.php` | Enviar mensaje |
| GET | `/api/pedidos.php?numero=X` | Buscar pedido |
| GET | `/api/canned.php` | Obtener respuestas rápidas |

### 🗄️ Modelo de Base de Datos

```
usuarios ──────┐
               │
clientes ──────┼── conversaciones ─── mensajes
               │         │
pedidos ───────┘         │
                         │
respuestas_rapidas       │
                         │
base_conocimiento        │
                         │
escalaciones ────────────┘
```

### 🎨 Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3 (puro, sin frameworks), JavaScript Vanilla (ES6+)
- **Backend:** PHP 7.4+ con PDO
- **Base de Datos:** MySQL 5.7+ / MariaDB 10.3+
- **Comunicación:** Fetch API, JSON, Polling (3s)

### 👥 Casos de Uso Implementados

| Categoría | Motivo | Tratamiento |
|-----------|--------|-------------|
| Preventa | Consulta de stock | Verificar en sistema y guiar compra |
| Preventa | Promociones bancarias | Compartir tabla de convenios |
| Logística | Seguimiento de pedido | Consultar TMS y actualizar estado |
| Logística | Retiro en sucursal | Indicar requisitos y autorización |
| Postventa | Producto dañado | Generar ticket y solicitar evidencia |
| Postventa | Instalación pendiente | Reagendar con equipo técnico |

### 📈 KPIs Monitoreados

- **FCR** (First Contact Resolution): 78%
- **CSAT** (Customer Satisfaction): 4.7/5
- **TMR** (Tiempo Medio de Respuesta): 1m 42s
- **AHT** (Average Handle Time): 8m 32s
- **NPS** (Net Promoter Score): 72
- **SLA Compliance**: 92% primera respuesta < 2min

---

**Desarrollado para:** Atención Digital · Frávega  
**División:** Atención Web/Chat  
**Versión:** 1.0
