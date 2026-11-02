# Script para crear archivo .tar del proyecto
# Nexo Web Chat - Frávega
# Para Windows PowerShell

Write-Host "📦 Creando archivo .tar del proyecto Nexo Web Chat..." -ForegroundColor Green
Write-Host ""

# Nombre del archivo de salida
$OUTPUT_FILE = "nexo-web-chat-v2.2.tar"

# Verificar si tar está disponible
try {
    $tarVersion = tar --version 2>$null
    if (-not $tarVersion) {
        throw "tar no encontrado"
    }
} catch {
    Write-Host "❌ tar no está disponible en tu sistema" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solución:" -ForegroundColor Yellow
    Write-Host "   1. Instala Git para Windows: https://git-scm.com/download/win"
    Write-Host "   2. O usa 7-Zip para crear el archivo comprimido"
    Write-Host ""
    exit 1
}

# Crear el archivo .tar
Write-Host "📁 Empaquetando archivos..." -ForegroundColor Cyan

# Lista de archivos y carpetas a incluir
$items = Get-ChildItem -Path . -Exclude "node_modules","dist",".git","*.log",".DS_Store","*.tar","*.zip","crear-tar.sh","crear-tar.ps1"

# Crear el archivo tar
tar -cvf $OUTPUT_FILE $items.Name

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Archivo creado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Archivo: $OUTPUT_FILE" -ForegroundColor Cyan
    Write-Host "📏 Tamaño: $((Get-Item $OUTPUT_FILE).Length / 1MB) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Para extraer el archivo:" -ForegroundColor Yellow
    Write-Host "   tar -xvf $OUTPUT_FILE" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Para ejecutar el proyecto:" -ForegroundColor Yellow
    Write-Host "   cd nexo-web-chat" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "📤 Para subir a GitHub:" -ForegroundColor Yellow
    Write-Host "   git init" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor White
    Write-Host "   git commit -m 'Initial commit: Nexo Web Chat v2.2'" -ForegroundColor White
    Write-Host "   git remote add origin TU_URL_DE_GITHUB" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Error al crear el archivo .tar" -ForegroundColor Red
    exit 1
}
