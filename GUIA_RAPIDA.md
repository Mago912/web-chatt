# 🚀 Guía Rápida: Subir a GitHub y Vercel

## 📋 Paso a Paso (5 minutos)

### 1️⃣ Subir a GitHub

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: Nexo Web Chat v1.1 - Modo oscuro, búsqueda, exportar, stats"

# Crear rama main
git branch -M main

# Agregar repositorio remoto (REEMPLAZA con tu URL)
git remote add origin https://github.com/TU_USUARIO/nexo-web-chat.git

# Subir a GitHub
git push -u origin main
```

**✅ Listo en GitHub:** https://github.com/TU_USUARIO/nexo-web-chat

---

### 2️⃣ Deployar a Vercel

#### Opción A: Desde GitHub (Automático)

1. Ir a **https://vercel.com/new**
2. Click en **"Import Git Repository"**
3. Seleccionar **`nexo-web-chat`**
4. Click en **"Deploy"**
5. ¡Esperar 30 segundos!

**✅ Live en:** https://nexo-web-chat.vercel.app

#### Opción B: Con CLI (Manual)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy a producción
vercel --prod
```

#### Opción C: Con Script (Automático)

```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows (PowerShell)
.\deploy.ps1
```

---

## 🎯 ¿Qué se Deploya?

### Frontend (Vercel)
- ✅ Aplicación React completa
- ✅ Modo oscuro/claro
- ✅ Búsqueda global
- ✅ Estadísticas en tiempo real
- ✅ Exportar conversaciones
- ✅ Responsive design

### Backend (Servidor PHP)
- ⚠️ **NO se deploya en Vercel**
- ⚠️ Necesita servidor con PHP 8+ y MySQL
- ⚠️ Ver `DEPLOYMENT.md` para instrucciones

---

## 🔧 Configuración Post-Deploy

### 1. Configurar Backend (Opcional)

Si quieres usar el backend PHP:

```bash
# 1. Subir carpeta backend/ a tu servidor
scp -r backend/ usuario@servidor:/var/www/

# 2. Configurar base de datos
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/seed.sql

# 3. Editar credenciales
nano backend/config/database.php
```

### 2. Configurar Dominio Personalizado (Opcional)

En Vercel:
1. Ir a **Project Settings → Domains**
2. Agregar: `nexo-webchat.com`
3. Configurar DNS:
   - **A:** 76.76.21.21
   - **CNAME www:** cname.vercel-dns.com

### 3. Configurar Analytics (Opcional)

```bash
npm install @vercel/analytics
```

En `src/main.tsx`:
```typescript
import { inject } from '@vercel/analytics';
inject();
```

---

## 📊 Verificación Post-Deploy

### Checklist

- [ ] Frontend carga correctamente en Vercel
- [ ] Modo oscuro/claro funciona
- [ ] Búsqueda global funciona
- [ ] Estadísticas se actualizan
- [ ] Exportar conversaciones funciona
- [ ] Responsive en mobile
- [ ] Backend PHP responde (si está configurado)
- [ ] HTTPS activo
- [ ] Dominio personalizado (si se configuró)

### URLs de Verificación

- **Frontend:** https://nexo-web-chat.vercel.app
- **GitHub:** https://github.com/TU_USUARIO/nexo-web-chat
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Backend API:** http://tu-servidor.com/backend/api/

---

## 🐛 Troubleshooting Rápido

### Error: "Build failed"
```bash
npm install
npm run build
# Verificar que compile sin errores
```

### Error: "404 en rutas"
Verificar que `vercel.json` tenga:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Error: "White screen"
```bash
# Verificar que dist/ se generó
ls dist/
# Debe contener index.html y assets/
```

### Error: "CORS policy"
Agregar en backend:
```php
header('Access-Control-Allow-Origin: *');
```

---

## 📞 Soporte

### Documentación Completa
- `DEPLOYMENT.md` - Guía detallada
- `README.md` - Información del proyecto
- `RESUMEN_MEJORAS.md` - Lista de mejoras

### Recursos Externos
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Docs](https://docs.github.com/)
- [Vite Docs](https://vitejs.dev/)

---

## ✅ ¡Listo!

Tu aplicación está:
- ✅ En GitHub para control de versiones
- ✅ En Vercel para hosting
- ✅ Lista para producción
- ✅ Con todas las funcionalidades

**Próximos pasos:**
1. Compartir URL con el equipo
2. Configurar backend PHP (si es necesario)
3. Agregar más funcionalidades
4. Monitorear métricas de uso

---

**¡Felicidades! Tu proyecto está en producción** 🎉
