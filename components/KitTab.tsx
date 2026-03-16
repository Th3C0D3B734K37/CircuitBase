'use client';

import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { COMPONENTS, STARTER_KITS } from '@/lib/data';
import { Search, Plus, Check } from 'lucide-react';

export default function KitTab() {
  const { inventory, setInventory, showToast, setSelectedComponentId } = useAppContext();
  const [budget, setBudget] = useState(2000);
  const [focus, setFocus] = useState('general');
  const [mode, setMode] = useState<'budget' | 'project'>('budget');
  const [projQuery, setProjQuery] = useState('');

  const recommended = useMemo(() => {
    if (mode === 'project') {
      const q = projQuery.toLowerCase();
      if (!q) return [];
      
      const matches = STARTER_KITS.filter(k => 
        k.name.toLowerCase().includes(q) || 
        k.desc.toLowerCase().includes(q) ||
        k.tags.some(t => t.toLowerCase().includes(q))
      );
      
      if (matches.length === 0) return [];
      
      const kit = matches[0];
      return kit.items.map(ki => {
        const comp = COMPONENTS.find(c => c.id === ki.id);
        if (!comp) return null;
        const invMatch = inventory.find(i => i.refId === comp.id);
        const have = invMatch ? invMatch.qty : 0;
        const need = Math.max(0, ki.qty - have);
        return { ...comp, reqQty: ki.qty, have, need, cost: need * (comp.price || 0) };
      }).filter(Boolean) as any[];
    }

    // Budget mode
    let pool = COMPONENTS.filter(c => c.price && c.price > 0);
    
    if (focus === 'iot') pool = pool.filter(c => c.tags && (c.tags.includes('wifi') || c.tags.includes('mcu') || c.tags.includes('sensor')));
    else if (focus === 'robotics') pool = pool.filter(c => c.tags && (c.tags.includes('motor') || c.tags.includes('driver') || c.tags.includes('power')));
    else if (focus === 'audio') pool = pool.filter(c => c.tags && (c.tags.includes('audio') || c.tags.includes('amp')));

    // Basic heuristic: essential MCUs first, then sensors, then basic IO
    const sorted = pool.sort((a, b) => {
      const scoreA = (a.cat === 'mcu' ? 100 : a.cat === 'sensor' ? 50 : 10) - (a.price || 0) / 100;
      const scoreB = (b.cat === 'mcu' ? 100 : b.cat === 'sensor' ? 50 : 10) - (b.price || 0) / 100;
      return scoreB - scoreA;
    });

    let spent = 0;
    const recs = [];
    
    for (const comp of sorted) {
      const invMatch = inventory.find(i => i.refId === comp.id);
      const have = invMatch ? invMatch.qty : 0;
      
      // If we already have it, include it but don't count against budget
      if (have > 0) {
        recs.push({ ...comp, reqQty: 1, have, need: 0, cost: 0 });
        continue;
      }

      if (spent + (comp.price || 0) <= budget) {
        recs.push({ ...comp, reqQty: 1, have: 0, need: 1, cost: comp.price || 0 });
        spent += (comp.price || 0);
      }
      
      if (recs.length >= 15) break; // Cap at 15 items
    }
    
    return recs;
  }, [budget, focus, inventory, mode, projQuery]);

  const totalCost = recommended.reduce((sum, item) => sum + item.cost, 0);

  const addAllToInv = () => {
    const newInv = [...inventory];
    let added = 0;
    
    recommended.forEach(item => {
      if (item.need > 0) {
        const existing = newInv.find(i => i.refId === item.id);
        if (existing) {
          existing.qty += item.need;
        } else {
          newInv.push({
            id: Date.now() + Math.random(),
            refId: item.id,
            name: item.name,
            cat: item.cat,
            qty: item.need,
            unit: 'pcs',
            price: item.price,
            loc: '',
            cond: 'New',
            notes: 'From Kit Recommender'
          });
        }
        added += item.need;
      }
    });
    
    if (added > 0) {
      setInventory(newInv);
      showToast(`Added ${added} items to inventory`, 'success');
    } else {
      showToast('You already have all required items', 'info');
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-sans tracking-tight mb-3">Starter Kit Builder</h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">Generate a smart shopping list based on your budget or a specific project goal. We automatically subtract parts you already own.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-amber-500 mb-4 pb-2 border-b border-zinc-800">Recommendation Mode</h3>
            
            <div className="flex bg-zinc-950 p-1 border border-zinc-800 mb-5">
              <button 
                onClick={() => setMode('budget')} 
                className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${mode === 'budget' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                By Budget
              </button>
              <button 
                onClick={() => setMode('project')} 
                className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${mode === 'project' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                By Project
              </button>
            </div>

            {mode === 'budget' ? (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-2 flex justify-between">
                    <span>Max Budget (₹)</span>
                    <span className="text-amber-500">₹{budget}</span>
                  </label>
                  <input 
                    type="range" 
                    min="500" max="10000" step="500" 
                    value={budget} 
                    onChange={e => setBudget(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-600 mt-1 font-mono">
                    <span>₹500</span><span>₹10K</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-2">Focus Area</label>
                  <select 
                    value={focus} 
                    onChange={e => setFocus(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs py-2 px-3 focus:border-amber-500 outline-none"
                  >
                    <option value="general">General Electronics</option>
                    <option value="iot">IoT & Smart Home</option>
                    <option value="robotics">Robotics & Motors</option>
                    <option value="audio">Audio & Synth</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-2">What do you want to build?</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input 
                      type="text" 
                      value={projQuery}
                      onChange={e => setProjQuery(e.target.value)}
                      placeholder="e.g., Weather Station, Robot..."
                      className="w-full bg-zinc-950 border border-zinc-800 text-xs py-2 pl-8 pr-3 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['Weather', 'Robot', 'Clock'].map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => setProjQuery(tag)}
                        className="text-[9px] uppercase tracking-wider px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-950/20 border border-amber-900/30 p-5 flex flex-col items-center text-center">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-1">Estimated Cost</div>
            <div className="text-4xl font-bold font-sans text-amber-500 tracking-tight leading-none mb-4">₹{totalCost.toLocaleString('en-IN')}</div>
            <button 
              onClick={addAllToInv}
              disabled={recommended.length === 0 || totalCost === 0}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Add Missing to Inventory
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          {recommended.length > 0 ? (
            <div className="border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="p-3 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
                <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-zinc-400">Recommended Parts ({recommended.length})</h3>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {recommended.filter(r => r.have > 0).length} owned, {recommended.filter(r => r.need > 0).length} needed
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Component</th>
                      <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold text-center">Req</th>
                      <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold text-center">Have</th>
                      <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold text-center">Need</th>
                      <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommended.map((item, idx) => (
                      <tr key={`${item.id}-${idx}`} className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${item.have >= item.reqQty ? 'opacity-60' : ''}`}>
                        <td className="p-2.5">
                          <div className="font-medium flex items-center gap-2">
                            {item.have >= item.reqQty && <Check size={12} className="text-green-500" />}
                            <button onClick={() => setSelectedComponentId(item.id)} className={`hover:text-amber-500 transition-colors text-left ${item.have >= item.reqQty ? 'line-through text-zinc-500' : ''}`}>
                              {item.name}
                            </button>
                          </div>
                          <div className="text-[9px] text-zinc-500 mt-0.5">{item.note ? item.note.substring(0, 60) + '...' : ''}</div>
                        </td>
                        <td className="p-2.5 text-center font-mono text-zinc-400">{item.reqQty}</td>
                        <td className="p-2.5 text-center font-mono text-zinc-400">{item.have}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-amber-500">{item.need}</td>
                        <td className="p-2.5 text-right font-mono text-amber-500">₹{item.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500 p-6">
              <Search size={32} className="text-zinc-700 mb-4" />
              <p className="text-sm text-center">
                {mode === 'project' && projQuery 
                  ? `No projects found matching "${projQuery}". Try "Weather" or "Robot".` 
                  : 'Adjust your budget or search for a project to see recommendations.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
