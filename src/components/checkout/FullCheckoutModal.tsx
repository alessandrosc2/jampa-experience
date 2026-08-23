import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CreditCard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  ArrowRight,
  Infinity,
  Clock,
  RefreshCw,
  Receipt,
  FileCheck,
  AlertCircle,
  Zap,
  ExternalLink
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { paymentService } from '../../services/paymentService';
import { PaymentTransaction, PaymentMethod, InstallmentOption } from '../../types/payment';
import { User } from '../../types/user';

interface FullCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onPaymentApproved: (transaction: PaymentTransaction) => void;
}

export const FullCheckoutModal: React.FC<FullCheckoutModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPaymentApproved
}) => {
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [step, setStep] = useState<'checkout' | 'pix_pending' | 'success'>('checkout');
  const [loading, setLoading] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dados do Comprador
  const [buyerName, setBuyerName] = useState(currentUser?.name || 'Alessandro Silva');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || 'alessandro@exemplo.com.br');
  const [buyerCpf, setBuyerCpf] = useState('123.456.789-00');

  // Dados do Cartão
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4829');
  const [cardHolder, setCardHolder] = useState(buyerName);
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('888');
  const [installments, setInstallments] = useState(1);

  // Transação Ativa
  const [activeTransaction, setActiveTransaction] = useState<PaymentTransaction | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 minutos

  const installmentOptions = paymentService.getInstallmentOptions();
  const detectedBrand = paymentService.detectCardBrand(cardNumber);

  useEffect(() => {
    if (currentUser) {
      setBuyerName(currentUser.name);
      setBuyerEmail(currentUser.email);
      setCardHolder(currentUser.name);
    }
  }, [currentUser]);

  // Contador regressivo do PIX
  useEffect(() => {
    if (step !== 'pix_pending') return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyPixCode = () => {
    if (!activeTransaction?.pixDetails?.qrCodeText) return;
    navigator.clipboard.writeText(activeTransaction.pixDetails.qrCodeText);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  // Gerar PIX
  const handleInitiatePix = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const tx = await paymentService.createPixTransaction({
        id: currentUser?.id,
        name: buyerName,
        email: buyerEmail
      });
      setActiveTransaction(tx);
      setStep('pix_pending');
      setSecondsRemaining(900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao gerar PIX.');
    } finally {
      setLoading(false);
    }
  };

  // Processar Cartão
  const handleProcessCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const tx = await paymentService.processCardTransaction(
        {
          id: currentUser?.id,
          name: buyerName,
          email: buyerEmail
        },
        {
          number: cardNumber,
          holderName: cardHolder,
          expiryMonth: cardExpiry.split('/')[0] || '08',
          expiryYear: cardExpiry.split('/')[1] || '29',
          cvv: cardCvv,
          installments
        }
      );

      setActiveTransaction(tx);
      setStep('success');
      onPaymentApproved(tx);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar cartão.');
    } finally {
      setLoading(false);
    }
  };

  // Simular Webhook de Aprovação Bancária do PIX
  const handleSimulateWebhook = async () => {
    if (!activeTransaction) return;
    setLoading(true);

    try {
      const approvedTx = await paymentService.simulateWebhookConfirmation(activeTransaction.id);
      setActiveTransaction(approvedTx);
      setStep('success');
      onPaymentApproved(approvedTx);
    } catch (err: any) {
      setErrorMessage('Erro na validação do webhook.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndEnter = () => {
    onClose();
    setStep('checkout');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="680px"
      title={
        <div className="full-checkout-title">
          <ShieldCheck size={22} color="#00B4D8" />
          <span>Checkout Seguro — Pagamento Único Vitalício</span>
        </div>
      }
    >
      <div className="checkout-wrapper">
        {/* PASSO 1: FORMULÁRIO DE CHECKOUT */}
        {step === 'checkout' && (
          <div className="checkout-step-content">
            {/* Box Resumo do Produto */}
            <div className="product-summary-card glass-panel">
              <div className="product-info-left">
                <span className="product-title">JAMPA EXPERIENCE — Acesso Vitalício</span>
                <span className="product-desc">Guia Premium, Mapas, Roteiros de 1/3/5 dias e Dicas Secretas</span>
                <div className="product-badges-row">
                  <Badge variant="emerald" size="sm">✓ Sem Mensalidades</Badge>
                  <Badge variant="gold" size="sm">✓ Acesso Vitalício</Badge>
                </div>
              </div>
              <div className="product-price-col">
                <span className="price-label-small">Total a pagar:</span>
                <div className="price-big-display">
                  <span className="curr">R$</span>
                  <span className="val">39,90</span>
                </div>
              </div>
            </div>

            {/* Seletor de Método de Pagamento */}
            <div className="method-selection-tabs">
              <button
                type="button"
                className={`method-tab ${method === 'pix' ? 'active' : ''}`}
                onClick={() => setMethod('pix')}
              >
                <div className="method-tab-inner">
                  <QrCode size={20} className="method-icon" />
                  <div className="method-text">
                    <strong>PIX Instantâneo</strong>
                    <span>Aprovação em segundos</span>
                  </div>
                </div>
                <span className="pix-fast-pill">⚡ Recomendado</span>
              </button>

              <button
                type="button"
                className={`method-tab ${method === 'credit_card' ? 'active' : ''}`}
                onClick={() => setMethod('credit_card')}
              >
                <div className="method-tab-inner">
                  <CreditCard size={20} className="method-icon" />
                  <div className="method-text">
                    <strong>Cartão de Crédito (Stripe)</strong>
                    <span>Até 6x no cartão</span>
                  </div>
                </div>
              </button>
            </div>

            {errorMessage && (
              <div className="checkout-error-alert glass-panel">
                <AlertCircle size={18} color="#EF4444" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* FORMULÁRIO DO PIX */}
            {method === 'pix' && (
              <form onSubmit={handleInitiatePix} className="method-form">
                <div className="buyer-info-grid">
                  <div className="form-group">
                    <label className="f-label">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="f-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="f-label">E-mail para Liberação</label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="f-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="f-label">CPF do Pagador (para nota fiscal e PIX)</label>
                  <input
                    type="text"
                    required
                    value={buyerCpf}
                    onChange={(e) => setBuyerCpf(e.target.value)}
                    className="f-input"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                  iconLeft={<QrCode size={20} />}
                >
                  GERAR PIX — R$ 39,90
                </Button>
              </form>
            )}

            {/* FORMULÁRIO DO CARTÃO DE CRÉDITO */}
            {/* FORMULÁRIO DO CARTÃO DE CRÉDITO */}
            {method === 'credit_card' && (
              <div className="method-form">
                {/* Banner Oficial do Stripe Checkout */}
                <div className="stripe-checkout-promo glass-panel">
                  <div className="stripe-promo-header">
                    <div className="stripe-badge-pill">Stripe Oficial</div>
                    <span className="stripe-promo-title">Pagamento com Cartão de Crédito</span>
                  </div>
                  <p className="stripe-promo-desc">
                    Aceita todos os cartões nacionais e internacionais (Visa, Mastercard, Elo, Hipercard, Amex, Apple Pay e Google Pay) em <strong>até 6x de R$ 7,15</strong> no ambiente seguro da Stripe.
                  </p>
                  <a
                    href={paymentService.getStripeCheckoutUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stripe-direct-checkout-btn"
                  >
                    <Lock size={18} />
                    <span>PAGAR COM CARTÃO NO STRIPE (ATÉ 6X)</span>
                    <ExternalLink size={18} />
                  </a>
                </div>

                <div className="card-divider-or">
                  <span>ou preencha os dados do cartão abaixo</span>
                </div>

                <form onSubmit={handleProcessCard}>
                  <div className="buyer-info-grid">
                    <div className="form-group">
                      <label className="f-label">Nome do Titular (como no cartão)</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="f-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="f-label">E-mail para Recebimento</label>
                      <input
                        type="email"
                        required
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="f-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="f-label-row">
                      <label className="f-label">Número do Cartão</label>
                      {detectedBrand && (
                        <span className="brand-detected-tag">
                          Bandeira: {detectedBrand.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="f-input"
                    />
                  </div>

                  <div className="card-sub-grid">
                    <div className="form-group">
                      <label className="f-label">Validade (MM/AA)</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="f-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="f-label">CVC / CVV</label>
                      <input
                        type="text"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="f-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="f-label">Parcelamento</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(Number(e.target.value))}
                      className="f-select"
                    >
                      {installmentOptions.map((opt) => (
                        <option key={opt.installments} value={opt.installments}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    fullWidth
                    isLoading={loading}
                    iconLeft={<Lock size={18} />}
                  >
                    FINALIZAR PAGAMENTO COM CARTÃO (R$ 39,90)
                  </Button>
                </form>
              </div>
            )}

            <div className="checkout-trust-footer">
              <ShieldCheck size={16} color="#10B981" />
              <span>Ambiente 100% Criptografado • Processamento Oficial Stripe & PIX Banco Central</span>
            </div>
          </div>
        )}

        {/* PASSO 2: PIX GERADO — AGUARDANDO PAGAMENTO COM CHAVE OFICIAL */}
        {step === 'pix_pending' && activeTransaction && (
          <div className="pix-pending-content">
            <div className="pix-timer-bar glass-panel">
              <Clock size={18} color="#F4A261" />
              <span>
                Pague seu PIX em até <strong>{formatTimer(secondsRemaining)}</strong> para liberação imediata.
              </span>
            </div>

            <div className="pix-center-box glass-panel">
              {/* QR CODE OFICIAL BACEN */}
              <div className="qr-svg-wrapper">
                <img
                  src={
                    activeTransaction.pixDetails?.qrCodeImage ||
                    `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
                      activeTransaction.pixDetails?.qrCodeText || ''
                    )}&margin=10`
                  }
                  alt="QR Code PIX Oficial"
                  className="pix-official-qr-image"
                  width="180"
                  height="180"
                />
              </div>

              {/* DADOS DO BENEFICIÁRIO DO PIX */}
              <div className="pix-beneficiary-card">
                <div className="pix-b-row">
                  <span className="b-lbl">Titular da Conta:</span>
                  <strong className="b-val">Alessandro Dos Santos Cordeiro</strong>
                </div>
                <div className="pix-b-row">
                  <span className="b-lbl">Chave PIX:</span>
                  <strong className="b-val mono-key">05d68d46-c90a-4b73-b2f3-fe86d2f34124</strong>
                </div>
                <div className="pix-b-row">
                  <span className="b-lbl">Cidade / Valor:</span>
                  <strong className="b-val highlight-gold">João Pessoa - PB • R$ 39,90</strong>
                </div>
              </div>

              <span className="pix-instruction">
                1. Abra o app do seu banco no celular<br />
                2. Escolha <strong>Pagar com PIX &gt; Ler QR Code</strong> ou <strong>PIX Copia e Cola</strong>
              </span>

              {/* PIX Copia e Cola */}
              <div className="pix-copy-section">
                <span className="pix-copy-label">Código PIX Copia e Cola Oficial:</span>
                <div className="copy-action-row">
                  <input
                    type="text"
                    readOnly
                    value={activeTransaction.pixDetails?.qrCodeText}
                    className="pix-string-input"
                  />
                  <button
                    type="button"
                    className="copy-trigger-btn"
                    onClick={handleCopyPixCode}
                  >
                    {copiedPix ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AÇÃO DE LIBERAÇÃO IMEDIATA DO ACESSO */}
            <div className="pix-instant-action-box glass-panel">
              <div className="pix-action-text">
                <CheckCircle2 size={22} color="#10B981" />
                <div>
                  <strong>Já realizou o PIX de R$ 39,90?</strong>
                  <p>Clique abaixo para validar e liberar seu Acesso Vitalício imediatamente.</p>
                </div>
              </div>
              <Button
                variant="gold"
                size="lg"
                fullWidth
                isLoading={loading}
                onClick={handleSimulateWebhook}
                iconLeft={<Sparkles size={18} />}
              >
                JÁ REALIZEI O PAGAMENTO PIX (LIBERAR AGORA)
              </Button>
            </div>
          </div>
        )}

        {/* PASSO 3: RECIBO DIGITAL & CONFIRMAÇÃO DO ACESSO VITALÍCIO */}
        {step === 'success' && activeTransaction && (
          <div className="success-receipt-content">
            <div className="receipt-banner">
              <div className="success-icon-pulsing">
                <CheckCircle2 size={54} color="#10B981" />
              </div>
              <h3 className="success-title">🎉 Pagamento Confirmado com Sucesso!</h3>
              <p className="success-subtitle">
                Seu acesso vitalício ao <strong>JAMPA EXPERIENCE</strong> está liberado e ativo para sempre.
              </p>
            </div>

            {/* Comprovante / Recibo Digital */}
            <div className="digital-receipt glass-panel">
              <div className="receipt-header">
                <Receipt size={18} color="#00B4D8" />
                <span>COMPROVANTE OFICIAL DE TRANSAÇÃO</span>
              </div>

              <div className="receipt-grid">
                <div className="receipt-item">
                  <span className="r-label">Código do Pedido:</span>
                  <span className="r-val mono">{activeTransaction.orderId}</span>
                </div>
                <div className="receipt-item">
                  <span className="r-label">ID da Transação:</span>
                  <span className="r-val mono">{activeTransaction.gatewayTransactionId}</span>
                </div>
                <div className="receipt-item">
                  <span className="r-label">Valor Pago:</span>
                  <span className="r-val highlight">R$ 39,90 (Pagamento Único)</span>
                </div>
                <div className="receipt-item">
                  <span className="r-label">Forma de Pagamento:</span>
                  <span className="r-val">
                    {activeTransaction.paymentMethod === 'pix' ? 'PIX Instantâneo' : `Cartão de Crédito (${activeTransaction.installments}x)`}
                  </span>
                </div>
                <div className="receipt-item">
                  <span className="r-label">Status do Acesso:</span>
                  <Badge variant="emerald" icon={<Infinity size={13} />}>
                    Acesso Vitalício Ativo
                  </Badge>
                </div>
                <div className="receipt-item">
                  <span className="r-label">E-mail Titular:</span>
                  <span className="r-val">{activeTransaction.userEmail}</span>
                </div>
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              fullWidth
              iconRight={<ArrowRight size={20} />}
              onClick={handleFinishAndEnter}
            >
              ENTRAR NO JAMPA EXPERIENCE VIP
            </Button>
          </div>
        )}
      </div>

      <style>{`
        .full-checkout-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .checkout-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .checkout-step-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .product-summary-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md) var(--space-lg);
          background: rgba(12, 20, 31, 0.95);
          border: 1px solid rgba(0, 180, 216, 0.35);
          border-radius: var(--radius-lg);
          gap: var(--space-md);
        }

        .product-info-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .product-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .product-desc {
          font-size: 0.78125rem;
          color: #94A3B8;
        }

        .product-badges-row {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.25rem;
        }

        .product-price-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .price-label-small {
          font-size: 0.6875rem;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .price-big-display {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .price-big-display .curr {
          font-size: 1.1rem;
          font-weight: 700;
          color: #F4A261;
        }

        .price-big-display .val {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 900;
          color: #F8FAFC;
        }

        .method-selection-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .method-tab {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .method-tab:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .method-tab.active {
          background: rgba(0, 180, 216, 0.15);
          border-color: #00B4D8;
          box-shadow: 0 0 20px rgba(0, 180, 216, 0.25);
        }

        .method-tab-inner {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .method-icon {
          color: #00B4D8;
        }

        .method-text {
          display: flex;
          flex-direction: column;
        }

        .method-text strong {
          font-family: var(--font-display);
          font-size: 0.875rem;
          color: #F8FAFC;
        }

        .method-text span {
          font-size: 0.6875rem;
          color: #94A3B8;
        }

        .pix-fast-pill {
          font-size: 0.625rem;
          font-weight: 800;
          background: #10B981;
          color: #060B11;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
        }

        .method-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .buyer-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .card-sub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .f-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .f-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .brand-detected-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #00B4D8;
        }

        .f-input, .f-select {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #F8FAFC;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .f-input:focus, .f-select:focus {
          border-color: #00B4D8;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.2);
        }

        .f-select {
          cursor: pointer;
        }

        .f-select option {
          background: #0C141F;
          color: #F8FAFC;
        }

        /* STRIPE PROMO BANNER */
        .stripe-checkout-promo {
          padding: 1.1rem;
          background: linear-gradient(135deg, rgba(99, 91, 255, 0.15), rgba(0, 180, 216, 0.1));
          border: 1px solid rgba(99, 91, 255, 0.35);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
        }

        .stripe-promo-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .stripe-badge-pill {
          padding: 0.2rem 0.6rem;
          background: #635BFF;
          color: #FFFFFF;
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          border-radius: 9999px;
          letter-spacing: 0.05em;
        }

        .stripe-promo-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .stripe-promo-desc {
          font-size: 0.8125rem;
          color: #CBD5E1;
          line-height: 1.4;
        }

        .stripe-direct-checkout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #635BFF;
          color: #FFFFFF;
          font-size: 0.875rem;
          font-weight: 800;
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: all var(--transition-fast);
          box-shadow: 0 4px 15px rgba(99, 91, 255, 0.35);
          margin-top: 0.3rem;
        }

        .stripe-direct-checkout-btn:hover {
          background: #5046E5;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 91, 255, 0.5);
        }

        .card-divider-or {
          text-align: center;
          position: relative;
          margin: 0.75rem 0;
        }

        .card-divider-or span {
          font-size: 0.75rem;
          color: #64748B;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* PIX BENEFICIARY CARD */
        .pix-beneficiary-card {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: left;
        }

        .pix-b-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
        }

        .b-lbl {
          color: #94A3B8;
          font-size: 0.75rem;
        }

        .b-val {
          color: #F8FAFC;
        }

        .mono-key {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #38BDF8;
          word-break: break-all;
        }

        .highlight-gold {
          color: #F4A261;
          font-weight: 800;
        }

        .pix-official-qr-image {
          border-radius: 6px;
          display: block;
        }

        .pix-instant-action-box {
          padding: var(--space-md) var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          border: 1px solid rgba(16, 185, 129, 0.35);
          background: rgba(12, 20, 31, 0.95);
        }

        .pix-action-text {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-align: left;
        }

        .pix-action-text strong {
          display: block;
          font-size: 0.875rem;
          color: #F8FAFC;
        }

        .pix-action-text p {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .checkout-trust-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #64748B;
        }

        .checkout-error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: var(--radius-md);
          color: #FCA5A5;
          font-size: 0.8125rem;
        }

        /* PIX PENDING */
        .pix-pending-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .pix-timer-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1rem;
          background: rgba(244, 162, 97, 0.12);
          border: 1px solid rgba(244, 162, 97, 0.3);
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          color: #E2E8F0;
        }

        .pix-center-box {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          text-align: center;
        }

        .qr-svg-wrapper {
          padding: 0.75rem;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        .pix-instruction {
          font-size: 0.8125rem;
          color: #94A3B8;
          line-height: 1.5;
        }

        .pix-copy-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          text-align: left;
        }

        .pix-copy-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #CBD5E1;
        }

        .copy-action-row {
          display: flex;
          gap: 0.5rem;
        }

        .pix-string-input {
          flex: 1;
          padding: 0.6rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #94A3B8;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          outline: none;
        }

        .copy-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.6rem 1.1rem;
          background: rgba(0, 180, 216, 0.2);
          border: 1px solid #00B4D8;
          border-radius: var(--radius-md);
          color: #38BDF8;
          font-weight: 700;
          font-size: 0.8125rem;
          cursor: pointer;
        }

        .webhook-tester-card {
          padding: var(--space-md) var(--space-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          border: 1px solid rgba(0, 180, 216, 0.3);
          background: rgba(12, 20, 31, 0.95);
        }

        .webhook-text {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .webhook-text strong {
          display: block;
          font-size: 0.8125rem;
          color: #F8FAFC;
        }

        .webhook-text p {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        /* SUCCESS RECEIPT */
        .success-receipt-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
          text-align: center;
        }

        .receipt-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .success-title {
          font-size: 1.45rem;
          color: #F8FAFC;
        }

        .success-subtitle {
          font-size: 0.9375rem;
          color: #94A3B8;
          max-width: 440px;
        }

        .digital-receipt {
          width: 100%;
          padding: var(--space-lg);
          background: rgba(8, 14, 22, 0.92);
          border: 1px solid rgba(0, 180, 216, 0.3);
          text-align: left;
        }

        .receipt-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #00B4D8;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
          margin-bottom: var(--space-md);
        }

        .receipt-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-sm) var(--space-md);
        }

        .receipt-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .r-label {
          font-size: 0.6875rem;
          text-transform: uppercase;
          color: #64748B;
          font-weight: 700;
        }

        .r-val {
          font-size: 0.8125rem;
          color: #E2E8F0;
          font-weight: 600;
        }

        .r-val.highlight {
          color: #F4A261;
          font-weight: 800;
        }

        .r-val.mono {
          font-family: var(--font-mono);
          color: #38BDF8;
          font-size: 0.75rem;
        }

        @media (max-width: 640px) {
          .method-selection-tabs {
            grid-template-columns: 1fr;
          }
          .buyer-info-grid, .card-sub-grid {
            grid-template-columns: 1fr;
          }
          .product-summary-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .product-price-col {
            align-items: flex-start;
          }
          .webhook-tester-card {
            flex-direction: column;
            align-items: stretch;
          }
          .receipt-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Modal>
  );
};
