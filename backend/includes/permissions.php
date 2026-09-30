<?php
/**
 * ============================================
 * SISTEMA DE PERMISOS POR ROL
 * ============================================
 */

/**
 * Matriz de permisos por rol
 */
function getPermisos() {
    return [
        'admin' => [
            'dashboard' => true,
            'conversations.view_all' => true,
            'conversations.take' => false,
            'conversations.respond' => false,
            'conversations.close' => true,
            'customers.view' => true,
            'customers.edit' => true,
            'orders.view' => true,
            'knowledge.read' => true,
            'knowledge.write' => true,
            'quick_replies.read' => true,
            'quick_replies.write' => true,
            'escalations.create' => true,
            'escalations.resolve' => true,
            'metrics.view' => true,
            'quality.review' => true,
            'users.manage' => true,
            'settings.manage' => true
        ],
        'supervisor' => [
            'dashboard' => true,
            'conversations.view_all' => true,
            'conversations.take' => false,
            'conversations.respond' => false,
            'conversations.close' => true,
            'customers.view' => true,
            'customers.edit' => false,
            'orders.view' => true,
            'knowledge.read' => true,
            'knowledge.write' => false,
            'quick_replies.read' => true,
            'quick_replies.write' => false,
            'escalations.create' => true,
            'escalations.resolve' => true,
            'metrics.view' => true,
            'quality.review' => true,
            'users.manage' => false,
            'settings.manage' => false
        ],
        'agent' => [
            'dashboard' => true,
            'conversations.view_all' => false,
            'conversations.take' => true,
            'conversations.respond' => true,
            'conversations.close' => true,
            'customers.view' => true,
            'customers.edit' => false,
            'orders.view' => true,
            'knowledge.read' => true,
            'knowledge.write' => false,
            'quick_replies.read' => true,
            'quick_replies.write' => false,
            'escalations.create' => true,
            'escalations.resolve' => false,
            'metrics.view' => false,
            'quality.review' => false,
            'users.manage' => false,
            'settings.manage' => false
        ]
    ];
}

/**
 * Verificar si el usuario tiene permiso
 */
function tienePermiso($permiso) {
    $usuario = getUsuarioActual();
    if (!$usuario) {
        return false;
    }
    
    $permisos = getPermisos();
    $rol = $usuario['rol'];
    
    if (!isset($permisos[$rol])) {
        return false;
    }
    
    return isset($permisos[$rol][$permiso]) && $permisos[$rol][$permiso] === true;
}

/**
 * Requerir permiso (para APIs)
 */
function requerirPermiso($permiso) {
    requerirAutenticacion();
    
    if (!tienePermiso($permiso)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'No tienes permiso para realizar esta acción'
        ]);
        exit;
    }
}

/**
 * Obtener permisos del usuario actual
 */
function getPermisosUsuario() {
    $usuario = getUsuarioActual();
    if (!$usuario) {
        return [];
    }
    
    $permisos = getPermisos();
    $rol = $usuario['rol'];
    
    return isset($permisos[$rol]) ? $permisos[$rol] : [];
}
?>
