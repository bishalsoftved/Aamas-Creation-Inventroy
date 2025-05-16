
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { 
  Boxes, 
  Box, 
  Users, 
  ShoppingBag, 
  Database, 
  BarChart3, 
  Package, 
  FileChartLine 
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>("products");
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      path: "/"
    },
    {
      title: "Materials",
      icon: Database,
      path: "/materials"
    },
    {
      title: "Manufacturers",
      icon: Users,
      path: "/manufacturers"
    },
    {
      title: "Products",
      icon: Box,
      path: "/products"
    },
    {
      title: "Inventory",
      icon: Package,
      path: "/inventory"
    },
    {
      title: "Sales",
      icon: ShoppingBag,
      path: "/sales"
    },
    {
      title: "Reports",
      icon: FileChartLine,
      path: "/reports",
      submenu: [
        {
          title: "Sales Reports",
          path: "/reports/sales"
        },
        {
          title: "Inventory Ledger",
          path: "/reports/inventory-ledger"
        }
      ]
    }
  ];

  const handleMenuClick = (menuTitle: string) => {
    setExpandedMenu(expandedMenu === menuTitle ? null : menuTitle);
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Boxes className="h-6 w-6 text-sidebar-foreground" />
        <span className="ml-2 text-lg font-semibold text-sidebar-foreground">Aamas Creation</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              {!item.submenu ? (
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === item.path}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                      location.pathname === item.path && "bg-sidebar-accent font-medium"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ) : (
                <>
                  <SidebarMenuButton 
                    onClick={() => handleMenuClick(item.title)}
                    isActive={location.pathname.startsWith(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {expandedMenu === item.title && (
                    <SidebarMenuSub>
                      {item.submenu.map((subItem, subIndex) => (
                        <SidebarMenuSubItem key={subIndex}>
                          <SidebarMenuSubButton 
                            asChild
                            isActive={location.pathname === subItem.path}
                          >
                            <Link to={subItem.path}>
                              {subItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between text-xs text-sidebar-foreground/80">
          <span>v1.0.0</span>
          <span>© 2025 Threads & Care</span>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};
