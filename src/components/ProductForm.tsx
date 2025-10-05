
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/lib/types";
import { CATEGORIES, CONDITIONS, SIZES } from "@/lib/constants";

const formSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.enum(CATEGORIES),
  size: z.enum(SIZES),
  condition: z.enum(CONDITIONS),
  color: z.string().min(2, "Color is required."),
  images: z.array(z.string().url()).min(1, "At least one image is required."),
  isFeatured: z.boolean(),
  isSold: z.boolean(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormValues) => void;
  isSubmitting: boolean;
}

const ImageUploader = ({ field, form }: { field: any, form: any }) => {
  const { isUploading, progress, uploadFiles } = useUploadFile();
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFilesToUpload(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return;
    const uploadedUrls = await uploadFiles(filesToUpload);
    const newImageUrls = [...field.value, ...uploadedUrls];
    form.setValue("images", newImageUrls, { shouldValidate: true });
    setFilesToUpload([]);
  };

  const removeImage = (index: number) => {
    const updatedImages = [...field.value];
    updatedImages.splice(index, 1);
    form.setValue("images", updatedImages, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {field.value.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {field.value.map((url: string, index: number) => (
              <div key={index} className="relative group aspect-square">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="rounded-md object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-2">
          <FormLabel>Add new images</FormLabel>
          <Input type="file" multiple onChange={handleFileSelect} accept="image/*" />
        </div>
        {filesToUpload.length > 0 && (
          <div>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="mr-2" />
              {isUploading ? "Uploading..." : `Upload ${filesToUpload.length} file(s)`}
            </Button>
            {isUploading && Object.values(progress).length > 0 && (
              <div className="mt-2 space-y-1">
                 {Object.entries(progress).map(([name, p]) => (
                    <div key={name}>
                      <Progress value={p} className="w-full h-2" />
                       <p className="text-xs text-muted-foreground mt-1">{name}: {Math.round(p)}%</p>
                    </div>
                ))}
              </div>
            )}
          </div>
        )}
        <FormMessage />
      </CardContent>
    </Card>
  );
};


export function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, price: Number(initialData.price) }
      : {
          name: "",
          description: "",
          price: 0,
          category: "Tops",
          size: "M",
          condition: "Gently Used",
          color: "",
          images: [],
          isFeatured: false,
          isSold: false,
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Vintage Denim Jacket" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the product..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (KES)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                            {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
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
                    <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a size" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
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
                            {CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
                <ImageUploader field={field} form={form} />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-8">
             <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                    <div className="space-y-0.5">
                        <FormLabel>Featured Product</FormLabel>
                         <FormMessage />
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
              <FormField
                control={form.control}
                name="isSold"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                    <div className="space-y-0.5">
                        <FormLabel>Mark as Sold</FormLabel>
                         <FormMessage />
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
          {isSubmitting ? "Saving..." : (initialData ? "Save Changes" : "Create Product")}
        </Button>
      </form>
    </Form>
  );
}
