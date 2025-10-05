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
import { useAuth, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { UserOrder } from "@/lib/types";

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
    const { user } = useAuth();
    const firestore = useFirestore();

    const form = useForm<z.infer<typeof checkoutSchema>>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            name: user?.displayName || "",
            email: user?.email || "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zip: "",
        },
    });

     if (typeof window !== "undefined" && cart.length === 0) {
        router.push('/shop');
        return null;
    }

    const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
        if (!user) {
             toast({
                variant: "destructive",
                title: "Not authenticated",
                description: "You must be logged in to place an order.",
            });
            router.push('/login?next=/checkout');
            return;
        }

        const newOrder: Omit<UserOrder, 'id' | 'createdAt'> = {
            userId: user.uid,
            customerName: values.name,
            items: cart,
            total: cartTotal,
            status: 'Pending',
            paymentMethod: 'M-Pesa',
        };

        const ordersRef = collection(firestore, 'orders');
        
        // Use non-blocking write
        addDocumentNonBlocking(ordersRef, {
            ...newOrder,
            createdAt: serverTimestamp(),
        });
        
        // In a real scenario, you'd also mark products as "sold" here.

        toast({
            title: "Order Placed!",
            description: "Thank you for your purchase. A confirmation has been sent.",
        });
        clearCart();
        router.push("/account");
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
                                                <FormControl><Input placeholder="Nairobi" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                         <FormField control={form.control} name="state" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>County</FormLabel>
                                                <FormControl><Input placeholder="Nairobi" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="zip" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ZIP / Postal Code</FormLabel>
                                                <FormControl><Input placeholder="00100" {...field} /></FormControl>
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
                                            <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1280px-M-PESA_LOGO-01.svg.png" alt="M-Pesa Logo" width={80} height={24} />
                                            <span className="font-semibold">Pay with M-Pesa</span>
                                        </div>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? "Placing Order..." : `Pay ${formatCurrency(cartTotal)}`}
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

    