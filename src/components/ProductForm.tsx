
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES, CONDITIONS, SIZES } from "@/lib/constants";
import { Trash } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.enum(CATEGORIES),
  size: z.enum(SIZES),
  condition: z.enum(CONDITIONS),
  color: z.string().min(2, "Color is required."),
  images: z.array(z.string().min(1, "Image ID cannot be empty.")).min(1, "At least one image is required."),
  isFeatured: z.boolean(),
  isSold: z.boolean(),
});

type ProductFormProps = {
  initialData?: Product;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
};

export const ProductForm = ({ initialData, onSubmit, isSubmitting }: ProductFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          name: "",
          description: "",
          price: 0,
          category: "Tops",
          size: "M",
          condition: "Gently Used",
          color: "",
          images: ["p001_1"],
          isFeatured: false,
          isSold: false,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vintage Denim Jacket" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the product, its condition, and any unique features."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Price */}
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price (KES)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="1500" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            {/* Color */}
            <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Blue" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category */}
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                        {cat}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

            {/* Size */}
            <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {SIZES.map((s) => (
                        <SelectItem key={s} value={s}>
                        {s}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Condition */}
            <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a condition" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {CONDITIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                        {c}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

         {/* Images */}
        <div>
          <FormLabel>Images</FormLabel>
          <FormDescription>
            Enter the IDs of the placeholder images. You can find these in{" "}
            <code>src/lib/placeholder-images.json</code>.
          </FormDescription>
          <div className="space-y-4 mt-4">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`images.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder="e.g., p001_1" {...field} />
                      </FormControl>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append("")}
            >
              Add Image
            </Button>
             <FormMessage>{form.formState.errors.images?.message}</FormMessage>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* isFeatured */}
            <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel>Featured Product</FormLabel>
                    <FormDescription>
                    Featured products appear on the home page.
                    </FormDescription>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                </FormItem>
            )}
            />

            {/* isSold */}
            <FormField
            control={form.control}
            name="isSold"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel>Sold Status</FormLabel>
                    <FormDescription>
                    Mark this product as sold.
                    </FormDescription>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </Form>
  );
};
