#!/bin/bash

# ==========================================
# NEXO WEB CHAT - SCRIPT DE DEPLOYMENT
# ==========================================

echo "🚀 Nexo Web Chat - Deployment Script"
echo "===================================="
echo ""

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado"
    echo ""
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
    echo ""
fi

# Verificar que estemos logueados en Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Iniciando sesión en Vercel..."
    vercel login
    echo ""
fi

# Compilar el proyecto
echo "🔨 Compilando el proyecto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al compilar el proyecto"
    exit 1
fi

echo "✅ Proyecto compilado exitosamente"
echo ""

# Deploy a Vercel
echo "🚀 Desplegando a Vercel..."
echo ""

# Preguntar si es production o preview
read -p "¿Deploy a producción? (s/n): " is_production

if [ "$is_production" = "s" ] || [ "$is_production" = "S" ]; then
    echo "📦 Deployando a PRODUCCIÓN..."
    vercel --prod
else
    echo "📦 Deployando a PREVIEW..."
    vercel
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Deploy exitoso!"
    echo ""
    echo "🌐 Tu aplicación está disponible en:"
    vercel ls
    echo ""
    echo "📊 Para ver el dashboard:"
    echo "   https://vercel.com/dashboard"
    echo ""
else
    echo ""
    echo "❌ Error al deployar"
    exit 1
fi
