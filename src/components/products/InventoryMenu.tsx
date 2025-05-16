
import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Box, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types";

interface InventoryMenuProps {
  products: Product[];
  onClose: () => void;
}

interface ConsolidatedProduct {
  name: string;
  category: 'children' | 'mothers';
  color: string;
  design: string;
  size: string;
  gender: string;
  age: string;
  type: string;
  totalInStock: number;
}

export const InventoryMenu = ({ products, onClose }: InventoryMenuProps) => {
  // Consolidate products with the same name, category, color, design, size, gender, age, and type
  const consolidatedProducts = useMemo(() => {
    const productMap = new Map<string, ConsolidatedProduct>();
    
    products.forEach(product => {
      const key = `${product.name}-${product.category}-${product.color}-${product.design}-${product.size}-${product.gender}-${product.age}-${product.type}`;
      
      if (productMap.has(key)) {
        const existingProduct = productMap.get(key)!;
        existingProduct.totalInStock += product.inStock;
      } else {
        productMap.set(key, {
          name: product.name,
          category: product.category,
          color: product.color,
          design: product.design,
          size: product.size,
          gender: product.gender,
          age: product.age,
          type: product.type,
          totalInStock: product.inStock
        });
      }
    });
    
    return Array.from(productMap.values());
  }, [products]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-inventory-blue" />
            <h2 className="text-xl font-bold">Consolidated Inventory</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="overflow-auto flex-1 p-4">
          {consolidatedProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Design</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Total In Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consolidatedProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.gender}</TableCell>
                    <TableCell>{product.age}</TableCell>
                    <TableCell>{product.type.charAt(0).toUpperCase() + product.type.slice(1)}</TableCell>
                    <TableCell>{product.design}</TableCell>
                    <TableCell>{product.size}</TableCell>
                    <TableCell>{product.color}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${product.totalInStock < 10 ? 'text-red-500' : ''}`}>
                        {product.totalInStock}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Box className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>No products found</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {consolidatedProducts.length} {consolidatedProducts.length === 1 ? 'product' : 'products'} in inventory
            </div>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
