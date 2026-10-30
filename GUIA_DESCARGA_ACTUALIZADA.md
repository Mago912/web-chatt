# 📋 GUÍA PASO A PASO: Descargar Workspace Actualizado

## 🎯 Estado Actual del Proyecto

### ✅ Archivos en esta plataforma (ACTUALIZADOS)

| Archivo | Líneas | Estado |
|---------|--------|--------|
| `src/App.tsx` | 1333 | ✅ Con login y todas las funcionalidades |
| `src/index.css` | 2788 | ✅ Con login scrollable y modo oscuro |
| `src/main.tsx` | 7 | ✅ Punto de entrada |
| `package.json` | - | ✅ Dependencias actualizadas |
| `vite.config.js` | - | ✅ Configuración correcta |
| `tsconfig.json` | - | ✅ TypeScript configurado |
| `index.html` | - | ✅ HTML principal |
| `vercel.json` | - | ✅ Configuración Vercel |

### ✅ Build Exitoso
```
✓ 28 modules transformed.
dist/index.html                   3.24 kB
dist/assets/index-C6VP3O4W.css   36.40 kB
dist/assets/index-BMNr7Mp0.js   184.04 kB
✓ built in 1.19s
```

---

## 🚨 Problema Identificado

El `workspace.tar` que descargas es una **versión anterior** que NO incluye:
- ❌ Sistema de login
- ❌ Login scrollable
- ❌ Corrección de pantalla en blanco después del login

---

## ✅ SOLUCIÓN: Descargar el Workspace ACTUALIZADO

### Paso 1: Buscar el botón de descarga

En esta plataforma, busca uno de estos botones:

**Opciones comunes:**
- 🔘 Botón **"Download"** (arriba a la derecha)
- 🔘 Botón **"Descargar"** (en español)
- 🔘 Botón **"Export"** o **"Exportar"**
- 🔘 Ícono **⬇️** (flecha hacia abajo)
- 🔘 Menú **⋮** (tres puntos) → "Download project"

**Ubicación típica:**
- Esquina superior derecha
- Barra de herramientas superior
- Menú de opciones del proyecto

### Paso 2: Descargar el archivo

1. Haz clic en el botón de descarga
2. Se descargará un archivo llamado `workspace.tar`
3. Guarda el archivo en tu carpeta de Descargas

### Paso 3: Verificar el archivo descargado

**Verificación rápida:**
```powershell
# En PowerShell, verifica el tamaño del archivo
cd Downloads
dir workspace.tar

# Tamaño esperado: ~200-300 KB
# Si es mucho más pequeño, es una versión antigua
```

### Paso 4: Extraer el archivo

```powershell
# Extraer el archivo
tar -xf workspace.tar

# Verificar que se extrajo correctamente
dir
# Deberías ver una carpeta llamada "workspace"
```

### Paso 5: Renombrar la carpeta

```powershell
# Renombrar de "workspace" a "nexo-web-chat"
mv workspace nexo-web-chat

# Entrar a la carpeta
cd nexo-web-chat
```

### Paso 6: Verificar los archivos

```powershell
# Verificar que tenga los archivos correctos
dir src

# Deberías ver:
# - App.tsx
# - index.css
# - main.tsx
```

### Paso 7: Verificar el contenido de App.tsx

Abre `src/App.tsx` con un editor de texto (VS Code, Notepad++, etc.)

**Busca estas líneas (deben estar al inicio del archivo):**

```typescript
// Línea 232-238
const usuariosPrueba = [
  { dni: '12345678', password: 'admin123', codigo: '1234', nombre: 'Admin Sistema', rol: 'admin' },
  { dni: '23456789', password: 'super123', codigo: '2345', nombre: 'Nicolás Romero', rol: 'supervisor' },
  { dni: '34567890', password: 'agent123', codigo: '3456', nombre: 'Sofía Ríos', rol: 'agente' },
];
```

**✅ Si encuentras estas líneas:** El archivo está actualizado
**❌ Si NO encuentras estas líneas:** El archivo es una versión antigua

### Paso 8: Verificar el contenido de index.css

Abre `src/index.css` con un editor de texto

**Busca estas líneas (alrededor de la línea 2489):**

```css
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  overflow-y: auto;  /* ← Esta línea es CRÍTICA */
}
```

**✅ Si encuentras `overflow-y: auto`:** El archivo está actualizado
**❌ Si NO encuentras esta línea:** El archivo es una versión antigua

---

## 🚀 Ejecutar el Proyecto

### Paso 9: Instalar dependencias

```powershell
npm install
```

Espera 1-2 minutos hasta que termine.

### Paso 10: Ejecutar en modo desarrollo

```powershell
npm run dev
```

