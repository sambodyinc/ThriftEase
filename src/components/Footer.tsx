import Link from 'next/link';
import { Logo } from './Logo';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/shop' },
        { label: 'Tops', href: '/shop?category=Tops' },
        { label: 'Bottoms', href: '/shop?category=Bottoms' },
        { label: 'Dresses', href: '/shop?category=Dresses' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Shipping & Returns', href: '/shipping' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  return (
    <footer className="bg-primary/5 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 text-muted-foreground text-sm max-w-xs">
              Sustainable Style, Unbeatable Prices. Your destination for unique, pre-loved fashion.
            </p>
            <div className="mt-6">
                <h4 className="font-semibold text-foreground">Stay in the loop</h4>
                <p className="text-muted-foreground text-sm mt-1">Get updates on new arrivals and special offers.</p>
                <form className="mt-4 flex gap-2">
                    <Input type="email" placeholder="Enter your email" className="bg-background" />
                    <Button type="submit" variant="default">Subscribe</Button>
                </form>
            </div>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="font-headline font-semibold text-foreground">{section.title}</h3>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-border/50 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ThriftEase. All rights reserved.
          </p>
          {/* Add social media icons here if needed */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
