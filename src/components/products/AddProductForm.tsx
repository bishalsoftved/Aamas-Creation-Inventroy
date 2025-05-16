
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Manufacturer } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  category: z.enum(["children", "mothers"], {
    required_error: "Category is required.",
  }),
  type: z.string().min(1, "Type is required."),
  design: z.string().min(1, "Design is required."),
  size: z.string().min(1, "Size is required."),
  color: z.string().min(1, "Color is required."),
  gender: z.string().min(1, "Gender is required."),
  age: z.string().min(1, "Age range is required."),
  inStock: z.coerce.number().int().min(0, "Stock must be a positive number."),
  manufacturerId: z.string().min(1, "Manufacturer is required."),
});

type FormValues = z.infer<typeof formSchema>;

interface AddProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (data: FormValues & { id: string; manufacturerName: string; dateReceived: string }) => void;
  manufacturers: Manufacturer[];
}

// Options for dropdown fields
const productTypes = ["Pasni Set", "Nuwaran Set", "Bhoti", "Suruwal", "Choli", "Frock", "Trouser"];
const designOptions = ["Laliguras", "Apple", "Grapes", "Stipe", "Flower", "Face"];
const sizeOptions = ["S", "M", "L", "XL", "XXL"];
const colorOptions = ["Red", "Blue", "Green", "Yellow", "Pink", "Purple", "White", "Black", "Grey", "White/Blue", "Khaki"];
const genderOptions = ["Child-Boy", "Child-Girl"];
const ageOptions = ["0-12M", "1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "7-8Y", "9-10Y", "Adult"];

export const AddProductForm = ({
  open,
  onOpenChange,
  onAddProduct,
  manufacturers,
}: AddProductFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "children",
      type: "",
      design: "",
      size: "",
      color: "",
      gender: "",
      age: "",
      inStock: 0,
      manufacturerId: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const selectedManufacturer = manufacturers.find(m => m.id === data.manufacturerId);
    
    if (!selectedManufacturer) {
      toast({
        title: "Error",
        description: "Selected manufacturer not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate a random ID for the new product
    const newProduct = {
      ...data,
      id: `p${Date.now()}`,
      manufacturerName: selectedManufacturer.name,
      dateReceived: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    };

    onAddProduct(newProduct);
    onOpenChange(false);
    form.reset();
    
    toast({
      title: "Product Added",
      description: `${data.name} has been added to your inventory.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[450px]">
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
          <SheetDescription>
            Add a new product to your inventory system.
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[180px]">
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="children">Children</SelectItem>
                        <SelectItem value="mothers">Mothers</SelectItem>
                        <SelectItem value="mother&children">Mother & Child</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[180px]">
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productTypes.map(type => (
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
            </div>
            
            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[180px]">
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genderOptions.map(gender => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
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
                name="age"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[180px]">
                    <FormLabel>Age Range</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ageOptions.map(age => (
                          <SelectItem key={age} value={age}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="design"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[180px]">
                    <FormLabel>Design</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select design" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {designOptions.map(design => (
                          <SelectItem key={design} value={design}>
                            {design}
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
                name="size"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[180px]">
                    <FormLabel>Size</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizeOptions.map(size => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[180px]">
                    <FormLabel>Color</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colorOptions.map(color => (
                          <SelectItem key={color} value={color}>
                            {color}
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
                name="inStock"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[180px]">
                    <FormLabel>Initial Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="manufacturerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturers.map(manufacturer => (
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
            
            <SheetFooter className="mt-6">
              <Button type="submit">Add Product</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
