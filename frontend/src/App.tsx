import { useState } from 'react';
import { AppLayout } from './layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Inference } from './pages/Inference';
import { Dataset } from './pages/Dataset';
import { Models } from './pages/Models';
import { Logs } from './pages/Logs';
import { Settings } from './pages/Settings';

export type AppPage =
  | 'dashboard'
  | 'inference'
  | 'dataset'
  | 'models'
  | 'logs'
  | 'settings';

function App() {
  const [activePage, setActivePage] = useState<AppPage>('dashboard');
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inference':
        return <Inference />;
      case 'dataset':
        return <Dataset />;
      case 'models':
        return <Models />;
      case 'logs':
        return <Logs />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <AppLayout
      activePage={activePage}
      onPageChange={setActivePage}
      isDark={isDark}
      onToggleTheme={toggleTheme}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
