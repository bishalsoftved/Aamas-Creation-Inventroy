
import React, { useState } from "react";
import { PageHeader } from "../common/PageHeader";
import { SearchBar } from "../common/SearchBar";
import { DataTable } from "../common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box, Plus, Filter, Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddProductForm } from "./AddProductForm";
import { InventoryMenu } from "./InventoryMenu";
import { toast } from "@/hooks/use-toast";
import type { Product, Manufacturer } from "@/types";

export const ProductsInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [inventoryMenuOpen, setInventoryMenuOpen] = useState(false);
  
  // Mock manufacturers data for the product form
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([
    {
      id: "m1",
      name: "Kids Clothing Inc",
      contact: "contact@kidsclothing.com",
      specialization: "Children's Apparel",
      activeOrders: 3,
      type: "Production House",
    },
    {
      id: "m2",
      name: "Tiny Trends",
      contact: "info@tinytrends.com",
      specialization: "Children's Casual Wear",
      activeOrders: 2,
      type: "Production House",
    },
    {
      id: "m3",
      name: "Maternal Comfort",
      contact: "orders@maternalcomfort.com",
      specialization: "Maternity Wear",
      activeOrders: 4,
      type: "Home Based Worker",
    },
    {
      id: "m4",
      name: "Baby Elegance",
      contact: "production@babyelegance.com",
      specialization: "Infant Clothing",
      activeOrders: 1,
      type: "Home Based Worker",
    },
  ]);

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

  const categories = ["all", "children", "mothers"];
  const genders = ["all", "Boy", "Girl", "Unisex", "Women"];
  const types = ["all", "dress", "shirt", "pants", "top", "shorts", "jacket", "skirt"];
  const sizes = ["all", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "S", "M", "L", "XL"];

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.age.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => selectedCategory === "all" || product.category === selectedCategory)
    .filter((product) => selectedSize === "all" || product.size === selectedSize)
    .filter((product) => selectedGender === "all" || product.gender === selectedGender)
    .filter((product) => selectedType === "all" || product.type === selectedType);

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const handleShowInventory = () => {
    setInventoryMenuOpen(true);
    toast({
      title: "Inventory Menu",
      description: "Showing consolidated inventory view",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products Inventory"
        description="Manage your finished products stock"
        action={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              className="border-inventory-blue text-inventory-blue hover:bg-inventory-blue hover:text-white"
              onClick={handleShowInventory}
            >
              <Package className="mr-2 h-4 w-4" /> Inventory Menu
            </Button>
            <Button 
              className="bg-inventory-blue hover:bg-inventory-blue-dark"
              onClick={() => setAddProductOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        }
      />

      <AddProductForm
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onAddProduct={handleAddProduct}
        manufacturers={manufacturers}
      />

      {inventoryMenuOpen && (
        <InventoryMenu 
          products={products}
          onClose={() => setInventoryMenuOpen(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar placeholder="Search products..." onChange={setSearchTerm} />

        <div className="grid grid-cols-2 sm:flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground col-span-2 hidden sm:block" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : 
                    category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedGender} onValueChange={setSelectedGender}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              {genders.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender === "all" ? "All Genders" : gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Types" : 
                   type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size === "all" ? "All Sizes" : size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          { header: "In Stock", accessorKey: "inStock" },
          { header: "Manufacturer", accessorKey: "manufacturerName" },
          { header: "Received Date", accessorKey: "dateReceived" },
        ]}
        data={filteredProducts}
        emptyState={
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Box className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="mb-2">No products found</p>
            <Button 
              variant="outline"
              onClick={() => setAddProductOpen(true)}
            >
              Add your first product
            </Button>
          </div>
        }
      />
    </div>
  );
};
