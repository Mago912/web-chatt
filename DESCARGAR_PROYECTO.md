# 📦 Guía Completa: Descargar Proyecto Nexo Web Chat

## 🎯 Opciones para Descargar el Proyecto

Tienes **3 opciones** para obtener todos los archivos del proyecto:

---

## ✅ OPCIÓN 1: Descargar desde esta plataforma (Recomendado)

### Paso 1: Buscar botón de descarga
En esta plataforma, busca uno de estos botones:
- **"Download"** o **"Descargar"**
- **"Export"** o **"Exportar"**
- Ícono de descarga **⬇️**
- Menú de tres puntos **⋮** → "Download project"

### Paso 2: Descargar archivo
- Se descargará un archivo `.tar` o `.zip`
- El nombre será algo como: `workspace.tar` o `nexo-web-chat.tar`

### Paso 3: Extraer el archivo

**En Windows:**
```powershell
# Opción 1: Con PowerShell (Windows 10/11)
tar -xf workspace.tar

# Opción 2: Con 7-Zip (recomendado)
# 1. Instala 7-Zip desde: https://www.7-zip.org/
# 2. Click derecho en workspace.tar
# 3. Selecciona: 7-Zip → Extraer aquí
```

**En Mac:**
```bash
# Simplemente haz doble clic en el archivo
# O usa terminal:
tar -xf workspace.tar
```

**En Linux:**
```bash
tar -xf workspace.tar
```

### Paso 4: Renombrar carpeta (opcional)
```bash
# Cambiar nombre de "workspace" a "nexo-web-chat"
mv workspace nexo-web-chat
```

---

## ✅ OPCIÓN 2: Copiar archivos manualmente

Si no hay opción de descarga, puedes copiar cada archivo:

### Paso 1: Crear estructura de carpetas
```bash
# Crear carpeta principal
mkdir nexo-web-chat
cd nexo-web-chat

# Crear subcarpetas
mkdir src
mkdir -p backend/api
mkdir -p backend/config
mkdir -p backend/database
mkdir -p backend/includes
```

### Paso 2: Copiar archivos esenciales

**Archivos de configuración (raíz):**
1. `package.json`
2. `vite.config.js`
3. `tsconfig.json`
4. `index.html`
5. `vercel.json`

**Archivos de frontend (src/):**
1. `src/App.tsx`
2. `src/index.css`
3. `src/main.tsx`

**Archivos de backend (backend/):**
1. `backend/config/config.php`
2. `backend/config/database.php`
3. `backend/includes/auth.php`
4. `backend/includes/permissions.php`
5. `backend/includes/csrf.php`
6. `backend/api/auth.php`
7. `backend/api/conversations.php`
8. `backend/api/messages.php`
9. `backend/api/customers.php`
10. `backend/api/orders.php`
11. `backend/api/quick_replies.php`
12. `backend/api/knowledge_base.php`
13. `backend/api/escalations.php`
14. `backend/api/metrics.php`
15. `backend/api/users.php`
16. `backend/api/quality.php`
17. `backend/database/schema.sql`
18. `backend/database/seed.sql`

**Documentación:**
1. `README.md`
2. `DATABASE.md`
3. `DEPLOYMENT.md`
4. `VERSION_2.2.md`

### Paso 3: Para cada archivo
1. Haz clic en el archivo en esta plataforma
2. Copia todo el contenido (Ctrl+A, Ctrl+C)
3. Crea el archivo en tu PC con el mismo nombre
4. Pega el contenido (Ctrl+V)
5. Guarda el archivo

---

## ✅ OPCIÓN 3: Clonar desde GitHub (si ya está subido)

Si ya subiste el proyecto a GitHub:

```bash
git clone https://github.com/TU_USUARIO/nexo-web-chat.git
cd nexo-web-chat
```

---

## 🚀 Ejecutar el Proyecto

Una vez que tengas todos los archivos:

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Ejecutar en modo desarrollo
```bash
npm run dev
```

### Paso 3: Abrir en el navegador
Ve a: **http://localhost:5173**

---

## 📤 Subir a GitHub

### Paso 1: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre: `nexo-web-chat`
3. Descripción: `Sistema de atención al cliente mediante chat web - Frávega`
4. Visibilidad: **Público**
5. **NO** inicializar con README
6. Click en **"Create repository"**

### Paso 2: Subir código
```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "feat: Nexo Web Chat v2.2 - Sistema completo de atención al cliente"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/nexo-web-chat.git
git push -u origin main
```

---

## 📋 Lista Completa de Archivos del Proyecto

### Archivos Esenciales (Frontend)
```
nexo-web-chat/
├── index.html              ✅ HTML principal
├── package.json            ✅ Dependencias
├── vite.config.js          ✅ Configuración Vite
├── tsconfig.json           ✅ Configuración TypeScript
├── vercel.json             ✅ Configuración Vercel
├── src/
│   ├── main.tsx            ✅ Punto de entrada React
│   ├── App.tsx             ✅ Componente principal (1165 líneas)
│   └── index.css           ✅ Estilos completos (1700+ líneas)
```

