
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/types';
import { Badge } from './ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Button } from './ui/button';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const firstImage = product.images[0]; // First image is the URL string

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(firstImage) {
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
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative w-full overflow-hidden rounded-lg bg-card shadow-md transition-shadow duration-300 group-hover:shadow-xl">
          {product.isSold && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <span className="font-headline rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground">
                SOLD OUT
              </span>
            </div>
          )}
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              width={600}
              height={800}
              className="h-80 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-80 w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
             <Badge variant="secondary">{product.condition}</Badge>
          </div>

          <div className="absolute bottom-0 w-full translate-y-full transform bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
             <Button 
                className="w-full" 
                variant="secondary" 
                onClick={handleAddToCart}
                disabled={product.isSold}
             >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
          </div>
          <p className="text-base font-semibold text-foreground">{formatCurrency(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
};
