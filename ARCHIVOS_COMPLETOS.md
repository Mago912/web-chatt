# 📁 Estructura Completa del Proyecto - Nexo Web Chat

## ✅ Archivos Necesarios para Ejecutar Localmente

### 📦 Archivos de Configuración (Raíz)

```
nexo-web-chat/
├── index.html              ✅ HTML principal con configuración de tema
├── package.json            ✅ Dependencias y scripts de npm
├── tsconfig.json           ✅ Configuración de TypeScript
├── vite.config.js          ✅ Configuración de Vite
├── vercel.json             ✅ Configuración para deployment en Vercel
├── .gitignore              ✅ Archivos a ignorar en Git
└── README.md               ✅ Documentación principal
```

### 🎨 Archivos de Frontend (React + TypeScript)

```
src/
├── main.tsx                ✅ Punto de entrada de React
├── App.tsx                 ✅ Componente principal (667 líneas)
└── index.css               ✅ Estilos CSS completos (2170 líneas)
```

### 🔧 Archivos de Backend PHP (Opcional - Para persistencia real)

```
backend/
├── config/
│   ├── config.php          ✅ Configuración general
│   └── database.php        ✅ Conexión PDO a MySQL
├── includes/
│   ├── auth.php            ✅ Autenticación y sesiones
│   ├── permissions.php     ✅ Control de roles
│   └── csrf.php            ✅ Protección CSRF
├── api/
│   ├── auth.php            ✅ API de autenticación
│   ├── conversations.php   ✅ CRUD de conversaciones
│   ├── messages.php        ✅ CRUD de mensajes
│   ├── customers.php       ✅ CRUD de clientes
│   ├── orders.php          ✅ CRUD de pedidos
│   ├── quick_replies.php   ✅ CRUD de respuestas rápidas
│   ├── knowledge_base.php  ✅ CRUD de base de conocimiento
│   ├── escalations.php     ✅ CRUD de escalaciones
│   ├── metrics.php         ✅ Métricas en tiempo real
│   ├── users.php           ✅ CRUD de usuarios
│   └── quality.php         ✅ CRUD de evaluaciones de calidad
└── database/
    ├── schema.sql          ✅ Estructura de base de datos
    └── seed.sql            ✅ Datos de prueba
```

### 📚 Documentación

```
├── README.md               ✅ Información general
├── DEPLOYMENT.md           ✅ Guía completa de deployment
├── GUIA_RAPIDA.md          ✅ Instrucciones rápidas
├── COMO_DESCARGAR.md       ✅ Cómo obtener el proyecto
├── PROMPT_MAESTRO.md       ✅ Prompt para IAs
├── CORRECCIONES.md         ✅ Historial de correcciones
├── GITHUB_SETUP.md         ✅ Configuración de GitHub
├── RESUMEN_MEJORAS.md      ✅ Lista de mejoras
├── deploy.sh               ✅ Script de deployment (Linux/Mac)
└── deploy.ps1              ✅ Script de deployment (Windows)
```

---

## 🚀 Pasos para Ejecutar Localmente

### 1. Crear la estructura de carpetas

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

### 2. Copiar archivos de frontend

**Archivos OBLIGATORIOS para ejecutar:**

#### `package.json`
```json
{
  "name": "nexo-web-chat",
  "version": "1.1.0",
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

### 3. Copiar archivos de src/

Los archivos `src/main.tsx`, `src/App.tsx` y `src/index.css` son muy largos. Te recomiendo copiarlos directamente desde esta plataforma usando la opción de descarga o copiando el contenido de cada archivo.

**Alternativa rápida:** Si puedes descargar un ZIP de este proyecto, todos estos archivos estarán incluidos.

### 4. Instalar dependencias

```bash
npm install
```

### 5. Ejecutar en modo desarrollo

```bash
npm run dev
```

### 6. Abrir en el navegador

Ve a: **http://localhost:5173**

---

## 📊 Resumen de Archivos

| Categoría | Cantidad | Tamaño Aproximado |
|-----------|----------|-------------------|
| Configuración | 6 archivos | ~2 KB |
| Frontend (React) | 3 archivos | ~210 KB |
| Backend (PHP) | 15 archivos | ~50 KB |
| Base de Datos | 2 archivos | ~30 KB |
| Documentación | 9 archivos | ~40 KB |
| Scripts | 2 archivos | ~5 KB |
| **TOTAL** | **37 archivos** | **~337 KB** |

---

## ✅ Checklist de Archivos Críticos

### Para ejecutar SOLO el frontend (sin backend):
- [x] `package.json`
- [x] `vite.config.js`
- [x] `tsconfig.json`
- [x] `index.html`
- [x] `src/main.tsx`
- [x] `src/App.tsx`
- [x] `src/index.css`

### Para ejecutar con backend completo:
- [x] Todos los archivos de frontend (arriba)
- [x] `backend/config/config.php`
- [x] `backend/config/database.php`
- [x] `backend/includes/auth.php`
- [x] `backend/includes/permissions.php`
- [x] `backend/includes/csrf.php`
- [x] `backend/api/*.php` (11 archivos)
- [x] `backend/database/schema.sql`
- [x] `backend/database/seed.sql`

---

## 🎯 Recomendación

**Para ejecutar rápidamente:**
1. Descarga el ZIP completo del proyecto (si la plataforma lo permite)
2. Extrae en tu PC
3. Ejecuta `npm install`
4. Ejecuta `npm run dev`
5. Abre http://localhost:5173

**Si no puedes descargar ZIP:**
1. Copia solo los 7 archivos críticos de frontend (listados arriba)
2. El frontend funciona standalone con datos mock
3. No necesitas el backend PHP para ver la aplicación funcionando

---

**¡Todos los archivos están verificados y listos para usar!** 🚀
