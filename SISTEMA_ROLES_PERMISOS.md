# 🔐 Sistema de Roles y Permisos Implementado

## 📋 Resumen

Se ha implementado un sistema completo de control de roles y permisos que restringe el acceso a diferentes funcionalidades según el rol del usuario.

---

## 👥 Roles Definidos

### 1. **Admin** (Administrador)
**Acceso total del sistema**

#### Permisos:
- ✅ **Crear** clientes, pedidos, usuarios
- ✅ **Editar** clientes, pedidos, usuarios
- ✅ **Eliminar** clientes, pedidos, usuarios, chats
- ✅ **Ver todos los chats** (incluyendo resueltos)
- ✅ **Ver métricas** completas
- ✅ **Ver equipo de trabajo** completo
- ✅ **Gestionar usuarios** (crear, editar, eliminar)
- ✅ **Resolver escalaciones**
- ✅ **Acceder a todas las vistas**

#### Vistas accesibles:
- Dashboard
- Chats
- Clientes
- Pedidos
- Equipo de Trabajo
- Escalaciones
- Base de Conocimiento
- Respuestas Rápidas
- Métricas
- Calidad

#### Credenciales de prueba:
```
DNI: 12345678
Contraseña: admin123
Código: 1234
```

---

### 2. **Supervisor** (Supervisor)
**Acceso medio - Puede ver todo pero NO puede eliminar**

#### Permisos:
- ✅ **Crear** clientes, pedidos
- ✅ **Editar** clientes, pedidos
- ❌ **NO puede eliminar** clientes, pedidos, usuarios, chats
- ✅ **Ver todos los chats** (incluyendo resueltos)
- ✅ **Ver métricas** completas
- ✅ **Ver equipo de trabajo** completo
- ❌ **NO puede gestionar usuarios** (crear, editar, eliminar)
- ✅ **Resolver escalaciones**
- ✅ **Acceder a todas las vistas**

#### Vistas accesibles:
- Dashboard
- Chats
- Clientes
- Pedidos
- Equipo de Trabajo (solo lectura)
- Escalaciones
- Base de Conocimiento
- Respuestas Rápidas
- Métricas
- Calidad

#### Credenciales de prueba:
```
DNI: 23456789
Contraseña: super123
Código: 2345
```

---

### 3. **Agente** (Agente de Atención)
**Acceso básico - Solo puede atender chats**

#### Permisos:
- ❌ **NO puede crear** clientes, pedidos, usuarios
- ❌ **NO puede editar** clientes, pedidos, usuarios
- ❌ **NO puede eliminar** clientes, pedidos, usuarios, chats
- ❌ **NO puede ver todos los chats** (solo ve chats activos/en espera)
- ❌ **NO puede ver métricas**
- ❌ **NO puede ver equipo de trabajo**
- ❌ **NO puede gestionar usuarios**
- ❌ **NO puede resolver escalaciones**
- ✅ **Puede tomar chats** en espera
- ✅ **Puede responder chats** activos
- ✅ **Puede acceder a base de conocimiento**
- ✅ **Puede acceder a respuestas rápidas**

#### Vistas accesibles:
- Dashboard (limitado)
- Chats (limitado - solo activos/en espera)
- Base de Conocimiento
- Respuestas Rápidas

#### Vistas NO accesibles:
- ❌ Clientes
- ❌ Pedidos
- ❌ Equipo de Trabajo
- ❌ Escalaciones
- ❌ Métricas
- ❌ Calidad

#### Credenciales de prueba:
```
DNI: 34567890
Contraseña: agent123
Código: 3456
```

---

### 4. **Cliente** (Cliente Final)
**Acceso mínimo - Solo puede chatear**

#### Permisos:
- ❌ **NO puede crear** nada
- ❌ **NO puede editar** nada
- ❌ **NO puede eliminar** nada
- ❌ **NO puede ver** chats de otros clientes
- ❌ **NO puede ver** métricas, equipo, escalaciones
- ✅ **Puede iniciar chats** propios
- ✅ **Puede enviar mensajes** en sus chats
- ✅ **Puede ver sus pedidos** propios
- ✅ **Puede ver información del agente** asignado

