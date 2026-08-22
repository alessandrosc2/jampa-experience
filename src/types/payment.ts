export type PaymentGateway = 'mercadopago' | 'stripe' | 'asaas';

export type PaymentMethod = 'pix' | 'credit_card';

export type PaymentStatus = 
  | 'pending'
  | 'approved'
  | 'authorized'
  | 'in_process'
  | 'rejected'
  | 'cancelled'
  | 'refunded'
  | 'charged_back';

export interface PixDetails {
  qrCodeBase64?: string;
  qrCodeText: string;
  expiresAt: string;
  expirationSecondsRemaining: number;
}

export interface CardDetails {
  number: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  installments: number;
  brand?: 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'amex';
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  gateway: PaymentGateway;
  gatewayTransactionId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: 'BRL';
  status: PaymentStatus;
  statusDetail: string;
  installments: number;
  pixDetails?: PixDetails;
  cardBrand?: string;
  cardLastFour?: string;
  createdAt: string;
  approvedAt?: string;
  refundedAt?: string;
}

export interface WebhookEvent {
  id: string;
  action: 'payment.created' | 'payment.updated' | 'payment.refunded';
  data: {
    id: string;
    transactionId: string;
    status: PaymentStatus;
  };
  date_created: string;
}

export interface InstallmentOption {
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  label: string;
}
