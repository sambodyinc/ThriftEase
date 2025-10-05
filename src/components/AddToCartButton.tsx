
"use client"

import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/types";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        // Use the first image URL from the product's image array
        const firstImage = product.images[0];
        if (firstImage) {
            addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: firstImage,
                size: product.size,
            });
        }
    };

    return (
        <Button 
            size="lg" 
            onClick={handleAddToCart} 
            disabled={product.isSold} 
            className="flex-1"
        >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {product.isSold ? 'Sold Out' : 'Add to Cart'}
        </Button>
    );
}
