export interface Affiliate {
  id: string;
  name: string;
  code: string; // Código de indicação (ex: TAMBAU20, GUIAJOAO)
  phone?: string;
  email?: string;
  commissionType: 'percentage' | 'fixed';
  commissionValue: number; // Porcentagem (ex: 25) ou valor fixo (ex: 10.00)
  clicksCount: number;
  salesCount: number;
  totalRevenue: number; // Total faturado gerado pelo afiliado
  totalCommission: number; // Comissão total acumulada
  paidCommission: number; // Comissão já transferida/paga
  status: 'active' | 'paused';
  createdAt: string;
  notes?: string;
}

export interface AffiliateSale {
  id: string;
  affiliateId: string;
  affiliateCode: string;
  affiliateName: string;
  orderId: string;
  orderAmount: number;
  commissionAmount: number;
  buyerEmail?: string;
  buyerName?: string;
  createdAt: string;
  paymentMethod: 'pix' | 'credit_card';
}
