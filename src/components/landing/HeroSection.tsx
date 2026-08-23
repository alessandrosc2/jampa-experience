import React from 'react';
import { Sparkles, Compass, MapPin, ShieldCheck, ArrowRight, Sun, Flame, Crown, CheckCircle2, Navigation } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { HeroCanvas3D } from '../3d/HeroCanvas3D';

interface HeroSectionProps {
  isVipMode?: boolean;
  userName?: string;
  onOpenCheckout: () => void;
  onExploreClick: () => void;
  onSelectLandmark?: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isVipMode = false,
  userName,
  onOpenCheckout,
  onExploreClick,
  onSelectLandmark
}) => {
  const scrollToMap = () => {
    const element = document.getElementById('mapa');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      {/* 3D WebGL Three.js Canvas de Fundo */}
      <HeroCanvas3D onSelectPin={onSelectLandmark} />

      {/* Gradiente de Fusão para Conteúdo */}
      <div className="hero-vignette" />

      {/* Conteúdo Principal */}
      <div className="container hero-container">
        <div className="hero-content">
          {/* Pill Badge Superior */}
          <div className="hero-badge-wrap">
            {isVipMode ? (
              <Badge variant="emerald" icon={<Crown size={14} />}>
                ÁREA DE MEMBROS • ACESSO VITALÍCIO ATIVO
              </Badge>
            ) : (
              <Badge variant="gold" icon={<Flame size={14} />}>
                <span className="badge-text-desktop">GUIA TURÍSTICO DIGITAL PREMIUM • JOÃO PESSOA - PB</span>
                <span className="badge-text-mobile">GUIA TURÍSTICO PREMIUM • JOÃO PESSOA</span>
              </Badge>
            )}
          </div>

          {/* Slogan & Headline Cinematográfica */}
          <h1 className="hero-headline">
            {isVipMode ? (
              <>
                Seu Guia Definitivo de Jampa <br />
                <span className="hero-headline-gradient">100% Liberado para Você.</span>
              </>
            ) : (
              <>
                Descubra João Pessoa <br />
                <span className="hero-headline-gradient">como um verdadeiro local.</span>
              </>
            )}
          </h1>

          <p className="hero-subheadline">
            {isVipMode ? (
              <>
                {userName ? `Olá, ${userName.split(' ')[0]}! ` : ''}
                Explore todas as praias, restaurantes premiados, falésias, tábua de marés e os 8 roteiros prontos com rotas diretas no GPS.
              </>
            ) : (
              <>
                Um guia turístico digital completo, interativo e exclusivo para você extrair o melhor que Jampa tem a oferecer. 
                Praias secretas, restaurantes premiados, falésias, tábua de marés e roteiros inteligentes.
              </>
            )}
          </p>

          {/* ======================================================== */}
          {/* MODO VISITANTE: DESTAQUE DE OFERTA COMERCIAL R$ 39,90 */}
          {/* ======================================================== */}
          {!isVipMode ? (
            <>
              <div className="hero-offer-highlight glass-panel">
                <div className="offer-tag-col">
                  <span className="offer-badge-label">Oferta de Lançamento</span>
                  <div className="offer-price-row">
                    <span className="offer-curr">R$</span>
                    <span className="offer-num">39,90</span>
                    <span className="offer-type">Pagamento Único • Acesso Vitalício</span>
                  </div>
                </div>
                <div className="offer-separator" />
                <div className="offer-perk-summary">
                  <span className="perk-bullet">✓ Sem mensalidades</span>
                  <span className="perk-bullet">✓ Atualizações inclusas</span>
                  <span className="perk-bullet">✓ Liberação imediata</span>
                </div>
              </div>

              {/* CTAs de Conversão */}
              <div className="hero-cta-group">
                <Button
                  variant="gold"
                  size="lg"
                  iconLeft={<Sparkles size={20} />}
                  onClick={onOpenCheckout}
                  className="hero-main-cta"
                >
                  QUERO ACESSO VITALÍCIO — R$ 39,90
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  iconRight={<ArrowRight size={18} />}
                  onClick={onExploreClick}
                >
                  Ver Prévia dos Locais
                </Button>
              </div>

              {/* Selos de Confiança */}
              <div className="hero-trust-bar">
                <div className="trust-item">
                  <ShieldCheck size={16} className="trust-icon" />
                  <span>Pagamento 100% Seguro via PIX & Cartão</span>
                </div>
                <div className="trust-item hint-3d">
                  <Compass size={16} className="trust-icon" />
                  <span>Interaja com o cenário 3D acima para explorar os pontos de Jampa</span>
                </div>
              </div>
            </>
          ) : (
            /* ======================================================== */
            /* MODO MEMBRO VIP PAGO: HUB DE NAVEGAÇÃO RÁPIDA (SEM OFERTAS) */
            /* ======================================================== */
            <>
              <div className="vip-member-hub-bar glass-panel">
                <div className="vip-hub-item">
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>35+ Locais & Dicas Desbloqueados</span>
                </div>
                <div className="vip-hub-divider" />
                <div className="vip-hub-item">
                  <Compass size={16} color="#00B4D8" />
                  <span>8 Roteiros com Horários e GPS</span>
                </div>
                <div className="vip-hub-divider" />
                <div className="vip-hub-item">
                  <Crown size={16} color="#F4A261" />
                  <span>Licença Vitalícia sem Mensalidades</span>
                </div>
              </div>

              <div className="hero-cta-group">
                <Button
                  variant="primary"
                  size="lg"
                  iconLeft={<Compass size={20} />}
                  onClick={onExploreClick}
                  className="hero-main-cta"
                >
                  EXPLORAR TODOS OS LOCAIS
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  iconLeft={<Navigation size={18} />}
                  onClick={scrollToMap}
                >
                  Abrir Mapa Interativo GPS
                </Button>
              </div>

              <div className="hero-trust-bar">
                <div className="trust-item vip-active-note">
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Você tem acesso garantido a todas as futuras atualizações de praias e restaurantes.</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: calc(var(--header-height) + var(--space-2xl)) 0 var(--space-3xl);
          overflow: hidden;
          background: #060B11;
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 50% 30%, transparent 20%, #060B11 85%),
            linear-gradient(180deg, rgba(6, 11, 17, 0.4) 0%, #060B11 100%);
          pointer-events: none;
          z-index: 1;
        }

        .hero-container {
          position: relative;
          z-index: 2;
        }

        .hero-content {
          max-width: 720px;
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .hero-badge-wrap {
          display: flex;
        }

        .hero-headline {
          font-family: var(--font-display);
          font-size: clamp(2.35rem, 5.5vw, 3.85rem);
          font-weight: 850;
          color: #F8FAFC;
          line-height: 1.12;
          letter-spacing: -0.03em;
          text-wrap: balance;
        }

        .hero-headline-gradient {
          background: linear-gradient(135deg, #38BDF8 0%, #00B4D8 35%, #FDBA74 80%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 12px rgba(0, 180, 216, 0.25));
        }

        .hero-subheadline {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: #CBD5E1;
          line-height: 1.6;
          max-width: 620px;
        }

        .hero-offer-highlight {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          padding: 0.9rem 1.4rem;
          background: linear-gradient(145deg, rgba(14, 25, 40, 0.85) 0%, rgba(8, 14, 23, 0.92) 100%);
          border: 1px solid rgba(244, 162, 97, 0.35);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 20px rgba(244, 162, 97, 0.12);
          width: fit-content;
          transition: transform var(--transition-normal), border-color var(--transition-normal);
        }

        .hero-offer-highlight:hover {
          border-color: rgba(244, 162, 97, 0.6);
          transform: translateY(-2px);
        }

        .offer-tag-col {
          display: flex;
          flex-direction: column;
        }

        .offer-badge-label {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #F4A261;
        }

        .offer-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.3rem;
        }

        .offer-curr {
          font-size: 1rem;
          font-weight: 700;
          color: #F4A261;
        }

        .offer-num {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          color: #F8FAFC;
          line-height: 1;
        }

        .offer-type {
          font-size: 0.75rem;
          color: #94A3B8;
          margin-left: 0.4rem;
        }

        .offer-separator {
          width: 1px;
          height: 40px;
          background: var(--border-subtle);
        }

        .offer-perk-summary {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: #E2E8F0;
        }

        .perk-bullet {
          color: #10B981;
          font-weight: 600;
        }

        /* VIP MEMBER HUB BAR */
        .vip-member-hub-bar {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          background: rgba(12, 20, 31, 0.85);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(12px);
          width: fit-content;
          flex-wrap: wrap;
        }

        .vip-hub-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: #E2E8F0;
          font-weight: 600;
        }

        .vip-hub-divider {
          width: 1px;
          height: 20px;
          background: var(--border-subtle);
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .hero-main-cta {
          box-shadow: 0 0 30px rgba(244, 162, 97, 0.35);
        }

        .hero-trust-bar {
          display: flex;
          align-items: center;
          gap: var(--space-xl);
          padding-top: var(--space-xs);
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8125rem;
          color: #94A3B8;
        }

        .trust-icon {
          color: #00B4D8;
          flex-shrink: 0;
        }

        .hint-3d {
          color: #CBD5E1;
        }

        .badge-text-desktop {
          display: inline;
        }

        .badge-text-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding-top: calc(var(--header-height) + 1.75rem);
            padding-bottom: 2.5rem;
            min-height: auto;
          }
          .hero-content {
            gap: 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .hero-offer-highlight {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-sm);
          }
          .offer-separator {
            display: none;
          }
          .vip-member-hub-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .vip-hub-divider {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding-top: calc(var(--header-height) + 1.25rem);
          }
          .badge-text-desktop {
            display: none;
          }
          .badge-text-mobile {
            display: inline;
          }
        }
      `}</style>
    </section>
  );
};
