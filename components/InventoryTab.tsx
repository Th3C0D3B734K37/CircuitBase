'use client';

import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { Search, Plus, Download, Upload, X, Trash2 } from 'lucide-react';
import { InventoryItem } from '@/lib/types';

const CATS = [
  { id: 'mcu', label: 'MCU' }, { id: 'display', label: 'Display' }, { id: 'sensor', label: 'Sensor' },
  { id: 'rf', label: 'RF' }, { id: 'power', label: 'Power' }, { id: 'io', label: 'I/O' },
  { id: 'active', label: 'Active' }, { id: 'passive', label: 'Passive' }, { id: 'proto', label: 'Proto' },
  { id: 'mechanical', label: 'Mechanical' }, { id: 'material', label: 'Material' }, { id: 'tool', label: 'Tool' }
];

export default function InventoryTab() {
  const { inventory, setInventory, projects, showToast, setSelectedComponentId } = useAppContext();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredInv = useMemo(() => {
    const q = search.toLowerCase();
    return inventory.filter(i => 
      !q || 
      i.name.toLowerCase().includes(q) || 
      (i.loc || '').toLowerCase().includes(q) || 
      (i.notes || '').toLowerCase().includes(q)
    );
  }, [inventory, search]);

  const stats = useMemo(() => {
    const totalQty = inventory.reduce((s, i) => s + i.qty, 0);
    const totalVal = inventory.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
    const cats: Record<string, number> = {};
    inventory.forEach(i => { cats[i.cat] = (cats[i.cat] || 0) + i.qty; });
    return { totalQty, totalVal, cats };
  }, [inventory]);

  const projUsage = useMemo(() => {
    const usage: Record<string, string[]> = {};
    projects.forEach(p => {
      p.items.forEach(pi => {
        if (pi.status === 'need' && pi.refId) {
          if (!usage[pi.refId]) usage[pi.refId] = [];
          usage[pi.refId].push(p.name);
        }
      });
    });
    return usage;
  }, [projects]);

  const changeQty = (id: number, delta: number) => {
    setInventory(inventory.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i));
  };

  const remove = (id: number) => {
    setInventory(inventory.filter(i => i.id !== id));
  };

  const exportCSV = () => {
    const rows = [['Name', 'Category', 'Location', 'Condition', 'Qty', 'Unit', 'Price (INR)', 'Notes']];
    inventory.forEach(i => rows.push([i.name, i.cat, i.loc || '', i.cond || '', String(i.qty), i.unit, String(i.price || ''), i.notes || '']));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'circuitbase-inventory.csv';
    a.click();
    showToast('Inventory exported as CSV', 'success');
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-baseline gap-3 mb-5 pb-3 border-b border-zinc-800">
        <h2 className="text-xl font-bold font-sans tracking-tight">My Inventory</h2>
        <div className="md:ml-auto flex flex-wrap gap-2">
          <button onClick={() => setShowClearConfirm(true)} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-red-900 text-red-500 hover:border-red-500 hover:text-red-400 transition-colors flex items-center gap-1"><Trash2 size={12} /> Clear All</button>
          <button onClick={() => setShowBulkModal(true)} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500 transition-colors flex items-center gap-1"><Upload size={12} /> Bulk Import</button>
          <button onClick={exportCSV} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500 transition-colors flex items-center gap-1"><Download size={12} /> Export</button>
          <button onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 transition-colors flex items-center gap-1"><Plus size={12} /> Add Component</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-4 flex items-center gap-6">
          <DonutChart cats={stats.cats} total={stats.totalQty} />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 flex flex-col justify-center">
          <div className="text-3xl font-bold font-sans text-amber-500 tracking-tight leading-none">{stats.totalQty}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1.5">Total Qty</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 flex flex-col justify-center">
          <div className="text-3xl font-bold font-sans text-amber-500 tracking-tight leading-none">₹{stats.totalVal.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1.5">Est. Value</div>
        </div>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory..." className="w-full bg-zinc-900 border border-zinc-700 text-xs py-2 pl-8 pr-3 focus:border-amber-500 outline-none transition-colors" />
      </div>

      {filteredInv.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 text-xs">Your inventory is empty. Add components from the database or manually.</div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 bg-zinc-900">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Component</th>
                <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Category</th>
                <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Location</th>
                <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Condition</th>
                <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Qty</th>
                <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Unit</th>
                <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Est. Price</th>
                <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Notes</th>
                <th className="p-2.5 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Projects</th>
                <th className="p-2.5 border-b border-zinc-800"></th>
              </tr>
            </thead>
            <tbody>
              {filteredInv.map(item => {
                const isLow = item.qty < 2;
                const pTags = item.refId ? projUsage[item.refId] || [] : [];
                return (
                  <tr key={item.id} className={`hover:bg-zinc-800/50 transition-colors ${isLow ? 'bg-amber-950/20' : ''}`}>
                    <td className="p-2.5 border-b border-zinc-800/50 font-medium">
                      {item.refId ? (
                        <button onClick={() => setSelectedComponentId(item.refId)} className="hover:text-amber-500 transition-colors text-left">
                          {item.name}
                        </button>
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="p-2.5 border-b border-zinc-800/50"><span className="uppercase text-[9px] font-bold tracking-wider px-1.5 py-0.5 bg-zinc-950 border border-zinc-800">{item.cat}</span></td>
                    <td className="p-2.5 border-b border-zinc-800/50 text-zinc-400">{item.loc || '—'}</td>
                    <td className="p-2.5 border-b border-zinc-800/50 text-zinc-400 flex items-center gap-1.5 mt-1">
                      <span className={`w-2 h-2 rounded-full ${item.cond === 'New' ? 'bg-green-500' : item.cond === 'Good' ? 'bg-blue-500' : item.cond === 'Worn' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                      {item.cond || 'New'}
                    </td>
                    <td className="p-2.5 border-b border-zinc-800/50">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => changeQty(item.id, -1)} className="w-5 h-5 flex items-center justify-center border border-zinc-700 text-zinc-400 hover:border-amber-500 hover:text-amber-500">−</button>
                        <span className={`w-6 text-center font-semibold ${isLow ? 'text-amber-500' : ''}`}>{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)} className="w-5 h-5 flex items-center justify-center border border-zinc-700 text-zinc-400 hover:border-amber-500 hover:text-amber-500">+</button>
                      </div>
                    </td>
                    <td className="p-2.5 border-b border-zinc-800/50 text-zinc-500">{item.unit}</td>
                    <td className="p-2.5 border-b border-zinc-800/50 text-amber-500 font-medium">{item.price ? `₹${item.price}` : '—'}</td>
                    <td className="p-2.5 border-b border-zinc-800/50 text-zinc-500 max-w-[160px] truncate">{item.notes || '—'}</td>
                    <td className="p-2.5 border-b border-zinc-800/50">
                      {pTags.map(pt => <span key={pt} className="text-[9px] bg-zinc-950 border border-zinc-800 px-1 py-0.5 mr-1 text-zinc-400">{pt}</span>)}
                    </td>
                    <td className="p-2.5 border-b border-zinc-800/50 text-right">
                      <button onClick={() => remove(item.id)} className="text-zinc-500 hover:text-red-500 p-1"><X size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && <AddInventoryModal onClose={() => setShowAddModal(false)} />}
      {showBulkModal && <BulkImportModal onClose={() => setShowBulkModal(false)} />}
      {showClearConfirm && <ClearConfirmModal onClose={() => setShowClearConfirm(false)} onConfirm={() => { setInventory([]); setShowClearConfirm(false); showToast('Inventory cleared', 'success'); }} />}
    </div>
  );
}

function DonutChart({ cats, total }: { cats: Record<string, number>, total: number }) {
  if (total === 0) return null;
  const colors: Record<string, string> = { mcu: '#4ade80', sensor: '#60a5fa', display: '#c084fc', power: '#fb923c', rf: '#34d399', io: '#a78bfa', active: '#f87171', passive: '#94a3b8', proto: '#fbbf24', mechanical: '#7dd3fc', material: '#d4a574', tool: '#9ca3af' };
  
  const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const top5 = sorted.slice(0, 5);
  const other = sorted.slice(5).reduce((s, [_, q]) => s + q, 0);
  
  const segments = top5.reduce((acc, [cat, qty]) => {
    const pct = (qty / total) * 100;
    const start = acc.currentStart;
    const res = `${colors[cat] || '#fff'} ${start}% ${start + pct}%`;
    acc.items.push({ cat, qty, color: colors[cat] || '#fff', res });
    acc.currentStart += pct;
    return acc;
  }, { items: [] as any[], currentStart: 0 });
  
  const finalSegments = segments.items;
  
  if (other > 0) {
    finalSegments.push({ cat: 'Other', qty: other, color: '#333', res: `#333 ${segments.currentStart}% 100%` });
  }

  const gradient = `conic-gradient(${finalSegments.map(s => s.res).join(', ')})`;

  return (
    <>
      <div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{ background: gradient }}>
        <div className="w-16 h-16 bg-zinc-900 rounded-full absolute flex flex-col items-center justify-center">
          <span className="font-bold text-lg leading-none">{total}</span>
          <span className="text-[8px] text-zinc-500">ITEMS</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-[10px]">
        {finalSegments.map(s => (
          <div key={s.cat} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: s.color }}></div>
            <span className="text-zinc-400 capitalize">{s.cat} ({s.qty})</span>
          </div>
        ))}
      </div>
    </>
  );
}

function AddInventoryModal({ onClose }: { onClose: () => void }) {
  const { inventory, setInventory, showToast } = useAppContext();
  const [name, setName] = useState('');
  const [cat, setCat] = useState('passive');
  const [qty, setQty] = useState('1');
  const [loc, setLoc] = useState('');
  const [cond, setCond] = useState('New');
  const [unit, setUnit] = useState('pcs');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  const submit = () => {
    if (!name.trim()) { showToast('Name required', 'error'); return; }
    setInventory([...inventory, {
      id: Date.now(), refId: null, name: name.trim(), cat,
      qty: parseInt(qty) || 1, unit: unit || 'pcs', price: parseFloat(price) || 0,
      notes: notes.trim(), loc: loc.trim(), cond
    }]);
    showToast(`${name} added to inventory`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold font-sans mb-5">Add to Inventory</h3>
        <div className="mb-3">
          <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Component Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none">
              {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Quantity *</label>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} min="0" className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Location</label>
            <input type="text" value={loc} onChange={e => setLoc(e.target.value)} placeholder="Drawer A3" className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Condition</label>
            <select value={cond} onChange={e => setCond(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none">
              <option value="New">New</option><option value="Good">Good</option><option value="Worn">Worn</option><option value="Broken">Broken</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Unit</label>
            <input type="text" value={unit} onChange={e => setUnit(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Est. Price (₹)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Notes</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500">Cancel</button>
          <button onClick={submit} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400">Add to Inventory</button>
        </div>
      </div>
    </div>
  );
}

function ClearConfirmModal({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold font-sans mb-3 text-red-500">Clear All Inventory?</h3>
        <p className="text-sm text-zinc-400 mb-5">This will permanently remove all {useAppContext().inventory.length} items from your inventory. This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-red-600 text-white hover:bg-red-500">Clear All</button>
        </div>
      </div>
    </div>
  );
}

function BulkImportModal({ onClose }: { onClose: () => void }) {
  const { inventory, setInventory, showToast } = useAppContext();
  const [csv, setCsv] = useState('');

  const submit = () => {
    if (!csv.trim()) return;
    const lines = csv.trim().split('\n');
    let added = 0;
    const newItems: InventoryItem[] = [];
    lines.forEach(line => {
      const parts = line.split(',').map(s => s.trim());
      if (parts.length >= 1 && parts[0]) {
        newItems.push({
          id: Date.now() + Math.random(), refId: null, name: parts[0], cat: parts[1] || 'passive',
          qty: parseInt(parts[2]) || 1, loc: parts[3] || '', cond: parts[4] || 'New', price: parseFloat(parts[5]) || 0, unit: 'pcs', notes: ''
        });
        added++;
      }
    });
    setInventory([...inventory, ...newItems]);
    showToast(`Imported ${added} components`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold font-sans mb-5">Bulk Import CSV</h3>
        <div className="mb-5">
          <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Paste CSV (Name, Category, Qty, Location, Condition, Price)</label>
          <textarea value={csv} onChange={e => setCsv(e.target.value)} rows={8} placeholder="ESP32, mcu, 5, Box 1, New, 350&#10;Resistor 10k, passive, 100, Drawer 2, Good, 1" className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none font-mono" />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500">Cancel</button>
          <button onClick={submit} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400">Import</button>
        </div>
      </div>
    </div>
  );
}
