export interface ComponentDef {
  id: string;
  name: string;
  cat: string;
  tier: number;
  note: string;
  price: number;
  tags?: string[];
  pairs?: string[];
  datasheet?: string;
  verified: boolean;
  wtb?: { robu?: string; amazon?: string; ali?: string };
}

export interface InventoryItem {
  id: number;
  refId: string | null;
  name: string;
  cat: string;
  qty: number;
  unit: string;
  price: number;
  notes: string;
  loc: string;
  cond: string;
}

export interface BomItem {
  id: number;
  refId: string | null;
  name: string;
  cat?: string;
  qty: number;
  price?: number;
  status: 'have' | 'need' | 'ordered';
  notes?: string;
}

export interface Project {
  id: number;
  name: string;
  desc?: string;
  items: BomItem[];
}
