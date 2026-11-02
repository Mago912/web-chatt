# 🚀 Guía Rápida: Probar el Sistema Completo

## ✅ Problema Corregido

**Problema:** El cliente "Juan Pérez" no tenía pedidos asignados  
**Solución:** Agregados 3 pedidos para el cliente Juan Pérez (ID: 7)

### Pedidos del Cliente Juan Pérez:
```
1. #10789 - Smart TV LG 55" OLED - $1,299,999 - En envío
2. #10823 - Notebook HP Pavilion 15" - $849,999 - Preparando
3. #10856 - Auriculares Sony WH-1000XM5 - $299,999 - Entregado
```

---

## 🧪 Cómo Probar el Sistema Completo

### Paso 1: Descargar el workspace actualizado

1. Buscar el botón **"Download"** o **"Export"** en la plataforma
2. Descargar el archivo `workspace.tar`
3. Extraer en tu PC:
   ```powershell
   tar -xf workspace.tar
   mv workspace nexo-web-chat
   ```

### Paso 2: Ejecutar el proyecto

```powershell
cd nexo-web-chat
npm install
npm run dev
```

### Paso 3: Abrir DOS pestañas del navegador

**Pestaña 1: Cliente**
- URL: http://localhost:5173

**Pestaña 2: Agente**
- URL: http://localhost:5173 (en OTRA pestaña)

---

## 👤 Iniciar Sesión como Cliente

**Pestaña 1:**
```
DNI: 99999999
Contraseña: cliente123
Código: 9999
```

**Verás:**
- ✅ Lista de 3 pedidos (Smart TV, Notebook, Auriculares)
- ✅ Estado de cada pedido con barra de progreso
- ✅ Formulario para iniciar chat
- ✅ Selector de pedido y motivo

