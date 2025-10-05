"use client"

import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number is too short."),
  address: z.string().min(5, "Address is too short."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  zip: z.string().min(5, "ZIP code is too short."),
});

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof checkoutSchema>>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zip: "",
        },
    });

    if (cart.length === 0) {
        // In a real app, you might want to redirect, but for now, we'll show a message.
        // On component mount, this could cause a redirect.
         if (typeof window !== "undefined") {
            router.push('/shop');
         }
         return null;
    }

    const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
        console.log("Form submitted with values:", values);
        // Here you would handle payment processing with M-Pesa or another gateway.
        // For now, we'll simulate a successful order.
        toast({
            title: "Order Placed!",
            description: "Thank you for your purchase. A confirmation has been sent.",
        });
        clearCart();
        router.push("/account/orders?success=true");
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <div className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">Checkout</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Checkout Form */}
                <div className="lg:order-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number (for M-Pesa)</FormLabel>
                                                <FormControl><Input placeholder="254712345678" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="address" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Address</FormLabel>
                                            <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                         <FormField control={form.control} name="city" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                         <FormField control={form.control} name="state" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State / Province</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="zip" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ZIP / Postal Code</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    <div className="pt-6">
                                        <h3 className="text-lg font-medium text-foreground">Payment</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            You will be prompted to enter your M-Pesa PIN on your phone to complete the transaction.
                                        </p>
                                        <div className="mt-4 p-4 border rounded-md bg-primary/5 flex items-center gap-4">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1280px-M-PESA_LOGO-01.svg.png" alt="M-Pesa Logo" className="h-6" />
                                            <span className="font-semibold">Pay with M-Pesa</span>
                                        </div>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full">
                                        Pay {formatCurrency(cartTotal)}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:order-2">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {cart.map(item => (
                                    <li key={item.productId} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">{item.quantity}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                        </div>
                                        <p className="font-medium">{formatCurrency(item.price)}</p>
                                    </li>
                                ))}
                            </ul>
                            <Separator className="my-6" />
                             <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span className="font-medium">{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Shipping</span>
                                  <span className="font-medium">Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                  <span>Total</span>
                                  <span>{formatCurrency(cartTotal)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
