import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ExternalLink, X } from 'lucide-react';
import { Button } from '../common/Button';

interface LgpdConsentBannerProps {
  onOpenPrivacyModal: () => void;
}

const STORAGE_LGPD_KEY = 'jampa_lgpd_consent_v1';

export const LgpdConsentBanner: React.FC<LgpdConsentBannerProps> = ({
  onOpenPrivacyModal
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_LGPD_KEY);
      if (!consent) {
        // Exibir após 1.5s para não sobrecarregar o primeiro impacto visual
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_LGPD_KEY, JSON.stringify({
        acceptedAt: new Date().toISOString(),
        version: '1.0'
      }));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="lgpd-banner-wrapper" aria-label="Aviso de Privacidade e Cookies LGPD">
      <div className="lgpd-banner-card glass-panel">
        <div className="lgpd-icon-col">
          <div className="lgpd-shield-badge">
            <ShieldCheck size={20} color="#00B4D8" />
          </div>
        </div>

        <div className="lgpd-text-col">
          <div className="lgpd-title-row">
            <strong>Sua Privacidade & Proteção de Dados (LGPD)</strong>
          </div>
          <p className="lgpd-desc">
            Utilizamos cookies essenciais e geolocalização segura para calcular distâncias até as praias e personalizar sua experiência em João Pessoa. Seus dados nunca são comercializados.
          </p>
          <button
            type="button"
            className="lgpd-terms-link"
            onClick={onOpenPrivacyModal}
          >
            <span>Ler Política de Privacidade & Termos de Uso</span>
            <ExternalLink size={12} />
          </button>
        </div>

        <div className="lgpd-actions-col">
          <Button
            variant="gold"
            size="sm"
            onClick={handleAccept}
            className="lgpd-accept-btn"
          >
            Concordar e Continuar
          </Button>
        </div>
      </div>

      <style>{`
        .lgpd-banner-wrapper {
          position: fixed;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          max-width: 780px;
          margin: 0 auto;
          z-index: 995;
          animation: slideUpLgpd 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 768px) {
          .lgpd-banner-wrapper {
            bottom: calc(4.6rem + env(safe-area-inset-bottom, 12px)); /* Acima da barra de navegação inferior */
            left: 0.75rem;
            right: 0.75rem;
          }
        }

        @keyframes slideUpLgpd {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .lgpd-banner-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: 0.9rem 1.2rem;
          background: rgba(8, 15, 24, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-lg);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 180, 216, 0.15);
        }

        @media (max-width: 640px) {
          .lgpd-banner-card {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            padding: 0.9rem 1rem;
          }
        }

        .lgpd-icon-col {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .lgpd-icon-col {
            display: none;
          }
        }

        .lgpd-shield-badge {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lgpd-text-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: left;
        }

        .lgpd-title-row strong {
          font-size: 0.84375rem;
          color: #F8FAFC;
        }

        .lgpd-desc {
          font-size: 0.75rem;
          color: #94A3B8;
          line-height: 1.4;
        }

        .lgpd-terms-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: transparent;
          border: none;
          padding: 0;
          color: #38BDF8;
          font-size: 0.71875rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          width: fit-content;
        }

        .lgpd-terms-link:hover {
          color: #00B4D8;
        }

        .lgpd-actions-col {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .lgpd-accept-btn {
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .lgpd-accept-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </aside>
  );
};
