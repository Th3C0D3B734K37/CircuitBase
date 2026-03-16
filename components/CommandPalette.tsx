'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { Search, Database, Package, FileText, Zap, X } from 'lucide-react';
import { COMPONENTS, STARTER_KITS } from '@/lib/data';

export default function CommandPalette({ onClose, onNavigate }: { onClose: () => void, onNavigate: (tab: string) => void }) {
  const { inventory, projects, showToast, setSelectedComponentId } = useAppContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) {
      return [
        { id: 'nav-db', type: 'nav', title: 'Go to Database', icon: <Database size={14} />, action: () => onNavigate('db') },
        { id: 'nav-inv', type: 'nav', title: 'Go to Inventory', icon: <Package size={14} />, action: () => onNavigate('inv') },
        { id: 'nav-bom', type: 'nav', title: 'Go to BOM Builder', icon: <FileText size={14} />, action: () => onNavigate('bom') },
        { id: 'nav-kit', type: 'nav', title: 'Go to Starter Kits', icon: <Zap size={14} />, action: () => onNavigate('kit') },
      ];
    }

    const res: any[] = [];

    // Search Database
    COMPONENTS.filter(c => c.name.toLowerCase().includes(q) || (c.note && c.note.toLowerCase().includes(q)) || (c.tags && c.tags.some(t => t.toLowerCase().includes(q))))
      .slice(0, 5)
      .forEach(c => {
        res.push({
          id: `db-${c.id}`,
          type: 'db',
          title: c.name,
          subtitle: `Database • ${c.cat}`,
          icon: <Database size={14} />,
          action: () => { onNavigate('db'); setSelectedComponentId(c.id); }
        });
      });

    // Search Inventory
    inventory.filter(i => i.name.toLowerCase().includes(q) || (i.loc && i.loc.toLowerCase().includes(q)))
      .slice(0, 5)
      .forEach(i => {
        res.push({
          id: `inv-${i.id}`,
          type: 'inv',
          title: i.name,
          subtitle: `Inventory • Qty: ${i.qty} • Loc: ${i.loc || 'N/A'}`,
          icon: <Package size={14} />,
          action: () => { onNavigate('inv'); showToast(`Found ${i.name} in Inventory`, 'info'); }
        });
      });

    // Search Projects/BOMs
    projects.filter(p => p.name.toLowerCase().includes(q) || (p.desc && p.desc.toLowerCase().includes(q)))
      .slice(0, 3)
      .forEach(p => {
        res.push({
          id: `proj-${p.id}`,
          type: 'bom',
          title: p.name,
          subtitle: `Project • ${p.items.length} items`,
          icon: <FileText size={14} />,
          action: () => { onNavigate('bom'); showToast(`Opened project ${p.name}`, 'info'); }
        });
      });

    // Search Kits
    STARTER_KITS.filter(k => k.name.toLowerCase().includes(q) || k.desc.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach(k => {
        res.push({
          id: `kit-${k.id}`,
          type: 'kit',
          title: k.name,
          subtitle: `Starter Kit • ${k.items.length} items`,
          icon: <Zap size={14} />,
          action: () => { onNavigate('kit'); showToast(`Found kit ${k.name}`, 'info'); }
        });
      });

    return res;
  }, [query, inventory, projects, onNavigate, showToast, setSelectedComponentId]);

  const executeAction = (item: any) => {
    item.action();
    onClose();
  };

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          executeAction(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [query, selectedIndex, results, onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl shadow-2xl overflow-hidden rounded-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-zinc-800">
          <Search size={18} className="text-zinc-500 mr-3" />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search components, inventory, projects... (Esc to close)"
            className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder:text-zinc-600"
          />
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 p-1"><X size={16} /></button>
        </div>
        
        <div className="max-h-96 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-zinc-500 text-sm">No results found for &quot;{query}&quot;</div>
          ) : (
            <ul>
              {results.map((item, idx) => (
                <li key={item.id}>
                  <button 
                    onClick={() => executeAction(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${idx === selectedIndex ? 'bg-amber-500/10 border-l-2 border-amber-500' : 'border-l-2 border-transparent hover:bg-zinc-800/50'}`}
                  >
                    <div className={`p-2 rounded-md ${idx === selectedIndex ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-400'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${idx === selectedIndex ? 'text-amber-500' : 'text-zinc-200'}`}>{item.title}</div>
                      {item.subtitle && <div className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider">{item.subtitle}</div>}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-500 font-mono gap-2">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-zinc-800 px-1 py-0.5 rounded mr-1">↑</kbd><kbd className="bg-zinc-800 px-1 py-0.5 rounded">↓</kbd> to navigate</span>
            <span><kbd className="bg-zinc-800 px-1 py-0.5 rounded mr-1">Enter</kbd> to select</span>
          </div>
          <div className="hidden sm:block">CircuitBase Command Palette</div>
        </div>
      </div>
    </div>
  );
}
