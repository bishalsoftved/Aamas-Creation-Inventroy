
import React, { useState, useMemo } from "react";
import { PageHeader } from "../common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "../common/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileChartLine, Download, Calendar, ArrowDownUp } from "lucide-react";
import { Product } from "@/types";
import { toast } from "@/hooks/use-toast";
import { format, subMonths } from "date-fns";

// Mock data - in a real app this would come from your database or API
const mockProductsData: Product[] = [
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
    inStock: 24, // Current stock
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
    type: "pants",
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
];

// Mock inventory movements for calculating opening balance
const mockInventoryMovements = [
  { productId: "p1", date: "2025-04-01", type: "opening", quantity: 30 },
  { productId: "p2", date: "2025-04-01", type: "opening", quantity: 40 },
  { productId: "p3", date: "2025-04-01", type: "opening", quantity: 25 },
  { productId: "p4", date: "2025-04-01", type: "opening", quantity: 18 },
  { productId: "p5", date: "2025-04-01", type: "opening", quantity: 20 },
  { productId: "p6", date: "2025-04-01", type: "opening", quantity: 30 },
];

// New: Mock inventory transactions
const mockInventoryTransactions = [
  { 
    id: "t1", 
    productId: "p1", 
    date: "2025-04-05", 
    type: "sale", 
    quantity: -3, 
    reference: "Sale #S-2021" 
  },
  { 
    id: "t2", 
    productId: "p1", 
    date: "2025-04-10", 
    type: "restock", 
    quantity: 10, 
    reference: "Delivery #D-1032" 
  },
  { 
    id: "t3", 
    productId: "p2", 
    date: "2025-04-08", 
    type: "sale", 
    quantity: -5, 
    reference: "Sale #S-2025" 
  },
  { 
    id: "t4", 
    productId: "p3", 
    date: "2025-04-15", 
    type: "return", 
    quantity: 2, 
    reference: "Return #R-105" 
  },
  { 
    id: "t5", 
    productId: "p4", 
    date: "2025-04-20", 
    type: "sale", 
    quantity: -4, 
    reference: "Sale #S-2040" 
  },
  { 
    id: "t6", 
    productId: "p5", 
    date: "2025-04-22", 
    type: "adjustment", 
    quantity: -1, 
    reference: "Inventory Check" 
  },
  { 
    id: "t7", 
    productId: "p6", 
    date: "2025-04-28", 
    type: "restock", 
    quantity: 15, 
    reference: "Delivery #D-1045" 
  },
  { 
    id: "t8", 
    productId: "p2", 
    date: "2025-05-02", 
    type: "sale", 
    quantity: -8, 
    reference: "Sale #S-2055" 
  },
  { 
    id: "t9", 
    productId: "p1", 
    date: "2025-05-05", 
    type: "sale", 
    quantity: -6, 
    reference: "Sale #S-2060" 
  },
  { 
    id: "t10", 
    productId: "p3", 
    date: "2025-05-10", 
    type: "restock", 
    quantity: 12, 
    reference: "Delivery #D-1050" 
  },
];

interface InventoryReportItem {
  id: string;
  productName: string;
  category: string;
  openingBalance: number;
  currentStock: number;
  difference: number;
}

interface InventoryLedgerItem {
  id: string;
  productId: string;
  productName: string;
  date: string;
  type: string;
  quantity: number;
  balance: number;
  reference: string;
}

