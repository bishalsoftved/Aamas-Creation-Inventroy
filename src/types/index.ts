
// Material Types
export interface Material {
  id: string;
  name: string;
  type: string; // fabric, thread, button, etc.
  unit: string; // meters, pieces, etc.
  inStock: number;
  minimumStock: number;
  supplierId: string;
  supplierName: string;
  lastRestocked: string;
}

// Manufacturer Types
export interface Manufacturer {
  id: string;
  name: string;
  contact: string;
  phone: number;
  specialization: string;
  activeOrders: number;
  type: 'Home Based Worker' | 'Production House'; // Added this field
}

export interface MaterialAllocation {
  id: string;
  materialId: string;
  materialName: string;
  manufacturerId: string;
  manufacturerName: string;
  quantity: number;
  dateAllocated: string;
  orderReference: string;
  note?: string; // Added note field
}

// Product Types
export interface Product {
  id: string;
  name: string;
  category: 'children' | 'mothers';
  type: string; // dress, shirt, etc.
  design: string;
  size: string;
  color: string;
  gender: string; // Added gender field
  age: string; // Added age field
  inStock: number;
  manufacturerId: string;
  manufacturerName: string;
  dateReceived: string;
}

// Sales Types
export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  dateSold: string;
  location: string;
}

// Dashboard Types
export interface DashboardStat {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
}
