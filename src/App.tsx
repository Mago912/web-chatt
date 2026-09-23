import { useState } from 'react';
import './index.css';

// ==========================================
// TIPOS
// ==========================================
type View = 'dashboard' | 'chat' | 'customers' | 'orders' | 'users' | 'escalations' | 'knowledge' | 'quick-replies' | 'metrics' | 'quality' | 'organigrama';

interface Customer {
  id: number;
  name: string;
  dni: string;
  email: string;
  phone: string;
  total_conversations?: number;
  total_orders?: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name?: string;
  product: string;
  amount: number;
  payment_method: string;
  delivery_method: string;
  estimated_delivery: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
  status: string;
  active: boolean;
}

// ==========================================
// DATA MOCK (Simula MySQL)
// ==========================================
const [customersData, setCustomersData] = useState<Customer[]>([
  { id: 1, name: 'María González', dni: '32456789', email: 'maria.gonzalez@gmail.com', phone: '+54 11 5542-8891', total_conversations: 3, total_orders: 2 },
  { id: 2, name: 'Carlos Rodríguez', dni: '28901234', email: 'c.rodriguez@outlook.com', phone: '+54 11 4421-3356', total_conversations: 1, total_orders: 1 },
  { id: 3, name: 'Lucía Fernández', dni: '35678432', email: 'lucia.fernandez@yahoo.com', phone: '+54 11 6678-1122', total_conversations: 0, total_orders: 0 },
  { id: 4, name: 'Roberto Martínez', dni: '24112567', email: 'r.martinez@gmail.com', phone: '+54 11 3345-7788', total_conversations: 2, total_orders: 1 },
  { id: 5, name: 'Ana López', dni: '30234890', email: 'ana.lopez@hotmail.com', phone: '+54 11 5567-9900', total_conversations: 1, total_orders: 1 },
]);

const [ordersData, setOrdersData] = useState<Order[]>([
  { id: 1, order_number: '10452', customer_id: 1, customer_name: 'María González', product: 'Smart TV Samsung 50"', amount: 489999, payment_method: 'Tarjeta Crédito', delivery_method: 'Entrega a domicilio', estimated_delivery: '2025-01-17', status: 'shipping' },
  { id: 2, order_number: '10389', customer_id: 2, customer_name: 'Carlos Rodríguez', product: 'Notebook Lenovo IdeaPad 3', amount: 749999, payment_method: 'Mercado Pago', delivery_method: 'Retiro en sucursal', estimated_delivery: '2025-01-12', status: 'preparing' },
  { id: 3, order_number: '10501', customer_id: 3, customer_name: 'Lucía Fernández', product: 'Heladera Whirlpool', amount: 1299000, payment_method: 'Tarjeta Débito', delivery_method: 'Entrega a domicilio', estimated_delivery: '2025-01-22', status: 'preparing' },
  { id: 4, order_number: '10298', customer_id: 5, customer_name: 'Ana López', product: 'Aire Acondicionado Samsung', amount: 899999, payment_method: 'Tarjeta Crédito', delivery_method: 'Entrega + Instalación', estimated_delivery: '2025-01-10', status: 'delivered' },
  { id: 5, order_number: '10445', customer_id: 4, customer_name: 'Roberto Martínez', product: 'Lavarropas Drean Next', amount: 599999, payment_method: 'Mercado Pago', delivery_method: 'Entrega a domicilio', estimated_delivery: '2025-01-14', status: 'delayed' },
]);

