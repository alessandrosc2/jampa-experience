import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  PaymentTransaction,
  PixDetails,
  CardDetails,
  WebhookEvent,
  InstallmentOption
} from '../types/payment';
import { User } from '../types/user';
import { authService } from './authService';
import { generateBacenPixPayload, STRIPE_CHECKOUT_URL } from '../utils/pixUtils';

const STORAGE_TRANSACTIONS_KEY = 'jampa_transactions_db';
const BASE_AMOUNT = 39.90;

class PaymentService {
  public getTransactions(): PaymentTransaction[] {
    const data = localStorage.getItem(STORAGE_TRANSACTIONS_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private saveTransactions(list: PaymentTransaction[]): void {
    localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(list));
  }

  public getInstallmentOptions(): InstallmentOption[] {
    return [
      { installments: 1, installmentAmount: 39.90, totalAmount: 39.90, label: '1x de R$ 39,90 (sem juros)' },
      { installments: 2, installmentAmount: 20.45, totalAmount: 40.90, label: '2x de R$ 20,45' },
      { installments: 3, installmentAmount: 13.80, totalAmount: 41.40, label: '3x de R$ 13,80' },
      { installments: 6, installmentAmount: 7.15, totalAmount: 42.90, label: '6x de R$ 7,15' }
    ];
  }

  public getStripeCheckoutUrl(): string {
    return STRIPE_CHECKOUT_URL;
  }

  public detectCardBrand(cardNumber: string): 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'amex' | undefined {
    const clean = cardNumber.replace(/\D/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
    if (/^(4011|4389|4514|4576|5041|5066|5090|6277|6362|6363)/.test(clean)) return 'elo';
    if (/^(606282|3841)/.test(clean)) return 'hipercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return undefined;
  }

  public async createPixTransaction(
    user: { id?: string; name: string; email: string },
    gateway: PaymentGateway = 'mercadopago'
  ): Promise<PaymentTransaction> {
    await new Promise((r) => setTimeout(r, 400));

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const txId = 'TX-PIX-' + Date.now();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const pixData = generateBacenPixPayload({
      amount: BASE_AMOUNT,
      txid: orderId.replace(/\D/g, '')
    });

    const transaction: PaymentTransaction = {
      id: txId,
      orderId,
      userId: user.id || 'visitor-' + Date.now(),
      userName: user.name,
      userEmail: user.email,
      gateway,
      gatewayTransactionId: 'PIX-DIRECT-' + Date.now(),
      paymentMethod: 'pix',
      amount: BASE_AMOUNT,
      currency: 'BRL',
      status: 'pending',
      statusDetail: 'Aguardando pagamento do PIX pelo comprador',
      installments: 1,
      pixDetails: {
        qrCodeText: pixData.payload,
        qrCodeImage: pixData.qrCodeUrl,
        expiresAt,
        expirationSecondsRemaining: 900
      },
      createdAt: new Date().toISOString()
    };

    const list = this.getTransactions();
    list.unshift(transaction);
    this.saveTransactions(list);

    return transaction;
  }

  public async processCardTransaction(
    user: { id?: string; name: string; email: string },
    card: CardDetails,
    gateway: PaymentGateway = 'mercadopago'
  ): Promise<PaymentTransaction> {
    await new Promise((r) => setTimeout(r, 900));

    const cleanNumber = card.number.replace(/\D/g, '');
    const lastFour = cleanNumber.slice(-4) || '4829';
    const brand = this.detectCardBrand(cleanNumber) || 'mastercard';

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const txId = 'TX-CARD-' + Date.now();

    // Validação básica do cartão
    if (cleanNumber.length < 13 && !card.number.includes('•')) {
      throw new Error('Número de cartão inválido. Verifique os dados digitados.');
    }

    const transaction: PaymentTransaction = {
      id: txId,
      orderId,
      userId: user.id || 'visitor-' + Date.now(),
      userName: user.name,
      userEmail: user.email,
      gateway,
      gatewayTransactionId: 'MP-CARD-' + Math.floor(10000000 + Math.random() * 90000000),
      paymentMethod: 'credit_card',
      amount: BASE_AMOUNT,
      currency: 'BRL',
      status: 'approved',
      statusDetail: 'Aprovado instantaneamente pelo emissor do cartão',
      installments: card.installments || 1,
      cardBrand: brand.toUpperCase(),
      cardLastFour: lastFour,
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    };

    const list = this.getTransactions();
    list.unshift(transaction);
    this.saveTransactions(list);

    // Conceder acesso vitalício se usuário já existe
    if (user.id && !user.id.startsWith('visitor-')) {
      authService.grantLifetimeAccess(user.id);
    }

    return transaction;
  }

  /**
   * Simula o recebimento do Webhook oficial do Mercado Pago / Gateway
   * O servidor valida a assinatura, atualiza a transação e concede o acesso vitalício.
   */
  public async simulateWebhookConfirmation(transactionId: string): Promise<PaymentTransaction> {
    await new Promise((r) => setTimeout(r, 400));

    const list = this.getTransactions();
    const idx = list.findIndex((t) => t.id === transactionId);

    if (idx === -1) {
      throw new Error('Transação não localizada no servidor.');
    }

    list[idx].status = 'approved';
    list[idx].statusDetail = 'Pagamento aprovado via Webhook com conciliação bancária';
    list[idx].approvedAt = new Date().toISOString();

    this.saveTransactions(list);

    // Se o usuário possui ID cadastrado, concede acesso vitalício imediato
    if (list[idx].userId && !list[idx].userId.startsWith('visitor-')) {
      authService.grantLifetimeAccess(list[idx].userId);
    }

    return list[idx];
  }

  /**
   * Simula o estorno ou reembolso (Chargeback / Refund)
   */
  public async simulateRefund(transactionId: string): Promise<PaymentTransaction> {
    const list = this.getTransactions();
    const idx = list.findIndex((t) => t.id === transactionId);

    if (idx === -1) {
      throw new Error('Transação não localizada.');
    }

    list[idx].status = 'refunded';
    list[idx].statusDetail = 'Pagamento estornado/reembolsado ao comprador';
    list[idx].refundedAt = new Date().toISOString();

    this.saveTransactions(list);

    // Revoga acesso do usuário
    if (list[idx].userId && !list[idx].userId.startsWith('visitor-')) {
      authService.updateUserProfile(list[idx].userId, {
        accessStatus: 'refunded',
        accessType: 'none'
      });
    }

    return list[idx];
  }

  public getTransactionById(txId: string): PaymentTransaction | undefined {
    const list = this.getTransactions();
    return list.find((t) => t.id === txId);
  }
}

export const paymentService = new PaymentService();
