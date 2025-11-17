
export interface Placement {
  id: string;
  name: string;
  description: string;
}

// FIX: Added missing Background interface required by BackgroundSelector.tsx
export interface Background {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  placements: Placement[];
}

export interface Mockup {
  product: Product;
  placement: Placement;
  imageUrl: string;
  printFileUrl?: string;
}
