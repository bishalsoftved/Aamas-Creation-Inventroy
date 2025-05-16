
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { MaterialsInventory } from "./components/materials/MaterialsInventory";
import { ProductsInventory } from "./components/products/ProductsInventory";
import { InventoryPage } from "./components/products/InventoryPage";
import { ManufacturersTracker } from "./components/manufacturers/ManufacturersTracker";
import { SalesTracker } from "./components/sales/SalesTracker";
import { SalesReport } from "./components/reports/SalesReport";
import { InventoryBalanceReport } from "./components/reports/InventoryBalanceReport";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/materials"
            element={
              <Layout>
                <MaterialsInventory />
              </Layout>
            }
          />
          <Route
            path="/manufacturers"
            element={
              <Layout>
                <ManufacturersTracker />
              </Layout>
            }
          />
          <Route
            path="/products"
            element={
              <Layout>
                <ProductsInventory />
              </Layout>
            }
          />
          <Route
            path="/inventory"
            element={
              <Layout>
                <InventoryPage />
              </Layout>
            }
          />
          <Route
            path="/sales"
            element={
              <Layout>
                <SalesTracker />
              </Layout>
            }
          />
          <Route
            path="/reports/sales"
            element={
              <Layout>
                <SalesReport />
              </Layout>
            }
          />
          <Route
            path="/reports/inventory-ledger"
            element={
              <Layout>
                <InventoryBalanceReport />
              </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
