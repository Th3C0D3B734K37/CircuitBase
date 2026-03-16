'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppContext } from './AppContext';
import { COMPONENTS, STARTER_KITS } from '@/lib/data';
import { Plus, Check, ChevronDown, ChevronUp, Package, Wrench, X } from 'lucide-react';

export default function KitTab() {
  const { inventory, setInventory, showToast, setSelectedComponentId, theme } = useAppContext();
  const [selectedKit, setSelectedKit] = useState<string | null>(null);
  const [expandedKit, setExpandedKit] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside and ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelectedKit(null);
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedKit(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

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
      setSelectedKit(null);
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
    <div ref={containerRef} className="animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold font-sans tracking-tight mb-3 ${theme === 'dark' ? '' : 'text-zinc-900'}`}>Curated Starter Kits</h2>
        <p className={`text-sm max-w-2xl mx-auto ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Browse our premade project kits. Each kit contains exactly what you need to build a complete project. 
          We automatically detect what you already own and only add missing items.
        </p>
      </div>

      {/* Kit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kitDetails.map((kit) => (
          <div 
            key={kit.id}
            className={`border transition-all ${
              selectedKit === kit.id 
                ? 'border-amber-500 ring-2 ring-amber-500/20' 
                : theme === 'dark' 
                  ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700' 
                  : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-sm'
            }`}
          >
            {/* Card Header - Click to select */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setSelectedKit(selectedKit === kit.id ? null : kit.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  <Package className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-sans text-amber-500">₹{kit.totalCost.toLocaleString('en-IN')}</div>
                  <div className={`text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>{kit.items.length} components</div>
                </div>
              </div>
              
              <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{kit.name}</h3>
              <p className={`text-xs mb-3 line-clamp-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>{kit.desc}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {kit.tags.slice(0, 3).map(tag => (
                  <span key={tag} className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-[10px]">
                <span className={getDifficultyColor(kit.items)}>
                  {kit.items.length <= 5 ? 'Beginner' : kit.items.length <= 8 ? 'Intermediate' : 'Advanced'}
                </span>
                <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}>
                  {kit.ownedCount > 0 && <span className="text-green-500">{kit.ownedCount} owned</span>}
                  {kit.missingCount > 0 && kit.ownedCount > 0 && <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>, </span>}
                  {kit.missingCount > 0 && <span className="text-amber-500">{kit.missingCount} needed</span>}
                </span>
              </div>
            </div>
            
            {/* Expandable Details */}
            <div className={`border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedKit(expandedKit === kit.id ? null : kit.id);
                }}
                className={`w-full py-2 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-amber-500' : 'text-zinc-500 hover:text-amber-600'}`}
              >
                {expandedKit === kit.id ? <><ChevronUp size={12} /> Hide Details</> : <><ChevronDown size={12} /> View Contents</>}
              </button>
              
              {expandedKit === kit.id && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                  <div className={`space-y-1 max-h-48 overflow-y-auto ${theme === 'dark' ? '' : 'text-zinc-700'}`}>
                    {kit.items.map((item: any, idx: number) => (
                      <div 
                        key={`${item.id}-${idx}`}
                        className={`flex items-center justify-between py-1.5 px-2 text-xs border-b last:border-0 ${theme === 'dark' ? 'border-zinc-800/50' : 'border-zinc-100'} ${item.have >= item.reqQty ? 'opacity-50' : ''}`}
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
                            className={`hover:text-amber-500 transition-colors ${theme === 'dark' ? '' : 'text-zinc-700'}`}
                          >
                            {item.name}
                          </button>
                        </div>
                        <div className={`flex items-center gap-3 text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                          <span>×{item.reqQty}</span>
                          {item.need > 0 && <span className="text-amber-500">₹{item.cost}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Inventory Button - Inside Card when selected */}
            {selectedKit === kit.id && (
              <div className={`border-t p-3 ${theme === 'dark' ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-200 bg-zinc-50'}`}>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKit(null);
                    }}
                    className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border transition-colors ${theme === 'dark' ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'border-zinc-300 text-zinc-600 hover:border-zinc-400'}`}
                  >
                    <X size={12} className="inline mr-1" /> Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addKitToInv(kit);
                    }}
                    disabled={kit.missingCount === 0}
                    className="flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus size={12} />
                    {kit.missingCount === 0 ? 'Already Have All' : `Add ${kit.missingCount} Items`}
                  </button>
                </div>
                <div className={`text-[10px] mt-2 text-center ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  Total: ₹{kit.totalCost.toLocaleString('en-IN')} • Click card or press ESC to close
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
