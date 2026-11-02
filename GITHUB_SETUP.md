# 📤 Instrucciones para Subir a GitHub

## Paso 1: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `nexo-web-chat`
3. Descripción: `Sistema de atención al cliente mediante chat web - Frávega`
4. Visibilidad: **Público** (o Privado según prefieras)
5. **NO** inicializar con README, .gitignore o licencia (ya los tenemos)
6. Click en "Create repository"

## Paso 2: Conectar repositorio local con GitHub

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Nexo Web Chat MVP"

# Agregar repositorio remoto (REEMPLAZA con tu URL de GitHub)
git remote add origin https://github.com/TU_USUARIO/nexo-web-chat.git

# Subir código a GitHub
git branch -M main
git push -u origin main
```

## Paso 3: Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos subidos
3. El README.md se mostrará automáticamente en la página principal

---

## 📝 Comandos Git Útiles

### Ver estado del repositorio
```bash
git status
```

### Agregar cambios específicos
```bash
git add src/App.tsx
git add backend/api/customers.php
```

### Hacer commit con mensaje descriptivo
```bash
git commit -m "feat: agregar funcionalidad de eliminar chats"
git commit -m "fix: corregir bug en polling de mensajes"
git commit -m "docs: actualizar README"
```

### Subir cambios a GitHub
```bash
git push
```

### Crear nueva rama
```bash
git checkout -b feature/nueva-funcionalidad
```

### Volver a rama principal
```bash
git checkout main
```

---

## 🏷️ Crear Releases (Versiones)

Cuando tengas una versión estable:

```bash
# Crear tag
git tag -a v1.0.0 -m "Versión 1.0.0 - MVP completo"

# Subir tag
git push origin v1.0.0
```

Luego en GitHub:
1. Ve a "Releases" en el menú lateral
2. Click en "Draft a new release"
3. Selecciona el tag
4. Agrega descripción de cambios
5. Click en "Publish release"

---

## 📊 Agregar Topics (Etiquetas)

En la página del repositorio en GitHub:
1. Click en "About" (lado derecho)
2. Click en el ícono de lápiz
3. Agrega topics como:
   - `php`
   - `mysql`
   - `chat-system`
   - `customer-support`
   - `real-time`
   - `omnichannel`
   - `fravega`

---

## 🔒 Configuración de Seguridad

### Proteger rama main

1. Ve a Settings → Branches
2. Click en "Add rule"
3. Branch name pattern: `main`
4. Activa:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Include administrators

### Agregar colaboradores

1. Ve a Settings → Collaborators
2. Click en "Add people"
3. Busca por username de GitHub
4. Selecciona permisos (Read, Triage, Write, Maintain, Admin)

---

## 📝 Template de Pull Request

Crea el archivo `.github/pull_request_template.md`:

```markdown
## Descripción
Describe los cambios realizados

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Mejora de rendimiento
- [ ] Documentación

## Checklist
- [ ] Código probado localmente
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Sin errores de linting

## Screenshots (si aplica)
Agrega capturas de pantalla si hay cambios visuales
```

---

## 🚀 Próximos Pasos

Después de subir a GitHub:

1. **Configurar CI/CD** con GitHub Actions
2. **Agregar tests** automatizados
3. **Configurar deployment** automático
4. **Crear wiki** con documentación detallada
5. **Agregar issues** para bugs y features futuras

---

## 📞 Soporte

Si tienes problemas al subir a GitHub:
- Revisa que tu `.gitignore` esté correcto
- Verifica que no estés subiendo archivos sensibles
- Consulta la documentación oficial: https://docs.github.com/
