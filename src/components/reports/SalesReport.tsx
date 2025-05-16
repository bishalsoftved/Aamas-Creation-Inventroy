
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
import { 
  FileChartLine, 
  Download, 
  Calendar 
} from "lucide-react";
import { Sale, Product } from "@/types";
import { toast } from "@/hooks/use-toast";
import { format, subDays, subMonths, subYears, isWithinInterval, startOfDay } from "date-fns";

// Mock data - in a real app this would come from your database or API
const mockSalesData: Sale[] = [
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
    dateSold: "2025-04-30",
    location: "Main Store",
  },
  {
    id: "s4",
    productId: "p2",
    productName: "Boys T-Shirt - Dinosaur (5-6Y)",
    quantity: 4,
    dateSold: "2025-04-13",
    location: "Online",
  },
  {
    id: "s5",
    productId: "p4",
    productName: "Maternity Dress - Solid Blue (M)",
    quantity: 2,
    dateSold: "2025-03-25",
    location: "Main Store",
  },
  {
    id: "s6",
    productId: "p3",
    productName: "Girls Leggings - Stars (7-8Y)",
    quantity: 3,
    dateSold: "2025-03-10",
    location: "Online",
  },
  {
    id: "s7",
    productId: "p1",
    productName: "Girls Summer Dress - Floral (3-4Y)",
    quantity: 5,
    dateSold: "2025-02-15",
    location: "Main Store",
  },
  {
    id: "s8",
    productId: "p5",
    productName: "Maternity Top - Striped (L)",
    quantity: 2,
    dateSold: "2025-01-20",
    location: "Online",
  },
];

export const SalesReport = () => {
  const [reportPeriod, setReportPeriod] = useState("biweekly");
  const [location, setLocation] = useState("all");

  // Calculated date range based on the selected period
  const dateRange = useMemo(() => {
    const today = new Date();
    const endDate = startOfDay(today);
    let startDate: Date;

    switch (reportPeriod) {
      case "biweekly":
        startDate = subDays(today, 14);
        break;
      case "monthly":
        startDate = subMonths(today, 1);
        break;
      case "quarterly":
        startDate = subMonths(today, 3);
        break;
      case "yearly":
        startDate = subYears(today, 1);
        break;
      default:
        startDate = subDays(today, 14);
    }

    return { startDate, endDate };
  }, [reportPeriod]);

  // Filter sales data based on selected period and location
  const filteredSales = useMemo(() => {
    return mockSalesData.filter(sale => {
      const saleDate = new Date(sale.dateSold);
      const isInDateRange = isWithinInterval(saleDate, {
        start: dateRange.startDate,
        end: dateRange.endDate
      });
      
      const matchesLocation = location === "all" || sale.location === location;
      
      return isInDateRange && matchesLocation;
    });
  }, [dateRange, location]);

  // Calculate totals for the report
  const reportSummary = useMemo(() => {
    const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
    
    const salesByLocation = filteredSales.reduce((acc, sale) => {
      acc[sale.location] = (acc[sale.location] || 0) + sale.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    const topSellingProduct = [...filteredSales]
      .sort((a, b) => b.quantity - a.quantity)[0]?.productName || "N/A";
      
    return {
      totalQuantity,
      mainStoreSales: salesByLocation["Main Store"] || 0,
      onlineSales: salesByLocation["Online"] || 0,
      topSellingProduct
    };
  }, [filteredSales]);

  // Format the date range for display
  const formattedDateRange = useMemo(() => {
    return {
      start: format(dateRange.startDate, "MMM dd, yyyy"),
      end: format(dateRange.endDate, "MMM dd, yyyy")
    };
  }, [dateRange]);

  const handleExportReport = () => {
    toast({
      title: "Report Export Started",
      description: "Your report is being prepared for download.",
    });
    
    // In a real application, this would trigger a CSV or PDF download
    setTimeout(() => {
      toast({
        title: "Report Downloaded",
        description: `Sales report for ${formattedDateRange.start} to ${formattedDateRange.end} has been downloaded.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Reports"
        description="Generate and analyze sales reports for different time periods"
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
            Sales Report
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Main Store">Main Store</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/40 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Total Sales</div>
                <div className="text-xl font-bold">{reportSummary.totalQuantity} units</div>
              </div>
              <div className="bg-muted/40 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Main Store</div>
                <div className="text-xl font-bold">{reportSummary.mainStoreSales} units</div>
              </div>
              <div className="bg-muted/40 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Online</div>
                <div className="text-xl font-bold">{reportSummary.onlineSales} units</div>
              </div>
              <div className="bg-muted/40 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Top Product</div>
                <div className="text-sm font-bold truncate">{reportSummary.topSellingProduct}</div>
              </div>
            </div>
          </div>

          <DataTable
            columns={[
              { header: "Date", accessorKey: "dateSold" },
              { header: "Product", accessorKey: "productName" },
              { header: "Quantity", accessorKey: "quantity" },
              { header: "Location", accessorKey: "location" },
            ]}
            data={filteredSales}
            emptyState={
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <p>No sales data found for this period</p>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};
