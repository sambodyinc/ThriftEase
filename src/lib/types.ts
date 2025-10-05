import { CATEGORIES, SIZES, CONDITIONS } from "./constants";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: typeof CATEGORIES[number];
  condition: typeof CONDITIONS[number];
  size: typeof SIZES[number];
  color: string;
  images: string[]; // Placeholder IDs from placeholder-images.json
  isFeatured: boolean;
  isSold: boolean;
  createdAt: Date;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  wishlist?: string[];
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  roles?: ('admin' | 'customer')[];
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: typeof SIZES[number];
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  createdAt: any; // Allow for Firestore Timestamp
};

export type GuestOrder = Order & {
  guestId: string;
  name: string;
  phone: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};

export type UserOrder = Order & {
  userId: string;
  customerName: string;
};

    