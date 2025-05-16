
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Material } from "@/types";

const materialSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  type: z.string().min(1, { message: "Please select a material type" }),
  unit: z.string().min(1, { message: "Please select a unit" }),
  inStock: z.coerce.number().nonnegative({ message: "Must be a positive number" }),
  minimumStock: z.coerce.number().nonnegative({ message: "Must be a positive number" }),
  supplierId: z.string().min(1, { message: "Please select a supplier" }),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

interface AddMaterialFormProps {
  onSuccess: (data: Material) => void;
  onCancel: () => void;
}

export function AddMaterialForm({ onSuccess, onCancel }: AddMaterialFormProps) {
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: "",
      type: "",
      unit: "",
      inStock: 0,
      minimumStock: 0,
      supplierId: "",
    },
  });

  const materialTypes = ["fabric", "thread", "scissors", "needle", "cotton"];
  const unitTypes = ["meters", "pieces", "spools", "rolls", "kilograms"];
  
  // Mock suppliers data
  const suppliers = [
    { id: "s1", name: "Fabrics Co" },
    { id: "s2", name: "Button World" },
    { id: "s3", name: "Elastic Suppliers" },
    { id: "s4", name: "Thread Masters" },
    { id: "s5", name: "Aamas Suppliers" },
  ];

  function onSubmit(data: MaterialFormValues) {
    // Get supplier name from id
    const supplier = suppliers.find((s) => s.id === data.supplierId);
    
    // Create a new material object
    const newMaterial: Material = {
      id: `m${Date.now()}`, // Generate a unique ID
      name: data.name,
      type: data.type,
      unit: data.unit,
      inStock: data.inStock,
      minimumStock: data.minimumStock,
      supplierId: data.supplierId,
      supplierName: supplier?.name || "",
      lastRestocked: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    };

    toast({
      title: "Material Added",
      description: `${newMaterial.name} has been added to inventory.`,
    });
    
    onSuccess(newMaterial);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter material name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
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
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {unitTypes.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="inStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>In Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimumStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
          <Button type="submit">Add Material</Button>
        </div>
      </form>
    </Form>
  );
}
