import React from 'react';
import { Calendar, Clock, DollarSign, Sparkles, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Itinerary } from '../../types/itinerary';
import { Badge } from '../common/Badge';

interface ItineraryCardProps {
  itinerary: Itinerary;
  isVipMode: boolean;
  onSelect: (itinerary: Itinerary) => void;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({
  itinerary,
  isVipMode,
  onSelect
}) => {
  return (
    <div className="itinerary-card glass-panel" onClick={() => onSelect(itinerary)}>
      {/* Imagem de Capa com Destaque */}
      <div className="itinerary-img-wrap">
        <img src={itinerary.featuredImage} alt={itinerary.title} className="itinerary-img" />
        <div className="itinerary-img-overlay" />

        <div className="itinerary-top-badges">
          <Badge variant="gold" size="sm" icon={<Calendar size={12} />}>
            {itinerary.durationLabel}
          </Badge>
          <div className="pace-badge">
            Ritmo {itinerary.pace}
          </div>
        </div>

        <div className="itinerary-cost-tag glass-panel">
          <DollarSign size={13} color="#2EC4B6" />
          <span>{itinerary.estimatedCost}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="itinerary-body">
        <h3 className="itinerary-title">{itinerary.title}</h3>
        <p className="itinerary-slogan">{itinerary.slogan}</p>

        {/* Lista de Destaques */}
        <div className="itinerary-highlights-list">
          {itinerary.highlights.slice(0, 3).map((hl, idx) => (
            <div key={idx} className="highlight-item">
              <CheckCircle2 size={13} className="hl-check" />
              <span>{hl}</span>
            </div>
          ))}
        </div>

        {/* Footer do Card */}
        <div className="itinerary-footer">
          <div className="itinerary-lock-info">
            {isVipMode ? (
              <span className="unlocked-text">
                <Sparkles size={13} color="#10B981" /> Roteiro Completo Liberado
              </span>
            ) : (
              <span className="locked-text">
                <Lock size={13} /> Dicas & Horários Protegidos
              </span>
            )}
          </div>

          <button className="itinerary-action-btn" aria-label={`Ver roteiro ${itinerary.title}`}>
            <span>Ver Roteiro</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .itinerary-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: rgba(12, 20, 31, 0.85);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .itinerary-card:hover {
          transform: translateY(-6px);
          border-color: rgba(244, 162, 97, 0.5);
          box-shadow: 0 16px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(244, 162, 97, 0.15);
        }

        .itinerary-img-wrap {
          position: relative;
          width: 100%;
          height: 190px;
          overflow: hidden;
          background: #09111b;
        }

        .itinerary-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .itinerary-card:hover .itinerary-img {
          transform: scale(1.06);
        }

        .itinerary-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6, 11, 17, 0.2) 0%, rgba(6, 11, 17, 0.85) 100%);
        }

        .itinerary-top-badges {
          position: absolute;
          top: var(--space-sm);
          left: var(--space-sm);
          right: var(--space-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .pace-badge {
          padding: 0.2rem 0.55rem;
          background: rgba(6, 11, 17, 0.8);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #94A3B8;
        }

        .itinerary-cost-tag {
          position: absolute;
          bottom: var(--space-sm);
          left: var(--space-sm);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          color: #F8FAFC;
          background: rgba(6, 11, 17, 0.85);
          z-index: 2;
        }

        .itinerary-body {
          padding: var(--space-md) var(--space-lg) var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          flex-grow: 1;
        }

        .itinerary-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #F8FAFC;
          line-height: 1.25;
        }

        .itinerary-slogan {
          font-size: 0.8125rem;
          color: #94A3B8;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .itinerary-highlights-list {
          margin: var(--space-xs) 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.78125rem;
          color: #CBD5E1;
          line-height: 1.3;
        }

        .hl-check {
          color: #00B4D8;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .itinerary-footer {
          margin-top: auto;
          padding-top: var(--space-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-subtle);
        }

        .unlocked-text {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #10B981;
        }

        .locked-text {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #F87171;
        }

        .itinerary-action-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.8rem;
          background: rgba(244, 162, 97, 0.15);
          border: 1px solid rgba(244, 162, 97, 0.4);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          color: #F4A261;
          transition: all var(--transition-fast);
        }

        .itinerary-card:hover .itinerary-action-btn {
          background: #F4A261;
          color: #060B11;
        }
      `}</style>
    </div>
  );
};
