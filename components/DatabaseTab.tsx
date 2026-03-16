'use client';

import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { COMPONENTS } from '@/lib/data';
import { ComponentDef } from '@/lib/types';
import { Search, Plus, ExternalLink, Check } from 'lucide-react';

const CATS = [
  { id: 'all', label: 'All' }, { id: 'mcu', label: 'MCU' }, { id: 'display', label: 'Display' },
  { id: 'sensor', label: 'Sensor' }, { id: 'rf', label: 'RF' }, { id: 'power', label: 'Power' },
  { id: 'io', label: 'I/O' }, { id: 'active', label: 'Active' }, { id: 'passive', label: 'Passive' },
  { id: 'proto', label: 'Proto' }, { id: 'mechanical', label: 'Mechanical' }, { id: 'material', label: 'Material' }
];

export default function DatabaseTab() {
  const { inventory, setInventory, dbExtra, recentlyViewed, setRecentlyViewed, showToast, setSelectedComponentId, theme } = useAppContext();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [interfaceFilter, setInterfaceFilter] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const allComps = useMemo(() => [...COMPONENTS, ...dbExtra], [dbExtra]);

  const filteredComps = useMemo(() => {
    const q = search.toLowerCase();
    return allComps.filter(c => {
      const matchCat = catFilter === 'all' || c.cat === catFilter;
      const matchTier = !tierFilter || String(c.tier) === tierFilter;
      const matchIface = !interfaceFilter || (c.tags || []).some(t => t.toLowerCase() === interfaceFilter.toLowerCase());
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.note.toLowerCase().includes(q) || (c.tags || []).join(' ').toLowerCase().includes(q);
      return matchCat && matchTier && matchIface && matchQ;
    }).slice(0, 200); // virtual limit
  }, [allComps, search, tierFilter, interfaceFilter, catFilter]);

  const invIds = useMemo(() => new Set(inventory.map(i => i.refId).filter(Boolean)), [inventory]);

  const handleAddInv = (compId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const comp = allComps.find(c => c.id === compId);
    if (!comp) return;
    if (invIds.has(compId)) {
      showToast('Already in inventory', 'info');
      return;
    }
    setInventory([...inventory, {
      id: Date.now(), refId: compId, name: comp.name, cat: comp.cat,
      qty: 1, unit: 'pcs', price: comp.price || 0, notes: '', loc: '', cond: 'New'
    }]);
    showToast(`${comp.name} added to inventory`, 'success');
  };

  const handleCardClick = (id: string) => {
    const newRv = [id, ...recentlyViewed.filter(x => x !== id)].slice(0, 6);
    setRecentlyViewed(newRv);
    setSelectedComponentId(id);
  };

  const handleCompareToggle = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (compareIds.length >= 3) {
        showToast('You can only compare up to 3 components', 'error');
        e.target.checked = false;
        return;
      }
      setCompareIds([...compareIds, id]);
    } else {
      setCompareIds(compareIds.filter(x => x !== id));
    }
  };

  const openCompare = () => {
    if (compareIds.length < 2) {
      showToast('Select 2 or 3 components to compare', 'info');
      return;
    }
    setShowCompareModal(true);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-baseline gap-3 mb-5 pb-3 border-b border-zinc-800">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold font-sans tracking-tight">Component Database</h2>
          <span className="text-xs text-zinc-500">{filteredComps.length} components</span>
        </div>
        <div className="md:ml-auto flex gap-2 w-full md:w-auto">
          <button onClick={openCompare} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500 transition-colors">Compare</button>
          <button onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none justify-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 transition-colors flex items-center gap-1"><Plus size={12} /> Submit</button>
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 items-center">
          <span className="text-[10px] text-zinc-500">Recently Viewed:</span>
          {recentlyViewed.map(id => {
            const c = allComps.find(x => x.id === id);
            if (!c) return null;
            return <div key={id} onClick={() => setSelectedComponentId(id)} className="px-2 py-1 border border-zinc-800 text-[10px] cursor-pointer whitespace-nowrap text-zinc-400 hover:border-amber-500 hover:text-amber-500">{c.name}</div>
          })}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`} size={14} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, spec, tag... (Press / to focus)" className={`w-full border text-xs py-2 pl-8 pr-3 focus:border-amber-500 outline-none transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'}`} />
        </div>
        <div className="flex gap-2">
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className={`flex-1 md:w-[140px] border text-xs py-2 px-3 focus:border-amber-500 outline-none ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'}`}>
            <option value="">All Tiers</option>
            <option value="1">Tier 1 — Essential</option>
            <option value="2">Tier 2 — Intermediate</option>
            <option value="3">Tier 3 — Advanced</option>
          </select>
          <select value={interfaceFilter} onChange={e => setInterfaceFilter(e.target.value)} className={`flex-1 md:w-[140px] border text-xs py-2 px-3 focus:border-amber-500 outline-none ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'}`}>
            <option value="">All Interfaces</option>
            <option value="I2C">I2C</option>
            <option value="SPI">SPI</option>
            <option value="UART">UART</option>
            <option value="PWM">PWM</option>
            <option value="analog">Analog</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCatFilter(c.id)} className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider border transition-colors ${catFilter === c.id ? 'border-amber-500 text-amber-500 bg-amber-500/10' : theme === 'dark' ? 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600' : 'border-zinc-300 text-zinc-600 hover:text-zinc-800 hover:border-zinc-400'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {filteredComps.length === 0 ? (
        <div className={`text-center py-16 text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>No components match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredComps.map(c => {
            const inInv = invIds.has(c.id);
            return (
              <div key={c.id} onClick={() => handleCardClick(c.id)} className={`border p-3.5 transition-colors relative group ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-white border-zinc-200 hover:border-amber-400 shadow-sm'}`}>
                <input type="checkbox" checked={compareIds.includes(c.id)} onChange={(e) => handleCompareToggle(c.id, e)} onClick={e => e.stopPropagation()} className="absolute top-3.5 right-3.5 w-4 h-4 cursor-pointer accent-amber-500" />
                <div className="flex justify-between items-start gap-2 mb-2 pr-6">
                  <div className={`font-sans text-sm font-semibold leading-snug ${theme === 'dark' ? '' : 'text-zinc-900'}`}>
                    {c.name}
                    {c.verified ? <span className="ml-1.5 text-[9px] text-green-400 border border-green-900/50 px-1 py-0.5">✓ Verified</span> : <span className={`ml-1.5 text-[9px] border px-1 py-0.5 ${theme === 'dark' ? 'text-zinc-500 border-zinc-800' : 'text-zinc-400 border-zinc-300'}`}>Community</span>}
                  </div>
                </div>
                <div className="flex gap-1.5 items-center mb-2">
                  {c.datasheet && <a href={c.datasheet} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className={`text-[9px] px-1.5 py-0.5 border flex items-center gap-1 ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500' : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400'}`}>Datasheet <ExternalLink size={8} /></a>}
                  <span className={`text-[9px] px-1.5 py-0.5 font-bold tracking-wider border ${c.tier === 1 ? 'bg-green-950 text-green-400 border-green-900' : c.tier === 2 ? 'bg-amber-950 text-amber-500 border-amber-900' : 'bg-purple-950 text-purple-400 border-purple-900'}`}>T{c.tier}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 font-bold tracking-wighter uppercase border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-300 text-zinc-700'}`}>{c.cat}</span>
                </div>
                <div className={`text-[11px] my-1.5 leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{c.note}</div>
                {c.tags && c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.tags.map(t => <span key={t} className={`text-[10px] border px-1.5 py-0.5 ${theme === 'dark' ? 'text-zinc-400 bg-zinc-950 border-zinc-800' : 'text-zinc-600 bg-zinc-100 border-zinc-200'}`}>{t}</span>)}
                  </div>
                )}
                {c.pairs && c.pairs.length > 0 && (
                  <div className={`mt-2 text-[10px] hidden group-hover:block ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    Pairs well with: {c.pairs.map(p => {
                      const pc = allComps.find(x => x.id === p);
                      return pc ? <span key={p} onClick={(e) => { e.stopPropagation(); setSelectedComponentId(pc.id); }} className="text-blue-400 cursor-pointer hover:underline mr-1">{pc.name}</span> : null;
                    })}
                  </div>
                )}
                {c.wtb && (
                  <div className="mt-2 text-[10px] flex gap-1.5 flex-wrap">
                    Buy:
                    {c.wtb.robu && <a href={c.wtb.robu} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className={`text-amber-500 border px-1.5 py-0.5 rounded-sm ${theme === 'dark' ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-300 hover:bg-zinc-100'}`}>Robu</a>}
                    {c.wtb.amazon && <a href={c.wtb.amazon} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className={`text-amber-500 border px-1.5 py-0.5 rounded-sm ${theme === 'dark' ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-300 hover:bg-zinc-100'}`}>Amazon</a>}
                    {c.wtb.ali && <a href={c.wtb.ali} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className={`text-amber-500 border px-1.5 py-0.5 rounded-sm ${theme === 'dark' ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-300 hover:bg-zinc-100'}`}>AliExpress</a>}
                  </div>
                )}
                <div className={`flex items-center justify-between mt-3 pt-2.5 border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <div className={`text-[11px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{c.price ? <b className="text-amber-500 font-semibold">₹{c.price}</b> : '—'}</div>
                  <button onClick={(e) => handleAddInv(c.id, e)} className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 border transition-colors flex items-center gap-1 ${inInv ? 'border-green-900/50 text-green-500 bg-green-950/30 cursor-default' : theme === 'dark' ? 'border-zinc-700 text-zinc-400 hover:border-green-500 hover:text-green-500' : 'border-zinc-300 text-zinc-600 hover:border-green-500 hover:text-green-600'}`}>
                    {inInv ? <><Check size={12} /> In Inventory</> : <><Plus size={12} /> Add to Inventory</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowCompareModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold font-sans mb-4">Compare Components</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="p-2 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">Feature</th>
                    {compareIds.map(id => {
                      const c = allComps.find(x => x.id === id);
                      return <th key={id} className="p-2 border-b border-zinc-800 font-semibold min-w-[120px]">{c?.name}</th>
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b border-zinc-800/50 text-zinc-400">Category</td>
                    {compareIds.map(id => {
                      const c = allComps.find(x => x.id === id);
                      return <td key={id} className="p-2 border-b border-zinc-800/50"><span className="uppercase text-[9px] font-bold tracking-wider px-1.5 py-0.5 bg-zinc-950 border border-zinc-800">{c?.cat}</span></td>
                    })}
                  </tr>
                  <tr>
                    <td className="p-2 border-b border-zinc-800/50 text-zinc-400">Price</td>
                    {compareIds.map(id => {
                      const c = allComps.find(x => x.id === id);
                      return <td key={id} className="p-2 border-b border-zinc-800/50 text-amber-500 font-semibold">₹{c?.price || '—'}</td>
                    })}
                  </tr>
                  <tr>
                    <td className="p-2 border-b border-zinc-800/50 text-zinc-400">Tier</td>
                    {compareIds.map(id => {
                      const c = allComps.find(x => x.id === id);
                      return <td key={id} className="p-2 border-b border-zinc-800/50">Tier {c?.tier}</td>
                    })}
                  </tr>
                  <tr>
                    <td className="p-2 border-b border-zinc-800/50 text-zinc-400">Tags</td>
                    {compareIds.map(id => {
                      const c = allComps.find(x => x.id === id);
                      return <td key={id} className="p-2 border-b border-zinc-800/50">{(c?.tags || []).join(', ')}</td>
                    })}
                  </tr>
                  <tr>
                    <td className="p-2 border-b border-zinc-800/50 text-zinc-400">Notes</td>
                    {compareIds.map(id => {
                      const c = allComps.find(x => x.id === id);
                      return <td key={id} className="p-2 border-b border-zinc-800/50 text-zinc-300">{c?.note}</td>
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowCompareModal(false)} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Component Modal */}
      {showAddModal && <AddComponentModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

function AddComponentModal({ onClose }: { onClose: () => void }) {
  const { dbExtra, setDbExtra, showToast } = useAppContext();
  const [name, setName] = useState('');
  const [cat, setCat] = useState('mcu');
  const [tier, setTier] = useState('1');
  const [note, setNote] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [datasheet, setDatasheet] = useState('');

  const submit = () => {
    if (!name.trim()) { showToast('Name required', 'error'); return; }
    const comp: ComponentDef = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      cat,
      tier: parseInt(tier),
      note: note.trim(),
      price: parseFloat(price) || 0,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      datasheet: datasheet.trim(),
      verified: false
    };
    setDbExtra([...dbExtra, comp]);
    showToast(`${name} added to database`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold font-sans mb-5">Submit a Component</h3>
        <div className="mb-3">
          <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Component Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. ESP32-WROOM-32E" className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Category *</label>
            <select value={cat} onChange={e => setCat(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none">
              {CATS.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Starter Tier *</label>
            <select value={tier} onChange={e => setTier(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none">
              <option value="1">Tier 1 — Essential</option>
              <option value="2">Tier 2 — Intermediate</option>
              <option value="3">Tier 3 — Advanced</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Description / Specs</label>
          <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Dual-core 240MHz, WiFi+BT" className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Price (₹)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="350" className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Interfaces / Tags</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="I2C, SPI, UART" className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-500 mb-1.5">Datasheet URL</label>
          <input type="text" value={datasheet} onChange={e => setDatasheet(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-zinc-700 text-xs py-2 px-3 focus:border-amber-500 outline-none" />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-zinc-700 hover:border-amber-500 hover:text-amber-500">Cancel</button>
          <button onClick={submit} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400">Submit Component</button>
        </div>
      </div>
    </div>
  );
}
