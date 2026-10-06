import { Artwork } from './artwork';

export interface CartItem {
  artwork: Artwork;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  currency: string;
  itemCount: number;
}

export type OrderStatus =
  | 'payment_pending'
  | 'confirmed'
  | 'preparing'
  | 'dispatched'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'simulated_paid'
  | 'failed'
  | 'studio_arrangement';

export type PaymentMethod =
  | 'card'
  | 'bank_transfer'
  | 'studio_arrangement';

export type DeliveryMethod =
  | 'insured_courier'
  | 'studio_pickup'
  | 'curatorial_installation';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateRegion: string;
  postalCode?: string;
  country: string;
  deliveryNotes?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. DAR-ORD-DEV-0001
  items: CartItem[];
  collector: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    userId?: string;
  };
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
  certificateId?: string;
  trackingNumber?: string;
  courier?: string;
  internalNotes?: {
    id: string;
    text: string;
    author: string;
    createdAt: string;
  }[];
}
