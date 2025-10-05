
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Product, UserOrder } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon, description, isLoading }: { title: string, value: string, icon: React.ReactNode, description?: string, isLoading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">{value}</div>}
            {description && !isLoading && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

export default function AdminPage() {
    const firestore = useFirestore();

    const ordersQuery = useMemoFirebase(() => collection(firestore, "orders"), [firestore]);
    const recentOrdersQuery = useMemoFirebase(() => query(ordersQuery, orderBy("createdAt", "desc"), limit(5)), [ordersQuery]);
    const productsQuery = useMemoFirebase(() => collection(firestore, "products"), [firestore]);

    const { data: orders, isLoading: isLoadingOrders } = useCollection<UserOrder>(ordersQuery);
    const { data: recentOrders, isLoading: isLoadingRecentOrders } = useCollection<UserOrder>(recentOrdersQuery);
    const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

    const totalRevenue = orders?.reduce((acc, order) => acc + order.total, 0) || 0;
    const availableProducts = products?.filter(p => !p.isSold).length || 0;

    const isLoading = isLoadingOrders || isLoadingProducts || isLoadingRecentOrders;

    const formatOrderDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString();
    }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <Button>Download Report</Button>
          </div>
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            isLoading={isLoadingOrders}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            description="All-time gross revenue"
        />
         <StatCard
            title="Orders"
            value={orders?.length.toString() || '0'}
            isLoading={isLoadingOrders}
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            description="Total orders placed"
        />
        <StatCard
            title="Products in Stock"
            value={availableProducts.toString()}
            isLoading={isLoadingProducts}
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            description="Total active listings"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
           <CardDescription>A list of the 5 most recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : recentOrders && recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id.substring(0, 7).toUpperCase()}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{order.userId.substring(0,10)}...</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{formatOrderDate(order.createdAt)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                         <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No recent orders found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
             <div className="flex items-center justify-end space-x-2 pt-4">
                <Button asChild variant="outline" size="sm">
                   <Link href="/admin/orders">View all orders</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    