const [usersData, setUsersData] = useState<User[]>([
  { id: 1, name: 'Admin Sistema', email: 'admin@fravega.com', rol: 'admin', status: 'available', active: true },
  { id: 2, name: 'Nicolás Romero', email: 'nicolas.romero@fravega.com', rol: 'supervisor', status: 'available', active: true },
  { id: 3, name: 'Sofía Ríos', email: 'sofia.rios@fravega.com', rol: 'agent', status: 'available', active: true },
  { id: 4, name: 'Martín Pereyra', email: 'martin.pereyra@fravega.com', rol: 'agent', status: 'busy', active: true },
  { id: 5, name: 'Valentina Torres', email: 'valentina.torres@fravega.com', rol: 'agent', status: 'available', active: true },
  { id: 6, name: 'Diego Álvarez', email: 'diego.alvarez@fravega.com', rol: 'agent', status: 'break', active: true },
  { id: 7, name: 'Camila Sánchez', email: 'camila.sanchez@fravega.com', rol: 'agent', status: 'offline', active: false },
]);

// ==========================================
// APP COMPONENT
// ==========================================
function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [modalResource, setModalResource] = useState<'customer' | 'order' | 'user'>('customer');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // CRUD Handlers
  const handleCreate = (resource: 'customer' | 'order' | 'user') => {
    setModalResource(resource);
    setModalType('create');
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (resource: 'customer' | 'order' | 'user', item: any) => {
    setModalResource(resource);
    setModalType('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = (resource: 'customer' | 'order' | 'user', item: any) => {
    setModalResource(resource);
    setModalType('delete');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSave = (data: any) => {
    if (modalType === 'create') {
      if (modalResource === 'customer') {
        const newId = Math.max(...customersData.map(c => c.id)) + 1;
        setCustomersData([...customersData, { ...data, id: newId, total_conversations: 0, total_orders: 0 }]);
      } else if (modalResource === 'order') {
        const newId = Math.max(...ordersData.map(o => o.id)) + 1;
        setOrdersData([...ordersData, { ...data, id: newId }]);
      } else if (modalResource === 'user') {
        const newId = Math.max(...usersData.map(u => u.id)) + 1;
        setUsersData([...usersData, { ...data, id: newId, active: true }]);
      }
    } else if (modalType === 'edit') {
      if (modalResource === 'customer') {
        setCustomersData(customersData.map(c => c.id === selectedItem.id ? { ...c, ...data } : c));
      } else if (modalResource === 'order') {
        setOrdersData(ordersData.map(o => o.id === selectedItem.id ? { ...o, ...data } : o));
      } else if (modalResource === 'user') {
        setUsersData(usersData.map(u => u.id === selectedItem.id ? { ...u, ...data } : u));
      }
    } else if (modalType === 'delete') {
      if (modalResource === 'customer') {
        setCustomersData(customersData.filter(c => c.id !== selectedItem.id));
      } else if (modalResource === 'order') {
        setOrdersData(ordersData.filter(o => o.id !== selectedItem.id));
      } else if (modalResource === 'user') {
        setUsersData(usersData.map(u => u.id === selectedItem.id ? { ...u, active: false } : u));
      }
    }
    setShowModal(false);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">N</div>
            <div className="brand-text">
              <h1>Nexo Web Chat</h1>
              <p>Frávega · Atención Digital</p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Principal</div>
            <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>
              <span className="nav-icon">📊</span><span>Dashboard</span>
            </button>
            <button className={`nav-item ${currentView === 'chat' ? 'active' : ''}`} onClick={() => setCurrentView('chat')}>
              <span className="nav-icon">💬</span><span>Bandeja de Chats</span>
            </button>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Gestión</div>
            <button className={`nav-item ${currentView === 'customers' ? 'active' : ''}`} onClick={() => setCurrentView('customers')}>
              <span className="nav-icon">👥</span><span>Clientes</span>
            </button>
            <button className={`nav-item ${currentView === 'orders' ? 'active' : ''}`} onClick={() => setCurrentView('orders')}>
              <span className="nav-icon">📦</span><span>Pedidos</span>
            </button>
            <button className={`nav-item ${currentView === 'users' ? 'active' : ''}`} onClick={() => setCurrentView('users')}>
              <span className="nav-icon">👤</span><span>Usuarios</span>
            </button>
            <button className={`nav-item ${currentView === 'escalations' ? 'active' : ''}`} onClick={() => setCurrentView('escalations')}>
              <span className="nav-icon">📋</span><span>Escalaciones</span>
            </button>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Herramientas</div>
            <button className={`nav-item ${currentView === 'knowledge' ? 'active' : ''}`} onClick={() => setCurrentView('knowledge')}>
              <span className="nav-icon">📚</span><span>Base de Conocimiento</span>
            </button>
            <button className={`nav-item ${currentView === 'quick-replies' ? 'active' : ''}`} onClick={() => setCurrentView('quick-replies')}>
              <span className="nav-icon">⚡</span><span>Respuestas Rápidas</span>
            </button>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Análisis</div>
            <button className={`nav-item ${currentView === 'metrics' ? 'active' : ''}`} onClick={() => setCurrentView('metrics')}>
              <span className="nav-icon">📈</span><span>Métricas</span>
            </button>
            <button className={`nav-item ${currentView === 'quality' ? 'active' : ''}`} onClick={() => setCurrentView('quality')}>
              <span className="nav-icon">✅</span><span>Calidad</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">
              {currentView === 'dashboard' ? 'Dashboard' :
               currentView === 'chat' ? 'Bandeja de Chats' :
               currentView === 'customers' ? 'Gestión de Clientes' :
               currentView === 'orders' ? 'Gestión de Pedidos' :
               currentView === 'users' ? 'Gestión de Usuarios' :
               currentView === 'escalations' ? 'Escalaciones' :
               currentView === 'knowledge' ? 'Base de Conocimiento' :
               currentView === 'quick-replies' ? 'Respuestas Rápidas' :
               currentView === 'metrics' ? 'Métricas' :
               currentView === 'quality' ? 'Calidad' : 'Organigrama'}
            </div>
          </div>
        </div>

        <div className="content">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'customers' && <CustomersView customers={customersData} onCreate={() => handleCreate('customer')} onEdit={(item: Customer) => handleEdit('customer', item)} onDelete={(item: Customer) => handleDelete('customer', item)} />}
          {currentView === 'orders' && <OrdersView orders={ordersData} customers={customersData} onCreate={() => handleCreate('order')} onEdit={(item: Order) => handleEdit('order', item)} onDelete={(item: Order) => handleDelete('order', item)} />}
          {currentView === 'users' && <UsersView users={usersData} onCreate={() => handleCreate('user')} onEdit={(item: User) => handleEdit('user', item)} onDelete={(item: User) => handleDelete('user', item)} />}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <Modal
          type={modalType}
          resource={modalResource}
          item={selectedItem}
          customers={customersData}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ==========================================
// VIEWS
// ==========================================
function DashboardView() {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Resumen en tiempo real</p>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-top"><span className="kpi-label">En Atención</span><div className="kpi-icon-wrap blue">💬</div></div>
          <div className="kpi-value">5</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top"><span className="kpi-label">1ra Respuesta</span><div className="kpi-icon-wrap green">⚡</div></div>
          <div className="kpi-value">1m 42s</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-top"><span className="kpi-label">Satisfacción</span><div className="kpi-icon-wrap purple">⭐</div></div>
          <div className="kpi-value">4.7/5</div>
        </div>
      </div>
    </div>
  );
}

function CustomersView({ customers, onCreate, onEdit, onDelete }: any) {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Clientes</h2>
        <button className="btn btn-primary" onClick={onCreate}>+ Nuevo Cliente</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Conversaciones</th>
              <th>Pedidos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c: Customer) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.dni}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.total_conversations}</td>
                <td>{c.total_orders}</td>
                <td>
                  <button className="btn-icon" onClick={() => onEdit(c)} title="Editar">✏️</button>
                  <button className="btn-icon" onClick={() => onDelete(c)} title="Eliminar">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersView({ orders, customers, onCreate, onEdit, onDelete }: any) {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Pedidos</h2>
        <button className="btn btn-primary" onClick={onCreate}>+ Nuevo Pedido</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>N° Pedido</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: Order) => (
              <tr key={o.id}>
                <td>#{o.order_number}</td>
                <td>{o.customer_name}</td>
                <td>{o.product}</td>
                <td>${o.amount.toLocaleString()}</td>
                <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                <td>{o.estimated_delivery}</td>
                <td>
                  <button className="btn-icon" onClick={() => onEdit(o)} title="Editar">✏️</button>
                  <button className="btn-icon" onClick={() => onDelete(o)} title="Eliminar">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersView({ users, onCreate, onEdit, onDelete }: any) {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Usuarios</h2>
        <button className="btn btn-primary" onClick={onCreate}>+ Nuevo Usuario</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: User) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge">{u.rol}</span></td>
                <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                <td>{u.active ? '✅' : '❌'}</td>
                <td>
                  <button className="btn-icon" onClick={() => onEdit(u)} title="Editar">✏️</button>
                  <button className="btn-icon" onClick={() => onDelete(u)} title="Eliminar">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// MODAL COMPONENT
// ==========================================
function Modal({ type, resource, item, customers, onSave, onClose }: any) {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const title = type === 'create' ? `Crear ${resource}` : type === 'edit' ? `Editar ${resource}` : `Eliminar ${resource}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        {type === 'delete' ? (
          <div className="modal-body">
            <p>¿Estás seguro de que deseas eliminar este {resource}?</p>
            <p className="text-danger">Esta acción no se puede deshacer.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {resource === 'customer' && (
                <>
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>DNI *</label>
                    <input type="text" value={formData.dni || ''} onChange={e => setFormData({...formData, dni: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </>
              )}
              {resource === 'order' && (
                <>
                  <div className="form-group">
                    <label>N° Pedido *</label>
                    <input type="text" value={formData.order_number || ''} onChange={e => setFormData({...formData, order_number: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Cliente *</label>
                    <select value={formData.customer_id || ''} onChange={e => setFormData({...formData, customer_id: parseInt(e.target.value)})} required>
                      <option value="">Seleccionar cliente</option>
                      {customers.map((c: Customer) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Producto *</label>
                    <input type="text" value={formData.product || ''} onChange={e => setFormData({...formData, product: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Monto *</label>
                    <input type="number" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} required />
                  </div>
                  <div className="form-group">
                    <label>Método de Pago</label>
                    <input type="text" value={formData.payment_method || ''} onChange={e => setFormData({...formData, payment_method: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Método de Entrega</label>
                    <input type="text" value={formData.delivery_method || ''} onChange={e => setFormData({...formData, delivery_method: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Fecha Estimada</label>
                    <input type="date" value={formData.estimated_delivery || ''} onChange={e => setFormData({...formData, estimated_delivery: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select value={formData.status || 'preparing'} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="preparing">Preparando</option>
                      <option value="shipping">Enviando</option>
                      <option value="delivered">Entregado</option>
                      <option value="delayed">Demorado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </>
              )}
              {resource === 'user' && (
                <>
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Contraseña {type === 'edit' ? '(dejar vacío para no cambiar)' : '*'}</label>
                    <input type="password" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} required={type === 'create'} />
                  </div>
                  <div className="form-group">
                    <label>Rol *</label>
                    <select value={formData.rol || 'agent'} onChange={e => setFormData({...formData, rol: e.target.value})} required>
                      <option value="admin">Administrador</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="agent">Agente</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select value={formData.status || 'available'} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="available">Disponible</option>
                      <option value="busy">Ocupado</option>
                      <option value="break">En pausa</option>
                      <option value="offline">Desconectado</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{type === 'create' ? 'Crear' : 'Guardar'}</button>
            </div>
          </form>
        )}
        
        {type === 'delete' && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-danger" onClick={() => onSave(item)}>Eliminar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
