
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
import type { Product, Sale } from "@/types";

const formSchema = z.object({
  productId: z.string().min(1, "Product is required."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  location: z.enum(["Main Store", "Online"], {
    required_error: "Location is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface RecordSaleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordSale: (data: Sale) => void;
  products: Product[];
}

export const RecordSaleForm = ({
  open,
  onOpenChange,
  onRecordSale,
  products,
}: RecordSaleFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
      location: "Main Store",
    },
  });

  const onSubmit = (data: FormValues) => {
    const selectedProduct = products.find(p => p.id === data.productId);
    
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Selected product not found.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedProduct.inStock < data.quantity) {
      toast({
        title: "Error",
        description: `Not enough stock. Only ${selectedProduct.inStock} available.`,
        variant: "destructive",
      });
      return;
    }
    
    // Create a new sale object conforming to the Sale type
    const newSale: Sale = {
      id: `s${Date.now()}`,
      productId: data.productId,
      productName: `${selectedProduct.name} - ${selectedProduct.design} (${selectedProduct.size})`,
      quantity: data.quantity,
      dateSold: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      location: data.location,
    };

    onRecordSale(newSale);
    onOpenChange(false);
    form.reset();
    
    toast({
      title: "Sale Recorded",
      description: `${data.quantity} units of ${selectedProduct.name} sold.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>Record New Sale</SheetTitle>
          <SheetDescription>
            Record a new product sale in the system.
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {product.design} ({product.size}) - {product.inStock} in stock
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Main Store">Main Store</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <SheetFooter className="mt-6">
              <Button type="submit">Record Sale</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
