# 📥 Guía Completa para Descargar el Proyecto Nexo Web Chat

## 🎯 Opción 1: Descargar desde la Plataforma (Recomendado)

### Paso 1: Buscar el botón de descarga
En la plataforma donde estás trabajando, busca uno de estos botones:
- **"Download"** o **"Descargar"**
- **"Export"** o **"Exportar"**
- Ícono de descarga **⬇️**
- Menú de tres puntos **⋮** → "Download project"

### Paso 2: Descargar el archivo
- Se descargará un archivo `.tar` o `.zip`
- El nombre será algo como: `workspace.tar` o `nexo-web-chat.tar`

### Paso 3: Extraer el archivo

**En Windows:**
```powershell
# Opción 1: Con PowerShell (Windows 10/11)
tar -xf workspace.tar

# Opción 2: Con 7-Zip (recomendado)
# 1. Descarga 7-Zip desde: https://www.7-zip.org/
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

### Paso 4: Renombrar la carpeta (opcional)
```bash
# Cambiar nombre de "workspace" a "nexo-web-chat"
mv workspace nexo-web-chat
```

---

## 🎯 Opción 2: Copiar Archivos Manualmente

Si no hay opción de descarga, puedes copiar cada archivo manualmente:

### Paso 1: Crear la estructura de carpetas

```bash
# Crear carpeta principal
mkdir nexo-web-chat
cd nexo-web-chat

# Crear carpetas de frontend
mkdir src

# Crear carpetas de backend (opcional)
mkdir -p backend/config
mkdir -p backend/includes
mkdir -p backend/api
mkdir -p backend/database
```

### Paso 2: Copiar archivos de frontend

**Archivos OBLIGATORIOS para ejecutar:**

#### `package.json`
```json
{
  "name": "nexo-web-chat",
  "version": "2.3.0",
  "private": true,
  "type": "module",
  "description": "Sistema de atención al cliente mediante chat web - Frávega",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.0",
    "vite": "^6.3.5"
  }
}
```

#### `vite.config.js`
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src"]
}
```

#### `index.html`
```html
<!doctype html>
<html lang="es-AR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nexo Web Chat — Sistema de Atención al Cliente | Frávega</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
      html.light,
      html.light body {
        background-color: #ffffff !important;
        color: #000000;
      }
      html.dark,
      html.dark body {
        background-color: #1a1a1a !important;
        color: #ffffff;
      }
    </style>
    <script>
      (function () {
        const isInIframe = window.self !== window.top;

        function applyThemeToDOM(theme) {
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(theme);
          document.documentElement.setAttribute("data-theme", theme);
        }

        if (isInIframe) {
          window.addEventListener("message", function (event) {
            if (event.data && typeof event.data.theme === "string") {
              const theme = event.data.theme;
              if (theme === "light" || theme === "dark") {
                applyThemeToDOM(theme);
              }
            }
          });
        }

        try {
          const stored = localStorage.getItem("theme");
          if (stored === "light" || stored === "dark") {
            applyThemeToDOM(stored);
          } else {
            applyThemeToDOM("light");
          }
        } catch (e) {
          applyThemeToDOM("light");
        }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### `.gitignore`
```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
```

### Paso 3: Copiar archivos de src/

Los archivos `src/main.tsx`, `src/App.tsx` y `src/index.css` son muy largos. Te recomiendo copiarlos directamente desde esta plataforma usando la opción de descarga o copiando el contenido de cada archivo.

**Alternativa rápida:** Si puedes descargar un ZIP de este proyecto, todos estos archivos estarán incluidos.

---

## 🚀 Ejecutar el Proyecto

### Paso 1: Instalar dependencias

```bash
npm install
```

Esto descargará todas las librerías necesarias. Espera 1-2 minutos.

### Paso 2: Ejecutar en modo desarrollo

```bash
npm run dev
```

Verás algo como:
```
  VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Paso 3: Abrir en el navegador

Abre tu navegador y ve a: **http://localhost:5173**

¡Deberías ver la pantalla de login!

---

## 🔐 Credenciales de Prueba

### Administrador
```
DNI: 12345678
Contraseña: admin123
Código: 1234
```

### Supervisor
```
DNI: 23456789
Contraseña: super123
Código: 2345
```

### Agente
```
DNI: 34567890
Contraseña: agent123
Código: 3456
```

---

## 📤 Subir a GitHub

### Paso 1: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre: `nexo-web-chat`
3. Descripción: `Sistema de atención al cliente mediante chat web - Frávega`
4. Visibilidad: **Público**
5. **NO** marques "Add a README file"
6. Click en **"Create repository"**

### Paso 2: Subir código desde tu PC

Abre terminal en la carpeta del proyecto:

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: Nexo Web Chat v2.3 - Login, CRUD, modo oscuro, accesibilidad"

# Cambiar a rama main
git branch -M main

# Agregar repositorio remoto (REEMPLAZA TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/nexo-web-chat.git

