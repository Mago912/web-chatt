import { useState } from 'react';
import { conversaciones as initialConversaciones, respuestasRapidas, baseConocimiento, Conversacion, Mensaje } from '../data/mockData';

type FilterType = 'todos' | 'esperando' | 'activos' | 'resueltos';

export default function ChatInbox() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>(initialConversaciones);
  const [selectedChat, setSelectedChat] = useState<Conversacion | null>(initialConversaciones[0]);
  const [filter, setFilter] = useState<FilterType>('todos');
  const [messageInput, setMessageInput] = useState('');
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [showKB, setShowKB] = useState(false);
  const [kbSearch, setKbSearch] = useState('');

  const filteredChats = conversaciones.filter(c => {
    if (filter === 'todos') return true;
    if (filter === 'esperando') return c.estado === 'esperando';
    if (filter === 'activos') return c.estado === 'activo';
    if (filter === 'resueltos') return c.estado === 'resuelto';
    return true;
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const newMessage: Mensaje = {
      id: Date.now(),
      conversacionId: selectedChat.id,
      tipoEmisor: 'agente',
      emisorNombre: 'Sofía Ríos',
      mensaje: messageInput,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedConversaciones = conversaciones.map(c => 
      c.id === selectedChat.id 
        ? { ...c, mensajes: [...c.mensajes, newMessage], ultimoMensaje: messageInput, estado: 'activo' as const }
        : c
    );

    setConversaciones(updatedConversaciones);
    setSelectedChat({ ...selectedChat, mensajes: [...selectedChat.mensajes, newMessage], ultimoMensaje: messageInput });
    setMessageInput('');
  };

  const handleQuickResponse = (content: string) => {
    setMessageInput(content);
    setShowQuickResponses(false);
  };

  const handleTakeChat = (chat: Conversacion) => {
    const updated = conversaciones.map(c => 
      c.id === chat.id ? { ...c, estado: 'activo' as const, asignadoA: 'Sofía Ríos' } : c
    );
    setConversaciones(updated);
    setSelectedChat({ ...chat, estado: 'activo', asignadoA: 'Sofía Ríos' });
  };

  const handleResolveChat = () => {
    if (!selectedChat) return;
    const updated = conversaciones.map(c => 
      c.id === selectedChat.id ? { ...c, estado: 'resuelto' as const } : c
    );
    setConversaciones(updated);
    setSelectedChat({ ...selectedChat, estado: 'resuelto' });
  };

  const filteredKB = baseConocimiento.filter(a => 
    a.titulo.toLowerCase().includes(kbSearch.toLowerCase()) ||
    a.categoria.toLowerCase().includes(kbSearch.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'esperando': return 'bg-orange-100 text-orange-700';
      case 'activo': return 'bg-green-100 text-green-700';
      case 'resuelto': return 'bg-blue-100 text-blue-700';
      case 'cerrado': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'esperando': return 'Esperando';
      case 'activo': return 'En atención';
      case 'resuelto': return 'Resuelto';
      case 'cerrado': return 'Cerrado';
      default: return estado;
    }
  };

  const getLogisticBadge = (estado: string) => {
    switch (estado) {
      case 'en_preparacion': return { label: 'En preparación', color: 'bg-yellow-100 text-yellow-700' };
      case 'en_distribucion': return { label: 'En distribución', color: 'bg-blue-100 text-blue-700' };
      case 'entregado': return { label: 'Entregado', color: 'bg-green-100 text-green-700' };
      case 'demorado': return { label: 'Demorado', color: 'bg-red-100 text-red-700' };
      default: return { label: estado, color: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="flex h-full">
      {/* Panel 1: Cola de conversaciones */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-[#142e4f]">Bandeja de Chats</h2>
          <p className="text-xs text-gray-400 mt-0.5">{filteredChats.length} conversaciones</p>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex gap-1">
            {(['todos', 'esperando', 'activos', 'resueltos'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  filter === f
                    ? 'bg-[#2064d8] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'todos' ? 'Todos' : f === 'esperando' ? 'Esperando' : f === 'activos' ? 'Activos' : 'Resueltos'}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-3 border-b border-gray-50 text-left transition-colors ${
                selectedChat?.id === chat.id ? 'bg-blue-50 border-l-2 border-l-[#2064d8]' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#2064d8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {chat.cliente.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#142e4f] truncate">{chat.cliente.nombre}</p>
                    <span className="text-[10px] text-gray-400">{chat.inicioConversacion}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{chat.ultimoMensaje}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getEstadoBadge(chat.estado)}`}>
                      {getEstadoLabel(chat.estado)}
                    </span>
                    {chat.estado === 'esperando' && (
                      <span className="text-[10px] text-orange-600 font-medium">
                        <i className="fas fa-clock mr-0.5"></i>{chat.tiempoEspera}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 truncate">{chat.motivo}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel 2: Sala de Chat */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2064d8] flex items-center justify-center text-white text-sm font-bold">
                  {selectedChat.cliente.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-[#142e4f]">{selectedChat.cliente.nombre}</h3>
                  <p className="text-xs text-gray-400">{selectedChat.motivo} · {selectedChat.cliente.dni}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEstadoBadge(selectedChat.estado)}`}>
                  {getEstadoLabel(selectedChat.estado)}
                </span>
                {selectedChat.estado === 'esperando' && (
                  <button
                    onClick={() => handleTakeChat(selectedChat)}
                    className="px-3 py-1.5 bg-[#2064d8] text-white text-xs rounded-lg hover:bg-[#1855b8] transition-colors"
                  >
                    <i className="fas fa-hand mr-1"></i>Tomar chat
                  </button>
                )}
                {selectedChat.estado === 'activo' && (
                  <button
                    onClick={handleResolveChat}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <i className="fas fa-check mr-1"></i>Resolver
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
              {selectedChat.mensajes.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-3">
              {/* Quick actions bar */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => { setShowQuickResponses(!showQuickResponses); setShowKB(false); }}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    showQuickResponses ? 'bg-[#2064d8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <i className="fas fa-bolt"></i>
                  <span>Respuestas rápidas</span>
                </button>
                <button
                  onClick={() => { setShowKB(!showKB); setShowQuickResponses(false); }}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    showKB ? 'bg-[#2064d8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <i className="fas fa-book"></i>
                  <span>Knowledge Base</span>
                </button>
                <button className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ml-auto">
                  <i className="fas fa-paperclip"></i>
                  <span>Adjuntar</span>
                </button>
              </div>

              {/* Quick responses dropdown */}
              {showQuickResponses && (
                <div className="mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {respuestasRapidas.map(rr => (
                    <button
                      key={rr.id}
                      onClick={() => handleQuickResponse(rr.contenido)}
                      className="w-full p-2.5 text-left hover:bg-blue-50 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{rr.atajo}</span>
                        <span className="text-xs font-medium text-[#142e4f]">{rr.titulo}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{rr.contenido}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* KB dropdown */}
              {showKB && (
                <div className="mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-h-48 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Buscar artículo..."
                    value={kbSearch}
                    onChange={(e) => setKbSearch(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-[#2064d8]"
                  />
                  {filteredKB.map(art => (
                    <div key={art.id} className="p-2 hover:bg-blue-50 rounded cursor-pointer border-b border-gray-50 last:border-0">
                      <p className="text-xs font-medium text-[#142e4f]">{art.titulo}</p>
                      <p className="text-[10px] text-gray-400">{art.categoria}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Message input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribí tu respuesta..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2064d8] focus:ring-1 focus:ring-[#2064d8]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="w-10 h-10 bg-[#2064d8] text-white rounded-xl hover:bg-[#1855b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <i className="fas fa-paper-plane text-sm"></i>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-comments text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-400">Seleccioná un chat para comenzar</p>
            </div>
          </div>
        )}
      </div>

      {/* Panel 3: Contexto 360 del Cliente */}
      {selectedChat && (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col flex-shrink-0 overflow-y-auto">
          {/* Client Profile */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-[#142e4f] text-sm mb-3">Perfil del Cliente</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#2064d8] flex items-center justify-center text-white font-bold">
                {selectedChat.cliente.avatar}
              </div>
              <div>
                <p className="font-semibold text-[#142e4f] text-sm">{selectedChat.cliente.nombre}</p>
                <p className="text-xs text-gray-400">Cliente desde {selectedChat.cliente.clienteDesde}</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <i className="fas fa-envelope w-4 text-gray-400"></i>
                <span className="truncate">{selectedChat.cliente.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <i className="fas fa-phone w-4 text-gray-400"></i>
                <span>{selectedChat.cliente.telefono}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <i className="fas fa-id-card w-4 text-gray-400"></i>
                <span>DNI: {selectedChat.cliente.dni}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-[#2064d8]">{selectedChat.cliente.pedidosTotales}</p>
                <p className="text-[10px] text-gray-500">Pedidos</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-orange-600">{selectedChat.cliente.casosTotales}</p>
                <p className="text-[10px] text-gray-500">Casos previos</p>
              </div>
            </div>
          </div>

          {/* Order Card */}
          {selectedChat.pedido && (
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-semibold text-[#142e4f] text-xs mb-2 uppercase tracking-wide">Pedido en consulta</h4>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#142e4f]">{selectedChat.pedido.numeroPedido}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getLogisticBadge(selectedChat.pedido.estadoLogistico).color}`}>
                    {getLogisticBadge(selectedChat.pedido.estadoLogistico).label}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{selectedChat.pedido.productoResumen}</p>
                <div className="space-y-1 text-[11px] text-gray-500">
                  <div className="flex justify-between">
                    <span>Monto:</span>
                    <span className="font-medium text-[#142e4f]">${selectedChat.pedido.monto.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega:</span>
                    <span>{selectedChat.pedido.metodoEntrega}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha estimada:</span>
                    <span>{selectedChat.pedido.fechaEstimada}</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span>Preparando</span>
                    <span>En camino</span>
                    <span>Entregado</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        selectedChat.pedido.estadoLogistico === 'entregado' ? 'w-full bg-green-500' :
                        selectedChat.pedido.estadoLogistico === 'en_distribucion' ? 'w-2/3 bg-blue-500' :
                        selectedChat.pedido.estadoLogistico === 'demorado' ? 'w-1/2 bg-red-500' :
                        'w-1/3 bg-yellow-500'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Motivo de contacto */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-semibold text-[#142e4f] text-xs mb-2 uppercase tracking-wide">Motivo de contacto</h4>
            <div className="flex items-center gap-2">
              <i className="fas fa-tag text-[#2064d8] text-xs"></i>
              <span className="text-xs text-gray-600">{selectedChat.motivo}</span>
            </div>
          </div>

          {/* Related KB Articles */}
          <div className="p-4">
            <h4 className="font-semibold text-[#142e4f] text-xs mb-2 uppercase tracking-wide">Artículos relacionados</h4>
            <div className="space-y-2">
              {baseConocimiento.slice(0, 3).map(art => (
                <div key={art.id} className="p-2 rounded-lg border border-gray-100 hover:border-[#2064d8] hover:bg-blue-50 cursor-pointer transition-colors">
                  <p className="text-xs font-medium text-[#142e4f]">{art.titulo}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{art.categoria}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Mensaje }) {
  if (message.tipoEmisor === 'sistema') {
    return (
      <div className="flex justify-center">
        <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {message.mensaje}
        </span>
      </div>
    );
  }

  if (message.tipoEmisor === 'bot') {
    return (
      <div className="flex justify-start">
        <div className="max-w-[75%]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
              <i className="fas fa-robot text-purple-500 text-[8px]"></i>
            </div>
            <span className="text-[10px] text-gray-400">{message.emisorNombre} · {message.timestamp}</span>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl rounded-tl-md px-3 py-2">
            <p className="text-xs text-gray-700">{message.mensaje}</p>
          </div>
        </div>
      </div>
    );
  }

  if (message.tipoEmisor === 'cliente') {
    return (
      <div className="flex justify-start">
        <div className="max-w-[75%]">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] text-gray-400">{message.emisorNombre} · {message.timestamp}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-3 py-2 shadow-sm">
            <p className="text-xs text-gray-800">{message.mensaje}</p>
          </div>
        </div>
      </div>
    );
  }

  // Agente
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%]">
        <div className="flex items-center gap-1.5 mb-1 justify-end">
          <span className="text-[10px] text-gray-400">{message.timestamp}</span>
        </div>
        <div className="bg-[#2064d8] rounded-2xl rounded-tr-md px-3 py-2">
          <p className="text-xs text-white">{message.mensaje}</p>
        </div>
      </div>
    </div>
  );
}
