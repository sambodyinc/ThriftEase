"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock data for orders, will be replaced with real data later
const orders = [
    { id: "ORD001", date: "2023-10-15", total: 45.00, status: "Delivered", items: 1 },
    { id: "ORD002", date: "2023-10-20", total: 60.00, status: "Shipped", items: 1 },
    { id: "ORD003", date: "2023-10-25", total: 28.00, status: "Processing", items: 1 },
];

const profileSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
});


export default function AccountPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const auth = useAuth();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName || "",
        },
    });

    // Reset form when user data is available
    if (user && form.getValues().displayName !== user.displayName) {
        form.reset({ displayName: user.displayName || "" });
    }

    const onProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
        if (!auth.currentUser) {
            toast({ variant: "destructive", title: "Not authenticated" });
            return;
        }

        try {
            await updateProfile(auth.currentUser, {
                displayName: values.displayName,
            });
            toast({ title: "Profile updated successfully!" });
            setIsDialogOpen(false);
            // The onAuthStateChanged listener will pick up the change and re-render.
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error updating profile",
                description: error.message,
            });
        }
    };


    if (isUserLoading) {
        return <AccountPageSkeleton />;
    }

    if (!user) {
        if (typeof window !== "undefined") {
            router.push('/login');
        }
        return null;
    }
    
    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
                <Card className="w-full md:w-1/3 lg:w-1/4">
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{user.displayName || "User"}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">Edit Profile</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Update your display name. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onProfileUpdate)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="displayName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Display Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Your name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="destructive" className="w-full mt-2" onClick={() => auth.signOut()}>Sign Out</Button>
                    </CardContent>
                </Card>

                <div className="w-full md:w-2/3 lg:w-3/4">
                    <Tabs defaultValue="orders">
                        <TabsList>
                            <TabsTrigger value="orders">Order History</TabsTrigger>
                            <TabsTrigger value="profile">Profile Details</TabsTrigger>
                            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                        </TabsList>
                        <TabsContent value="orders">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Orders</CardTitle>
                                    <CardDescription>View the history of your past purchases.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="flex justify-between items-center p-4 border rounded-md">
                                                <div>
                                                    <p className="font-semibold">{order.id}</p>
                                                    <p className="text-sm text-muted-foreground">{order.date} - {order.items} item(s)</p>
                                                </div>
                                                <div className="text-right">
                                                     <p className="font-semibold">${order.total.toFixed(2)}</p>
                                                     <p className="text-sm text-primary">{order.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="profile">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Profile Details</CardTitle>
                                    <CardDescription>Manage your personal and shipping information.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p><span className="font-semibold">Full Name:</span> {user.displayName}</p>
                                        <p><span className="font-semibold">Email:</span> {user.email}</p>
                                        <p className="text-muted-foreground pt-4">More profile fields coming soon!</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="wishlist">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Your Wishlist</CardTitle>
                                    <CardDescription>Items you are saving for later.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-center py-8 text-muted-foreground">Your wishlist is empty.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

const AccountPageSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start gap-8">
            <Card className="w-full md:w-1/3 lg:w-1/4">
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <div className="w-full md:w-2/3 lg:w-3/4">
                <Skeleton className="h-10 w-48 mb-4" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    </div>
);