# Subir a GitHub
git push -u origin main
```

---

## 🌐 Deployar a Vercel

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

## 📊 Estructura Completa del Proyecto

```
nexo-web-chat/
├── 📄 Archivos de Configuración (Raíz)
│   ├── index.html              ✅ HTML principal
│   ├── package.json            ✅ Dependencias
│   ├── vite.config.js          ✅ Configuración Vite
│   ├── tsconfig.json           ✅ Configuración TypeScript
│   ├── vercel.json             ✅ Configuración Vercel
│   └── .gitignore              ✅ Archivos a ignorar
│
├── 📁 src/ (Frontend React)
│   ├── main.tsx                ✅ Punto de entrada
│   ├── App.tsx                 ✅ Componente principal (1333 líneas)
│   └── index.css               ✅ Estilos completos (2500+ líneas)
│
├── 📁 backend/ (PHP - Opcional)
│   ├── config/
│   │   ├── config.php          ✅ Configuración general
│   │   └── database.php        ✅ Conexión PDO
│   ├── includes/
│   │   ├── auth.php            ✅ Autenticación
│   │   ├── permissions.php     ✅ Control de roles
│   │   └── csrf.php            ✅ Protección CSRF
│   ├── api/
│   │   ├── auth.php            ✅ API autenticación
│   │   ├── conversations.php   ✅ API conversaciones
│   │   ├── messages.php        ✅ API mensajes
│   │   ├── customers.php       ✅ API clientes
│   │   ├── orders.php          ✅ API pedidos
│   │   ├── quick_replies.php   ✅ API respuestas rápidas
│   │   ├── knowledge_base.php  ✅ API base de conocimiento
│   │   ├── escalations.php     ✅ API escalaciones
│   │   ├── metrics.php         ✅ API métricas
│   │   ├── users.php           ✅ API usuarios
│   │   └── quality.php         ✅ API calidad
│   └── database/
│       ├── schema.sql          ✅ Estructura de BD
│       └── seed.sql            ✅ Datos de prueba
│
└── 📄 Documentación
    ├── README.md               ✅ Documentación principal
    ├── DATABASE.md             ✅ Documentación de BD
    ├── DEPLOYMENT.md           ✅ Guía de deployment
    ├── LOGIN.md                ✅ Documentación del login
    ├── ACCESIBILIDAD.md        ✅ Mejoras de accesibilidad
    ├── VERSION_2.2.md          ✅ Cambios versión 2.2
    ├── VERSION_2.1.md          ✅ Cambios versión 2.1
    └── ... (otros documentos)
```

---

## 🎯 Características Implementadas

### ✅ Sistema de Login
- Pantalla de login minimalista
- Validación de DNI, contraseña y código de seguridad
- 3 usuarios de prueba (admin, supervisor, agente)
- Información del usuario en sidebar
- Botón de cerrar sesión

### ✅ CRUD Completo
- Clientes: Crear, Editar, Eliminar
- Pedidos: Crear, Editar, Eliminar
- Usuarios: Crear, Editar, Eliminar
- Modales con formularios
- Notificaciones de éxito

### ✅ Chat en Tiempo Real
- 6 conversaciones de ejemplo
- Auto-respuestas del cliente
- Indicador de "escribiendo..."
- Estado de mensajes (✓ / ✓✓)
- Respuestas rápidas desplegables

### ✅ Modo Oscuro/Claro
- Toggle en sidebar
- Totalmente legible en ambos modos
- Transiciones suaves

### ✅ Accesibilidad
- Focus states para navegación con teclado
- Soporte para reduced motion
- Soporte para high contrast mode
- Screen reader support
- WCAG 2.1 Level AA compliance

### ✅ Actualización Automática
- Pedidos se actualizan cada 5 segundos
- Notificaciones de cambios de estado
- Simulación de progreso (preparing → shipping → delivered)

### ✅ Vistas Completas
- Dashboard con métricas
- Bandeja de chats (3 paneles)
- Gestión de clientes
- Gestión de pedidos
- Gestión de usuarios
- Escalaciones
- Base de conocimiento
- Respuestas rápidas
- Métricas
- Calidad

---

## 🐛 Solución de Problemas

### Error: "npm: command not found"
**Solución:** Instala Node.js desde https://nodejs.org/

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5173 is already in use"
```bash
# Usar otro puerto
npm run dev -- --port 3000
```

### Error: "git: command not found"
**Solución:** Instala Git desde https://git-scm.com/

### Error: "Permission denied" (Mac/Linux)
```bash
chmod +x deploy.sh
```

### Pantalla en blanco después del login
**Solución:**
1. Limpia la cache del navegador: Ctrl+Shift+R
2. Verifica que el archivo `src/App.tsx` esté completo
3. Reinicia el servidor: `npm run dev`

### No puedo hacer scroll en el login
**Solución:**
1. Verifica que el archivo `src/index.css` tenga la clase `.login-container` con `overflow-y: auto`
2. Ajusta el zoom del navegador: Ctrl + 0 (resetear zoom)

---

## 📞 Soporte

### Documentación
- `README.md` - Información general
- `DATABASE.md` - Guía de base de datos
- `DEPLOYMENT.md` - Guía de deployment
- `LOGIN.md` - Documentación del login
- `ACCESIBILIDAD.md` - Mejoras de accesibilidad

### Recursos Externos
- [Node.js Docs](https://nodejs.org/en/docs)
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [GitHub Docs](https://docs.github.com/)
- [Vercel Docs](https://vercel.com/docs)

---

## ✅ Checklist Final

### Antes de ejecutar
- [ ] Node.js 18+ instalado
- [ ] Carpeta del proyecto creada
- [ ] Archivos copiados/descargados
- [ ] `npm install` ejecutado sin errores

### Para ejecutar localmente
- [ ] `npm run dev` funciona
- [ ] http://localhost:5173 abre correctamente
- [ ] Pantalla de login aparece
- [ ] Puedo iniciar sesión con credenciales de prueba
- [ ] Todas las vistas funcionan

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

**¡Listo! Ahora tienes el proyecto completo en tu computadora** 🎉
