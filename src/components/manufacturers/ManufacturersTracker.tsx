import React, { useState } from "react";
import { PageHeader } from "../common/PageHeader";
import { SearchBar } from "../common/SearchBar";
import { DataTable } from "../common/DataTable";
import { Button } from "@/components/ui/button";
import { Users, Plus, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddManufacturerForm } from "./AddManufacturerForm";
import { AddAllocationForm } from "./AddAllocationForm";
import { toast } from "@/hooks/use-toast";
import type { Manufacturer, MaterialAllocation, Material } from "@/types";

export const ManufacturersTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addManufacturerOpen, setAddManufacturerOpen] = useState(false);
  const [addAllocationOpen, setAddAllocationOpen] = useState(false);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([
    {
      id: "m1",
      name: "Kids Clothing Inc",
      contact: "contact@kidsclothing.com",
      phone: 9898989898,
      specialization: "Children's Apparel",
      activeOrders: 3,
      type: "Production House",
    },
    {
      id: "m2",
      name: "Tiny Trends",
      contact: "info@tinytrends.com",
      phone: 9898989892,
      specialization: "Children's Casual Wear",
      activeOrders: 2,
      type: "Production House",
    },
    {
      id: "m3",
      name: "Maternal Comfort",
      contact: "orders@maternalcomfort.com",
      phone: 9898989893,
      specialization: "Maternity Wear",
      activeOrders: 4,
      type: "Home Based Worker",
    },
    {
      id: "m4",
      name: "Baby Elegance",
      contact: "production@babyelegance.com",
      phone: 9898989890,
      specialization: "Infant Clothing",
      activeOrders: 1,
      type: "Home Based Worker",
    },
  ]);

  // Mock materials data for allocations form
  const [materialsData, setMaterialsData] = useState<Material[]>([
    {
      id: "m1",
      name: "Cotton Fabric - White",
      type: "fabric",
      unit: "meters",
      inStock: 200,
      minimumStock: 50,
      supplierId: "s1",
      supplierName: "Textiles Inc",
      lastRestocked: "2025-05-01",
    },
    {
      id: "m2",
      name: "Cotton Fabric - Blue",
      type: "fabric",
      unit: "meters",
      inStock: 150,
      minimumStock: 50,
      supplierId: "s1",
      supplierName: "Textiles Inc",
      lastRestocked: "2025-05-02",
    },
    {
      id: "m3",
      name: "Buttons - Small",
      type: "accessory",
      unit: "pieces",
      inStock: 500,
      minimumStock: 100,
      supplierId: "s2",
      supplierName: "Crafts Supplies Ltd",
      lastRestocked: "2025-04-28",
    },
    {
      id: "m4",
      name: "Thread - Black",
      type: "thread",
      unit: "rolls",
      inStock: 30,
      minimumStock: 10,
      supplierId: "s2",
      supplierName: "Crafts Supplies Ltd",
      lastRestocked: "2025-04-30",
    },
    {
      id: "m5",
      name: "Thread - White",
      type: "thread",
      unit: "rolls",
      inStock: 35,
      minimumStock: 10,
      supplierId: "s2",
      supplierName: "Crafts Supplies Ltd",
      lastRestocked: "2025-05-03",
    },
  ]);

  // Mock material allocations
  const [allocationsData, setAllocationsData] = useState<MaterialAllocation[]>([
    {
      id: "a1",
      materialId: "m1",
      materialName: "Cotton Fabric - White",
      manufacturerId: "m1",
      manufacturerName: "Kids Clothing Inc",
      quantity: 50,
      dateAllocated: "2025-05-05",
      orderReference: "ORD-2505-01",
      note: "For summer collection",
    },
    {
      id: "a2",
      materialId: "m2",
      materialName: "Cotton Fabric - Blue",
      manufacturerId: "m2",
      manufacturerName: "Tiny Trends",
      quantity: 30,
      dateAllocated: "2025-05-08",
      orderReference: "ORD-2505-02",
      note: "Urgent order",
    },
    {
      id: "a3",
      materialId: "m5",
      materialName: "Thread - White",
      manufacturerId: "m1",
      manufacturerName: "Kids Clothing Inc",
      quantity: 10,
      dateAllocated: "2025-05-05",
      orderReference: "ORD-2505-01",
      note: "",
    },
    {
      id: "a4",
      materialId: "m3",
      materialName: "Buttons - Small",
      manufacturerId: "m3",
      manufacturerName: "Maternal Comfort",
      quantity: 200,
      dateAllocated: "2025-05-10",
      orderReference: "ORD-2505-03",
      note: "For upcoming collection",
    },
  ]);

  const filteredManufacturers = manufacturers.filter((manufacturer) =>
    manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddManufacturer = (newManufacturer: Manufacturer) => {
    setManufacturers([...manufacturers, newManufacturer]);
  };

  const handleAddAllocation = (newAllocation: MaterialAllocation) => {
    setAllocationsData([...allocationsData, newAllocation]);
    
    // Update material stock
    setMaterialsData(materialsData.map(material => {
      if (material.id === newAllocation.materialId) {
        const updatedStock = material.inStock - newAllocation.quantity;
        if (updatedStock < 0) {
          toast({
            title: "Warning",
            description: `${material.name} stock is now negative (${updatedStock})`,
            variant: "destructive"
          });
          return {
            ...material,
            inStock: 0
          };
        }
        return {
          ...material,
          inStock: updatedStock
        };
      }
      return material;
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manufacturers & Allocations"
        description="Manage your manufacturers and material allocations"
        action={
          <Button 
            className="bg-inventory-blue hover:bg-inventory-blue-dark"
            onClick={() => setAddManufacturerOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Manufacturer
          </Button>
        }
      />

      <AddManufacturerForm
        open={addManufacturerOpen}
        onOpenChange={setAddManufacturerOpen}
        onAddManufacturer={handleAddManufacturer}
      />
      
      <AddAllocationForm
        open={addAllocationOpen}
        onOpenChange={setAddAllocationOpen}
        onAddAllocation={handleAddAllocation}
        manufacturers={manufacturers}
        materials={materialsData}
      />

      <Tabs defaultValue="manufacturers">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="manufacturers">Manufacturers</TabsTrigger>
          <TabsTrigger value="allocations">Material Allocations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manufacturers" className="mt-6">
          <div className="mb-4">
            <SearchBar placeholder="Search manufacturers..." onChange={setSearchTerm} />
          </div>
          
          <DataTable
            columns={[
              { header: "Name", accessorKey: "name" },
              { header: "Contact", accessorKey: "contact" },
              { header: "Phone", accessorKey: "phone" },
              { header: "Specialization", accessorKey: "specialization" },
              { header: "Type", accessorKey: "type" },
              {
                header: "Active Orders",
                accessorKey: "activeOrders",
                cell: (value) => (
                  <Badge variant={value > 0 ? "default" : "outline"} className={value > 0 ? "bg-inventory-blue" : ""}>
                    {value}
                  </Badge>
                ),
              },
              {
                header: "Actions",
                accessorKey: "id",
                cell: () => (
                  <Button variant="ghost" size="sm">
                    View Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ),
              },
            ]}
            data={filteredManufacturers}
            emptyState={
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="mb-2">No manufacturers found</p>
                <Button 
                  variant="outline"
                  onClick={() => setAddManufacturerOpen(true)}
                >
                  Add your first manufacturer
                </Button>
              </div>
            }
          />
        </TabsContent>
        
        <TabsContent value="allocations" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Material Allocations</h3>
                <Button 
                  variant="outline" 
                  onClick={() => setAddAllocationOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> New Allocation
                </Button>
              </div>
              
              <DataTable
                columns={[
                  { header: "Material", accessorKey: "materialName" },
                  { header: "Manufacturer", accessorKey: "manufacturerName" },
                  { header: "Quantity", accessorKey: "quantity" },
                  { header: "Date Allocated", accessorKey: "dateAllocated" },
                  { header: "Order Ref", accessorKey: "orderReference" },
                  { header: "Note", accessorKey: "note" },
                ]}
                data={allocationsData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
