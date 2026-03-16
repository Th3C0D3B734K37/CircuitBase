# CircuitBase API Documentation

This document describes the internal API and data structures used in CircuitBase.

## Data Types

### ComponentDef

```typescript
interface ComponentDef {
  id: string;                    // Unique identifier
  name: string;                  // Component name
  cat: string;                   // Category (mcu, display, sensor, etc.)
  tier: number;                  // 1 = Essential, 2 = Intermediate, 3 = Advanced
  note: string;                  // Description and specifications
  price: number;                 // Price in INR
  tags?: string[];               // Technical tags and interfaces
  pairs?: string[];              // Compatible component IDs
  datasheet?: string;            // Link to manufacturer datasheet
  verified: boolean;              // Community verified status
  wtb?: {                       // Where to buy links
    robu?: string;              // Robu.in product link
    amazon?: string;             // Amazon product link
    ali?: string;                // AliExpress product link
  };
}
```

### InventoryItem

```typescript
interface InventoryItem {
  id: number;                     // Unique inventory ID
  refId: string;                  // Reference to component ID
  name: string;                    // Component name
  cat: string;                     // Component category
  qty: number;                     // Quantity in stock
  unit: string;                    // Unit (pcs, meters, etc.)
  price: number;                    // Unit price
  loc: string;                     // Storage location
  cond: string;                    // Condition (New, Used, etc.)
  notes: string;                    // Additional notes
}
```

### Project

```typescript
interface Project {
  id: number;                      // Unique project ID
  name: string;                    // Project name
  items: ProjectItem[];             // Project components
  created: Date;                    // Creation date
  updated: Date;                    // Last update date
}
```

### ProjectItem

```typescript
interface ProjectItem {
  id: number;                      // Unique item ID
  refId: string;                  // Reference to component ID
  name: string;                    // Component name
  cat: string;                     // Component category
  qty: number;                     // Required quantity
  price: number;                    // Unit price
  status: 'need' | 'ordered' | 'received'; // Item status
}
```

## Constants

### Categories

```typescript
const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'mcu', label: 'MCU' },
  { id: 'display', label: 'Display' },
  { id: 'sensor', label: 'Sensor' },
  { id: 'rf', label: 'RF' },
  { id: 'power', label: 'Power' },
  { id: 'io', label: 'I/O' },
  { id: 'active', label: 'Active' },
  { id: 'passive', label: 'Passive' },
  { id: 'proto', label: 'Proto' },
  { id: 'mechanical', label: 'Mechanical' },
  { id: 'material', label: 'Material' }
];
```

### Tiers

```typescript
const TIERS = [
  { value: 1, label: 'Tier 1 — Essential' },
  { value: 2, label: 'Tier 2 — Intermediate' },
  { value: 3, label: 'Tier 3 — Advanced' }
];
```

### Interfaces

```typescript
const INTERFACES = [
  { value: 'I2C', label: 'I2C' },
  { value: 'SPI', label: 'SPI' },
  { value: 'UART', label: 'UART' },
  { value: 'PWM', label: 'PWM' },
  { value: 'analog', label: 'Analog' }
];
```

## Utility Functions

### filterComponents

Filters components based on search criteria.

```typescript
filterComponents(
  components: ComponentDef[],
  search: string,
  categoryFilter: string,
  tierFilter: string,
  interfaceFilter: string
): ComponentDef[]
```

### getComponentById

Retrieves a component by its ID.

```typescript
getComponentById(
  components: ComponentDef[],
  id: string
): ComponentDef | undefined
```

### formatPrice

Formats price as Indian Rupees.

```typescript
formatPrice(price: number): string
```

## Component Data

### Adding New Components

Components are stored in `lib/data.ts`. Follow this structure:

```typescript
{
  id: 'unique-id',
  name: 'Component Name',
  cat: 'category',
  tier: 1,
  note: 'Detailed description',
  price: 100,
  tags: ['tag1', 'tag2'],
  pairs: ['compatible-component-id'],
  datasheet: 'https://manufacturer.com/datasheet.pdf',
  verified: true,
  wtb: {
    robu: 'https://robu.in/product/...',
    amazon: 'https://amazon.com/...',
    ali: 'https://aliexpress.com/...'
  }
}
```

### Validation Rules

- `id` must be unique and URL-friendly
- `cat` must match one of the predefined categories
- `tier` must be 1, 2, or 3
- `price` must be a positive number
- `datasheet` must be a valid URL if provided
- `wtb` links must be valid URLs if provided

## State Management

### AppContext

The application uses React Context for global state management:

```typescript
interface AppContextType {
  // Component selection
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  
  // Inventory management
  inventory: InventoryItem[];
  setInventory: (items: InventoryItem[]) => void;
  
  // Project management
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  
  // UI state
  recentlyViewed: string[];
  setRecentlyViewed: (ids: string[]) => void;
  
  // Notifications
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}
```

## Component Hooks

### useComponents

Custom hook for component data management:

```typescript
const useComponents = () => {
  // Returns filtered components and utility functions
};
```

### useInventory

Custom hook for inventory management:

```typescript
const useInventory = () => {
  // Returns inventory state and management functions
};
```

## Data Persistence

### Local Storage

- Inventory data: `circuitbase-inventory`
- Project data: `circuitbase-projects`
- User preferences: `circuitbase-settings`

### Data Format

All data is stored as JSON strings and parsed on application load.

## Error Handling

### Validation Errors

Components are validated on data load. Invalid entries are logged to console and excluded from the database.

### Network Errors

External links (datasheets, purchase links) are handled with proper error boundaries to prevent application crashes.

## Performance Considerations

- Component list is virtualized for large datasets
- Search debouncing prevents excessive filtering
- Lazy loading for component details
- Memoization for expensive calculations

## Security Notes

- All external links open in new tabs with `rel="noreferrer"`
- No user data is transmitted to external services
- Local storage data is not encrypted (client-side only)
