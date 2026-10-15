# ==========================================
# NEXO WEB CHAT - SCRIPT DE DEPLOYMENT (Windows)
# ==========================================

Write-Host "🚀 Nexo Web Chat - Deployment Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Verificar que Vercel CLI esté instalado
try {
    $vercelVersion = vercel --version 2>$null
    if (-not $vercelVersion) {
        throw "Vercel CLI no encontrado"
    }
} catch {
    Write-Host "❌ Vercel CLI no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host ""
}

# Verificar que estemos logueados en Vercel
try {
    vercel whoami 2>$null | Out-Null
} catch {
    Write-Host "🔐 Iniciando sesión en Vercel..." -ForegroundColor Yellow
    vercel login
    Write-Host ""
}

# Compilar el proyecto
Write-Host "🔨 Compilando el proyecto..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al compilar el proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Proyecto compilado exitosamente" -ForegroundColor Green
Write-Host ""

# Deploy a Vercel
Write-Host "🚀 Desplegando a Vercel..." -ForegroundColor Cyan
Write-Host ""

# Preguntar si es production o preview
$respuesta = Read-Host "¿Deploy a producción? (s/n)"

if ($respuesta -eq "s" -or $respuesta -eq "S") {
    Write-Host "📦 Deployando a PRODUCCIÓN..." -ForegroundColor Yellow
    vercel --prod
} else {
    Write-Host "📦 Deployando a PREVIEW..." -ForegroundColor Yellow
    vercel
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Deploy exitoso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Tu aplicación está disponible en:" -ForegroundColor Cyan
    vercel ls
    Write-Host ""
    Write-Host "📊 Para ver el dashboard:" -ForegroundColor Cyan
    Write-Host "   https://vercel.com/dashboard" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Error al deployar" -ForegroundColor Red
    exit 1
}
