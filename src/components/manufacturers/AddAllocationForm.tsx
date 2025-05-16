
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Manufacturer, Material, MaterialAllocation } from "@/types";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  materialId: z.string({ required_error: "Please select a material" }),
  manufacturerId: z.string({ required_error: "Please select a manufacturer" }),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  orderReference: z.string().min(3, "Order reference must be at least 3 characters"),
  dateAllocated: z.date({ required_error: "Please select a date" }),
  note: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface AddAllocationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAllocation: (newAllocation: MaterialAllocation) => void;
  manufacturers: Manufacturer[];
  materials: Material[];
}

export const AddAllocationForm = ({ 
  open, 
  onOpenChange, 
  onAddAllocation, 
  manufacturers, 
  materials 
}: AddAllocationFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      orderReference: "",
      note: ""
    }
  });

  function onSubmit(data: FormValues) {
    try {
      const selectedMaterial = materials.find(m => m.id === data.materialId);
      const selectedManufacturer = manufacturers.find(m => m.id === data.manufacturerId);
      
      if (!selectedMaterial || !selectedManufacturer) {
        toast({
          title: "Error",
          description: "Selected material or manufacturer not found",
          variant: "destructive"
        });
        return;
      }

      const newAllocation: MaterialAllocation = {
        id: `a${Date.now()}`,
        materialId: data.materialId,
        materialName: selectedMaterial.name,
        manufacturerId: data.manufacturerId,
        manufacturerName: selectedManufacturer.name,
        quantity: data.quantity,
        dateAllocated: format(data.dateAllocated, 'yyyy-MM-dd'),
        orderReference: data.orderReference,
        note: data.note || "",
      };
      
      onAddAllocation(newAllocation);
      
      toast({
        title: "Allocation Created",
        description: `${data.quantity} units of ${selectedMaterial.name} allocated to ${selectedManufacturer.name}`,
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding allocation:", error);
      toast({
        title: "Error",
        description: "There was a problem creating the allocation",
        variant: "destructive"
      });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>New Material Allocation</SheetTitle>
          <SheetDescription>
            Allocate materials to manufacturers for production
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="materialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.inStock} in stock)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer.id} value={manufacturer.id}>
                          {manufacturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ORD-2505-01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateAllocated"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Allocated</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes or comments about this allocation..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-inventory-blue hover:bg-inventory-blue-dark">
                Create Allocation
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
