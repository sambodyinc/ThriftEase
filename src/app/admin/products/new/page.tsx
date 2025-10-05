
"use client";

import { useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";

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

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
        const productsRef = collection(firestore, 'products');
        
        addDocumentNonBlocking(productsRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
      
        toast({
            title: "Product Created",
            description: `"${data.name}" has been added to your store.`,
        });

        router.push("/admin/products");
        router.refresh(); 
    } catch (error: any) {
        console.error("Error creating product:", error);
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description: error.message || "Could not create the product.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Add New Product
          </h1>
          <p className="text-muted-foreground">
            Fill out the details below to add a new item to your inventory.
          </p>
        </div>
      </div>
      <div className="border rounded-lg p-6">
        <ProductForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
