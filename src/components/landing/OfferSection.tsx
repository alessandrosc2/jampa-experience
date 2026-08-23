import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Infinity,
  ShieldCheck,
  Zap,
  CreditCard,
  QrCode,
  Smartphone
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface OfferSectionProps {
  onOpenCheckout: () => void;
}

export const OfferSection: React.FC<OfferSectionProps> = ({ onOpenCheckout }) => {
  const perks = [
    'Praias paradisíacas e recifes com tábua de maré',
    'Restaurantes e bares rigorosamente selecionados',
    'Roteiros prontos para 1, 3 e 5 dias em Jampa',
    'Integração direta com Waze, Google Maps e Apple Maps',
    'Dicas secretas de horários, estacionamento e economia',
    'Galerias completas de fotos em alta resolução',
    'Sistema de favoritos para montar seu roteiro',
    'Todas as futuras atualizações e novos locais inclusos',
    'Acesso vitalício sem nenhuma assinatura ou mensalidade'
  ];

  return (
    <section className="offer-section" id="oferta">
      <div className="container">
        <div className="offer-main-card glass-panel">
          <div className="offer-glow-circle top-right" />
          <div className="offer-glow-circle bottom-left" />

          <div className="offer-grid">
            {/* Coluna Esquerda: Proposta de Valor e Checklist */}
            <div className="offer-left-col">
              <Badge variant="gold" icon={<Sparkles size={14} />}>
                OFERTA DE ACESSO VITALÍCIO
              </Badge>

              <h2 className="offer-heading">
                Pague uma única vez. <br />
                <span className="text-gradient-gold">Aproveite Jampa para sempre.</span>
              </h2>

              <p className="offer-desc">
                Tenha nas suas mãos o guia turístico definitivo de João Pessoa. Ideal para planejar sua viagem antes de sair de casa e consultar na praia em tempo real.
              </p>

              <div className="offer-perks-list">
                {perks.map((perk, idx) => (
                  <div key={idx} className="offer-perk-row">
                    <CheckCircle2 size={18} className="perk-check-icon" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna Direita: Box de Preço e Conversão */}
            <div className="offer-right-box glass-panel">
              <div className="pricing-header">
                <span className="pricing-tag">PLANO COMPLETO VITALÍCIO</span>
                <div className="price-strike-row">
                  <span className="price-old">De R$ 89,90</span>
                  <span className="discount-pill">55% OFF</span>
                </div>
                <div className="price-big-row">
                  <span className="price-currency">R$</span>
                  <span className="price-big-number">39,90</span>
                </div>
                <span className="price-conditions">
                  Pagamento único • Sem mensalidade • Acesso para sempre
                </span>
              </div>

              <div className="pricing-actions">
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  iconLeft={<Sparkles size={20} />}
                  onClick={onOpenCheckout}
                  className="buy-lifetime-btn"
                >
                  QUERO ACESSO VITALÍCIO
                </Button>

                <div className="payment-methods-accepted">
                  <div className="pay-method-tag">
                    <QrCode size={14} color="#00B4D8" />
                    <span>PIX Instantâneo</span>
                  </div>
                  <div className="pay-method-tag">
                    <CreditCard size={14} color="#F4A261" />
                    <span>Cartão de Crédito</span>
                  </div>
                </div>
              </div>

              <div className="guarantee-box">
                <ShieldCheck size={20} className="guarantee-icon" />
                <div className="guarantee-text">
                  <strong>Garantia Incondicional de 7 Dias</strong>
                  <p>Se não amar o conteúdo, devolvemos 100% do seu dinheiro sem burocracia.</p>
                </div>
              </div>

              <div className="device-access-note">
                <Smartphone size={15} /> Acesso no Celular, Tablet e Computador
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .offer-section {
          padding: var(--space-4xl) 0;
          position: relative;
        }

        .offer-main-card {
          position: relative;
          background: linear-gradient(135deg, rgba(14, 23, 36, 0.95) 0%, rgba(6, 11, 17, 0.98) 100%);
          border: 1px solid rgba(244, 162, 97, 0.35);
          border-radius: var(--radius-xl);
          padding: var(--space-3xl);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 50px rgba(244, 162, 97, 0.12);
        }

        .offer-glow-circle {
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .top-right {
          top: -100px;
          right: -100px;
          background: rgba(244, 162, 97, 0.15);
        }

        .bottom-left {
          bottom: -100px;
          left: -100px;
          background: rgba(0, 180, 216, 0.15);
        }

        .offer-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.2fr 0.9fr;
          gap: var(--space-3xl);
          align-items: center;
        }

        .offer-left-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-md);
        }

        .offer-heading {
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.15;
          color: #F8FAFC;
        }

        .text-gradient-gold {
          background: linear-gradient(135deg, #FDBA74 0%, #F59E0B 40%, #EA580C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 10px rgba(234, 88, 12, 0.3));
        }

        .offer-desc {
          font-size: 1.05rem;
          color: #CBD5E1;
          line-height: 1.6;
        }

        .offer-perks-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: var(--space-xs);
        }

        .offer-perk-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.9375rem;
          color: #E2E8F0;
        }

        .perk-check-icon {
          color: #00B4D8;
          flex-shrink: 0;
        }

        .offer-right-box {
          background: linear-gradient(145deg, rgba(16, 28, 44, 0.95) 0%, rgba(9, 15, 24, 0.98) 100%);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: var(--radius-lg);
          padding: var(--space-2xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          text-align: center;
          box-shadow: 0 16px 45px -5px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(245, 158, 11, 0.15);
        }

        .pricing-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .pricing-tag {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #F4A261;
          text-transform: uppercase;
        }

        .price-strike-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .price-old {
          font-size: 1rem;
          color: #64748B;
          text-decoration: line-through;
        }

        .discount-pill {
          font-size: 0.6875rem;
          font-weight: 800;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #F87171;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
        }

        .price-big-row {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.35rem;
        }

        .price-currency {
          font-size: 1.5rem;
          font-weight: 700;
          color: #F4A261;
        }

        .price-big-number {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 900;
          color: #F8FAFC;
          line-height: 1;
        }

        .price-conditions {
          font-size: 0.8125rem;
          color: #94A3B8;
          font-weight: 500;
        }

        .pricing-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .buy-lifetime-btn {
          box-shadow: 0 8px 30px rgba(244, 162, 97, 0.45);
        }

        .payment-methods-accepted {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
        }

        .pay-method-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #CBD5E1;
        }

        .guarantee-box {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: var(--space-md);
          background: rgba(0, 180, 216, 0.06);
          border: 1px solid rgba(0, 180, 216, 0.2);
          border-radius: var(--radius-md);
          text-align: left;
        }

        .guarantee-icon {
          color: #00B4D8;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .guarantee-text strong {
          display: block;
          font-size: 0.8125rem;
          color: #F8FAFC;
        }

        .guarantee-text p {
          font-size: 0.75rem;
          color: #94A3B8;
          line-height: 1.4;
          margin-top: 2px;
        }

        .device-access-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #64748B;
        }

        @media (max-width: 900px) {
          .offer-grid {
            grid-template-columns: 1fr;
          }
          .offer-main-card {
            padding: var(--space-lg);
          }
        }
      `}</style>
    </section>
  );
};
