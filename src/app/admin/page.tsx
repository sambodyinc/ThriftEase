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
import { DollarSign, Package, ShoppingCart, Users, ArrowUpRight } from "lucide-react";
import Link from 'next/link';

// Mock data - replace with real data fetching
const summaryStats = {
    revenue: { value: 12540, change: "+15.2%" },
    orders: { value: 342, change: "+8.1%" },
    customers: { value: 89, change: "+20" },
    products: { value: 215 },
};

const recentOrders = [
    { id: 'ORD015', customer: 'Alice Johnson', total: 75.00, status: 'Shipped' },
    { id: 'ORD014', customer: 'Bob Williams', total: 42.50, status: 'Processing' },
    { id: 'ORD013', customer: 'Charlie Brown', total: 112.00, status: 'Delivered' },
];

export default function AdminPage() {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.revenue.value)}</div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.revenue.change} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summaryStats.orders.value}</div>
            <p className="text-xs text-muted-foreground">
                {summaryStats.orders.change} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summaryStats.customers.value}</div>
             <p className="text-xs text-muted-foreground">
              in the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.products.value}</div>
            <p className="text-xs text-muted-foreground">
              Total active listings
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
           <CardDescription>A list of the most recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
             <div className="flex items-center justify-end space-x-2 pt-4">
                <Button asChild variant="outline" size="sm">
                   <Link href="#">View all orders</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
