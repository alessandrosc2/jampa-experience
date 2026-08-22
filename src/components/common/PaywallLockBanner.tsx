import React from 'react';
import { Lock, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface PaywallLockBannerProps {
  onUnlockClick?: () => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const PaywallLockBanner: React.FC<PaywallLockBannerProps> = ({
  onUnlockClick,
  title = 'Conteúdo Premium Protegido',
  subtitle = 'Desbloqueie o acesso vitalício para visualizar dicas secretas de nativos, horários sem fila, coordenadas diretas para Waze/Maps e roteiros completos.',
  compact = false
}) => {
  return (
    <div className={`paywall-banner ${compact ? 'paywall-compact' : ''}`}>
      <div className="paywall-glow" />
      
      <div className="paywall-content">
        <div className="paywall-header">
          <div className="lock-icon-badge">
            <Lock size={22} className="lock-svg" />
          </div>
          <div>
            <h4 className="paywall-title">{title}</h4>
            <p className="paywall-sub">{subtitle}</p>
          </div>
        </div>

        {!compact && (
          <div className="paywall-perks">
            <span className="perk-item">
              <CheckCircle2 size={14} className="perk-icon" /> Dicas secretas & horários ideais
            </span>
            <span className="perk-item">
              <CheckCircle2 size={14} className="perk-icon" /> Waze, Google & Apple Maps
            </span>
            <span className="perk-item">
              <CheckCircle2 size={14} className="perk-icon" /> Roteiros prontos para 1, 3 e 5 dias
            </span>
            <span className="perk-item">
              <CheckCircle2 size={14} className="perk-icon" /> Acesso vitalício sem mensalidades
            </span>
          </div>
        )}

        <div className="paywall-footer">
          <div className="price-tag">
            <span className="price-label">Pagamento Único</span>
            <div className="price-val">
              <span className="currency">R$</span>
              <span className="amount">39,90</span>
              <span className="period">/ vitalício</span>
            </div>
          </div>

          <Button
            variant="gold"
            size={compact ? 'md' : 'lg'}
            iconLeft={<Sparkles size={18} />}
            onClick={onUnlockClick}
          >
            DESBLOQUEAR ACESSO VITALÍCIO
          </Button>
        </div>

        <div className="paywall-trust-note">
          <ShieldCheck size={14} /> Pagamento 100% seguro via PIX e Cartão • Liberação imediata
        </div>
      </div>

      <style>{`
        .paywall-banner {
          position: relative;
          background: linear-gradient(135deg, rgba(16, 26, 40, 0.95) 0%, rgba(8, 14, 23, 0.98) 100%);
          border: 1px solid rgba(244, 162, 97, 0.35);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 30px rgba(244, 162, 97, 0.15);
        }

        .paywall-compact {
          padding: var(--space-md) var(--space-lg);
        }

        .paywall-glow {
          position: absolute;
          top: -30%;
          right: -20%;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(244, 162, 97, 0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .paywall-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .paywall-header {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
        }

        .lock-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: rgba(244, 162, 97, 0.15);
          border: 1px solid rgba(244, 162, 97, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F4A261;
          flex-shrink: 0;
        }

        .paywall-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          color: #F8FAFC;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .paywall-sub {
          font-size: 0.875rem;
          color: #94A3B8;
          line-height: 1.45;
        }

        .paywall-perks {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-xs) var(--space-md);
          padding: var(--space-sm) 0;
          border-top: 1px dashed var(--border-subtle);
          border-bottom: 1px dashed var(--border-subtle);
        }

        .perk-item {
          font-size: 0.8125rem;
          color: #E2E8F0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .perk-icon {
          color: #00B4D8;
          flex-shrink: 0;
        }

        .paywall-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          flex-wrap: wrap;
          margin-top: 0.25rem;
        }

        .price-tag {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94A3B8;
          font-weight: 600;
        }

        .price-val {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .currency {
          font-size: 0.95rem;
          font-weight: 700;
          color: #F4A261;
        }

        .amount {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1;
        }

        .period {
          font-size: 0.8125rem;
          color: #94A3B8;
        }

        .paywall-trust-note {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #64748B;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .paywall-footer {
            flex-direction: column;
            align-items: stretch;
          }
          .price-tag {
            text-align: center;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};