#### Vistas accesibles:
- Vista del Cliente (especial)

#### Credenciales de prueba:
```
DNI: 99999999
Contraseña: cliente123
Código: 9999
```

---

## 🎯 Implementación Técnica

### 1. Definición de Permisos

```typescript
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
  agente: {
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
  cliente: {
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
```

### 2. Funciones de Verificación

```typescript
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
```

### 3. Sidebar Condicional

```typescript
<nav className="sidebar-nav">
  {canAccessView('dashboard') && (
    <button onClick={() => setCurrentView('dashboard')}>
      <span className="nav-icon">📊</span>
      {!sidebarCollapsed && <span>Dashboard</span>}
    </button>
  )}
  {canAccessView('chat') && (
    <button onClick={() => setCurrentView('chat')}>
      <span className="nav-icon">💬</span>
      {!sidebarCollapsed && <span>Chats</span>}
    </button>
  )}
  {canAccessView('customers') && (
    <button onClick={() => setCurrentView('customers')}>
      <span className="nav-icon">👥</span>
      {!sidebarCollapsed && <span>Clientes</span>}
    </button>
  )}
  {/* ... más vistas condicionales ... */}
</nav>
```

### 4. Botones Condicionales

```typescript
{/* Botón de crear solo si tiene permiso */}
{hasPermission('canCreate') && (
  <button className="btn-primary" onClick={() => openModal('create', 'cliente')}>
    + Nuevo Cliente
  </button>
)}

{/* Botones de editar/eliminar solo si tiene permiso */}
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
```

### 5. Vista de Acceso Restringido

```typescript
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
          <h2>Acceso Restringido</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p>Tu rol actual: <strong>{currentUser?.rol}</strong></p>
          <button onClick={() => setCurrentView('dashboard')}>
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }
  // ... resto del código
};
```

---

## 🧪 Cómo Probar el Sistema de Roles

### Prueba 1: Admin (Acceso Total)

1. Iniciar sesión como admin (12345678 / admin123 / 1234)
2. **Verificar:**
   - ✅ Sidebar muestra todas las vistas
   - ✅ Puede crear, editar y eliminar clientes
   - ✅ Puede crear, editar y eliminar pedidos
   - ✅ Puede crear, editar y eliminar usuarios
   - ✅ Puede eliminar chats
   - ✅ Puede resolver escalaciones
   - ✅ Puede ver métricas completas

### Prueba 2: Supervisor (Acceso Medio)

1. Iniciar sesión como supervisor (23456789 / super123 / 2345)
2. **Verificar:**
   - ✅ Sidebar muestra todas las vistas
   - ✅ Puede crear y editar clientes
   - ❌ **NO puede eliminar clientes** (botón oculto)
   - ✅ Puede crear y editar pedidos
   - ❌ **NO puede eliminar pedidos** (botón oculto)
   - ✅ Puede ver usuarios
   - ❌ **NO puede crear/editar/eliminar usuarios** (botones ocultos)
   - ❌ **NO puede eliminar chats** (botón oculto)
   - ✅ Puede resolver escalaciones
   - ✅ Puede ver métricas completas

### Prueba 3: Agente (Acceso Básico)

1. Iniciar sesión como agente (34567890 / agent123 / 3456)
2. **Verificar:**
   - ✅ Sidebar muestra solo: Dashboard, Chats, Conocimiento, Rápidas
   - ❌ **NO puede ver** Clientes, Pedidos, Equipo de Trabajo, Escalaciones, Métricas, Calidad
   - ❌ **NO puede crear** nada
   - ❌ **NO puede editar** nada
   - ❌ **NO puede eliminar** nada
   - ✅ Puede tomar chats en espera
   - ✅ Puede responder chats activos
   - ✅ Puede resolver chats activos
   - ✅ Puede acceder a base de conocimiento
   - ✅ Puede acceder a respuestas rápidas

