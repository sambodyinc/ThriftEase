import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Shirt, Minus } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { sampleProducts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import { Card, CardContent } from '@/components/ui/card';

// Mock function to get current user - replace with your actual auth logic
const getCurrentUser = async () => {
  // For demonstration, we'll return a mock user. In a real app, this would
  // come from your authentication provider (e.g., Firebase Auth).
  return {
    isLoggedIn: true,
    id: 'user_123',
    purchaseHistory: ['p001', 'p003'],
    browsingHistory: ['p002', 'p005'],
  };
};

const CategoryCard = ({ icon, name, href }: { icon: React.ReactNode, name: string, href: string }) => (
  <Link href={href}>
    <Card className="group relative overflow-hidden text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>
        <h3 className="font-semibold text-foreground">{name}</h3>
      </CardContent>
    </Card>
  </Link>
);


const PersonalizedRecs = async () => {
  const user = await getCurrentUser();

  if (!user.isLoggedIn) {
    return null;
  }
  try {
    const recommendations = await getPersonalizedRecommendations({
      userId: user.id,
      purchaseHistory: user.purchaseHistory,
      browsingHistory: user.browsingHistory,
    });
    
    const recommendedProducts = sampleProducts.filter(p => recommendations.recommendedProductIds.includes(p.id));

    if (recommendedProducts.length === 0) return null;

    return (
      <div className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Just For You</h2>
            <p className="mt-4 text-lg text-muted-foreground">AI-powered picks based on your style.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to get personalized recommendations:', error);
    return null; // Don't render the section if AI fails
  }
};


export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const justInProducts = sampleProducts.filter(p => !p.isSold).slice(0, 4);

  const categories = [
    { name: 'Tops', href: '/shop?category=Tops', icon: <Shirt className="h-8 w-8" /> },
    { name: 'Bottoms', href: '/shop?category=Bottoms', icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m5 2 1.5 1.5c1 1 1.5 2.5 1.5 4v8c0 1.5-1 3-2 3.5L5 22"/><path d="m19 2-1.5 1.5c-1 1-1.5 2.5-1.5 4v8c0 1.5 1 3 2 3.5L19 22"/></svg> },
    { name: 'Dresses', href: '/shop?category=Dresses', icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a2 2 0 0 0 2-2V7l-4 3-4-3v13a2 2 0 0 0 2 2h4Z"/><path d="m18 7 -4-3-4 3"/><path d="M10 22v-5"/><path d="M14 22v-5"/></svg> },
    { name: 'Accessories', href: '/shop?category=Accessories', icon: <ShoppingBag className="h-8 w-8" /> },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 py-24 sm:py-32">
            <div className="max-w-xl text-center lg:text-left">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Sustainable Style, Unbeatable Prices.
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Discover unique, pre-loved fashion that tells a story. Good for your wallet, great for the planet.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Button asChild size="lg">
                  <Link href="/shop">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            {heroImage && (
              <div className="mt-10 lg:mt-0 h-80 lg:h-auto">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={600}
                  priority
                  data-ai-hint={heroImage.imageHint}
                  className="rounded-3xl object-cover object-center shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[--primary] to-[--accent] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
      
      {/* Featured Categories */}
      <div className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Shop by Category</h2>
              <p className="mt-4 text-lg text-muted-foreground">Find your next favorite piece from our curated collections.</p>
            </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </div>

      {/* Just In Section */}
      <div className="bg-primary/5 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Just In</h2>
              <p className="mt-2 text-lg text-muted-foreground">Fresh finds added daily. Grab them before they're gone!</p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link href="/shop">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {justInProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
             <Button asChild>
              <Link href="/shop">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* AI Recommendations Section */}
      <PersonalizedRecs />

    </div>
  );
}
