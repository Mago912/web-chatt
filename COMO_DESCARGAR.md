# 📥 Cómo Descargar y Ejecutar el Proyecto en tu PC

## 🤔 ¿Qué es este proyecto?

Este es un proyecto de **Nexo Web Chat** que hemos desarrollado juntos en esta plataforma. Los archivos existen aquí, pero necesitas descargarlos a tu computadora para:
- Ejecutarlo localmente
- Subirlo a GitHub
- Deployarlo a Vercel
- Modificarlo y mejorarlo

---

## 📦 OPCIÓN 1: Descargar como ZIP (Más Fácil)

### Paso 1: Descargar el proyecto
En esta plataforma, busca el botón **"Download"** o **"Descargar"** (generalmente en la parte superior o en el menú).

Esto descargará un archivo `.zip` con toda la estructura del proyecto.

### Paso 2: Extraer el ZIP
1. Ubica el archivo descargado (ej: `nexo-web-chat.zip`)
2. Haz doble clic o clic derecho → "Extraer aquí"
3. Extrae el contenido en una carpeta de tu elección, por ejemplo:
   - **Windows:** `C:\Users\TuUsuario\Documents\nexo-web-chat\`
   - **Mac:** `/Users/TuUsuario/Documents/nexo-web-chat/`
   - **Linux:** `/home/TuUsuario/Documents/nexo-web-chat/`

### Paso 3: Verificar la estructura
Abre la carpeta extraída y deberías ver:
```
nexo-web-chat/
├── backend/
├── src/
├── index.html
├── package.json
├── README.md
└── ... (otros archivos)
```

---

## 📦 OPCIÓN 2: Copiar Archivos Manualmente

Si no hay opción de descarga ZIP, puedes copiar los archivos uno por uno:

### Paso 1: Crear la carpeta del proyecto
```bash
# En tu terminal o explorador de archivos
mkdir nexo-web-chat
cd nexo-web-chat
```

### Paso 2: Crear la estructura de carpetas
```bash
# Crear carpetas principales
mkdir backend
mkdir src
mkdir -p backend/api
mkdir -p backend/config
mkdir -p backend/database
mkdir -p backend/includes
```

### Paso 3: Copiar cada archivo
Para cada archivo que ves en esta plataforma:
1. Abre el archivo aquí
2. Copia todo el contenido
3. Crea el archivo en tu PC con el mismo nombre y ruta
4. Pega el contenido

**Archivos principales a crear:**

#### Frontend (React + Vite)
```
📁 src/
  📄 App.tsx
  📄 index.css
  📄 main.tsx

📄 index.html
📄 package.json
📄 tsconfig.json
📄 vite.config.js
📄 vercel.json
```

#### Backend (PHP)
```
📁 backend/
  📁 api/
    📄 auth.php
    📄 conversations.php
    📄 customers.php
    📄 escalations.php
    📄 knowledge_base.php
    📄 messages.php
    📄 metrics.php
    📄 orders.php
    📄 quality.php
    📄 quick_replies.php
    📄 users.php
  
  📁 config/
    📄 config.php
    📄 database.php
  
  📁 database/
    📄 schema.sql
    📄 seed.sql
  
  📁 includes/
    📄 auth.php
    📄 csrf.php
    📄 permissions.php
```

#### Documentación
```
📄 README.md
📄 DEPLOYMENT.md
📄 GUIA_RAPIDA.md
📄 PROMPT_MAESTRO.md
📄 CORRECCIONES.md
📄 GITHUB_SETUP.md
📄 RESUMEN_MEJORAS.md
📄 .gitignore
```

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

### Requisitos Previos

1. **Node.js 18+** → [Descargar aquí](https://nodejs.org/)
   ```bash
   # Verificar instalación
   node --version   # Debe mostrar v18.x.x o superior
   npm --version    # Debe mostrar 9.x.x o superior
   ```

2. **Git** (opcional pero recomendado) → [Descargar aquí](https://git-scm.com/)
   ```bash
   git --version
   ```

3. **XAMPP** (solo si quieres el backend PHP) → [Descargar aquí](https://www.apachefriends.org/)

### Paso 1: Instalar dependencias

Abre una terminal en la carpeta del proyecto:

```bash
# Navegar a la carpeta del proyecto
cd ruta/a/tu/nexo-web-chat

# Instalar dependencias de Node.js
npm install
```

Esto descargará todas las librerías necesarias (React, Vite, etc.)

### Paso 2: Ejecutar en modo desarrollo

```bash
npm run dev
```

Verás algo como:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Paso 3: Abrir en el navegador

Abre tu navegador y ve a: **http://localhost:5173**

¡Deberías ver la aplicación Nexo Web Chat funcionando! 🎉

---

## 🏗️ Compilar para Producción

Cuando quieras generar la versión final para deployar:

```bash
npm run build
```

Esto creará una carpeta `dist/` con los archivos optimizados:
```
dist/
├── index.html
└── assets/
    ├── index-xxxxx.js
    └── index-xxxxx.css
