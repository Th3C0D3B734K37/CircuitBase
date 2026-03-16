'use client';

import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { COMPONENTS, STARTER_KITS } from '@/lib/data';
import { Plus, Check, ChevronDown, ChevronUp, Package, Wrench } from 'lucide-react';

export default function KitTab() {
  const { inventory, setInventory, showToast, setSelectedComponentId, theme } = useAppContext();
  const [selectedKit, setSelectedKit] = useState<string | null>(null);
  const [expandedKit, setExpandedKit] = useState<string | null>(null);

  const kitDetails = useMemo(() => {
    return STARTER_KITS.map(kit => {
      const items = kit.items.map(ki => {
        const comp = COMPONENTS.find(c => c.id === ki.id);
        if (!comp) return null;
        const invMatch = inventory.find(i => i.refId === comp.id);
        const have = invMatch ? invMatch.qty : 0;
        const need = Math.max(0, ki.qty - have);
        return { ...comp, reqQty: ki.qty, have, need, cost: need * (comp.price || 0) };
      }).filter(Boolean) as any[];
      
      const totalCost = items.reduce((sum, item) => sum + item.cost, 0);
      const ownedCount = items.filter(i => i.have >= i.reqQty).length;
      const missingCount = items.filter(i => i.need > 0).length;
      
      return { ...kit, items, totalCost, ownedCount, missingCount };
    });
  }, [inventory]);

  const selectedKitData = useMemo(() => {
    if (!selectedKit) return null;
    return kitDetails.find(k => k.id === selectedKit);
  }, [selectedKit, kitDetails]);

  const addKitToInv = (kit: any) => {
    const newInv = [...inventory];
    let added = 0;
    
    kit.items.forEach((item: any) => {
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
            notes: `From ${kit.name}`
          });
        }
        added += item.need;
      }
    });
    
    if (added > 0) {
      setInventory(newInv);
      showToast(`Added ${added} items from ${kit.name} to inventory`, 'success');
    } else {
      showToast(`You already have all items for ${kit.name}`, 'info');
    }
  };

  const getDifficultyColor = (items: any[]) => {
    const count = items.length;
    if (count <= 5) return 'text-green-500';
    if (count <= 8) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-sans tracking-tight mb-3">Curated Starter Kits</h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
          Browse our premade project kits. Each kit contains exactly what you need to build a complete project. 
          We automatically detect what you already own and only add missing items.
        </p>
      </div>

      {/* Kit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kitDetails.map((kit) => (
          <div 
            key={kit.id}
            className={`border transition-all cursor-pointer ${
              selectedKit === kit.id 
                ? 'border-amber-500 bg-zinc-900' 
                : theme === 'dark' 
                  ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700' 
                  : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'
            }`}
            onClick={() => setSelectedKit(kit.id)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                  <Package className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-sans text-amber-500">₹{kit.totalCost.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-zinc-500">{kit.items.length} components</div>
                </div>
              </div>
              
              <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{kit.name}</h3>
              <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{kit.desc}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {kit.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-[10px]">
                <span className={getDifficultyColor(kit.items)}>
                  {kit.items.length <= 5 ? 'Beginner' : kit.items.length <= 8 ? 'Intermediate' : 'Advanced'}
                </span>
                <span className="text-zinc-500">
                  {kit.ownedCount > 0 && <span className="text-green-500">{kit.ownedCount} owned</span>}
                  {kit.missingCount > 0 && kit.ownedCount > 0 && <span className="text-zinc-500">, </span>}
                  {kit.missingCount > 0 && <span className="text-amber-500">{kit.missingCount} needed</span>}
                </span>
              </div>
            </div>
            
            {/* Expandable Details */}
            <div className="border-t border-zinc-800">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedKit(expandedKit === kit.id ? null : kit.id);
                }}
                className="w-full py-2 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-amber-500 transition-colors"
              >
                {expandedKit === kit.id ? <><ChevronUp size={12} /> Hide Details</> : <><ChevronDown size={12} /> View Contents</>}
              </button>
              
              {expandedKit === kit.id && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {kit.items.map((item: any, idx: number) => (
                      <div 
                        key={`${item.id}-${idx}`}
                        className={`flex items-center justify-between py-1.5 px-2 text-xs border-b border-zinc-800/50 last:border-0 ${item.have >= item.reqQty ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          {item.have >= item.reqQty ? (
                            <Check size={12} className="text-green-500" />
                          ) : (
                            <Wrench size={12} className="text-amber-500" />
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComponentId(item.id);
                            }}
                            className="hover:text-amber-500 transition-colors"
                          >
                            {item.name}
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                          <span>×{item.reqQty}</span>
                          {item.need > 0 && <span className="text-amber-500">₹{item.cost}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Kit Action Bar */}
      {selectedKitData && (
        <div className={`sticky bottom-0 border-t p-4 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm font-semibold">{selectedKitData.name}</div>
                <div className="text-xs text-zinc-500">
                  {selectedKitData.missingCount} items to buy • ₹{selectedKitData.totalCost.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedKit(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-zinc-700 text-zinc-400 hover:border-zinc-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => addKitToInv(selectedKitData)}
                disabled={selectedKitData.missingCount === 0}
                className="px-6 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus size={14} />
                {selectedKitData.missingCount === 0 ? 'Already Have All Items' : 'Add Missing to Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
