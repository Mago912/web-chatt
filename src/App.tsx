import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInbox from './components/ChatInbox';
import KnowledgeBase from './components/KnowledgeBase';
import QuickResponses from './components/QuickResponses';
import Metrics from './components/Metrics';
import Quality from './components/Quality';
import Organigrama from './components/Organigrama';
import Escalations from './components/Escalations';

export type ViewType = 'dashboard' | 'inbox' | 'chats' | 'cases' | 'clients' | 'knowledge' | 'escalations' | 'quick-responses' | 'quality' | 'metrics' | 'organigrama';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('inbox');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'inbox':
      case 'chats':
        return <ChatInbox />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'quick-responses':
        return <QuickResponses />;
      case 'metrics':
        return <Metrics />;
      case 'quality':
        return <Quality />;
      case 'organigrama':
        return <Organigrama />;
      case 'escalations':
        return <Escalations />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7fb] overflow-hidden">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
