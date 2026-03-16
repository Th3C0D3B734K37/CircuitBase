'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import DatabaseTab from './DatabaseTab';
import InventoryTab from './InventoryTab';
import BomTab from './BomTab';
import KitTab from './KitTab';
import Footer from './Footer';
import { Search, Database, Package, FileText, Zap, Moon, Sun, Terminal, ArrowUp } from 'lucide-react';
import CommandPalette from './CommandPalette';
import ComponentDetailModal from './ComponentDetailModal';

export default function MainApp() {
  const { theme, toggleTheme, showToast, projects } = useAppContext();
  const [activeTab, setActiveTab] = useState('db');
  const [cmdOpen, setCmdOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load last active tab from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cb_active_tab');
    if (saved && ['db', 'inv', 'bom', 'kit'].includes(saved)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(saved);
    }
  }, []);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('cb_active_tab', activeTab);
  }, [activeTab]);

  // Scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === '/') {
        // Only if not typing in an input
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setCmdOpen(true);
        }
      }

      // Tab switching shortcuts
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        if (e.key === 'd') setActiveTab('db');
        if (e.key === 'i') setActiveTab('inv');
        if (e.key === 'b') setActiveTab('bom');
        if (e.key === 'k') setActiveTab('kit');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const missingBomItems = projects.reduce((sum, p) => sum + p.items.filter(i => i.status === 'need').length, 0);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-zinc-300' : 'bg-zinc-50 text-zinc-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b flex items-center justify-between px-4 py-3 md:px-6 md:py-4 ${theme === 'dark' ? 'bg-[#0a0a0a]/90 border-zinc-800 backdrop-blur-md' : 'bg-white/90 border-zinc-200 backdrop-blur-md'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-black font-bold font-mono">CB</div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">CircuitBase</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-semibold">Component Database</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setCmdOpen(true)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 text-xs border rounded-md transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500' : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:border-amber-500'}`}
          >
            <Search size={14} />
            <span>Search...</span>
            <kbd className="ml-2 text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Ctrl K</kbd>
          </button>

          <button onClick={toggleTheme} className={`p-2 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-200 text-zinc-600'}`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`border-b overflow-x-auto ${theme === 'dark' ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-100'}`}>
        <div className="flex px-4 md:px-6 w-full">
          <NavButton active={activeTab === 'db'} onClick={() => setActiveTab('db')} icon={<Database size={14} />} label="Database" shortcut="D" theme={theme} />
          <NavButton active={activeTab === 'inv'} onClick={() => setActiveTab('inv')} icon={<Package size={14} />} label="Inventory" shortcut="I" theme={theme} />
          <NavButton active={activeTab === 'bom'} onClick={() => setActiveTab('bom')} icon={<FileText size={14} />} label="BOM Builder" shortcut="B" theme={theme} badge={missingBomItems > 0 ? missingBomItems : undefined} />
          <NavButton active={activeTab === 'kit'} onClick={() => setActiveTab('kit')} icon={<Zap size={14} />} label="Starter Kits" shortcut="K" theme={theme} />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'db' && <DatabaseTab />}
          {activeTab === 'inv' && <InventoryTab />}
          {activeTab === 'bom' && <BomTab />}
          {activeTab === 'kit' && <KitTab />}
        </div>
      </main>

      {/* Command Palette */}
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} onNavigate={setActiveTab} />}

      {/* Component Detail Modal */}
      <ComponentDetailModal />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed right-4 bottom-20 z-40 p-3 rounded-full shadow-lg transition-all hover:scale-110 ${theme === 'dark' ? 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'}`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

function NavButton({ active, onClick, icon, label, shortcut, theme, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, shortcut: string, theme: string, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-2 md:px-4 py-3 text-[10px] md:text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors relative ${
        active 
          ? 'border-amber-500 text-amber-500' 
          : `${theme === 'dark' ? 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'}`
      }`}
    >
      {icon}
      <span className="hidden sm:inline-block">{label}</span>
      <span className={`hidden md:inline-block text-[9px] font-mono px-1.5 py-0.5 ml-1 rounded ${active ? 'bg-amber-500/20 text-amber-500' : (theme === 'dark' ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500')}`}>{shortcut}</span>
      {badge !== undefined && (
        <span className="absolute top-1.5 right-1.5 md:right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">{badge}</span>
      )}
    </button>
  );
}
