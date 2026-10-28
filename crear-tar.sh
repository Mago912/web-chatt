#!/bin/bash

# ============================================
# Script para crear archivo .tar del proyecto
# Nexo Web Chat - Frávega
# ============================================

echo "📦 Creando archivo .tar del proyecto Nexo Web Chat..."
echo ""

# Nombre del archivo de salida
OUTPUT_FILE="nexo-web-chat-v2.2.tar"

# Excluir archivos y carpetas innecesarios
EXCLUDE_PATTERNS=(
    "node_modules"
    "dist"
    ".git"
    "*.log"
    ".DS_Store"
    "Thumbs.db"
    "*.tar"
    "*.zip"
)

# Construir comando de exclusión
EXCLUDE_CMD=""
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    EXCLUDE_CMD="$EXCLUDE_CMD --exclude='$pattern'"
done

# Crear el archivo .tar
echo "📁 Empaquetando archivos..."
tar -cvf "$OUTPUT_FILE" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='Thumbs.db' \
    --exclude='*.tar' \
    --exclude='*.zip' \
    .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Archivo creado exitosamente!"
    echo ""
    echo "📦 Archivo: $OUTPUT_FILE"
    echo "📏 Tamaño: $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo ""
    echo "📋 Para extraer el archivo:"
    echo "   tar -xvf $OUTPUT_FILE"
    echo ""
    echo "🚀 Para ejecutar el proyecto:"
    echo "   cd nexo-web-chat"
    echo "   npm install"
    echo "   npm run dev"
    echo ""
    echo "📤 Para subir a GitHub:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit: Nexo Web Chat v2.2'"
    echo "   git remote add origin TU_URL_DE_GITHUB"
    echo "   git push -u origin main"
    echo ""
else
    echo ""
    echo "❌ Error al crear el archivo .tar"
    exit 1
fi
