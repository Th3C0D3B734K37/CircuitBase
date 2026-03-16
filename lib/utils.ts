import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ComponentDef } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const filterComponents = (
  components: ComponentDef[],
  search: string,
  categoryFilter: string,
  tierFilter: string,
  interfaceFilter: string
): ComponentDef[] => {
  const query = search.toLowerCase();
  
  return components.filter(component => {
    const matchesCategory = categoryFilter === 'all' || component.cat === categoryFilter;
    const matchesTier = !tierFilter || String(component.tier) === tierFilter;
    const matchesInterface = !interfaceFilter || 
      (component.tags || []).some(tag => tag.toLowerCase() === interfaceFilter.toLowerCase());
    const matchesSearch = !query || 
      component.name.toLowerCase().includes(query) ||
      component.note.toLowerCase().includes(query) ||
      (component.tags || []).join(' ').toLowerCase().includes(query);
    
    return matchesCategory && matchesTier && matchesInterface && matchesSearch;
  });
};

export const getComponentById = (
  components: ComponentDef[],
  id: string
): ComponentDef | undefined => {
  return components.find(component => component.id === id);
};

export const getComponentsByIds = (
  components: ComponentDef[],
  ids: string[]
): ComponentDef[] => {
  return ids.map(id => getComponentById(components, id)).filter(Boolean) as ComponentDef[];
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
