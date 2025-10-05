import { Leaf } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Leaf className="h-6 w-6 text-primary" />
      <span className="font-headline text-2xl font-bold text-foreground">
        ThriftEase
      </span>
    </div>
  );
};