**Pasos:**
1. Seleccionar un pedido (ej: #10789 - Smart TV LG)
2. Seleccionar motivo (ej: "Estado del pedido")
3. Click en "💬 Iniciar Chat"
4. Verás el chat iniciado con mensaje del bot

---

## 👨‍💼 Iniciar Sesión como Agente

**Pestaña 2:**
```
DNI: 34567890
Contraseña: agent123
Código: 3456
```

**Verás:**
- ✅ Cola de conversaciones
- ✅ Nuevo chat de Juan Pérez en la cola
- ✅ Estado: "Esperando"
- ✅ Botón "✋ Tomar" visible

**Pasos:**
1. Ver el nuevo chat de Juan Pérez en la cola
2. Click en "✋ Tomar" para tomar el chat
3. Verás el chat completo con:
   - Información del cliente
   - Información del pedido
   - Historial de mensajes
   - Panel de respuestas rápidas

---

## 💬 Probar Chat en Tiempo Real

### Desde el Cliente (Pestaña 1):
1. Escribir un mensaje: "Hola, necesito información sobre mi TV"
2. Presionar Enter o click en ➤
3. Ver que el mensaje aparece
4. Esperar respuesta del agente

### Desde el Agente (Pestaña 2):
1. Ver el mensaje del cliente aparecer (sincronización cada 1s)
2. Escribir respuesta: "¡Hola Juan! Soy Sofía. Tu TV está en distribución"
3. Presionar Enter o click en ➤
4. Ver que el cliente recibe el mensaje

### Resultado:
- ✅ Mensajes aparecen en ambas pestañas en tiempo real
- ✅ Sincronización automática cada 1 segundo
- ✅ Chat bidireccional funcional

---

## 📦 Probar Sincronización de Pedidos

### Desde el Agente (Pestaña 2):
1. Ir a "Pedidos" en el menú lateral
2. Ver lista de pedidos
3. Esperar 2 segundos
4. Ver cambios de estado automáticos:
   - "Preparando" → "En envío"
   - "En envío" → "Entregado"
5. Ver notificaciones de cambios

### Desde el Cliente (Pestaña 1):
1. Ver sidebar del chat
2. Ver información del pedido seleccionado
3. Ver que el estado se actualiza en tiempo real
4. Ver barra de progreso actualizada

---

## 🎯 Probar Resolución de Chat

### Desde el Agente (Pestaña 2):
1. Click en "✓ Resolver"
2. Ver mensaje del sistema: "✅ Conversación resuelta · CSAT: 5/5 ⭐"
3. Ver cambio de estado a "Resuelto"

### Desde el Cliente (Pestaña 1):
1. Ver indicador "✅ Resuelto"
2. Ver que el input se deshabilita
3. Ver mensaje de cierre

---

## 📊 Flujo Completo del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO COMPLETO                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CLIENTE inicia sesión                                    │
│     └─> Ve sus 3 pedidos                                     │
│                                                              │
│  2. CLIENTE inicia chat                                      │
│     ├─> Selecciona pedido #10789                             │
│     ├─> Selecciona motivo "Estado del pedido"                │
│     └─> Click "Iniciar Chat"                                 │
│                                                              │
│  3. AGENTE ve nuevo chat en cola                             │
│     ├─> Estado: "Esperando"                                  │
│     └─> Click "✋ Tomar"                                     │
│                                                              │
│  4. CLIENTE ve agente asignado                               │
│     ├─> Nombre: Sofía Ríos                                   │
│     ├─> Estado: 🟢 Disponible                                │
│     └─> Turno: 14:00 - 22:00                                 │
│                                                              │
│  5. CHAT en tiempo real                                      │
│     ├─> Cliente escribe mensaje                              │
│     ├─> localStorage actualizado                             │
│     ├─> Agente ve mensaje (1s)                               │
│     ├─> Agente responde                                      │
│     ├─> localStorage actualizado                             │
│     └─> Cliente ve respuesta (1s)                            │
│                                                              │
│  6. PEDIDOS se actualizan                                    │
│     ├─> Cada 2 segundos                                      │
│     ├─> Agente ve cambios en vista "Pedidos"                 │
│     └─> Cliente ve cambios en sidebar del chat               │
│                                                              │
│  7. AGENTE resuelve chat                                     │
│     ├─> Click "✓ Resolver"                                   │
│     ├─> Estado: "Resuelto"                                   │
│     └─> Cliente ve indicador "✅ Resuelto"                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Credenciales de Prueba

### Cliente
```
DNI: 99999999
Contraseña: cliente123
Código: 9999
Nombre: Juan Pérez
Pedidos: 3 (#10789, #10823, #10856)
```

### Agente
```
DNI: 34567890
Contraseña: agent123
Código: 3456
Nombre: Sofía Ríos
Rol: agent
```

### Supervisor
```
DNI: 23456789
Contraseña: super123
Código: 2345
Nombre: Nicolás Romero
Rol: supervisor
```

### Admin
```
DNI: 12345678
Contraseña: admin123
Código: 1234
Nombre: Admin Sistema
Rol: admin
```

---

## ✅ Checklist de Pruebas

### Cliente
- [ ] Iniciar sesión como cliente
- [ ] Ver 3 pedidos en la lista
- [ ] Ver estado de cada pedido con barra de progreso
- [ ] Seleccionar pedido y motivo
- [ ] Iniciar chat
- [ ] Ver mensaje del bot
- [ ] Escribir mensaje
- [ ] Ver respuesta del agente
- [ ] Ver información del agente en sidebar
- [ ] Ver estado del pedido actualizado
- [ ] Ver indicador "Resuelto" cuando el agente resuelve

### Agente
- [ ] Iniciar sesión como agente
- [ ] Ver nuevo chat en la cola
- [ ] Ver estado "Esperando"
- [ ] Click "✋ Tomar"
- [ ] Ver información del cliente
- [ ] Ver información del pedido
- [ ] Ver mensajes del cliente en tiempo real
- [ ] Responder al cliente
- [ ] Usar respuestas rápidas
- [ ] Ver cambios de estado de pedidos
- [ ] Click "✓ Resolver"
- [ ] Ver mensaje del sistema

### Sincronización
- [ ] Mensajes aparecen en ambas pestañas
- [ ] Sincronización cada 1 segundo
- [ ] Pedidos se actualizan cada 2 segundos
- [ ] Estado del chat se sincroniza
- [ ] Información del agente visible para el cliente

---

## 🐛 Solución de Problemas

### Problema: "No veo pedidos como cliente"
**Solución:**
1. Verificar que iniciaste sesión como cliente (DNI: 99999999)
2. Verificar que el workspace esté actualizado
3. Limpiar localStorage:
   ```javascript
   localStorage.clear()
   ```
4. Recargar la página

### Problema: "Los mensajes no aparecen en la otra pestaña"
**Solución:**
1. Verificar que ambas pestañas estén abiertas
2. Verificar que ambas estén en http://localhost:5173
3. Esperar 1-2 segundos (polling)
4. Recargar ambas pestañas

### Problema: "El agente no ve el chat del cliente"
**Solución:**
1. Verificar que el cliente inició el chat
2. Verificar que el agente está en la vista "Chats"
3. Verificar que el chat aparece en la cola
4. Recargar la pestaña del agente

---

## 🎉 Resumen

**¡Sistema completo funcionando!**

### Características:
- ✅ Cliente con 3 pedidos visibles
- ✅ Chat bidireccional en tiempo real
- ✅ Sincronización automática (1s)
- ✅ Información del agente visible
- ✅ Estado de pedidos en tiempo real
- ✅ Resolución de chats
- ✅ Responsive design
- ✅ Modo oscuro

### Para probar:
1. Descargar workspace actualizado
2. Ejecutar `npm install` y `npm run dev`
3. Abrir DOS pestañas
4. Iniciar sesión como cliente en una
5. Iniciar sesión como agente en otra
6. ¡Probar el chat en tiempo real!

---

**¡Todo listo para probar!** 🚀
