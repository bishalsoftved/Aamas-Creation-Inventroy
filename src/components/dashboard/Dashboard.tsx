
import React from "react";
import { PageHeader } from "../common/PageHeader";
import { StatsCard } from "./StatsCard";
import { DataTable } from "../common/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, ShoppingBag, Database, Users, AlertTriangle } from "lucide-react";

export const Dashboard = () => {
  // Mock data for dashboard
  const statsData = [
    {
      title: "Total Materials",
      value: "248",
      icon: <Database className="h-4 w-4" />,
      change: 12,
    },
    {
      title: "Low Stock Materials",
      value: "8",
      icon: <AlertTriangle className="h-4 w-4" />,
      change: -5,
    },
    {
      title: "Total Products",
      value: "1,284",
      icon: <Box className="h-4 w-4" />,
      change: 8,
    },
    {
      title: "Sales (This Month)",
      value: "342",
      icon: <ShoppingBag className="h-4 w-4" />,
      change: 14,
    },
  ];

  const lowStockMaterials = [
    { name: "Cotton Fabric (White)", inStock: 12, minimum: 20, supplier: "Fabrics Co" },
    { name: "Buttons (Small)", inStock: 50, minimum: 100, supplier: "Button World" },
    { name: "Elastic Band", inStock: 30, minimum: 50, supplier: "Elastic Suppliers" },
  ];

  const recentProducts = [
    { name: "Girls Summer Dress", design: "Floral", size: "3-4Y", quantity: 24, manufacturer: "Kids Clothing Inc" },
    { name: "Boys T-Shirt", design: "Dinosaur", size: "5-6Y", quantity: 36, manufacturer: "Tiny Trends" },
    { name: "Maternity Dress", design: "Solid Blue", size: "M", quantity: 18, manufacturer: "Maternal Comfort" },
  ];

  const recentSales = [
    { product: "Girls Summer Dress", design: "Floral", size: "3-4Y", quantity: 3, date: "May 15, 2025" },
    { product: "Maternity Top", design: "Striped", size: "L", quantity: 1, date: "May 14, 2025" },
    { product: "Boys Shorts", design: "Cargo", size: "4-5Y", quantity: 2, date: "May 14, 2025" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your inventory and recent activity" 
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Low Stock Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { header: "Material", accessorKey: "name" },
                { header: "In Stock", accessorKey: "inStock" },
                { header: "Minimum", accessorKey: "minimum" },
                { header: "Supplier", accessorKey: "supplier" },
              ]}
              data={lowStockMaterials}
              emptyState={
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No low stock materials
                </div>
              }
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="products">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="products">Recent Products</TabsTrigger>
            <TabsTrigger value="sales">Recent Sales</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <Card className="border-t-0 rounded-tl-none rounded-tr-none">
              <CardContent className="pt-6">
                <DataTable
                  columns={[
                    { header: "Product", accessorKey: "name" },
                    { header: "Design", accessorKey: "design" },
                    { header: "Size", accessorKey: "size" },
                    { header: "Quantity", accessorKey: "quantity" },
                    { header: "Manufacturer", accessorKey: "manufacturer" },
                  ]}
                  data={recentProducts}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sales">
            <Card className="border-t-0 rounded-tl-none rounded-tr-none">
              <CardContent className="pt-6">
                <DataTable
                  columns={[
                    { header: "Product", accessorKey: "product" },
                    { header: "Design", accessorKey: "design" },
                    { header: "Size", accessorKey: "size" },
                    { header: "Quantity", accessorKey: "quantity" },
                    { header: "Date", accessorKey: "date" },
                  ]}
                  data={recentSales}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