```

Para ver cómo se ve en producción:
```bash
npm run preview
```

---

## 🌐 Configurar Backend PHP (Opcional)

Si quieres usar el backend completo con base de datos:

### Paso 1: Instalar XAMPP
1. Descarga e instala XAMPP desde [apachefriends.org](https://www.apachefriends.org/)
2. Inicia Apache y MySQL desde el panel de control

### Paso 2: Copiar backend a XAMPP
```bash
# Copiar carpeta backend/ a htdocs
# Windows: C:\xampp\htdocs\nexo-web-chat\backend\
# Mac: /Applications/XAMPP/htdocs/nexo-web-chat/backend/
# Linux: /opt/lampp/htdocs/nexo-web-chat/backend/
```

### Paso 3: Crear base de datos
1. Abre phpMyAdmin: http://localhost/phpmyadmin
2. Crea nueva base de datos: `nexo_webchat`
3. Importa los archivos SQL:
   - `backend/database/schema.sql`
   - `backend/database/seed.sql`

### Paso 4: Configurar credenciales
Edita `backend/config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'nexo_webchat');
define('DB_USER', 'root');
define('DB_PASS', ''); // Vacío por defecto en XAMPP
```

### Paso 5: Probar API
Abre en el navegador:
```
http://localhost/nexo-web-chat/backend/api/auth.php?action=check
```

Deberías ver:
```json
{"success":true,"authenticated":false}
```

---

## 📤 Subir a GitHub

### Paso 1: Crear cuenta en GitHub
Si no tienes cuenta, regístrate en [github.com](https://github.com/signup)

### Paso 2: Crear repositorio
1. Ve a https://github.com/new
2. Nombre: `nexo-web-chat`
3. Descripción: `Sistema de atención al cliente mediante chat web`
4. Visibilidad: **Público**
5. **NO** marques "Add a README file"
6. Click en **"Create repository"**

### Paso 3: Subir código desde tu PC

Abre terminal en la carpeta del proyecto:

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Nexo Web Chat v1.1"

# Cambiar a rama main
git branch -M main

# Agregar repositorio remoto (REEMPLAZA TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/nexo-web-chat.git

# Subir a GitHub
git push -u origin main
```

GitHub te pedirá tus credenciales la primera vez.

---

## 🚀 Deployar a Vercel

### Opción A: Desde GitHub (Automático - Recomendado)

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (puedes usar tu cuenta de GitHub)

2. Click en **"Add New..."** → **"Project"**

3. Busca tu repositorio `nexo-web-chat` y click en **"Import"**

4. Vercel detectará automáticamente que es un proyecto Vite:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Click en **"Deploy"**

6. Espera 30 segundos... ¡Listo! 🎉

Tu aplicación estará en: `https://nexo-web-chat-tu-usuario.vercel.app`

### Opción B: Con Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deployar
vercel --prod
```

---

## 🐛 Solución de Problemas Comunes

### Error: "npm: command not found"
**Solución:** Instala Node.js desde [nodejs.org](https://nodejs.org/)

### Error: "Cannot find module"
**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5173 is already in use"
**Solución:**
```bash
# Usar otro puerto
npm run dev -- --port 3000
```

### Error: "git: command not found"
**Solución:** Instala Git desde [git-scm.com](https://git-scm.com/)

### Error: "Permission denied" (Mac/Linux)
**Solución:**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📋 Checklist Final

### Antes de ejecutar
- [ ] Node.js 18+ instalado
- [ ] Carpeta del proyecto creada
- [ ] Archivos copiados/descargados
- [ ] `npm install` ejecutado sin errores

### Para ejecutar localmente
- [ ] `npm run dev` funciona
- [ ] http://localhost:5173 abre correctamente
- [ ] Puedo navegar por todas las secciones
- [ ] Modo oscuro/claro funciona
- [ ] Búsqueda funciona

### Para subir a GitHub
- [ ] Cuenta de GitHub creada
- [ ] Repositorio creado en GitHub
- [ ] `git push` ejecutado sin errores
- [ ] Puedo ver los archivos en GitHub

### Para deployar a Vercel
- [ ] Cuenta de Vercel creada
- [ ] Repositorio importado
- [ ] Deploy completado
- [ ] URL funciona correctamente

---

## 📞 Necesitas Ayuda?

### Documentación
- `README.md` - Información general
- `DEPLOYMENT.md` - Guía detallada de deployment
- `GUIA_RAPIDA.md` - Instrucciones rápidas

### Recursos Externos
- [Node.js Docs](https://nodejs.org/en/docs)
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [GitHub Docs](https://docs.github.com/)
- [Vercel Docs](https://vercel.com/docs)

---

## 🎯 Resumen Rápido

```bash
# 1. Descargar/Crear proyecto
# 2. Instalar dependencias
npm install

# 3. Ejecutar localmente
npm run dev

# 4. Subir a GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/nexo-web-chat.git
git push -u origin main

# 5. Deployar a Vercel
# (Desde vercel.com importando el repositorio)
```

---

**¡Listo! Ahora tienes el proyecto completo en tu computadora** 🎉
