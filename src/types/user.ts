export type AccessStatus = 
  | 'visitor'
  | 'registered'
  | 'payment_pending'
  | 'paid'
  | 'active'
  | 'blocked'
  | 'refunded';

export type AccessType = 'lifetime' | 'trial' | 'none';

export type PaymentMethod = 'pix' | 'credit_card';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  accessStatus: AccessStatus;
  accessType: AccessType;
  purchasedAt?: string;
  orderId?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number; // 39.90
  currency: 'BRL';
  paymentMethod: PaymentMethod;
  status: 'pending' | 'approved' | 'failed' | 'refunded';
  createdAt: string;
  paidAt?: string;
  pixQrCode?: string;
  pixCode?: string;
}

export interface PlanOffer {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  currency: string;
  billingType: 'single_payment';
  accessDuration: 'lifetime';
  features: string[];
}
