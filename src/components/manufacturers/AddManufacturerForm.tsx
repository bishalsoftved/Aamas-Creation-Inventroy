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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  contact: z.string().email("Invalid email address."),
  phone: z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must be at most 15 digits")
  .regex(/^\d+$/, "Phone number must contain only digits"),
  specialization: z
    .string()
    .min(2, "Specialization must be at least 2 characters."),
  type: z.enum(["Home Based Worker", "Production House"], {
    required_error: "Please select a manufacturer type",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddManufacturerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddManufacturer: (
    data: FormValues & { id: string; activeOrders: number; }
  ) => void;
}

export const AddManufacturerForm = ({
  open,
  onOpenChange,
  onAddManufacturer,
}: AddManufacturerFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      specialization: "",
      type: "Production House",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Generate a random ID for the new manufacturer
    const newManufacturer = {
      ...data,
      id: `m${Date.now()}`,
      activeOrders: 0, // New manufacturers start with 0 active orders
    };

    onAddManufacturer(newManufacturer);
    onOpenChange(false);
    form.reset();

    toast({
      title: "Manufacturer Added",
      description: `${data.name} has been added to your manufacturers.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>Add New Manufacturer</SheetTitle>
          <SheetDescription>
            Add a new manufacturer to your inventory system.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Manufacturer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9888786789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Children's Casual Wear"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Manufacturer Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Home Based Worker" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Home Based Worker
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Production House" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Production House
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="mt-6">
              <Button type="submit">Add Manufacturer</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
