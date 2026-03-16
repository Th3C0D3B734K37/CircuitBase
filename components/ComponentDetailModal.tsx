'use client';

import React, { useMemo, useState } from 'react';
import { useAppContext } from './AppContext';
import { COMPONENTS } from '@/lib/data';
import { X, ExternalLink, Plus, Package, FolderPlus } from 'lucide-react';

export default function ComponentDetailModal() {
  const { selectedComponentId, setSelectedComponentId, dbExtra, inventory, setInventory, projects, setProjects, showToast } = useAppContext();
  const [showProjectSelect, setShowProjectSelect] = useState(false);

  const component = useMemo(() => {
    if (!selectedComponentId) return null;
    return COMPONENTS.find(c => c.id === selectedComponentId) || dbExtra.find(c => c.id === selectedComponentId) || null;
  }, [selectedComponentId, dbExtra]);

  if (!component) return null;

  const addToInventory = () => {
    const newInv = [...inventory];
    const existing = newInv.find(i => i.refId === component.id);
    if (existing) {
      existing.qty += 1;
    } else {
      newInv.push({
        id: Date.now(),
        refId: component.id,
        name: component.name,
        cat: component.cat,
        qty: 1,
        unit: 'pcs',
        price: component.price || 0,
        loc: '',
        cond: 'New',
        notes: ''
      });
    }
    setInventory(newInv);
    showToast(`Added ${component.name} to inventory`, 'success');
  };

  const addToProject = (projectId: number) => {
    const newProjects = projects.map(p => {
      if (p.id !== projectId) return p;
      const existingItem = p.items.find(i => i.refId === component.id);
      if (existingItem) {
        return {
          ...p,
          items: p.items.map(i => i.refId === component.id ? { ...i, qty: i.qty + 1 } : i)
        };
      } else {
        return {
          ...p,
          items: [...p.items, {
            id: Date.now(),
            refId: component.id,
            name: component.name,
            cat: component.cat,
            qty: 1,
            price: component.price,
            status: 'need' as const
          }]
        };
      }
    });
    setProjects(newProjects);
    showToast(`Added ${component.name} to project`, 'success');
    setShowProjectSelect(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <h2 className="text-lg font-bold font-sans tracking-tight truncate pr-4">{component.name}</h2>
          <button 
            onClick={() => setSelectedComponentId(null)}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
              {component.cat}
            </span>
            {component.price ? (
              <span className="text-amber-500 font-mono font-bold">₹{component.price}</span>
            ) : null}
            {component.verified && (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-green-500/30 text-green-500">
                Verified
              </span>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-zinc-500 mb-2">Description & Notes</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{component.note}</p>
          </div>

          {component.tags && component.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-zinc-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {component.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {component.pairs && component.pairs.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-zinc-500 mb-2">Pairs Well With</h3>
              <div className="flex flex-wrap gap-2">
                {component.pairs.map(pairId => {
                  const pairComp = COMPONENTS.find(c => c.id === pairId) || dbExtra.find(c => c.id === pairId);
                  if (!pairComp) return null;
                  return (
                    <button 
                      key={pairId}
                      onClick={() => setSelectedComponentId(pairId)}
                      className="text-xs px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:text-amber-500 transition-colors text-left"
                    >
                      {pairComp.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {component.datasheet && (
              <a 
                href={component.datasheet} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-colors text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                <ExternalLink size={14} /> Datasheet
              </a>
            )}
            
            {component.wtb && (
              <div className="flex gap-2">
                {component.wtb.robu && (
                  <a href={component.wtb.robu} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center py-2.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-colors text-[10px] font-semibold uppercase tracking-wider text-zinc-300">Robu</a>
                )}
                {component.wtb.amazon && (
                  <a href={component.wtb.amazon} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center py-2.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-colors text-[10px] font-semibold uppercase tracking-wider text-zinc-300">Amazon</a>
                )}
                {component.wtb.ali && (
                  <a href={component.wtb.ali} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center py-2.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-colors text-[10px] font-semibold uppercase tracking-wider text-zinc-300">AliExpress</a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={addToInventory}
            className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider bg-zinc-800 text-white hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            <Package size={14} /> Add to Inventory
          </button>
          
          <div className="flex-1 relative">
            <button 
              onClick={() => setShowProjectSelect(!showProjectSelect)}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
            >
              <FolderPlus size={14} /> Add to Project
            </button>
            
            {showProjectSelect && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden animate-in slide-in-from-bottom-2">
                {projects.length === 0 ? (
                  <div className="p-3 text-xs text-zinc-500 text-center">No projects found. Create one in the BOM tab first.</div>
                ) : (
                  <div className="max-h-48 overflow-y-auto">
                    {projects.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => addToProject(p.id)}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-0 truncate"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
