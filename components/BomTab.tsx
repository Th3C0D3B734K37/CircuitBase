'use client';

import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { Plus, Trash2, Check, X, Copy, Download, Search, ExternalLink } from 'lucide-react';
import { Project, BomItem } from '@/lib/types';

export default function BomTab() {
  const { projects, setProjects, inventory, showToast, setSelectedComponentId } = useAppContext();
  const [activeId, setActiveId] = useState<number | null>(projects[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);

  const activeProj = useMemo(() => projects.find(p => p.id === activeId) || null, [projects, activeId]);

  const addProject = (name: string, desc: string) => {
    const newProj: Project = { id: Date.now(), name, desc, items: [] };
    setProjects([...projects, newProj]);
    setActiveId(newProj.id);
    setShowAddModal(false);
    showToast(`Project "${name}" created`, 'success');
  };

  const deleteProject = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const newProjs = projects.filter(p => p.id !== id);
      setProjects(newProjs);
      if (activeId === id) setActiveId(newProjs[0]?.id || null);
      showToast('Project deleted', 'success');
    }
  };

  const duplicateProject = (p: Project) => {
    const newProj: Project = { ...p, id: Date.now(), name: `${p.name} (Copy)` };
    setProjects([...projects, newProj]);
    setActiveId(newProj.id);
    showToast('Project duplicated', 'success');
  };

  const updateItem = (projId: number, itemId: number, updates: Partial<BomItem>) => {
    setProjects(projects.map(p => {
      if (p.id !== projId) return p;
      return { ...p, items: p.items.map(i => i.id === itemId ? { ...i, ...updates } : i) };
    }));
  };

  const removeItem = (projId: number, itemId: number) => {
    setProjects(projects.map(p => {
      if (p.id !== projId) return p;
      return { ...p, items: p.items.filter(i => i.id !== itemId) };
    }));
  };

  const addItem = (projId: number) => {
    setProjects(projects.map(p => {
      if (p.id !== projId) return p;
      return { ...p, items: [...p.items, { id: Date.now(), refId: null, name: 'New Component', qty: 1, status: 'need' }] };
    }));
  };

  const checkInventory = (projId: number) => {
    setProjects(projects.map(p => {
      if (p.id !== projId) return p;
      const newItems = p.items.map(item => {
        if (item.status === 'have') return item;
        const invMatch = inventory.find(inv => inv.refId === item.refId || inv.name.toLowerCase() === item.name.toLowerCase());
        if (invMatch && invMatch.qty >= item.qty) {
          return { ...item, status: 'have' as const };
        }
        return item;
      });
      return { ...p, items: newItems };
    }));
    showToast('Inventory checked against BOM', 'success');
  };

  const exportCSV = (p: Project) => {
    const rows = [['Component', 'Qty', 'Status', 'Notes']];
    p.items.forEach(i => rows.push([i.name, String(i.qty), i.status, i.notes || '']));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `bom-${p.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    showToast('BOM exported as CSV', 'success');
  };

  return (
    <div className="animate-in fade-in duration-300 flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-zinc-400">Projects</h3>
          <button onClick={() => setShowAddModal(true)} className="text-zinc-500 hover:text-amber-500"><Plus size={16} /></button>
        </div>
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {projects.map(p => {
            const total = p.items.length;
            const have = p.items.filter(i => i.status === 'have').length;
            const pct = total === 0 ? 0 : Math.round((have / total) * 100);
            return (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={`text-left p-3 border transition-colors min-w-[140px] md:min-w-0 shrink-0 ${activeId === p.id ? 'bg-zinc-900 border-amber-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'}`}
              >
                <div className="font-medium text-sm truncate">{p.name}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono">{pct}%</span>
                </div>
              </button>
            );
          })}
          {projects.length === 0 && (
            <div className="text-[10px] text-zinc-500 text-center py-4 border border-dashed border-zinc-800">No projects yet</div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeProj ? (
          <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-2xl font-bold font-sans tracking-tight text-amber-500">{activeProj.name}</h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">{activeProj.desc || 'No description provided.'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => checkInventory(activeProj.id)} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500 transition-colors flex items-center gap-1"><Search size={12} /> Check Inv</button>
                <button onClick={() => duplicateProject(activeProj)} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500 transition-colors flex items-center gap-1"><Copy size={12} /> Dup</button>
                <button onClick={() => exportCSV(activeProj)} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500 transition-colors flex items-center gap-1"><Download size={12} /> CSV</button>
                <button onClick={() => deleteProject(activeProj.id)} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-red-900/50 text-red-500 hover:bg-red-950 transition-colors flex items-center gap-1"><Trash2 size={12} /> Del</button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-zinc-400">Bill of Materials</h3>
              <button onClick={() => addItem(activeProj.id)} className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 transition-colors flex items-center gap-1"><Plus size={12} /> Add Row</button>
            </div>

            <div className="overflow-x-auto border border-zinc-800 bg-zinc-950">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="p-2 border-b border-zinc-800 w-8 text-center"></th>
                    <th className="p-2 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Component</th>
                    <th className="p-2 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold w-20">Qty</th>
                    <th className="p-2 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Notes</th>
                    <th className="p-2 border-b border-zinc-800 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {activeProj.items.map(item => (
                    <tr key={item.id} className="hover:bg-zinc-900 transition-colors group">
                      <td className="p-2 border-b border-zinc-800/50 text-center">
                        <button 
                          onClick={() => updateItem(activeProj.id, item.id, { status: item.status === 'have' ? 'need' : 'have' })}
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${item.status === 'have' ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-zinc-900 border-zinc-700 text-transparent hover:border-amber-500'}`}
                        >
                          <Check size={12} />
                        </button>
                      </td>
                      <td className="p-2 border-b border-zinc-800/50">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={item.name} 
                            onChange={e => updateItem(activeProj.id, item.id, { name: e.target.value })}
                            className={`w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-amber-500 px-1 py-0.5 ${item.status === 'have' ? 'text-zinc-500 line-through' : 'font-medium'}`}
                          />
                          {item.refId && (
                            <button onClick={() => setSelectedComponentId(item.refId!)} className="text-zinc-500 hover:text-amber-500 shrink-0" title="View details">
                              <ExternalLink size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border-b border-zinc-800/50">
                        <input 
                          type="number" 
                          min="1"
                          value={item.qty} 
                          onChange={e => updateItem(activeProj.id, item.id, { qty: parseInt(e.target.value) || 1 })}
                          className="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-amber-500 px-1 py-0.5 font-mono"
                        />
                      </td>
                      <td className="p-2 border-b border-zinc-800/50">
                        <input 
                          type="text" 
                          value={item.notes || ''} 
                          placeholder="Add notes..."
                          onChange={e => updateItem(activeProj.id, item.id, { notes: e.target.value })}
                          className="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-amber-500 px-1 py-0.5 text-zinc-400"
                        />
                      </td>
                      <td className="p-2 border-b border-zinc-800/50 text-right">
                        <button onClick={() => removeItem(activeProj.id, item.id)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><X size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {activeProj.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500 text-xs border-b border-zinc-800/50">
                        BOM is empty. Add rows manually or import from database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Shopping List Summary */}
            {activeProj.items.filter(i => i.status === 'need').length > 0 && (
              <div className="mt-8 p-4 border border-amber-900/30 bg-amber-950/10">
                <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-amber-500 mb-3">Shopping List (Missing Items)</h4>
                <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                  {activeProj.items.filter(i => i.status === 'need').map(i => (
                    <li key={i.id}><span className="font-mono text-amber-500 mr-2">{i.qty}x</span> {i.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full min-h-[400px] border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500 p-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4"><Plus size={24} className="text-zinc-700" /></div>
            <p className="text-sm">Select a project or create a new one to start building a BOM.</p>
            <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 transition-colors">Create Project</button>
          </div>
        )}
      </div>

      {showAddModal && <AddProjectModal onClose={() => setShowAddModal(false)} onAdd={addProject} />}
    </div>
  );
}

function AddProjectModal({ onClose, onAdd }: { onClose: () => void, onAdd: (name: string, desc: string) => void }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const submit = () => {
    if (name.trim()) onAdd(name.trim(), desc.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold font-sans mb-5">Create New Project</h3>
        <div className="mb-4">
          <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Project Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} autoFocus className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" placeholder="e.g., Weather Station" />
        </div>
        <div className="mb-6">
          <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" placeholder="Brief description of the project..." />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500">Cancel</button>
          <button onClick={submit} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400">Create</button>
        </div>
      </div>
    </div>
  );
}
