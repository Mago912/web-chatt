# 🚀 Guía de Deployment - Nexo Web Chat

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Deployment en Vercel](#deployment-en-vercel)
3. [Deployment en GitHub Pages](#deployment-en-github-pages)
4. [Deployment Manual](#deployment-manual)
5. [Configuración del Backend](#configuración-del-backend)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos Previos

### Software Necesario
- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** 9+ (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))
- **Cuenta en Vercel** ([Registrarse](https://vercel.com/signup))
- **Cuenta en GitHub** ([Registrarse](https://github.com/signup))

### Verificar Instalación
```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior
git --version     # Debe mostrar git version 2.x.x
```

---

## 🚀 Deployment en Vercel (Recomendado)

### Opción 1: Deploy Automático desde GitHub

1. **Subir código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Nexo Web Chat"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/nexo-web-chat.git
   git push -u origin main
   ```

2. **Conectar con Vercel**
   - Ir a [vercel.com/new](https://vercel.com/new)
   - Click en "Import Git Repository"
   - Seleccionar el repositorio `nexo-web-chat`
   - Vercel detectará automáticamente que es un proyecto Vite
   - Click en "Deploy"

3. **Configuración Automática**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **¡Listo!** Tu aplicación estará disponible en `https://nexo-web-chat.vercel.app`

### Opción 2: Deploy con Vercel CLI

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Iniciar sesión**
   ```bash
   vercel login
   ```

3. **Deployar**
   ```bash
   # Deploy a preview
   vercel
   
   # Deploy a producción
   vercel --prod
   ```

4. **Usar Script Automático**
   ```bash
   # Linux/Mac
   chmod +x deploy.sh
   ./deploy.sh
   
   # Windows (PowerShell)
   .\deploy.ps1
   ```

---

## 📄 Deployment en GitHub Pages

### Configuración Manual

1. **Instalar dependencia para GitHub Pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Agregar scripts en `package.json`**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Configurar base path en `vite.config.js`**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/nexo-web-chat/',
   })
   ```

4. **Deployar**
   ```bash
   npm run deploy
   ```

5. **Configurar GitHub Pages**
   - Ir a Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

---

## 🔧 Deployment Manual

### 1. Compilar el Proyecto
```bash
npm install
npm run build
```

### 2. Subir archivos a tu servidor
```bash
# Copiar carpeta dist/ a tu servidor
scp -r dist/* usuario@servidor:/var/www/html/
```

### 3. Configurar servidor web (Apache)
```apache
<VirtualHost *:80>
    ServerName nexo-webchat.com
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### 4. Configurar servidor web (Nginx)
```nginx
server {
    listen 80;
    server_name nexo-webchat.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🔌 Configuración del Backend

### 1. Configurar Base de Datos MySQL
```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE nexo_webchat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Importar schema
mysql -u root -p nexo_webchat < backend/database/schema.sql

# Importar datos de prueba
mysql -u root -p nexo_webchat < backend/database/seed.sql
```

### 2. Configurar credenciales
Editar `backend/config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'nexo_webchat');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_password');
```

### 3. Configurar permisos
```bash
chmod 755 backend/
chmod 644 backend/config/*.php
chmod 644 backend/api/*.php
```

### 4. Probar API
```bash
curl http://localhost/backend/api/auth.php?action=check
```

---

## 🌐 Variables de Entorno

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost/backend/api
VITE_APP_NAME=Nexo Web Chat
VITE_APP_VERSION=1.0.0
```

### Backend (`backend/config/config.php`)
```php
define('APP_ENV', 'production'); // development | production
define('APP_URL', 'https://nexo-webchat.vercel.app');
define('API_URL', 'https://api.nexo-webchat.com');
```

---

## 🔍 Troubleshooting

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Build failed"
```bash
# Verificar versión de Node
node --version  # Debe ser 18+

# Limpiar cache
npm cache clean --force
npm install
```

### Error: "CORS policy"
Agregar en `backend/api/.htaccess`:
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

### Error: "404 Not Found" en rutas
Configurar rewrite rules en tu servidor web (ver sección Deployment Manual)

### Error: "White screen after deploy"
```bash
# Verificar que el build se generó correctamente
ls dist/

# Debe contener:
# - index.html
# - assets/
#   - index-xxxxx.js
#   - index-xxxxx.css
```

---

## 📊 Monitoreo y Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

En `src/main.tsx`:
```typescript
import { inject } from '@vercel/analytics';
inject();
```

### Google Analytics
Agregar en `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔐 Seguridad en Producción

### 1. HTTPS Obligatorio
```apache
<VirtualHost *:80>
    ServerName nexo-webchat.com
    Redirect permanent / https://nexo-webchat.com/
</VirtualHost>
```

### 2. Headers de Seguridad
```apache
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
    Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
```

### 3. Rate Limiting (Backend)
```php
// backend/includes/rate_limit.php
function checkRateLimit($max_requests = 60, $time_window = 60) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = "rate_limit:$ip";
    
    // Implementar con Redis o Memcached
    // ...
}
```

---

## 📱 Dominio Personalizado

### Vercel
1. Ir a Project Settings → Domains
2. Agregar dominio: `nexo-webchat.com`
3. Configurar DNS:
   - **Type:** A
   - **Name:** @
   - **Value:** 76.76.21.21
   - **Type:** CNAME
   - **Name:** www
   - **Value:** cname.vercel-dns.com

### GitHub Pages
1. Agregar `CNAME` en la raíz del repositorio:
   ```
   nexo-webchat.com
   ```
2. Configurar DNS en tu registrador:
   - **Type:** A
   - **Name:** @
   - **Value:** 185.199.108.153
   - **Value:** 185.199.109.153
   - **Value:** 185.199.110.153
   - **Value:** 185.199.111.153

---

## 🔄 CI/CD con GitHub Actions

Crear `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📞 Soporte

### Documentación
- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)

### Comunidad
- [GitHub Issues](https://github.com/TU_USUARIO/nexo-web-chat/issues)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## ✅ Checklist Pre-Deployment

- [ ] Compilar el proyecto sin errores (`npm run build`)
- [ ] Probar todas las funcionalidades localmente
- [ ] Configurar variables de entorno
- [ ] Configurar base de datos MySQL
- [ ] Configurar backend PHP
- [ ] Probar API endpoints
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar HTTPS
- [ ] Configurar analytics
- [ ] Configurar monitoreo de errores
- [ ] Documentar credenciales de acceso
- [ ] Hacer backup de la base de datos

---

**¡Listo para deployar!** 🚀
