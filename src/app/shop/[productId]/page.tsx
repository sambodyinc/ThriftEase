import { sampleProducts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from '@/components/AddToCartButton';

export default function ProductPage({ params }: { params: { productId: string } }) {
  const product = sampleProducts.find(p => p.id === params.productId);

  if (!product) {
    notFound();
  }
  
  const productImages = product.images.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);
  const similarItems = sampleProducts.filter(p => p.category === product.category && p.id !== product.id && !p.isSold).slice(0, 4);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {productImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-lg shadow-lg">
                      {img && <Image
                        src={img.imageUrl}
                        alt={`${product.name} image ${index + 1}`}
                        fill
                        data-ai-hint={img.imageHint}
                        className="object-cover object-center"
                      />}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>
            <div className="mt-3 flex items-center gap-4">
              <p className="text-3xl text-foreground">{formatCurrency(product.price)}</p>
              <Badge variant="outline">{product.condition}</Badge>
            </div>
            
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <p className="text-base text-muted-foreground">{product.description}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium text-foreground">Category:</span> {product.category}</div>
                <div><span className="font-medium text-foreground">Size:</span> {product.size}</div>
                <div><span className="font-medium text-foreground">Color:</span> {product.color}</div>
                <div><span className="font-medium text-foreground">Status:</span> {product.isSold ? 'Sold Out' : 'Available'}</div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <AddToCartButton product={product} />
              <Button variant="outline" size="lg" className="flex-1">
                <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
              </Button>
               <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
            
            {product.isSold && (
                 <p className="mt-4 text-center font-semibold text-destructive">This item is sold out.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Similar Items Section */}
      {similarItems.length > 0 && (
        <div className="bg-primary/5 py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-center">You Might Also Like</h2>
                <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {similarItems.map(item => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
