'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryItem, Project, ComponentDef } from '@/lib/types';

interface AppState {
  inventory: InventoryItem[];
  projects: Project[];
  dbExtra: ComponentDef[];
  recentlyViewed: string[];
  theme: 'dark' | 'light';
  activeTab: string;
  selectedComponentId: string | null;
  setInventory: (items: InventoryItem[]) => void;
  setProjects: (projects: Project[]) => void;
  setDbExtra: (comps: ComponentDef[]) => void;
  setRecentlyViewed: (ids: string[]) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedComponentId: (id: string | null) => void;
  toastMsg: { msg: string; type: 'info' | 'success' | 'error' } | null;
  showToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventoryState] = useState<InventoryItem[]>([]);
  const [projects, setProjectsState] = useState<Project[]>([]);
  const [dbExtra, setDbExtraState] = useState<ComponentDef[]>([]);
  const [recentlyViewed, setRecentlyViewedState] = useState<string[]>([]);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTabState] = useState<string>('db');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const inv = localStorage.getItem('cb_inventory');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (inv) setInventoryState(JSON.parse(inv));
      const proj = localStorage.getItem('cb_projects');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (proj) setProjectsState(JSON.parse(proj));
      const db = localStorage.getItem('cb_db_extra');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (db) setDbExtraState(JSON.parse(db));
      const rv = localStorage.getItem('cb_rv');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (rv) setRecentlyViewedState(JSON.parse(rv));
      const th = localStorage.getItem('cb_theme');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (th === 'light' || th === 'dark') setThemeState(th);
      const tab = localStorage.getItem('cb_last_tab');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (tab) setActiveTabState(tab);
    } catch (e) {
      console.error('Failed to load state', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setInventory = (items: InventoryItem[]) => {
    setInventoryState(items);
    localStorage.setItem('cb_inventory', JSON.stringify(items));
  };

  const setProjects = (projs: Project[]) => {
    setProjectsState(projs);
    localStorage.setItem('cb_projects', JSON.stringify(projs));
  };

  const setDbExtra = (comps: ComponentDef[]) => {
    setDbExtraState(comps);
    localStorage.setItem('cb_db_extra', JSON.stringify(comps));
  };

  const setRecentlyViewed = (ids: string[]) => {
    setRecentlyViewedState(ids);
    localStorage.setItem('cb_rv', JSON.stringify(ids));
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('cb_theme', t);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const setActiveTab = (t: string) => {
    setActiveTabState(t);
    localStorage.setItem('cb_last_tab', t);
  };

  const showToast = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <AppContext.Provider
      value={{
        inventory, setInventory,
        projects, setProjects,
        dbExtra, setDbExtra,
        recentlyViewed, setRecentlyViewed,
        theme, setTheme, toggleTheme,
        activeTab, setActiveTab,
        selectedComponentId, setSelectedComponentId,
        toastMsg, showToast
      }}
    >
      {children}
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 text-xs z-50 transition-all shadow-lg border-l-4 ${
          toastMsg.type === 'success' ? 'border-green-500 bg-zinc-900 text-zinc-100' :
          toastMsg.type === 'error' ? 'border-red-500 bg-zinc-900 text-zinc-100' :
          'border-amber-500 bg-zinc-900 text-zinc-100'
        }`}>
          {toastMsg.msg}
        </div>
      )}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
