import { type FC } from 'react';

import { LayoutDashboard, History } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import SessionList from './pages/SessionList';

const navClass = (active: boolean) =>
  `flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${active ? 'text-primary-fixed' : 'text-on-surface-variant hover:text-white'}`;

const App: FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background font-body-md antialiased">
      <header className="bg-surface fixed top-0 w-full flex justify-between items-center px-8 h-14 z-50 border-b border-white/10">
        <div className="flex items-center gap-16">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tighter text-primary-fixed uppercase font-display"
          >
            LiftLog
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className={navClass(pathname === '/')}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link to="/sessions" className={navClass(pathname.startsWith('/sessions'))}>
              <History size={16} />
              Historie
            </Link>
          </nav>
        </div>
        <div className="w-9 h-9 rounded-full bg-surface-container-highest ring-1 ring-white/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary-fixed font-display">V</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full pt-16">
        <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sessions" element={<SessionList />} />
            <Route path="/session/:id" element={<SessionDetail />} />
          </Routes>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 px-6 py-4 flex justify-around items-center z-50">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/' ? 'text-primary-fixed' : 'text-on-surface-variant hover:text-white'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[9px] uppercase font-black tracking-widest">Domů</span>
        </Link>
        <Link
          to="/sessions"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname.startsWith('/sessions') ? 'text-primary-fixed' : 'text-on-surface-variant hover:text-white'}`}
        >
          <History size={24} />
          <span className="text-[9px] uppercase font-black tracking-widest">Historie</span>
        </Link>
      </nav>
    </div>
  );
};

export default App;
