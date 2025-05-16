
import React, { useState } from "react";
import { PageHeader } from "../common/PageHeader";
import { SearchBar } from "../common/SearchBar";
import { DataTable } from "../common/DataTable";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecordSaleForm } from "./RecordSaleForm";
import { toast } from "@/hooks/use-toast";
import { Sale, Product } from "@/types";

export const SalesTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("week");
  const [recordSaleOpen, setRecordSaleOpen] = useState(false);

  // Mock products data for sales
  const [products, setProducts] = useState<Product[]>([
    {
      id: "p1",
      name: "Girls Summer Dress - Floral",
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
      name: "Boys T-Shirt - Dinosaur",
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
      name: "Girls Leggings - Stars",
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
      name: "Maternity Dress - Solid Blue",
      category: "mothers",
      type: "dress",
      design: "Solid Blue",
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
      name: "Maternity Top - Striped",
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
      name: "Boys Shorts - Cargo",
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

  // Mock sales data
  const [salesData, setSalesData] = useState<Sale[]>([
    {
      id: "s1",
      productId: "p1",
      productName: "Girls Summer Dress - Floral (3-4Y)",
      quantity: 3,
      dateSold: "2025-05-15",
      location: "Main Store",
    },
    {
      id: "s2",
      productId: "p5",
      productName: "Maternity Top - Striped (L)",
      quantity: 1,
      dateSold: "2025-05-14",
      location: "Online",
    },
    {
      id: "s3",
      productId: "p6",
      productName: "Boys Shorts - Cargo (4-5Y)",
      quantity: 2,
      dateSold: "2025-05-14",
      location: "Main Store",
    },
    {
      id: "s4",
      productId: "p2",
      productName: "Boys T-Shirt - Dinosaur (5-6Y)",
      quantity: 4,
      dateSold: "2025-05-13",
      location: "Online",
    },
    {
      id: "s5",
      productId: "p4",
      productName: "Maternity Dress - Solid Blue (M)",
      quantity: 2,
      dateSold: "2025-05-12",
      location: "Main Store",
    },
    {
      id: "s6",
      productId: "p3",
      productName: "Girls Leggings - Stars (7-8Y)",
      quantity: 3,
      dateSold: "2025-05-10",
      location: "Online",
    },
  ]);

  // Calculate summary data
  const calculateSummary = () => {
    const totalSales = salesData.reduce((acc, sale) => acc + sale.quantity, 0);
    
    const childrenSales = salesData
      .filter(sale => {
        const product = products.find(p => p.id === sale.productId);
        return product && product.category === "children";
      })
      .reduce((acc, sale) => acc + sale.quantity, 0);
    
    const mothersSales = salesData
      .filter(sale => {
        const product = products.find(p => p.id === sale.productId);
        return product && product.category === "mothers";
      })
      .reduce((acc, sale) => acc + sale.quantity, 0);
    
    // Find top selling product
    const productSales = products.map(product => {
      const salesCount = salesData
        .filter(sale => sale.productId === product.id)
        .reduce((acc, sale) => acc + sale.quantity, 0);
      return { id: product.id, name: product.name, salesCount };
    });
    
    productSales.sort((a, b) => b.salesCount - a.salesCount);
    const topSellingProduct = productSales.length > 0 ? productSales[0].name : "None";
    
    // Determine top selling category
    const topSellingCategory = childrenSales > mothersSales ? "Children's Apparel" : "Mother's Apparel";
    
    return {
      totalSales,
      childrenSales,
      mothersSales,
      topSellingProduct,
      topSellingCategory,
    };
  };

  const summaryData = calculateSummary();

  const filteredSales = salesData.filter((sale) =>
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecordSale = (newSale: Sale) => {
    // Add the new sale to the sales data
    setSalesData([newSale, ...salesData]);
    
    // Update product inventory by decreasing the stock
    const updatedProducts = products.map(product => {
      if (product.id === newSale.productId) {
        return {
          ...product,
          inStock: product.inStock - newSale.quantity
        };
      }
      return product;
    });
    
    // Update the products state with the new inventory levels
    setProducts(updatedProducts);
    
    // Show a success toast with details about the stock update
    toast({
      title: "Sale Recorded Successfully",
      description: `${newSale.quantity} units sold. Inventory updated.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Tracker"
        description="Track your product sales and inventory updates"
        action={
          <Button 
            className="bg-inventory-blue hover:bg-inventory-blue-dark"
            onClick={() => setRecordSaleOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Record Sale
          </Button>
        }
      />

      <RecordSaleForm
        open={recordSaleOpen}
        onOpenChange={setRecordSaleOpen}
        onRecordSale={handleRecordSale}
        products={products}
      />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Children's Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.childrenSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mother's Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.mothersSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Selling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">{summaryData.topSellingProduct}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Recent Sales
          </CardTitle>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <SearchBar placeholder="Search sales..." onChange={setSearchTerm} />
          </div>
          
          <DataTable
            columns={[
              { header: "Product", accessorKey: "productName" },
              { header: "Quantity", accessorKey: "quantity" },
              { header: "Date Sold", accessorKey: "dateSold" },
              { header: "Location", accessorKey: "location" },
            ]}
            data={filteredSales}
            emptyState={
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <p>No sales found for this period</p>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};