export const InventoryBalanceReport = () => {
  const [reportPeriod, setReportPeriod] = useState("monthly");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"summary" | "ledger">("summary");

  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    const today = new Date();
    let startDate: Date;

    switch (reportPeriod) {
      case "monthly":
        startDate = subMonths(today, 1);
        break;
      case "quarterly":
        startDate = subMonths(today, 3);
        break;
      case "yearly":
        startDate = subMonths(today, 12);
        break;
      default:
        startDate = subMonths(today, 1);
    }

    return {
      startDate,
      endDate: today,
    };
  }, [reportPeriod]);

  // Generate report data with opening and closing balances
  const reportData: InventoryReportItem[] = useMemo(() => {
    return mockProductsData
      .filter(product => category === "all" || product.category === category)
      .map(product => {
        // Find the opening balance from mock movements
        const openingBalanceRecord = mockInventoryMovements.find(
          movement => movement.productId === product.id
        );
        
        const openingBalance = openingBalanceRecord?.quantity || 0;
        const currentStock = product.inStock;
        const difference = currentStock - openingBalance;
        
        return {
          id: product.id,
          productName: `${product.name} - ${product.design} (${product.size})`,
          category: product.category === "children" ? "Children's Apparel" : "Mother's Apparel",
          openingBalance,
          currentStock,
          difference
        };
      });
  }, [category]);

  // Calculate summary statistics
  const reportSummary = useMemo(() => {
    const totalOpeningBalance = reportData.reduce((sum, item) => sum + item.openingBalance, 0);
    const totalCurrentStock = reportData.reduce((sum, item) => sum + item.currentStock, 0);
    const totalDifference = totalCurrentStock - totalOpeningBalance;
    
    const childrenItems = reportData.filter(item => item.category === "Children's Apparel");
    const mothersItems = reportData.filter(item => item.category === "Mother's Apparel");
    
    const childrenCurrentStock = childrenItems.reduce((sum, item) => sum + item.currentStock, 0);
    const mothersCurrentStock = mothersItems.reduce((sum, item) => sum + item.currentStock, 0);
    
    return {
      totalOpeningBalance,
      totalCurrentStock,
      totalDifference,
      childrenCurrentStock,
      mothersCurrentStock
    };
  }, [reportData]);

  // Format the date range for display
  const formattedDateRange = useMemo(() => {
    return {
      start: format(dateRange.startDate, "MMM dd, yyyy"),
      end: format(dateRange.endDate, "MMM dd, yyyy")
    };
  }, [dateRange]);

  // Generate ledger data with transaction history and running balances
  const ledgerData: InventoryLedgerItem[] = useMemo(() => {
    let result: InventoryLedgerItem[] = [];

    const filteredProducts = mockProductsData.filter(
      product => category === "all" || product.category === category
    );

    filteredProducts.forEach(product => {
      // Create opening balance entry
      const openingBalanceRecord = mockInventoryMovements.find(
        movement => movement.productId === product.id
      );
      
      const openingBalance = openingBalanceRecord?.quantity || 0;
      
      // Add opening balance as first record
      result.push({
        id: `opening-${product.id}`,
        productId: product.id,
        productName: `${product.name} - ${product.design} (${product.size})`,
        date: format(dateRange.startDate, "yyyy-MM-dd"),
        type: "Opening Balance",
        quantity: openingBalance,
        balance: openingBalance,
        reference: "Initial Balance"
      });
      
      // Get all transactions for this product
      const productTransactions = mockInventoryTransactions
        .filter(t => t.productId === product.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let runningBalance = openingBalance;
      
      // Add transaction records with running balance
      productTransactions.forEach(transaction => {
        runningBalance += transaction.quantity;
        
        result.push({
          id: transaction.id,
          productId: product.id,
          productName: `${product.name} - ${product.design} (${product.size})`,
          date: transaction.date,
          type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
          quantity: transaction.quantity,
          balance: runningBalance,
          reference: transaction.reference
        });
      });
      
      // Add closing balance as last record
      result.push({
        id: `closing-${product.id}`,
        productId: product.id,
        productName: `${product.name} - ${product.design} (${product.size})`,
        date: format(dateRange.endDate, "yyyy-MM-dd"),
        type: "Closing Balance",
        quantity: 0,
        balance: product.inStock,
        reference: "Final Balance"
      });
    });
    
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [category, dateRange]);

  const handleExportReport = () => {
    toast({
      title: "Report Export Started",
      description: `Your inventory ${viewMode === "summary" ? "balance" : "ledger"} report is being prepared for download.`,
    });
    
    // In a real application, this would trigger a CSV or PDF download
    setTimeout(() => {
      toast({
        title: "Report Downloaded",
        description: `Inventory ${viewMode === "summary" ? "balance" : "ledger"} report for ${formattedDateRange.start} to ${formattedDateRange.end} has been downloaded.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Ledger Report"
        description="Track inventory transactions, opening and closing balances"
        action={
          <Button 
            onClick={handleExportReport}
            className="bg-inventory-blue hover:bg-inventory-blue-dark"
          >
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <FileChartLine className="h-5 w-5" />
            Inventory Ledger
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="children">Children's</SelectItem>
                  <SelectItem value="mothers">Mother's</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value: "summary" | "ledger") => setViewMode(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary View</SelectItem>
                  <SelectItem value="ledger">Ledger View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-4">
              <Calendar className="h-3 w-3 inline mr-1" />
              {formattedDateRange.start} - {formattedDateRange.end}
            </div>
            {viewMode === "summary" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-muted/40 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Opening Balance</div>
                  <div className="text-xl font-bold">{reportSummary.totalOpeningBalance} units</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Current Stock</div>
                  <div className="text-xl font-bold">{reportSummary.totalCurrentStock} units</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Net Change</div>
                  <div className={`text-xl font-bold ${reportSummary.totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {reportSummary.totalDifference >= 0 ? '+' : ''}{reportSummary.totalDifference} units
                  </div>
                </div>
                <div className="bg-muted/40 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Children's Items</div>
                  <div className="text-xl font-bold">{reportSummary.childrenCurrentStock} units</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Mother's Items</div>
                  <div className="text-xl font-bold">{reportSummary.mothersCurrentStock} units</div>
                </div>
              </div>
            )}
          </div>
          
          {viewMode === "summary" ? (
            <DataTable
              columns={[
                { header: "Product", accessorKey: "productName" },
                { header: "Category", accessorKey: "category" },
                { header: "Opening Balance", accessorKey: "openingBalance" },
                { header: "Current Stock", accessorKey: "currentStock" },
                { 
                  header: "Change", 
                  accessorKey: "difference",
                  cell: (value) => {
                    return (
                      <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {value >= 0 ? '+' : ''}{value}
                      </span>
                    );
                  }
                }
              ]}
              data={reportData}
              emptyState={
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <p>No inventory data found for the selected parameters</p>
                </div>
              }
            />
          ) : (
            <DataTable
              columns={[
                { header: "Date", accessorKey: "date" },
                { header: "Product", accessorKey: "productName" },
                { 
                  header: "Transaction Type", 
                  accessorKey: "type",
                  cell: (value) => {
                    const getTypeColor = (type: string) => {
                      switch(type.toLowerCase()) {
                        case 'opening balance':
                          return 'text-blue-600';
                        case 'closing balance':
                          return 'text-blue-600';
                        case 'sale':
                          return 'text-red-600';
                        case 'restock':
                          return 'text-green-600';
                        case 'return':
                          return 'text-amber-600';
                        case 'adjustment':
                          return 'text-purple-600';
                        default:
                          return '';
                      }
                    };
                    return (
                      <span className={getTypeColor(value)}>
                        {value}
                      </span>
                    );
                  }
                },
                { 
                  header: "Quantity", 
                  accessorKey: "quantity",
                  cell: (value) => {
                    if (value === 0) return "-";
                    return (
                      <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
                        {value > 0 ? '+' : ''}{value}
                      </span>
                    );
                  }
                },
                { 
                  header: "Balance", 
                  accessorKey: "balance" 
                },
                { header: "Reference", accessorKey: "reference" }
              ]}
              data={ledgerData}
              emptyState={
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <p>No ledger entries found for the selected parameters</p>
                </div>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