Deberías ver:
```
  VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Paso 11: Abrir en el navegador

Abre tu navegador y ve a: **http://localhost:5173**

**Deberías ver:**
1. ✅ Pantalla de login con gradiente azul-púrpura
2. ✅ Logo "N" centrado
3. ✅ Título "Nexo Web Chat"
4. ✅ 3 campos: DNI, Contraseña, Código de Seguridad
5. ✅ **Puedes hacer scroll** para ver las credenciales de prueba
6. ✅ Botón "Iniciar Sesión"

### Paso 12: Iniciar sesión

Usa las credenciales de prueba:

**Administrador:**
```
DNI: 12345678
Contraseña: admin123
Código: 1234
```

**Después del login:**
- ✅ Deberías ver la aplicación principal (NO pantalla en blanco)
- ✅ Sidebar con menú de navegación
- ✅ Dashboard o Chat visible
- ✅ Tu nombre en el sidebar

---

## 🐛 Solución de Problemas

### Problema 1: "No encuentro el botón de descarga"

**Solución:**
Dime en qué plataforma estás trabajando:
- ¿Bolt.new?
- ¿Replit?
- ¿CodeSandbox?
- ¿StackBlitz?
- ¿Otra?

Con esa información puedo darte instrucciones específicas.

### Problema 2: "El workspace.tar es muy pequeño"

**Solución:**
El archivo descargado es una versión antigua. Intenta:
1. Refrescar la página de la plataforma (F5)
2. Buscar nuevamente el botón de descarga
3. O copia los archivos manualmente (ver abajo)

### Problema 3: "No encuentro las líneas de usuariosPrueba en App.tsx"

**Solución:**
El archivo es una versión antigua. Copia manualmente:

1. Haz clic en `src/App.tsx` en esta plataforma
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)
3. Abre `src/App.tsx` en tu proyecto local
4. Reemplaza TODO el contenido (Ctrl+A, Ctrl+V)
5. Guarda el archivo

### Problema 4: "No encuentro overflow-y: auto en index.css"

**Solución:**
El archivo es una versión antigua. Copia manualmente:

1. Haz clic en `src/index.css` en esta plataforma
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)
3. Abre `src/index.css` en tu proyecto local
4. Reemplaza TODO el contenido (Ctrl+A, Ctrl+V)
5. Guarda el archivo

### Problema 5: "Pantalla en blanco después del login"

**Solución:**
1. Limpia la cache del navegador: **Ctrl+Shift+R**
2. Verifica que `src/App.tsx` tenga 1333 líneas
3. Reinicia el servidor:
   ```powershell
   # Detener (Ctrl+C)
   npm run dev
   ```

### Problema 6: "No puedo hacer scroll en el login"

**Solución:**
1. Verifica que `src/index.css` tenga `overflow-y: auto` en `.login-container`
2. Ajusta el zoom del navegador: **Ctrl + 0** (resetear zoom)
3. Intenta con otro navegador (Chrome, Firefox, Edge)

---

## 📤 Subir a GitHub

Una vez que verifiques que todo funciona:

```powershell
# 1. Inicializar git
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer commit
git commit -m "feat: v2.3 - Login scrollable y corrección de pantalla en blanco"

# 4. Agregar repositorio remoto
git remote add origin https://github.com/TU_USUARIO/nexo-web-chat.git

# 5. Subir a GitHub
git branch -M main
git push -u origin main
```

---

## 📊 Resumen de Verificación

### ✅ Checklist Final

- [ ] Descargaste el workspace.tar actualizado
- [ ] El archivo tiene ~200-300 KB
- [ ] Extrajiste el archivo correctamente
- [ ] Renombraste la carpeta a "nexo-web-chat"
- [ ] `src/App.tsx` tiene 1333 líneas
- [ ] `src/App.tsx` contiene `usuariosPrueba`
- [ ] `src/index.css` tiene 2788 líneas
- [ ] `src/index.css` contiene `overflow-y: auto`
- [ ] Ejecutaste `npm install` sin errores
- [ ] Ejecutaste `npm run dev`
- [ ] http://localhost:5173 abre correctamente
- [ ] Ves la pantalla de login
- [ ] Puedes hacer scroll en el login
- [ ] Puedes iniciar sesión con las credenciales
- [ ] Después del login, ves la aplicación (NO pantalla en blanco)

---

## 🎯 Próximos Pasos

1. **Descarga el workspace actualizado** usando el botón de descarga
2. **Verifica los archivos** siguiendo los pasos 7 y 8
3. **Ejecuta el proyecto** siguiendo los pasos 9-12
4. **Sube a GitHub** si todo funciona correctamente

---

## 📞 Necesitas Ayuda?

Si tienes problemas en algún paso, dime:
1. ¿En qué plataforma estás trabajando?
2. ¿En qué paso estás?
3. ¿Qué error ves?

Con esa información puedo ayudarte específicamente.

---

**¡Los archivos en esta plataforma están actualizados! Solo necesitas descargar la versión correcta.** 🚀
