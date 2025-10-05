import { sampleProducts } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, SIZES, CONDITIONS } from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// This would be a server component that fetches data based on searchParams
export default function ShopPage({ searchParams }: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // In a real app, you would use searchParams to filter data from your database.
  // For now, we'll just display all sample products.
  let products = [...sampleProducts];

  // Example of how you might filter
  const category = searchParams?.category;
  if (category && typeof category === 'string' && CATEGORIES.includes(category as any)) {
    products = products.filter(p => p.category === category);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {category ? `${category}` : "All Products"}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find your next treasure. Unique, pre-loved fashion updated daily.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="font-headline text-2xl font-semibold">Filters</h2>
                 <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-4">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox id={`cat-${cat}`} />
                    <Label htmlFor={`cat-${cat}`}>{cat}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="font-semibold mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map(size => (
                  <Button key={size} variant="outline" size="sm">{size}</Button>
                ))}
              </div>
            </div>
            
             {/* Condition Filter */}
            <div>
              <h3 className="font-semibold mb-4">Condition</h3>
              <div className="space-y-2">
                {CONDITIONS.map(con => (
                  <div key={con} className="flex items-center space-x-2">
                    <Checkbox id={`con-${con}`} />
                    <Label htmlFor={`con-${con}`}>{con}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter - would need a slider component */}
            {/* ... */}
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold">No Products Found</h2>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters or check back later!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Dummy components for layout purposes
const Button = ({ children, ...props }: React.ComponentProps<'button'>) => (
  <button {...props} className="border border-input rounded-md px-3 py-1 text-sm hover:bg-accent">{children}</button>
);
