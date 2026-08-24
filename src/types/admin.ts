import { User } from './user';
import { Place } from './place';
import { PaymentTransaction } from './payment';

export interface AdminMetrics {
  totalRevenue: number;
  totalSales: number;
  conversionRate: number; // Ex: 14.8%
  averageTicket: number; // Ex: 39.90
  pixSalesCount: number;
  cardSalesCount: number;
  activeLifetimeUsers: number;
  pendingUsers: number;
  refundsCount: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'payment_approved' | 'webhook_received' | 'user_granted' | 'user_revoked' | 'place_created' | 'place_updated' | 'place_deleted' | 'general';
  title: string;
  details: string;
  payload?: any;
}
