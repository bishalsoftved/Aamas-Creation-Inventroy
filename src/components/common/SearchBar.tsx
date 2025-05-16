
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const SearchBar = ({ placeholder = "Search...", onChange }: SearchBarProps) => {
  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8"
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
};
