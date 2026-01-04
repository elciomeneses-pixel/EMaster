
import React from 'react';
import { Home, Users, History, Salad, Activity } from 'lucide-react';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  setActivePage: (page: Page) => void;
  activeProfileName?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage, activeProfileName }) => {
  const navItems = [
    { id: 'home', icon: Activity, label: 'Analisar' },
    { id: 'diet-plan', icon: Salad, label: 'Dieta' },
    { id: 'history', icon: History, label: 'Histórico' },
    { id: 'profiles', icon: Users, label: 'Perfis' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-emerald-950/20 shadow-2xl overflow-hidden relative border-x border-white/5">
      {/* Header */}
      <header className="glass p-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center emerald-glow">
            <Salad size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">FitVision <span className="text-emerald-400">2.0</span></h1>
        </div>
        {activeProfileName && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-2">
            <Users size={14} className="text-emerald-400" />
            <span className="text-xs font-medium text-emerald-100">{activeProfileName}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="glass fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[calc(512px-2rem)] rounded-2xl p-2 flex justify-around items-center border border-white/10 shadow-xl z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id as Page)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activePage === item.id 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' 
              : 'text-white/40 hover:text-white/70'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