### Archivos de Backend (PHP)
```
backend/
├── config/
│   ├── config.php          ✅ Configuración general
│   └── database.php        ✅ Conexión PDO
├── includes/
│   ├── auth.php            ✅ Autenticación
│   ├── permissions.php     ✅ Control de roles
│   └── csrf.php            ✅ Protección CSRF
├── api/
│   ├── auth.php            ✅ API autenticación
│   ├── conversations.php   ✅ API conversaciones
│   ├── messages.php        ✅ API mensajes
│   ├── customers.php       ✅ API clientes
│   ├── orders.php          ✅ API pedidos
│   ├── quick_replies.php   ✅ API respuestas rápidas
│   ├── knowledge_base.php  ✅ API base de conocimiento
│   ├── escalations.php     ✅ API escalaciones
│   ├── metrics.php         ✅ API métricas
│   ├── users.php           ✅ API usuarios
│   └── quality.php         ✅ API calidad
└── database/
    ├── schema.sql          ✅ Estructura de BD
    └── seed.sql            ✅ Datos de prueba
```

### Documentación
```
├── README.md               ✅ Documentación principal
├── DATABASE.md             ✅ Documentación de BD
├── DEPLOYMENT.md           ✅ Guía de deployment
├── VERSION_2.2.md          ✅ Cambios de esta versión
├── VERSION_2.1.md          ✅ Cambios versión anterior
├── PROMPT_MAESTRO.md       ✅ Prompt para IAs
├── GITHUB_SETUP.md         ✅ Configuración GitHub
└── ... (otros documentos)
```

---

## 🎯 Archivos Más Importantes

Si solo puedes copiar algunos archivos, prioriza estos:

### CRÍTICOS (Imprescindibles)
1. ✅ `package.json`
2. ✅ `src/App.tsx`
3. ✅ `src/index.css`
4. ✅ `src/main.tsx`
5. ✅ `index.html`
6. ✅ `vite.config.js`
7. ✅ `tsconfig.json`

### RECOMENDADOS
8. ✅ `vercel.json`
9. ✅ `README.md`
10. ✅ `DATABASE.md`

### OPCIONALES (Backend)
11-28. Todos los archivos de `backend/`

---

## 🐛 Solución de Problemas

### Error: "No puedo encontrar el botón de descarga"
**Solución:** Busca en la parte superior de la página o en el menú de tres puntos (⋮)

### Error: "El archivo .tar no se extrae"
**Solución:** 
- Windows: Usa 7-Zip (https://www.7-zip.org/)
- Mac: Haz doble clic en el archivo
- Linux: `tar -xf archivo.tar`

### Error: "Faltan archivos después de extraer"
**Solución:** Verifica que la extracción se completó correctamente. Si faltan archivos, usa la OPCIÓN 2 (copiar manualmente)

### Error: "npm install falla"
**Solución:**
```bash
# Limpiar cache
npm cache clean --force

# Eliminar node_modules y package-lock.json
rm -rf node_modules package-lock.json  # Linux/Mac
# o en Windows: rmdir /s /q node_modules && del package-lock.json

# Reinstalar
npm install
```

---

## 📊 Estadísticas del Proyecto

### Código
- **Frontend**: ~2,900 líneas (React + CSS)
- **Backend**: ~2,500 líneas (PHP)
- **Base de datos**: ~500 líneas (SQL)
- **Documentación**: ~3,000 líneas (Markdown)
- **Total**: ~8,900 líneas de código

### Archivos
- **Frontend**: 7 archivos
- **Backend**: 18 archivos
- **Documentación**: 14 archivos
- **Total**: 39 archivos

### Funcionalidades
- ✅ CRUD completo (Clientes, Pedidos, Usuarios)
- ✅ Chat en tiempo real con auto-respuestas
- ✅ 6 conversaciones de ejemplo
- ✅ 6 respuestas rápidas
- ✅ 5 artículos de base de conocimiento
- ✅ 3 escalaciones
- ✅ Modo oscuro/claro
- ✅ Búsqueda global
- ✅ Estadísticas en tiempo real
- ✅ Exportar conversaciones
- ✅ Actualización automática de pedidos
- ✅ Sidebar colapsable

---

## 🎉 Resumen

### Para descargar el proyecto:
1. **Opción 1**: Busca botón "Download" en esta plataforma
2. **Opción 2**: Copia manualmente los 7 archivos críticos
3. **Opción 3**: Clona desde GitHub (si ya está subido)

### Para ejecutar:
```bash
npm install
npm run dev
# Abrir http://localhost:5173
```

### Para subir a GitHub:
```bash
git init
git add .
git commit -m "feat: Nexo Web Chat v2.2"
git remote add origin TU_URL
git push -u origin main
```

---

**¡Listo para descargar y usar!** 🚀

Si tienes problemas con la descarga, avísame y te ayudo con la opción que mejor se adapte a tu situación.
