
import React, { useState } from "react";
import { PageHeader } from "../common/PageHeader";
import { SearchBar } from "../common/SearchBar";
import { DataTable } from "../common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Plus, Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Material } from "@/types";
import { AddMaterialForm } from "./AddMaterialForm";
import { toast } from "@/hooks/use-toast";

export const MaterialsInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  
  // Mock materials data
  const [materialsData, setMaterialsData] = useState<Material[]>([
    {
      id: "m1",
      name: "Cotton Fabric - White",
      type: "fabric",
      unit: "meters",
      inStock: 120,
      minimumStock: 50,
      supplierId: "s1",
      supplierName: "Fabrics Co",
      lastRestocked: "2025-05-01",
    },
    {
      id: "m2",
      name: "Cotton Fabric - Blue",
      type: "fabric",
      unit: "meters",
      inStock: 85,
      minimumStock: 50,
      supplierId: "s1",
      supplierName: "Fabrics Co",
      lastRestocked: "2025-05-01",
    },
    {
      id: "m3",
      name: "Buttons - Small",
      type: "accessory",
      unit: "pieces",
      inStock: 500,
      minimumStock: 200,
      supplierId: "s2",
      supplierName: "Button World",
      lastRestocked: "2025-05-05",
    },
    {
      id: "m4",
      name: "Elastic Band",
      type: "accessory",
      unit: "meters",
      inStock: 30,
      minimumStock: 50,
      supplierId: "s3",
      supplierName: "Elastic Suppliers",
      lastRestocked: "2025-05-03",
    },
    {
      id: "m5",
      name: "Thread - White",
      type: "thread",
      unit: "spools",
      inStock: 45,
      minimumStock: 20,
      supplierId: "s4",
      supplierName: "Thread Masters",
      lastRestocked: "2025-04-28",
    },
    {
      id: "m6",
      name: "Thread - Black",
      type: "thread",
      unit: "spools",
      inStock: 38,
      minimumStock: 20,
      supplierId: "s4",
      supplierName: "Thread Masters",
      lastRestocked: "2025-04-28",
    },
  ]);

  const materialTypes = ["all", "fabric", "thread", "accessory"];

  const filteredMaterials = materialsData
    .filter((material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (material) => selectedType === "all" || material.type === selectedType
    );
    
  const handleAddMaterial = (newMaterial: Material) => {
    setMaterialsData([...materialsData, newMaterial]);
    setIsAddMaterialOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Materials Inventory"
        description="Manage your raw materials stock"
        action={
          <Button 
            className="bg-inventory-blue hover:bg-inventory-blue-dark"
            onClick={() => setIsAddMaterialOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Material
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          placeholder="Search materials..."
          onChange={setSearchTerm}
        />

        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Material type" />
            </SelectTrigger>
            <SelectContent>
              {materialTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={[
          { header: "Material", accessorKey: "name" },
          {
            header: "Type",
            accessorKey: "type",
            cell: (value) => (
              <Badge variant="outline" className="capitalize">
                {value}
              </Badge>
            ),
          },
          { header: "In Stock", accessorKey: "inStock" },
          { header: "Unit", accessorKey: "unit" },
          { header: "Minimum Stock", accessorKey: "minimumStock" },
          { header: "Supplier", accessorKey: "supplierName" },
          { header: "Last Restocked", accessorKey: "lastRestocked" },
        ]}
        data={filteredMaterials}
        emptyState={
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="mb-2">No materials found</p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddMaterialOpen(true)}
            >
              Add your first material
            </Button>
          </div>
        }
      />

      <Sheet open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Add New Material</SheetTitle>
            <SheetDescription>
              Fill in the details to add a new material to inventory.
            </SheetDescription>
          </SheetHeader>
          <AddMaterialForm 
            onSuccess={handleAddMaterial} 
            onCancel={() => setIsAddMaterialOpen(false)} 
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
