
import React, { useState } from "react";
import { PageHeader } from "../common/PageHeader";
import { SearchBar } from "../common/SearchBar";
import { DataTable } from "../common/DataTable";
import { Button } from "@/components/ui/button";
import { Box, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types";

export const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: "p1",
      name: "Girls Summer Dress",
      category: "children",
      type: "dress",
      design: "Floral",
      size: "3-4Y",
      color: "Pink",
      gender: "Girl",
      age: "3-4Y",
      inStock: 24,
      manufacturerId: "m1",
      manufacturerName: "Kids Clothing Inc",
      dateReceived: "2025-05-10",
    },
    {
      id: "p2",
      name: "Boys T-Shirt",
      category: "children",
      type: "shirt",
      design: "Dinosaur",
      size: "5-6Y",
      color: "Blue",
      gender: "Boy",
      age: "5-6Y",
      inStock: 36,
      manufacturerId: "m2",
      manufacturerName: "Tiny Trends",
      dateReceived: "2025-05-08",
    },
    {
      id: "p3",
      name: "Girls Leggings",
      category: "children",
      type: "pants",
      design: "Stars",
      size: "7-8Y",
      color: "Purple",
      gender: "Girl",
      age: "7-8Y",
      inStock: 18,
      manufacturerId: "m1",
      manufacturerName: "Kids Clothing Inc",
      dateReceived: "2025-05-05",
    },
    {
      id: "p4",
      name: "Maternity Dress",
      category: "mothers",
      type: "dress",
      design: "Solid",
      size: "M",
      color: "Blue",
      gender: "Women",
      age: "Adult",
      inStock: 12,
      manufacturerId: "m3",
      manufacturerName: "Maternal Comfort",
      dateReceived: "2025-05-12",
    },
    {
      id: "p5",
      name: "Maternity Top",
      category: "mothers",
      type: "top",
      design: "Striped",
      size: "L",
      color: "White/Blue",
      gender: "Women",
      age: "Adult",
      inStock: 15,
      manufacturerId: "m3",
      manufacturerName: "Maternal Comfort",
      dateReceived: "2025-05-11",
    },
    {
      id: "p6",
      name: "Boys Shorts",
      category: "children",
      type: "shorts",
      design: "Cargo",
      size: "4-5Y",
      color: "Khaki",
      gender: "Boy",
      age: "4-5Y",
      inStock: 22,
      manufacturerId: "m2",
      manufacturerName: "Tiny Trends",
      dateReceived: "2025-05-09",
    },
  ]);

  // Comprehensive search function that searches all fields
  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.type.toLowerCase().includes(searchLower) ||
      product.design.toLowerCase().includes(searchLower) ||
      product.size.toLowerCase().includes(searchLower) ||
      product.color.toLowerCase().includes(searchLower) ||
      product.inStock.toString().includes(searchLower) ||
      product.manufacturerName.toLowerCase().includes(searchLower) ||
      product.dateReceived.toLowerCase().includes(searchLower) ||
      product.gender.toLowerCase().includes(searchLower) ||
      product.age.toLowerCase().includes(searchLower)
    );
  });

  // Consolidate products with the same name, category, color, design, and size
  const consolidatedProducts = React.useMemo(() => {
    const productMap = new Map<string, {
      name: string;
      category: 'children' | 'mothers';
      color: string;
      design: string;
      size: string;
      gender: string;
      age: string;
      type: string;
      totalInStock: number;
    }>();
    
    filteredProducts.forEach(product => {
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
  }, [filteredProducts]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consolidated Inventory"
        description="View consolidated inventory across all product variants"
        action={
          <Button 
            variant="outline"
            className="border-inventory-blue text-inventory-blue hover:bg-inventory-blue hover:text-white"
            onClick={() => {
              toast({
                title: "Inventory Data",
                description: `Showing ${consolidatedProducts.length} consolidated product groups`,
              });
            }}
          >
            <Package className="mr-2 h-4 w-4" /> Refresh Inventory
          </Button>
        }
      />

      <div className="mb-4">
        <SearchBar 
          placeholder="Search across all inventory data..." 
          onChange={setSearchTerm} 
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Search across product name, category, type, design, size, color, stock count, manufacturer, gender, and age
        </p>
      </div>
      
      <DataTable
        columns={[
          { header: "Product", accessorKey: "name" },
          {
            header: "Category",
            accessorKey: "category",
            cell: (value) => (
              <Badge variant="outline" className="capitalize">
                {value}
              </Badge>
            ),
          },
          { header: "Gender", accessorKey: "gender" },
          { header: "Age", accessorKey: "age" },
          { header: "Type", accessorKey: "type",
            cell: (value) => value.charAt(0).toUpperCase() + value.slice(1)
          },
          { header: "Design", accessorKey: "design" },
          { header: "Size", accessorKey: "size" },
          { header: "Color", accessorKey: "color" },
          { 
            header: "Total In Stock", 
            accessorKey: "totalInStock",
            cell: (value) => (
              <span className={`font-medium ${value < 10 ? 'text-red-500' : ''}`}>
                {value}
              </span>
            ),
          },
        ]}
        data={consolidatedProducts}
        emptyState={
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Box className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="mb-2">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search term</p>
          </div>
        }
      />
    </div>
  );
};
