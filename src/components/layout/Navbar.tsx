
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  return (
    <header className="h-16 border-b bg-white flex items-center px-6">
      <SidebarTrigger />
      <div className="flex items-center gap-4 ml-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-8 bg-muted/30"
          />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm font-medium">Aamas Creation</span>
          <div className="h-8 w-8 rounded-full bg-inventory-blue flex items-center justify-center text-white">
            AC
          </div>
        </div>
      </div>
    </header>
  );
};
