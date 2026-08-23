import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { generateBacenPixPayload, STRIPE_CHECKOUT_URL } from '../../utils/pixUtils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [method, setMethod] = useState<'pix' | 'card'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: 'Alessandro Silva',
    email: 'alessandro@exemplo.com.br',
    cardNumber: '•••• •••• •••• 4829',
    cardExpiry: '08/29',
    cardCvc: '•••'
  });

  const pixData = generateBacenPixPayload({ amount: 39.90 });

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixData.payload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 1200);
  };

  const handleFinishAndEnter = () => {
    onPaymentSuccess();
    onClose();
    setStep('form');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="620px"
      title={
        <div className="checkout-modal-title">
          <ShieldCheck size={20} color="#00B4D8" />
          <span>Checkout Seguro — JAMPA EXPERIENCE</span>
        </div>
      }
    >
      <div className="checkout-content">
        {step === 'form' ? (
          <>
            {/* Resumo do Pedido */}
            <div className="order-summary-box glass-panel">
              <div className="order-item-left">
                <span className="order-plan-name">Acesso Vitalício Completo</span>
                <span className="order-plan-sub">Guia Premium + Mapas + Roteiros + Dicas</span>
              </div>
              <div className="order-item-right">
                <span className="order-single-label">Pague 1x</span>
                <span className="order-price-val">R$ 39,90</span>
              </div>
            </div>

            {/* Seletor de Método de Pagamento */}
            <div className="payment-tabs-row">
              <button
                className={`pay-tab-btn ${method === 'pix' ? 'active' : ''}`}
                onClick={() => setMethod('pix')}
              >
                <QrCode size={18} />
                <span>PIX Instantâneo</span>
                <span className="instant-badge">Mais Rápido</span>
              </button>

              <button
                className={`pay-tab-btn ${method === 'card' ? 'active' : ''}`}
                onClick={() => setMethod('card')}
              >
                <CreditCard size={18} />
                <span>Cartão de Crédito (Stripe)</span>
              </button>
            </div>

            {/* Painel do Método Selecionado */}
            {method === 'pix' ? (
              <div className="pix-checkout-box glass-panel">
                <div className="pix-qr-wrap">
                  {/* QR Code Real em Imagem de Alta Resolução */}
                  <img
                    src={pixData.qrCodeUrl}
                    alt="QR Code PIX Oficial"
                    className="pix-real-img"
                    width="150"
                    height="150"
                  />
                  <div className="pix-beneficiary-mini">
                    <span>Titular: <strong>Alessandro Dos Santos Cordeiro</strong></span>
                    <span>Chave: <strong className="mono">05d68d46-c90a-4b73-b2f3-fe86d2f34124</strong></span>
                  </div>
                  <span className="qr-instruction">Abra o app do seu banco e escaneie o QR Code</span>
                </div>

                <div className="pix-copy-paste-block">
                  <span className="pix-copy-label">Ou copie o código PIX Copia e Cola:</span>
                  <div className="copy-input-row">
                    <input
                      type="text"
                      readOnly
                      value={pixData.payload}
                      className="pix-code-field"
                    />
                    <button className="copy-code-btn" onClick={handleCopyPix}>
                      {copiedPix ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                <div className="simulate-payment-action">
                  <Button
                    variant="gold"
                    size="lg"
                    fullWidth
                    isLoading={isProcessing}
                    onClick={handleSimulatePayment}
                    iconLeft={<Sparkles size={18} />}
                  >
                    JÁ REALIZEI O PIX (LIBERAR ACESSO)
                  </Button>
                </div>
              </div>
            ) : (
              <div className="card-checkout-box glass-panel">
                {/* Banner Stripe Checkout */}
                <div className="stripe-quick-box">
                  <strong>Checkout Oficial Stripe</strong>
                  <p>Aceita cartões nacionais e internacionais (Visa, Master, Elo, Hiper, Amex, Apple Pay e Google Pay) em até 6x.</p>
                  <a
                    href={STRIPE_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stripe-quick-btn"
                  >
                    <Lock size={16} />
                    <span>Pagar no Stripe (Até 6x de R$ 7,15)</span>
                    <ExternalLink size={16} />
                  </a>
                </div>

                <div className="form-group">
                  <label className="form-label">Nome Completo do Titular</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">E-mail para Acesso</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Número do Cartão</label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Validade (MM/AA)</label>
                    <input
                      type="text"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVC / CVV</label>
                    <input
                      type="text"
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  isLoading={isProcessing}
                  onClick={handleSimulatePayment}
                  iconLeft={<Lock size={18} />}
                >
                  PAGAR R$ 39,90 COM CARTÃO
                </Button>
              </div>
            )}

            <div className="checkout-security-footer">
              <ShieldCheck size={16} color="#10B981" />
              <span>Ambiente criptografado SSL 256-bit • Dados 100% protegidos</span>
            </div>
          </>
        ) : (
          /* ESTADO PÓS-PAGAMENTO CONFIRMADO */
          <div className="payment-success-box">
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} color="#10B981" />
            </div>

            <h3 className="success-heading">🎉 Pagamento Confirmado com Sucesso!</h3>
            <p className="success-sub">
              Parabéns! Seu acesso vitalício ao <strong>JAMPA EXPERIENCE</strong> foi liberado imediatamente.
            </p>

            <div className="success-order-card glass-panel">
              <div className="success-row">
                <span className="s-label">Status do Acesso:</span>
                <Badge variant="emerald" icon={<Infinity size={13} />}>
                  Acesso Vitalício Ativo
                </Badge>
              </div>
              <div className="success-row">
                <span className="s-label">Valor Pago:</span>
                <span className="s-val">R$ 39,90 (Pagamento Único)</span>
              </div>
              <div className="success-row">
                <span className="s-label">Email de Acesso:</span>
                <span className="s-val">{formData.email}</span>
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              fullWidth
              iconRight={<ArrowRight size={18} />}
              onClick={handleFinishAndEnter}
            >
              ENTRAR NO JAMPA EXPERIENCE VIP
            </Button>
          </div>
        )}
      </div>

      <style>{`
        .checkout-modal-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .checkout-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .order-summary-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md) var(--space-lg);
          background: rgba(12, 20, 31, 0.95);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-md);
        }

        .order-item-left {
          display: flex;
          flex-direction: column;
        }

        .order-plan-name {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .order-plan-sub {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .order-item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .order-single-label {
          font-size: 0.6875rem;
          text-transform: uppercase;
          color: #F4A261;
          font-weight: 700;
        }

        .order-price-val {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .payment-tabs-row {
          display: flex;
          gap: var(--space-sm);
        }

        .pay-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #94A3B8;
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .pay-tab-btn.active {
          background: rgba(0, 180, 216, 0.15);
          border-color: #00B4D8;
          color: #F8FAFC;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.2);
        }

        .instant-badge {
          font-size: 0.625rem;
          background: #10B981;
          color: #060B11;
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-full);
          font-weight: 800;
        }

        .pix-checkout-box, .card-checkout-box {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          background: rgba(8, 14, 22, 0.9);
        }

        .pix-qr-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .simulated-qr {
          padding: 0.75rem;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .qr-instruction {
          font-size: 0.8125rem;
          color: #94A3B8;
        }

        .pix-copy-paste-block {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .pix-copy-label {
          font-size: 0.75rem;
          color: #94A3B8;
          font-weight: 600;
        }

        .copy-input-row {
          display: flex;
          gap: 0.5rem;
        }

        .pix-code-field {
          flex: 1;
          padding: 0.6rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #CBD5E1;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          outline: none;
        }

        .stripe-quick-box {
          padding: 1rem;
          background: linear-gradient(135deg, rgba(99, 91, 255, 0.15), rgba(0, 180, 216, 0.1));
          border: 1px solid rgba(99, 91, 255, 0.35);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
          text-align: left;
        }

        .stripe-quick-box strong {
          color: #F8FAFC;
          font-size: 0.875rem;
        }

        .stripe-quick-box p {
          color: #CBD5E1;
          font-size: 0.75rem;
        }

        .stripe-quick-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.65rem 1rem;
          background: #635BFF;
          color: #FFFFFF;
          font-size: 0.8125rem;
          font-weight: 800;
          border-radius: var(--radius-md);
          text-decoration: none;
          margin-top: 0.3rem;
        }

        .stripe-quick-btn:hover {
          background: #5046E5;
        }

        .pix-real-img {
          border-radius: 6px;
          display: block;
          background: #FFFFFF;
          padding: 4px;
        }

        .pix-beneficiary-mini {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: #94A3B8;
          text-align: center;
        }

        .pix-beneficiary-mini strong {
          color: #F8FAFC;
        }

        .pix-beneficiary-mini .mono {
          font-family: var(--font-mono);
          color: #38BDF8;
        }

        .copy-code-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.6rem 1rem;
          background: rgba(0, 180, 216, 0.2);
          border: 1px solid #00B4D8;
          border-radius: var(--radius-md);
          color: #38BDF8;
          font-weight: 700;
          font-size: 0.8125rem;
          cursor: pointer;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          text-align: left;
        }

        .form-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .form-input {
          padding: 0.7rem 1rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #F8FAFC;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .form-input:focus {
          border-color: #00B4D8;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.25);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .checkout-security-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #64748B;
        }

        .payment-success-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-lg);
          padding: var(--space-lg) 0;
        }

        .success-icon-wrap {
          animation: pulseGlow 2s infinite ease;
        }

        .success-heading {
          font-size: 1.5rem;
          color: #F8FAFC;
        }

        .success-sub {
          font-size: 0.9375rem;
          color: #94A3B8;
          max-width: 440px;
        }

        .success-order-card {
          width: 100%;
          padding: var(--space-md) var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: rgba(12, 20, 31, 0.9);
          text-align: left;
        }

        .success-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .s-label {
          color: #94A3B8;
        }

        .s-val {
          font-weight: 700;
          color: #F8FAFC;
        }
      `}</style>
    </Modal>
  );
};
