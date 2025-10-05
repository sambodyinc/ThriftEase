
"use client";

import { useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import { useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc, serverTimestamp } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  category: z.string(),
  size: z.string(),
  condition: z.string(),
  color: z.string().min(2),
  images: z.array(z.string().url()).min(1),
  isFeatured: z.boolean(),
  isSold: z.boolean(),
});

export default function EditProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const productId = Array.isArray(params.productId) ? params.productId[0] : params.productId;

  const productRef = useMemoFirebase(() => {
    if (!productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);

  const { data: product, isLoading, error } = useDoc<Product>(productRef);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!productRef) return;
    setIsSubmitting(true);
    try {
        setDocumentNonBlocking(productRef, {
            ...data,
            // Preserve original createdAt, add updatedAt
            createdAt: product?.createdAt || serverTimestamp(), 
            updatedAt: serverTimestamp(),
        }, { merge: true });

        toast({
            title: "Product Updated",
            description: `"${data.name}" has been successfully updated.`,
        });

        router.push("/admin/products");
        router.refresh();
    } catch (error: any) {
        console.error("Error updating product:", error);
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description: error.message || "Could not update the product.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
            <div className="border rounded-lg p-6 mt-4">
                <div className="space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-2 gap-8">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <Skeleton className="h-10 w-32 mt-4" />
                </div>
            </div>
        </div>
    )
  }

  if (error) {
      return <div className="p-8">Error loading product: {error.message}</div>;
  }

  if (!product) {
      return <div className="p-8">Product not found.</div>;
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Edit Product
          </h1>
          <p className="text-muted-foreground">
            Editing: <span className="font-semibold">{product.name}</span>
          </p>
        </div>
      </div>
      <div className="border rounded-lg p-6">
        <ProductForm 
            initialData={product as Product} 
            onSubmit={onSubmit} 
            isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}
