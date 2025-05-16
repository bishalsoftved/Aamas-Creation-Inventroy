
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  className?: string;
}

export const StatsCard = ({ title, value, icon, change, className }: StatsCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-inventory-blue/10 flex items-center justify-center text-inventory-blue">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {typeof change !== "undefined" && (
          <div className="flex items-center space-x-1 mt-1 text-xs">
            {change > 0 ? (
              <>
                <ArrowUpIcon className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600">{change}%</span>
              </>
            ) : (
              <>
                <ArrowDownIcon className="h-3 w-3 text-rose-600" />
                <span className="text-rose-600">{Math.abs(change)}%</span>
              </>
            )}
            <span className="text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
