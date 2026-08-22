import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  DollarSign,
  Lock,
  Unlock,
  Navigation,
  CheckCircle2,
  ChevronRight,
  Info,
  ArrowRight,
  Compass,
  ShieldCheck
} from 'lucide-react';
import { Itinerary } from '../../types/itinerary';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface ItineraryDetailModalProps {
  itinerary: Itinerary | null;
  isOpen: boolean;
  isVipMode: boolean;
  onClose: () => void;
  onUnlockClick: () => void;
}

export const ItineraryDetailModal: React.FC<ItineraryDetailModalProps> = ({
  itinerary,
  isOpen,
  isVipMode,
  onClose,
  onUnlockClick
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (!itinerary) return null;

  const currentDay = itinerary.days && itinerary.days.length > 0
    ? itinerary.days[activeDayIndex] || itinerary.days[0]
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="860px"
      title={
        <div className="itin-modal-title">
          <Badge variant="gold" size="sm" icon={<Calendar size={13} />}>
            {itinerary.durationLabel}
          </Badge>
          <span className="itin-modal-title-text">{itinerary.title}</span>
        </div>
      }
    >
      <div className="itin-modal-content">
        {/* Banner do Roteiro */}
        <div className="itin-hero-card glass-panel">
          <img src={itinerary.featuredImage} alt={itinerary.title} className="itin-hero-img" />
          <div className="itin-hero-overlay" />

          <div className="itin-hero-info">
            <h3 className="itin-hero-title">{itinerary.title}</h3>
            <p className="itin-hero-slogan">"{itinerary.slogan}"</p>

            <div className="itin-tags-bar">
              <div className="itin-meta-pill">
                <Clock size={13} color="#00B4D8" />
                <span>Ritmo: <strong>{itinerary.pace}</strong></span>
              </div>
              <div className="itin-meta-pill">
                <DollarSign size={13} color="#2EC4B6" />
                <span>Custo médio: <strong>{itinerary.estimatedCost}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODO VISITANTE (ROTEIRO BLOQUEADO COM BENEFÍCIOS E CTA) */}
        {/* ======================================================== */}
        {!isVipMode ? (
          <div className="itin-locked-visitor-view glass-panel">
            <div className="lock-header-row">
              <div className="lock-icon-circle">
                <Sparkles size={24} color="#F4A261" />
              </div>
              <div>
                <Badge variant="gold" icon={<Lock size={13} />}>
                  Roteiro Completo Protegido
                </Badge>
                <h4 className="locked-itin-title">Cronograma Hora a Hora & Rotas Otimizadas</h4>
                <p className="locked-itin-desc">
                  Este roteiro contém a sequência perfeita de paradas, tábua de marés integrada, horários estratégicos sem trânsito e estimativas de custo detalhadas.
                </p>
              </div>
            </div>

            {/* Checklist de Vantagens */}
            <div className="unlocked-features-checklist">
              <div className="feature-check-item">
                <span className="check-bullet">🔒</span>
                <div>
                  <strong>Sequência Exata das Paradas:</strong>
                  <span>Descubra a ordem geográfica perfeita para economizar combustível e tempo.</span>
                </div>
              </div>

              <div className="feature-check-item">
                <span className="check-bullet">🔒</span>
                <div>
                  <strong>Horários Estratégicos & Maré:</strong>
                  <span>Saiba exatamente que horas chegar em cada praia e piscina natural para pegar água cristalina.</span>
                </div>
              </div>

              <div className="feature-check-item">
                <span className="check-bullet">🔒</span>
                <div>
                  <strong>Onde Almoçar & Lanchar:</strong>
                  <span>Recomendações dos nativos no trajeto com o melhor custo-benefício.</span>
                </div>
              </div>

              <div className="feature-check-item">
                <span className="check-bullet">🔒</span>
                <div>
                  <strong>Rotas no Waze e Google Maps:</strong>
                  <span>Links diretos para iniciar a navegação de cada parada com 1 toque.</span>
                </div>
              </div>
            </div>

            {/* CTA de Desbloqueio */}
            <div className="lock-modal-cta-box">
              <div className="price-tag-wrap">
                <span className="price-label">Desbloqueie os 8 Roteiros:</span>
                <div className="price-num">
                  <span className="cur">R$</span>
                  <span className="val">39,90</span>
                  <span className="once">acesso vitalício</span>
                </div>
              </div>

              <Button
                variant="gold"
                size="lg"
                iconLeft={<Sparkles size={18} />}
                iconRight={<ArrowRight size={18} />}
                onClick={onUnlockClick}
                className="modal-unlock-cta-btn"
              >
                DESBLOQUEAR TODOS OS 8 ROTEIROS
              </Button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* MODO VIP (CRONOGRAMA COMPLETO LIBERADO) */
          /* ======================================================== */
          <>
            {/* Descrição Geral & Destaques */}
            <div className="itin-summary-box">
              <p className="itin-desc-p">{itinerary.description}</p>
              <div className="itin-highlights-grid">
                {itinerary.highlights.map((hl, idx) => (
                  <div key={idx} className="itin-hl-chip">
                    <CheckCircle2 size={13} color="#00B4D8" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SELETOR DE DIAS (se houver mais de 1 dia) */}
            {itinerary.days && itinerary.days.length > 1 && (
              <div className="itin-days-tab-nav">
                {itinerary.days.map((day, idx) => (
                  <button
                    key={day.dayNumber}
                    className={`day-tab-btn ${activeDayIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveDayIndex(idx)}
                  >
                    <span>Dia {day.dayNumber}</span>
                  </button>
                ))}
              </div>
            )}

            {/* CRONOGRAMA DETALHADO DO DIA SELECIONADO */}
            {currentDay && (
              <div className="itin-day-section">
                <div className="day-heading-bar">
                  <div>
                    <h4 className="day-title">{currentDay.dayTitle}</h4>
                    <p className="day-summary-text">{currentDay.summary}</p>
                  </div>
                  <Badge variant="emerald" icon={<Unlock size={13} />}>
                    Acesso Completo
                  </Badge>
                </div>

                {/* TIMELINE DE PARADAS */}
                <div className="timeline-stops-container">
                  {currentDay.stops && currentDay.stops.length > 0 ? (
                    currentDay.stops.map((stop, sIdx) => {
                      const googleMapsRouteUrl = stop.coordinates
                        ? `https://www.google.com/maps/search/?api=1&query=${stop.coordinates.lat},${stop.coordinates.lng}`
                        : undefined;

                      return (
                        <div key={sIdx} className="timeline-stop-card glass-panel">
                          <div className="stop-left-col">
                            <div className="stop-time-tag">
                              <Clock size={12} />
                              <span>{stop.timeSlot}</span>
                            </div>
                            <img src={stop.image} alt={stop.title} className="stop-thumb-img" />
                          </div>

                          <div className="stop-details-col">
                            <div className="stop-loc-line">
                              <MapPin size={13} color="#00B4D8" />
                              <span>{stop.location}</span>
                              <span className="stop-cost-badge">{stop.costEst}</span>
                            </div>

                            <h5 className="stop-title-h5">{stop.title}</h5>
                            <p className="stop-desc-p">{stop.description}</p>

                            {stop.secretTip && (
                              <div className="stop-secret-tip-box">
                                <Sparkles size={13} color="#F4A261" />
                                <div>
                                  <strong>Segredo dos Nativos:</strong> {stop.secretTip}
                                </div>
                              </div>
                            )}

                            {googleMapsRouteUrl && (
                              <div className="stop-actions-row">
                                <a
                                  href={googleMapsRouteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="stop-route-link"
                                >
                                  <Navigation size={13} />
                                  <span>Traçar Rota no GPS</span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-stops-box glass-panel">
                      <p>Paradas em processo de sincronização.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .itin-modal-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .itin-modal-title-text {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .itin-modal-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .itin-hero-card {
          position: relative;
          width: 100%;
          min-height: 180px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #09111b;
          display: flex;
          align-items: flex-end;
          padding: var(--space-lg);
        }

        .itin-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .itin-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6, 11, 17, 0.3) 0%, rgba(6, 11, 17, 0.95) 100%);
        }

        .itin-hero-info {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .itin-hero-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .itin-hero-slogan {
          font-style: italic;
          font-size: 0.875rem;
          color: #F4A261;
        }

        .itin-tags-bar {
          display: flex;
          gap: 0.6rem;
          margin-top: 0.25rem;
          flex-wrap: wrap;
        }

        .itin-meta-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(6, 11, 17, 0.85);
          backdrop-filter: blur(8px);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: #CBD5E1;
        }

        /* ESTILO DO PAYWALL PARA VISITANTES */
        .itin-locked-visitor-view {
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(244, 162, 97, 0.3);
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .lock-header-row {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
        }

        .lock-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: rgba(244, 162, 97, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .locked-itin-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: #F8FAFC;
          margin-top: 0.35rem;
        }

        .locked-itin-desc {
          font-size: 0.875rem;
          color: #94A3B8;
          line-height: 1.45;
          margin-top: 0.2rem;
        }

        .unlocked-features-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: var(--space-md);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .feature-check-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.8125rem;
          line-height: 1.4;
        }

        .feature-check-item strong {
          color: #F8FAFC;
          display: block;
        }

        .feature-check-item span {
          color: #94A3B8;
        }

        .lock-modal-cta-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
        }

        .price-tag-wrap {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .price-num {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .price-num .cur {
          font-size: 0.875rem;
          color: #F4A261;
          font-weight: 700;
        }

        .price-num .val {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 900;
          color: #F8FAFC;
        }

        .price-num .once {
          font-size: 0.6875rem;
          color: #94A3B8;
        }

        .modal-unlock-cta-btn {
          box-shadow: 0 0 25px rgba(244, 162, 97, 0.35);
        }

        /* ESTILOS DA VERSÃO VIP */
        .itin-summary-box {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .itin-desc-p {
          font-size: 0.9375rem;
          color: #CBD5E1;
          line-height: 1.6;
        }

        .itin-highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.5rem;
        }

        .itin-hl-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          color: #E2E8F0;
        }

        .itin-days-tab-nav {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
          overflow-x: auto;
        }

        .day-tab-btn {
          padding: 0.5rem 1.25rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          color: #94A3B8;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .day-tab-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #F8FAFC;
        }

        .day-tab-btn.active {
          background: #00B4D8;
          border-color: #00B4D8;
          color: #060B11;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
        }

        .itin-day-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .day-heading-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .day-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .day-summary-text {
          font-size: 0.875rem;
          color: #94A3B8;
        }

        .timeline-stops-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .timeline-stop-card {
          display: flex;
          gap: var(--space-md);
          padding: var(--space-md);
          border-radius: var(--radius-lg);
          border-left: 3px solid #00B4D8;
        }

        .stop-left-col {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          width: 110px;
          flex-shrink: 0;
        }

        .stop-time-tag {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #00B4D8;
        }

        .stop-thumb-img {
          width: 100%;
          height: 75px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .stop-details-col {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex-grow: 1;
        }

        .stop-loc-line {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .stop-cost-badge {
          margin-left: auto;
          font-size: 0.75rem;
          font-weight: 700;
          color: #2EC4B6;
        }

        .stop-title-h5 {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .stop-desc-p {
          font-size: 0.875rem;
          color: #CBD5E1;
          line-height: 1.45;
        }

        .stop-secret-tip-box {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          padding: 0.4rem 0.65rem;
          background: rgba(244, 162, 97, 0.08);
          border-left: 2px solid #F4A261;
          border-radius: var(--radius-sm);
          font-size: 0.78125rem;
          color: #FDE68A;
          margin-top: 0.25rem;
        }

        .stop-actions-row {
          margin-top: 0.35rem;
        }

        .stop-route-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #00B4D8;
          transition: color var(--transition-fast);
        }

        .stop-route-link:hover {
          color: #38BDF8;
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .timeline-stop-card {
            flex-direction: column;
          }
          .stop-left-col {
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .stop-thumb-img {
            width: 80px;
            height: 50px;
          }
        }
      `}</style>
    </Modal>
  );
};
