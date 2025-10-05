"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for orders, will be replaced with real data later
const orders = [
    { id: "ORD001", date: "2023-10-15", total: 45.00, status: "Delivered", items: 1 },
    { id: "ORD002", date: "2023-10-20", total: 60.00, status: "Shipped", items: 1 },
    { id: "ORD003", date: "2023-10-25", total: 28.00, status: "Processing", items: 1 },
];

export default function AccountPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

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
                        <Button variant="outline" className="w-full">Edit Profile</Button>
                        <Button variant="destructive" className="w-full mt-2">Sign Out</Button>
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
                                    <p>Profile editing form will go here.</p>
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