### Prueba 4: Acceso Restringido

1. Iniciar sesión como agente (34567890 / agent123 / 3456)
2. Intentar acceder a una vista restringida (ej: "Clientes")
3. **Verificar:**
   - ✅ Muestra mensaje "Acceso Restringido"
   - ✅ Muestra el rol actual del usuario
   - ✅ Botón "Volver al Dashboard" funcional

---

## 📊 Tabla Comparativa de Permisos

| Permiso | Admin | Supervisor | Agente | Cliente |
|---------|:-----:|:----------:|:------:|:-------:|
| **Crear Clientes** | ✅ | ✅ | ❌ | ❌ |
| **Editar Clientes** | ✅ | ✅ | ❌ | ❌ |
| **Eliminar Clientes** | ✅ | ❌ | ❌ | ❌ |
| **Crear Pedidos** | ✅ | ✅ | ❌ | ❌ |
| **Editar Pedidos** | ✅ | ✅ | ❌ | ❌ |
| **Eliminar Pedidos** | ✅ | ❌ | ❌ | ❌ |
| **Crear Usuarios** | ✅ | ❌ | ❌ | ❌ |
| **Editar Usuarios** | ✅ | ❌ | ❌ | ❌ |
| **Eliminar Usuarios** | ✅ | ❌ | ❌ | ❌ |
| **Ver Todos los Chats** | ✅ | ✅ | ❌ | ❌ |
| **Eliminar Chats** | ✅ | ❌ | ❌ | ❌ |
| **Tomar Chats** | ✅ | ✅ | ✅ | ❌ |
| **Resolver Chats** | ✅ | ✅ | ✅ | ❌ |
| **Resolver Escalaciones** | ✅ | ✅ | ❌ | ❌ |
| **Ver Métricas** | ✅ | ✅ | ❌ | ❌ |
| **Ver Calidad** | ✅ | ✅ | ❌ | ❌ |
| **Ver Equipo** | ✅ | ✅ | ❌ | ❌ |
| **Ver Conocimiento** | ✅ | ✅ | ✅ | ❌ |
| **Ver Rápidas** | ✅ | ✅ | ✅ | ❌ |

---

## 🎯 Resumen de Restricciones

### Admin
- **Sin restricciones** - Acceso total al sistema

### Supervisor
- ❌ NO puede eliminar clientes, pedidos, usuarios, chats
- ❌ NO puede gestionar usuarios (crear, editar, eliminar)
- ✅ Todo lo demás permitido

### Agente
- ❌ NO puede crear, editar, eliminar nada
- ❌ NO puede ver métricas, calidad, equipo, escalaciones
- ❌ NO puede ver todos los chats (solo activos/en espera)
- ✅ Puede tomar, responder y resolver chats
- ✅ Puede acceder a base de conocimiento y respuestas rápidas

### Cliente
- ❌ NO puede acceder a ninguna vista del sistema
- ✅ Solo puede ver su propia vista de cliente
- ✅ Puede iniciar chats y ver sus pedidos

---

## ✅ Build Exitoso

```
✓ 28 modules transformed.
dist/index.html                   3.19 kB │ gzip:  1.37 kB
dist/assets/index-ChJS1pID.css   27.86 kB │ gzip:  4.73 kB
dist/assets/index-BRdUFhmn.js   197.35 kB │ gzip: 59.32 kB
✓ built in 2.08s
```

---

## 📚 Archivos Modificados

### `src/App.tsx`
- ✅ Agregado sistema de permisos por rol
- ✅ Agregadas funciones `hasPermission` y `canAccessView`
- ✅ Modificado sidebar para mostrar solo vistas permitidas
- ✅ Modificadas vistas de Customers, Orders, Users para condicionar botones
- ✅ Modificada vista de Chats para condicionar botones de eliminar
- ✅ Modificada vista de Escalaciones para condicionar botón de resolver
- ✅ Agregada vista de "Acceso Restringido"

---

**¡Sistema de roles y permisos completamente implementado!** 🔐
